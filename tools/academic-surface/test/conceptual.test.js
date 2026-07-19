// Gate B conceptual matrix T-01..T-38 made executable. Each test links the
// protected rule_id(s). Fixtures are fictitious; no real Works/DOIs are used.

import test from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../src/index.js';
import { classifyDoiResolution } from '../src/lib/remote.js';
import { load, clone, has, firstCurrent, AS_OF } from './helpers.js';

const opt = { asOf: AS_OF };
const V = (input) => validate(input, opt);

test('T-01 happy path → PASS (0 blocking)', () => {
  const res = V(load('valid/multiversion-work.json'));
  assert.equal(res.report.ok, true, JSON.stringify(res.diagnostics.filter((d) => d.severity === 'ERROR')));
});

test('T-02 missing required field (title) → ASV-WORK-003', () => {
  const w = clone(load('valid/multiversion-work.json'));
  delete w.title;
  const res = V(w);
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-WORK-003'));
});

test('T-03 duplicate doi_version → ASV-CORP-001', () => {
  const a = clone(load('valid/minimal-work.json'));
  const b = clone(load('valid/minimal-work.json'));
  b.id = 'fixt-002'; b.slug = 'a-fictitious-minimal-work-two'; b.versions[0].id = 'fixt-002-v1';
  // same doi_version as a → collision
  const res = V({ record_kind: 'corpus', works: [a, b] });
  assert.ok(has(res, 'ASV-CORP-001'));
});

test('T-04 duplicate slug → ASV-CORP-001', () => {
  const a = clone(load('valid/minimal-work.json'));
  const b = clone(load('valid/minimal-work.json'));
  b.id = 'fixt-002'; b.versions[0].id = 'fixt-002-v1'; b.versions[0].doi_version = '10.5555/example.minimal.v2';
  const res = V({ record_kind: 'corpus', works: [a, b] });
  assert.ok(has(res, 'ASV-CORP-001'));
});

test('T-05 same title, distinct objects → PASS', () => {
  const a = clone(load('valid/minimal-work.json'));
  const b = clone(load('valid/minimal-work.json'));
  b.id = 'fixt-002'; b.slug = 'a-fictitious-companion'; b.type = 'software';
  b.doi_concept = '10.5555/example.sw.concept';
  b.versions[0].id = 'fixt-002-v1'; b.versions[0].doi_version = '10.5555/example.sw.v1';
  const res = V({ record_kind: 'corpus', works: [a, b] });
  assert.equal(res.report.ok, true, JSON.stringify(res.diagnostics.filter((d) => d.severity === 'ERROR')));
});

test('T-06 current version without artifact (type expects one) → ASV-WORK-014', () => {
  const w = clone(load('valid/multiversion-work.json'));
  firstCurrent(w).artifacts = [];
  const res = V(w);
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-WORK-014'));
});

test('T-07 artifact at Work level → ASV-ART-001', () => {
  const w = clone(load('valid/minimal-work.json'));
  w.artifacts = [{ id: 'x', kind: 'pdf', path: '/works/a/x.pdf', bytes: 1, checksum: 'a', checksum_algorithm: 'sha-256' }];
  const res = V(w);
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-ART-001'));
});

test('T-08 relation without inverse → ASV-REL-002', () => {
  const a = clone(load('valid/minimal-work.json'));
  a.relations = [{ predicate: 'isSupplementTo', target_id: 'fixt-b' }];
  const b = clone(load('valid/minimal-work.json'));
  b.id = 'fixt-b'; b.slug = 'a-fictitious-b'; b.doi_concept = '10.5555/example.b.concept';
  b.versions[0].id = 'fixt-b-v1'; b.versions[0].doi_version = '10.5555/example.b.v1';
  const res = V({ record_kind: 'corpus', works: [a, b] });
  assert.ok(has(res, 'ASV-REL-002'));
});

test('T-09 supersession cycle → ASV-REL-004', () => {
  const res = V(load('invalid/relations-bad.json'));
  assert.ok(has(res, 'ASV-REL-004'));
});

test('T-10 unilateral translation → ASV-REL-007', () => {
  const c = clone(load('valid/translation-pair.json'));
  c.works[1].relations = [];
  const res = V(c);
  assert.ok(has(res, 'ASV-REL-007'));
});

test('T-11 translation modeled as version → ASV-REL-007', () => {
  const c = clone(load('valid/translation-pair.json'));
  c.works[0].relations[0].predicate = 'isVersionOf';
  const res = V(c);
  assert.ok(has(res, 'ASV-REL-007'));
});

test('T-12 PDF outside subdirectory → ASV-ART-003', () => {
  const res = V(load('invalid/artifact-bad.json'));
  assert.ok(has(res, 'ASV-ART-003'));
});

test('T-13 metadata/PDF divergence → ASV-SCH-005', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.scholar.pdf_title = 'A Different Embedded Title';
  const res = V(w);
  assert.ok(has(res, 'ASV-SCH-005'));
});

test('T-14 AI in authorship → ASV-WORK-004 (+ ASV-PROV-003)', () => {
  const res = V(load('invalid/authorship-bad.json'));
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-WORK-004'));
  assert.ok(has(res, 'ASV-PROV-003'));
});

test('T-15 withdrawn with noindex → ASV-WD-003', () => {
  const w = clone(load('valid/withdrawn-tombstone.json'));
  w.withdrawal.noindex = true;
  const res = V(w);
  assert.ok(has(res, 'ASV-WD-003'));
});

test('T-16 withdrawn as 404 → ASV-WD-002', () => {
  const w = clone(load('valid/withdrawn-tombstone.json'));
  w.withdrawal.http_status = 404;
  const res = V(w);
  assert.ok(has(res, 'ASV-WD-002'));
});

test('T-17 atomic release failure → ASV-RLS-004 + abort', () => {
  const r = clone(load('valid/release-ok.json'));
  r.failure_injected = true;
  const res = V(r);
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-RLS-004'));
});

test('T-18 concept = version DOI → ASV-WORK-009', () => {
  const res = V(load('invalid/identity-bad.json'));
  assert.ok(has(res, 'ASV-WORK-009'));
});

test('T-19 enc language in SSOT → ASV-WORK-007 (ERROR)', () => {
  const w = clone(load('valid/minimal-work.json'));
  w.language = 'enc';
  const res = V(w);
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-WORK-007', 'ERROR'));
});

test('T-20 enc observed in provenance → ASV-WORK-007 (WARNING, non-blocking)', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.provenance.external_metadata = { language_observed: 'enc', note: 'Zenodo mirror' };
  const res = V(w);
  assert.equal(res.report.ok, true);
  assert.ok(has(res, 'ASV-WORK-007', 'WARNING'));
});

test('T-21 citation_publication_date absent → ASV-SCH-003', () => {
  const w = clone(load('valid/multiversion-work.json'));
  delete w.scholar.citation_publication_date;
  const res = V(w);
  assert.ok(has(res, 'ASV-SCH-003'));
});

test('T-22 canonical cross-domain to Zenodo → ASV-WEB-006', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.web.canonical = 'https://zenodo.org/records/9999999';
  const res = V(w);
  assert.ok(has(res, 'ASV-WEB-006'));
});

test('T-23 current version duplicated at /vN → ASV-WEB-003', () => {
  const w = clone(load('valid/multiversion-work.json'));
  firstCurrent(w).web = { path: `/works/${w.slug}/v2` };
  const res = V(w);
  assert.ok(has(res, 'ASV-WEB-003'));
});

test('T-24 export divergence → ASV-EXP-002', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.exports.formats[0].fields.date = '2000-01-01';
  const res = V(w);
  assert.ok(has(res, 'ASV-EXP-002'));
});

test('T-25 generated field hand-edited → ASV-EXP-003', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.exports.csl_json.title = 'Hand Edited Title';
  const res = V(w);
  assert.ok(has(res, 'ASV-EXP-003'));
});

test('T-26 independent corpus (AGTS-like) inside corpus → ASV-CORP-004', () => {
  const a = clone(load('valid/minimal-work.json'));
  a.external_corpus = true;
  const res = V({ record_kind: 'corpus', works: [a] });
  assert.ok(has(res, 'ASV-CORP-004'));
});

test('T-27 two simultaneous types → ASV-WORK-005', () => {
  const w = clone(load('valid/minimal-work.json'));
  w.type = ['software', 'working-paper'];
  const res = V(w);
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-WORK-005'));
});

test('T-28 online DOI external failure → WARNING, never aborts (ASV-WEB-011)', () => {
  const r = classifyDoiResolution({ mode: 'online', resolved: false, externalError: true });
  assert.equal(r.severity, 'WARNING');
  assert.equal(r.aborts, false);
});

test('T-29 text_extractable=false → ASV-ART-006 INFO (non-blocking now)', () => {
  const w = clone(load('valid/multiversion-work.json'));
  firstCurrent(w).artifacts[0].text_extractable = false;
  const res = V(w);
  assert.equal(res.report.ok, true);
  assert.ok(has(res, 'ASV-ART-006', 'INFO'));
});

test('T-30 live governed exception → GOVERNED_EXCEPTION, non-blocking (§R)', () => {
  const c = clone(load('invalid/exceptions-expired.json'));
  c.governed_exceptions[0].id = 'EXC-2099-001';
  c.governed_exceptions[0].expires = '2099-01-01';
  const res = V(c);
  assert.equal(res.report.ok, true);
  assert.ok(res.diagnostics.some((d) => d.severity === 'GOVERNED_EXCEPTION' && d.exception_id === 'EXC-2099-001'));
});

test('T-31 expired governed exception → ERROR reactivated (§R)', () => {
  const res = V(load('invalid/exceptions-expired.json'));
  assert.equal(res.report.ok, false);
  assert.ok(has(res, 'ASV-WORK-007', 'ERROR'));
});

test('T-32 vN gap → ASV-VER-001', () => {
  const res = V(load('invalid/work-version-bad.json'));
  assert.ok(has(res, 'ASV-VER-001'));
});

test('T-33 more than one current version → ASV-VER-004', () => {
  const res = V(load('invalid/work-version-bad.json'));
  assert.ok(has(res, 'ASV-VER-004'));
});

test('T-34 PDF > 5 MB → ASV-ART-004', () => {
  const res = V(load('invalid/artifact-bad.json'));
  assert.ok(has(res, 'ASV-ART-004'));
});

test('T-35 previous alias without 301 → ASV-WEB-010', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.web.alias_redirects = [{ from: '/works/old-slug', status: 404 }];
  const res = V(w);
  assert.ok(has(res, 'ASV-WEB-010'));
});

test('T-36 object without DOI modeled as Work → ASV-CORP-003', () => {
  const w = clone(load('valid/multiversion-work.json'));
  delete w.doi_concept;
  w.versions.forEach((v) => delete v.doi_version);
  const res = V(w);
  assert.ok(has(res, 'ASV-CORP-003'));
});

test('T-37 version signposting absent → ASV-WEB-007', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.web.version_signposted = false;
  const res = V(w);
  assert.ok(has(res, 'ASV-WEB-007'));
});

test('T-38 Work/Version fused in export → ASV-VER-005', () => {
  const w = clone(load('valid/multiversion-work.json'));
  delete w.exports.formats[0].fields.version;
  const res = V(w);
  assert.ok(has(res, 'ASV-VER-005'));
});
