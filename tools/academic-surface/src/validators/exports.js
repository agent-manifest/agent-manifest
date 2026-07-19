// ASV-EXP-* export consistency rules (single record).

import { diag } from '../diagnostics.js';
import { canonicalCitation } from '../lib/canonical.js';

function sameAuthors(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((x, i) => x === b[i]);
}

export function validateExports(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  const ex = work.exports;
  if (!ex) return out; // exports are optional in Gate C; if present they must be consistent

  const canon = canonicalCitation(work);

  // ASV-EXP-001 — CSL-JSON is the canonical derived source
  if (ex.canonical_source !== 'csl-json' || !ex.csl_json) {
    out.push(diag('ASV-EXP-001', { path: `${p}.exports`, message: 'Exports must derive from CSL-JSON as the canonical source', remediation: "Set canonical_source='csl-json' and provide csl_json", evidence: ex.canonical_source ?? null }));
  }

  // ASV-EXP-002 — field identity across every format
  (ex.formats ?? []).forEach((f, i) => {
    const fp = `${p}.exports.formats[${i}]`;
    const fields = f.fields ?? {};
    const diffs = [];
    if (fields.title !== undefined && fields.title !== canon.title) diffs.push('title');
    if (fields.date !== undefined && fields.date !== canon.date) diffs.push('date');
    if (fields.doi !== undefined && fields.doi !== canon.doi) diffs.push('doi');
    if (fields.version !== undefined && fields.version !== canon.version) diffs.push('version');
    if (fields.authors !== undefined && !sameAuthors(fields.authors, canon.authors)) diffs.push('authors');
    if (diffs.length) {
      out.push(diag('ASV-EXP-002', { path: fp, message: `Export '${f.name}' diverges from canonical in: ${diffs.join(', ')}`, remediation: 'Regenerate all formats from the canonical fields; the canonical wins', evidence: diffs }));
    }
  });

  // ASV-EXP-003 — generated CSL-JSON reproducible from canonical (proxy)
  if (ex.csl_json) {
    const c = ex.csl_json;
    if (c.title !== undefined && c.title !== canon.title) {
      out.push(diag('ASV-EXP-003', { path: `${p}.exports.csl_json.title`, message: 'csl_json.title not reproducible from canonical (hand-edited?)', remediation: 'Edit only the canonical fields and regenerate', evidence: c.title }));
    }
    if (c.DOI !== undefined && c.DOI !== canon.doi) {
      out.push(diag('ASV-EXP-003', { path: `${p}.exports.csl_json.DOI`, message: 'csl_json.DOI not reproducible from canonical', remediation: 'Regenerate CSL-JSON from canonical fields', evidence: c.DOI }));
    }
  }

  return out;
}
