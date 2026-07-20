// Publication gate — deterministic, offline generator of the public /works/ index.
// Lists every published Work with a machine-readable CollectionPage + ItemList
// JSON-LD (GEO: a structured, transformable listing) and a human directory. No
// clock, no network. Same input -> same bytes. The index advertises only Works
// that are public + published; drafts never surface here.

import { currentVersion, worksUrl, BASE_URL, typeMeta, isPublished } from './lib/canonical.js';
import { EDITORIAL_STYLE, FONT_LINKS, skipLink, siteHeader, siteFooter } from './lib/editorial.js';
import { esc, attr, jsonLdBody } from './lib/html.js';

// Re-exported so existing importers keep working; the definition now lives in
// lib/canonical.js, which is the single vocabulary shared by every generator.
export { isPublished };

// Deterministic order: by slug. Only public+published Works are ever listed.
export function listedWorks(works) {
  return (works ?? []).filter(isPublished).slice().sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
}

const INDEX_URL = `${BASE_URL}/works/`;

// Visual layer: the shared Academic Editorial System (src/lib/editorial.js).

// Common abbreviations whose full stop does not end a sentence. Charter III.3
// permits a deterministic extract ONLY when segmentation is unambiguous and the
// result does not truncate an abbreviation, a reference, or a formula; when the
// candidate is ambiguous the rule is to fall back to the full abstract rather
// than publish a misleading fragment.
const ABBREVIATIONS = new Set([
  'approx', 'cf', 'e.g', 'i.e', 'et al', 'fig', 'no', 'vs', 'vol', 'ch', 'sec',
  'eq', 'ref', 'pp', 'p', 'ed', 'eds', 'st', 'mr', 'ms', 'dr', 'prof', 'inc',
  'ltd', 'al'
]);

function endsOnAbbreviation(candidate) {
  const tail = candidate.replace(/\.$/, '');
  const lastWord = tail.split(/\s+/).pop() ?? '';
  if (ABBREVIATIONS.has(lastWord.toLowerCase())) return true;
  // "e.g." / "i.e." / a single initial ("H.") — a full stop inside or right
  // after a one-letter token is never a sentence boundary.
  if (/(^|\s)[A-Za-z]$/.test(tail)) return true;
  if (/(^|\s)[A-Za-z]\.[A-Za-z]$/.test(tail)) return true;
  // A decimal or a numbered reference: "0.5", "Section 3."
  if (/\d$/.test(tail) && /\d\.$/.test(candidate)) return true;
  return false;
}

function firstSentence(abstract) {
  const flat = (abstract ?? '').replace(/\s*\n\s*/g, ' ').trim();
  const m = flat.match(/^(.*?\.)(\s|$)/);
  if (!m) return flat;
  const candidate = m[1].trim();
  // Ambiguous segmentation, or a fragment so short it cannot carry the meaning:
  // show the full abstract instead of a misleading extract.
  if (endsOnAbbreviation(candidate)) return flat;
  return candidate;
}

// Index summary text, per the Editorial Charter III.3 priority: (1) an explicit
// authorial `summary` field, verbatim, when present and non-empty; (2) otherwise
// the deterministic first-sentence extract (guarded by the publish tests). We
// never paraphrase and never fabricate. This is additive: a work without a
// `summary` field yields the same bytes as before.
export function summaryText(work) {
  const authored = typeof work?.summary === 'string' ? work.summary.trim() : '';
  return authored || firstSentence(work?.abstract);
}

function workItemHtml(work) {
  const cur = currentVersion(work);
  const url = worksUrl(work.slug);
  const authors = (work.authors ?? []).map((a) => esc(a.name_human)).join(', ');
  const doi = cur?.doi_version;
  return [
    '        <li>',
    // Sober role eyebrow (charter III.3): shown only for a work that declares an
    // intellectual function in the ecosystem (`ecosystem_role`). It uses the shared
    // .eyebrow class — no new taxonomy, no empty "Foundations" section, no card
    // padding. A work without the field renders exactly as before.
    work.ecosystem_role ? '          <p class="eyebrow">Foundational work</p>' : null,
    `          <h2><a href="/works/${attr(work.slug)}/">${esc(work.title)}</a></h2>`,
    `          <p class="by">${authors} · ${esc(typeMeta(work.type).label)} · <time datetime="${attr(cur?.date)}">${esc(cur?.date)}</time></p>`,
    `          <p class="desc">${esc(summaryText(work))}</p>`,
    '          <p class="afford">Canonical landing<span>·</span>Version DOI<span>·</span>Machine-readable metadata</p>',
    doi ? `          <p class="doi">DOI: <a href="https://doi.org/${attr(doi)}">https://doi.org/${esc(doi)}</a></p>` : '',
    '        </li>'
  ].filter(Boolean).join('\n');
}

function collectionJsonLd(works) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${INDEX_URL}#collection`,
        url: INDEX_URL,
        name: 'Works — Agent Manifest Academic Surface',
        description: 'Scholarly works published on the Agent Manifest Academic Surface, each with a citable DOI and machine-readable metadata.',
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', '@id': `${BASE_URL}/#website`, name: 'Agent Manifest', url: `${BASE_URL}/` },
        breadcrumb: { '@id': `${INDEX_URL}#breadcrumb` },
        mainEntity: { '@id': `${INDEX_URL}#list` }
      },
      {
        '@type': 'ItemList',
        '@id': `${INDEX_URL}#list`,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        numberOfItems: works.length,
        itemListElement: works.map((w, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: worksUrl(w.slug),
          name: w.title
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${INDEX_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Agent Manifest', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Works' }
        ]
      }
    ]
  };
  return `  <script type="application/ld+json">\n${jsonLdBody(graph)}\n  </script>`;
}

export function toWorksIndexHTML(works) {
  const listed = listedWorks(works);
  const head = [
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <title>Works — Agent Manifest Academic Surface</title>',
    '  <meta name="description" content="Scholarly works published on the Agent Manifest Academic Surface, each with a citable DOI and machine-readable metadata.">',
    `  <link rel="canonical" href="${INDEX_URL}">`,
    '  <meta property="og:title" content="Works — Agent Manifest Academic Surface">',
    '  <meta property="og:description" content="Scholarly works published on the Agent Manifest Academic Surface.">',
    '  <meta property="og:type" content="website">',
    `  <meta property="og:url" content="${INDEX_URL}">`,
    '  <meta property="og:site_name" content="Agent Manifest">',
    '  <meta name="twitter:card" content="summary">',
    collectionJsonLd(listed),
    FONT_LINKS,
    `  <style>${EDITORIAL_STYLE}\n  </style>`
  ].join('\n');

  const n = listed.length;
  const countLine = n === 1
    ? 'One work is currently published.'
    : `${n} works are currently published.`;

  // Institutional scope note (charter III.3 introductions: declarative, no promises,
  // no marketing). States what the surface gathers, the inclusion criterion, and the
  // governed-growth stance — so a deliberately small corpus reads as a decision.
  const scope = [
    '      <div class="scope">',
    '        <p>The Academic Surface is the ecosystem’s place of record for its citable scholarly and technical works — working papers, specifications, datasets, and software that document Agent Manifest and its declaration layer.</p>',
    '        <p>A work appears here only once it is public, versioned, and preserved with a registered DOI; drafts and unregistered material never appear. The corpus grows only by governed incorporation, one record at a time, through the publication protocol — it makes no forward promises and advertises no roadmap.</p>',
    '      </div>'
  ].join('\n');

  const items = n
    ? `${scope}\n      <p class="corpus-count">${countLine}</p>\n      <ul class="works">\n${listed.map(workItemHtml).join('\n')}\n      </ul>`
    : `${scope}\n      <p class="corpus-count">No works are currently published.</p>`;

  const body = [
    skipLink(),
    siteHeader('Academic Surface'),
    '  <nav class="breadcrumb" aria-label="Breadcrumb">',
    '    <div class="wrap">',
    '      <ol>',
    '        <li><a href="/">Agent Manifest</a></li>',
    '        <li aria-current="page">Works</li>',
    '      </ol>',
    '    </div>',
    '  </nav>',
    '  <main id="main">',
    '    <div class="wrap">',
    '      <h1>Works</h1>',
    '      <p class="lead">Scholarly works on the Agent Manifest Academic Surface. Each work has a canonical landing page, a citable version DOI, and co-located machine-readable metadata.</p>',
    '      ' + items,
    '    </div>',
    '  </main>',
    siteFooter('Agent Manifest — Academic Surface. Preservation of record via Zenodo; citation via DOI.')
  ].join('\n');

  return `<!doctype html>\n<html lang="en">\n<head>\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}
