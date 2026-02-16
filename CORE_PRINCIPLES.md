# Agent Manifest — Core Principles (v1)

## Status

These principles constitute the **constitutional core** of the Agent Manifest v1.x series.

They are stable and may only be modified under a **major version change** (e.g., v2.0).

Minor versions (v1.1, v1.2, etc.) may clarify definitions, refine language, or introduce optional profiles, but must not alter these core guarantees.

---

## 1. Prior Declaration

No autonomous agent should act without first declaring:

- Identity
- Responsible party
- Scope (positive and negative)
- Declared operational capabilities (if relevant)
- Risk profile
- Stopping authority
- Audit surface

---

## 2. Identity

Every agent must declare a distinct and persistent identity sufficient for reference and audit.

---

## 3. Responsible Party

Every agent must declare a responsible party capable of answering for and stopping the agent.

Orphaned agents are structurally non-compliant for production deployment.

---

## 4. Scope Boundaries

Every agent must declare:

- What it is intended to do (positive scope)
- What it explicitly will not do (negative scope)

An agent without explicit boundaries is structurally unbounded.

---

## 5. Risk Declaration

Every agent must declare known risks and uncertainty.

Unknown risk must be declared as unknown.

---

## 6. Stopping Authority

Every agent must declare how it can be stopped, by whom, and at what stage.

Agents without stopping authority are uncontrollable by design.

---

## 7. Audit Surface

Every agent must declare what can be observed, logged, or reconstructed after execution.

Opacity must be declared.

---

## 8. Denial by Default

If an agent cannot truthfully declare the above, the default structural position is non-authorization for autonomous operation.

---

These principles define the structural minimum for autonomous systems under Agent Manifest v1.
