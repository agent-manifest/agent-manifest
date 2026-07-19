// ASV-WD-* retraction rules (single record; applies when status=withdrawn).

import { diag } from '../diagnostics.js';

export function validateWithdrawn(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  if (work.status !== 'withdrawn') return out;
  const wd = work.withdrawal ?? {};

  // ASV-WD-002 — public self-canonical tombstone, not 404
  if (wd.tombstone !== true) out.push(diag('ASV-WD-002', { path: `${p}.withdrawal.tombstone`, message: 'Withdrawn Work without a public tombstone', remediation: 'Serve a public, self-canonical tombstone; never 404' }));
  if (wd.http_status === 404) out.push(diag('ASV-WD-002', { path: `${p}.withdrawal.http_status`, message: 'Withdrawn Work returns 404', remediation: 'Return 200 with a tombstone; never remove or 404', evidence: wd.http_status }));

  // ASV-WD-003 — no automatic unlisted/noindex from withdrawal
  if (wd.noindex === true) out.push(diag('ASV-WD-003', { path: `${p}.withdrawal.noindex`, message: 'Withdrawal applied noindex automatically', remediation: 'Keep indexation; exceptional de-indexing needs a governed exception' }));
  if (wd.unlisted === true) out.push(diag('ASV-WD-003', { path: `${p}.withdrawal.unlisted`, message: 'Withdrawal applied unlisted automatically', remediation: 'Do not auto-unlist; use a governed exception if truly needed' }));

  // ASV-WD-004 — out of active indexes/feeds; kept in historical sitemap
  if (wd.in_historical_sitemap === false) out.push(diag('ASV-WD-004', { path: `${p}.withdrawal.in_historical_sitemap`, message: 'Withdrawn Work absent from the historical sitemap', remediation: 'Preserve it in the historical sitemap' }));
  if (wd.removed_from_active_indexes === false) out.push(diag('ASV-WD-004', { path: `${p}.withdrawal.removed_from_active_indexes`, message: 'Withdrawn Work still in active indexes/feeds', remediation: 'Remove it from active editorial indexes and novelty feeds' }));

  return out;
}
