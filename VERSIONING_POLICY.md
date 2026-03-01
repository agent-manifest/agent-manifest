# Agent Manifest — Versioning Policy

This repository uses **two related but distinct version tracks**:

1. **Repository version** (Git tag / Release): e.g. `v1.0.0`, `v1.0.1`
2. **Specification version** (`manifest_version` + schema const): e.g. `1.0`

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

- **MAJOR** (`v2.0.0`): governance or structure changes that redefine the project surface or public contract.
- **MINOR** (`v1.x.0`): meaningful additions or refinements to docs, doctrine, examples, or tooling that do not change the specification contract.
- **PATCH** (`v1.x.y`): small editorial fixes, formatting updates, link repairs, typos, minor clarifications.

**Rule:** A repository release MUST NOT imply a specification bump unless the specification itself changes.

-----

## 2. Specification version (`manifest_version`)

The specification version is the **normative contract** for Agent Manifests.
It changes **only** when the technical specification changes.

The normative specification is defined by:

- `spec/vX.Y/spec.md`
- `spec/vX.Y/schema.json`

Where `X.Y` matches the declared `manifest_version`.

A specification bump MUST occur when changes affect:

- required fields
- field meaning or semantics
- validation rules (schema constraints)
- compatibility expectations
- normative definitions in the versioned spec directory

### Specification SemVer meaning

- **MAJOR** (e.g. `2.0`): breaking structural changes. Manifests valid before are no longer valid, or semantics change materially.
- **MINOR** (e.g. `1.1`): compatible expansion. New optional fields or additive clarifications that do not invalidate prior manifests.
- **PATCH** (e.g. `1.0.1`): editorial specification fixes that do not change schema validation behavior.

-----

## 3. Compatibility rule (hard)

A manifest that declares:

```json
{
  "manifest_version": "1.0"
}
```

MUST validate against the corresponding `spec/v1.0/schema.json`.

Never publish a schema that requires `manifest_version: "1.1"` while claiming compatibility with `1.0`.

The declared `manifest_version` and the schema path version MUST align.

-----

## 4. When to bump the specification

**Bump specification MINOR if:**

- you add new OPTIONAL fields
- you add non-breaking constraints that do not invalidate existing valid manifests
- you expand normative interpretation in `spec/vX.Y/spec.md`

**Bump specification MAJOR if:**

- you add or change REQUIRED fields
- you change meanings or semantics of existing fields
- you tighten constraints that cause previously valid manifests to fail
- you rename or remove fields

**Do NOT bump specification if:**

- you only change examples
- you only improve documentation or foundations
- you only fix links or formatting
- you only add non-normative files

-----

## 5. Required steps for a specification bump

When the specification version changes (e.g. `1.0` → `1.1`), all of the following MUST be done in the same release:

1. Create a new versioned directory:
   ```
   spec/v1.1/
   ```
2. Add the updated:
   - `spec/v1.1/spec.md`
   - `spec/v1.1/schema.json`
3. Update all examples to match the new `manifest_version`
4. Update `CHANGELOG.md` with clear Added / Changed / Removed sections
5. Create a new repository release tag

Previous specification directories MUST remain intact for compatibility reference.

-----

## 6. Practical examples

**Example A — Repository bump only**

- You add new examples and refine README language.
- Specification remains `1.0`.
- Repo tag moves `v1.0.0` → `v1.0.1`.

**Example B — Specification minor bump**

- You add a new OPTIONAL field and document it as normative.
- Specification moves `1.0` → `1.1`.
- A new directory `spec/v1.1/` is created.
- Repo tag moves accordingly (e.g. `v1.1.0`).

**Example C — Specification major bump**

- You add a new REQUIRED field.
- Specification moves `1.x` → `2.0`.
- A new directory `spec/v2.0/` is created.
- Migration guidance is documented.
- Repo tag reflects the major change.

-----

## 7. Single source of truth

| Layer          | Files                          |
|----------------|--------------------------------|
| **Normative**  | `spec/vX.Y/spec.md`, `spec/vX.Y/schema.json` |
| **Non-normative** | `README.md`, `foundations/`, `examples/` |

The specification version is **authoritative**.  
The repository version is **contextual**.

When in doubt: the schema `const` value inside the versioned directory is the ground truth for what `manifest_version` a manifest must declare.
