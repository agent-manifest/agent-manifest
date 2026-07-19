// Gate D3 — cross-format consistency verifier. Re-parses the on-disk derived
// files and asserts the shared invariants agree with the SSOT-derived canonical
// values, tolerating format-specific normalization (e.g. APA initials). Any
// divergence is a blocking error. Offline, read-only, deterministic.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SEVERITY } from './diagnostics.js';
import { BASE_URL, currentVersion, scholarDate, worksUrl } from './lib/canonical.js';

function d(file, message, evidence) {
  return { rule_id: 'CONSISTENCY', severity: SEVERITY.ERROR, file, message, evidence };
}

// Extract the canonical facts every representation must agree on.
function expected(work) {
  const cur = currentVersion(work);
  const landing = worksUrl(work.slug);
  const art = (cur?.artifacts ?? []).find((a) => a.kind === 'pdf');
  return {
    title: work.title,
    versionDoi: cur?.doi_version,
    conceptDoi: work.doi_concept,
    language: work.language,
    date: cur?.date,
    scholarDate: scholarDate(cur?.date),
    landing,
    pdf: art ? `${BASE_URL}${art.path}` : null,
    supplementDoi: (work.relations ?? []).find((r) => r.predicate === 'isSupplementTo')?.target_doi ?? null
  };
}

export function checkConsistency(work, dir) {
  const out = [];
  const E = expected(work);
  const readJson = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const readText = (f) => readFileSync(join(dir, f), 'utf8');
  const need = (cond, file, msg, ev) => { if (!cond) out.push(d(file, msg, ev)); };

  // cite.json (CSL)
  const csl = readJson('cite.json');
  need(csl.title === E.title, 'cite.json', 'title mismatch', csl.title);
  need(csl.DOI === E.versionDoi, 'cite.json', 'DOI is not the version DOI', csl.DOI);
  need(csl.URL === E.landing, 'cite.json', 'URL not the future landing', csl.URL);
  need(csl.language === E.language, 'cite.json', 'language mismatch', csl.language);
  need(csl.note?.includes(E.conceptDoi), 'cite.json', 'concept DOI not preserved', csl.note);
  const [cy, cm, cd] = (E.date ?? '').split('-').map(Number);
  need(JSON.stringify(csl.issued?.['date-parts']?.[0]) === JSON.stringify([cy, cm, cd]), 'cite.json', 'issued date mismatch', csl.issued);

  // cite.bib
  const bib = readText('cite.bib');
  need(bib.includes(`{${E.title}}`), 'cite.bib', 'title mismatch', null);
  need(bib.includes(`doi = {${E.versionDoi}}`), 'cite.bib', 'version DOI mismatch', null);
  need(bib.includes(E.conceptDoi), 'cite.bib', 'concept DOI not preserved', null);

  // cite.ris
  const ris = readText('cite.ris');
  need(ris.includes(`TI  - ${E.title}`), 'cite.ris', 'title mismatch', null);
  need(ris.includes(`DO  - ${E.versionDoi}`), 'cite.ris', 'version DOI mismatch', null);
  need(ris.includes(`LA  - ${E.language}`), 'cite.ris', 'language mismatch', null);
  need(ris.includes(E.conceptDoi), 'cite.ris', 'concept DOI not preserved', null);
  need(!/\n\s*\n/.test(ris.replace(/\n$/, '')), 'cite.ris', 'RIS contains a blank line (parser-unsafe)', null);

  // apa / plain / md — title + version DOI present
  for (const f of ['cite-apa.txt', 'cite-plain.txt', 'cite.md']) {
    const t = readText(f);
    need(t.includes(E.title), f, 'title missing', null);
    need(t.includes(E.versionDoi), f, 'version DOI missing', null);
  }

  // highwire.json
  const hw = readJson('highwire.json').tags;
  need(hw.citation_title === E.title, 'highwire.json', 'citation_title mismatch', hw.citation_title);
  need(hw.citation_doi === E.versionDoi, 'highwire.json', 'citation_doi not version DOI', hw.citation_doi);
  need(hw.citation_publication_date === E.scholarDate, 'highwire.json', 'citation_publication_date mismatch', hw.citation_publication_date);
  need(hw.citation_pdf_url === E.pdf, 'highwire.json', 'citation_pdf_url mismatch', hw.citation_pdf_url);
  need(hw.citation_language === E.language, 'highwire.json', 'citation_language mismatch', hw.citation_language);

  // schema.json (JSON-LD)
  const ld = readJson('schema.json');
  need(ld.name === E.title && ld.headline === E.title, 'schema.json', 'name/headline mismatch', ld.name);
  need(ld['@type'] === 'ScholarlyArticle', 'schema.json', '@type not ScholarlyArticle', ld['@type']);
  need(ld.datePublished === E.date, 'schema.json', 'datePublished mismatch', ld.datePublished);
  need(ld.inLanguage === E.language, 'schema.json', 'inLanguage mismatch', ld.inLanguage);
  const ids = (ld.identifier ?? []).map((i) => i.value);
  need(ids.includes(E.versionDoi) && ids.includes(E.conceptDoi), 'schema.json', 'identifier missing version/concept DOI', ids);
  need(ld.url === E.landing, 'schema.json', 'url not future landing', ld.url);
  need(ld.encoding?.contentUrl === E.pdf, 'schema.json', 'encoding contentUrl not future PDF', ld.encoding?.contentUrl);
  need(ld.author?.[0]?.sameAs === `https://orcid.org/${work.authors[0].orcid}`, 'schema.json', 'author ORCID mismatch', ld.author?.[0]?.sameAs);
  if (E.supplementDoi) need(ld.isSupplementTo?.identifier === E.supplementDoi, 'schema.json', 'isSupplementTo mismatch', ld.isSupplementTo);

  // dublin-core.json
  const dc = readJson('dublin-core.json');
  need(dc.title === E.title, 'dublin-core.json', 'title mismatch', dc.title);
  need(dc.date === E.date, 'dublin-core.json', 'date mismatch', dc.date);
  need(dc.language === E.language, 'dublin-core.json', 'language mismatch', dc.language);
  need(dc.identifier?.includes(`https://doi.org/${E.versionDoi}`), 'dublin-core.json', 'version DOI missing', dc.identifier);

  // opengraph.json
  const og = readJson('opengraph.json');
  need(og['og:title'] === E.title, 'opengraph.json', 'og:title mismatch', og['og:title']);
  need(og['og:url'] === E.landing, 'opengraph.json', 'og:url mismatch', og['og:url']);

  // index.json
  const idx = readJson('index.json');
  need(idx.title === E.title, 'index.json', 'title mismatch', idx.title);
  need(idx.current_version?.doi_version === E.versionDoi, 'index.json', 'version DOI mismatch', idx.current_version);
  need(idx.doi_concept === E.conceptDoi, 'index.json', 'concept DOI mismatch', idx.doi_concept);
  need(idx.language === E.language, 'index.json', 'language mismatch', idx.language);
  need(idx.links?.landing === E.landing, 'index.json', 'landing mismatch', idx.links);
  need(idx.artifacts?.[0]?.future_url === E.pdf, 'index.json', 'future PDF url mismatch', idx.artifacts);
  need(idx.publication_status === 'not-published', 'index.json', 'publication_status not not-published', idx.publication_status);

  // signposting.json
  const sp = readJson('signposting.json');
  need(sp.urls?.version_doi === `https://doi.org/${E.versionDoi}`, 'signposting.json', 'version DOI url mismatch', sp.urls);
  need(sp.urls?.pdf === E.pdf, 'signposting.json', 'pdf url mismatch', sp.urls);

  // index.html (canonical landing) — the human surface must agree with the
  // metadata it embeds, and must NOT carry a permanent noindex.
  if (existsSync(join(dir, 'index.html'))) {
    const html = readText('index.html');
    const metaC = (name) => (html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`)) ?? [])[1];
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const ld = ldMatch ? JSON.parse(ldMatch[1]) : {};
    need(html.includes(`<title>${E.title}</title>`), 'index.html', 'title mismatch', null);
    need(html.includes(`<h1 id="title">${E.title}</h1>`), 'index.html', 'h1 mismatch', null);
    need(html.includes(`<link rel="canonical" href="${E.landing}">`), 'index.html', 'canonical not future landing', null);
    need(metaC('citation_title') === E.title, 'index.html', 'citation_title mismatch', metaC('citation_title'));
    need(metaC('citation_doi') === E.versionDoi, 'index.html', 'citation_doi not version DOI', metaC('citation_doi'));
    need(metaC('citation_publication_date') === E.scholarDate, 'index.html', 'citation_publication_date mismatch', metaC('citation_publication_date'));
    need(metaC('citation_pdf_url') === E.pdf, 'index.html', 'citation_pdf_url mismatch', metaC('citation_pdf_url'));
    need(metaC('citation_language') === E.language, 'index.html', 'citation_language not en', metaC('citation_language'));
    need(ld['@type'] === 'ScholarlyArticle', 'index.html', 'JSON-LD @type not ScholarlyArticle', ld['@type']);
    need(ld.url === E.landing, 'index.html', 'JSON-LD url not future landing', ld.url);
    const ids = (ld.identifier ?? []).map((i) => i.value);
    need(ids.includes(E.versionDoi) && ids.includes(E.conceptDoi), 'index.html', 'JSON-LD missing version/concept DOI', ids);
    need(!/name="robots"[^>]*noindex/.test(html), 'index.html', 'canonical landing must not carry a permanent noindex', null);
  }

  return { ok: out.length === 0, diagnostics: out };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ssot = process.argv[2];
  const work = JSON.parse(readFileSync(ssot, 'utf8'));
  const dir = join(ssot, '..', 'derived');
  const { ok, diagnostics } = checkConsistency(work, existsSync(dir) ? dir : join(ssot, '..', 'derived'));
  if (ok) { console.log('derive-check consistency: OK'); process.exit(0); }
  for (const x of diagnostics) console.error(`  [${x.severity}] ${x.rule_id} ${x.file}: ${x.message}`);
  process.exit(1);
}
