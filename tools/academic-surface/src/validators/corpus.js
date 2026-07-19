// ASV-CORP-* plus cross-record ASV-REL-* / ASV-WEB-004 rules over a set of Works.

import { diag, SEVERITY } from '../diagnostics.js';
import { isSyntacticDoi } from '../lib/doi.js';
import { worksUrl } from '../lib/canonical.js';

const INVERSE = {
  isSupplementTo: 'isSupplementedBy', isSupplementedBy: 'isSupplementTo',
  references: 'isReferencedBy', isReferencedBy: 'references',
  isTranslationOf: 'hasTranslation', hasTranslation: 'isTranslationOf',
  Obsoletes: 'IsObsoletedBy', IsObsoletedBy: 'Obsoletes',
  isVersionOf: 'hasVersion', hasVersion: 'isVersionOf',
  isPartOf: 'hasPart', hasPart: 'isPartOf',
  'ams:implements': 'ams:isImplementedBy', 'ams:isImplementedBy': 'ams:implements'
};
const ACYCLIC = new Set(['Obsoletes', 'isSupplementTo', 'ams:implements', 'isPartOf']);

function workRelations(work) {
  const rels = (work.relations ?? []).map((r) => ({ ...r }));
  for (const v of work.versions ?? []) for (const r of v.relations ?? []) rels.push({ ...r });
  return rels;
}

export function validateCorpus(works, opts = {}) {
  const out = [];
  const isCorpus = opts.isCorpus === true;
  const byId = new Map(works.map((w) => [w.id, w]));

  // ASV-CORP-001 / ASV-WORK-001 — global uniqueness
  countDuplicates(works.map((w) => w.id)).forEach((id) =>
    out.push(diag('ASV-WORK-001', { path: 'corpus', message: `Duplicate Work id: ${id}`, remediation: 'Work ids must be globally unique', evidence: id })));
  countDuplicates(works.map((w) => w.slug)).forEach((slug) =>
    out.push(diag('ASV-CORP-001', { path: 'corpus', message: `Duplicate slug: ${slug}`, remediation: 'Slugs must be globally unique', evidence: slug })));
  const allVersionDois = works.flatMap((w) => (w.versions ?? []).map((v) => v.doi_version).filter(Boolean));
  countDuplicates(allVersionDois).forEach((doi) =>
    out.push(diag('ASV-CORP-001', { path: 'corpus', message: `Duplicate doi_version: ${doi}`, remediation: 'Each version DOI belongs to exactly one Version', evidence: doi })));

  for (const w of works) {
    const p = `works[${w.id}]`;

    // ASV-CORP-002 — tier coherence (WARNING): software/dataset not Tier 1/2
    if ((w.type === 'software' || w.type === 'dataset') && (w.tier === 1 || w.tier === 2)) {
      out.push(diag('ASV-CORP-002', { severity: SEVERITY.WARNING, path: `${p}.tier`, message: `${w.type} placed in Tier ${w.tier} (textual launch tiers)`, remediation: 'Keep software/datasets as related nodes (Tier 3/null)', evidence: w.tier }));
    }

    // ASV-CORP-003 — a Work must carry a DOI (concept or version) to be public/published
    const anyDoi = w.doi_concept || (w.versions ?? []).some((v) => v.doi_version);
    if (!anyDoi && (w.status === 'published' || w.visibility === 'public')) {
      out.push(diag('ASV-CORP-003', { path: `${p}`, message: 'Published/public Work without any DOI', remediation: 'Objects without a DOI are not Works; reference them as repositories/external nodes', evidence: w.id }));
    }

    // ASV-CORP-004 — independent corpus item must not be a member
    if (w.external_corpus === true) {
      out.push(diag('ASV-CORP-004', { path: `${p}`, message: `Independent-corpus item included as a member: ${w.id}`, remediation: 'Keep independent corpora (e.g. AGTS) out of /works; never a layer/dependency', evidence: w.id }));
    }

    // Cross-record relation checks
    workRelations(w).forEach((r, i) => {
      const rp = `${p}.relations[${i}]`;
      if (r.target_id) {
        const target = byId.get(r.target_id);
        if (!target) {
          if (isCorpus) out.push(diag('ASV-REL-003', { path: rp, message: `Relation target not found: ${r.target_id}`, remediation: 'Fix the target id or add the referenced Work', evidence: r.target_id }));
          else out.push(diag('ASV-REL-003', { severity: SEVERITY.INFO, path: rp, message: `Internal target ${r.target_id} not in this single-record input (unverified)`, remediation: 'Validate as a corpus to verify internal targets', evidence: r.target_id }));
          return;
        }
        // ASV-REL-002 — inverse required on the target
        const inv = INVERSE[r.predicate];
        if (inv) {
          const hasInverse = workRelations(target).some((tr) => tr.predicate === inv && tr.target_id === w.id);
          if (!hasInverse) out.push(diag('ASV-REL-002', { path: rp, message: `Missing inverse '${inv}' on ${r.target_id} back to ${w.id}`, remediation: `Declare ${inv} on the target Work`, evidence: r.predicate }));
        }
        // ASV-REL-007 — isVersionOf between two Works of different language = translation-as-version
        if ((r.predicate === 'isVersionOf' || r.predicate === 'hasVersion') && target.language && w.language && target.language !== w.language) {
          out.push(diag('ASV-REL-007', { path: rp, message: `Translation modeled as version (${w.language} ${r.predicate} ${target.language})`, remediation: 'Use isTranslationOf/hasTranslation between sibling Works; never isVersionOf', evidence: r.predicate }));
        }
      } else if (r.target_doi && !isSyntacticDoi(r.target_doi)) {
        out.push(diag('ASV-REL-003', { path: rp, message: `Malformed external target DOI: ${r.target_doi}`, remediation: 'Use a syntactically valid DOI', evidence: r.target_doi }));
      }
    });
  }

  // ASV-REL-004 — cycles in acyclic relations
  detectCycles(works).forEach((cyc) =>
    out.push(diag('ASV-REL-004', { path: 'corpus', message: `Invalid cycle in acyclic relations: ${cyc.join(' -> ')}`, remediation: 'Acyclic relations (Obsoletes/supplement/implements/isPartOf) must form a DAG', evidence: cyc })));

  // ASV-REL-007 (reciprocity) + ASV-WEB-004 (translation surface) for translation pairs
  for (const w of works) {
    for (const r of workRelations(w)) {
      if (r.predicate !== 'isTranslationOf' && r.predicate !== 'hasTranslation') continue;
      const t = byId.get(r.target_id);
      if (!t) continue;
      const reciprocal = workRelations(t).some((tr) => (tr.predicate === 'isTranslationOf' || tr.predicate === 'hasTranslation') && tr.target_id === w.id);
      if (!reciprocal) out.push(diag('ASV-REL-007', { path: `works[${w.id}]`, message: `Unilateral translation link to ${r.target_id} (no reciprocal)`, remediation: 'Declare the reciprocal translation relation on the sibling', evidence: r.predicate }));
      // ASV-WEB-004 — each translation self-canonical + reciprocal hreflang
      if (w.web && w.slug && w.web.canonical && w.web.canonical !== worksUrl(w.slug)) {
        out.push(diag('ASV-WEB-004', { path: `works[${w.id}].web.canonical`, message: 'Translation not self-canonical', remediation: 'Each language edition is self-canonical', evidence: w.web.canonical }));
      }
      if (w.web && t.language) {
        const hasHreflang = Array.isArray(w.web.hreflang) && w.web.hreflang.some((h) => h.lang === t.language);
        if (!hasHreflang) out.push(diag('ASV-WEB-004', { path: `works[${w.id}].web.hreflang`, message: `Missing reciprocal hreflang for '${t.language}'`, remediation: 'Declare hreflang in both directions', evidence: t.language }));
      }
    }
  }

  return out;
}

function countDuplicates(values) {
  const seen = new Set();
  const dups = new Set();
  for (const v of values) {
    if (v === undefined || v === null) continue;
    if (seen.has(v)) dups.add(v);
    seen.add(v);
  }
  return [...dups];
}

function detectCycles(works) {
  const edges = new Map(); // id -> Set(id)
  const add = (a, b) => { if (!edges.has(a)) edges.set(a, new Set()); edges.get(a).add(b); };
  for (const w of works) {
    for (const r of workRelations(w)) {
      if (ACYCLIC.has(r.predicate) && r.target_id) add(w.id, r.target_id);
    }
  }
  const cycles = [];
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  const stack = [];
  function dfs(u) {
    color.set(u, GRAY);
    stack.push(u);
    for (const v of edges.get(u) ?? []) {
      if ((color.get(v) ?? WHITE) === GRAY) {
        const idx = stack.indexOf(v);
        cycles.push([...stack.slice(idx), v]);
      } else if ((color.get(v) ?? WHITE) === WHITE) dfs(v);
    }
    stack.pop();
    color.set(u, BLACK);
  }
  for (const u of edges.keys()) if ((color.get(u) ?? WHITE) === WHITE) dfs(u);
  return cycles;
}
