// Gate D4 (local staging) — tests for the human landing page and the servable,
// non-indexable staging assembly of the pilot amw-014. Real pilot data, outside
// fixtures/. No network, no clock. Determinism, accessibility invariants, metadata
// fidelity, PDF fixity, and the staging-only (never permanent) noindex property.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, rmSync, mkdtempSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { toLandingHTML } from '../src/landing.js';
import { buildStaging } from '../src/build-site.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = join(HERE, '..');
const REPO_ROOT = join(HERE, '..', '..', '..');
const PILOT = join(MODULE_DIR, 'content', 'pilot', 'declaration-layers');
const SSOT = join(PILOT, 'work.json');
const work = JSON.parse(readFileSync(SSOT, 'utf8'));
const cur = work.versions.find((v) => v.is_current);

// ---- landing generator -----------------------------------------------------

test('D4: landing HTML is deterministic (same input -> same bytes)', () => {
  assert.equal(toLandingHTML(work), toLandingHTML(work));
  assert.equal(toLandingHTML(work, { staging: true }), toLandingHTML(work, { staging: true }));
});

test('D4: canonical landing carries NO noindex (never a permanent property)', () => {
  const html = toLandingHTML(work); // production-faithful
  assert.ok(!/name="robots"/.test(html), 'canonical landing must not declare robots meta');
  assert.ok(!/noindex/.test(html), 'canonical landing must not contain noindex');
});

test('D4: staging variant injects a TEMPORARY noindex + banner only', () => {
  const html = toLandingHTML(work, { staging: true });
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(html, /STAGING ONLY: temporary index suppression/);
  assert.match(html, /Local staging preview — not published, not indexable/);
  // The production landing carries no staging vocabulary at all.
  assert.ok(!toLandingHTML(work).toLowerCase().includes('staging'), 'production landing must contain no staging markers');
});

test('D4: landing structure & accessibility invariants', () => {
  const html = toLandingHTML(work);
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.equal((html.match(/<h1/g) ?? []).length, 1, 'exactly one h1');
  assert.match(html, /<a class="skip" href="#main">/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /<header class="site">/);
  assert.match(html, /<footer class="site">/);
  assert.match(html, /aria-labelledby=/);
  // no raw <img> without alt (there are no images, but assert none slipped in)
  assert.ok(!/<img(?![^>]*\balt=)/.test(html), 'any <img> must have alt');
});

test('D4: landing embeds citation_*, JSON-LD ScholarlyArticle, canonical, OG, signposting', () => {
  const html = toLandingHTML(work);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://agent-manifest-spec.org/works/${work.slug}/">`));
  assert.match(html, /<meta name="citation_title" content="Declaration Layers and the Evaluation of Agent Boundaries">/);
  assert.match(html, new RegExp(`<meta name="citation_doi" content="${cur.doi_version}">`));
  assert.match(html, /<meta name="citation_publication_date" content="2026\/03\/05">/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /<link rel="cite-as"/);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(ld['@type'], 'ScholarlyArticle');
  assert.equal(ld.url, `https://agent-manifest-spec.org/works/${work.slug}/`);
});

test('D4: landing has no AI attribution, no local paths, no tool provenance', () => {
  const html = toLandingHTML(work);
  for (const bad of ['Co-Authored', 'claude', 'anthropic', '🤖', '/Users/', 'build_activity', 'Gate C validator', 'methodological_notes']) {
    assert.ok(!html.includes(bad), `landing must not contain: ${bad}`);
  }
});

// ---- staging assembly ------------------------------------------------------

test('D4: staging assembles a faithful, non-indexable /works/<slug>/ preview', () => {
  const out = mkdtempSync(join(tmpdir(), 'am-stage-'));
  try {
    const r = buildStaging({ ssotPath: SSOT, outRoot: out });
    assert.equal(r.slug, work.slug);
    // faithful directory: landing + PDF + 12 metadata files co-located
    assert.ok(existsSync(join(r.outDir, 'index.html')));
    assert.ok(existsSync(join(r.outDir, 'declaration-layers.pdf')));
    assert.equal(r.metadata.length, 12);
    for (const f of r.metadata) assert.ok(existsSync(join(r.outDir, f)), `missing ${f}`);
    // staging-only index suppression
    assert.ok(existsSync(join(out, 'robots.txt')));
    assert.match(readFileSync(join(out, 'robots.txt'), 'utf8'), /Disallow: \//);
    assert.match(readFileSync(join(r.outDir, 'index.html'), 'utf8'), /noindex/);
    assert.equal(r.noindex.temporary, true);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('D4: metadata <-> PDF fixity verified against the SSOT checksum', () => {
  const out = mkdtempSync(join(tmpdir(), 'am-stage-'));
  try {
    const r = buildStaging({ ssotPath: SSOT, outRoot: out });
    assert.equal(r.fixity.checked, true);
    assert.equal(r.fixity.ok, true);
    assert.equal(r.fixity.algorithm, 'sha-256');
    const staged = readFileSync(join(r.outDir, 'declaration-layers.pdf'));
    const sha = createHash('sha256').update(staged).digest('hex');
    assert.equal(sha, cur.artifacts[0].checksum, 'staged PDF must match SSOT checksum');
    assert.equal(staged.length, cur.artifacts[0].bytes, 'staged PDF must match SSOT byte count');
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('D4: staging is deterministic (identical bytes across rebuilds)', () => {
  const a = mkdtempSync(join(tmpdir(), 'am-stage-a-'));
  const b = mkdtempSync(join(tmpdir(), 'am-stage-b-'));
  try {
    const ra = buildStaging({ ssotPath: SSOT, outRoot: a });
    const rb = buildStaging({ ssotPath: SSOT, outRoot: b });
    for (const f of ['index.html', ...ra.metadata]) {
      assert.equal(readFileSync(join(ra.outDir, f)).toString(), readFileSync(join(rb.outDir, f)).toString(), `nondeterministic: ${f}`);
    }
    void rb;
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

test('D4: staging is confined and non-indexable, distinct from the public tree', () => {
  // Staging writes only under its own root and is temporarily non-indexable; it
  // must never contaminate the separate, indexable public /works surface.
  const out = mkdtempSync(join(tmpdir(), 'am-stage-'));
  try {
    const r = buildStaging({ ssotPath: SSOT, outRoot: out });
    assert.ok(r.outDir.startsWith(out), 'staging output must be confined to its own root');
    assert.equal(existsSync(join(REPO_ROOT, '_site')), false, 'no Jekyll build artifact expected');
    // The staged landing carries a temporary staging noindex.
    const staged = readFileSync(join(r.outDir, 'index.html'), 'utf8');
    assert.match(staged, /name="robots"[^>]*noindex/, 'staged landing must be temporarily noindex');
    // The published landing (if materialized) is the distinct, indexable surface.
    const pub = join(REPO_ROOT, 'works', 'declaration-layers', 'index.html');
    if (existsSync(pub)) assert.doesNotMatch(readFileSync(pub, 'utf8'), /name="robots"[^>]*noindex/, 'public landing must not be noindex');
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
