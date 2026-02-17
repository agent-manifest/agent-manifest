# Incident Analysis — Architectural Gap Patterns

This document examines recurring structural failures in autonomous and semi-autonomous systems and demonstrates the governance gaps that Agent Manifest is designed to address.

The purpose of this analysis is not attribution or criticism. It is architectural.

The incidents referenced here are publicly documented. Case details are intentionally abstracted to focus on structural patterns rather than individual entities.

-----

## 1. Scope of This Document

This analysis identifies recurring architectural absences in deployed AI and agent-based systems:

- No pre-execution declaration of scope
- No explicit negative boundary definition
- No formal stopping authority
- No declared audit surface
- No bounded autonomy declaration

Agent Manifest introduces a structured declaration layer intended to address these absences before interaction or execution occurs.

-----

## 2. Methodology

Each case type below follows a consistent analytical structure:

1. Description of the structural failure pattern
1. Identification of the missing governance layer
1. Relevant Agent Manifest fields
1. Explanation of how declaration would mitigate risk

This document does not claim that Agent Manifest retroactively solves past incidents. It demonstrates how a declaration layer would structurally reduce ambiguity and uncontrolled execution risk.

-----

## 3. Case Type A — Unbounded Operational Execution

### Pattern

An autonomous or semi-autonomous system executed an operational action beyond expected scope (e.g., deletion, modification, or external transaction).

### Missing Governance Layer

- No explicit forbidden action declaration
- No bounded autonomy level declared
- No formal stopping authority

### Relevant Agent Manifest Fields

- `forbidden_actions`
- `autonomy.level`
- `stopping_authority`

### Architectural Mitigation

A manifest declaring explicit negative boundaries and a defined autonomy level constrains system posture prior to execution.

If an operational agent declares:

```json
"autonomy": { "level": 1 },
"forbidden_actions": ["modify_production_systems"]
```

then execution beyond that scope becomes declaratively non-compliant.

The declaration layer does not replace runtime controls. It makes the intended boundary explicit and auditable.

-----

## 4. Case Type B — Unauthorized Policy Commitment

### Pattern

A conversational or advisory system communicated commitments or authoritative statements beyond its mandate.

### Missing Governance Layer

- No declared advisory vs. execution boundary
- No explicit epistemic constraint
- No declared risk posture

### Relevant Agent Manifest Fields

- `purpose.primary_code`
- `forbidden_actions`
- `risk_profile.level`

### Architectural Mitigation

A manifest requiring explicit declaration of scope prevents ambiguity between:

- advisory posture
- authoritative commitment
- operational execution

For example:

```json
"forbidden_actions": [
  "issue_binding_commitments",
  "provide_authoritative_legal_advice"
]
```

The absence of such declarations increases interpretive risk.

-----

## 5. Case Type C — Data Mismanagement or Over-Retention

### Pattern

An AI system retained personal or sensitive data beyond user expectations or operational necessity.

### Missing Governance Layer

- No declared data retention policy
- No explicit storage posture
- No bounded lifecycle declaration

### Relevant Agent Manifest Fields

- `data_handling.stores_personal_data`
- `data_handling.retention`
- `audit_surface`

### Architectural Mitigation

Agent Manifest requires explicit declaration of whether personal data is stored and under what retention policy.

Example:

```json
"data_handling": {
  "stores_personal_data": true,
  "retention": "temporary_session_only"
}
```

This shifts data lifecycle from implicit to declared.

-----

## 6. Case Type D — No Stopping Authority

### Pattern

An agent system continued execution without a clear mechanism for intervention or shutdown.

### Missing Governance Layer

- No declared stopping authority
- No identified accountable role
- No defined interruption mechanism

### Relevant Agent Manifest Fields

- `stopping_authority.stoppable_by`
- `stopping_authority.mechanism`

### Architectural Mitigation

By requiring declaration of who can stop the system and how, Agent Manifest formalizes an interruption layer prior to runtime.

Example:

```json
"stopping_authority": {
  "stoppable_by": ["system_administrator"],
  "mechanism": "admin_kill_switch"
}
```

Stopping authority becomes part of the declared system contract.

-----

## 7. Pattern Convergence

Across documented incidents, recurring absences appear:

- No pre-execution declaration layer
- No explicit negative constraints
- No autonomy level formalization
- No structured audit surface
- No declared stopping authority

These patterns are architectural, not incidental.

Agent Manifest does not guarantee prevention. It introduces structured declaration as a governance primitive.

-----

## 8. Why This Matters

Autonomous systems increasingly operate in:

- financial domains
- healthcare environments
- enterprise infrastructure
- policy and advisory contexts

In these domains, ambiguity scales risk.

Agent Manifest operates at the Declaration Layer.

It does not enforce runtime behavior. It formalizes declared scope, boundaries, accountability, and interruption capacity before interaction.

This reduces ambiguity at system design time.

-----

## 9. References

This analysis draws from publicly documented incidents reported in:

- Legal proceedings and regulatory filings
- Published incident post-mortems
- Technical security disclosures
- Industry analysis and journalism

Specific case details are intentionally abstracted to focus on structural patterns rather than individual attribution.

For validation of the analytical framework, see:

- [`../spec/spec.md`](../spec/spec.md)
- [`../spec/manifest.schema.json`](../spec/manifest.schema.json)
- [`../examples/`](../examples/)