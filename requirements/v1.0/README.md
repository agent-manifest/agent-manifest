---
title: Requirements index (v1.0)
description: A non-normative index of every normative statement in the Agent Manifest v1.0 specification, with who it binds and whether it can be decided from a manifest alone.
section: Specification
---

# Requirements index — Agent Manifest v1.0

[`requirements.json`](./requirements.json) lists every normative statement of the
canonical v1.0 text — each MUST, SHOULD, MAY and their variants — with a stable
identifier, the verbatim text, the section, who the statement binds, and whether
it can be decided from a manifest document alone.

It is **non-normative**. It adds no requirement, removes none, and changes nothing
in v1.0. Where it and the specification differ, the specification governs.

## Why it exists

A manifest that validates against `schema.json` is structurally valid. That is not
the same as conforming to the specification (§ 12.1). The schema decides 23 of the
53 MUST statements that bind a manifest document. This index shows the rest:
which can be decided mechanically, which need a person's judgment, and which
cannot be evaluated from the document at all.

## What it is not

- Not a conformance programme, checklist for claiming conformance, score, badge or
  certification basis.
- Not a judgment about any agent, its safety, or whether its declaration is true.
- Not a substitute for the Responsible Party's own declaration of conformance
  (§ 12.3).

A tool can show that a document does not conform. No tool can show that it does:
§ 12.1 includes semantic requirements (§§ 8–11) and § 12.4 includes material
misrepresentation, neither of which a document can settle.

## Fields

| Field | Meaning |
|---|---|
| `id` | `AM10-<section>-<letter>`. Stable for v1.0, because the text is frozen. |
| `strength` | `MUST`, `SHOULD`, `MAY`, or `meta` (a keyword used in a reading rule). |
| `kind` | `requirement`, `permission`, `definitional`, `meta`. |
| `target` | Who the statement binds: `manifest`, `responsible-party`, `consumer`, `implementation`, `enforcement-layer`, `execution-layer`, `specification`, `future-revision`. |
| `testability` | **S** decided by `schema.json`; **M** decidable from the document but not by the schema; **H** likely violations can be surfaced, a definitive answer needs judgment; **J** judgment only; **X** not evaluable from the document. |
| `mechanical_result` | What a tool may honestly report: `decides` (pass or fail), `refutes-only`, `refutes-or-flags`, `flags-only`, `none`. |
| `ambiguities` | Links to the `ambiguities` list; readers' notes are in [ERRATA.md](../../ERRATA.md) once that register is published. |

## Counts

| Strength | S | M | H | J | X |
|---|---|---|---|---|---|
| MUST binding the manifest (53) | 23 | 6 | 12 | 9 | 3 |
| SHOULD binding the manifest (7) | 1 | 5 | 0 | 1 | 0 |
| All 118 entries | 28 | 11 | 12 | 10 | 57 |

The M-class MUSTs include § 7.2.1 (level 3 may not declare both logging and
reconstructability `"none"`) and § 11.5 (with `stores_personal_data: false`, the
only permitted retention value is `"none"`). No tool in this ecosystem checks them
today.

## Keeping it honest

`python3 tools/requirements/verify.py` checks that the recorded SHA-256 of the
canonical HTML and of `schema.json` match the files, and that every entry's text
occurs verbatim in the canonical HTML. CI runs it on every change to the index or
to `spec/v1.0/`. The classification itself is a reading of the text; disagreements
are welcome as issues, with the entry id.

## Licence

CC BY 4.0, like the specification it quotes.
