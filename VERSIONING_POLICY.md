# Agent Manifest — Versioning Policy

This repository uses **two related but distinct version tracks**:

1. **Repository version** (Git tag / Release): e.g. `v0.2.0`, `v0.2.1`
2. **Specification version** (`manifest_version` + schema title/const): e.g. `0.1.0`

These two versions **do not need to move together**.

-----

## 1. Repository version (Git tag / Release)

The repository version represents the overall state of the project, including:

- documentation
- doctrine and foundations
- examples
- editorial improvements
- non-breaking refinements

### Repo SemVer meaning

- **MAJOR** (`v1.0.0`): governance or structure changes that redefine the project surface or public contract (rare).
- **MINOR** (`v0.x.0`): meaningful additions or refinements to docs, doctrine, examples, or tooling that do not change the spec contract.
- **PATCH** (`v0.x.y`): small editorial fixes, formatting, link repairs, typos, minor clarifications.

**Rule:** A repo release MUST NOT imply a spec bump unless the spec itself changes.

-----

## 2. Specification version (`manifest_version`)

The specification version is the **normative contract** for Agent Manifests.
It changes **only** when the technical spec changes.

A spec bump MUST occur when changes affect:

- required fields
- field meaning or semantics
- validation rules (schema constraints)
- compatibility expectations
- normative definitions in `spec/spec.md` and `spec/manifest.schema.json`

### Spec SemVer meaning

- **MAJOR** (e.g. `1.0.0`): breaking structural changes. Manifests valid before are no longer valid, or semantics change materially.
- **MINOR** (e.g. `0.2.0`): compatible expansion. New optional fields, new non-breaking constraints, or additive clarifications that do not invalidate prior manifests.
- **PATCH** (e.g. `0.1.1`): editorial or spec text fixes that do not change schema validation behavior.

-----

## 3. Compatibility rule (hard)

A manifest that declares:

```json
"manifest_version": "0.1.0"
```

MUST validate against the `0.1.0` schema.

Never publish a schema that requires `manifest_version: "0.2.0"` while claiming compatibility with `0.1.0`.

-----

## 4. When to bump the spec

**Bump spec MINOR if:**

- you add new OPTIONAL fields (e.g. `capabilities`)
- you add new non-breaking constraints that do not invalidate existing valid manifests
- you expand `spec/spec.md` in a way that changes normative interpretation

**Bump spec MAJOR if:**

- you add or change REQUIRED fields
- you change meanings or semantics of existing fields
- you tighten constraints that cause previously-valid manifests to fail
- you rename or remove fields

**Do NOT bump spec if:**

- you only change examples
- you only improve docs or foundations
- you only fix links or formatting
- you only add non-normative files

-----

## 5. Required steps for a spec bump

When the spec version changes (e.g. `0.1.0` → `0.2.0`), all of the following MUST be done in the same release:

1. Update `spec/manifest.schema.json` (title, const, and any constraints)
2. Update `spec/spec.md` (normative text)
3. Update all examples to match the new `manifest_version`
4. Update `CHANGELOG.md` with a clear Added / Changed / Removed section
5. Create a new repo release tag (GitHub Release)

If maintaining multiple spec versions, keep separate schema files:

```
spec/manifest.schema.0.1.0.json
spec/manifest.schema.0.2.0.json
```

And clearly document which one is current.

-----

## 6. Practical examples

**Example A — Repo bump only**

- You add new examples and refine README language
- Spec remains `0.1.0`
- Repo tag moves `v0.2.0` → `v0.2.1`

**Example B — Spec minor bump**

- You add a new OPTIONAL field and document it as normative
- Spec moves `0.1.0` → `0.2.0`
- Repo tag moves accordingly (e.g. `v0.3.0`)
- Spec bump is explicit and documented

**Example C — Spec major bump**

- You add a new REQUIRED field
- Spec moves to `1.0.0` (or next major if still pre-1.0)
- Repo tag includes the spec bump and migration guidance

-----

## 7. Single source of truth

|Layer            |Files                                      |
|-----------------|-------------------------------------------|
|**Normative**    |`spec/spec.md`, `spec/manifest.schema.json`|
|**Non-normative**|`README.md`, `foundations/`, `examples/`   |

The spec version is **authoritative**.
The repo version is **contextual**.

When in doubt: the schema `const` value is the ground truth for what `manifest_version` a manifest must declare.
