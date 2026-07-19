// Optional remote verification interface (ASV-WEB-011; Precisions 1 & 2).
//
// CONTRACT: the build NEVER depends on this. Remote checks are separable,
// cacheable and non-destructive. Offline is the default. In Gate C nothing here
// performs real network I/O — the interface exists so a later implementer can
// wire caching/resolution without changing the validator's severity semantics.
//
// A remote failure by external cause classifies as WARNING and MUST NOT abort a
// build; a syntactically malformed DOI is a separate LOCAL ERROR (see doi.js).

/**
 * Classify the result of an (optional) online DOI resolution attempt without
 * ever aborting. Pure/deterministic: it maps a resolution outcome to a severity
 * decision. No network call happens here in Gate C.
 *
 * @param {{mode?: 'offline'|'online', resolved?: boolean, cached?: boolean, externalError?: boolean}} opts
 * @returns {{ checked: boolean, severity: 'INFO'|'WARNING', reason: string, aborts: false }}
 */
export function classifyDoiResolution(opts = {}) {
  const mode = opts.mode ?? 'offline';
  if (mode === 'offline') {
    return { checked: false, severity: 'INFO', reason: 'offline: online DOI resolution skipped by default', aborts: false };
  }
  if (opts.resolved === true) {
    return { checked: true, severity: 'INFO', reason: opts.cached ? 'resolved (cached)' : 'resolved', aborts: false };
  }
  // Not resolved: an external failure is a WARNING, never a hard error.
  return {
    checked: true,
    severity: 'WARNING',
    reason: opts.externalError ? 'external cause (registry unreachable); build not aborted' : 'did not resolve; build not aborted',
    aborts: false
  };
}

/**
 * Placeholder for a future cached online resolver. In Gate C it refuses to touch
 * the network and returns an offline verdict, keeping the build deterministic.
 */
export async function resolveDoiOnline(_doi, opts = {}) {
  if (opts.allowNetwork !== true) {
    return classifyDoiResolution({ mode: 'offline' });
  }
  // Intentionally not implemented in Gate C: no network I/O in this gate.
  throw new Error('resolveDoiOnline: network resolution is out of scope for Gate C (offline-only).');
}
