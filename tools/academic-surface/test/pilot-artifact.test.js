// Gate D2 — tests for the REAL pilot Artifact (amw-014) and its technical manifest.
//
// These tests use the real pilot data ONLY (never other real Works) and live
// OUTSIDE fixtures/, so the fictitious-fixture hygiene/coverage suites never scan
// them. They exercise the auxiliary manifest checker, not the ASV catalog.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { checkArtifactManifest } from '../src/artifact-manifest.js';
import { SEVERITY } from '../src/diagnostics.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, '..', 'content', 'pilot', 'declaration-layers');
const PDF = join(DIR, 'declaration-layers.pdf');

const work = JSON.parse(readFileSync(join(DIR, 'work.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(DIR, 'artifact-manifest.json'), 'utf8'));

const clone = (o) => structuredClone(o);
const fileBytes = statSync(PDF).size;
const fileSha256 = createHash('sha256').update(readFileSync(PDF)).digest('hex');
const errorsOf = (r) => r.diagnostics.filter((x) => x.severity === SEVERITY.ERROR);
const hasRule = (r, id) => r.diagnostics.some((x) => x.rule_id === id && x.severity === SEVERITY.ERROR);

// 1) real manifest is valid and consistent, fixity confirmed
test('D2: real pilot manifest is valid, consistent with SSOT, fixity confirmed', () => {
  const r = checkArtifactManifest(manifest, work, { fileBytes, fileSha256 });
  assert.equal(r.ok, true, JSON.stringify(errorsOf(r)));
  assert.ok(r.diagnostics.some((x) => x.rule_id === 'MANIFEST-FIXITY' && x.severity === SEVERITY.INFO));
});

// 2) checksum divergence SSOT <-> manifest
test('D2: checksum divergence SSOT<->manifest is blocking (MANIFEST-CONSISTENCY)', () => {
  const m = clone(manifest); m.internal_checksum.value = '0'.repeat(64);
  assert.ok(hasRule(checkArtifactManifest(m, work), 'MANIFEST-CONSISTENCY'));
});

// 3) bytes divergence
test('D2: bytes divergence is blocking (MANIFEST-CONSISTENCY)', () => {
  const m = clone(manifest); m.bytes = manifest.bytes + 1;
  assert.ok(hasRule(checkArtifactManifest(m, work), 'MANIFEST-CONSISTENCY'));
});

// 4) future public path incorrect
test('D2: wrong future_public_path is blocking (MANIFEST-PATH)', () => {
  const m = clone(manifest); m.future_public_path = '/works/declaration-layers/v1/declaration-layers.pdf';
  assert.ok(hasRule(checkArtifactManifest(m, work), 'MANIFEST-PATH'));
});

// 5) Manifest state incoherent with the Work is blocking (both directions):
// an artifact must not be published ahead of a draft Work, nor left internal once
// its Work is public + published.
test('D2: manifest state incoherent with the Work is blocking (MANIFEST-STATE)', () => {
  const draftWork = clone(work); draftWork.visibility = 'draft'; draftWork.status = 'draft';
  // published manifest against a draft Work -> blocking
  assert.ok(hasRule(checkArtifactManifest(clone(manifest), draftWork), 'MANIFEST-STATE'));
  // internal manifest against the published Work -> blocking
  const internalM = clone(manifest); internalM.current_visibility = 'internal'; internalM.publication_status = 'not-published';
  assert.ok(hasRule(checkArtifactManifest(internalM, work), 'MANIFEST-STATE'));
});

// 6) PDF modified with respect to the recorded checksum
test('D2: recomputed sha-256 mismatch is blocking (MANIFEST-FIXITY)', () => {
  const r = checkArtifactManifest(manifest, work, { fileBytes, fileSha256: 'deadbeef' });
  assert.ok(hasRule(r, 'MANIFEST-FIXITY'));
});

// 7) text_extractable not verified
test('D2: unverified text_extractable is flagged (MANIFEST-STATE warning)', () => {
  const m = clone(manifest); m.text_extractable = null;
  const r = checkArtifactManifest(m, work);
  assert.ok(r.diagnostics.some((x) => x.rule_id === 'MANIFEST-STATE' && x.severity === SEVERITY.WARNING));
});

// 8) MIME incoherent with kind
test('D2: incoherent MIME is blocking (MANIFEST-MIME)', () => {
  const m = clone(manifest); m.mime = 'application/octet-stream';
  assert.ok(hasRule(checkArtifactManifest(m, work), 'MANIFEST-MIME'));
});

// 9) manifest associated with the wrong Work/Version
test('D2: wrong work_id/version_id is blocking (MANIFEST-LINK)', () => {
  const m1 = clone(manifest); m1.work_id = 'amw-999';
  assert.ok(hasRule(checkArtifactManifest(m1, work), 'MANIFEST-LINK'));
  const m2 = clone(manifest); m2.version_id = 'amw-014-v9';
  assert.ok(hasRule(checkArtifactManifest(m2, work), 'MANIFEST-LINK'));
});

// 10) The manifest source stays under tools/; its state stays COHERENT with the
// Work. Now that the Work is public+published, the manifest is public/published and
// the PDF is materialized (byte-identical) under the separate public /works tree.
test('D2: Artifact manifest source stays internal; state is coherent with the published Work', () => {
  assert.ok(DIR.includes(join('tools', 'academic-surface', 'content')), 'pilot source must live under the excluded module');
  const workPublished = work.visibility === 'public' && work.status === 'published';
  assert.equal(manifest.current_visibility, workPublished ? 'public' : 'internal');
  assert.equal(manifest.publication_status, workPublished ? 'published' : 'not-published');
  // Coherence is enforced by the checker (no MANIFEST-STATE error).
  const { diagnostics } = checkArtifactManifest(manifest, work);
  assert.equal(diagnostics.filter((d) => d.rule_id === 'MANIFEST-STATE' && d.severity === SEVERITY.ERROR).length, 0);
});

// D2.6 — reproducible text-extractability check (native, no OCR). Skipped if
// pdftotext is not installed: it is a documented prerequisite, never a build dep.
let hasPdftotext = true;
try { execFileSync('pdftotext', ['-v'], { stdio: 'ignore' }); } catch { hasPdftotext = false; }

test('D2: PDF has a native selectable text layer (no OCR)', { skip: hasPdftotext ? false : 'pdftotext not installed (documented prerequisite)' }, () => {
  const text = execFileSync('pdftotext', [PDF, '-'], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.ok(text.length > 5000, `extracted text unexpectedly short: ${text.length}`);
  assert.ok(text.includes('Declaration Layers'), 'expected visible title in extracted text');
});
