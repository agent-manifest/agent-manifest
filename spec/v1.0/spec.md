# Agent Manifest — Specification (v1.0)

Agent Manifest is a minimal, execution-agnostic, declarative specification that allows AI agents to publicly declare identity, purpose, scope, autonomy level, risk profile, stopping authority, audit surface, and data handling before interaction.

This specification declares.  
It does not execute, validate, score, enforce, or decide.

---

## 1) Required fields

An Agent Manifest MUST declare the following fields:

---

### Identity

- `manifest_version` (must be `1.0`)
- `agent_id` (stable identifier)
- `agent_name` (human-readable)
- `agent_version` (agent’s own version)

---

### Ownership and accountability

- `owner.type` (`individual` | `organization` | `system`)
- `owner.identifier` (accountable reference)

Agents without a declared owner are invalid by design.

---

### Purpose (Positive Scope)

- `purpose.primary_code` (bounded code)
- `purpose.description` (specific, bounded explanation)

---

### Hard constraints (Negative Scope)

- `forbidden_actions[]` (minimum 1 entry)

What is not declared is considered prohibited.

---

### Autonomy

- `autonomy.level` (integer 0–3)

Autonomy describes decision freedom, not intelligence.

#### Autonomy Levels (normative interpretation)

`autonomy.level` is a declared execution posture (not a capability claim):

- **0** — No execution: advisory / descriptive only  
- **1** — Supervised: actions only under explicit user instruction or approval  
- **2** — Scoped autonomy: bounded workflows within declared constraints  
- **3** — High autonomy: can execute within declared constraints without per-step approval  

---

### Risk Profile

- `risk_profile.level` (`low` | `medium` | `high`)
- Optional: `risk_profile.notes`

Risk is self-declared. This specification does not evaluate or verify risk claims.

---

### Stopping Authority

- `stopping_authority.stoppable_by[]`
- `stopping_authority.mechanism`
- Optional: `stopping_authority.stages[]`

Every autonomous system must be stoppable.  
Agents without declared stopping authority are structurally non-compliant.

---

### Audit Surface

- `audit_surface.logging` (`none` | `basic` | `detailed`)
- `audit_surface.reconstructability` (`none` | `partial` | `full`)
- Optional: `audit_surface.opacity_declared` (boolean)
- Optional: `audit_surface.notes`

Accountability requires reconstructability.  
Opacity, when present, must be explicitly declared.

---

### Data Handling

- `data_handling.stores_personal_data` (boolean)
- Optional: `data_handling.retention`

If `stores_personal_data` is `true`, `retention` MUST be declared.

---

### Contact

- `contact.email`

A contact channel is required for accountability and escalation.

---

## 2) Optional Fields

### Capabilities

- `capabilities[]`

Capabilities describe declared operational abilities.  
Capabilities MUST NOT contradict declared scope or forbidden actions.

---

### Language

- `language.primary`
- `language.supported[]`

This is a human-facing declaration.  
Inter-agent communication is assumed to use structured data.

---

## 3) Extensibility

This specification is intentionally extensible.

Implementers MAY include additional fields without breaking compatibility.

To preserve interoperability, custom or domain-specific fields SHOULD be placed under an `extensions` object.

---

## 4) Schema

Normative validation is performed against:

https://agent-manifest-spec.org/spec/v1.0/schema.json

The schema `const` value for `manifest_version` is the authoritative version indicator.

---

## 5) Versioning

This specification follows Semantic Versioning.

Current specification version: `1.0`.
