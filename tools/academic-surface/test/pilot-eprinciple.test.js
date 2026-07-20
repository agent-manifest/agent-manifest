// Foundational Work amw-005 (∈ Principle). Real pilot data, outside fixtures/, so
// the fictitious-fixture suites never scan it. Exercises the second work through
// the same deterministic pipeline as declaration-layers, and pins the facts that
// make it distinct AND correct:
//   - canonical type is SOFTWARE (Zenodo is authoritative for the resource type;
//     inventory item V-A is closed as software — one DOI, one Work);
//   - the Artifact is the REAL release source archive (kind=code, .zip), never a
//     PDF and never either book edition;
//   - no Google Scholar citation_* / citation_pdf_url is emitted (non-textual);
//   - the two book editions are related Works (isBasedOn), not the Artifact;
//   - the ∈ title and the ecosystem-role ("Foundational work") are preserved.
// No network, no clock.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderAll, checkDerived, toBibTeX, toHighwire, toJSONLD, toDublinCore, toOpenGraph } from '../src/derive.js';
import { toLandingHTML } from '../src/landing.js';
import { toWorksIndexHTML } from '../src/works-index.js';
import { checkConsistency } from '../src/derive-check.js';
import { checkArtifactManifest } from '../src/artifact-manifest.js';
import { validate } from '../src/index.js';
import { SEVERITY } from '../src/diagnostics.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, '..', 'content', 'pilot', 'e-principle');
const DERIVED = join(DIR, 'derived');
const work = JSON.parse(readFileSync(join(DIR, 'work.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(DIR, 'artifact-manifest.json'), 'utf8'));
const cur = work.versions.find((v) => v.is_current);
const ART = 'e-principle-v1.0.zip';

test('e-principle: SSOT validates with no blocking errors', () => {
  const res = validate(work, { asOf: '2026-07-20' });
  const blocking = res.diagnostics.filter((d) => d.severity === SEVERITY.ERROR);
  assert.equal(blocking.length, 0, JSON.stringify(blocking));
});

test('e-principle: derivation is deterministic and on-disk matches (no drift)', () => {
  const a = renderAll(work); const b = renderAll(work);
  for (const k of Object.keys(a)) assert.equal(a[k], b[k], `nondeterministic: ${k}`);
  const { ok, drift, extra } = checkDerived(work, DERIVED);
  assert.equal(ok, true, `drift=${drift} extra=${extra}`);
});

test('e-principle: cross-format consistency holds', () => {
  const { ok, problems } = checkConsistency(work, DERIVED);
  assert.equal(ok, true, JSON.stringify(problems));
});

test('e-principle: identity — ∈ title, software type, SoftwareSourceCode, DOIs', () => {
  assert.equal(work.title, '∈ Principle');
  assert.equal(work.slug, 'e-principle');
  assert.equal(work.type, 'software');
  const ld = toJSONLD(work);
  assert.equal(ld['@type'], 'SoftwareSourceCode');
  assert.equal(ld.codeRepository, 'https://github.com/agent-manifest/e-principle');
  // preferred citation = ∈ Principle version DOI; concept DOI distinct
  assert.equal(cur.doi_version, '10.5281/zenodo.18965669');
  assert.equal(work.doi_concept, '10.5281/zenodo.18965668');
});

test('e-principle: NON-textual — no Scholar citation_* and no citation_pdf_url anywhere', () => {
  const hw = toHighwire(work);
  assert.equal(hw.status, 'not-emitted');
  assert.deepEqual(hw.tags, {});
  const html = toLandingHTML(work);
  assert.doesNotMatch(html, /citation_/); // no Highwire meta at all
  assert.doesNotMatch(html, /citation_pdf_url/);
  // Dublin Core + Open Graph reflect software, not an article
  assert.equal(toDublinCore(work).type, 'Software');
  assert.equal(toOpenGraph(work)['og:type'], 'website');
});

test('e-principle: the served Artifact is the release source archive (code), never a book PDF', () => {
  const art = cur.artifacts[0];
  assert.equal(art.kind, 'code');
  assert.equal(art.mime, 'application/zip');
  assert.equal(art.path, '/works/e-principle/e-principle-v1.0.zip');
  const ld = toJSONLD(work);
  assert.equal(ld.encoding.contentUrl, 'https://agent-manifest-spec.org/works/e-principle/e-principle-v1.0.zip');
  assert.equal(ld.encoding.encodingFormat, 'application/zip');
  const html = toLandingHTML(work);
  assert.match(html, /<a href="e-principle-v1\.0\.zip">Source archive \(ZIP\)<\/a>/);
  // no book PDF / book edition ever appears on the served surface
  assert.doesNotMatch(html, /e-principle\.pdf/);
  assert.doesNotMatch(html, /Destination of Actions/);
  assert.doesNotMatch(html, /destino de las acciones/i);
});

test('e-principle: isBasedOn carries both book editions as RELATIONS (not the artifact)', () => {
  const ld = toJSONLD(work);
  const based = ld.isBasedOn;
  assert.ok(Array.isArray(based) && based.length === 2, 'expected two isBasedOn nodes');
  const ids = based.map((b) => b.identifier).sort();
  assert.deepEqual(ids, ['10.5281/zenodo.18945860', '10.5281/zenodo.18945953']);
  const dc = toDublinCore(work);
  assert.equal(dc.relation.length, 2);
  const html = toLandingHTML(work);
  assert.match(html, /This software <em>is based on<\/em>[\s\S]*18945860/);
  assert.match(html, /18945953/);
});

test('e-principle: landing renders software type, role section, source repository', () => {
  const html = toLandingHTML(work);
  assert.match(html, /<div class="badge">Software<\/div>/);
  assert.match(html, /<dt>Type<\/dt><dd>Software<\/dd>/);
  assert.match(html, /Role in the ecosystem/);
  assert.match(html, /Source repository: <a href="https:\/\/github\.com\/agent-manifest\/e-principle">/);
  // canonical landing carries no permanent noindex
  assert.doesNotMatch(html, /noindex/);
});

test('e-principle: BibTeX is a generic entry labelled Software (not essay/working paper)', () => {
  const bib = toBibTeX(work);
  assert.match(bib, /@misc\{amw-005,/);
  assert.match(bib, /note = \{Software\./);
  assert.doesNotMatch(bib, /Working paper/);
  assert.doesNotMatch(bib, /Essay/);
});

test('e-principle: artifact manifest is consistent and fixity matches the served source archive', () => {
  const bytes = readFileSync(join(DIR, ART));
  const sha = createHash('sha256').update(bytes).digest('hex');
  const res = checkArtifactManifest(manifest, work, { fileBytes: bytes.length, fileSha256: sha });
  const blocking = res.diagnostics.filter((d) => d.severity === SEVERITY.ERROR);
  assert.equal(blocking.length, 0, JSON.stringify(blocking));
  // SSOT and manifest agree on the authoritative sha-256; kind is code (no PDF)
  assert.equal(manifest.kind, 'code');
  assert.equal(cur.artifacts[0].checksum, sha);
  assert.equal(manifest.internal_checksum.value, sha);
  // origin fixity cross-check preserved (Zenodo MD5)
  assert.equal(manifest.external_checksum.value, '2f6242efc16d6782033179b8b2e9b24c');
});

test('e-principle: resource type follows Zenodo (software); a differing classification is observation-only', () => {
  // canonical type is single and software
  assert.equal(work.type, 'software');
  assert.ok(!Array.isArray(work.type), 'type must be a single value');
  // no Scholar block at all (ASV-WORK-014 forbids article Scholar tags on software)
  assert.equal(work.scholar, undefined);
  // the differing external classification is recorded observationally, never as a second type
  const td = work.provenance?.type_discrepancies ?? [];
  assert.ok(td.length >= 1 && td.every((t) => typeof t.value === 'string'), 'expected observational type_discrepancies');
});

test('works index: ∈ Principle is listed as a Foundational work / Software; DL stays a Working paper', () => {
  const dl = JSON.parse(readFileSync(join(HERE, '..', 'content', 'pilot', 'declaration-layers', 'work.json'), 'utf8'));
  const html = toWorksIndexHTML([dl, work]);
  // e-principle: role eyebrow + software type
  assert.match(html, /<p class="eyebrow">Foundational work<\/p>\s*<h2><a href="\/works\/e-principle\/">∈ Principle<\/a><\/h2>/);
  assert.match(html, /∈ Principle<\/a><\/h2>\s*<p class="by">Hernán Alfredo Capucci · Software ·/);
  // declaration-layers: no eyebrow, still a working paper
  assert.match(html, /Declaration Layers[\s\S]*?· Working paper ·/);
});
