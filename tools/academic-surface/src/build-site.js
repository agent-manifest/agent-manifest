// Gate D4 (local staging) — assemble a servable, NON-INDEXABLE local preview that
// faithfully mirrors the future public directory /works/<slug>/, without touching
// the public build. Output lives under staging/ (git-ignored, ephemeral). The
// index-suppression here is TEMPORARY staging-only: a robots.txt (Disallow: /) plus
// a noindex meta injected into the staged HTML. Neither is a property of the Work,
// and both must be gone before production.
//
// Deterministic, offline. Verifies PDF fixity against the SSOT (metadata <-> PDF).

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { toLandingHTML } from './landing.js';
import { currentVersion } from './lib/canonical.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = join(HERE, '..');
const BT = '`'; // literal backtick, kept out of nested template literals

// Metadata files copied verbatim from derived/ alongside the staged landing.
const METADATA_FILES = [
  'cite.json', 'cite.bib', 'cite.ris', 'cite-apa.txt', 'cite-plain.txt', 'cite.md',
  'highwire.json', 'schema.json', 'dublin-core.json', 'opengraph.json', 'index.json', 'signposting.json'
];

const ROBOTS = [
  '# Local staging only — NOT the public robots.txt. Blocks all indexing of the',
  '# preview. This file must never be deployed to production.',
  'User-agent: *',
  'Disallow: /',
  ''
].join('\n');

function stagingNote(slug) {
  const c = (s) => BT + s + BT;
  return [
    '# Local staging preview — NOT published',
    '',
    `This directory is an ephemeral, git-ignored local preview of the future public`,
    `path ${c('/works/' + slug + '/')}. It exists only to inspect the pilot before any`,
    'publication decision.',
    '',
    `- **Not indexable:** ${c('robots.txt')} disallows all crawlers and the staged`,
    `  ${c('index.html')} carries a temporary ${c('noindex')} meta. Both are staging-only`,
    `  and must be removed before production. ${c('noindex')} is never a property of the Work.`,
    `- **Not built by Jekyll:** it lives under ${c('tools/')} (excluded) and under`,
    `  ${c('staging/')} (git-ignored). It never reaches the public site.`,
    `- **Regenerated:** produced by ${c('npm run stage')} from the SSOT and ${c('derived/')}.`,
    '  Never hand-edit.',
    '',
    'Serve locally (from the module root) for visual inspection, e.g.:',
    '',
    '    python3 -m http.server -d staging 8081',
    `    # then open http://localhost:8081/works/${slug}/`,
    ''
  ].join('\n');
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/**
 * Build the staging tree. Returns a structured report; throws on fixity failure.
 * @param {object} opts
 * @param {string} opts.ssotPath  path to work.json
 * @param {string} [opts.outRoot] staging root (default MODULE_DIR/staging)
 */
export function buildStaging(opts = {}) {
  const ssotPath = opts.ssotPath;
  const root = opts.outRoot ?? join(MODULE_DIR, 'staging');
  const pilotDir = dirname(ssotPath);
  const derivedDir = join(pilotDir, 'derived');
  const work = JSON.parse(readFileSync(ssotPath, 'utf8'));
  const slug = work.slug;
  const outDir = join(root, 'works', slug);

  // Clean-rebuild the slug dir so stale files never linger (deterministic tree).
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // 1) Metadata <-> PDF fixity: the copied PDF must match the SSOT checksum.
  const cur = currentVersion(work);
  const art = (cur?.artifacts ?? []).find((a) => a.kind === 'pdf');
  const pdfName = art ? art.path.split('/').pop() : null;
  const srcPdf = pdfName ? join(pilotDir, pdfName) : null;
  const fixity = {
    checked: false, ok: false, algorithm: art?.checksum_algorithm,
    expected: art?.checksum, actual: null, bytes_expected: art?.bytes, bytes_actual: null
  };
  if (srcPdf && existsSync(srcPdf)) {
    const bytes = readFileSync(srcPdf);
    fixity.actual = sha256(bytes);
    fixity.bytes_actual = bytes.length;
    fixity.checked = true;
    fixity.ok = fixity.actual === fixity.expected && fixity.bytes_actual === fixity.bytes_expected;
    if (!fixity.ok) {
      throw new Error(`PDF fixity mismatch for ${pdfName}: expected ${fixity.expected}/${fixity.bytes_expected}B, got ${fixity.actual}/${fixity.bytes_actual}B`);
    }
    copyFileSync(srcPdf, join(outDir, pdfName));
  }

  // 2) Staged landing (temporary noindex + banner).
  writeFileSync(join(outDir, 'index.html'), toLandingHTML(work, { staging: true }));

  // 3) Metadata representations copied verbatim from derived/.
  const copied = [];
  for (const f of METADATA_FILES) {
    const src = join(derivedDir, f);
    if (existsSync(src)) { copyFileSync(src, join(outDir, f)); copied.push(f); }
  }

  // 4) Staging-only index suppression + note.
  writeFileSync(join(root, 'robots.txt'), ROBOTS);
  writeFileSync(join(root, 'STAGING.md'), stagingNote(slug));

  return {
    slug,
    outRoot: root,
    outDir,
    localUrl: `/works/${slug}/`,
    landing: 'index.html',
    pdf: pdfName,
    metadata: copied,
    fixity,
    noindex: { robots_txt: true, meta_noindex: true, temporary: true },
    files: ['index.html', pdfName, ...copied].filter(Boolean)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ssot = process.argv[2] || join(MODULE_DIR, 'content', 'pilot', 'declaration-layers', 'work.json');
  const r = buildStaging({ ssotPath: ssot });
  console.log(`stage: built ${r.outDir}`);
  console.log(`  landing:  ${r.landing} (noindex staging)`);
  console.log(`  pdf:      ${r.pdf} — fixity ${r.fixity.ok ? 'OK' : 'FAIL'} (${r.fixity.algorithm})`);
  console.log(`  metadata: ${r.metadata.length} files`);
  console.log(`  robots:   Disallow: / (staging only)`);
  console.log(`  preview:  npm run preview  ->  http://localhost:8081${r.localUrl}`);
}
