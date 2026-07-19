// Gate D3 — deterministic, offline deriver of academic representations from the
// SSOT (work.json). Same input -> same bytes. Reads ONLY the SSOT; never the PDF,
// never the network, never the clock. Writes ONLY under <pilot>/derived/.
//
// Representations: CSL-JSON (canonical) + BibTeX/RIS/APA/plain/Markdown +
// Highwire + schema.org JSON-LD + Dublin Core + OpenGraph + API JSON + signposting.
// No timestamps are embedded in any output, so regeneration is byte-stable.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { BASE_URL, currentVersion, scholarDate, TYPE_TO_JSONLD, worksUrl } from './lib/canonical.js';

// ---- helpers ---------------------------------------------------------------

// Stable JSON: recursively sort object keys; preserve array order; trailing newline.
function stable(value) {
  const seen = (v) => {
    if (Array.isArray(v)) return v.map(seen);
    if (v && typeof v === 'object') {
      const out = {};
      for (const k of Object.keys(v).sort()) out[k] = seen(v[k]);
      return out;
    }
    return v;
  };
  return JSON.stringify(seen(value), null, 2) + '\n';
}

function splitName(nameNormalized, nameHuman) {
  if (nameNormalized && nameNormalized.includes(', ')) {
    const [family, given] = nameNormalized.split(', ');
    return { family, given };
  }
  const parts = (nameHuman || nameNormalized || '').trim().split(/\s+/);
  return { family: parts.slice(-1)[0] || '', given: parts.slice(0, -1).join(' ') };
}

function initials(given) {
  return given.split(/\s+/).filter(Boolean).map((g) => `${g[0]}.`).join(' ');
}

function futurePdfUrl(work) {
  const cur = currentVersion(work);
  const art = (cur?.artifacts ?? []).find((a) => a.kind === 'pdf');
  return art ? `${BASE_URL}${art.path}` : null;
}

function derivedUrls(work) {
  const landing = worksUrl(work.slug);
  const cur = currentVersion(work);
  return {
    landing,
    pdf: futurePdfUrl(work),
    version_doi: cur?.doi_version ? `https://doi.org/${cur.doi_version}` : null,
    concept_doi: work.doi_concept ? `https://doi.org/${work.doi_concept}` : null,
    csl: `${landing}/cite.json`,
    bibtex: `${landing}/cite.bib`,
    ris: `${landing}/cite.ris`,
    apa: `${landing}/cite-apa.txt`,
    plain: `${landing}/cite-plain.txt`,
    markdown: `${landing}/cite.md`,
    json: `${landing}/index.json`,
    schema: `${landing}/schema.json`
  };
}

// ---- representations -------------------------------------------------------

export function toCSL(work) {
  const cur = currentVersion(work);
  const [y, m, d] = (cur?.date ?? '').split('-').map(Number);
  const u = derivedUrls(work);
  return {
    id: work.id,
    type: 'article',
    genre: 'Working paper',
    title: work.title,
    author: (work.authors ?? []).map((a) => splitName(a.name_normalized, a.name_human)),
    issued: { 'date-parts': [[y, m, d]] },
    DOI: cur?.doi_version ?? work.doi_concept,
    URL: u.landing,
    language: work.language,
    abstract: work.abstract,
    keyword: (work.keywords ?? []).join(', '),
    version: cur?.vN,
    note: `Concept DOI: ${work.doi_concept}`
  };
}

export function toBibTeX(work) {
  const c = toCSL(work);
  const cur = currentVersion(work);
  const authors = c.author.map((a) => `${a.family}, ${a.given}`).join(' and ');
  const L = [
    `@misc{${work.id},`,
    `  title = {${c.title}},`,
    `  author = {${authors}},`,
    `  year = {${c.issued['date-parts'][0][0]}},`,
    `  month = {${c.issued['date-parts'][0][1]}},`,
    `  doi = {${c.DOI}},`,
    `  url = {${c.URL}},`,
    `  language = {${c.language}},`,
    `  keywords = {${c.keyword}},`,
    `  note = {Working paper. ${c.note}. Version: ${cur?.vN}}`,
    `}`
  ];
  return L.join('\n') + '\n';
}

export function toRIS(work) {
  const c = toCSL(work);
  const cur = currentVersion(work);
  const [y, m, d] = c.issued['date-parts'][0];
  const pad = (n) => String(n).padStart(2, '0');
  const L = ['TY  - GEN', `TI  - ${c.title}`];
  for (const a of c.author) L.push(`AU  - ${a.family}, ${a.given}`);
  const abLine = (c.abstract ?? '').replace(/\s*\n\s*/g, ' ').trim();
  L.push(`PY  - ${y}`, `DA  - ${y}/${pad(m)}/${pad(d)}`, `DO  - ${c.DOI}`, `UR  - ${c.URL}`, `LA  - ${c.language}`, `AB  - ${abLine}`);
  for (const k of work.keywords ?? []) L.push(`KW  - ${k}`);
  L.push(`N1  - Working paper. Concept DOI: ${work.doi_concept}. Version: ${cur?.vN}`, 'ER  - ');
  return L.join('\n') + '\n';
}

function apaAuthors(work) {
  return (work.authors ?? []).map((a) => {
    const { family, given } = splitName(a.name_normalized, a.name_human);
    return `${family}, ${initials(given)}`;
  }).join(', ');
}

export function toAPA(work) {
  const c = toCSL(work);
  const y = c.issued['date-parts'][0][0];
  return `${apaAuthors(work)} (${y}). ${c.title}. https://doi.org/${c.DOI}\n`;
}

export function toPlain(work) {
  const c = toCSL(work);
  const y = c.issued['date-parts'][0][0];
  return `${apaAuthors(work)} (${y}). ${c.title}. https://doi.org/${c.DOI}\n`;
}

export function toMarkdown(work) {
  const c = toCSL(work);
  const y = c.issued['date-parts'][0][0];
  return `${apaAuthors(work)} (${y}). *${c.title}*. https://doi.org/${c.DOI}\n`;
}

// Highwire pairs (D4 lifts `.tags` into <meta name="citation_*">). The wrapper
// marks that nothing is materialized yet.
export function toHighwire(work) {
  const cur = currentVersion(work);
  const u = derivedUrls(work);
  return {
    status: 'not-published',
    note: 'Future citation_* meta tags; not injected into HTML in D3. citation_pdf_url is planned, not yet materialized.',
    tags: {
      citation_title: work.title,
      citation_author: (work.authors ?? []).map((a) => a.name_normalized ?? a.name_human),
      citation_publication_date: scholarDate(cur?.date),
      citation_pdf_url: u.pdf,
      citation_doi: cur?.doi_version,
      citation_abstract_html_url: u.landing,
      citation_language: work.language
    }
  };
}

export function toJSONLD(work) {
  const cur = currentVersion(work);
  const u = derivedUrls(work);
  const zenodo = (work.external_urls ?? []).find((e) => e.rel === 'sameAs')?.url;
  const rel = (work.relations ?? []).find((r) => r.predicate === 'isSupplementTo');
  const license = (work.licenses ?? [])[0];
  const doc = {
    '@context': 'https://schema.org',
    '@type': TYPE_TO_JSONLD[work.type],
    '@id': u.landing,
    url: u.landing,
    name: work.title,
    headline: work.title,
    author: (work.authors ?? []).map((a) => ({
      '@type': 'Person',
      name: a.name_human,
      ...(a.orcid ? { identifier: `https://orcid.org/${a.orcid}`, sameAs: `https://orcid.org/${a.orcid}` } : {})
    })),
    datePublished: cur?.date,
    inLanguage: work.language,
    abstract: work.abstract,
    keywords: work.keywords ?? [],
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'DOI', name: 'Version DOI', value: cur?.doi_version },
      { '@type': 'PropertyValue', propertyID: 'DOI', name: 'Concept DOI', value: work.doi_concept }
    ],
    ...(license?.url ? { license: license.url } : {}),
    sameAs: [zenodo, `https://doi.org/${cur?.doi_version}`].filter(Boolean),
    encoding: { '@type': 'MediaObject', contentUrl: u.pdf, encodingFormat: 'application/pdf' }
  };
  if (rel?.target_doi) {
    // DataCite predicate carried verbatim; schema.org-only parsers ignore it,
    // DataCite is authoritative (already on Zenodo).
    doc.isSupplementTo = { '@type': 'CreativeWork', identifier: rel.target_doi, url: `https://doi.org/${rel.target_doi}` };
  }
  return doc;
}

export function toDublinCore(work) {
  const cur = currentVersion(work);
  const zenodo = (work.external_urls ?? []).find((e) => e.rel === 'sameAs')?.url;
  const rel = (work.relations ?? []).find((r) => r.predicate === 'isSupplementTo');
  const license = (work.licenses ?? [])[0];
  return {
    title: work.title,
    creator: (work.authors ?? []).map((a) => a.name_normalized ?? a.name_human),
    date: cur?.date,
    type: 'Text',
    language: work.language,
    identifier: [`https://doi.org/${cur?.doi_version}`, `https://doi.org/${work.doi_concept}`],
    rights: license ? `${license.label ?? license.spdx} (${license.spdx})` : undefined,
    description: work.abstract,
    relation: rel?.target_doi ? [`https://doi.org/${rel.target_doi}`] : [],
    source: zenodo
  };
}

export function toOpenGraph(work) {
  const u = derivedUrls(work);
  const firstPara = (work.abstract ?? '').split('\n\n')[0];
  return {
    'og:title': work.title,
    'og:description': firstPara,
    'og:type': 'article',
    'og:url': u.landing,
    'og:locale': work.language,
    'og:site_name': 'Agent Manifest',
    'article:author': (work.authors ?? []).map((a) => a.name_human)
  };
}

export function toIndexJSON(work) {
  const cur = currentVersion(work);
  const u = derivedUrls(work);
  const art = (cur?.artifacts ?? []).find((a) => a.kind === 'pdf');
  const license = (work.licenses ?? [])[0];
  return {
    id: work.id,
    slug: work.slug,
    type: work.type,
    title: work.title,
    authors: (work.authors ?? []).map((a) => ({ name: a.name_human, orcid: a.orcid })),
    abstract: work.abstract,
    language: work.language,
    keywords: work.keywords ?? [],
    topics: work.topics ?? [],
    license: license ? { spdx: license.spdx, url: license.url } : undefined,
    doi_concept: work.doi_concept,
    current_version: cur ? { vN: cur.vN, date: cur.date, doi_version: cur.doi_version, is_current: true } : null,
    artifacts: art ? [{ kind: 'pdf', future_url: u.pdf, bytes: art.bytes, checksum: { algorithm: art.checksum_algorithm, value: art.checksum } }] : [],
    relations: (work.relations ?? []).map((r) => ({ predicate: r.predicate, target_doi: r.target_doi, target_id: r.target_id, inverse: 'pending' })),
    exports: { 'csl-json': u.csl, bibtex: u.bibtex, ris: u.ris, apa: u.apa, plain: u.plain, markdown: u.markdown },
    links: { landing: u.landing, pdf: u.pdf, doi_version: u.version_doi, doi_concept: u.concept_doi, zenodo: (work.external_urls ?? []).find((e) => e.rel === 'sameAs')?.url, orcid: (work.authors ?? [])[0]?.orcid ? `https://orcid.org/${work.authors[0].orcid}` : undefined },
    provenance: { intellectual_author: (work.authors ?? [])[0]?.name_human, orcid: (work.authors ?? [])[0]?.orcid, surface: 'Academic Surface' },
    publication_status: 'not-published',
    _internal: { materialized: false, note: 'D3 derived. Strip `_internal` and `publication_status` before D4/D5 materialization.' }
  };
}

export function toSignposting(work) {
  const cur = currentVersion(work);
  const u = derivedUrls(work);
  const license = (work.licenses ?? [])[0];
  return {
    status: 'model-only',
    note: 'Future <link> relations modeled as data; no headers, no HTML, no deploy in D3.',
    urls: { conceptual: u.landing, version_doi: u.version_doi, concept_doi: u.concept_doi, pdf: u.pdf },
    links: [
      { rel: 'cite-as', href: u.version_doi, note: 'immutable version DOI' },
      { rel: 'describedby', href: u.csl, type: 'application/vnd.citationstyles.csl+json' },
      { rel: 'describedby', href: u.schema, type: 'application/ld+json' },
      { rel: 'author', href: cur && (work.authors ?? [])[0]?.orcid ? `https://orcid.org/${work.authors[0].orcid}` : undefined },
      { rel: 'license', href: license?.url },
      { rel: 'type', href: `https://schema.org/${TYPE_TO_JSONLD[work.type]}` },
      { rel: 'item', href: u.pdf, type: 'application/pdf' },
      { rel: 'alternate', href: u.bibtex, type: 'application/x-bibtex' },
      { rel: 'alternate', href: u.ris, type: 'application/x-research-info-systems' },
      { rel: 'alternate', href: u.json, type: 'application/json' }
    ]
  };
}

// ---- file set + writer -----------------------------------------------------

// name -> (work) => string (already serialized, byte-stable)
export const DERIVERS = {
  'cite.json': (w) => stable(toCSL(w)),
  'cite.bib': (w) => toBibTeX(w),
  'cite.ris': (w) => toRIS(w),
  'cite-apa.txt': (w) => toAPA(w),
  'cite-plain.txt': (w) => toPlain(w),
  'cite.md': (w) => toMarkdown(w),
  'highwire.json': (w) => stable(toHighwire(w)),
  'schema.json': (w) => stable(toJSONLD(w)),
  'dublin-core.json': (w) => stable(toDublinCore(w)),
  'opengraph.json': (w) => stable(toOpenGraph(w)),
  'index.json': (w) => stable(toIndexJSON(w)),
  'signposting.json': (w) => stable(toSignposting(w))
};

export function renderAll(work) {
  const out = {};
  for (const [name, fn] of Object.entries(DERIVERS)) out[name] = fn(work);
  return out;
}

export function writeDerived(work, dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const rendered = renderAll(work);
  for (const [name, content] of Object.entries(rendered)) writeFileSync(join(dir, name), content);
  return Object.keys(rendered);
}

// Returns { ok, drift:[names], extra:[names] }
export function checkDerived(work, dir) {
  const rendered = renderAll(work);
  const drift = [];
  for (const [name, content] of Object.entries(rendered)) {
    const p = join(dir, name);
    if (!existsSync(p) || readFileSync(p, 'utf8') !== content) drift.push(name);
  }
  const expected = new Set(Object.keys(rendered));
  const extra = existsSync(dir) ? readdirSync(dir).filter((f) => !expected.has(f) && f !== 'README.md') : [];
  return { ok: drift.length === 0 && extra.length === 0, drift, extra };
}

// ---- CLI -------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const ssot = args.find((a) => !a.startsWith('--'));
  if (!ssot) { console.error('usage: derive <work.json> [--check]'); process.exit(2); }
  const work = JSON.parse(readFileSync(ssot, 'utf8'));
  const dir = join(dirname(ssot), 'derived');
  if (check) {
    const { ok, drift, extra } = checkDerived(work, dir);
    if (ok) { console.log('derive --check: OK (derived files match the SSOT regeneration)'); process.exit(0); }
    console.error('derive --check: DRIFT');
    for (const n of drift) console.error(`  stale/missing: ${n}`);
    for (const n of extra) console.error(`  unexpected: ${n}`);
    process.exit(1);
  } else {
    const names = writeDerived(work, dir);
    console.log(`derive: wrote ${names.length} files to ${dir}`);
    for (const n of names) console.log(`  ${n}`);
  }
}
