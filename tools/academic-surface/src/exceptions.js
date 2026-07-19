// Governed-exception engine (Gate B §R). Never silent, never global, always with
// an expiry. A live exception downgrades a matching ERROR/WARNING to
// GOVERNED_EXCEPTION (non-blocking) and stamps its id; an expired/invalid one
// leaves the original severity intact (reactivation).

import { SEVERITY } from './diagnostics.js';

/**
 * Structural/semantic sanity of the exceptions themselves (beyond JSON Schema):
 * scope must not be empty ("global"), and expiry must be present.
 * @returns {string[]} human-readable problems (each makes that exception inert)
 */
export function lintExceptions(exceptions = []) {
  const problems = [];
  for (const ex of exceptions) {
    const s = ex.scope ?? {};
    const anyTarget =
      (s.work_ids && s.work_ids.length) ||
      (s.slugs && s.slugs.length) ||
      (s.paths && s.paths.length);
    if (!anyTarget) problems.push(`${ex.id}: scope is empty (global exceptions are forbidden)`);
    if (!ex.expires) problems.push(`${ex.id}: missing expiry (exceptions must expire)`);
  }
  return problems;
}

function isLive(ex, asOf) {
  // Live while asOf <= expires (inclusive). ISO YYYY-MM-DD compares lexically.
  return typeof ex.expires === 'string' && asOf <= ex.expires;
}

function scopeMatches(ex, d) {
  const s = ex.scope ?? {};
  const path = d.path ?? '';
  if (s.work_ids && s.work_ids.some((id) => path.includes(id))) return true;
  if (s.slugs && s.slugs.some((slug) => path.includes(slug))) return true;
  if (s.paths && s.paths.some((p) => path.includes(p))) return true;
  return false;
}

/**
 * Apply exceptions to diagnostics. Returns a new array; matched blocking findings
 * become GOVERNED_EXCEPTION with exception_id set. Invalid exceptions (see
 * lintExceptions) are treated as inert, so they cannot silence anything.
 *
 * @param {object[]} diagnostics
 * @param {object[]} exceptions
 * @param {{ asOf: string }} opts  asOf = reference date (YYYY-MM-DD), explicit for determinism
 */
export function applyExceptions(diagnostics, exceptions = [], opts = {}) {
  const asOf = opts.asOf;
  if (!asOf) throw new Error('applyExceptions requires an explicit asOf date (YYYY-MM-DD).');
  const inert = new Set(lintExceptions(exceptions).map((p) => p.split(':')[0]));
  const live = exceptions.filter((ex) => !inert.has(ex.id) && isLive(ex, asOf));

  return diagnostics.map((d) => {
    if (d.severity !== SEVERITY.ERROR && d.severity !== SEVERITY.WARNING) return d;
    const match = live.find((ex) => ex.rules.includes(d.rule_id) && scopeMatches(ex, d));
    if (!match) return d;
    return {
      ...d,
      severity: SEVERITY.GOVERNED_EXCEPTION,
      exception_id: match.id,
      message: `${d.message} [governed exception ${match.id}]`
    };
  });
}
