#!/usr/bin/env node
// Deterministic generator for the committed sitemap.xml.
//
// The sitemap used to be edited by hand, and by 2026-08-05 ten of its forty-five
// <lastmod> values were older than the last commit that changed the page they
// describe. A date that is wrong in the stale direction is worse than no date:
// it tells a crawler not to come back. The fix is not to restamp those ten — it
// is to stop typing dates.
//
//   node tools/sitemap/build-sitemap.mjs           rewrite sitemap.xml
//   node tools/sitemap/build-sitemap.mjs --check   exit 1 if it is out of date
//
// No dependencies, no network, no clock except for pages being changed right
// now (see lastmod below). Same repository state in, same bytes out.
//
// SOURCES OF TRUTH
//   loc      the tracked files themselves, via `git ls-files`, put through the
//            same rules the GitHub Pages build applies. There is no second list
//            to keep in step: add a page, run this, and the URL appears.
//   lastmod  `git log -1 --format=%cs` on the file that renders the URL — the
//            last commit that actually changed that page, not the day this ran.
//
// WHAT IS DELIBERATELY NOT EMITTED
//   <priority> and <changefreq>. The old file carried priorities between 0.4 and
//   1.0 that were assigned by hand and meant nothing; Google ignores both tags.
//   Inventing a number and then having to maintain it is the same debt again.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, posix } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITEMAP = join(REPO, 'sitemap.xml');

const git = (...args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8' }).trim();

// ---- configuration read from the build, never restated here ----------------

// A three-key reader for the two settings this script needs. It is not a YAML
// parser and does not pretend to be: it fails loudly rather than guess, so a
// change to _config.yml can never silently produce a sitemap for the wrong host.
function readConfig() {
  const raw = readFileSync(join(REPO, '_config.yml'), 'utf8');
  const url = raw.match(/^url:\s*(\S+)\s*$/m)?.[1];
  if (!url) throw new Error('_config.yml: no top-level `url:` key');
  const block = raw.match(/^exclude:\n((?:[ \t]*-[ \t]*\S+[ \t]*\n)+)/m)?.[1] ?? '';
  const exclude = [...block.matchAll(/^[ \t]*-[ \t]*(\S+)[ \t]*$/gm)].map((m) => m[1].replace(/\/$/, ''));
  if (!exclude.length) throw new Error('_config.yml: no `exclude:` list');
  return { url: url.replace(/\/$/, ''), exclude };
}

// robots.txt is the site's own statement about what must not be crawled. A URL
// it disallows has no business being advertised in the sitemap, so the rule is
// read from the file rather than duplicated as a list here.
function readDisallows() {
  const p = join(REPO, 'robots.txt');
  if (!existsSync(p)) return [];
  return [...readFileSync(p, 'utf8').matchAll(/^Disallow:\s*(\S+)\s*$/gm)]
    .map((m) => m[1])
    .filter((pattern) => pattern !== '/')
    .map((pattern) => new RegExp('^' + pattern.split('*').map(escapeRe).join('[^/]*') + '$'));
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- which tracked files become public HTML --------------------------------

// GitHub Pages runs jekyll-optional-front-matter, so a Markdown file is rendered
// as a page whether or not it carries front matter — with the community files
// (README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT) skipped, which is why
// /CONTRIBUTING.html is a 404 while /works/<slug>/cite.html is a 200. A
// front-mattered README is a normal page again and becomes its directory index.
const COMMUNITY = /^(README|LICENSE|LICENCE|CONTRIBUTING|CODE_OF_CONDUCT|SUPPORT|ISSUE_TEMPLATE|PULL_REQUEST_TEMPLATE)(\.[a-z]+)?$/i;
const NEVER = ['_layouts', '_includes', '_data', '_site', '_sass'];

function frontMatter(file) {
  const raw = readFileSync(join(REPO, file), 'utf8');
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  return end === -1 ? null : raw.slice(3, end);
}

function isPublicPage(file) {
  if (file.startsWith('.')) return false;                       // Jekyll skips dot paths
  const top = file.split('/')[0];
  if (NEVER.includes(top)) return false;
  if (!/\.(md|markdown|html)$/i.test(file)) return false;
  const stem = basename(file).replace(/\.(md|markdown|html)$/i, '');
  if (COMMUNITY.test(stem) && frontMatter(file) === null) return false;
  return true;
}

// Repository path -> the URL the build serves it at.
function urlFor(file) {
  const fm = frontMatter(file);
  const permalink = fm?.match(/^permalink:\s*(\S+)\s*$/m)?.[1];
  if (permalink) return permalink.replace(/^["']|["']$/g, '');
  const dir = posix.dirname(file);
  const stem = basename(file).replace(/\.(md|markdown|html)$/i, '');
  if (stem === 'index' || (stem.toUpperCase() === 'README' && fm !== null)) {
    return dir === '.' ? '/' : `/${dir}/`;
  }
  return `/${dir === '.' ? '' : dir + '/'}${stem}.html`;
}

// ---- lastmod ---------------------------------------------------------------

// The date of the last commit that touched the file, except while the file is
// being changed: an edit that is not committed yet, or a file that has no commit
// at all, is dated today, because today is when it changes. That keeps a fresh
// page honest and keeps `--check` green immediately after the commit lands,
// since the commit's own date is the same day.
const today = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

function lastModified(file, dirty) {
  if (dirty.has(file)) return today();
  const date = git('log', '-1', '--format=%cs', '--', file);
  return date || today();
}

// ---- assembly --------------------------------------------------------------

function build() {
  const { url, exclude } = readConfig();
  const disallowed = readDisallows();
  const dirty = new Set([
    ...git('status', '--porcelain=v1').split('\n').map((l) => l.slice(3).trim()).filter(Boolean)
  ]);

  const entries = [];
  const skipped = [];
  for (const file of git('ls-files').split('\n')) {
    if (!file) continue;
    if (exclude.some((e) => file === e || file.startsWith(e + '/'))) continue;
    if (!isPublicPage(file)) continue;

    const loc = urlFor(file);

    // A page that names another URL as its canonical is a duplicate rendering.
    // /spec/v1.0/spec.html is the Markdown form of the specification and says so
    // in its own front matter; the canonical HTML edition is already listed.
    const canonical = frontMatter(file)?.match(/^canonical_url:\s*(\S+)\s*$/m)?.[1];
    if (canonical && canonical.replace(/^["']|["']$/g, '') !== loc) {
      skipped.push([loc, `not canonical — declares ${canonical}`]);
      continue;
    }
    if (disallowed.some((re) => re.test(loc))) {
      skipped.push([loc, 'disallowed in robots.txt']);
      continue;
    }

    entries.push({ loc: url + loc, lastmod: lastModified(file, dirty), file });
  }

  entries.sort((a, b) => (a.loc < b.loc ? -1 : a.loc > b.loc ? 1 : 0));
  const dupes = entries.filter((e, i) => i && e.loc === entries[i - 1].loc);
  if (dupes.length) throw new Error(`duplicate URLs: ${dupes.map((d) => d.loc).join(', ')}`);

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.flatMap((e) => [
      '  <url>',
      `    <loc>${e.loc}</loc>`,
      `    <lastmod>${e.lastmod}</lastmod>`,
      '  </url>'
    ]),
    '</urlset>',
    ''
  ].join('\n');

  return { xml, entries, skipped };
}

// ---- CLI -------------------------------------------------------------------

const check = process.argv.includes('--check');
const { xml, entries, skipped } = build();
const current = existsSync(SITEMAP) ? readFileSync(SITEMAP, 'utf8') : '';

if (check) {
  if (current === xml) {
    console.log(`sitemap --check: OK (${entries.length} URLs, ${skipped.length} public pages deliberately excluded)`);
    process.exit(0);
  }
  console.error('sitemap --check: OUT OF DATE. Run `node tools/sitemap/build-sitemap.mjs` and commit the result.');
  const lines = (s) => new Set(s.split('\n').filter((l) => l.includes('<loc>') || l.includes('<lastmod>')));
  const a = lines(current), b = lines(xml);
  for (const l of b) if (!a.has(l)) console.error(`  + ${l.trim()}`);
  for (const l of a) if (!b.has(l)) console.error(`  - ${l.trim()}`);
  process.exit(1);
}

writeFileSync(SITEMAP, xml);
console.log(`sitemap: wrote ${entries.length} URLs to sitemap.xml`);
for (const [loc, why] of skipped) console.log(`  excluded ${loc} — ${why}`);
