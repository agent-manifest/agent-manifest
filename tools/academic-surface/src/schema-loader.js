// AJV 8 (draft 2020-12) loader. Adds every composable schema and exposes the
// three root validators (work-record, corpus, release-operation).

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(HERE, '..', 'schema');

const BASE = 'https://agent-manifest-spec.org/schema/academic-surface/';
export const ROOT_IDS = Object.freeze({
  work: `${BASE}work-record.schema.json`,
  corpus: `${BASE}corpus.schema.json`,
  release: `${BASE}release-operation.schema.json`
});

let cached = null;

export function buildAjv() {
  if (cached) return cached;
  const ajv = new Ajv2020({ allErrors: true, strict: false, allowUnionTypes: true });
  addFormats(ajv);
  for (const file of readdirSync(SCHEMA_DIR)) {
    if (!file.endsWith('.schema.json')) continue;
    const schema = JSON.parse(readFileSync(join(SCHEMA_DIR, file), 'utf8'));
    ajv.addSchema(schema);
  }
  cached = ajv;
  return ajv;
}

/** Detect which root a parsed input targets. */
export function detectKind(input) {
  if (input && typeof input === 'object') {
    if (input.record_kind === 'corpus') return 'corpus';
    if (input.record_kind === 'release') return 'release';
    if (Array.isArray(input.works)) return 'corpus';
  }
  return 'work';
}

/**
 * Structural validation against the appropriate root schema.
 * @returns {{ kind: string, valid: boolean, errors: object[] }}
 */
export function validateStructural(input) {
  const ajv = buildAjv();
  const kind = detectKind(input);
  const validate = ajv.getSchema(ROOT_IDS[kind]);
  const valid = validate(input);
  return { kind, valid: !!valid, errors: valid ? [] : (validate.errors ?? []) };
}
