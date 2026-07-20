// Regression guard for the published Specification HTML
// (spec/v1.0/agent_manifest_v1.0.html). A representation repair removed 36 literal
// Markdown ``` fences, de-fragmented the §5.1 layered-model diagram, and restored
// the Annex A/B JSON blocks to valid JSON (smart-quote delimiters -> ASCII, one
// unescaped \d escaped). These tests keep those defects from returning. They check
// representation only; no normative text, schema, or MUST/SHOULD/MAY is inspected.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SPEC = join(HERE, '..', '..', '..', 'spec', 'v1.0', 'agent_manifest_v1.0.html');
const html = readFileSync(SPEC, 'utf8');

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

test('spec: contains no literal Markdown ``` fences', () => {
  const count = (html.match(/```/g) ?? []).length;
  assert.equal(count, 0, `${count} literal fence marker(s) found`);
});

test('spec: every <pre><code> JSON block is valid JSON', () => {
  const blocks = [...html.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)].map((m) => decodeEntities(m[1]));
  const jsonBlocks = blocks.filter((b) => b.trim().startsWith('{'));
  assert.ok(jsonBlocks.length >= 2, `expected the Annex A + Annex B JSON blocks, found ${jsonBlocks.length}`);
  for (const b of jsonBlocks) {
    assert.doesNotThrow(() => JSON.parse(b), `invalid JSON block:\n${b.slice(0, 120)}…`);
  }
});

test('spec: the JSON blocks use ASCII quotes, not smart quotes, as delimiters', () => {
  const blocks = [...html.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)].map((m) => m[1]);
  for (const b of blocks.filter((x) => x.trim().startsWith('{'))) {
    assert.doesNotMatch(b, /[“”]/, 'smart double-quotes present inside a JSON code block');
  }
});

test('spec: the §5.1 ascii diagram is one contiguous block (not fence-split)', () => {
  const m = html.match(/<div class="ascii-diagram">([\s\S]*?)<\/div>/);
  assert.ok(m, 'ascii-diagram not found');
  const body = m[1];
  assert.doesNotMatch(body, /```/, 'a fence marker is inside the diagram');
  assert.doesNotMatch(body, /\n[ \t]*\n/, 'a blank line splits the diagram');
  // top border joins directly to the first row (no interruption)
  assert.match(body, /^\+[-]+\+\n\|/, 'diagram top border is not followed directly by a row');
});
