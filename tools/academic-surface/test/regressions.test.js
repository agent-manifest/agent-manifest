// Targeted regressions for the specific failure modes enumerated in the Gate C
// directive. Each links the protected rule_id.

import test from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../src/index.js';
import { lintExceptions } from '../src/exceptions.js';
import { load, clone, has, firstCurrent, AS_OF } from './helpers.js';

const opt = { asOf: AS_OF };
const V = (i) => validate(i, opt);

test('reg: zero current versions → ASV-VER-004', () => {
  const w = clone(load('valid/multiversion-work.json'));
  w.versions.forEach((v) => { v.is_current = false; });
  assert.ok(has(V(w), 'ASV-VER-004'));
});

test('reg: historical PDF outside /vN → ASV-ART-003', () => {
  const w = clone(load('valid/multiversion-work.json'));
  const v1 = w.versions.find((v) => v.vN === 'v1');
  v1.artifacts[0].path = `/works/${w.slug}/paper.pdf`; // should be under /v1/
  assert.ok(has(V(w), 'ASV-ART-003'));
});

test('reg: path traversal in artifact path → ASV-ART-003', () => {
  const w = clone(load('valid/multiversion-work.json'));
  firstCurrent(w).artifacts[0].path = `/works/${w.slug}/../secret.pdf`;
  assert.ok(has(V(w), 'ASV-ART-003'));
});

test('reg: missing checksum → structural block', () => {
  const w = clone(load('valid/multiversion-work.json'));
  delete firstCurrent(w).artifacts[0].checksum;
  const res = V(w);
  assert.equal(res.report.ok, false);
  assert.ok(res.diagnostics.some((d) => d.rule_id === 'STRUCTURAL'));
});

test('reg: inverse relation with wrong predicate → ASV-REL-002', () => {
  const a = clone(load('valid/minimal-work.json'));
  a.relations = [{ predicate: 'isSupplementTo', target_id: 'fixt-b' }];
  const b = clone(load('valid/minimal-work.json'));
  b.id = 'fixt-b'; b.slug = 'a-fictitious-b'; b.doi_concept = '10.5555/example.b.concept';
  b.versions[0].id = 'fixt-b-v1'; b.versions[0].doi_version = '10.5555/example.b.v1';
  b.relations = [{ predicate: 'isSupplementTo', target_id: a.id }]; // wrong inverse
  assert.ok(has(V({ record_kind: 'corpus', works: [a, b] }), 'ASV-REL-002'));
});

test('reg: ams:supersedes → ASV-REL-006', () => {
  const w = clone(load('valid/minimal-work.json'));
  w.relations = [{ predicate: 'ams:supersedes', target_id: 'fixt-x' }];
  assert.ok(has(V(w), 'ASV-REL-006'));
});

test('reg: relatedWork → ASV-REL-001', () => {
  const w = clone(load('valid/minimal-work.json'));
  w.relations = [{ predicate: 'relatedWork', target_id: 'fixt-x' }];
  assert.ok(has(V(w), 'ASV-REL-001'));
});

test('reg: enc language → ASV-WORK-007', () => {
  const w = clone(load('valid/minimal-work.json'));
  w.language = 'enc';
  assert.ok(has(V(w), 'ASV-WORK-007', 'ERROR'));
});

test('reg: AI in provenance intellectual_author → ASV-PROV-001', () => {
  assert.ok(has(V(load('invalid/authorship-bad.json')), 'ASV-PROV-001'));
});

test('reg: exception without expiry is inert (lint)', () => {
  const problems = lintExceptions([{ id: 'EXC-2026-009', rules: ['ASV-WORK-007'], justification: 'x', scope: { work_ids: ['fixt-1'] }, evidence: 'e' }]);
  assert.ok(problems.some((p) => p.includes('missing expiry')));
});

test('reg: global (empty-scope) exception is inert (lint)', () => {
  const problems = lintExceptions([{ id: 'EXC-2026-010', rules: ['ASV-WORK-007'], justification: 'x', scope: {}, expires: '2099-01-01', evidence: 'e' }]);
  assert.ok(problems.some((p) => p.includes('global')));
});

test('reg: incomplete atomic release (not frozen) → ASV-RLS-001', () => {
  const r = clone(load('valid/release-ok.json'));
  r.outgoing.frozen = false;
  assert.ok(has(V(r), 'ASV-RLS-001'));
});

test('reg: withdrawn noindex → ASV-WD-003', () => {
  const w = clone(load('valid/withdrawn-tombstone.json'));
  w.withdrawal.noindex = true;
  assert.ok(has(V(w), 'ASV-WD-003'));
});
