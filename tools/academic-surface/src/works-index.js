// Publication gate — deterministic, offline generator of the public /works/ index.
// Lists every published Work with a machine-readable CollectionPage + ItemList
// JSON-LD (GEO: a structured, transformable listing) and a human directory. No
// clock, no network. Same input -> same bytes. The index advertises only Works
// that are public + published; drafts never surface here.

import { currentVersion, worksUrl, BASE_URL } from './lib/canonical.js';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const attr = esc;

function stableJson(value) {
  const sort = (v) => Array.isArray(v) ? v.map(sort) : (v && typeof v === 'object'
    ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort(v[k])])) : v);
  return JSON.stringify(sort(value), null, 2);
}

export function isPublished(work) {
  return work.visibility === 'public' && work.status === 'published';
}

// Deterministic order: by slug. Only public+published Works are ever listed.
export function listedWorks(works) {
  return (works ?? []).filter(isPublished).slice().sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
}

const INDEX_URL = `${BASE_URL}/works/`;

const STYLE = `
    :root { --fg:#1a1a1a; --muted:#555; --bg:#ffffff; --accent:#0b5cad; --line:#e2e2e2; }
    * { box-sizing:border-box; }
    body { margin:0; color:var(--fg); background:var(--bg);
      font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height:1.6; font-size:18px; }
    .skip { position:absolute; left:-9999px; }
    .skip:focus { left:1rem; top:1rem; background:var(--accent); color:#fff; padding:.5rem .75rem; border-radius:4px; z-index:10; }
    a { color:var(--accent); }
    a:focus-visible { outline:3px solid var(--accent); outline-offset:2px; }
    .wrap { max-width:760px; margin:0 auto; padding:0 1.25rem; }
    header.site { border-bottom:1px solid var(--line); }
    header.site .wrap { display:flex; align-items:baseline; gap:.5rem; padding:1rem 1.25rem; flex-wrap:wrap; }
    header.site .brand { font-weight:700; }
    header.site .surface { color:var(--muted); font-size:.85rem; }
    nav.breadcrumb { border-bottom:1px solid var(--line); font-size:.85rem; }
    nav.breadcrumb ol { list-style:none; display:flex; gap:.4rem; margin:0; padding:.6rem 0; }
    nav.breadcrumb li { color:var(--muted); }
    nav.breadcrumb li + li::before { content:"/"; padding-right:.4rem; color:var(--line); }
    nav.breadcrumb [aria-current="page"] { color:var(--fg); }
    main { padding:2rem 0 3rem; }
    h1 { font-size:1.9rem; margin:.2rem 0 .5rem; }
    .lead { color:var(--muted); margin:0 0 1.5rem; }
    ul.works { list-style:none; padding:0; margin:0; }
    ul.works li { border-top:1px solid var(--line); padding:1.25rem 0; }
    ul.works h2 { font-size:1.2rem; margin:0 0 .3rem; border:0; }
    ul.works .by { color:var(--muted); font-size:.95rem; margin:.2rem 0; }
    ul.works .desc { margin:.4rem 0 0; }
    ul.works .doi { font-variant-numeric:tabular-nums; font-size:.9rem; }
    footer.site { border-top:1px solid var(--line); color:var(--muted); font-size:.85rem; }
    footer.site .wrap { padding:1.25rem 1.25rem 2rem; }
    @media (max-width:520px) { body { font-size:16px; } h1 { font-size:1.5rem; } }`;

function firstSentence(abstract) {
  const flat = (abstract ?? '').replace(/\s*\n\s*/g, ' ').trim();
  const m = flat.match(/^(.*?\.)(\s|$)/);
  return (m ? m[1] : flat).trim();
}

function workItemHtml(work) {
  const cur = currentVersion(work);
  const url = worksUrl(work.slug);
  const authors = (work.authors ?? []).map((a) => esc(a.name_human)).join(', ');
  const doi = cur?.doi_version;
  return [
    '        <li>',
    `          <h2><a href="/works/${attr(work.slug)}">${esc(work.title)}</a></h2>`,
    `          <p class="by">${authors} · Working paper · <time datetime="${attr(cur?.date)}">${esc(cur?.date)}</time></p>`,
    `          <p class="desc">${esc(firstSentence(work.abstract))}</p>`,
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
  return `  <script type="application/ld+json">\n${stableJson(graph)}\n  </script>`;
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
    `  <style>${STYLE}\n  </style>`
  ].join('\n');

  const items = listed.length
    ? `<ul class="works">\n${listed.map(workItemHtml).join('\n')}\n      </ul>`
    : '<p class="lead">No works are published yet.</p>';

  const body = [
    '  <a class="skip" href="#main">Skip to content</a>',
    '  <header class="site">',
    '    <div class="wrap">',
    '      <span class="brand">Agent Manifest</span>',
    '      <span class="surface">Academic Surface</span>',
    '    </div>',
    '  </header>',
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
    '  <footer class="site">',
    '    <div class="wrap">',
    '      <p>Agent Manifest — Academic Surface. Preservation of record via Zenodo; citation via DOI.</p>',
    '    </div>',
    '  </footer>'
  ].join('\n');

  return `<!doctype html>\n<html lang="en">\n<head>\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}
