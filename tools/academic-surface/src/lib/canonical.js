// Shared canonical-derivation helpers used by exports/scholar/web validators.

export const BASE_URL = 'https://agent-manifest-spec.org';

// Scholar-eligible textual types (emit citation_* tags). dataset/software do not.
export const TEXTUAL_TYPES = new Set([
  'paper', 'working-paper', 'standard', 'manifesto', 'book', 'public-comment', 'report', 'essay'
]);

export function isTextual(type) {
  return TEXTUAL_TYPES.has(type);
}

export function currentVersion(work) {
  return (work.versions ?? []).find((v) => v.is_current === true) ?? null;
}

/**
 * The primary downloadable artifact of the current version, of ANY kind
 * (pdf, code, dataset, …). The generators used to assume a PDF; a software or
 * dataset Work carries a different artifact kind, so representation code reads
 * the artifact generically and only branches on `kind` where a format genuinely
 * differs (e.g. Scholar citation_pdf_url, which is PDF-only).
 */
export function currentArtifact(work) {
  const cur = currentVersion(work);
  return (cur?.artifacts ?? [])[0] ?? null;
}

/**
 * The canonical landing URL of a Work.
 *
 * The trailing slash is load-bearing. GitHub Pages serves a Work at
 * `/works/<slug>/` and 301-redirects the slash-less form to it, so a canonical,
 * `og:url`, `citation_abstract_html_url`, JSON-LD `@id`, or sitemap `<loc>`
 * written without it declares a URL that never returns 200 — which makes search
 * engines pick their own canonical and makes every relative href on the page
 * (the PDF, the exports) resolve one directory too high. The declared canonical
 * must be the URL that is actually served.
 */
export function worksUrl(slug) {
  return `${BASE_URL}/works/${slug}/`;
}

/** The historical, frozen landing of one version: /works/<slug>/vN. */
export function versionUrl(slug, vN) {
  return `${worksUrl(slug)}${vN}`;
}

/** A Work is on the public surface only when it is both public and published. */
export function isPublished(work) {
  return work?.visibility === 'public' && work?.status === 'published';
}

/** Canonical citation fields; every export/Scholar tag must agree with these. */
export function canonicalCitation(work) {
  const cur = currentVersion(work);
  return {
    title: work.title ?? null,
    authors: (work.authors ?? []).map((a) => a.name_normalized ?? a.name_human ?? ''),
    date: cur?.date ?? work.date ?? null,
    doi: cur?.doi_version ?? work.doi_concept ?? null,
    version: cur?.vN ?? null
  };
}

/** ISO YYYY-MM-DD -> Scholar YYYY/MM/DD. */
export function scholarDate(iso) {
  return typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.replace(/-/g, '/') : null;
}

/**
 * Per-type human/format specifics. The `working-paper` values reproduce the
 * pilot's existing bytes exactly; every other type extends the same shape.
 * `label` is the human class name (badge, facts row, citation notes);
 * `cslType`/`cslGenre` drive CSL-JSON; `bibtex`/`risTy` drive the entry types.
 */
export const TYPE_META = Object.freeze({
  'paper':          { label: 'Paper',          cslType: 'article', cslGenre: null,            bibtex: 'misc', risTy: 'GEN' },
  'working-paper':  { label: 'Working paper',  cslType: 'article', cslGenre: 'Working paper', bibtex: 'misc', risTy: 'GEN' },
  'standard':       { label: 'Standard',       cslType: 'article', cslGenre: 'Standard',      bibtex: 'misc', risTy: 'GEN' },
  'manifesto':      { label: 'Manifesto',      cslType: 'article', cslGenre: 'Manifesto',     bibtex: 'misc', risTy: 'GEN' },
  'essay':          { label: 'Essay',          cslType: 'article', cslGenre: 'Essay',         bibtex: 'misc', risTy: 'GEN' },
  'report':         { label: 'Report',         cslType: 'report',  cslGenre: null,            bibtex: 'techreport', risTy: 'RPRT' },
  'public-comment': { label: 'Public comment', cslType: 'report',  cslGenre: null,            bibtex: 'techreport', risTy: 'RPRT' },
  'book':           { label: 'Book',           cslType: 'book',    cslGenre: null,            bibtex: 'book', risTy: 'BOOK' },
  // Non-textual kinds. They do NOT emit Google Scholar citation_* tags
  // (see TEXTUAL_TYPES); their CSL/BibTeX/RIS still carry an honest, citable
  // entry. RIS COMP = computer program; CSL 'software'/'dataset' are 1.0.2 types.
  'software':       { label: 'Software',       cslType: 'software', cslGenre: null,           bibtex: 'misc', risTy: 'COMP' },
  'dataset':        { label: 'Dataset',        cslType: 'dataset',  cslGenre: null,           bibtex: 'misc', risTy: 'DATA' }
});

/** Type specifics with a safe generic fallback. */
export function typeMeta(type) {
  return TYPE_META[type] ?? { label: type ?? 'Document', cslType: 'article', cslGenre: null, bibtex: 'misc', risTy: 'GEN' };
}

/** BCP-47 tag -> human language name for the visible facts row. */
export const LANG_LABEL = Object.freeze({ en: 'English', es: 'Spanish' });
export function langLabel(code) {
  return LANG_LABEL[code] ?? code;
}

/**
 * DCMI Type Vocabulary value for the Dublin Core `DC.type`. Textual works are
 * 'Text'; software and datasets map to their DCMI kinds. Anything unmapped is a
 * textual document by default (preserves prior behavior for every textual type).
 */
export const DC_TYPE = Object.freeze({ software: 'Software', dataset: 'Dataset' });
export function dublinCoreType(type) {
  return DC_TYPE[type] ?? 'Text';
}

/** Schema.org @type expected from the canonical Work type (ASV-WEB-020). */
export const TYPE_TO_JSONLD = Object.freeze({
  'paper': 'ScholarlyArticle',
  'working-paper': 'ScholarlyArticle',
  'standard': 'ScholarlyArticle',
  'manifesto': 'ScholarlyArticle',
  'essay': 'ScholarlyArticle',
  'public-comment': 'Report',
  'report': 'Report',
  'book': 'Book',
  'dataset': 'Dataset',
  'software': 'SoftwareSourceCode'
});
