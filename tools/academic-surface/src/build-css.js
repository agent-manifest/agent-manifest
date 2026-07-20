// Emits the site stylesheet assets/css/editorial.css from src/lib/editorial.js,
// the charter's machine mirror. Every non-generated surface (Home, Docs, Spec)
// links this one file, so the editorial layer has exactly one source and cannot
// drift the way three hand-maintained <style> blocks did.
//
// Generated pages do NOT link it: a published record is self-contained and
// inlines EDITORIAL_STYLE, which is the same source.
//
// Usage: node src/build-css.js [--check]
//   (no flag)  write the stylesheet
//   --check    exit non-zero if the committed file differs from the source

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SITE_STYLESHEET } from './lib/editorial.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..', '..', '..');
export const CSS_PATH = join(REPO_ROOT, 'assets', 'css', 'editorial.css');

const BANNER = `/* Academic Editorial System — the ecosystem's single stylesheet.
 *
 * GENERATED FILE — do not edit by hand. Its source is the charter's machine
 * mirror, tools/academic-surface/src/lib/editorial.js; regenerate with
 * \`npm run build-css\` from tools/academic-surface. \`npm run build-css -- --check\`
 * fails if this file and the source have diverged.
 *
 * Governing charter: tools/academic-surface/docs/EDITORIAL-SYSTEM-v2.1.md
 * Tokens: charter Appendix A. Components: Part IV. Archetypes: Part V.
 */
`;

export function renderCss() {
  return BANNER + SITE_STYLESHEET;
}

export function checkCss(path = CSS_PATH) {
  const expected = renderCss();
  if (!existsSync(path)) return { ok: false, reason: 'assets/css/editorial.css does not exist' };
  const actual = readFileSync(path, 'utf8');
  return actual === expected
    ? { ok: true }
    : { ok: false, reason: 'assets/css/editorial.css differs from src/lib/editorial.js' };
}

export function writeCss(path = CSS_PATH) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, renderCss());
  return path;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--check')) {
    const r = checkCss();
    if (r.ok) {
      console.log('build-css --check: OK — assets/css/editorial.css matches the source.');
      process.exit(0);
    }
    console.error(`build-css --check: FAIL — ${r.reason}`);
    console.error('  run `npm run build-css` and commit the result.');
    process.exit(1);
  }
  console.log(`build-css: wrote ${writeCss()}`);
}
