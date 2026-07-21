---
title: DIF evaluation — extended
description: Extended application of the Declarative Integrity Framework checklist to an example manifest, retained with a dated correction notice.
---

# Declarative Integrity Framework (DIF) — Extended Evaluation

## Correction notice — 2026-07-20

This evaluation is retained as originally written. Its stated field values do not
match the manifest it names. `examples/basic-agent.json` declares
`autonomy.level` 2 · `risk_profile.level` medium · `data_handling.stores_personal_data` true · `audit_surface.logging` detailed · `audit_surface.reconstructability` full, and `agent_id` `example.customer.support.tier1`.

The evaluation text below reports a lower-autonomy, low-risk profile that the file
does not carry. The record is preserved rather than rewritten; readers should take
the manifest itself as authoritative. Re-running the checklist against the current
file is recorded as outstanding work.

---

Target: Minimal Example Agent  
Manifest Version: 1.0  
Evaluation Type: Declaration Layer Integrity  
Status: PASS  
Confidence: Medium–High  

---

## 1. Purpose of This Evaluation

This document provides an extended structural analysis of the Minimal Example Agent Manifest under the Declarative Integrity Framework (DIF).

DIF evaluates:

- Structural completeness
- Internal coherence
- Boundary clarity
- Autonomy–risk alignment
- Stopping authority integrity
- Audit surface adequacy
- Data handling declaration clarity

This evaluation is non-normative and does not modify the specification.

---

## 2. Structural Completeness

All required declaration surfaces are present:

- Identity
- Purpose
- Autonomy
- Risk profile
- Forbidden actions
- Stopping authority
- Audit surface
- Data handling

Result: PASS

The manifest demonstrates a complete baseline declaration structure.

---

## 3. Autonomy–Risk Alignment — superseded

**Superseded.** The values recorded here are not the ones the named manifest
carries: [`examples/basic-agent.json`](../examples/basic-agent.json) declares
`autonomy.level` 2 and `risk_profile.level` medium. The section is preserved as a
record; see the correction notice above.

Declared:

- autonomy.level = 1
- risk_profile.level = low

Level 1 autonomy indicates low independent decision capacity.  
Low risk posture is consistent with advisory or bounded execution contexts.

Result: PASS

There is no structural contradiction between autonomy and risk.

---

## 4. Boundary Adequacy

The manifest includes explicit forbidden actions.  
This prevents ambiguity around scope expansion.

However, for broader reuse scenarios, additional constraints could include:

- Explicit prohibition of binding commitments
- Explicit prohibition of destructive actions

Result: PASS (with optional hardening recommendations)

---

## 5. Stopping Authority Integrity

Stopping authority is declared with:

- Identified role (owner)
- Mechanism (manual override)
- Execution stages

This establishes pre-declared interruptibility.

Result: PASS

For higher-stakes domains, mechanism detail could be expanded.

---

## 6. Audit Surface Evaluation

Declared audit surface: basic / partial

This is acceptable for low-risk domains.  
However, reconstruction capacity is limited.

Recommendation:  
Clarify what constitutes "basic" logging in `audit_surface.notes`.

Result: PASS (minimal posture)

---

## 7. Data Handling Integrity

Declared:

- stores_personal_data = false

This is clear and unambiguous.

Optional strengthening:

- Explicit retention = "none"
- Explicit log redaction posture

Result: PASS

---

## 8. Overall Integrity Assessment

The Minimal Example Agent demonstrates:

- Complete declarative surface
- No internal contradictions
- Proper autonomy–risk coherence — *superseded: assessed against values the file does not carry (section 3).*
- Declared interruptibility
- Clear non-storage claim — *superseded: the file declares `data_handling.stores_personal_data` true.*

It qualifies as a structurally sound baseline declaration example.

This evaluation confirms declarative integrity,  
not runtime safety or behavioral guarantees.

---

## Non-Normative Notice

This document is an evaluation artifact.  
It does not alter the Agent Manifest specification.  
It does not imply certification.  
It represents structured declaration analysis only.
