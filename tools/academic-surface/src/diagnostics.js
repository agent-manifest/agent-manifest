// Diagnostics model and aggregation (Gate B §D).
// A diagnostic is stable and self-describing: { rule_id, severity, level, path,
// message, remediation, evidence, exception_id }.

import { ruleMeta } from './rules-catalog.js';

export const SEVERITY = Object.freeze({
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
  GOVERNED_EXCEPTION: 'GOVERNED_EXCEPTION'
});

const RANK = { ERROR: 3, WARNING: 2, INFO: 1, GOVERNED_EXCEPTION: 0 };

/**
 * Build a diagnostic. Level and default severity come from the rule catalog;
 * an explicit `severity` override is used for rules with per-field severity
 * (e.g. ASV-WORK-007 / ASV-ART-006).
 */
export function diag(ruleId, {
  path = '',
  message = '',
  remediation = '',
  evidence = undefined,
  severity = undefined
} = {}) {
  const meta = ruleMeta(ruleId);
  return {
    rule_id: ruleId,
    severity: severity ?? meta.severity,
    level: meta.level,
    path,
    message: message || meta.summary,
    remediation,
    evidence,
    exception_id: null
  };
}

/** Aggregate report: fails when >=1 ERROR is not covered by a live exception. */
export function aggregate(diagnostics) {
  const counts = { ERROR: 0, WARNING: 0, INFO: 0, GOVERNED_EXCEPTION: 0 };
  for (const d of diagnostics) counts[d.severity] = (counts[d.severity] ?? 0) + 1;
  const blockingErrors = diagnostics.filter(
    (d) => d.severity === SEVERITY.ERROR && !d.exception_id
  ).length;
  return {
    ok: blockingErrors === 0,
    blocking_errors: blockingErrors,
    counts,
    total: diagnostics.length
  };
}

/** Deterministic ordering: severity desc, then rule_id, then path. */
export function sortDiagnostics(diagnostics) {
  return [...diagnostics].sort((a, b) => {
    if (RANK[b.severity] !== RANK[a.severity]) return RANK[b.severity] - RANK[a.severity];
    if (a.rule_id !== b.rule_id) return a.rule_id < b.rule_id ? -1 : 1;
    return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
  });
}
