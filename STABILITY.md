# Stability

Agent Manifest is designed to remain minimal and structurally stable.

## Two tracks of stability

### 1) Specification stability (`manifest_version`)

The normative contract is defined by:

- [`spec/v1.0/spec.md`](./spec/v1.0/spec.md)
- [`spec/v1.0/schema.json`](./spec/v1.0/schema.json)

A manifest that declares:

```json
{
  "manifest_version": "1.0"
}
```

MUST validate against the `v1.0` schema.

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

Changes to core principles should be treated as major-level changes in spirit, even if the specification remains compatible.

Stability in Agent Manifest means:

Capability evolves.  
Principles remain constrained.  
Authority is declared before autonomy.
