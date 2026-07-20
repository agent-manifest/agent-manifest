// Shared HTML/JSON string helpers for the generators. Pure: no clock, no
// network, no filesystem. Same input -> same bytes.
//
// These lived in three near-identical copies (landing.js, works-index.js,
// derive.js). One copy is one contract.

/** Escape for HTML text and for double-quoted attribute values alike. */
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Alias kept for call-site readability: attr(x) reads as "attribute value". */
export const attr = esc;

/**
 * Deterministic JSON: keys sorted at every level, so the same object always
 * serializes to the same bytes regardless of insertion order.
 */
export function stableJson(value, { trailingNewline = false } = {}) {
  const sort = (v) =>
    Array.isArray(v)
      ? v.map(sort)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort(v[k])]))
        : v;
  return JSON.stringify(sort(value), null, 2) + (trailingNewline ? '\n' : '');
}

/**
 * Serialize a JSON-LD graph for embedding inside <script type="application/ld+json">.
 *
 * JSON.stringify does not escape `<`, so a Work whose title, abstract, or keyword
 * contained the literal `</script>` would terminate the script element early and
 * spill the remainder of the record into the document as live markup — a broken
 * metadata block and an injection on a published page. Escaping `<` as its JSON
 * unicode form keeps the value semantically identical (any JSON parser, including
 * the consistency checker, reads it back unchanged) while making the sequence
 * unrepresentable in the byte stream.
 */
export function jsonLdBody(value) {
  return stableJson(value).replace(/</g, '\\u003c');
}
