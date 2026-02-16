# ARCHITECTURE

Agent Manifest is a minimal specification that operates strictly at the **Declaration Layer**.

It does not execute agents.  
It does not enforce policy.  
It does not validate runtime behavior.

It standardizes how boundaries are declared **prior to execution and interaction**.

---

## Layered Separation

Agent Manifest is designed around strict separation between three layers:

### 1) Declaration Layer (this repository)
Defines a shared declaration surface for:

- Identity and purpose
- Operational domain
- Autonomy level
- Tool access scope
- Risk posture and boundary constraints
- Data handling commitments
- Human oversight conditions
- Version commitments

This layer is declarative and execution-agnostic by design.

---

### 2) Enforcement Layer (external systems)
Independent systems may interpret and verify declarations, including:

- Validators (coherence / contradiction detection)
- Policy engines (rule-based enforcement)
- Audit and compliance tooling (attestation / reporting)
- Governance overlays (institutional requirements)

These systems are **not part of this specification**.

Agent Manifest enables enforcement tooling by providing structured declarations, but it does not embed enforcement logic.

---

### 3) Execution Layer (agents and runtimes)
Execution systems perform actions and may reference a manifest, including:

- Tool-calling agents
- RAG agents
- Orchestrated workflows
- Multi-agent systems

Execution behavior is out of scope for Agent Manifest.

---

## Design Constraints

Agent Manifest must remain:

- Minimal (small surface area)
- Composable (usable across domains)
- Execution-agnostic (no runtime coupling)
- Policy-agnostic (no embedded governance engine)
- Forward-compatible (refinement over accumulation)

This project does not grow by adding features.  
It grows by improving clarity.

---

## Extensibility Boundary

Extensions may exist, but **outside the constitutional core**.

Examples of external extension domains:

- Domain-specific boundary profiles
- Sector compliance overlays
- Risk classification schemas
- Validator interpretation layers
- Interoperability conventions between agents

Extensions must not modify constitutional guarantees defined in [CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md).

---

## Non-Goals

Agent Manifest does not aim to:

- Provide safety guarantees
- Certify or score agents as “safe”
- Replace governance frameworks
- Define runtime architectures
- Compete with agent frameworks

It defines declarations.  
Everything else is external.

---

## Architectural Integrity

The long-term value of Agent Manifest depends on preserving separation:

- Declaration (Manifest)
- Enforcement (validators / policy / audit)
- Execution (agents)

Without structured declaration, verification is fragile.  
Without verification, accountability erodes.

---

## Conceptual Foundation

The specification is grounded in **Pre-Execution Authority**:  
a boundary-first doctrine where authority and constraints are declared prior to autonomy and execution.

See: [Pre-Execution Authority](./foundations/pre-execution-authority/README.md)
