// Gate D4 (local staging) — deterministic, offline landing-page generator for the
// pilot Work. Renders the human-facing Academic Surface landing from the SSOT and
// the same canonical metadata builders the derived files use (single source of
// truth). No clock, no network. Same input -> same bytes.
//
// The canonical landing is production-faithful and carries NO noindex. A temporary
// staging block (robots noindex + banner) is injected ONLY when { staging: true },
// so index-suppression is never a permanent property of the Work — it exists only
// in the local, non-servable preview and disappears before production.

import {
  toCSL, toBibTeX, toRIS, toAPA, toHighwire, toJSONLD, toOpenGraph, toDublinCore, toSignposting
} from './derive.js';
import { currentVersion, BASE_URL, worksUrl } from './lib/canonical.js';

// ---- escaping --------------------------------------------------------------

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// attribute-safe (same rules; kept explicit for intent at call sites)
const attr = esc;

// ---- head fragments --------------------------------------------------------

function citationMeta(work) {
  const t = toHighwire(work).tags;
  const lines = [];
  const push = (name, content) => { if (content !== undefined && content !== null && content !== '') lines.push(`  <meta name="${name}" content="${attr(content)}">`); };
  push('citation_title', t.citation_title);
  for (const a of t.citation_author ?? []) push('citation_author', a);
  push('citation_publication_date', t.citation_publication_date);
  push('citation_doi', t.citation_doi);
  push('citation_pdf_url', t.citation_pdf_url);
  push('citation_abstract_html_url', t.citation_abstract_html_url);
  push('citation_language', t.citation_language);
  for (const k of work.keywords ?? []) push('citation_keywords', k);
  return lines.join('\n');
}

function dublinCoreMeta(work) {
  const dc = toDublinCore(work);
  const lines = [];
  const push = (name, content) => { if (content !== undefined && content !== null && content !== '') lines.push(`  <meta name="${name}" content="${attr(content)}">`); };
  push('DC.title', dc.title);
  for (const c of dc.creator ?? []) push('DC.creator', c);
  push('DC.date', dc.date);
  push('DC.type', dc.type);
  push('DC.language', dc.language);
  for (const id of dc.identifier ?? []) push('DC.identifier', id);
  push('DC.rights', dc.rights);
  push('DC.source', dc.source);
  return lines.join('\n');
}

function openGraphMeta(work) {
  const og = toOpenGraph(work);
  const lines = [];
  const push = (prop, content) => { if (content !== undefined && content !== null && content !== '') lines.push(`  <meta property="${prop}" content="${attr(content)}">`); };
  push('og:title', og['og:title']);
  push('og:description', og['og:description']);
  push('og:type', og['og:type']);
  push('og:url', og['og:url']);
  push('og:locale', og['og:locale']);
  push('og:site_name', og['og:site_name']);
  for (const a of og['article:author'] ?? []) push('article:author', a);
  return lines.join('\n');
}

// Twitter card. No image is invented, so the card is a plain summary (never
// summary_large_image, which would advertise a preview image we do not have).
function twitterMeta(work) {
  const og = toOpenGraph(work);
  const lines = [];
  const push = (name, content) => { if (content !== undefined && content !== null && content !== '') lines.push(`  <meta name="${name}" content="${attr(content)}">`); };
  push('twitter:card', 'summary');
  push('twitter:title', og['og:title']);
  push('twitter:description', og['og:description']);
  return lines.join('\n');
}

function signpostingLinks(work) {
  const sp = toSignposting(work);
  return sp.links
    .filter((l) => l.href)
    .map((l) => `  <link rel="${attr(l.rel)}" href="${attr(l.href)}"${l.type ? ` type="${attr(l.type)}"` : ''}>`)
    .join('\n');
}

// Stable, sorted-key JSON so every embedded block is byte-stable across runs.
function stableJson(value) {
  const sort = (v) => Array.isArray(v) ? v.map(sort) : (v && typeof v === 'object'
    ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort(v[k])])) : v);
  return JSON.stringify(sort(value), null, 2);
}

function jsonLdScript(work) {
  return `  <script type="application/ld+json">\n${stableJson(toJSONLD(work))}\n  </script>`;
}

// Page-structural JSON-LD (WebPage + BreadcrumbList) distinct from the Work's
// canonical ScholarlyArticle record. Improves machine/GEO comprehension of where
// the page sits in the site; the ScholarlyArticle stays the citable entity.
function structuralJsonLd(work) {
  const canonical = worksUrl(work.slug);
  const og = toOpenGraph(work);
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: work.title,
        description: og['og:description'],
        inLanguage: work.language,
        isPartOf: { '@type': 'WebSite', '@id': `${BASE_URL}/#website`, name: 'Agent Manifest', url: `${BASE_URL}/` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        mainEntity: { '@id': canonical }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Agent Manifest', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Works', item: `${BASE_URL}/works/` },
          { '@type': 'ListItem', position: 3, name: work.title }
        ]
      }
    ]
  };
  return `  <script type="application/ld+json">\n${stableJson(graph)}\n  </script>`;
}

// ---- inline styles (self-contained, theme-light, accessible, responsive) ---

const STYLE = `
    :root { --fg:#1a1a1a; --muted:#555; --bg:#ffffff; --accent:#0b5cad; --line:#e2e2e2; --code-bg:#f5f6f8; }
    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }
    body { margin:0; color:var(--fg); background:var(--bg);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height:1.6; font-size:18px; }
    .skip { position:absolute; left:-9999px; top:auto; }
    .skip:focus { left:1rem; top:1rem; background:var(--accent); color:#fff; padding:.5rem .75rem; border-radius:4px; z-index:10; }
    a { color:var(--accent); }
    a:focus-visible, button:focus-visible { outline:3px solid var(--accent); outline-offset:2px; }
    header.site { border-bottom:1px solid var(--line); }
    .wrap { max-width:760px; margin:0 auto; padding:0 1.25rem; }
    header.site .wrap { display:flex; align-items:baseline; gap:.5rem; padding-top:1rem; padding-bottom:1rem; flex-wrap:wrap; }
    header.site .brand { font-weight:700; }
    header.site .surface { color:var(--muted); font-size:.85rem; }
    nav.breadcrumb { border-bottom:1px solid var(--line); font-size:.85rem; }
    nav.breadcrumb ol { list-style:none; display:flex; flex-wrap:wrap; gap:.4rem; margin:0; padding:.6rem 0; }
    nav.breadcrumb li { color:var(--muted); }
    nav.breadcrumb li + li::before { content:"/"; padding-right:.4rem; color:var(--line); }
    nav.breadcrumb [aria-current="page"] { color:var(--fg); }
    ul.history { list-style:none; padding:0; margin:0; }
    ul.history li { margin:.3rem 0; }
    ul.history time { color:var(--muted); font-variant-numeric: tabular-nums; }
    main { padding:2rem 0 3rem; }
    h1 { font-size:1.9rem; line-height:1.25; margin:.2rem 0 1rem; }
    h2 { font-size:1.2rem; margin:2rem 0 .6rem; padding-bottom:.25rem; border-bottom:1px solid var(--line); }
    .byline { font-size:1.05rem; margin:.25rem 0; }
    .meta-line { color:var(--muted); font-size:.95rem; margin:.5rem 0 1rem; }
    dl.facts { display:grid; grid-template-columns:max-content 1fr; gap:.35rem 1rem; margin:0; }
    dl.facts dt { color:var(--muted); font-weight:600; }
    dl.facts dd { margin:0; }
    .abstract p { margin:0 0 .9rem; }
    ul.tags { list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:.4rem; }
    ul.tags li { background:var(--code-bg); border:1px solid var(--line); border-radius:999px; padding:.15rem .7rem; font-size:.85rem; color:var(--muted); }
    pre { background:var(--code-bg); border:1px solid var(--line); border-radius:6px; padding:.9rem 1rem; overflow-x:auto; font-size:.85rem; line-height:1.5; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .downloads { list-style:none; padding:0; margin:0; }
    .downloads li { margin:.3rem 0; }
    .cite-block { margin:1rem 0; }
    .cite-block h3 { font-size:.95rem; margin:1rem 0 .35rem; }
    .doi { font-variant-numeric: tabular-nums; }
    .note { color:var(--muted); font-size:.9rem; }
    footer.site { border-top:1px solid var(--line); color:var(--muted); font-size:.85rem; }
    footer.site .wrap { padding-top:1.25rem; padding-bottom:2rem; }
    @media (max-width:520px) {
      body { font-size:16px; }
      h1 { font-size:1.5rem; }
      dl.facts { grid-template-columns:1fr; gap:.1rem .5rem; }
      dl.facts dd { margin-bottom:.5rem; }
    }`;

// ---- body sections ---------------------------------------------------------

function facts(work) {
  const cur = currentVersion(work);
  const versionDoi = cur?.doi_version;
  const rows = [
    ['Type', 'Working paper'],
    ['Version', `${esc(cur?.vN)} · ${esc(cur?.date)}`],
    ['Language', 'English'],
    ['License', `<a href="${attr(work.licenses?.[0]?.url)}" rel="license">${esc(work.licenses?.[0]?.label)}</a>`],
    ['Cite as (version DOI)', `<a class="doi" href="https://doi.org/${attr(versionDoi)}">https://doi.org/${esc(versionDoi)}</a> <span class="note">— preferred, immutable</span>`],
    ['Concept DOI', `<a class="doi" href="https://doi.org/${attr(work.doi_concept)}">https://doi.org/${esc(work.doi_concept)}</a> <span class="note">— all versions</span>`]
  ];
  return `<dl class="facts">\n${rows.map(([k, v]) => `      <dt>${esc(k)}</dt><dd>${v}</dd>`).join('\n')}\n    </dl>`;
}

function abstractHtml(work) {
  return (work.abstract ?? '').split('\n\n').map((p) => `      <p>${esc(p)}</p>`).join('\n');
}

function keywordsHtml(work) {
  return `<ul class="tags">\n${(work.keywords ?? []).map((k) => `      <li>${esc(k)}</li>`).join('\n')}\n    </ul>`;
}

function citeHtml(work) {
  const apa = toAPA(work).trim();
  const bib = toBibTeX(work).trim();
  const ris = toRIS(work).trim();
  return [
    '<div class="cite-block">',
    '      <h3>APA</h3>',
    `      <p>${esc(apa)}</p>`,
    '      <h3>BibTeX</h3>',
    `      <pre><code>${esc(bib)}</code></pre>`,
    '      <h3>RIS</h3>',
    `      <pre><code>${esc(ris)}</code></pre>`,
    '    </div>'
  ].join('\n');
}

function downloadsHtml(work) {
  const cur = currentVersion(work);
  const art = (cur?.artifacts ?? []).find((a) => a.kind === 'pdf');
  const kb = art ? Math.round(art.bytes / 1024) : null;
  const items = [
    art ? `<a href="declaration-layers.pdf">Full text (PDF)</a> <span class="note">${kb}&nbsp;KB</span>` : null,
    '<a href="cite.bib">BibTeX</a>',
    '<a href="cite.ris">RIS</a>',
    '<a href="cite.json">CSL-JSON</a>',
    '<a href="cite-apa.txt">APA (plain)</a>',
    '<a href="index.json">Machine metadata (JSON)</a>'
  ].filter(Boolean);
  return `<ul class="downloads">\n${items.map((i) => `      <li>${i}</li>`).join('\n')}\n    </ul>`;
}

function relationsHtml(work) {
  const rel = (work.relations ?? []).find((r) => r.predicate === 'isSupplementTo');
  if (!rel?.target_doi) return '';
  return [
    '    <section aria-labelledby="rel-h">',
    '      <h2 id="rel-h">Related work</h2>',
    `      <p>This working paper <em>is a supplement to</em> <a class="doi" href="https://doi.org/${attr(rel.target_doi)}">https://doi.org/${esc(rel.target_doi)}</a>.</p>`,
    '    </section>'
  ].join('\n');
}

function breadcrumbHtml(work) {
  return [
    '  <nav class="breadcrumb" aria-label="Breadcrumb">',
    '    <div class="wrap">',
    '      <ol>',
    '        <li><a href="/">Agent Manifest</a></li>',
    '        <li><a href="/works/">Works</a></li>',
    `        <li aria-current="page">${esc(work.title)}</li>`,
    '      </ol>',
    '    </div>',
    '  </nav>'
  ].join('\n');
}

function historyHtml(work) {
  const versions = (work.versions ?? []).filter((v) => v.date);
  if (!versions.length) return '';
  // Newest first; each version's changelog lines flattened to one honest entry.
  const rows = [...versions].sort((a, b) => (a.date < b.date ? 1 : -1)).map((v) => {
    const note = (v.changelog ?? []).join(' ').trim();
    return `      <li><time datetime="${attr(v.date)}">${esc(v.date)}</time> — ${esc(v.vN)}${note ? ` — ${esc(note)}` : ''}</li>`;
  });
  return [
    '    <section aria-labelledby="hist-h">',
    '      <h2 id="hist-h">Revision history</h2>',
    `      <ul class="history">\n${rows.join('\n')}\n      </ul>`,
    '    </section>'
  ].join('\n');
}

function provenanceHtml(work) {
  const a = work.authors?.[0];
  const zenodo = (work.external_urls ?? []).find((e) => e.rel === 'sameAs')?.url;
  return [
    '    <section aria-labelledby="prov-h">',
    '      <h2 id="prov-h">About this record</h2>',
    `      <p>Author: ${esc(a?.name_human)}${a?.orcid ? ` (<a href="https://orcid.org/${attr(a.orcid)}">ORCID ${esc(a.orcid)}</a>)` : ''}.</p>`,
    zenodo ? `      <p>Preserved on Zenodo: <a href="${attr(zenodo)}" rel="sameAs">${esc(zenodo)}</a>. This page is the author’s canonical Academic Surface record; the DOI above is the citable identifier.</p>` : '',
    '    </section>'
  ].filter(Boolean).join('\n');
}

// ---- document --------------------------------------------------------------

export function toLandingHTML(work, opts = {}) {
  const staging = opts.staging === true;
  const cur = currentVersion(work);
  const og = toOpenGraph(work);
  const canonical = toJSONLD(work).url;
  const desc = og['og:description'];

  const head = [
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    `  <title>${esc(work.title)}</title>`,
    `  <meta name="description" content="${attr(desc)}">`,
    `  <meta name="author" content="${attr((work.authors ?? []).map((a) => a.name_human).join(', '))}">`,
    `  <link rel="canonical" href="${attr(canonical)}">`,
    staging ? '  <!-- STAGING ONLY: temporary index suppression; MUST be removed before production. Not a property of the Work. -->' : null,
    staging ? '  <meta name="robots" content="noindex, nofollow">' : null,
    '',
    '  <!-- Highwire / Google Scholar -->',
    citationMeta(work),
    '',
    '  <!-- Dublin Core -->',
    dublinCoreMeta(work),
    '',
    '  <!-- Open Graph -->',
    openGraphMeta(work),
    '',
    '  <!-- Twitter card (summary; no invented preview image) -->',
    twitterMeta(work),
    '',
    '  <!-- Signposting (typed links) -->',
    signpostingLinks(work),
    '',
    '  <!-- schema.org JSON-LD — canonical ScholarlyArticle -->',
    jsonLdScript(work),
    '',
    '  <!-- schema.org JSON-LD — page structure (WebPage + BreadcrumbList) -->',
    structuralJsonLd(work),
    '',
    `  <style>${STYLE}\n  </style>`
  ].filter((l) => l !== null).join('\n');

  const body = [
    staging ? '  <div role="note" style="background:#8a1c1c;color:#fff;text-align:center;padding:.5rem 1rem;font-size:.85rem;">Local staging preview — not published, not indexable. Temporary.</div>' : null,
    '  <a class="skip" href="#main">Skip to content</a>',
    '  <header class="site">',
    '    <div class="wrap">',
    '      <span class="brand">Agent Manifest</span>',
    '      <span class="surface">Academic Surface</span>',
    '    </div>',
    '  </header>',
    breadcrumbHtml(work),
    '  <main id="main">',
    '    <div class="wrap">',
    '      <article aria-labelledby="title">',
    `        <h1 id="title">${esc(work.title)}</h1>`,
    `        <p class="byline">${(work.authors ?? []).map((a) => `${esc(a.name_human)}${a.orcid ? ` <a href="https://orcid.org/${attr(a.orcid)}" aria-label="ORCID for ${attr(a.name_human)}">(ORCID)</a>` : ''}`).join(', ')}</p>`,
    `        <p class="meta-line">Working paper · ${esc(cur?.date)} · English · Agent Manifest Academic Surface</p>`,
    '        ' + facts(work),
    '',
    '        <section aria-labelledby="abs-h">',
    '          <h2 id="abs-h">Abstract</h2>',
    '          <div class="abstract">',
    abstractHtml(work),
    '          </div>',
    '        </section>',
    '',
    '        <section aria-labelledby="kw-h">',
    '          <h2 id="kw-h">Keywords</h2>',
    '          ' + keywordsHtml(work),
    '        </section>',
    '',
    '        <section aria-labelledby="dl-h">',
    '          <h2 id="dl-h">Downloads</h2>',
    '          ' + downloadsHtml(work),
    '        </section>',
    '',
    '        <section aria-labelledby="cite-h">',
    '          <h2 id="cite-h">How to cite</h2>',
    `          <p class="note">Cite the immutable version DOI <a class="doi" href="https://doi.org/${attr(cur?.doi_version)}">${esc(cur?.doi_version)}</a>. Use the concept DOI to reference all versions.</p>`,
    '          ' + citeHtml(work),
    '        </section>',
    '',
    historyHtml(work),
    '',
    relationsHtml(work),
    '',
    provenanceHtml(work),
    '      </article>',
    '    </div>',
    '  </main>',
    '  <footer class="site">',
    '    <div class="wrap">',
    '      <p>Agent Manifest — Academic Surface. Content licensed under ' +
      `<a href="${attr(work.licenses?.[0]?.url)}" rel="license">${esc(work.licenses?.[0]?.spdx)}</a>. ` +
      'Preservation of record via Zenodo; citation via DOI.</p>',
    '    </div>',
    '  </footer>'
  ].filter((l) => l !== null).join('\n');

  return `<!doctype html>\n<html lang="${attr(work.language)}">\n<head>\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}
