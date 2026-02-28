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

### `audit_surface`
Autonomous systems must declare what aspects of their operation can be logged, observed, or reconstructed.

The `audit_surface` field exists to make traceability explicit.
A system that cannot be inspected or reconstructed after execution reduces accountability and increases systemic risk.

Declaring audit posture enables:
- external validation
- integration with logging systems
- governance alignment
- detection of opacity gaps

Opacity must be declared if present.

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

---

## Architectural Boundaries

Agent Manifest is intentionally constrained.  
Its strength derives not only from what it defines, but from what it deliberately excludes.

The following architectural boundaries are foundational to its design:

---

### 1. Not a Runtime Enforcement Engine

Agent Manifest does not execute, restrict, sandbox, or technically enforce behavior.

It is a declarative layer — not a control mechanism.  
Enforcement belongs to execution environments, orchestration layers, or external governance systems.

---

### 2. Not a Compliance Framework

The specification does not implement regulatory compliance (GDPR, HIPAA, financial law, etc.).

It may support such frameworks structurally, but it does not interpret or validate legal obligations.

Compliance is contextual and jurisdiction-dependent.  
Agent Manifest remains neutral and infrastructure-level.

---

### 3. Not a Moral or Ethical Arbiter

The specification does not determine whether an agent’s purpose is good, ethical, or socially acceptable.

It requires declaration — not moral validation.

Evaluation belongs to users, platforms, regulators, or ecosystems adopting the manifest.

---

### 4. Not an Orchestration Protocol

Agent Manifest does not define inter-agent communication standards, message schemas, or swarm coordination mechanics.

It defines declaration before execution — not interaction semantics.

Coordination layers may build on top of it, but they are external by design.

---

### 5. Not a Tool Execution Specification

The manifest may declare allowed or restricted tools, but it does not define how tools are executed.

Tool semantics, APIs, side-effects, and runtime safety mechanisms are outside scope.

The manifest describes authority surface — not operational mechanics.

---

### 6. Not an Enterprise Product

Agent Manifest is not designed as a commercial SaaS, governance platform, or auditing suite.

It is a minimal, open, execution-agnostic declaration surface.

Commercial implementations may emerge, but the specification itself remains neutral and open.

---

### 7. Declaration Precedes Capability

The core doctrine remains:

Before autonomy.  
Before execution.  
Before capability.

An agent must declare the authority framework under which it operates.

This principle is architectural — not optional.

---

Agent Manifest remains minimal by design.

Its power lies in clarity.
Its clarity lies in constraint.
Its constraint lies in architectural discipline.

---

## Illustrative Design Decisions

This section captures a few concrete decisions that encode the project’s core design philosophy: **boundaries over capabilities**, **clarity over completeness**, and **stability over velocity**.

### Decision: require at least one `forbidden_actions` entry (`minItems: 1`)

**Problem:** A manifest that declares no constraints is structurally hollow.

**Decision:** The schema requires `forbidden_actions` to contain at least one entry.

**Why:** A boundary layer must force explicit limits, not allow “permissionless autonomy by omission”.

**Trade-off:** Slightly more restrictive manifests, but prevents meaningless declarations.

**Illustration:**

```json
{
  "forbidden_actions": [
    "execute_payments",
    "access_private_data_without_consent"
  ]
}
```
---

## Declaration as a Precondition for Enforcement

Agent Manifest does not enforce behavior.

It establishes the structured surface upon which enforcement becomes possible.

Without declaration:
- No validator can detect contradiction.
- No auditor can identify deviation.
- No external system can measure compliance.
- No authority can attribute responsibility.

Implicit behavior cannot be validated.

Undeclared autonomy cannot be constrained.

Undefined boundaries cannot be audited.

Agent Manifest converts implicit assumptions into explicit commitments.

Enforcement systems operate on those commitments.

The separation is intentional:

- Manifest → Declares
- Validators → Verify
- Runtimes → Execute

If declaration is absent, enforcement collapses into guesswork.

Pre-Execution Authority begins with structured declaration.
