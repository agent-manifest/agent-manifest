# Design Rationale

This document explains *why* the Agent Manifest specification is structured the way it is.
It is not a tutorial and it does not prescribe any runtime, framework, or vendor implementation.

The Agent Manifest is an **execution-agnostic** declaration layer:
- readable by humans
- parseable by machines
- enforceable by tooling (validators, policy engines, runtimes) *outside* the spec itself

---

## Core Thesis

Agentic systems are increasingly capable of acting, transacting, and deciding in complex environments.

**Pre-Execution Authority** is the foundational doctrine:

> No autonomous entity with decision-making capacity should execute actions without an explicitly declared authority framework.

This translates into a simple principle for the spec:

**No autonomy without authority.**

The Agent Manifest exists to make that authority and those boundaries *explicit, portable, and inspectable* before interaction begins.

---

## Non-Goals

The Agent Manifest does **not** attempt to:
- execute agents
- orchestrate workflows
- define tool-calling protocols
- enforce policies at runtime by itself
- replace security engineering or governance programs
- certify compliance

Those are separate layers that may integrate with the manifest.

---

## Design Axioms

1. **Boundaries over capabilities**
   - The spec prioritizes declared constraints and prohibitions over expansive capability listings.

2. **Accountability must be explicit**
   - Every manifest must point to a responsible owner and contact path.

3. **Autonomy must be declared**
   - Autonomy is not an emergent property. It must be stated as a parameter.

4. **Risk must be surfaced early**
   - The system must communicate its risk posture, even if self-declared.

5. **Execution-agnostic by default**
   - The manifest should remain portable across runtimes and ecosystems.

6. **Minimal but extensible**
   - The core stays small; future additions must preserve clarity and neutrality.

---

## Required Fields: Why They Exist

The required fields exist to prevent “empty manifests” that look formal but carry no operational meaning.

### `manifest_version`
A manifest must be versioned so validators and tooling can interpret it deterministically.
Versioning is part of auditability.

### `agent_id`
A unique identifier is necessary for referencing, registry indexing, and change tracking.

### `owner`
Autonomous behavior without accountability is structurally unsafe.
The `owner` field exists to preserve responsibility chains (individual, organization, or system).

### `purpose`
A declared purpose creates a **scope boundary**.
Without purpose, any capability list becomes ambiguous and any audit becomes meaningless.

### `forbidden_actions`
This is a core differentiator.

Most ecosystems describe what agents *can* do.
Agent Manifest requires declaring what the agent **must not do**.

The rationale:
- constraints are the first line of trust
- users and systems need *hard boundaries* before delegation
- “capabilities” expand naturally; constraints must be declared intentionally

Requiring at least one forbidden action prevents “permissionless autonomy by omission”.

### `autonomy`
Autonomy is a declared gradient, not a marketing label.
Different autonomy levels imply different required controls, expectations, and escalation behavior.

### `risk_profile`
Risk is unavoidable; hiding it is the risk.
Even a self-assessed profile is valuable as:
- a signal to operators and integrators
- an anchor for evaluation rules
- a red flag when inconsistent with autonomy or purpose

### `data_handling`
Agentic systems interact with user data, system state, and external sources.
Data practices must be explicit to reduce ambiguity and improve trust.

### `contact`
There must be a defined path to humans or responsible parties.
When systems fail, governance begins with reachability.

---

## Autonomy Gradient (Design Rationale)

Autonomy is modeled as a small bounded set of levels to remain interpretable across contexts.

The intent is not to model every nuance, but to ensure that autonomy is never implicit.

A simple gradient enables:
- consistent UI/UX disclosure
- validator checks (e.g., high autonomy + high risk)
- policy mapping in runtimes

---

## Why the Spec Remains Neutral

The Agent Manifest is designed to remain:
- **minimal** (not a full governance framework)
- **open** (not tied to a platform)
- **execution-agnostic** (works with any runtime)

This neutrality keeps the spec adoptable and prevents vendor capture.

---

## Interoperability Considerations

The manifest is compatible by design with:
- identity frameworks (DIDs, verifiable credentials, on-chain identity)
- orchestration frameworks (tool calling, agent frameworks)
- registries and discovery systems
- evaluation and policy engines

However, interoperability should emerge through adoption patterns and tooling, not by bloating the core.

---

## Security Considerations (Conceptual)

The manifest improves safety by making boundaries explicit, but it does not replace:
- runtime permissioning
- sandboxing
- access controls
- monitoring and incident response

A manifest can be honest and still be violated by flawed implementations.
Therefore, future ecosystems may add:
- verification / attestation layers
- enforcement integration patterns
- audit trails

These are intentionally outside the core spec.

---

## Relationship to Pre-Execution Authority

Pre-Execution Authority is the doctrine.
Agent Manifest is one instrument that operationalizes the doctrine as a structured declaration.

- Doctrine: **legitimacy precedes execution**
- Instrument: **declare boundaries, autonomy, risk, and accountability before action**

---

## Change Philosophy

Changes to the specification should preserve:
- the core thesis
- minimalism
- portability
- clarity over completeness

The spec should evolve carefully, with a bias toward stability.

---

## Summary

The Agent Manifest is designed to be a structural layer for autonomous systems:
a declared authority and boundaries model that exists *before* autonomy is exercised.

It is intentionally small, execution-agnostic, and oriented around constraints and accountability.

Its value emerges through adoption.
