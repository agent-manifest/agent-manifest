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
import { basename } from 'node:path';
import { currentVersion, currentArtifact, isTextual, BASE_URL, worksUrl, typeMeta, langLabel, TYPE_TO_JSONLD } from './lib/canonical.js';
import { EDITORIAL_STYLE, FONT_LINKS, skipLink, siteHeader, siteFooter } from './lib/editorial.js';

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

// ---- inline styles ---------------------------------------------------------
// The visual layer is the shared Academic Editorial System (src/lib/editorial.js).
// Only the editorial layer lives there; every metadata block below is unchanged.

// ---- body sections ---------------------------------------------------------

function facts(work) {
  const cur = currentVersion(work);
  const versionDoi = cur?.doi_version;
  const rows = [
    ['Type', typeMeta(work.type).label],
    ['Version', `${esc(cur?.vN)} · ${esc(cur?.date)}`],
    ['Language', langLabel(work.language)],
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
    `      <p class="apa" id="apa-cite">${esc(apa)}</p>`,
    '      <details class="cite-format">',
    '        <summary>BibTeX</summary>',
    `        <pre><code>${esc(bib)}</code></pre>`,
    '        <p class="dl"><a href="cite.bib">Download BibTeX</a></p>',
    '      </details>',
    '      <details class="cite-format">',
    '        <summary>RIS</summary>',
    `        <pre><code>${esc(ris)}</code></pre>`,
    '        <p class="dl"><a href="cite.ris">Download RIS</a></p>',
    '      </details>',
    '    </div>'
  ].join('\n');
}

// Progressive-enhancement copy control (charter II.10). Injected by script, so with
// JavaScript disabled there is no dead button — the APA citation stays visible and
// selectable. Feature-detected, with a textarea fallback; no clock, no network.
const COPY_SCRIPT = [
  '  <script>',
  '  (function(){',
  '    var src=document.getElementById("apa-cite");',
  '    if(!src) return;',
  '    var btn=document.createElement("button");',
  '    btn.type="button"; btn.className="copy"; btn.textContent="Copy citation";',
  '    var live=document.createElement("span"); live.className="sr-only"; live.setAttribute("aria-live","polite");',
  '    src.insertAdjacentElement("afterend", live);',
  '    src.insertAdjacentElement("afterend", btn);',
  '    function done(){ live.textContent="Citation copied."; btn.textContent="Copied"; setTimeout(function(){ btn.textContent="Copy citation"; },2000); }',
  '    function fallback(){ var ta=document.createElement("textarea"); ta.value=src.textContent.trim(); ta.setAttribute("readonly",""); ta.style.position="absolute"; ta.style.left="-9999px"; document.body.appendChild(ta); ta.select(); try{ document.execCommand("copy"); done(); }catch(e){} document.body.removeChild(ta); }',
  '    btn.addEventListener("click", function(){ var t=src.textContent.trim(); if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done,fallback); } else { fallback(); } });',
  '  })();',
  '  <\/script>'
].join('\n');

// Human label for the primary artifact, by kind. PDF is "Full text"; a code
// archive is a "Source archive"; other kinds fall back to a neutral "Download".
const ARTIFACT_LABEL = { pdf: 'Full text (PDF)', code: 'Source archive (ZIP)', dataset: 'Dataset', epub: 'Full text (EPUB)', html: 'Full text (HTML)' };

function downloadsHtml(work) {
  const art = currentArtifact(work);
  const kb = art ? Math.round(art.bytes / 1024) : null;
  const items = [
    art ? `<a href="${attr(basename(art.path))}">${esc(ARTIFACT_LABEL[art.kind] ?? 'Download')}</a> <span class="note">${kb}&nbsp;KB</span>` : null,
    '<a href="cite.bib">BibTeX</a>',
    '<a href="cite.ris">RIS</a>',
    '<a href="cite.json">CSL-JSON</a>',
    '<a href="cite-apa.txt">APA (plain)</a>',
    '<a href="index.json">Machine metadata (JSON)</a>'
  ].filter(Boolean);
  return `<ul class="downloads">\n${items.map((i) => `      <li>${i}</li>`).join('\n')}\n    </ul>`;
}

// DataCite predicate -> human phrase. Unknown predicates fall back to the raw
// predicate, so a relation is never dropped silently.
const RELATION_PHRASE = {
  isSupplementTo: 'is a supplement to', isSupplementedBy: 'is supplemented by',
  isBasedOn: 'is based on',
  references: 'references', isReferencedBy: 'is referenced by',
  isVersionOf: 'is a version of', hasVersion: 'has version',
  isPartOf: 'is part of', hasPart: 'has part',
  isTranslationOf: 'is a translation of', hasTranslation: 'has translation',
  Obsoletes: 'obsoletes', IsObsoletedBy: 'is obsoleted by'
};

function relationsHtml(work) {
  const rels = (work.relations ?? []).filter((r) => r.target_doi);
  if (!rels.length) return '';
  const noun = typeMeta(work.type).label.toLowerCase();
  const rows = rels.map((r) => {
    const phrase = RELATION_PHRASE[r.predicate] ?? r.predicate;
    return `      <p>This ${esc(noun)} <em>${esc(phrase)}</em> <a class="doi" href="https://doi.org/${attr(r.target_doi)}">https://doi.org/${esc(r.target_doi)}</a>.</p>`;
  });
  return [
    '    <section aria-labelledby="rel-h">',
    '      <h2 id="rel-h">Related work</h2>',
    ...rows,
    '    </section>'
  ].join('\n');
}

// Optional editorial statement of a work's intellectual function in the
// ecosystem (SSOT field `ecosystem_role`). Returns null when absent, so records
// that do not declare a role render exactly as before.
function ecosystemRoleHtml(work) {
  if (!work.ecosystem_role) return null;
  const paras = String(work.ecosystem_role).split('\n\n').map((pp) => `      <p>${esc(pp)}</p>`).join('\n');
  return [
    '',
    '    <section aria-labelledby="role-h">',
    '      <h2 id="role-h">Role in the ecosystem</h2>',
    paras,
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
  // Source repository (code Works). Only rendered when the Work declares one in
  // repositories[]; a Work without a code repo renders exactly as before.
  const repo = (work.repositories ?? [])[0];
  return [
    '    <section aria-labelledby="prov-h">',
    '      <h2 id="prov-h">About this record</h2>',
    `      <p>Author: ${esc(a?.name_human)}${a?.orcid ? ` (<a href="https://orcid.org/${attr(a.orcid)}">ORCID ${esc(a.orcid)}</a>)` : ''}.</p>`,
    repo?.url ? `      <p>Source repository: <a href="${attr(repo.url)}">${esc(repo.url)}</a>.</p>` : '',
    zenodo ? `      <p>Preserved on Zenodo: <a href="${attr(zenodo)}" rel="sameAs">${esc(zenodo)}</a>. This page is the author’s canonical Academic Surface record; the DOI above is the citable identifier.</p>` : '',
    '    </section>'
  ].filter(Boolean).join('\n');
}

// ---- document --------------------------------------------------------------

export function toLandingHTML(work, opts = {}) {
  const staging = opts.staging === true;
  const cur = currentVersion(work);
  const meta = typeMeta(work.type);
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
    // Google Scholar citation_* tags apply to textual articles only; a
    // non-textual Work (software/dataset) omits the whole block.
    isTextual(work.type) ? '  <!-- Highwire / Google Scholar -->' : null,
    isTextual(work.type) ? citationMeta(work) : null,
    isTextual(work.type) ? '' : null,
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
    `  <!-- schema.org JSON-LD — canonical ${TYPE_TO_JSONLD[work.type]} -->`,
    jsonLdScript(work),
    '',
    '  <!-- schema.org JSON-LD — page structure (WebPage + BreadcrumbList) -->',
    structuralJsonLd(work),
    '',
    '  <!-- Brand fonts (DM Sans + DM Mono) with a system fallback stack -->',
    FONT_LINKS,
    '',
    `  <style>${EDITORIAL_STYLE}\n  </style>`
  ].filter((l) => l !== null).join('\n');

  const body = [
    staging ? '  <div role="note" style="background:#8a1c1c;color:#fff;text-align:center;padding:.5rem 1rem;font-size:.85rem;">Local staging preview — not published, not indexable. Temporary.</div>' : null,
    skipLink(),
    siteHeader('Academic Surface'),
    breadcrumbHtml(work),
    '  <main id="main">',
    '    <div class="wrap">',
    '      <article aria-labelledby="title">',
    `        <div class="badge">${esc(meta.label)}</div>`,
    `        <h1 id="title">${esc(work.title)}</h1>`,
    `        <p class="byline">${(work.authors ?? []).map((a) => `${esc(a.name_human)}${a.orcid ? ` <a href="https://orcid.org/${attr(a.orcid)}" aria-label="ORCID for ${attr(a.name_human)}">(ORCID)</a>` : ''}`).join(', ')}</p>`,
    `        <p class="meta-line">${esc(meta.label)} · ${esc(cur?.date)} · ${esc(langLabel(work.language))} · Agent Manifest Academic Surface</p>`,
    '        ' + facts(work),
    '',
    '        <section aria-labelledby="abs-h">',
    '          <h2 id="abs-h">Abstract</h2>',
    '          <div class="abstract">',
    abstractHtml(work),
    '          </div>',
    '        </section>',
    ecosystemRoleHtml(work),
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
    siteFooter(
      'Agent Manifest — Academic Surface. Content licensed under ' +
      `<a href="${attr(work.licenses?.[0]?.url)}" rel="license">${esc(work.licenses?.[0]?.spdx)}</a>. ` +
      'Preservation of record via Zenodo; citation via DOI.'
    ),
    COPY_SCRIPT
  ].filter((l) => l !== null).join('\n');

  return `<!doctype html>\n<html lang="${attr(work.language)}">\n<head>\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}
