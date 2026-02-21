# Stability

Agent Manifest is designed to remain minimal and structurally stable.

## Two tracks of stability

### 1) Specification stability (`manifest_version`)

The normative contract is defined by:

- [`spec/spec.md`](./spec/spec.md)
- [`spec/manifest.schema.json`](./spec/manifest.schema.json)

A manifest that declares:

```json
{
  "manifest_version": "0.1.0"
}
```

MUST validate against the `0.1.0` schema.

The specification version changes only when the schema and normative specification change.

See: [VERSIONING_POLICY.md](./VERSIONING_POLICY.md)

---

### 2) Repository stability (documentation / foundations / examples)

The repository may evolve via:

- documentation refinements
- new examples
- foundational essays and doctrine
- editorial improvements

These do not imply a specification version bump unless the schema or normative specification changes.

---

## Constitutional core

The core principles are defined in:

- [CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md)

Changes to core principles should be treated as major-level changes in spirit, even if the specification remains pre-1.0.

Stability in Agent Manifest means:

Capability evolves.  
Principles remain constrained.  
Authority is declared before autonomy.