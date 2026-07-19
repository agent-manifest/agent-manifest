// Gate D3 — tests for the derived academic representations of the pilot amw-014.
// Uses the real pilot data only, outside fixtures/, so the fictitious-fixture
// suites never scan it. Exercises determinism, consistency, ASV-EXP/SCH/WEB, and
// isolation. No network, no clock.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderAll, checkDerived, toCSL, toHighwire, toJSONLD } from '../src/derive.js';
import { checkConsistency } from '../src/derive-check.js';
import { validate } from '../src/index.js';
import { SEVERITY } from '../src/diagnostics.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, '..', 'content', 'pilot', 'declaration-layers');
const DERIVED = join(DIR, 'derived');
const work = JSON.parse(readFileSync(join(DIR, 'work.json'), 'utf8'));
const cur = work.versions.find((v) => v.is_current);
const readJson = (f) => JSON.parse(readFileSync(join(DERIVED, f), 'utf8'));
const readText = (f) => readFileSync(join(DERIVED, f), 'utf8');

// 23,26,27) deterministic, no clock/network
test('D3: derivation is deterministic (same input -> same bytes)', () => {
  const a = renderAll(work); const b = renderAll(work);
  for (const k of Object.keys(a)) assert.equal(a[k], b[k], `nondeterministic: ${k}`);
});

// 24,12*) --check detects drift; on-disk matches regeneration
test('D3: on-disk derived files match regeneration (no drift, no extras)', () => {
  const { ok, drift, extra } = checkDerived(work, DERIVED);
  assert.equal(ok, true, `drift=${drift} extra=${extra}`);
});

// 25) writer only targets derived/ (checkDerived treats README as allowed, nothing else stray)
test('D3: no unexpected files in derived/ beyond the 13 outputs + README', () => {
  const { extra } = checkDerived(work, DERIVED);
  assert.deepEqual(extra, []);
});

// 1) CSL-JSON valid + canonical fields
test('D3: CSL-JSON has canonical fields', () => {
  const c = readJson('cite.json');
  assert.equal(c.title, work.title);
  assert.equal(c.DOI, cur.doi_version);
  assert.equal(c.language, 'en');
  assert.equal(c.type, 'article');
  assert.deepEqual(c.issued['date-parts'][0], [2026, 3, 5]);
});

// 2,3,4,5,6,7,8,9,10,11,12) cross-format consistency (title/author/date/DOIs/lang/abstract/license/URL/PDF)
test('D3: cross-format consistency holds (blocking check clean)', () => {
  const { ok, diagnostics } = checkConsistency(work, DERIVED);
  assert.equal(ok, true, JSON.stringify(diagnostics));
});

// 9) concept DOI preserved distinctly from version DOI
test('D3: concept DOI preserved and distinct from version DOI', () => {
  assert.notEqual(work.doi_concept, cur.doi_version);
  assert.ok(readText('cite.bib').includes(work.doi_concept));
  const ld = readJson('schema.json');
  const ids = ld.identifier.map((i) => i.value);
  assert.ok(ids.includes(work.doi_concept) && ids.includes(cur.doi_version));
});

// 13,14,15) Highwire complete, date + future pdf url correct
test('D3: Highwire tags complete and correct', () => {
  const t = readJson('highwire.json').tags;
  for (const k of ['citation_title', 'citation_author', 'citation_publication_date', 'citation_pdf_url', 'citation_doi', 'citation_language']) {
    assert.ok(t[k] !== undefined && t[k] !== null && t[k] !== '', `missing ${k}`);
  }
  assert.equal(t.citation_publication_date, '2026/03/05');
  assert.ok(t.citation_pdf_url.includes('/works/declaration-layers/'));
  assert.equal(t.citation_doi, cur.doi_version);
});

// 16,17,18) JSON-LD valid, ScholarlyArticle, ORCID
test('D3: JSON-LD is a ScholarlyArticle with ORCID and DOIs', () => {
  const ld = readJson('schema.json');
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@type'], 'ScholarlyArticle');
  assert.equal(ld.author[0].sameAs, `https://orcid.org/${work.authors[0].orcid}`);
  assert.equal(ld.inLanguage, 'en');
});

// 19) isSupplementTo relation present as external DOI
test('D3: isSupplementTo relation carried as external DOI (JSON-LD + index)', () => {
  const target = work.relations.find((r) => r.predicate === 'isSupplementTo').target_doi;
  assert.equal(readJson('schema.json').isSupplementTo.identifier, target);
  const idxRel = readJson('index.json').relations.find((r) => r.predicate === 'isSupplementTo');
  assert.equal(idxRel.target_doi, target);
  assert.equal(idxRel.inverse, 'pending');
});

// 20) no unnecessary custom / forbidden predicates in JSON-LD
test('D3: JSON-LD has no ams:* / no tool / no AI / no local paths', () => {
  const raw = readText('schema.json');
  for (const bad of ['ams:supersedes', 'ams:implements', '/Users/', 'academic-surface (Gate C', 'build_activity', 'Co-Authored', 'claude']) {
    assert.ok(!raw.includes(bad), `unexpected token in JSON-LD: ${bad}`);
  }
});

// 21) API JSON has no private provenance (no build tool / methodological notes / md5)
test('D3: index.json carries only minimal public provenance', () => {
  const idx = readJson('index.json');
  assert.equal(idx.provenance.intellectual_author, work.authors[0].name_human);
  assert.ok(!('build_activity' in idx.provenance));
  assert.ok(!('methodological_notes' in idx.provenance));
  assert.ok(!readText('index.json').includes('7ab96aa9'), 'external md5 must not leak into public API');
  assert.equal(idx.publication_status, 'not-published');
});

// 22) signposting complete
test('D3: signposting models all future link relations', () => {
  const rels = readJson('signposting.json').links.map((l) => l.rel);
  for (const r of ['cite-as', 'describedby', 'author', 'license', 'type', 'item', 'alternate']) {
    assert.ok(rels.includes(r), `missing signposting rel: ${r}`);
  }
});

// 10) language en everywhere
test('D3: language is en across representations (never enc)', () => {
  assert.equal(readJson('cite.json').language, 'en');
  assert.equal(readJson('schema.json').inLanguage, 'en');
  assert.equal(readJson('dublin-core.json').language, 'en');
  assert.equal(readJson('index.json').language, 'en');
  for (const f of ['cite.json', 'schema.json', 'index.json', 'highwire.json', 'dublin-core.json']) {
    assert.ok(!/"(language|inLanguage|citation_language)"\s*:\s*"enc"/.test(readText(f)), `enc leaked into ${f}`);
  }
});

// ASV-EXP/SCH/WEB executable: augmented public Work from derived blocks -> 0 ERROR
test('D3: derived metadata satisfies ASV-EXP/SCH/WEB on an augmented public Work', () => {
  const hw = toHighwire(work).tags;
  const ld = toJSONLD(work);
  const csl = toCSL(work);
  const aug = structuredClone(work);
  aug.visibility = 'public';
  aug.web = {
    canonical: ld.url, robots_noindex: false, version_signposted: true,
    signposting: ['cite-as', 'describedby', 'author', 'type', 'item'],
    alternates: ['a/cite.bib', 'a/cite.json'],
    jsonld_type: ld['@type'],
    jsonld: { inLanguage: ld.inLanguage, sameAs: ld.sameAs, identifier: cur.doi_version, author_identifier: [work.authors[0].orcid] }
  };
  aug.scholar = {
    citation_title: hw.citation_title, citation_author: hw.citation_author,
    citation_publication_date: hw.citation_publication_date, citation_pdf_url: hw.citation_pdf_url,
    pdf_title: hw.citation_title, abstract_prerendered: true
  };
  aug.exports = {
    canonical_source: 'csl-json', csl_json: { title: csl.title, DOI: csl.DOI },
    formats: ['bibtex', 'ris', 'csl-json'].map((name) => ({ name, fields: { title: csl.title, authors: hw.citation_author, date: cur.date, doi: cur.doi_version, version: cur.vN } }))
  };
  const res = validate(aug, { asOf: '2026-07-19' });
  const errors = res.diagnostics.filter((x) => x.severity === SEVERITY.ERROR);
  assert.equal(errors.length, 0, JSON.stringify(errors.map((e) => e.rule_id)));
});

// 28,29,30) isolation: derived stays internal, no front matter, no public materialization
test('D3: derived output is isolated (no front matter, no public /works)', () => {
  assert.ok(DERIVED.includes(join('tools', 'academic-surface', 'content')));
  for (const f of ['README.md']) {
    assert.notEqual(readText(f).slice(0, 3), '---', `${f} has front matter`);
  }
  const repoRoot = join(HERE, '..', '..', '..');
  assert.equal(existsSync(join(repoRoot, 'works', 'declaration-layers')), false);
});
