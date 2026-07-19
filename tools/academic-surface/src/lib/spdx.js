// SPDX identifier validation (ASV-WORK-011). A curated subset sufficient for the
// Academic Surface corpus; rejects free-text strings like "CC BY". Extending the
// list is an implementation detail (Gate C), not an architectural decision.

const SPDX = new Set([
  'CC-BY-4.0', 'CC-BY-SA-4.0', 'CC-BY-NC-4.0', 'CC-BY-ND-4.0', 'CC-BY-NC-SA-4.0', 'CC-BY-NC-ND-4.0',
  'CC0-1.0', 'CC-BY-3.0',
  'Apache-2.0', 'MIT', 'BSD-2-Clause', 'BSD-3-Clause', 'MPL-2.0',
  'GPL-3.0-only', 'GPL-3.0-or-later', 'LGPL-3.0-only', 'AGPL-3.0-only',
  'ISC', 'Unlicense'
]);

/** True when `id` is a known SPDX identifier (case-sensitive, canonical form). */
export function isValidSpdx(id) {
  return typeof id === 'string' && SPDX.has(id);
}
