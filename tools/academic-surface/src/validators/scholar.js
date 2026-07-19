// ASV-SCH-* Google Scholar metadata rules. Apply only to public textual Works.

import { diag } from '../diagnostics.js';
import { isTextual, currentVersion, scholarDate } from '../lib/canonical.js';

export function validateScholar(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  // Scholar obligations apply to published, public, textual Works — not to drafts
  // or withdrawn tombstones (whose PDFs may no longer be served).
  if (!(isTextual(work.type) && work.visibility === 'public' && work.status === 'published')) return out;

  const sc = work.scholar ?? {};
  const cur = currentVersion(work);
  const has = (k) => sc[k] !== undefined && sc[k] !== null && sc[k] !== '';

  // ASV-SCH-001 — citation_title present and equal to title
  if (!has('citation_title')) out.push(diag('ASV-SCH-001', { path: `${p}.scholar.citation_title`, message: 'citation_title missing', remediation: 'Emit citation_title equal to the canonical title' }));
  else if (sc.citation_title !== work.title) out.push(diag('ASV-SCH-001', { path: `${p}.scholar.citation_title`, message: 'citation_title differs from title', remediation: 'citation_title must equal the canonical title', evidence: sc.citation_title }));

  // ASV-SCH-002 — citation_author per human author
  const authors = (work.authors ?? []).map((a) => a.name_normalized ?? a.name_human);
  if (!Array.isArray(sc.citation_author) || sc.citation_author.length !== authors.length) {
    out.push(diag('ASV-SCH-002', { path: `${p}.scholar.citation_author`, message: 'citation_author does not cover all authors', remediation: 'Emit one citation_author per human author' }));
  }

  // ASV-SCH-003 — citation_publication_date present (YYYY/MM/DD)
  const expectedDate = scholarDate(cur?.date);
  if (!has('citation_publication_date')) out.push(diag('ASV-SCH-003', { path: `${p}.scholar.citation_publication_date`, message: 'citation_publication_date missing (mandatory Scholar tag)', remediation: 'Emit the publication date; never omit it' }));
  else if (expectedDate && sc.citation_publication_date !== expectedDate) out.push(diag('ASV-SCH-003', { path: `${p}.scholar.citation_publication_date`, message: `citation_publication_date '${sc.citation_publication_date}' != current version date '${expectedDate}'`, remediation: 'Derive the date from the current version', evidence: sc.citation_publication_date }));

  // ASV-SCH-004 — citation_pdf_url present + co-located
  if (!has('citation_pdf_url')) out.push(diag('ASV-SCH-004', { path: `${p}.scholar.citation_pdf_url`, message: 'citation_pdf_url missing', remediation: 'Serve a co-located PDF and link it via citation_pdf_url' }));
  else if (work.slug && !sc.citation_pdf_url.includes(`/works/${work.slug}/`)) out.push(diag('ASV-SCH-004', { path: `${p}.scholar.citation_pdf_url`, message: 'citation_pdf_url not co-located with the landing', remediation: 'Place the PDF under /works/<slug>/', evidence: sc.citation_pdf_url }));

  // ASV-SCH-005 — metadata matches PDF (conceptual; declared pdf_title only)
  if (has('pdf_title') && has('citation_title') && sc.pdf_title !== sc.citation_title) {
    out.push(diag('ASV-SCH-005', { path: `${p}.scholar.pdf_title`, message: 'Declared PDF title differs from citation_title', remediation: 'Align citation_* with the embedded PDF title (M-07). Full parse deferred to release', evidence: sc.pdf_title }));
  }

  // ASV-SCH-006 — abstract visible + no noindex on public
  if (!work.abstract) out.push(diag('ASV-SCH-006', { path: `${p}.abstract`, message: 'Abstract missing on public Work (Scholar needs a visible abstract)', remediation: 'Prerender a visible abstract' }));
  if (work.web && work.web.robots_noindex === true) out.push(diag('ASV-SCH-006', { path: `${p}.web.robots_noindex`, message: 'noindex on a public Work blocks Scholar', remediation: 'Never noindex public Works' }));

  return out;
}
