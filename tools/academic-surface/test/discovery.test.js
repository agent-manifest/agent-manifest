// Guards the hand-maintained discovery surface against the published corpus.
//
// sitemap.xml, robots.txt and llms.txt are written by hand and were never checked
// against what is actually published: the sitemap listed 12 of 41 indexable URLs
// and pointed at the slash-less Work URLs, which 301-redirect. Publishing a third
// Work without editing two files would have left it undiscoverable with a green
// build. These tests make the corpus and its discovery surface fail together.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { discoverSsots } from '../src/publish-site.js';
import { isPublished, worksUrl, BASE_URL } from '../src/lib/canonical.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..', '..', '..');
const sitemap = readFileSync(join(REPO_ROOT, 'sitemap.xml'), 'utf8');
const robots = readFileSync(join(REPO_ROOT, 'robots.txt'), 'utf8');
const llms = readFileSync(join(REPO_ROOT, 'llms.txt'), 'utf8');

const published = discoverSsots()
  .map((p) => JSON.parse(readFileSync(p, 'utf8')))
  .filter(isPublished);

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

test('there is at least one published Work to check against', () => {
  assert.ok(published.length > 0);
});

test('every published Work appears in the sitemap at its canonical URL', () => {
  for (const w of published) {
    assert.ok(locs.includes(worksUrl(w.slug)), `sitemap is missing ${worksUrl(w.slug)}`);
  }
});

test('every published Work appears in llms.txt at its canonical URL', () => {
  for (const w of published) {
    assert.ok(llms.includes(worksUrl(w.slug)), `llms.txt is missing ${worksUrl(w.slug)}`);
  }
});

test('every published Work version DOI appears in llms.txt', () => {
  for (const w of published) {
    const doi = (w.versions ?? []).find((v) => v.is_current)?.doi_version;
    assert.ok(doi, `${w.slug} has no current version DOI`);
    assert.ok(llms.includes(doi), `llms.txt is missing DOI ${doi} for ${w.slug}`);
  }
});

test('no sitemap entry uses the slash-less Work form that 301-redirects', () => {
  for (const w of published) {
    const bare = `${BASE_URL}/works/${w.slug}`;
    assert.ok(!locs.includes(bare), `${bare} redirects; the canonical form carries a trailing slash`);
  }
});

test('sitemap entries are absolute URLs on the canonical host and unique', () => {
  assert.ok(locs.length > 0, 'sitemap is empty');
  for (const l of locs) assert.ok(l.startsWith(`${BASE_URL}/`), `not canonical-host absolute: ${l}`);
  assert.equal(new Set(locs).size, locs.length, 'duplicate <loc> entries');
});

test('the sitemap never exposes the internal tooling path', () => {
  assert.doesNotMatch(sitemap, /\/tools\//);
  assert.doesNotMatch(robots, /Allow:\s*\/tools\//);
});

test('the sitemap lists no source-Markdown URL', () => {
  for (const l of locs) assert.ok(!l.endsWith('.md'), `source Markdown in the sitemap: ${l}`);
});

test('robots.txt declares the sitemap and suppresses the citation byproduct page', () => {
  assert.match(robots, new RegExp(`Sitemap: ${BASE_URL}/sitemap\\.xml`));
  assert.match(robots, /Disallow: \/works\/\*\/cite\.html/);
});

test('every sitemap entry that is a repo-served directory URL exists on disk', () => {
  for (const l of locs) {
    const rel = l.replace(`${BASE_URL}`, '');
    if (!rel.startsWith('/works/')) continue; // only the generated tree is on disk as-is
    const p = join(REPO_ROOT, rel, 'index.html');
    assert.ok(existsSync(p), `sitemap lists ${l} but ${rel}index.html does not exist`);
  }
});
