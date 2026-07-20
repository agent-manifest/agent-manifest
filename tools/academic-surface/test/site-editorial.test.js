// Guards the single-source property of the editorial layer.
//
// Before the site stylesheet existed, the same tokens and chrome were maintained
// by hand in three separate <style> blocks (src/lib/editorial.js, the Home, and
// the Specification) and had accumulated 23 silent divergences — different
// --page-max, a missing spacing scale, three different boundary-rule offsets, an
// incomplete reduced-motion rule. Nothing in CI could see any of it. These tests
// make that class of drift impossible to reintroduce.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { checkCss, CSS_PATH } from '../src/build-css.js';
import { EDITORIAL_STYLE, SITE_STYLESHEET, FONT_LINKS, FONT_LINKS_SPEC } from '../src/lib/editorial.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..', '..', '..');
const HOME = join(REPO_ROOT, 'index.html');
const SPEC = join(REPO_ROOT, 'spec', 'v1.0', 'agent_manifest_v1.0.html');
const CHARTER = join(HERE, '..', 'docs', 'EDITORIAL-SYSTEM-v2.1.md');

const home = readFileSync(HOME, 'utf8');
const spec = readFileSync(SPEC, 'utf8');

test('the committed site stylesheet matches its source module', () => {
  const r = checkCss();
  assert.equal(r.ok, true, `${r.reason} — run \`npm run build-css\``);
});

test('the site stylesheet is served from the repo root, not from tools/', () => {
  assert.ok(existsSync(CSS_PATH), 'assets/css/editorial.css must exist');
  assert.doesNotMatch(CSS_PATH.replaceAll('\\', '/'), /\/tools\//);
});

for (const [name, html] of [['Home', home], ['Specification', spec]]) {
  test(`${name} links the shared stylesheet`, () => {
    assert.match(html, /<link rel="stylesheet" href="\/assets\/css\/editorial\.css">/);
  });

  test(`${name} declares no design tokens of its own`, () => {
    assert.doesNotMatch(html, /:root\s*\{/, 'tokens live only in the shared source');
    assert.doesNotMatch(html, /--paper\s*:/, 'no token may be redeclared on a surface');
  });

  test(`${name} carries the boundary rule exactly once (charter II.15)`, () => {
    const n = (html.match(/class="boundary-rule"/g) ?? []).length;
    assert.equal(n, 1, `expected one boundary rule, found ${n}`);
  });

  test(`${name} carries exactly one h1`, () => {
    const n = (html.match(/<h1[\s>]/g) ?? []).length;
    assert.equal(n, 1, `expected one h1, found ${n}`);
  });

  test(`${name} provides the accessibility scaffolding (charter II.14)`, () => {
    assert.match(html, /class="skip" href="#main"/);
    assert.match(html, /id="main"/);
    assert.match(html, /<html lang="en">/);
  });
}

test('the Specification keeps its own archetype, not the record chrome', () => {
  assert.match(spec, /<body class="spec">/);
  assert.match(spec, /class="cover"/, 'the normative document keeps its cover');
  assert.match(spec, /class="rfc"/, 'RFC 2119 keywords stay in the machine register');
  assert.match(spec, /class="sec-title"/, 'numbered normative section headings');
});

test('the Home keeps its own archetype, not the documentation chrome', () => {
  assert.match(home, /<body class="home">/);
  assert.match(home, /class="hero"/, 'the Home opens on a hero, not a SiteHeader');
  assert.doesNotMatch(home, /<header class="site">/, 'the Home has no SiteHeader (charter II.11)');
  assert.match(home, /class="dir"/, 'the Home directory is the LinkList component');
});

test('every non-home surface carries the SiteHeader and a breadcrumb (charter II.11)', () => {
  for (const [name, html] of [['Specification', spec]]) {
    assert.match(html, /<header class="site">/, `${name} SiteHeader`);
    assert.match(html, /<nav class="breadcrumb" aria-label="Breadcrumb">/, `${name} breadcrumb`);
  }
});

test('the record stylesheet carries no staging vocabulary', () => {
  assert.doesNotMatch(EDITORIAL_STYLE, /staging/i);
});

test('the archetype layers never leak into an inlined record stylesheet', () => {
  for (const cls of ['.doc ', '.home ', '.spec ']) {
    assert.ok(!EDITORIAL_STYLE.includes(cls), `${cls} must live only in the site stylesheet`);
    assert.ok(SITE_STYLESHEET.includes(cls), `${cls} must be present in the site stylesheet`);
  }
});

test('the charter token block and the machine mirror agree (charter VI.2)', () => {
  const charter = readFileSync(CHARTER, 'utf8');
  const block = charter.match(/:root\{([\s\S]*?)\}\s*```/);
  assert.ok(block, 'Appendix A token block not found in the charter');
  const names = [...block[1].matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
  assert.ok(names.length > 15, 'expected the full token set');
  for (const n of names) {
    assert.ok(EDITORIAL_STYLE.includes(`${n}:`), `token ${n} is in the charter but not in editorial.js`);
  }
});

test('the two font weight sets are derived from one definition', () => {
  assert.match(FONT_LINKS, /DM\+Sans:wght@300;400;500&/);
  assert.match(FONT_LINKS_SPEC, /DM\+Sans:wght@300;400;500;600;700&/);
  assert.equal(FONT_LINKS.split('\n').length, FONT_LINKS_SPEC.split('\n').length);
});
