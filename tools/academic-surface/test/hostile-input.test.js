// Regression guards for adversarial SSOT content reaching a generated surface.
//
// The defect these lock down was real and shipped: JSON.stringify does not escape
// `<`, so a Work whose title, abstract, or keyword contained the literal
// `</script>` terminated the JSON-LD block early and spilled the rest of the
// record into the document as live markup — a broken metadata block and an
// injection on a published record. See src/lib/html.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { toLandingHTML } from '../src/landing.js';
import { toWorksIndexHTML } from '../src/works-index.js';
import { esc, stableJson, jsonLdBody } from '../src/lib/html.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const PILOT = join(HERE, '..', 'content', 'pilot', 'declaration-layers', 'work.json');
const pilot = JSON.parse(readFileSync(PILOT, 'utf8'));

const PAYLOAD = '</script><img src=x onerror=alert(1)>';

function hostile(overrides) {
  return { ...structuredClone(pilot), ...overrides };
}

test('landing: a </script> payload in the abstract cannot break out of the JSON-LD block', () => {
  const html = toLandingHTML(hostile({ abstract: `Probe ${PAYLOAD} end.` }));
  const closers = (html.match(/<\/script>/g) ?? []).length;
  assert.equal(closers, 3, 'expected exactly the 3 script elements the landing emits');
  assert.doesNotMatch(html, /<img src=x/, 'raw markup must never appear unescaped');
});

test('landing: a </script> payload in the title cannot break out of the JSON-LD block', () => {
  const html = toLandingHTML(hostile({ title: `Title ${PAYLOAD}` }));
  assert.equal((html.match(/<\/script>/g) ?? []).length, 3);
  assert.doesNotMatch(html, /<img src=x/);
});

test('landing: a </script> payload in a keyword cannot break out of the JSON-LD block', () => {
  const html = toLandingHTML(hostile({ keywords: [...pilot.keywords, PAYLOAD] }));
  assert.equal((html.match(/<\/script>/g) ?? []).length, 3);
  assert.doesNotMatch(html, /<img src=x/);
});

test('works index: a </script> payload in a listed work cannot break out', () => {
  const html = toWorksIndexHTML([hostile({ title: `Title ${PAYLOAD}` })]);
  assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<img src=x/);
});

test('every embedded JSON-LD block still parses after escaping', () => {
  const html = toLandingHTML(hostile({ abstract: `Probe ${PAYLOAD} end.` }));
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length >= 2, 'expected the record graph and the page graph');
  for (const [, body] of blocks) {
    assert.doesNotThrow(() => JSON.parse(body), 'escaped JSON-LD must remain valid JSON');
  }
});

test('jsonLdBody escapes < while preserving the parsed value exactly', () => {
  const value = { a: '</script>', b: 'x < y', c: ['<b>'] };
  const body = jsonLdBody(value);
  assert.doesNotMatch(body, /</, 'no raw < may survive in the byte stream');
  assert.deepEqual(JSON.parse(body), value, 'the parsed value must be unchanged');
});

test('esc covers the five HTML-significant characters', () => {
  assert.equal(esc(`&<>"'`), '&amp;&lt;&gt;&quot;&#39;');
  assert.equal(esc(null), '');
  assert.equal(esc(undefined), '');
});

test('stableJson is key-order independent', () => {
  assert.equal(stableJson({ b: 1, a: 2 }), stableJson({ a: 2, b: 1 }));
  assert.equal(stableJson({ a: 1 }, { trailingNewline: true }).endsWith('\n'), true);
});
