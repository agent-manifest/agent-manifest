// Guards that fixtures stay fictitious: no real Works/DOIs, always test_fixture.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FX } from './helpers.js';

function allFixtureFiles() {
  const files = [];
  for (const sub of ['valid', 'invalid']) {
    for (const f of readdirSync(join(FX, sub))) if (f.endsWith('.json')) files.push(join(FX, sub, f));
  }
  return files;
}

test('no fixture uses a real Zenodo DOI prefix (10.5281) or real record URLs', () => {
  for (const file of allFixtureFiles()) {
    const raw = readFileSync(file, 'utf8');
    assert.ok(!raw.includes('10.5281'), `${file} references a real Zenodo DOI prefix`);
    assert.ok(!raw.includes('zenodo.org/records'), `${file} references a real Zenodo record URL`);
  }
});

test('every Work fixture is flagged test_fixture:true', () => {
  for (const file of allFixtureFiles()) {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    const works = data.record_kind === 'corpus' ? data.works : data.record_kind === 'release' ? [] : [data];
    for (const w of works) {
      assert.equal(w.test_fixture, true, `${file}: work ${w.id} not flagged test_fixture`);
    }
  }
});
