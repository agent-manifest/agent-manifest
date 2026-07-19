// Reproducible isolation guard: fails if the module could leak into the site.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
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
