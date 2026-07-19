# Academic Surface Validator (Gate C)

Internal repository tooling. Local, offline, structural + semantic validator for the
**Academic Surface Work Record** contract (Gate A) and validation specification
(Gate B). It **validates against the Academic Surface draft contract**; it does
**not** authenticate, certify, or guarantee correctness, and it is **not** a public
surface, is **not** published to npm, and has **no** global install.

> Relationship to the frozen architecture: this module implements the data contract
> of `Documento Maestro - Academic Surface v2.1` (`FROZEN — ARCHITECTURAL BASELINE`),
> the architectural freeze acta (invariant SSOT, atomic release, withdrawn), the
> Gate A closure (inventory + §6), and the Gate B validator specification (73
> `ASV-*` rules). It takes no new architectural decisions.

## Requirements

- Node.js ≥ 20 (developed on Node 25), ESM.
- Dependencies: `ajv` 8 + `ajv-formats` only (JSON Schema Draft 2020-12).

## Install (local only)

```
npm install
```

## Run

```
npm test                                  # structural + semantic + isolation tests
npm run validate -- fixtures/valid/minimal-work.json
npm run validate -- fixtures/valid            # a directory of records
npm run validate -- <file> --json             # machine-readable diagnostics (includes INFO)
npm run validate -- <file> --as-of=2026-07-19 # reference date for exception expiry (deterministic)
npm run isolation-check                        # fails if the module could leak into the site
```

Exit code is `1` when any **blocking** error is present, else `0`.

## Inputs

Three root shapes (auto-detected; JSON Schema in `schema/`):

- **Work record** — a single Work (`work-record.schema.json`).
- **Corpus** — `{ "record_kind": "corpus", "works": [...], "governed_exceptions": [...] }`.
- **Release operation** — `{ "record_kind": "release", ... }` models the atomic
  release ritual for `ASV-RLS-*` (no real publication happens).

The record is the SSOT: content fields (Gate A §6) plus **declared surface
directives** (`web`/`scholar`/`exports`) that the future generator will
materialize. The validator checks the whole record for invariant compliance
**before** any rendering.

## Severities

`ERROR` (blocking) · `WARNING` (non-blocking) · `INFO` · `GOVERNED_EXCEPTION`
(a governed, non-silent, time-boxed waiver — see Gate B §R). A run **fails** when
≥ 1 `ERROR` is not covered by a live governed exception.

## Diagnostics

Every finding is stable and self-describing:

```
{ rule_id, severity, level, path, message, remediation, evidence, exception_id }
```

## Human authorship

Human authorship is enforced by an **explicit `is_human` / `agent_type`
attestation** and by **role separation** in `provenance` (intellectual author /
record creator / build activity) — never by name matching, so a human name is
never rejected by accident. A tool may appear only under `provenance.build_activity`,
never as author/contributor/maintainer/steward.

## Exceptions policy

Governed exceptions are never silent, never global, and always expire. An expired
or malformed exception is inert and the original severity reactivates. See
`schema/exception-record.schema.json` and `docs/GATE-C.md`.

## What this does NOT validate (yet)

- No OCR / PDF download; `text_extractable` and metadata↔PDF are conceptual here
  and verified at release (Precision 3; V-C).
- No network: online DOI/ORCID/URL resolution is a separate, cacheable,
  non-blocking interface (`src/lib/remote.js`); it performs no I/O in Gate C.
- No faceted-view surface exists in Gate C, so `ASV-WEB-005` is deferred.
- Fixity match against a materialized file (`ASV-ART-005`) is verified at release.

See `docs/GATE-C.md` for the full mapping of rules → implementation status.
