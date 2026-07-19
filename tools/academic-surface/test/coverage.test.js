// Catalog integrity + diagnostic-id hygiene.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { validate } from '../src/index.js';
import { RULE_IDS, RULES } from '../src/rules-catalog.js';
import { load, FX, AS_OF } from './helpers.js';

const NON_ASV = new Set(['STRUCTURAL', 'EXCEPTION-LINT', 'VALIDATOR-ERROR']);
const ID_RE = /^ASV-[A-Z]+-\d{3}$/;

test('catalog holds exactly 73 rules with well-formed ids', () => {
  assert.equal(RULE_IDS.length, 73);
  for (const id of RULE_IDS) {
    assert.ok(ID_RE.test(id), `bad id: ${id}`);
    assert.ok(RULES[id].level && RULES[id].severity && RULES[id].summary);
  }
});

test('every emitted diagnostic references a known rule id (no typos, no orphans)', () => {
  const files = [];
  for (const sub of ['valid', 'invalid']) {
    for (const f of readdirSync(join(FX, sub))) if (f.endsWith('.json')) files.push(`${sub}/${f}`);
  }
  const fired = new Set();
  for (const rel of files) {
    const res = validate(load(rel), { asOf: AS_OF });
    for (const d of res.diagnostics) {
      assert.ok(RULES[d.rule_id] || NON_ASV.has(d.rule_id), `unknown rule id emitted: ${d.rule_id} (${rel})`);
      if (RULES[d.rule_id]) fired.add(d.rule_id);
    }
  }
  // Sanity: fixtures alone exercise a broad slice of the catalog.
  assert.ok(fired.size >= 15, `too few rules fired by fixtures: ${fired.size}`);
});
