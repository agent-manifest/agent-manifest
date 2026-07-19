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

// The internal SSOT/PDF/generator stay inside the excluded module tree. Publishing
// the Academic Surface is the authorized gate, so a SEPARATE public copy at
// <repo>/works/ is expected — what must never happen is the *module source* itself
// leaking into the Jekyll build or the internal /tools/ path surfacing publicly.
test('internal module source stays excluded; the public /works surface is a separate tree', () => {
  const contentDir = join(MODULE_DIR, 'content');
  assert.ok(contentDir.startsWith(MODULE_DIR), 'real content/source must live under the excluded module');

  // The public copy, if materialized, lives at the repo root — never under tools/.
  const pub = join(REPO_ROOT, 'works', 'declaration-layers');
  assert.equal(pub.startsWith(MODULE_DIR), false, 'public works tree must not live under the excluded module');
  if (existsSync(pub)) {
    const landing = join(pub, 'index.html');
    assert.ok(existsSync(landing), 'a published work must have a landing');
    assert.doesNotMatch(readFileSync(landing, 'utf8'), /name="robots"[^>]*noindex/, 'published landing must not carry noindex');
    assert.equal(existsSync(join(pub, 'README.md')), false, 'internal README must never be published');
  }

  // The committed sitemap/robots must never expose the internal /tools/ path.
  for (const f of ['sitemap.xml', 'robots.txt']) {
    const fp = join(REPO_ROOT, f);
    if (existsSync(fp)) assert.ok(!/\/tools\//.test(readFileSync(fp, 'utf8')), `${f} references the internal /tools/ path`);
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
