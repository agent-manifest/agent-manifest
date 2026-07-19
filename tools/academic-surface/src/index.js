// Public API: validate an Academic Surface input (single Work, corpus, or release
// operation). Structural (AJV) + deterministic semantic ASV-* rules + governed
// exceptions, returning stable diagnostics and an aggregate report.

import { validateStructural, detectKind } from './schema-loader.js';
import { aggregate, sortDiagnostics, SEVERITY } from './diagnostics.js';
import { applyExceptions, lintExceptions } from './exceptions.js';

import { validateWork } from './validators/work.js';
import { validateVersion } from './validators/version.js';
import { validateArtifact } from './validators/artifact.js';
import { validateRelation } from './validators/relation.js';
import { validateExports } from './validators/exports.js';
import { validateWeb } from './validators/web.js';
import { validateScholar } from './validators/scholar.js';
import { validateProvenance } from './validators/provenance.js';
import { validateWithdrawn } from './validators/withdrawn.js';
import { validateRelease } from './validators/release.js';
import { validateCorpus } from './validators/corpus.js';

const WORK_VALIDATORS = [
  validateWork, validateVersion, validateArtifact, validateRelation,
  validateExports, validateWeb, validateScholar, validateProvenance, validateWithdrawn
];

function structuralDiag(err) {
  return {
    rule_id: 'STRUCTURAL',
    severity: SEVERITY.ERROR,
    level: 'structural',
    path: err.instancePath || '(root)',
    message: `Schema violation: ${err.message}${err.params ? ' ' + JSON.stringify(err.params) : ''}`,
    remediation: 'Fix the record to satisfy the JSON Schema',
    evidence: err.schemaPath,
    exception_id: null
  };
}

function noteDiag(ruleIdless, message, path) {
  return { rule_id: ruleIdless, severity: SEVERITY.WARNING, level: 'meta', path, message, remediation: 'See Gate B §R', evidence: undefined, exception_id: null };
}

function runWork(work) {
  const ctx = { wpath: `works[${work.id ?? '?'}]` };
  const out = [];
  for (const fn of WORK_VALIDATORS) {
    try { out.push(...fn(work, ctx)); }
    catch (e) { out.push(noteDiag('VALIDATOR-ERROR', `${fn.name} threw: ${e.message}`, ctx.wpath)); }
  }
  return out;
}

function todayIso() {
  // Library default only; tests pass an explicit asOf for determinism.
  return new Date().toISOString().slice(0, 10);
}

/**
 * @param {object} input parsed JSON (work | corpus | release)
 * @param {{ asOf?: string }} opts
 * @returns {{ kind, structural, diagnostics, report }}
 */
export function validate(input, opts = {}) {
  const asOf = opts.asOf ?? todayIso();
  const kind = detectKind(input);
  const structural = validateStructural(input);
  let diagnostics = structural.errors.map(structuralDiag);

  if (kind === 'release') {
    try { diagnostics.push(...validateRelease(input)); }
    catch (e) { diagnostics.push(noteDiag('VALIDATOR-ERROR', `validateRelease threw: ${e.message}`, 'release')); }
  } else if (kind === 'corpus') {
    const works = Array.isArray(input.works) ? input.works : [];
    for (const w of works) diagnostics.push(...runWork(w));
    try { diagnostics.push(...validateCorpus(works, { isCorpus: true })); }
    catch (e) { diagnostics.push(noteDiag('VALIDATOR-ERROR', `validateCorpus threw: ${e.message}`, 'corpus')); }
    diagnostics = withExceptions(diagnostics, input.governed_exceptions ?? [], asOf);
  } else {
    diagnostics.push(...runWork(input));
    try { diagnostics.push(...validateCorpus([input], { isCorpus: false })); }
    catch (e) { diagnostics.push(noteDiag('VALIDATOR-ERROR', `validateCorpus threw: ${e.message}`, 'corpus')); }
    diagnostics = withExceptions(diagnostics, input.governed_exceptions ?? [], asOf);
  }

  diagnostics = sortDiagnostics(diagnostics);
  return { kind, structural: { valid: structural.valid }, diagnostics, report: aggregate(diagnostics) };
}

function withExceptions(diagnostics, exceptions, asOf) {
  const problems = lintExceptions(exceptions);
  const noted = problems.map((p) => noteDiag('EXCEPTION-LINT', `Inert governed exception: ${p}`, 'exceptions'));
  return [...applyExceptions(diagnostics, exceptions, { asOf }), ...noted];
}
