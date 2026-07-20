// Publication gate — tests for the public materialization (publish-site.js), the
// /works index (works-index.js) and the Existence Compiler layer added to the
// landing. Real pilot data only, outside fixtures/. No network, no clock.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { publishSite, checkPublic, discoverSsots } from '../src/publish-site.js';
import { toWorksIndexHTML, listedWorks } from '../src/works-index.js';
import { toLandingHTML } from '../src/landing.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = join(HERE, '..');
const REPO_ROOT = join(HERE, '..', '..', '..');
const SSOT = join(MODULE_DIR, 'content', 'pilot', 'declaration-layers', 'work.json');
const work = JSON.parse(readFileSync(SSOT, 'utf8'));

const REPRESENTATIONS = [
  'index.html', 'index.json', 'schema.json', 'cite.json', 'cite.bib', 'cite.ris',
  'cite.md', 'cite-apa.txt', 'cite-plain.txt', 'dublin-core.json', 'highwire.json',
  'opengraph.json', 'signposting.json'
];

// --- publish-site materialization ------------------------------------------

test('publish: materializes 13 representations + PDF, no README, indexable landing', () => {
  const root = mkdtempSync(join(tmpdir(), 'am-pub-'));
  try {
    const r = publishSite({ ssotPaths: [SSOT], repoRoot: root });
    assert.equal(r.count, 1);
    const dir = join(root, 'works', 'declaration-layers');
    for (const f of REPRESENTATIONS) assert.ok(existsSync(join(dir, f)), `missing ${f}`);
    assert.ok(existsSync(join(dir, 'declaration-layers.pdf')), 'PDF missing');
    assert.equal(existsSync(join(dir, 'README.md')), false, 'internal README must not be published');
    // Landing is production-faithful: no permanent noindex.
    assert.doesNotMatch(readFileSync(join(dir, 'index.html'), 'utf8'), /name="robots"[^>]*noindex/);
    // Index page exists.
    assert.ok(existsSync(join(root, 'works', 'index.html')));
    // Reported PDF fixity is OK.
    assert.equal(r.published[0].fixity.ok, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('publish: PDF is byte-identical to the internal source (fixity)', () => {
  const root = mkdtempSync(join(tmpdir(), 'am-pub-'));
  try {
    publishSite({ ssotPaths: [SSOT], repoRoot: root });
    const src = readFileSync(join(MODULE_DIR, 'content', 'pilot', 'declaration-layers', 'declaration-layers.pdf'));
    const pub = readFileSync(join(root, 'works', 'declaration-layers', 'declaration-layers.pdf'));
    assert.ok(src.equals(pub), 'published PDF diverges from the internal source');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('publish: deterministic (same SSOT -> identical bytes)', () => {
  const a = mkdtempSync(join(tmpdir(), 'am-pub-a-'));
  const b = mkdtempSync(join(tmpdir(), 'am-pub-b-'));
  try {
    publishSite({ ssotPaths: [SSOT], repoRoot: a });
    publishSite({ ssotPaths: [SSOT], repoRoot: b });
    const files = [...REPRESENTATIONS.map((f) => join('works', 'declaration-layers', f)), join('works', 'index.html')];
    for (const f of files) {
      assert.equal(readFileSync(join(a, f), 'utf8'), readFileSync(join(b, f), 'utf8'), `nondeterministic: ${f}`);
    }
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

test('publish --check: detects drift and passes on a fresh build', () => {
  const root = mkdtempSync(join(tmpdir(), 'am-pub-'));
  try {
    publishSite({ ssotPaths: [SSOT], repoRoot: root });
    assert.equal(checkPublic({ ssotPaths: [SSOT], repoRoot: root }).ok, true);
    // Tamper with a published file -> drift.
    writeFileSync(join(root, 'works', 'declaration-layers', 'cite.bib'), 'tampered\n');
    const bad = checkPublic({ ssotPaths: [SSOT], repoRoot: root });
    assert.equal(bad.ok, false);
    assert.ok(bad.drift.some((n) => n.includes('cite.bib')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('publish --check: a published landing with noindex is rejected', () => {
  const root = mkdtempSync(join(tmpdir(), 'am-pub-'));
  try {
    publishSite({ ssotPaths: [SSOT], repoRoot: root });
    const landing = join(root, 'works', 'declaration-layers', 'index.html');
    writeFileSync(landing, readFileSync(landing, 'utf8').replace('<head>', '<head>\n  <meta name="robots" content="noindex">'));
    const r = checkPublic({ ssotPaths: [SSOT], repoRoot: root });
    assert.equal(r.ok, false);
    assert.ok(r.noindex.length >= 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// Regression guard: the COMMITTED public tree must match the SSOT regeneration.
test('publish --check: the committed /works tree matches the SSOT', () => {
  const r = checkPublic();
  assert.equal(r.ok, true, JSON.stringify({ drift: r.drift, missing: r.missing, stray: r.stray, noindex: r.noindex }));
});

// --- /works index -----------------------------------------------------------

test('works index: deterministic, lists the work, structured, no noindex', () => {
  const a = toWorksIndexHTML([work]);
  const b = toWorksIndexHTML([work]);
  assert.equal(a, b, 'nondeterministic index');
  assert.ok(a.startsWith('<!doctype html>'));
  assert.match(a, /<link rel="canonical" href="https:\/\/agent-manifest-spec\.org\/works\/">/);
  assert.doesNotMatch(a, /name="robots"[^>]*noindex/);
  assert.ok(a.includes(work.title), 'index must list the work title');
  assert.ok(a.includes('/works/declaration-layers'), 'index must link the work');
  const scripts = [...a.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const nodes = scripts.flatMap((g) => g['@graph'] ?? [g]);
  const types = nodes.map((n) => n['@type']);
  for (const t of ['CollectionPage', 'ItemList', 'BreadcrumbList']) assert.ok(types.includes(t), `missing ${t}`);
  const list = nodes.find((n) => n['@type'] === 'ItemList');
  assert.equal(list.numberOfItems, 1);
  assert.equal(list.itemListElement[0].name, work.title);
});

test('works index: only public+published works are listed', () => {
  const draft = JSON.parse(JSON.stringify(work));
  draft.visibility = 'draft';
  assert.equal(listedWorks([draft]).length, 0);
  assert.equal(listedWorks([work]).length, 1);
});

// --- Existence Compiler layer on the landing --------------------------------

test('EC: landing carries author, Twitter summary (no image), breadcrumb, WebPage, history', () => {
  const html = toLandingHTML(work);
  assert.match(html, /<meta name="author" content="Hernán Alfredo Capucci">/);
  assert.match(html, /<meta name="twitter:card" content="summary">/);
  assert.ok(!html.includes('summary_large_image'), 'must not advertise an image we do not have');
  assert.match(html, /<nav class="breadcrumb" aria-label="Breadcrumb">/);
  assert.match(html, /<h2 id="hist-h">Revision history<\/h2>/);
  assert.match(html, /<time datetime="2026-03-05">/);
  // Two JSON-LD blocks: ScholarlyArticle + a graph with WebPage & BreadcrumbList.
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const nodes = scripts.flatMap((g) => g['@graph'] ?? [g]);
  const types = nodes.map((n) => n['@type']);
  for (const t of ['ScholarlyArticle', 'WebPage', 'BreadcrumbList']) assert.ok(types.includes(t), `missing ${t}`);
  const art = nodes.find((n) => n['@type'] === 'ScholarlyArticle');
  assert.equal(art.dateModified, '2026-03-05');
  assert.equal(art.version, 'v1');
  assert.equal(art.mainEntityOfPage, 'https://agent-manifest-spec.org/works/declaration-layers/');
  const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
  assert.equal(bc.itemListElement.length, 3);
  assert.equal(bc.itemListElement[2].name, work.title);
});

test('EC: discoverSsots finds the pilot SSOT', () => {
  const found = discoverSsots();
  assert.ok(found.some((p) => p.endsWith(join('declaration-layers', 'work.json'))));
});
