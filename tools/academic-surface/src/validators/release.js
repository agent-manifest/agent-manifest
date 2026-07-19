// ASV-RLS-* atomic-release rules over a declarative release-operation input.
// No real publication happens; this validates the release ritual's invariants.

import { diag } from '../diagnostics.js';

export function validateRelease(op) {
  const out = [];
  const p = 'release';
  const o = op.outgoing ?? {};

  // ASV-RLS-004 — safe abort on injected failure (checked first: it dominates)
  if (op.failure_injected === true) {
    out.push(diag('ASV-RLS-004', { path: `${p}`, message: 'Freeze/validate failure injected: release MUST abort and preserve the previous public version', remediation: 'Abort the release; keep the prior current version intact; publish no intermediate state' }));
  }

  // ASV-RLS-001 — outgoing frozen + validated at /vN before publish
  if (o.frozen !== true || o.validated !== true) {
    out.push(diag('ASV-RLS-001', { path: `${p}.outgoing`, message: 'Outgoing version not frozen+validated at /vN before publishing the new version', remediation: 'Materialize and validate the outgoing version at /works/<slug>/vN first', evidence: { frozen: o.frozen, validated: o.validated } }));
  }

  // ASV-RLS-002 — /vN verifies content, checksum, DOI, canonical
  const missing = [];
  if (!o.doi_version) missing.push('doi_version');
  if (o.checksum_verified !== true) missing.push('checksum_verified');
  if (o.self_canonical !== true) missing.push('self_canonical');
  if (missing.length) {
    out.push(diag('ASV-RLS-002', { path: `${p}.outgoing`, message: `Frozen /vN not fully verified (missing: ${missing.join(', ')})`, remediation: 'Verify content, checksum, doi_version and self-canonical before freezing', evidence: missing }));
  }

  // ASV-RLS-003 — atomic swap only after a successful freeze
  if (op.atomic_swap !== true) {
    out.push(diag('ASV-RLS-003', { path: `${p}.atomic_swap`, message: 'Replacement of the current version is not atomic', remediation: 'Swap atomically, with no intermediate published state' }));
  } else if (o.frozen !== true) {
    out.push(diag('ASV-RLS-003', { path: `${p}.atomic_swap`, message: 'Atomic swap attempted before the outgoing version was frozen', remediation: 'Freeze/validate the outgoing /vN before swapping the current' }));
  }

  return out;
}
