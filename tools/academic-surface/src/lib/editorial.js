// Academic Editorial System v1.0 — the single shared editorial layer for the
// generated Academic Surface pages (Work landing + /works index). See
// tools/academic-surface/docs/EDITORIAL-SYSTEM.md for the governing spec.
//
// This module owns ONLY the editorial layer: design tokens, one stylesheet, and
// the brand font links. It never touches SSOT, metadata (citation_*, JSON-LD,
// Highwire, DC, OG, signposting, exports), canonical, validators, or determinism.
// It is a pure string module: no clock, no network. Same import -> same bytes.

// Brand fonts (DM Sans + DM Mono), matching the ecosystem Home. A robust system
// fallback stack (in the tokens below) keeps the page fully legible if the fonts
// fail to load. Emitting a static <link> is deterministic — no fetch at build.
export const FONT_LINKS = [
  '  <link rel="preconnect" href="https://fonts.googleapis.com">',
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">'
].join('\n');

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
      --focus:#1a3a5c; --ok:#3a6b3a;
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

export function siteFooter(innerHtml) {
  return [
    '  <footer class="site">',
    '    <div class="wrap">',
    `      <p>${innerHtml}</p>`,
    '    </div>',
    '  </footer>'
  ].join('\n');
}
