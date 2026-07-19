#!/usr/bin/env node
// CLI: academic-surface validate <file-or-directory> [--json] [--as-of=YYYY-MM-DD]
// Local, offline, no global install, not published.

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { validate } from '../src/index.js';

function usage() {
  console.error('Usage: academic-surface validate <file-or-directory> [--json] [--as-of=YYYY-MM-DD]');
  process.exit(2);
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd !== 'validate') usage();

const asJson = rest.includes('--json');
const asOfArg = rest.find((a) => a.startsWith('--as-of='));
const asOf = asOfArg ? asOfArg.split('=')[1] : undefined;
const target = rest.find((a) => !a.startsWith('--'));
if (!target) usage();
if (!existsSync(target)) { console.error(`Not found: ${target}`); process.exit(2); }

const files = statSync(target).isDirectory()
  ? readdirSync(target).filter((f) => f.endsWith('.json')).map((f) => join(target, f)).sort()
  : [target];

const results = [];
let anyBlocking = false;

for (const file of files) {
  let input;
  try { input = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { console.error(`Cannot parse ${file}: ${e.message}`); anyBlocking = true; continue; }
  const res = validate(input, { asOf });
  results.push({ file, ...res });
  if (!res.report.ok) anyBlocking = true;
}

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    const c = r.report.counts;
    const status = r.report.ok ? 'PASS' : 'FAIL';
    console.log(`\n${status}  ${r.file}  [kind=${r.kind}]`);
    console.log(`  errors=${c.ERROR} warnings=${c.WARNING} info=${c.INFO} governed=${c.GOVERNED_EXCEPTION} (blocking=${r.report.blocking_errors})`);
    for (const d of r.diagnostics) {
      if (d.severity === 'INFO') continue; // keep the human report focused; INFO is in --json
      const ex = d.exception_id ? ` {${d.exception_id}}` : '';
      console.log(`  [${d.severity}] ${d.rule_id} @ ${d.path}${ex}\n      ${d.message}\n      → ${d.remediation}`);
    }
  }
  console.log(`\n${anyBlocking ? 'RESULT: FAIL (blocking errors present)' : 'RESULT: PASS (no blocking errors)'}`);
}

process.exit(anyBlocking ? 1 : 0);
