// Gate D2 — internal consistency checker for an Artifact technical manifest.
//
// This is an AUXILIARY, self-contained check. It does NOT alter the 73-rule
// Academic Surface validator (src/index.js) or its schema set. It enforces the
// SSOT-vs-manifest separation of concerns:
//   - work.json (SSOT) holds the contractual Artifact fields the validator/generator need;
//   - artifact-manifest.json holds extended technical evidence for the same file;
//   - every SHARED field MUST match exactly; divergence is a blocking error.
//
// Diagnostics use a MANIFEST-* namespace so they never collide with ASV-* rule ids.

import { SEVERITY } from './diagnostics.js';
import { isPublished } from './lib/canonical.js';

// Fields required for every artifact-manifest, regardless of kind.
const REQUIRED = [
  'manifest_kind', 'artifact_id', 'work_id', 'version_id', 'kind',
  'internal_filename', 'mime', 'bytes',
  'external_checksum', 'internal_checksum',
  'future_public_path', 'current_visibility', 'publication_status'
];

// PDF-specific technical evidence — required ONLY when kind==='pdf'. A code
// archive (software) or dataset has no page_count / pdf_version / text layer, so
// forcing these would be nonsensical; their absence is correct, not a defect.
const PDF_REQUIRED = ['page_count', 'pdf_version', 'encrypted', 'text_extractable'];

const MIME_BY_KIND = { pdf: 'application/pdf' };

function d(rule_id, severity, message, evidence) {
  return { rule_id, severity, message, evidence };
}

/**
 * @param {object} manifest parsed artifact-manifest.json
 * @param {object} work parsed work.json (the SSOT)
 * @param {{ fileBytes?: number, fileSha256?: string }} [opts] materialized file facts for fixity
 * @returns {{ ok: boolean, diagnostics: Array }}
 */
export function checkArtifactManifest(manifest, work, opts = {}) {
  const out = [];

  // MANIFEST-SCHEMA — required fields + basic types
  if (manifest.manifest_kind !== 'artifact-manifest') {
    out.push(d('MANIFEST-SCHEMA', SEVERITY.ERROR, 'manifest_kind must be "artifact-manifest"', manifest.manifest_kind));
  }
  for (const f of REQUIRED) {
    if (manifest[f] === undefined || manifest[f] === null) out.push(d('MANIFEST-SCHEMA', SEVERITY.ERROR, `Required manifest field missing: ${f}`, f));
  }
  if (manifest.kind === 'pdf') {
    for (const f of PDF_REQUIRED) {
      if (manifest[f] === undefined || manifest[f] === null) out.push(d('MANIFEST-SCHEMA', SEVERITY.ERROR, `Required PDF manifest field missing: ${f}`, f));
    }
  }
  if (manifest.internal_checksum && manifest.internal_checksum.algorithm !== 'sha-256') {
    out.push(d('MANIFEST-SCHEMA', SEVERITY.ERROR, 'internal_checksum.algorithm must be sha-256', manifest.internal_checksum?.algorithm));
  }

  // MANIFEST-MIME — coherent with kind
  if (manifest.kind && MIME_BY_KIND[manifest.kind] && manifest.mime !== MIME_BY_KIND[manifest.kind]) {
    out.push(d('MANIFEST-MIME', SEVERITY.ERROR, `mime '${manifest.mime}' incoherent with kind '${manifest.kind}'`, manifest.mime));
  }

  // MANIFEST-STATE — visibility/publication_status must stay COHERENT with the SSOT:
  // a draft/unlisted Work keeps an internal/not-published artifact; only a public +
  // published Work may carry a public/published artifact. This preserves the
  // guardrail (no artifact published ahead of its Work) while tracking the real,
  // gated publication state. Text extractability must be verified true.
  const workPublished = isPublished(work);
  const expectVisibility = workPublished ? 'public' : 'internal';
  const expectPubStatus = workPublished ? 'published' : 'not-published';
  if (manifest.current_visibility !== expectVisibility) out.push(d('MANIFEST-STATE', SEVERITY.ERROR, `current_visibility '${manifest.current_visibility}' incoherent with the Work (expected '${expectVisibility}')`, manifest.current_visibility));
  if (manifest.publication_status !== expectPubStatus) out.push(d('MANIFEST-STATE', SEVERITY.ERROR, `publication_status '${manifest.publication_status}' incoherent with the Work (expected '${expectPubStatus}')`, manifest.publication_status));
  // Text-layer expectation is a PDF property only; a code archive / dataset has
  // no selectable text layer and legitimately carries text_extractable=null.
  if (manifest.kind === 'pdf') {
    if (manifest.text_extractable === true) { /* ok */ }
    else if (manifest.text_extractable === false) out.push(d('MANIFEST-STATE', SEVERITY.ERROR, 'text_extractable is false (PDF has no selectable text layer)', false));
    else out.push(d('MANIFEST-STATE', SEVERITY.WARNING, 'text_extractable not yet verified (null/undefined)', manifest.text_extractable ?? null));
  }

  // Locate the SSOT artifact for the same version.
  const version = (work.versions ?? []).find((v) => v.id === manifest.version_id);
  const ssotArtifact = version && (version.artifacts ?? []).find((a) => a.id === manifest.artifact_id);

  // MANIFEST-LINK — manifest must point at a real Work/Version/Artifact in the SSOT
  if (manifest.work_id !== work.id) out.push(d('MANIFEST-LINK', SEVERITY.ERROR, `manifest.work_id '${manifest.work_id}' != SSOT work id '${work.id}'`, manifest.work_id));
  if (!version) out.push(d('MANIFEST-LINK', SEVERITY.ERROR, `version_id '${manifest.version_id}' not found in the SSOT`, manifest.version_id));
  else if (!ssotArtifact) out.push(d('MANIFEST-LINK', SEVERITY.ERROR, `artifact_id '${manifest.artifact_id}' not found under version '${manifest.version_id}'`, manifest.artifact_id));

  // MANIFEST-CONSISTENCY — shared fields must match the SSOT exactly
  if (ssotArtifact) {
    const shared = [
      ['mime', manifest.mime, ssotArtifact.mime],
      ['bytes', manifest.bytes, ssotArtifact.bytes],
      ['checksum', manifest.internal_checksum?.value, ssotArtifact.checksum],
      ['checksum_algorithm', manifest.internal_checksum?.algorithm, ssotArtifact.checksum_algorithm],
      ['text_extractable', manifest.text_extractable, ssotArtifact.text_extractable],
      ['future_public_path', manifest.future_public_path, ssotArtifact.path]
    ];
    for (const [name, m, s] of shared) {
      if (m !== s) out.push(d('MANIFEST-CONSISTENCY', SEVERITY.ERROR, `Shared field '${name}' diverges: manifest=${JSON.stringify(m)} vs SSOT=${JSON.stringify(s)}`, name));
    }
  }

  // MANIFEST-PATH — future path is /works/<slug>/<internal_filename>
  if (work.slug && manifest.internal_filename) {
    const expected = `/works/${work.slug}/${manifest.internal_filename}`;
    if (manifest.future_public_path !== expected) out.push(d('MANIFEST-PATH', SEVERITY.ERROR, `future_public_path '${manifest.future_public_path}' != expected '${expected}'`, manifest.future_public_path));
  }

  // MANIFEST-FIXITY — recomputed file facts (when provided) must match the manifest
  if (opts.fileBytes !== undefined && opts.fileBytes !== manifest.bytes) {
    out.push(d('MANIFEST-FIXITY', SEVERITY.ERROR, `File byte length ${opts.fileBytes} != manifest.bytes ${manifest.bytes}`, opts.fileBytes));
  }
  if (opts.fileSha256 !== undefined && opts.fileSha256 !== manifest.internal_checksum?.value) {
    out.push(d('MANIFEST-FIXITY', SEVERITY.ERROR, 'Recomputed sha-256 does not match manifest.internal_checksum.value (PDF modified?)', opts.fileSha256));
  } else if (opts.fileSha256 !== undefined) {
    out.push(d('MANIFEST-FIXITY', SEVERITY.INFO, 'Fixity confirmed: recomputed sha-256 matches the manifest', manifest.internal_checksum?.value));
  }

  const blocking = out.filter((x) => x.severity === SEVERITY.ERROR).length;
  return { ok: blocking === 0, diagnostics: out };
}
