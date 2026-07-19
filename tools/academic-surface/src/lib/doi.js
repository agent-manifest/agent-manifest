// Syntactic DOI checks only. Online resolution lives in remote.js and is never
// part of the build (Precision 1 & 2; ASV-WORK-009 / ASV-VER-003 / ASV-WEB-011).

const DOI_RE = /^10\.\d{4,9}\/[-._;()/:a-z0-9]+$/i;

/** Strip a doi.org / dx.doi.org prefix and surrounding whitespace. */
export function normalizeDoi(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
}

/** True when `value` is a syntactically valid DOI (no network involved). */
export function isSyntacticDoi(value) {
  return DOI_RE.test(normalizeDoi(value));
}
