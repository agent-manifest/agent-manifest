---
title: Stability
description: What is frozen at v1.0 of the Agent Manifest specification and what may still change within the v1.x series.
section: Governance
---

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

## Known limits of v1.0

These are questions v1.0 does not settle. They are recorded here as limits, not
as defects awaiting a patch: closing any of them would change the normative
contract, and the normative contract is frozen. They are inputs to v1.1.

**v1.0 defines no normative vocabulary.** `forbidden_actions[]` carries free-text
strings. The schema constrains their length, not their form: there is no
enumeration, no pattern, no namespace and no issuing authority. Two manifests may
express the same prohibition with different strings, and both are conformant.

**v1.0 defines no universal rule of correspondence.** Nothing in the
specification states how an identifier internal to a consumer — a tool name, a
route, a permission — is matched against a declared string. Exact match, prefix
match, case folding and normalisation are all left open.

**A consumer must therefore define its own mapping,** and should state it where
its own users can read it. A consumer that matches strings literally is
conformant; so is one that does not.

**`domain.verb` is a recommended convention, not a requirement.** Identifiers of
the form `payment.execute` read well and compose predictably, and new manifests
are encouraged to use them. They are not a condition of conformance. Existing
declarations, including this project's own, use other styles and remain fully
conformant.

**The evaluation model is ambiguous, and that is recorded here as a known
limit.** The specification states that what is not declared is considered
prohibited, while `capabilities[]` is optional. Read together, those admit more
than one model of how a consumer should evaluate an action that no declared
string mentions. v1.0 does not choose between them. Until it does, a consumer
should state which model it implements rather than assume the specification
settled it. This is a different question from *Denial by Default* in
[TERMINOLOGY.md](./TERMINOLOGY.md), which concerns a manifest that fails to
declare required elements, not the evaluation of an action against a complete
declaration.

**`registry_version` names two different things.** In the discovery document at
`/.well-known/agent-manifest-registry.json` it versions that document's own
format; in a registry index it versions the index format. The two are numbered
independently, and a reader must not assume they refer to the same contract.

**Resolution depends on a host that makes no availability commitment.** The
published registry index resolves manifests through `raw.githubusercontent.com`.
There is no content delivery network, no service level, and no guarantee of
latency or uptime behind that path. Software that needs either should cache what
it reads.

**Implementations and examples do not amend the specification.** The reference
examples in this repository and in the client packages illustrate one way of
reading a manifest. Where an example resolves something the specification leaves
open, that is a choice made by the example — not an extension of the normative
contract, and not a precedent binding on any other consumer.

---

## Constitutional core

The core principles are defined in:

- [CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md)

Changes to core principles require a major version, per CORE_PRINCIPLES.md.

Stability in Agent Manifest means:

Capability evolves.  
Principles remain constrained.  
Authority is declared before autonomy.
