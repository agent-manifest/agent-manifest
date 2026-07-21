---
title: What this is
description: The scope of the Agent Manifest specification, stated together with what falls outside it.
section: Concept
---

# What this is

This is the Agent Manifest, at version 1.0.

It is a declaration layer and a normative specification.
Not a framework.
Not a product.
Not a runtime system.

It defines a minimal declarative boundary for what an agent must state before operating.

---

## What This Is

Agent Manifest is a public reference document.

It exists to articulate:

- identity  
- intent  
- scope  
- limits  
- autonomy  
- accountability  

It states what an agent declares before operating.

The core specification is defined in the versioned `spec/` directory: the
normative text is
[Agent Manifest v1.0](/spec/v1.0/agent_manifest_v1.0.html), and the machine-readable
form is its [JSON Schema](/spec/v1.0/schema.json). The governed vocabulary is in
[Terminology](/TERMINOLOGY.html) and the constraints that hold across v1.x in
[Core principles](/CORE_PRINCIPLES.html).

It does not prescribe runtime behavior.  
It does not enforce compliance.  
It does not depend on any specific technology stack.

---

## What This Is Not

This is not:

- an implementation framework  
- a runtime protocol  
- a product offering  
- a business proposal  
- a marketing document  

Runtime systems, enforcement mechanisms, and operational tooling are intentionally out of scope of the core specification.

Implementations may exist, but they are structurally independent from the declaration layer.

---

## How To Use This

You may:

- read it  
- reference it  
- critique it  
- extend it  

You do not need permission.

If this document influences how you design, govern, or reason about agents,
that influence is voluntary.

Adoption does not imply endorsement by the maintainers.

---

## Final Note

The Agent Manifest aims for structural stability, not perpetual expansion.

It is intended to serve as a foundational layer —  
minimal, declarative, and versioned.

---

## Where to go next

- [Specification v1.0](/spec/v1.0/agent_manifest_v1.0.html) — the normative text.
- [JSON Schema](/spec/v1.0/schema.json) — the machine-readable form.
- [Examples](/examples/) — manifests covering the declared field surface.
- [Command-line interface (CLI)](/docs/cli/) — validating a declaration against the schema.
- [Why this exists](/WHY_THIS_EXISTS.html) — the problem the layer addresses.
- [Relation to adjacent specifications](/docs/comparison.html) — where this sits beside A2A, MCP, agents.json, OASF, and Agent Spec.
- [Governance](/GOVERNANCE.html) — stewardship and the source of truth.
- [Contact](/contact/) — how to reach the maintainer.
