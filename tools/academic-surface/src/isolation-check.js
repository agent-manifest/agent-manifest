// Reproducible isolation guard (no Jekyll/Ruby required). Fails if the module
// would leak into the published site: not excluded from Jekyll, present in a
// built _site, referenced by the public sitemap/robots, or exposing Jekyll front
// matter that would turn a module file into a page.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = join(HERE, '..');           // tools/academic-surface
const REPO_ROOT = join(HERE, '..', '..', '..'); // agent-manifest

export function checkIsolation(repoRoot = REPO_ROOT) {
  const problems = [];

  // 1) _config.yml excludes `tools`
  const cfgPath = join(repoRoot, '_config.yml');
  if (!existsSync(cfgPath)) {
    problems.push('_config.yml not found; cannot confirm Jekyll exclusion');
  } else {
    const cfg = readFileSync(cfgPath, 'utf8');
    if (!excludesTools(cfg)) problems.push('_config.yml does not exclude `tools` from the Jekyll build');
    if (blockHasTools(cfg, 'include')) problems.push('_config.yml `include:` re-adds tools');
  }

  // 2) if a build exists, _site must not contain tools/
  const siteTools = join(repoRoot, '_site', 'tools');
  if (existsSync(siteTools)) problems.push('_site/tools exists: module leaked into the build');

  // 3) committed sitemap/robots must not reference the module
  for (const f of ['sitemap.xml', 'robots.txt']) {
    const fp = join(repoRoot, f);
    if (existsSync(fp) && /\/tools\//.test(readFileSync(fp, 'utf8'))) {
      problems.push(`${f} references /tools/`);
    }
  }

  // 4) no Jekyll front matter in module .md/.html (would become a page)
  for (const file of walk(MODULE_DIR)) {
    if (!/\.(md|html)$/i.test(file)) continue;
    const head = readFileSync(file, 'utf8').slice(0, 4);
    if (head.startsWith('---')) problems.push(`${relative(repoRoot, file)} starts with Jekyll front matter`);
  }

  return { ok: problems.length === 0, problems };
}

function excludesTools(cfg) {
  return blockHasTools(cfg, 'exclude');
}

// Extract a top-level YAML list block (`key:` followed by `- item` lines) and
// report whether it contains a `tools` item. Scoped so an adjacent block's
// items are never matched by mistake.
function blockHasTools(cfg, key) {
  const m = cfg.match(new RegExp(`^${key}:\\s*\\n((?:[ \\t]*-[ \\t]*.+\\n?)+)`, 'm'));
  if (!m) return false;
  return /^[ \t]*-[ \t]*tools\/?[ \t]*$/m.test(m[1]);
}

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

if (import.meta.url === `file://${process.argv[1]}`) {
  const { ok, problems } = checkIsolation();
  if (ok) {
    console.log('isolation-check: OK — module is excluded and does not leak into the site.');
    process.exit(0);
  }
  console.error('isolation-check: FAIL');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
