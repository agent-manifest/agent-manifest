# Gate C — Implementation notes

This document maps the Gate B specification to the code, records low-level
decisions (C1), and states what is deferred. It makes no conformance or
certification claims.

## C1 — Implementation decisions

| Decision | Choice | Rationale |
|---|---|---|
| Language / runtime | JavaScript ESM, Node ≥ 20 | Matches the authorized stack; no TypeScript/bundler |
| JSON Schema | AJV 8, Draft 2020-12, `ajv-formats` | Authorized stack; minimal dependency surface (6 packages total) |
| Structure | `schema/` `src/` `bin/` `fixtures/` `test/` `docs/` | Composable schemas, one validator module per level |
| Fixtures | JSON, `test_fixture: true`, `example.org`, `10.5555/...` test DOIs | Fictitious; never real Works/DOIs |
| Diagnostics | `{ rule_id, severity, level, path, message, remediation, evidence, exception_id }` | Stable, machine-readable |
| CLI | `academic-surface validate <file-or-dir> [--json] [--as-of=]` | Local; no global install; not published |
| Tests | `node:test` | Zero extra dependency |
| Remote checks | offline default; optional non-blocking interface | Precisions 1 & 2 (build never depends on Zenodo/ORCID/DataCite) |
| Determinism | `--as-of` reference date for exception expiry | No hidden clock dependence in tests |

## Schemas (composable)

`license` · `author` · `contribution` · `provenance` · `relation` ·
`external-url` · `repository` · `artifact` · `version` · `exception-record` ·
`work-record` (root single Work) · `corpus` (root) · `release-operation` (root).

Frozen invariants encoded in the schema: `status` Work-level only
(`draft|published|withdrawn`); `doi_version` only in Version; artifacts only in
Version; relation vocabulary limited to DataCite + `ams:implements`/`isImplementedBy`
(no `relatedWork`, no `ams:supersedes`); language BCP-47 (never `enc`).

## Rule → implementation status (73 rules)

**Fully executable on the record (ERROR/WARNING as specified):**
`ASV-WORK-001..014`, `ASV-VER-001..006`, `ASV-ART-001..004`, `ASV-REL-001..007`,
`ASV-CORP-001..004`, `ASV-EXP-001..003`, `ASV-WEB-001..004,006..011,020..022`,
`ASV-SCH-001..006`, `ASV-RLS-001..004`, `ASV-WD-001..004`, `ASV-PROV-001..005`.

**Conceptual / deferred in this pass (emitted as INFO or verified at release), per Gate B precisions:**

| Rule | Status | Reason |
|---|---|---|
| `ASV-ART-005` | INFO (checksum present; strong-algo WARNING) | Fixity match against a materialized file happens at release (no file in Gate C) |
| `ASV-ART-006` | INFO | `text_extractable` conceptual; no OCR/download (Precision 3; V-C) |
| `ASV-SCH-005` | ERROR only on declared `pdf_title` mismatch | Full PDF parse deferred to release (Precision 3) |
| `ASV-WEB-005` | deferred | No faceted-view surface exists in Gate C |
| `ASV-WEB-011` | INFO (offline) / WARNING classifier | Online resolution is separable, cacheable, non-blocking (Precisions 1 & 2) |

Structurally enforced (schema) as well as semantically flagged: work-level
`artifacts` (`ASV-ART-001`), dual `type` (`ASV-WORK-005`), `relatedWork` /
`ams:supersedes` (`ASV-REL-001/006`), missing required fields.

## Known heuristic limitations (non-blocking)

- `ASV-WORK-002` flags a slug that encodes **its own** `type`/`status` token (plus
  year/version). It does not flag unrelated topical words that merely coincide with
  a type name, to avoid false positives. Broader slug-history/stability checks
  require a published-slug registry (future).
- `ASV-VER-006` (changelog append-only) is a proxy (no-duplicate/no-empty) because
  no prior SSOT snapshot is available in a single pass.

## Governed exceptions (§R)

`schema/exception-record.schema.json` requires `id`, `rules`, `justification`,
`scope`, `expires`, `evidence`. The engine (`src/exceptions.js`):

- downgrades a matching `ERROR`/`WARNING` within the declared scope to
  `GOVERNED_EXCEPTION` (non-blocking) and stamps the `exception_id`;
- treats a **global** (empty-scope) or **expiry-less** exception as **inert**;
- reactivates the original severity once an exception is **expired**
  (`--as-of` controls the reference date).

## Isolation

The module is internal tooling and must never reach the published site:

- `_config.yml` excludes `tools` from the Jekyll build (minimal change).
- `npm run isolation-check` / `test/isolation.test.js` fail if `tools` is not
  excluded, if a built `_site/tools` exists, if `sitemap.xml`/`robots.txt`
  reference `/tools/`, or if any module `.md`/`.html` carries Jekyll front matter.
- No links from the public site/nav/docs/home; no module-specific deploy config.

## Test coverage

`npm test` runs: the 38 conceptual tests (T-01..T-38, each linking its protected
`rule_id`), targeted regressions, catalog integrity (73 rules; every emitted id is
known), isolation, and fixtures-hygiene (no real DOIs; `test_fixture: true`).
