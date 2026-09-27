---
title: Errata and readers' notes (v1.0)
description: Every change made to the v1.0 specification files after the v1.0 release, and notes on how to read the frozen text where it is ambiguous or defective. Nothing here changes a requirement.
section: Governance
---

# Errata and readers' notes — Agent Manifest v1.0

The v1.0 specification is frozen. This register exists so that "frozen" can be
checked rather than taken on trust. It records two things:

- **Errata** — changes that were made to files under `spec/v1.0/` after the
  `v1.0` tag, with the commit, what changed and whether any conformance outcome
  changed.
- **Readers' notes** — places where the frozen text is ambiguous, internally
  inconsistent or hard to implement. Nothing is changed; the note says how the
  text reads today and what an implementer should know. Changing what is
  required is input to a future version, not an erratum.

Nothing in this document is normative. It adds no requirement and removes none.

## Which text is the version of record

- The specification deposited on Zenodo under DOI
  [10.5281/zenodo.18833956](https://doi.org/10.5281/zenodo.18833956) is the
  archived, citable version.
- `spec/v1.0/agent_manifest_v1.0.html` is the canonical rendering on the site.
  It has been corrected after the deposit (entries below). Where a correction
  restores the deposited text, the deposit is the reference the correction was
  checked against (E-1.0-004).
- The git tags `v1.0` and `v1.0.0` record the repository as it stood at release.
  They are history, not a competing text.
- `spec/v1.0/spec.md` is an abridged rendering and is not the reference text.
  `spec/v1.0/schema.json` is authoritative for field types, enumerations and
  formats (§ 13.1).

What the deposit contains has not been re-compared byte for byte with the current
HTML as part of this register. Where an entry depends on it, it says so.

## How the register is kept

1. A change to any file under `spec/v1.0/` lands in the same pull request as an
   entry in this file. A pull request that changes `spec/v1.0/` without changing
   `ERRATA.md` fails CI (`.github/workflows/errata-guard.yml`).
2. Each entry states the commit, the files, what changed, its class, and whether
   any document's result against the schema or the prose changes.
3. Classes: **rendering** (markup, styling, metadata; no text a reader relies on
   changes), **editorial** (wording or examples; no requirement changes),
   **transcription** (a normative annex restored to the text it was transcribed
   from), **normative** (a requirement changes — not permitted in v1.0; goes to a
   new version).
4. A defect found in the frozen text that is not corrected is recorded as a
   readers' note, not fixed silently.

## Errata

| ID | Date | Commit | Files | Class | Changes a conformance outcome? |
|---|---|---|---|---|---|
| E-1.0-001 | 2026-05-18 | `de3579a` | canonical HTML `<head>` | rendering | No |
| E-1.0-002 | 2026-05-18 | `3a06a9e` | canonical HTML `<style>` | rendering | No |
| E-1.0-003 | 2026-07-20 | `a138e9f`, `f077d7b`, `11c6ee5` | canonical HTML | rendering / editorial | No (see note) |
| E-1.0-004 | 2026-08-15 | `1c394f5` | canonical HTML Annex A; `spec.md`; `index.md` | transcription | Yes, for Annex A only (see below) |
| E-1.0-005 | 2026-06-26 → 2026-08-15 | `02e16a6`, `a695f0b`, `835a108`, `1c394f5` | `spec/v1.0/index.md`, `spec/v1.0/spec.md` | editorial | No |

**E-1.0-001.** SEO metadata and social-preview assets added to the `<head>` of the
canonical HTML. Body unchanged.

**E-1.0-002.** Four stray Markdown fence lines removed from `<style>` blocks. No
visible text changed.

**E-1.0-003.** Representation repair and site convergence: 36 literal Markdown
fences that rendered as visible text were removed; the § 5.1 diagram was made one
block; the Annex A and Annex B JSON blocks were made parseable (typographic quote
delimiters replaced with ASCII quotes, one regex backslash escaped); the shared
stylesheet and footer were adopted, and the footer wording was restored
(`11c6ee5`). The commits state that no MUST, SHOULD or MAY and no example value
changed. Note: before this change the Annex blocks were not valid JSON, so a
reader extracting them mechanically obtained nothing; that was a rendering defect,
not a change of requirement.

**E-1.0-004.** Annex A carried the patterns `^[a-zA-Z0-9.*-]+$` (`agent_id`) and
`^[a-z0-9.*-]+$` (`purpose.primary_code`). Every `schema.json` in the repository's
history, and the deposited specification, carry `._-`. The asterisk form existed
only in the HTML transcription. It was restored to `._-`, with a test that pins
Annex A's patterns to `schema.json`. Outcome: under the erroneous Annex, identifiers
containing `_` were rejected and identifiers containing `*` accepted; 6 of the 11
repository examples were rejected by the erroneous Annex and accepted by the
schema. After the correction Annex A and `schema.json` agree on these two
patterns. The same commit stopped claiming that `spec.md` carries requirements
identical to the canonical text.

**E-1.0-005.** The non-canonical landing page `spec/v1.0/index.md` and the abridged
rendering `spec/v1.0/spec.md` were reworded to state that the HTML is canonical and
that `spec.md` is abridged.

## Readers' notes

**RN-1.0-001 — Annex B's example e-mail is not an e-mail address.** Annex B
("Conformant Example") carries `"email": "[email protected]"`. This is the
placeholder an e-mail-obfuscation service substitutes for an address; it was
captured into the file and has been present since the file's first commit. It fails `format: email`
in the project's validator (Ajv with ajv-formats) and in python-jsonschema with a
format checker, so the example as rendered is not schema-valid. The original
address is not recoverable from the repository. Read the example with any valid
address in its place.

**RN-1.0-002 — "Open Specification — Standards Track" and "Status of This Memo".**
These labels describe the document's intended character. No standards body has
adopted, reviewed or published the specification. Read them as the author's
designation, not as the status conferred by an IETF, W3C or other process.

**RN-1.0-003 — Annex A and `schema.json` differ in nine keywords.** Recorded in
[STABILITY.md](./STABILITY.md#known-limits-of-v10). `schema.json` is stricter in
every case. § 13 asks implementations to validate against Annex A; the project's
tools validate against `schema.json`. A document valid against `schema.json` is
also valid against Annex A. Where only `schema.json` rejects a document, the two
normative artefacts disagree, and a tool should say so rather than pick one.

**RN-1.0-004 — Requirements the schema does not check.** Schema validity is not
conformance (§ 12.1). Some MUST statements are decidable from the document but are
not in the schema, among them § 7.2.1 (level 3 may not declare both logging and
reconstructability `"none"`) and § 11.5 (with `stores_personal_data: false`, the
only permitted retention value is `"none"`). Others require judgment (§§ 6.3, 6.4,
9.2, 9.3) or cannot be evaluated from the document at all (§ 8 classification,
truthfulness). A tool can show that a document does not conform; no tool can show
that it does.

**RN-1.0-005 — § 7.1.2 is always satisfied.** It recommends declaring a stopping
mechanism at level 1, but `stopping_authority.mechanism` is required by the schema
at every level.

**RN-1.0-006 — The retention pattern and regular-expression engines.** The
pattern `^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$` uses a lookahead,
which RE2-based engines (Go `regexp`, and validators built on it) cannot compile.
The lookahead only excludes the string `"P"`. The pattern
`^P([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T([0-9]+H)?([0-9]+M)?([0-9]+S)?)?$` combined with
"the value is not `"P"`" accepts exactly the same strings (checked exhaustively
over all 5,380,840 strings of length 0–7 on the alphabet `PYMDTHS12`). JSON Schema
patterns are ECMA-262: `\d` means `[0-9]` and `$` matches only at the end of input.
Python and Rust engines differ on both unless configured. The pattern accepts
`"PT"`, `"P1DT"` and `"P1YT"`, which are not ISO 8601 durations, and rejects
`"P1W"`, which is; use `"P7D"`. § 11.3 leaves full ISO 8601 checking to the
Enforcement Layer.

**RN-1.0-007 — `format: "email"` is an annotation by default.** In JSON Schema
2020-12 a validator does not check `format` unless asked to. The project's tools
assert it, using ajv-formats in "full" mode, which is stricter than the RFC 5321
Mailbox grammar JSON Schema names (it rejects quoted local parts and dotless
domains). Validators that differ here will disagree on some addresses.

**RN-1.0-008 — "What is not declared is considered prohibited."** This sentence
appears in the abridged `spec.md`, not in the canonical text. The canonical text
defines negative scope through `forbidden_actions` (§§ 4.9, 6.4). How a consumer
evaluates an action that no declared string mentions is left open; see
STABILITY.md, Known limits.

**RN-1.0-009 — Media type and discovery location.** § 16.2 recommends
`application/json` and registers no dedicated media type. The path
`/.well-known/agent-manifest.json` is defined in [WELL_KNOWN.md](./WELL_KNOWN.md),
not in the v1.0 text, and is not registered with IANA. An unrelated project
publishes a different format at the same path; a document there without
`manifest_version` is not an Agent Manifest.

**RN-1.0-010 — Smaller readings.**
- § 9.4 says stage values "MAY include" three values; the schema enumerates exactly
  those three, and § 13.1 makes the schema authoritative for enumerations. The list
  is closed.
- `stages: []` is rejected by `schema.json` (`minItems: 1`) and accepted by Annex A.
- A root `$schema` key is not an `x-` key; § 13.2's SHOULD asks extension fields at
  the root to use the prefix. Many examples carry `$schema` for editor support.
- A string of spaces satisfies `minLength` but not the requirement it stands for
  (for example a non-empty purpose, § 6.3).
- § 12.4 counts material misrepresentation as non-conformance; § 14.2 says a
  conformant manifest may be false. No tool evaluates truthfulness; read § 14.2 as
  the rule for consumers.
- `stores_personal_data: true` with `retention: "none"` is schema-valid. Whether it
  is coherent with the definitions in §§ 11.2–11.3 is not settled by the text.
