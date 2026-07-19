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

export function worksUrl(slug) {
  return `${BASE_URL}/works/${slug}`;
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
