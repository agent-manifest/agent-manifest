// Academic Editorial System — the single shared editorial layer for the whole
// ecosystem. See tools/academic-surface/docs/EDITORIAL-SYSTEM-v2.1.md for the
// governing charter; this module is the charter's machine mirror (VI.2), and the
// two must never diverge.
//
// It is consumed two ways:
//   1. inlined into the generated Academic Surface pages (Work landing + /works
//      index), which are self-contained records — EDITORIAL_STYLE only;
//   2. emitted as the site stylesheet assets/css/editorial.css by
//      src/build-css.js, which every non-generated surface (Home, Docs, Spec)
//      links — SITE_STYLESHEET, i.e. EDITORIAL_STYLE plus the three archetype
//      layers below.
// Before this module carried the archetype layers, the same tokens and chrome
// were hand-maintained in three separate <style> blocks and had already drifted.
//
// This module owns ONLY the editorial layer: design tokens, one stylesheet, and
// the brand font links. It never touches SSOT, metadata (citation_*, JSON-LD,
// Highwire, DC, OG, signposting, exports), canonical, validators, or determinism.
// It is a pure string module: no clock, no network. Same import -> same bytes.

// Brand fonts (DM Sans + DM Mono). A robust system fallback stack (in the tokens
// below) keeps the page fully legible if the fonts fail to load. Emitting a
// static <link> is deterministic — no fetch at build.
//
// Two weight sets, one definition. The reading surfaces need 300/400/500; the
// Specification variant (charter Appendix F.3) additionally needs 600/700 for its
// normative register. Deriving both from one list keeps them from drifting.
const FONT_WEIGHTS = '300;400;500';
const FONT_WEIGHTS_SPEC = '300;400;500;600;700';

function fontLinks(sansWeights) {
  return [
    '  <link rel="preconnect" href="https://fonts.googleapis.com">',
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@${FONT_WEIGHTS}&family=DM+Sans:wght@${sansWeights}&display=swap" rel="stylesheet">`
  ].join('\n');
}

export const FONT_LINKS = fontLinks(FONT_WEIGHTS);
export const FONT_LINKS_SPEC = fontLinks(FONT_WEIGHTS_SPEC);

// The canonical stylesheet. Tokens (Appendix A of the governing doc) + reset +
// shared chrome + component rules for both generated surfaces. No raw hex or
// magic px outside the :root token block. Contains no "staging" vocabulary.
export const EDITORIAL_STYLE = `
    :root{
      --sans:"DM Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      --mono:"DM Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
      --paper:#f5f4f0; --paper-sunk:#edecea;
      --ink:#1a1917; --ink-2:#57544d; --ink-faint:#8a8780;
      --rule:#dcdad4; --rule-strong:#c4c1b8;
      --focus:#1a3a5c; --ok:#3a6b3a; --paper-dark:#8a1c1c; /* reserved: local preview banner only */
      --page-max:45rem; --measure:40rem;
      --s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem; --s-5:1.5rem; --s-6:2rem; --s-7:3rem; --s-8:4rem; --s-9:6rem;
      /* Boundary rule (the one proprietary gesture — charter II.15): the length of
         the solid ink origin segment. A fixed system constant, not a per-surface
         choice, so the mark is identical on every surface by construction. */
      --boundary-seg:4rem;
    }
    *,*::before,*::after{ box-sizing:border-box; margin:0; padding:0; }
    html{ font-size:16px; -webkit-text-size-adjust:100%; }
    body{ background:var(--paper); color:var(--ink); font-family:var(--sans);
      font-weight:300; line-height:1.65; }
    a{ color:var(--ink); text-decoration:underline; text-underline-offset:3px;
      text-decoration-color:var(--rule); transition:text-decoration-color .15s; }
    a:hover{ text-decoration-color:var(--ink); }
    a:focus-visible,button:focus-visible{ outline:3px solid var(--focus); outline-offset:2px; }
    .skip{ position:absolute; left:-9999px; top:auto; }
    .skip:focus{ left:1rem; top:1rem; background:var(--focus); color:#fff; padding:.5rem .75rem; border-radius:3px; z-index:10; text-decoration:none; }

    .wrap{ max-width:var(--page-max); margin:0 auto; padding:0 var(--s-5); }

    header.site .wrap{ display:flex; align-items:baseline; gap:var(--s-2);
      padding-top:var(--s-5); padding-bottom:var(--s-4); flex-wrap:wrap; }
    header.site .brand{ font-weight:500; letter-spacing:-.01em; }
    header.site .surface{ color:var(--ink-2); font-size:.8125rem; font-family:var(--mono);
      text-transform:uppercase; letter-spacing:.12em; }

    /* The boundary rule — the ecosystem's single proprietary gesture (charter II.15).
       The masthead separator is a two-segment hairline: a solid ink origin segment
       (what the ecosystem declares) continuing as a faint hairline to the column
       edge (the undeclared, claimed by nothing). It renders Agent Manifest's stance
       — declaration up to a boundary, no claim beyond — as geometry, not ornament.
       No color, no shadow, no gradient, no motion. One instance per surface. */
    .boundary-rule{ position:relative; height:0; border-top:1px solid var(--rule); }
    .boundary-rule::before{ content:""; position:absolute; left:0; top:-1px;
      width:var(--boundary-seg); border-top:2px solid var(--ink); }
    header.site .boundary-rule{ flex:0 0 100%; margin-top:var(--s-4); }

    nav.breadcrumb{ border-bottom:1px solid var(--rule); font-family:var(--mono); font-size:.75rem;
      letter-spacing:.02em; }
    nav.breadcrumb ol{ list-style:none; display:flex; flex-wrap:wrap; gap:.4rem; padding:.7rem 0; }
    nav.breadcrumb li{ color:var(--ink-2); }
    nav.breadcrumb li+li::before{ content:"/"; padding-right:.4rem; color:var(--ink-faint); }
    nav.breadcrumb [aria-current="page"]{ color:var(--ink); }

    main{ padding:var(--s-7) 0 var(--s-8); }

    .eyebrow{ font-family:var(--mono); font-size:.6875rem; letter-spacing:.14em;
      text-transform:uppercase; color:var(--ink-2); }
    .badge{ display:inline-block; font-family:var(--mono); font-size:.6875rem;
      letter-spacing:.12em; text-transform:uppercase; color:var(--ink-2);
      border:1px solid var(--rule); padding:.2rem .55rem; border-radius:2px; }

    h1{ font-family:var(--sans); font-size:2rem; font-weight:500; letter-spacing:-.03em;
      line-height:1.15; margin:var(--s-3) 0 var(--s-4); }
    h2{ font-size:1.375rem; font-weight:500; letter-spacing:-.02em; line-height:1.25;
      margin:var(--s-6) 0 var(--s-4); padding-bottom:var(--s-2); border-bottom:1px solid var(--rule); }
    h3{ font-size:1.0625rem; font-weight:500; letter-spacing:-.01em; margin:var(--s-4) 0 var(--s-2); }

    .byline{ font-size:1.0625rem; margin:var(--s-2) 0; }
    .meta-line{ color:var(--ink-2); font-family:var(--mono); font-size:.8125rem;
      letter-spacing:.01em; margin:var(--s-2) 0 var(--s-5); }

    dl.facts{ display:grid; grid-template-columns:max-content 1fr; gap:.4rem var(--s-5); margin:0; }
    dl.facts dt{ color:var(--ink-2); font-family:var(--mono); font-size:.8125rem;
      text-transform:uppercase; letter-spacing:.06em; padding-top:.15rem; }
    dl.facts dd{ margin:0; overflow-wrap:anywhere; }

    .abstract{ max-width:var(--measure); }
    .abstract p{ margin:0 0 var(--s-4); }
    .lead{ color:var(--ink-2); max-width:var(--measure); margin:0 0 var(--s-5); }

    ul.tags{ list-style:none; display:flex; flex-wrap:wrap; gap:var(--s-2); }
    ul.tags li{ background:var(--paper-sunk); border:1px solid var(--rule); border-radius:999px;
      padding:.15rem .7rem; font-family:var(--mono); font-size:.75rem; color:var(--ink-2); }

    pre{ background:var(--paper-sunk); border:1px solid var(--rule); border-radius:6px;
      padding:.9rem 1rem; overflow-x:auto; font-size:.8125rem; line-height:1.5; }
    code,pre{ font-family:var(--mono); }

    ul.downloads{ list-style:none; }
    ul.downloads li{ margin:var(--s-2) 0; }
    ul.downloads li::before{ content:"—"; color:var(--ink-faint); padding-right:.5rem; }

    /* CitationBlock (charter Part IV). APA is the primary human citation, always
       visible and selectable; BibTeX and RIS are secondary technical formats behind
       native <details> disclosure (no JavaScript). The copy control is progressive
       enhancement only (II.10): injected by script, absent without JS, so the record
       remains fully functional with JavaScript disabled. Verbatim from the deriver. */
    .cite-block{ margin:var(--s-4) 0; }
    .cite-block h3{ font-family:var(--mono); font-size:.6875rem; text-transform:uppercase;
      letter-spacing:.12em; color:var(--ink-2); margin:0 0 var(--s-2); }
    .cite-block .apa{ max-width:var(--measure); margin:0; }
    button.copy{ font-family:var(--mono); font-size:.75rem; letter-spacing:.03em; color:var(--ink);
      background:var(--paper-sunk); border:1px solid var(--rule-strong); border-radius:3px;
      padding:.35rem .7rem; cursor:pointer; margin:var(--s-3) 0 0; }
    button.copy:hover{ border-color:var(--ink); }
    details.cite-format{ border-top:1px solid var(--rule); margin:var(--s-4) 0 0; padding:var(--s-3) 0 0; }
    details.cite-format summary{ font-family:var(--mono); font-size:.75rem; letter-spacing:.06em;
      text-transform:uppercase; color:var(--ink-2); cursor:pointer; list-style:none; }
    details.cite-format summary::-webkit-details-marker{ display:none; }
    details.cite-format summary::before{ content:"+"; color:var(--ink-faint); padding-right:.55rem; font-family:var(--mono); }
    details.cite-format[open] summary::before{ content:"\\2212"; }
    details.cite-format pre{ margin:var(--s-3) 0 0; }
    details.cite-format .dl{ font-family:var(--mono); font-size:.75rem; color:var(--ink-2); margin:var(--s-2) 0 0; }
    .sr-only{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden;
      clip:rect(0,0,0,0); white-space:nowrap; border:0; }
    .doi{ font-family:var(--mono); font-variant-numeric:tabular-nums; overflow-wrap:anywhere; }
    .note{ color:var(--ink-2); font-size:.8125rem; }

    ul.history{ list-style:none; }
    ul.history li{ margin:var(--s-2) 0; }
    ul.history time{ color:var(--ink-2); font-family:var(--mono); font-variant-numeric:tabular-nums; }

    /* Index scope note — institutional prose stating what the surface gathers,
       its inclusion criterion, and its governed growth. Declarative, no promises. */
    .scope{ max-width:var(--measure); margin:var(--s-6) 0 0; }
    .scope p{ margin:0 0 var(--s-4); }
    .scope p:last-child{ margin-bottom:0; }
    .corpus-count{ font-family:var(--mono); font-size:.8125rem; color:var(--ink-2);
      letter-spacing:.02em; margin:var(--s-6) 0 var(--s-2); padding-bottom:var(--s-3);
      border-bottom:1px solid var(--rule); }

    ul.works{ list-style:none; }
    ul.works li{ border-top:1px solid var(--rule); padding:var(--s-6) 0; }
    ul.works li:first-child{ border-top:0; padding-top:var(--s-5); }
    ul.works h2{ font-size:1.3125rem; letter-spacing:-.02em; margin:0 0 var(--s-2); padding:0; border:0; }
    ul.works .by{ color:var(--ink-2); font-family:var(--mono); font-size:.8125rem; margin:.2rem 0; }
    ul.works .desc{ margin:var(--s-3) 0 0; max-width:var(--measure); }
    ul.works .afford{ font-family:var(--mono); font-size:.75rem; color:var(--ink-2);
      letter-spacing:.02em; margin:var(--s-4) 0 0; }
    ul.works .afford span{ color:var(--ink-faint); padding:0 .2rem; }
    ul.works .doi{ font-size:.8125rem; margin:var(--s-2) 0 0; }

    footer.site{ border-top:1px solid var(--rule); color:var(--ink-2); font-size:.8125rem; }
    footer.site .wrap{ padding-top:var(--s-5); padding-bottom:var(--s-7); }
    footer.site a{ color:var(--ink-2); }

    @media (prefers-reduced-motion: reduce){
      *{ animation:none !important; transition:none !important; }
    }
    @media (max-width:520px){
      h1{ font-size:1.5rem; }
      h2{ font-size:1.1875rem; }
      dl.facts{ grid-template-columns:1fr; gap:.1rem var(--s-2); }
      dl.facts dd{ margin-bottom:var(--s-3); }
    }`;

// ── Archetype layers ────────────────────────────────────────────────────────
// EDITORIAL_STYLE above is the record layer: tokens, reset, chrome, and the
// components the generated Record and Index surfaces emit. The three layers
// below add only what the *other* three archetypes of Part V need, and are
// scoped by a body class so they can never affect a generated record. They are
// concatenated into the site stylesheet and are never inlined into a record.

// Documentation archetype (charter V.4). Long-form prose rendered from Markdown:
// the element rules Markdown emits and a record never does. Prose is held to the
// reading measure; wide apparatus wraps rather than scrolling the page (II.13).
const PROSE_STYLE = `

/* ── Documentation archetype (charter V.4) ── */
.doc h1{ margin:0 0 var(--s-5); }
.doc h4{ font-size:1rem; font-weight:500; margin:var(--s-5) 0 var(--s-2); }
.doc h5,.doc h6{ font-size:.9375rem; font-weight:500; color:var(--ink-2); margin:var(--s-4) 0 var(--s-2); }
.doc p,.doc li,.doc blockquote,.doc dl{ max-width:var(--measure); }
.doc p{ margin:0 0 var(--s-4); }
.doc ul,.doc ol{ margin:0 0 var(--s-4) var(--s-5); }
.doc li{ margin:var(--s-1) 0; }
.doc li>ul,.doc li>ol{ margin:var(--s-1) 0 0 var(--s-5); }
.doc blockquote{ margin:var(--s-4) 0; padding-left:var(--s-4);
  border-left:2px solid var(--rule-strong); color:var(--ink-2); }
.doc blockquote p:last-child{ margin-bottom:0; }
.doc hr{ border:0; border-top:1px solid var(--rule); margin:var(--s-6) 0; }
.doc dt{ font-weight:500; margin-top:var(--s-3); }
.doc dd{ margin:0 0 0 var(--s-4); color:var(--ink-2); }
.doc strong{ font-weight:500; }
.doc em{ font-style:italic; }
.doc img{ max-width:100%; height:auto; margin:var(--s-4) 0; }
.doc pre{ margin:var(--s-4) 0; }
.doc :not(pre)>code{ background:var(--paper-sunk); border-radius:2px;
  padding:.1em .35em; font-size:.875em; overflow-wrap:anywhere; }
/* Tables are hairline-ruled, never filled or zebra-striped (II.4). Long cell
   content wraps instead of pushing the page into a horizontal scroll (II.13). */
.doc table{ width:100%; border-collapse:collapse; font-size:.9375rem;
  margin:var(--s-4) 0; }
.doc th{ text-align:left; font-weight:500; padding:var(--s-2) var(--s-4) var(--s-2) 0;
  border-bottom:1px solid var(--rule-strong); }
.doc td{ padding:var(--s-2) var(--s-4) var(--s-2) 0; border-bottom:1px solid var(--rule);
  vertical-align:top; }
.doc th,.doc td{ overflow-wrap:anywhere; }
.doc th:last-child,.doc td:last-child{ padding-right:0; }
/* SiteFooter carries two lines on every non-generated surface. */
footer.site p{ margin:0 0 var(--s-2); max-width:none; }
footer.site p:last-child{ margin-bottom:0; }`;

// Home / institutional archetype (charter V.3). A hero instead of a SiteHeader,
// then sectioned link directories. Sections are separated by the h2 hairline that
// every other surface already uses, so the Home introduces no separator of its
// own. The components below (LinkList, Pipeline, StatusTable) are Part IV
// components and are named, not Home-scoped, but only the Home emits them today.
const HOME_STYLE = `

/* ── Home / institutional archetype (charter V.3) ── */
.home .hero{ padding:var(--s-8) 0 var(--s-6); }
.home .hero .badge{ margin-bottom:var(--s-5); }
.home .hero h1{ font-size:2.5rem; letter-spacing:-.04em; line-height:1.1;
  margin:0 0 var(--s-2); }
.home .tagline{ color:var(--ink-2); margin:0 0 var(--s-4); }
.home .hero .doi{ font-size:.8125rem; color:var(--ink-2); margin:0; }
.home .hero .boundary-rule{ margin-top:var(--s-6); }
.home section{ padding:0 0 var(--s-6); }
.home .concept{ margin:0; }
.home .principle{ margin:var(--s-4) 0 var(--s-5); }
.home .pipeline+h3.subhead{ margin-top:var(--s-6); }
.home main>.wrap>section:first-child h2{ margin-top:0; }

/* LinkList (Part IV) — an editorial directory: a sans name and one-line
   description in the institutional voice, with the machine locator in mono
   (II.6). Hairline-separated, never carded (II.5). */
ul.dir{ list-style:none; }
ul.dir li{ border-top:1px solid var(--rule); padding:var(--s-4) 0; }
ul.dir li:first-child{ border-top:0; padding-top:0; }
ul.dir .name{ font-size:1.0625rem; font-weight:400; }
ul.dir .desc{ font-size:.9375rem; color:var(--ink-2); max-width:var(--measure);
  margin:.15rem 0 var(--s-2); }
ul.dir .path{ font-family:var(--mono); font-size:.75rem; color:var(--ink-2);
  letter-spacing:.01em; overflow-wrap:anywhere; }

.concept{ color:var(--ink-2); max-width:var(--measure); }
.concept strong{ color:var(--ink); font-weight:400; }
/* Doctrinal prose, so it takes the editorial (sans) voice; monospace stays
   reserved for identifiers and machine data. */
.principle{ margin-top:var(--s-4); padding-left:var(--s-4);
  border-left:2px solid var(--rule-strong); font-size:1.0625rem; font-weight:400;
  max-width:var(--measure); }

h3.subhead{ font-size:1rem; font-weight:500; margin:var(--s-6) 0 var(--s-3); }

.pipeline{ font-family:var(--mono); font-size:.75rem; color:var(--ink-2);
  display:flex; flex-wrap:wrap; align-items:center; gap:var(--s-2);
  letter-spacing:.02em; }
.pipeline .node{ color:var(--ink); font-weight:500; }
.pipeline .arrow{ color:var(--ink-faint); }

/* StatusTable (Part IV) — name / state, hairline rows. --ok is a semantic state
   colour and appears nowhere else (II.1). */
dl.status{ display:grid; grid-template-columns:1fr max-content; margin:0; }
dl.status dt,dl.status dd{ padding:.55rem 0; border-bottom:1px solid var(--rule);
  font-family:var(--mono); margin:0; }
dl.status dt{ font-size:.75rem; color:var(--ink); }
dl.status dd{ font-size:.6875rem; color:var(--ok); letter-spacing:.06em;
  text-align:right; }`;

// Specification archetype (charter V.5 / Appendix F.3). Same tokens, paper, ink,
// families, hairlines and accessibility as every other surface; a heavier body
// register (400, not the 300 of a reading surface) and 600/700 headings give the
// normative document its gravity. Uniformity is one editorial voice, not one
// typographic weight.
const SPEC_STYLE = `

/* ── Specification archetype (charter V.5) ── */
.spec{ font-weight:400; line-height:1.6; }
.spec .cover{ padding:var(--s-7) 0 0; margin-bottom:var(--s-8); }
.spec .cover .label{ font-family:var(--mono); font-size:.75rem; letter-spacing:.14em;
  text-transform:uppercase; color:var(--ink-2); margin-bottom:var(--s-5); }
.spec .cover h1{ font-size:3rem; font-weight:700; letter-spacing:-.035em;
  line-height:1.08; margin:0 0 var(--s-2); }
.spec .cover .subtitle{ font-size:1.25rem; color:var(--ink-2); margin-bottom:var(--s-5); }
.spec .cover .version-badge{ display:inline-block; font-family:var(--mono);
  border:1px solid var(--rule-strong); color:var(--ink); font-weight:500;
  font-size:.6875rem; letter-spacing:.12em; text-transform:uppercase;
  padding:.25rem .6rem; border-radius:2px; margin-bottom:var(--s-5); }
.spec .cover .meta{ font-family:var(--mono); font-size:.8125rem; color:var(--ink-2);
  line-height:1.9; letter-spacing:.01em; }
.spec .cover .boundary-rule{ margin-top:var(--s-6); }

.spec p{ margin:0 0 var(--s-3); max-width:var(--measure); }
.spec .abstract{ margin-bottom:var(--s-7); }
.spec .abstract h2,.spec .toc h2{ font-family:var(--mono); font-size:.6875rem;
  font-weight:500; text-transform:uppercase; letter-spacing:.14em; color:var(--ink-2);
  margin:0 0 var(--s-3); }
.spec .toc{ margin-bottom:var(--s-8); }
.spec .toc h2{ padding-bottom:var(--s-2); border-bottom:1px solid var(--rule);
  margin-bottom:var(--s-4); }
.spec .toc ol{ list-style:none; margin:0; }
.spec .toc>ol>li{ margin-bottom:var(--s-1); }
.spec .toc a{ font-size:.9375rem; }
.spec .toc .toc-sub{ padding-left:var(--s-5); font-size:.8125rem; color:var(--ink-2);
  margin-top:.2rem; }

.spec section{ margin-bottom:var(--s-8); }
.spec h2.sec-title{ font-size:1.5rem; font-weight:600; letter-spacing:-.02em;
  border-bottom:2px solid var(--rule-strong); padding-bottom:var(--s-2);
  margin:var(--s-7) 0 var(--s-5); }
.spec h3.subsec-title{ font-size:1.125rem; font-weight:600; letter-spacing:-.01em;
  margin:var(--s-6) 0 var(--s-2); }
.spec h4.subsubsec-title{ font-size:.9375rem; font-weight:600; color:var(--ink-2);
  margin:var(--s-5) 0 var(--s-2); }

.spec ul.spec-list,.spec ol.spec-list{ margin:var(--s-2) 0 var(--s-4) var(--s-5);
  max-width:var(--measure); }
.spec ul.spec-list li,.spec ol.spec-list li{ margin-bottom:var(--s-1); }

/* RFC 2119 keywords are normative tokens, so they are set in the machine
   register — every MUST / SHOULD / MAY reads as load-bearing, not as prose. */
.spec .rfc{ font-family:var(--mono); font-weight:500; font-size:.9em; letter-spacing:.01em; }

.spec :not(pre)>code{ background:var(--paper-sunk); border-radius:2px;
  padding:.1em .35em; font-size:.875em; overflow-wrap:anywhere; }
.spec pre{ padding:1.25rem 1.5rem; margin:var(--s-4) 0 var(--s-5); line-height:1.6; }
.spec .ascii-diagram{ font-family:var(--mono); font-size:.8125rem;
  background:var(--paper-sunk); border:1px solid var(--rule); border-radius:6px;
  padding:1.25rem 1.5rem; margin:var(--s-4) 0 var(--s-5); white-space:pre;
  overflow-x:auto; }

.spec table.spec-table{ width:100%; border-collapse:collapse; font-size:.9375rem;
  margin:var(--s-4) 0 var(--s-5); }
.spec .spec-table th{ text-align:left; font-weight:500; padding:var(--s-2) var(--s-4) var(--s-2) 0;
  border-bottom:2px solid var(--rule-strong); }
.spec .spec-table td{ padding:var(--s-2) var(--s-4) var(--s-2) 0;
  border-bottom:1px solid var(--rule); vertical-align:top; }
.spec .spec-table th,.spec .spec-table td{ overflow-wrap:anywhere; }
.spec .spec-table th:last-child,.spec .spec-table td:last-child{ padding-right:0; }

.spec .annex-banner{ font-family:var(--mono); font-size:.6875rem; letter-spacing:.2em;
  text-transform:uppercase; color:var(--ink-2); border-top:1px solid var(--rule-strong);
  border-bottom:1px solid var(--rule-strong); padding:var(--s-2) 0;
  margin:var(--s-8) 0 var(--s-6); }
.spec .normative-note{ font-size:.8125rem; font-style:italic; color:var(--ink-2);
  margin-bottom:var(--s-4); }

@media print{
  body{ background:#fff; font-size:10pt; }
  .skip,nav.breadcrumb,header.site .surface{ display:none; }
  a{ color:inherit; }
  pre,.ascii-diagram{ font-size:7.5pt; }
}

@media (max-width:520px){
  .home .hero h1{ font-size:1.75rem; }
  .spec .cover h1{ font-size:2rem; }
  .spec h2.sec-title{ font-size:1.25rem; }
  .pipeline{ font-size:.6875rem; }
}`;

// The site stylesheet: the record layer plus the three archetype layers, emitted
// verbatim to assets/css/editorial.css by src/build-css.js. Dedenting the record
// layer (it is indented for inline embedding) is the only transformation.
export const SITE_STYLESHEET =
  EDITORIAL_STYLE.replace(/^ {4}/gm, '').trim() + '\n' + PROSE_STYLE + HOME_STYLE + SPEC_STYLE + '\n';

// Shared chrome markup builders — identical structure across generated surfaces
// so both pages emit the same header/footer/skip contract.
export function skipLink() {
  return '  <a class="skip" href="#main">Skip to content</a>';
}

export function siteHeader(surface = 'Academic Surface') {
  return [
    '  <header class="site">',
    '    <div class="wrap">',
    '      <span class="brand">Agent Manifest</span>',
    `      <span class="surface">${surface}</span>`,
    '      <div class="boundary-rule" aria-hidden="true"></div>',
    '    </div>',
    '  </header>'
  ].join('\n');
}

// The institutional line every generated surface carries, so a reader who lands
// on a Work — and never sees the rest of the site — can still reach the party
// responsible for it. `contact-path` is a DEL baseline requirement and it must
// hold on the Academic Surface too, not only on the Jekyll-rendered pages.
export const INSTITUTIONAL_LINKS =
  '<a href="/contact/">Contact</a> · <a href="/privacy/">Privacy</a> · ' +
  '<a href="/SECURITY.html">Security policy</a> · <a href="/GOVERNANCE.html">Governance</a>';

// `innerHtml` is the surface's own footer statement; further strings are emitted
// as additional paragraphs, in order. The institutional line is always last, so
// no caller can omit it.
export function siteFooter(innerHtml, ...extraParagraphs) {
  const paragraphs = [innerHtml, ...extraParagraphs, INSTITUTIONAL_LINKS]
    .filter((p) => typeof p === 'string' && p.length > 0)
    .map((p) => `      <p>${p}</p>`);
  return [
    '  <footer class="site">',
    '    <div class="wrap">',
    ...paragraphs,
    '    </div>',
    '  </footer>'
  ].join('\n');
}
