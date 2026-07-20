// Publication gate — materialize the PUBLIC Academic Surface into the repo's
// served tree at <repo>/works/. Unlike staging (git-ignored, noindex), this output
// is committed and indexable: the production-faithful landing (NO noindex, NO
// staging banner), the co-located machine-readable representations, the PDF (with
// fixity against the SSOT), and the /works/ index. Deterministic, offline: same
// SSOT -> same bytes. `--check` re-renders in memory and asserts the on-disk public
// tree matches (drift protection on the public surface).

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAll } from './derive.js';
import { toWorksIndexHTML, isPublished } from './works-index.js';
import { currentArtifact } from './lib/canonical.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = join(HERE, '..');
const REPO_ROOT = join(MODULE_DIR, '..', '..');
const CONTENT_DIR = join(MODULE_DIR, 'content', 'pilot');

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

// Discover every pilot SSOT (content/pilot/<slug>/work.json).
export function discoverSsots(contentDir = CONTENT_DIR) {
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(contentDir, e.name, 'work.json'))
    .filter((p) => existsSync(p))
    .sort();
}

function loadWorks(ssotPaths) {
  return ssotPaths.map((p) => ({ path: p, work: JSON.parse(readFileSync(p, 'utf8')) }));
}

// Resolve the co-located primary artifact (PDF, code archive, …) and verify it
// against the SSOT checksum (throws on mismatch). Kind-agnostic: the fixity is a
// sha-256 comparison, identical for a PDF or a source ZIP.
function verifiedPdf(pilotDir, work) {
  const art = currentArtifact(work);
  if (!art) return { pdfName: null, fixity: { checked: false, ok: true } };
  const pdfName = basename(art.path);
  const src = join(pilotDir, pdfName);
  const fixity = { checked: false, ok: false, algorithm: art.checksum_algorithm, expected: art.checksum, actual: null, bytes_expected: art.bytes, bytes_actual: null, src };
  if (!existsSync(src)) throw new Error(`PDF missing for ${work.slug}: ${src}`);
  const bytes = readFileSync(src);
  fixity.actual = sha256(bytes);
  fixity.bytes_actual = bytes.length;
  fixity.checked = true;
  fixity.ok = fixity.actual === fixity.expected && fixity.bytes_actual === fixity.bytes_expected;
  if (!fixity.ok) throw new Error(`PDF fixity mismatch for ${pdfName}: expected ${fixity.expected}/${fixity.bytes_expected}B, got ${fixity.actual}/${fixity.bytes_actual}B`);
  return { pdfName, srcPdf: src, fixity };
}

// The 13 rendered representations (index.html is the production landing, no noindex).
function renderedFiles(work) {
  return renderAll(work); // { name -> bytes-stable string }
}

/**
 * Write the public tree. Returns a structured report; throws on fixity failure.
 * @param {object} opts
 * @param {string[]} [opts.ssotPaths] SSOTs to publish (default: all discovered)
 * @param {string} [opts.repoRoot]    repo root (default resolved)
 */
export function publishSite(opts = {}) {
  const repoRoot = opts.repoRoot ?? REPO_ROOT;
  const ssotPaths = opts.ssotPaths ?? discoverSsots();
  const loaded = loadWorks(ssotPaths);
  const worksRoot = join(repoRoot, 'works');
  mkdirSync(worksRoot, { recursive: true });

  const published = [];
  for (const { path, work } of loaded) {
    if (!isPublished(work)) continue; // never materialize drafts
    const pilotDir = dirname(path);
    const outDir = join(worksRoot, work.slug);
    if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });

    const { pdfName, srcPdf, fixity } = verifiedPdf(pilotDir, work);
    const rendered = renderedFiles(work);
    for (const [name, content] of Object.entries(rendered)) writeFileSync(join(outDir, name), content);
    if (pdfName && srcPdf) copyFileSync(srcPdf, join(outDir, pdfName));

    published.push({ slug: work.slug, outDir, pdf: pdfName, fixity, files: [...Object.keys(rendered), pdfName].filter(Boolean), work });
  }

  const listedWorkObjs = published.map((p) => p.work);
  writeFileSync(join(worksRoot, 'index.html'), toWorksIndexHTML(listedWorkObjs));

  return {
    worksRoot,
    index: 'works/index.html',
    published: published.map(({ work, ...rest }) => rest),
    count: published.length
  };
}

/**
 * Verify the on-disk public tree matches a fresh render from the SSOT.
 * @returns {{ ok:boolean, drift:string[], missing:string[], stray:string[], fixity:object[], noindex:string[] }}
 */
export function checkPublic(opts = {}) {
  const repoRoot = opts.repoRoot ?? REPO_ROOT;
  const ssotPaths = opts.ssotPaths ?? discoverSsots();
  const loaded = loadWorks(ssotPaths);
  const worksRoot = join(repoRoot, 'works');
  const drift = [], missing = [], stray = [], fixity = [], noindex = [];

  const expectedSlugs = new Set();
  for (const { path, work } of loaded) {
    if (!isPublished(work)) continue;
    expectedSlugs.add(work.slug);
    const pilotDir = dirname(path);
    const outDir = join(worksRoot, work.slug);
    const rendered = renderedFiles(work);
    for (const [name, content] of Object.entries(rendered)) {
      const p = join(outDir, name);
      if (!existsSync(p)) { missing.push(`${work.slug}/${name}`); continue; }
      if (readFileSync(p, 'utf8') !== content) drift.push(`${work.slug}/${name}`);
    }
    // README must never be published.
    if (existsSync(join(outDir, 'README.md'))) stray.push(`${work.slug}/README.md`);
    // PDF fixity.
    try {
      const { pdfName, fixity: fx } = verifiedPdf(pilotDir, work);
      if (pdfName) {
        const pub = join(outDir, pdfName);
        if (!existsSync(pub)) missing.push(`${work.slug}/${pdfName}`);
        else {
          const bytes = readFileSync(pub);
          const ok = sha256(bytes) === fx.expected && bytes.length === fx.bytes_expected;
          fixity.push({ slug: work.slug, pdf: pdfName, ok });
          if (!ok) drift.push(`${work.slug}/${pdfName}`);
        }
      }
    } catch (e) { fixity.push({ slug: work.slug, ok: false, error: e.message }); }
    // A published landing must never carry a permanent noindex.
    const landing = join(outDir, 'index.html');
    if (existsSync(landing) && /name="robots"[^>]*noindex/.test(readFileSync(landing, 'utf8'))) noindex.push(`${work.slug}/index.html`);
  }

  // Index page must match a fresh render.
  const idxPath = join(worksRoot, 'index.html');
  const expectedIdx = toWorksIndexHTML(loaded.filter(({ work }) => isPublished(work)).map(({ work }) => work));
  if (!existsSync(idxPath)) missing.push('index.html');
  else if (readFileSync(idxPath, 'utf8') !== expectedIdx) drift.push('index.html');

  // Stray published slugs with no published SSOT.
  if (existsSync(worksRoot)) {
    for (const e of readdirSync(worksRoot, { withFileTypes: true })) {
      if (e.isDirectory() && !expectedSlugs.has(e.name)) stray.push(`${e.name}/ (no published SSOT)`);
    }
  }

  const ok = !drift.length && !missing.length && !stray.length && !noindex.length && fixity.every((f) => f.ok);
  return { ok, drift, missing, stray, fixity, noindex };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  if (check) {
    const r = checkPublic();
    if (r.ok) { console.log('publish --check: OK (public /works tree matches the SSOT regeneration)'); process.exit(0); }
    console.error('publish --check: DRIFT');
    for (const n of r.drift) console.error(`  drift:   ${n}`);
    for (const n of r.missing) console.error(`  missing: ${n}`);
    for (const n of r.stray) console.error(`  stray:   ${n}`);
    for (const n of r.noindex) console.error(`  noindex: ${n} (published landing must not be noindex)`);
    process.exit(1);
  }
  const r = publishSite();
  console.log(`publish: wrote ${r.count} work(s) to ${r.worksRoot}`);
  for (const p of r.published) {
    console.log(`  /works/${p.slug}/  — ${p.files.length} files; PDF fixity ${p.fixity.ok ? 'OK' : 'FAIL'}`);
  }
  console.log(`  /works/index.html — listing ${r.count} work(s)`);
}
