// Regression guards for three gaps in the publication path.
//
// 1. buildStaging silently skipped fixity when the declared artifact was absent:
//    it produced a preview without the artifact, reported fixity FAIL, and exited 0.
// 2. checkPublic only ever looked for one stray name (README.md), so a leftover
//    older PDF or an editor backup inside a published slug passed --check clean
//    and was served publicly.
// 3. publishSite never ran the validator, so a Work added after the pilots could
//    reach the public tree without passing a single ASV rule.

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { publishSite, checkPublic, discoverSsots } from '../src/publish-site.js';
import { buildStaging } from '../src/build-site.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = join(HERE, '..');
const SSOT = join(MODULE_DIR, 'content', 'pilot', 'declaration-layers', 'work.json');

function tmp() {
  return mkdtempSync(join(tmpdir(), 'am-publish-'));
}

test('checkPublic detects a stray file inside a published slug', () => {
  const root = tmp();
  try {
    publishSite({ ssotPaths: [SSOT], repoRoot: root });
    assert.equal(checkPublic({ ssotPaths: [SSOT], repoRoot: root }).ok, true, 'baseline must be clean');

    writeFileSync(join(root, 'works', 'declaration-layers', 'declaration-layers-v0.pdf'), 'leftover');
    const r = checkPublic({ ssotPaths: [SSOT], repoRoot: root });
    assert.equal(r.ok, false, 'a leftover file must fail the check');
    assert.ok(
      r.stray.some((s) => s.includes('declaration-layers-v0.pdf')),
      `expected the stray to be reported, got ${JSON.stringify(r.stray)}`
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('checkPublic still accepts the declared artifact itself', () => {
  const root = tmp();
  try {
    publishSite({ ssotPaths: [SSOT], repoRoot: root });
    const r = checkPublic({ ssotPaths: [SSOT], repoRoot: root });
    assert.equal(r.ok, true, `the artifact must not be reported as stray: ${JSON.stringify(r.stray)}`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('buildStaging throws when a declared artifact is missing instead of exiting clean', () => {
  const src = dirname(SSOT);
  const work = join(tmp(), 'declaration-layers');
  try {
    cpSync(src, work, { recursive: true });
    const w = JSON.parse(readFileSync(join(work, 'work.json'), 'utf8'));
    const artifact = w.versions.find((v) => v.is_current).artifacts[0].path.split('/').pop();
    rmSync(join(work, artifact));

    assert.throws(
      () => buildStaging({ ssotPath: join(work, 'work.json') }),
      /Artifact missing/,
      'a declared artifact that is not on disk is a fixity failure'
    );
  } finally {
    rmSync(dirname(work), { recursive: true, force: true });
  }
});

test('publishSite refuses a Work that fails validation', () => {
  const root = tmp();
  const src = dirname(SSOT);
  const workDir = join(tmp(), 'declaration-layers');
  try {
    cpSync(src, workDir, { recursive: true });
    const p = join(workDir, 'work.json');
    const w = JSON.parse(readFileSync(p, 'utf8'));
    w.authors[0].orcid = 'not-an-orcid';
    writeFileSync(p, JSON.stringify(w, null, 2));

    assert.throws(
      () => publishSite({ ssotPaths: [p], repoRoot: root, asOf: '2026-07-20' }),
      /Refusing to publish/,
      'an invalid Work must never reach the public tree'
    );
    assert.equal(existsSync(join(root, 'works', 'declaration-layers', 'index.html')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(dirname(workDir), { recursive: true, force: true });
  }
});

test('the published corpus is exactly the SSOTs that declare themselves published', () => {
  const all = discoverSsots().map((p) => JSON.parse(readFileSync(p, 'utf8')));
  const pub = all.filter((w) => w.visibility === 'public' && w.status === 'published');
  assert.equal(pub.length, all.length, 'an unpublished SSOT is present; confirm it is intentional');
});
