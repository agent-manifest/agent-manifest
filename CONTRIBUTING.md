# Contributing to Agent Manifest

Thank you for your interest in contributing.

Agent Manifest is a minimal, execution-agnostic specification.  
Its goal is clarity, safety, and interoperability — not feature expansion.

The v1.0 release represents the first canonical specification freeze.
Breaking changes require a version increment (v1.1 or higher).

## What Contributions Are Welcome

We welcome:

- Clarifications that improve precision
- Concrete examples demonstrating correct usage
- Identification of ambiguity or unsafe interpretation
- Backwards-compatible improvements
- Proposals for optional extensions (clearly marked as such)

## What Is Not Accepted

- Changes that expand the core scope beyond declarative identity
- Runtime-specific requirements
- Vendor-specific integrations embedded into the core spec
- Philosophical debates without concrete implementation implications
- Breaking changes without strong justification and version proposal

## Proposing Changes

For non-trivial modifications:

1. Open an issue first describing:
   - The problem
   - Why it matters
   - A proposed solution
   - Backwards compatibility impact

2. If aligned, submit a Pull Request referencing the issue.

Core specification changes must:
- Preserve minimalism
- Maintain execution-agnostic design
- Respect declared boundaries

## Extensions

Experimental or domain-specific ideas should be proposed as:
- Separate extension documents
- Clearly marked proposals
- Non-binding to the core specification

## Governance

Final decisions on core specification changes are maintained by the project author(s) as described in GOVERNANCE.md.

The goal is coherence over expansion.

---

## Contribution Filters (Operational Guidance)

To preserve architectural integrity, contributions are categorized as follows:

### ✅ Low-Risk (PR welcome)

- Editorial improvements
- Documentation clarity
- Additional illustrative examples (non-normative)
- Backwards-compatible refinements
- Ambiguity identification with concrete proposal

### ⚠️ Discussion Required Before PR

Open an Issue first if proposing:

- Schema modifications
- New required fields
- Changes to enums or validation constraints
- Autonomy model adjustments
- Structural additions to the core spec

### ❌ Out of Scope

- Runtime enforcement implementations
- Policy engines or validators inside this repository
- Vendor-specific integrations
- Turning the spec into a compliance framework
- Feature expansion that increases surface area

Agent Manifest grows by refinement, not accumulation.
