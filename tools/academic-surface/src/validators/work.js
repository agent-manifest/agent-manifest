// ASV-WORK-* semantic rules (single record).

import { diag, SEVERITY } from '../diagnostics.js';
import { isValidOrcid } from '../lib/orcid.js';
import { isValidIsbn } from '../lib/isbn.js';
import { isValidSpdx } from '../lib/spdx.js';
import { isSurfaceLanguageValid } from '../lib/bcp47.js';
import { isSyntacticDoi } from '../lib/doi.js';
import { isTextual, currentVersion } from '../lib/canonical.js';

const SLUG_YEAR = /(^|-)(19|20)\d{2}(-|$)/;
const SLUG_VERSION = /(^|-)v\d+(-|$)/;
const CODE_HOST = /(github\.com|gitlab\.com|bitbucket\.org|codeberg\.org|sourceforge\.net)/i;

// A slug encodes its own type/status when that exact token appears as a segment.
// Checking the Work's OWN type/status (not any type word) avoids false positives
// on topical words that merely coincide with a type name.
function slugHasToken(slug, token) {
  if (!token) return false;
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|-)${esc}(-|$)`).test(slug);
}

export function validateWork(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  const push = (id, opts) => out.push(diag(id, { path: p, ...opts }));
  const isPublic = work.visibility === 'public';
  const textual = isTextual(work.type);

  // ASV-WORK-001 — id present (opacity/charset via schema; uniqueness in corpus)
  if (!work.id) push('ASV-WORK-001', { message: 'Work missing id', remediation: 'Assign an opaque, unique id' });

  // ASV-WORK-002 — slug forbidden tokens
  if (work.slug) {
    if (SLUG_YEAR.test(work.slug)) push('ASV-WORK-002', { path: `${p}.slug`, message: `Slug contains a year: ${work.slug}`, remediation: 'Remove the year; slugs are topical and stable', evidence: work.slug });
    if (SLUG_VERSION.test(work.slug)) push('ASV-WORK-002', { path: `${p}.slug`, message: `Slug contains a version token: ${work.slug}`, remediation: 'Remove version tokens from the slug', evidence: work.slug });
    const ownType = typeof work.type === 'string' ? work.type : null;
    if (slugHasToken(work.slug, ownType)) push('ASV-WORK-002', { path: `${p}.slug`, message: `Slug encodes its own type token: ${work.slug}`, remediation: 'Remove the type token from the slug', evidence: ownType });
    if (slugHasToken(work.slug, work.status)) push('ASV-WORK-002', { path: `${p}.slug`, message: `Slug encodes its own status token: ${work.slug}`, remediation: 'Remove the status token from the slug', evidence: work.status });
  }

  // ASV-WORK-003 — title present and coherent across surfaces
  if (!work.title) push('ASV-WORK-003', { message: 'title absent', remediation: 'Define a single canonical title' });
  else if (work.scholar?.citation_title && work.scholar.citation_title !== work.title) {
    push('ASV-WORK-003', { path: `${p}.scholar.citation_title`, message: 'title diverges from citation_title', remediation: 'Regenerate all surfaces from one canonical title', evidence: work.scholar.citation_title });
  }

  // ASV-WORK-005 — exactly one type (no simultaneous/dual types)
  if (Array.isArray(work.type)) {
    push('ASV-WORK-005', { path: `${p}.type`, message: 'Two simultaneous types for one Work', remediation: 'Fix a single canonical type; record external discrepancy in provenance (V-A)', evidence: work.type });
  }

  // ASV-WORK-004 — authors human + ORCID checksum
  (work.authors ?? []).forEach((a, i) => {
    const ap = `${p}.authors[${i}]`;
    if (a.is_human !== true || (a.agent_type && a.agent_type !== 'human')) {
      push('ASV-WORK-004', { path: ap, message: `Author not attested human: ${a.name_human ?? '(unnamed)'}`, remediation: 'Only human authors; declare is_human=true (no AI as author)', evidence: a.agent_type ?? a.is_human });
    }
    if (a.orcid && !isValidOrcid(a.orcid)) {
      push('ASV-WORK-004', { path: `${ap}.orcid`, message: `Invalid ORCID checksum: ${a.orcid}`, remediation: 'Use a valid ORCID iD (ISO 7064 MOD 11-2)', evidence: a.orcid });
    }
  });

  // ASV-WORK-007 — surface language BCP-47 (ERROR); external mirror enc (WARNING)
  if (work.language && !isSurfaceLanguageValid(work.language)) {
    push('ASV-WORK-007', { path: `${p}.language`, message: `language is not a valid surface BCP-47 tag: ${work.language}`, remediation: "Use 'en'/'es'; the Zenodo 'enc'→'eng' fix is deferred to F13/M-07", evidence: work.language });
  }
  const langObs = work.provenance?.external_metadata?.language_observed;
  if (langObs && !isSurfaceLanguageValid(langObs)) {
    push('ASV-WORK-007', { severity: SEVERITY.WARNING, path: `${p}.provenance.external_metadata.language_observed`, message: `External (Zenodo) language mirror is non-BCP-47: ${langObs}`, remediation: 'Observation only; correct in Zenodo via F13/M-07, not on the surface', evidence: langObs });
  }

  // ASV-WORK-008 — abstract present + prerendered (published, public, textual)
  if (textual && isPublic && work.status === 'published') {
    if (!work.abstract) push('ASV-WORK-008', { message: 'Public textual Work without abstract', remediation: 'Provide a prerendered plain-text abstract' });
    if (work.scholar && work.scholar.abstract_prerendered === false) push('ASV-WORK-008', { path: `${p}.scholar.abstract_prerendered`, message: 'Abstract not prerendered (gated by JS/login)', remediation: 'Prerender the abstract in the base HTML' });
  }

  // ASV-WORK-009 — doi_concept valid + distinct from version DOIs
  if (work.doi_concept) {
    if (!isSyntacticDoi(work.doi_concept)) push('ASV-WORK-009', { path: `${p}.doi_concept`, message: `Malformed doi_concept: ${work.doi_concept}`, remediation: 'Use a syntactically valid concept DOI', evidence: work.doi_concept });
    const vDois = (work.versions ?? []).map((v) => v.doi_version).filter(Boolean);
    if (vDois.includes(work.doi_concept)) push('ASV-WORK-009', { path: `${p}.doi_concept`, message: 'doi_concept equals a doi_version', remediation: 'The concept DOI must differ from every version DOI', evidence: work.doi_concept });
  }

  // ASV-WORK-010 — ISBN when book
  if (work.type === 'book' && (!work.isbn || !isValidIsbn(work.isbn))) {
    push('ASV-WORK-010', { path: `${p}.isbn`, message: 'Book without a valid ISBN', remediation: 'Register a valid ISBN for the edition', evidence: work.isbn ?? null });
  }

  // ASV-WORK-011 — licenses SPDX
  (work.licenses ?? []).forEach((l, i) => {
    if (!isValidSpdx(l.spdx)) push('ASV-WORK-011', { path: `${p}.licenses[${i}]`, message: `Invalid SPDX id: ${l.spdx}`, remediation: 'Use a canonical SPDX identifier (e.g. CC-BY-4.0, Apache-2.0)', evidence: l.spdx });
  });

  // ASV-WORK-012 — public never noindex
  if (isPublic && work.web && work.web.robots_noindex === true) {
    push('ASV-WORK-012', { path: `${p}.web.robots_noindex`, message: 'Public Work emits noindex', remediation: 'Keep public Works indexable; exceptional de-indexing needs a governed exception' });
  }

  // ASV-WORK-013 — code vs non-code separation (WARNING)
  (work.external_urls ?? []).forEach((u, i) => {
    if (CODE_HOST.test(u.url)) push('ASV-WORK-013', { path: `${p}.external_urls[${i}]`, message: `Code repository URL in external_urls: ${u.url}`, remediation: 'Move code links to repositories[]', evidence: u.url });
  });
  (work.repositories ?? []).forEach((r, i) => {
    if (/zenodo\.org|doi\.org/i.test(r.url)) push('ASV-WORK-013', { path: `${p}.repositories[${i}]`, message: `Non-code (preservation) URL in repositories: ${r.url}`, remediation: 'Move preservation/identity links to external_urls[]', evidence: r.url });
  });

  // ASV-WORK-014 — impossible cross-field states
  if ((work.type === 'dataset' || work.type === 'software') && work.scholar && (work.scholar.citation_title || work.scholar.citation_pdf_url)) {
    push('ASV-WORK-014', { path: `${p}.scholar`, message: `${work.type} emitting article Scholar citation_* tags`, remediation: 'Datasets/software do not emit article Scholar metadata' });
  }
  if (work.status === 'withdrawn' && !(work.withdrawal && work.withdrawal.tombstone === true)) {
    push('ASV-WORK-014', { path: `${p}.withdrawal`, message: 'withdrawn Work without a tombstone', remediation: 'Provide a public tombstone (ASV-WD-002)' });
  }
  if (textual && isPublic && work.status === 'published') {
    const cur = currentVersion(work);
    if (cur && (!Array.isArray(cur.artifacts) || cur.artifacts.length === 0)) {
      push('ASV-WORK-014', { path: `${p}.versions`, message: 'Published public textual Work: current version has no downloadable artifact', remediation: 'Attach the versioned artifact (e.g. the PDF) to the current version' });
    }
  }

  return out;
}
