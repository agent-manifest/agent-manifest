import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
export const FX = join(HERE, '..', 'fixtures');

// Fixed reference date so exception expiry is deterministic across runs.
export const AS_OF = '2026-07-19';

export function load(rel) {
  return JSON.parse(readFileSync(join(FX, rel), 'utf8'));
}

export function clone(obj) {
  return structuredClone(obj);
}

export function ruleIds(res) {
  return res.diagnostics.map((d) => d.rule_id);
}

export function has(res, id, severity) {
  return res.diagnostics.some((d) => d.rule_id === id && (!severity || d.severity === severity));
}

export function firstCurrent(work) {
  return work.versions.find((v) => v.is_current === true);
}
