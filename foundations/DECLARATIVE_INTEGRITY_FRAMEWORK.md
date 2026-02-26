# Declarative Integrity Framework v0.1

*A structural evaluation lens for Agent Manifest declarations*

-----

## 0. Purpose

This document defines a **vendor-neutral**, **execution-agnostic** framework for evaluating the **structural integrity** of an autonomous system’s *declarations*.

It does **not** evaluate runtime behavior.  
It evaluates whether a system has declared the minimum governance surfaces required for accountability **before execution**.

Agent Manifest operates at the **Declaration Layer**.  
This framework evaluates **declarative completeness and coherence** within that layer.

-----

## 1. What This Framework Is

This framework provides:

- A shared vocabulary for governance absences
- A repeatable evaluation method (manual-first)
- A bridge from **declaration** → **review** → **future validation tooling**

It is designed to be:

- Minimal
- Readable
- Human-auditable
- Forward-compatible with validators

-----

## 2. What This Framework Is Not

This framework does not:

- Prove safety
- Guarantee compliance
- Replace runtime controls
- Score model capability
- Audit implementations
- Attribute blame for incidents

It is **structural**, not operational.

-----

## 3. Inputs

This framework evaluates a target system using only:

1. The system’s **Agent Manifest** (e.g., `manifest.json`)
2. Any referenced governance documentation (optional)
3. The schema contract (normative): `spec/manifest.schema.json`

-----

## 4. Declarative Failure Zones

A **Declarative Failure Zone** is a recurring governance absence that increases structural risk **independently of implementation quality**.

The five primary zones are:

1. **Scope Absence**  
2. **Negative Constraint Absence**  
3. **Autonomy Misalignment**  
4. **Interruptibility Absence**  
5. **Audit Opacity**  

-----

## 5. Evaluation Checklist (Manual-First)

Use this checklist to evaluate a manifest.

### Zone 1 — Scope Absence

**Question:** Is purpose declared with bounded intent?  
**Primary evidence:** `purpose.primary_code`, `purpose.description`

✅ Pass if:
- `purpose.primary_code` is specific and stable
- `purpose.description` is bounded (not “do anything”)

⚠️ Flags:
- overly broad purpose
- unclear operational domain
- purpose conflicts with declared constraints

---

### Zone 2 — Negative Constraint Absence

**Question:** Are hard prohibitions explicitly declared?  
**Primary evidence:** `forbidden_actions`

✅ Pass if:
- forbidden actions clearly prohibit high-risk classes of behavior relevant to the domain
- language is unambiguous (“must not” actions, not aspirations)

⚠️ Flags:
- empty or generic constraints (“do no harm”)
- missing prohibitions for domain-specific risk (e.g., finance, health, infra)

---

### Zone 3 — Autonomy Misalignment

**Question:** Does declared autonomy match the system’s posture and intended deployment?  
**Primary evidence:** `autonomy.level`

✅ Pass if:
- autonomy level is explicitly declared
- autonomy level is consistent with purpose and constraints

⚠️ Flags:
- autonomy level too high for the declared controls
- autonomy level implied by tooling but not reflected in declaration
- autonomy level not aligned with risk profile

---

### Zone 4 — Interruptibility Absence

**Question:** Is stopping authority formally declared, including mechanism?  
**Primary evidence:** `stopping_authority.stoppable_by`, `stopping_authority.mechanism` (optional `stages`)

✅ Pass if:
- stoppable roles/entities are declared
- mechanism is explicit (not “someone can stop it”)
- (optional) stages indicate when interruption can occur

⚠️ Flags:
- no clear human stopping authority
- mechanism unclear or non-actionable
- mismatch between autonomy and interruptibility

---

### Zone 5 — Audit Opacity

**Question:** Is audit posture declared (logging + reconstructability + opacity)?  
**Primary evidence:** `audit_surface.logging`, `audit_surface.reconstructability`, optional `opacity_declared`, `data_handling.retention`

✅ Pass if:
- logging posture is declared
- reconstructability is declared
- opacity is explicitly acknowledged when applicable

⚠️ Flags:
- “unknown” audit posture
- no reconstructability commitment
- retention ambiguous in systems handling sensitive data

-----

## 6. Outcome Format (Recommended)

Record the evaluation in a simple, shareable format:

```json
{
  "target": "example.agent",
  "manifest_version": "0.1.0",
  "evaluated_at": "YYYY-MM-DD",
  "zones": {
    "scope_absence": { "status": "pass|flag|fail", "evidence": ["purpose.primary_code"], "notes": "" },
    "negative_constraint_absence": { "status": "pass|flag|fail", "evidence": ["forbidden_actions"], "notes": "" },
    "autonomy_misalignment": { "status": "pass|flag|fail", "evidence": ["autonomy.level"], "notes": "" },
    "interruptibility_absence": { "status": "pass|flag|fail", "evidence": ["stopping_authority.mechanism"], "notes": "" },
    "audit_opacity": { "status": "pass|flag|fail", "evidence": ["audit_surface.reconstructability"], "notes": "" }
  },
  "summary": {
    "overall": "pass|flag|fail",
    "key_risks": [],
    "recommended_changes": []
  }
}
```

This is non-normative. It is a reporting convention.

-----

## 7. Notes on Future Scoring

This framework is intentionally **manual-first**.

A future validator may map zone outcomes into quantitative scores, but scoring is not required for the framework to be useful.

The core principle remains:

> **Declaration must precede evaluation.**  
> **Evaluation must precede enforcement.**

-----

## 8. Relationship to Agent Manifest

Agent Manifest defines the **declaration contract**.  
This framework defines a **review lens** over that contract.

- Manifest: *What is declared.*  
- Framework: *How declarations are structurally evaluated.*  
- Validator (future): *How evaluation could be automated and monetized.*

-----

## 9. Stability

This document is non-normative.

It may evolve without changing `manifest_version`, provided it does not alter the schema contract.

Recommended file location:

- `foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md`
