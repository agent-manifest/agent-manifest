# Agent Manifest — Terminology (v1.x)

## Status

This document defines the normative terminology for the Agent Manifest v1.x series.

All core documents (README, CORE_PRINCIPLES.md, ARCHITECTURE.md, spec, examples) must use these terms consistently.

No alternative synonyms should be introduced within the v1.x series.

---

## 1. Identity

A persistent and unique identifier sufficient for reference, accountability, and audit.

Identity must remain stable across interactions unless explicitly versioned.

---

## 2. Responsible Party

A human or legal entity with the authority and capacity to:

- Answer for the agent
- Supervise the agent
- Stop the agent

Agents without a declared Responsible Party are structurally non-compliant for production deployment.

---

## 3. Scope

The declared operational boundary of the agent.

Scope consists of:

- **Positive Scope** — what the agent is intended to do.
- **Negative Scope** — what the agent explicitly will not do.

Scope defines limits, not mechanisms.

An agent without explicit boundaries is structurally unbounded.

---

## 4. Capabilities (Optional)

Declared operational abilities the agent may use to fulfill its scope.

Capabilities describe mechanisms or access (e.g., tools, APIs, data sources).

Capabilities must not contradict Scope.

Capabilities are optional in v1.x.

---

## 5. Autonomy Level

A declared structural level indicating the degree of independent decision-making without human intervention.

Autonomy Level describes independence, not safety.

---

## 6. Risk Profile

A declared assessment of known and unknown risks associated with the agent’s operation.

Risk Profile may include:

- Known risks
- Known uncertainties
- Declared unknowns

Unknown risk must be declared as unknown.

---

## 7. Stopping Authority

The declared mechanism and authority through which the agent can be halted.

It must specify:

- Who can stop the agent
- How the agent can be stopped
- At what stage stopping may occur

Agents without Stopping Authority are structurally uncontrollable.

---

## 8. Audit Surface

Declared observability guarantees regarding:

- Logging
- Traceability
- Reconstructability

Opacity must be declared if present.

---

## 9. Denial by Default

If an agent cannot truthfully declare the required structural elements defined above, the default structural position is non-authorization for autonomous operation.

---

## 10. Declaration Layer

The structural layer in which an agent formally declares identity, scope, autonomy, risk, and accountability prior to execution.

Agent Manifest operates exclusively at the Declaration Layer.

---

## 11. Enforcement Layer

External systems that interpret, validate, audit, or verify declared structures.

Enforcement Layer systems are not part of the core specification.

---

## 12. Execution Layer

The operational systems or runtimes that perform actions.

Execution is structurally independent from declaration.

---

## 13. Prior Declaration

The constitutional principle that an agent must declare its identity, scope, autonomy, risk posture, and stopping authority before acting.

Prior Declaration is a foundational requirement under Agent Manifest v1.x.

---

## Structural Rule

In the Agent Manifest v1.x series:

- Terminology is stable.
- Terms must not drift.
- New concepts must not redefine existing terms.
- Additions must not alter constitutional meaning.

Terminological changes require a major version update.