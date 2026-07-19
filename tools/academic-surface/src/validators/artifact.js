// ASV-ART-* semantic rules (single record).

import { diag, SEVERITY } from '../diagnostics.js';

const FIVE_MB = 5 * 1024 * 1024;
const WEAK_CHECKSUM = new Set(['md5', 'sha-1']);
const MIME_BY_KIND = {
  pdf: 'application/pdf',
  epub: 'application/epub+zip',
  html: 'text/html'
};

export function validateArtifact(work, ctx) {
  const out = [];
  const p = ctx.wpath;
  const slug = work.slug;

  // ASV-ART-001 — no artifact floats at Work level (also enforced structurally)
  if (Object.prototype.hasOwnProperty.call(work, 'artifacts')) {
    out.push(diag('ASV-ART-001', { path: `${p}.artifacts`, message: 'Artifact declared at Work level (must be nested under a Version)', remediation: 'Nest every artifact under versions[].artifacts[]' }));
  }

  (work.versions ?? []).forEach((v, vi) => {
    (v.artifacts ?? []).forEach((a, ai) => {
      const ap = `${p}.versions[${vi}].artifacts[${ai}]`;

      // ASV-ART-003 — path must be a safe, site-relative path (no traversal)
      if (typeof a.path === 'string' && (a.path.includes('..') || !a.path.startsWith('/'))) {
        out.push(diag('ASV-ART-003', { path: `${ap}.path`, message: `Unsafe artifact path: ${a.path}`, remediation: 'Use a safe site-relative path with no ".." traversal', evidence: a.path }));
      }

      // ASV-ART-003 — PDF co-located with its landing subdirectory
      if (a.kind === 'pdf' && slug) {
        const currentDir = `/works/${slug}/`;
        const historicalDir = `/works/${slug}/${v.vN}/`;
        const expectedDir = v.is_current ? currentDir : historicalDir;
        const inExpected = typeof a.path === 'string' && a.path.startsWith(expectedDir) && a.path.lastIndexOf('/') === expectedDir.length - 1;
        if (!inExpected) {
          out.push(diag('ASV-ART-003', { path: `${ap}.path`, message: `PDF not co-located with its landing: ${a.path}`, remediation: `Place the ${v.is_current ? 'current' : 'historical'} PDF directly under ${expectedDir}`, evidence: a.path }));
        }
      }

      // ASV-ART-004 — PDF <= 5 MB
      if (a.kind === 'pdf' && typeof a.bytes === 'number' && a.bytes > FIVE_MB) {
        out.push(diag('ASV-ART-004', { path: `${ap}.bytes`, message: `PDF exceeds 5 MB (${a.bytes} bytes)`, remediation: 'Reduce the PDF under 5 MB while keeping an extractable text layer', evidence: a.bytes }));
      }

      // ASV-ART-005 — checksum present (schema) + prefer strong algorithm; fixity match deferred (no file)
      if (WEAK_CHECKSUM.has(a.checksum_algorithm)) {
        out.push(diag('ASV-ART-005', { severity: SEVERITY.WARNING, path: `${ap}.checksum_algorithm`, message: `Weak checksum algorithm: ${a.checksum_algorithm}`, remediation: 'Prefer sha-256; fixity match against the materialized file is verified at release', evidence: a.checksum_algorithm }));
      } else {
        out.push(diag('ASV-ART-005', { severity: SEVERITY.INFO, path: `${ap}.checksum`, message: 'checksum present; fixity match against the file is verified at release (no file in Gate C)', remediation: 'Recompute and compare the checksum at materialization', evidence: a.checksum_algorithm }));
      }

      // MIME coherence with kind (part of ASV-ART-002 profile)
      if (a.mime && MIME_BY_KIND[a.kind] && a.mime !== MIME_BY_KIND[a.kind]) {
        out.push(diag('ASV-ART-002', { path: `${ap}.mime`, message: `MIME '${a.mime}' incoherent with kind '${a.kind}'`, remediation: `Use ${MIME_BY_KIND[a.kind]} for kind ${a.kind}`, evidence: a.mime }));
      }

      // ASV-ART-006 — text_extractable: conceptual; INFO this pass (Precision 3)
      if (a.kind === 'pdf') {
        if (a.text_extractable === false) {
          out.push(diag('ASV-ART-006', { severity: SEVERITY.INFO, path: `${ap}.text_extractable`, message: 'PDF declared not text-extractable (blocking at release; INFO in current pass — V-C)', remediation: 'Regenerate with a selectable text layer before release', evidence: false }));
        } else if (a.text_extractable === null || a.text_extractable === undefined) {
          out.push(diag('ASV-ART-006', { severity: SEVERITY.INFO, path: `${ap}.text_extractable`, message: 'text_extractable not yet verified (V-C); no OCR/download in Gate C', remediation: 'Verify the text layer at release', evidence: null }));
        }
      }
    });
  });

  return out;
}
