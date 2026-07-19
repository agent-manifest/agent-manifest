// ASV-PROV-* provenance/authorship rules. The human-authorship guarantee uses an
// explicit is_human/agent_type attestation and role separation — never name
// matching (so human names are never rejected by accident).

import { diag, SEVERITY } from '../diagnostics.js';

const NON_HUMAN = new Set(['ai', 'software', 'service']);

export function validateProvenance(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  const prov = work.provenance;

  // ASV-PROV-001 — 100% human authorship (intellectual author attestation)
  if (prov?.intellectual_author && prov.intellectual_author.is_human === false) {
    out.push(diag('ASV-PROV-001', { path: `${p}.provenance.intellectual_author`, message: 'Intellectual author not attested human', remediation: 'The intellectual author must be human' }));
  }

  // ASV-PROV-002 — record creator separate from author, both human
  if (prov) {
    if (!prov.intellectual_author || !prov.record_creator) {
      out.push(diag('ASV-PROV-002', { path: `${p}.provenance`, message: 'Intellectual author and record creator roles not both declared (collapsed)', remediation: 'Declare both roles separately (both human)' }));
    } else if (prov.record_creator.is_human === false) {
      out.push(diag('ASV-PROV-002', { path: `${p}.provenance.record_creator`, message: 'Record creator not attested human', remediation: 'The record creator must be human' }));
    }
  }

  // ASV-PROV-003 — build activity separate; tool never author/contributor
  const authorNames = new Set((work.authors ?? []).flatMap((a) => [a.name_human, a.name_normalized].filter(Boolean)));
  const contributorNames = new Set((work.contributions ?? []).map((c) => c.contributor).filter(Boolean));
  const tool = prov?.build_activity?.tool;
  if (tool && (authorNames.has(tool) || contributorNames.has(tool))) {
    out.push(diag('ASV-PROV-003', { path: `${p}.provenance.build_activity`, message: `Build tool '${tool}' also appears as author/contributor`, remediation: 'The tool belongs only in build_activity, never as author/contributor' }));
  }
  (work.authors ?? []).forEach((a, i) => {
    if (a.agent_type && NON_HUMAN.has(a.agent_type)) {
      out.push(diag('ASV-PROV-003', { path: `${p}.authors[${i}]`, message: `Non-human agent listed as author: ${a.name_human ?? a.agent_type}`, remediation: 'No AI/tool as author/contributor/maintainer/steward' }));
    }
  });

  // ASV-PROV-004 — technical assistance only as a non-authorial note (WARNING)
  (work.contributions ?? []).forEach((c, i) => {
    if (c.agent_type && NON_HUMAN.has(c.agent_type)) {
      out.push(diag('ASV-PROV-004', { severity: SEVERITY.WARNING, path: `${p}.contributions[${i}]`, message: `Technical/AI assistance recorded as a contribution: ${c.contributor}`, remediation: 'Move it to provenance.methodological_notes (non-authorial)' }));
    }
  });

  // ASV-PROV-005 — external discrepancies as provenance, no simultaneous types
  (prov?.type_discrepancies ?? []).forEach((d, i) => {
    if (d.value === work.type) {
      out.push(diag('ASV-PROV-005', { severity: SEVERITY.WARNING, path: `${p}.provenance.type_discrepancies[${i}]`, message: `Recorded discrepancy equals the canonical type '${work.type}' (not a discrepancy)`, remediation: 'Only record genuinely divergent external types', evidence: d.value }));
    }
  });

  return out;
}
