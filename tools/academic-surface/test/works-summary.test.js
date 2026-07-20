// Editorial Charter III.3 — index summary policy. The /works index prefers an
// explicit authorial `summary` field (verbatim) and otherwise falls back to the
// deterministic first-sentence extract. Never a paraphrase; never a fabrication.
// This guards the summary-selection branch so the extract path stays intentional.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { toWorksIndexHTML, summaryText } from '../src/works-index.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SSOT = join(HERE, '..', 'content', 'pilot', 'declaration-layers', 'work.json');
const pilot = JSON.parse(readFileSync(SSOT, 'utf8'));

test('III.3: authorial summary is preferred verbatim over the abstract extract', () => {
  const w = { ...pilot, summary: 'A one-line authored summary of the record.' };
  assert.equal(summaryText(w), 'A one-line authored summary of the record.');
  const html = toWorksIndexHTML([w]);
  assert.ok(html.includes('A one-line authored summary of the record.'));
});

test('III.3: without a summary field, the first-sentence extract is used', () => {
  assert.equal('summary' in pilot, false, 'pilot fixture must have no summary field');
  const expected = pilot.abstract.replace(/\s*\n\s*/g, ' ').trim().match(/^(.*?\.)(\s|$)/)[1].trim();
  assert.equal(summaryText(pilot), expected);
  assert.ok(toWorksIndexHTML([pilot]).includes(expected));
});

test('III.3: an empty/whitespace summary falls back to the extract, never blank', () => {
  assert.equal(summaryText({ ...pilot, summary: '   ' }), summaryText(pilot));
  assert.notEqual(summaryText(pilot), '');
});
