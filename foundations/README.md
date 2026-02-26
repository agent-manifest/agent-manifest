# Foundations

This directory contains foundational doctrine and structural analysis that support the Agent Manifest specification.

These documents are **conceptual and architectural**.
They do not modify the normative specification contract.

---

## Start here

- **Pre-Execution Authority**  
  The doctrine that authority must be declared *before* autonomy, execution, or tool use.  
  [`pre-execution-authority/`](./pre-execution-authority/)

- **Incident Analysis — Architectural Gap Patterns**  
  Structural failure patterns observed across autonomous and semi-autonomous systems, mapped to the declaration layer.  
  [`INCIDENT_ANALYSIS.md`](./INCIDENT_ANALYSIS.md)

- **Declarative Integrity Framework (DIF)**  
  A framework for evaluating whether a manifest is internally coherent and structurally complete *as a declaration*.  
  [`DECLARATIVE_INTEGRITY_FRAMEWORK.md`](./DECLARATIVE_INTEGRITY_FRAMEWORK.md)

---

## Notes

- This directory is part of the **Declaration Layer** narrative of the project.
- Nothing here adds runtime enforcement.
- Validators, scoring systems, and policy engines remain external.

