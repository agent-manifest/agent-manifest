// ASV-VER-* semantic rules (single record).

import { diag } from '../diagnostics.js';
import { isSyntacticDoi } from '../lib/doi.js';
import { currentVersion } from '../lib/canonical.js';

export function validateVersion(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  const versions = work.versions ?? [];

  // ASV-VER-001 — vN monotonic, unique, no gaps
  const nums = versions.map((v) => (typeof v.vN === 'string' ? Number(v.vN.slice(1)) : NaN));
  const seen = new Set();
  let dupOrBad = false;
  for (const n of nums) {
    if (!Number.isInteger(n) || seen.has(n)) dupOrBad = true;
    seen.add(n);
  }
  const sorted = [...seen].sort((a, b) => a - b);
  const hasGap = sorted.length > 0 && (sorted[0] !== 1 || sorted[sorted.length - 1] !== sorted.length);
  if (dupOrBad || hasGap) {
    out.push(diag('ASV-VER-001', { path: `${p}.versions`, message: `vN sequence invalid (duplicate or gap): ${versions.map((v) => v.vN).join(', ')}`, remediation: 'Number versions monotonically from v1 with no gaps or duplicates', evidence: versions.map((v) => v.vN) }));
  }

  // ASV-VER-003 — doi_version valid, distinct from concept
  versions.forEach((v, i) => {
    if (v.doi_version) {
      if (!isSyntacticDoi(v.doi_version)) out.push(diag('ASV-VER-003', { path: `${p}.versions[${i}].doi_version`, message: `Malformed doi_version: ${v.doi_version}`, remediation: 'Use a syntactically valid version DOI', evidence: v.doi_version }));
      if (work.doi_concept && v.doi_version === work.doi_concept) out.push(diag('ASV-VER-003', { path: `${p}.versions[${i}].doi_version`, message: 'doi_version equals the Work doi_concept', remediation: 'Version DOI must differ from the concept DOI', evidence: v.doi_version }));
    }
  });

  // ASV-VER-004 — exactly one current
  const currents = versions.filter((v) => v.is_current === true).length;
  if (currents !== 1) {
    out.push(diag('ASV-VER-004', { path: `${p}.versions`, message: `Exactly one current version required; found ${currents}`, remediation: 'Mark exactly one version is_current=true; freeze the rest', evidence: currents }));
  }

  // ASV-VER-005 — Work/Version stay distinct in exports (no identity fusion)
  const cur = currentVersion(work);
  if (cur && Array.isArray(work.exports?.formats)) {
    work.exports.formats.forEach((f, i) => {
      if (!f.fields || f.fields.version === undefined || f.fields.version === null || f.fields.version === '') {
        out.push(diag('ASV-VER-005', { path: `${p}.exports.formats[${i}]`, message: `Export '${f.name}' omits version identity (Work/Version collapsed)`, remediation: 'Every export must carry the Version identity distinct from the Work', evidence: f.name }));
      }
    });
  }

  // ASV-VER-006 — changelog append-only (proxy: no duplicate/empty entries)
  versions.forEach((v, i) => {
    if (Array.isArray(v.changelog)) {
      const cl = v.changelog;
      const dup = new Set(cl).size !== cl.length;
      const empty = cl.some((e) => !e || !e.trim());
      if (dup || empty) out.push(diag('ASV-VER-006', { path: `${p}.versions[${i}].changelog`, message: 'changelog has duplicate/empty entries (append-only integrity)', remediation: 'Only append non-empty, distinct entries; never rewrite history' }));
    }
  });

  return out;
}
