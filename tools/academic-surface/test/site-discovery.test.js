// Guards the discovery and trust invariants of the public site.
//
// These come out of the 2026-07-21 hostile audit, which found three classes of
// defect that nothing in CI could see:
//
//   1. No contact path existed anywhere on the site — the single unmet `must`
//      check of the DEL baseline — even though the mailbox already worked.
//   2. The command-line interface was reachable only by inferring that
//      "Command-line interface" and "Command-line validator" named the same
//      thing, and that either was a CLI. The acronym appeared on no strategic
//      surface, so no reader and no crawler could resolve the equivalence.
//   3. /spec/v1.0/ labelled a derived Markdown rendering as the "Complete
//      specification document" and never linked the canonical normative text.
//
// The assertions are deliberately semantic, not textual: they pin the
// *relationship* a surface must express, so the wording stays free to change.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { toWorksIndexHTML } from '../src/works-index.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..', '..', '..');
const read = (...p) => readFileSync(join(REPO_ROOT, ...p), 'utf8');

const CONTACT_ADDRESS = 'contact@agent-manifest-spec.org';

// ---------------------------------------------------------------- contact path

// Every surface that renders chrome must offer a route to the contact page.
// `/contact/` itself must additionally carry the address in the clear, because a
// page that only links onward is not a contact path.
const CHROME_SURFACES = [
  ['Home', ['index.html']],
  ['default layout', ['_layouts', 'default.html']],
  ['works index', ['works', 'index.html']],
  ['declaration-layers landing', ['works', 'declaration-layers', 'index.html']],
  ['e-principle landing', ['works', 'e-principle', 'index.html']]
];

for (const [name, path] of CHROME_SURFACES) {
  test(`${name} links the contact path`, () => {
    assert.match(read(...path), /href="\/contact\/"/);
  });
}

test('the contact page publishes the address itself, not only a link', () => {
  assert.ok(read('contact.md').includes(CONTACT_ADDRESS));
});

test('the contact address is reachable without a GitHub account', () => {
  // security.txt must offer a non-GitHub Contact field: the policy directs
  // reporters at GitHub Private Vulnerability Reporting, and a reporter without
  // an account needs a route that does not end on github.com.
  const securityTxt = read('.well-known', 'security.txt');
  const contacts = securityTxt
    .split('\n')
    .filter((l) => l.startsWith('Contact:'))
    .map((l) => l.slice('Contact:'.length).trim());
  assert.ok(contacts.length >= 2, 'security.txt must list more than one contact route');
  assert.ok(
    contacts.some((c) => !c.includes('github.com')),
    'security.txt must list at least one contact route that is not on github.com'
  );
  assert.ok(contacts.includes(`mailto:${CONTACT_ADDRESS}`));
});

test('llms.txt states the contact address', () => {
  assert.ok(read('llms.txt').includes(CONTACT_ADDRESS));
});

test('the layout declares a machine-readable ContactPoint', () => {
  const layout = read('_layouts', 'default.html');
  assert.match(layout, /"@type":\s*"ContactPoint"/);
  assert.ok(layout.includes(CONTACT_ADDRESS));
});

// ------------------------------------------------------- command-line interface

// The rule the maintainer set: the acronym must never have to be inferred. On a
// strategic surface, "CLI" appears *and* is bound to its expansion, so a reader
// arriving cold — human, crawler, or agent — resolves the equivalence from the
// bytes of that surface alone.
const CLI_SURFACES = [
  ['Home', ['index.html']],
  ['docs index', ['docs', 'index.md']],
  ['CLI page', ['docs', 'cli', 'index.md']],
  ['llms.txt', ['llms.txt']]
];

for (const [name, path] of CLI_SURFACES) {
  test(`${name} declares the Command-line interface (CLI) equivalence`, () => {
    const text = read(...path);
    assert.match(
      text,
      /[Cc]ommand-line interface \(CLI\)/,
      'the expansion and the acronym must appear bound together, not separately'
    );
  });

  test(`${name} names the npm package of the CLI`, () => {
    assert.ok(read(...path).includes('@agent-manifest/cli'));
  });
}

test('the CLI page identifies all four identities of the tool', () => {
  const cli = read('docs', 'cli', 'index.md');
  assert.match(cli, /[Cc]ommand-line interface \(CLI\)/, 'name / category');
  assert.match(cli, /command-line validator/i, 'function');
  assert.ok(cli.includes('@agent-manifest/cli'), 'package');
  assert.ok(cli.includes('`agent-manifest`'), 'command');
});

test('the CLI page states what the CLI does not do', () => {
  const cli = read('docs', 'cli', 'index.md');
  for (const claim of ['certify', 'enforce', 'score']) {
    assert.match(cli, new RegExp(`does not[^.]*${claim}|not ${claim}`, 'i'), `must disclaim: ${claim}`);
  }
});

test('the Home routes to the institutional CLI page, not only to GitHub', () => {
  assert.match(read('index.html'), /href="\/docs\/cli\/"/);
});

// -------------------------------------------------- canonical specification

test('/spec/v1.0/ links the canonical normative specification', () => {
  const index = read('spec', 'v1.0', 'index.md');
  assert.ok(
    index.includes('agent_manifest_v1.0.html'),
    'the version index must link the canonical specification document'
  );
});

test('/spec/v1.0/ does not present the Markdown rendering as the specification', () => {
  const index = read('spec', 'v1.0', 'index.md');
  // The derived rendering may be listed, but never as the complete/normative
  // document — that label belongs to the canonical HTML text alone.
  const linesNamingSpecMd = index
    .split('\n')
    .filter((l) => l.includes('spec.md'));
  for (const line of linesNamingSpecMd) {
    assert.doesNotMatch(
      line,
      /Complete specification document/i,
      'spec.md must not be labelled the complete specification'
    );
  }
});

// ------------------------------------------------------------------- sitemap

test('every sitemap entry is https, canonical-host, and unique', () => {
  const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length > 0);
  assert.equal(new Set(locs).size, locs.length, 'sitemap contains a duplicate <loc>');
  for (const loc of locs) {
    assert.ok(loc.startsWith('https://agent-manifest-spec.org/'), `not canonical-host: ${loc}`);
  }
});

test('the pages added by this pass are present in the sitemap', () => {
  const sitemap = read('sitemap.xml');
  for (const path of ['/contact/', '/privacy/', '/docs/cli/']) {
    assert.ok(
      sitemap.includes(`<loc>https://agent-manifest-spec.org${path}</loc>`),
      `sitemap is missing ${path}`
    );
  }
});

test('robots.txt does not disallow a page that the sitemap advertises', () => {
  const robots = read('robots.txt');
  const disallowed = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
  const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace('https://agent-manifest-spec.org', '')
  );
  for (const rule of disallowed) {
    const re = new RegExp('^' + rule.replaceAll('*', '.*') + '$');
    for (const loc of locs) {
      assert.ok(!re.test(loc), `robots.txt disallows a sitemap URL: ${loc} (rule ${rule})`);
    }
  }
});

// -------------------------------------------------------------- front matter

// A `description:` whose value contains ": " must be quoted or Jekyll fails the
// build with an unhelpful YAML error. This regressed once already, in the CLI
// page, and reached production.
test('every page with front matter parses its description safely', () => {
  const pages = [
    ['contact.md'], ['privacy.md'],
    ['WHAT_THIS_IS.md'], ['WHY_THIS_EXISTS.md'], ['WELL_KNOWN.md'], ['SECURITY.md'],
    ['docs', 'index.md'], ['docs', 'cli', 'index.md'], ['docs', 'comparison.md'],
    ['docs', 'comparison-mas-lab.md'], ['docs', 'how-to-register.md'],
    ['docs', 'ecosystem-map.md'], ['docs', 'MISCONCEPTIONS.md'],
    ['spec', 'v1.0', 'index.md'], ['evaluations', 'README.md'],
    ['evaluations', 'DIF_EVALUATION_COMINT_minimal-example.md'],
    ['evaluations', 'DIF_EVALUATION_EXTENDED_minimal-example.md']
  ];
  for (const p of pages) {
    const text = read(...p);
    const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(fm, `${p.join('/')} has no front matter`);
    for (const line of fm[1].split('\n')) {
      const m = line.match(/^(\w+):\s(.*)$/);
      if (!m) continue;
      const value = m[2];
      if (value.startsWith('"') || value.startsWith("'")) continue;
      assert.ok(
        !value.includes(': '),
        `${p.join('/')}: front-matter key "${m[1]}" contains ": " and must be quoted`
      );
    }
  }
});

// ----------------------------------------------------------------- works root

test('the works index carries the trust layer of the rest of the site', () => {
  const html = toWorksIndexHTML([]);
  assert.match(html, /creativecommons\.org\/licenses\/by\/4\.0/, 'licence');
  assert.match(html, /orcid\.org\/0009-0008-7216-3032/, 'ORCID');
  assert.match(html, /href="\/contact\/"/, 'contact path');
  assert.match(html, /og:image/, 'preview image');
});

test('the works index says what Agent Manifest is', () => {
  // A reader who lands on /works/ from a search result has no other context.
  const html = toWorksIndexHTML([]);
  assert.match(html, /declare[^<]*before interaction/i);
});
