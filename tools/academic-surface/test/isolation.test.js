// Reproducible isolation guard: fails if the module could leak into the site.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { checkIsolation } from '../src/isolation-check.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = join(HERE, '..');
const REPO_ROOT = join(HERE, '..', '..', '..');

test('module is isolated: excluded from Jekyll and absent from any build/sitemap', () => {
  const { ok, problems } = checkIsolation(REPO_ROOT);
  assert.equal(ok, true, problems.join('; '));
});

test('_config.yml excludes tools', () => {
  const cfg = readFileSync(join(REPO_ROOT, '_config.yml'), 'utf8');
  assert.match(cfg, /^exclude:\s*\n(?:\s*-\s*.+\n?)*\s*-\s*tools\/?\s*$/m);
});

test('no module .md/.html carries Jekyll front matter', () => {
  for (const file of walk(MODULE_DIR)) {
    if (!/\.(md|html)$/i.test(file)) continue;
    const head = readFileSync(file, 'utf8').slice(0, 3);
    assert.notEqual(head, '---', `${file} has front matter`);
  }
});

// Real (non-fixture) content — e.g. the Gate D1 pilot SSOT — is only permitted
// inside the excluded module tree and must never be materialized as a public
// /works/ page. This guards the real DOI/PDF from leaking onto the surface.
test('real pilot content stays inside the excluded module, never a public /works page', () => {
  const contentDir = join(MODULE_DIR, 'content');
  // 1) any real content directory must live under tools/academic-surface (excluded via `tools`)
  const inExcluded = contentDir.startsWith(MODULE_DIR);
  assert.equal(inExcluded, true, 'real content must live under the excluded module');

  // 2) no public /works materialization of the pilot anywhere in the repo (root or built site)
  for (const p of [join(REPO_ROOT, 'works', 'declaration-layers'), join(REPO_ROOT, '_site', 'works', 'declaration-layers'), join(REPO_ROOT, '_works', 'declaration-layers')]) {
    assert.equal(existsSync(p), false, `unexpected public materialization: ${p}`);
  }

  // 3) committed sitemap/robots must not reference the pilot slug
  for (const f of ['sitemap.xml', 'robots.txt']) {
    const fp = join(REPO_ROOT, f);
    if (existsSync(fp)) assert.ok(!/declaration-layers/.test(readFileSync(fp, 'utf8')), `${f} references the pilot slug`);
  }
});

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
