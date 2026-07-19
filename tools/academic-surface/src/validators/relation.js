// ASV-REL-* single-record predicate rules. Cross-record checks (inverse,
// target-exists, cycles, translation reciprocity) live in corpus.js.

import { diag } from '../diagnostics.js';

const ALLOWED_AMS = new Set(['ams:implements', 'ams:isImplementedBy']);

function collectRelations(work) {
  const rels = [...(work.relations ?? [])];
  for (const v of work.versions ?? []) for (const r of v.relations ?? []) rels.push(r);
  return rels;
}

export function validateRelation(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  collectRelations(work).forEach((r, i) => {
    const rp = `${p}.relations[${i}]`;
    const pred = r.predicate;
    if (pred === 'relatedWork') {
      out.push(diag('ASV-REL-001', { path: rp, message: 'Generic relatedWork predicate is forbidden', remediation: 'Use a specific DataCite predicate or ams:implements', evidence: pred }));
    }
    if (typeof pred === 'string' && pred.startsWith('ams:') && !ALLOWED_AMS.has(pred)) {
      if (pred === 'ams:supersedes') {
        out.push(diag('ASV-REL-006', { path: rp, message: 'ams:supersedes is forbidden', remediation: 'Model supersession with DataCite Obsoletes/IsObsoletedBy', evidence: pred }));
      } else {
        out.push(diag('ASV-REL-005', { path: rp, message: `Proprietary predicate other than implements: ${pred}`, remediation: 'Restrict ams: vocabulary to implements/isImplementedBy', evidence: pred }));
      }
    }
  });
  return out;
}
