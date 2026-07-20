---
title: Examples (non-normative)
description: Non-normative Agent Manifest example files covering a range of domains, autonomy levels, and risk postures, validated against the v1.0 schema.
---

# Examples (non-normative)

This directory contains illustrative Agent Manifest examples.

These examples are **non-normative** and provided for clarity only.  
They demonstrate how to declare boundaries and accountability fields  
**before interaction**.

Validation rules are defined by the schema:

- [spec/v1.0/schema.json](../spec/v1.0/schema.json)

---

## Notes

- Examples are designed to be readable first, strict second.
- All examples target `manifest_version: "1.0"`.
- Required structural elements include:
  - identity (`agent_id`, `agent_name`, `agent_version`)
  - accountability (`owner`, `contact`)
  - purpose (`purpose.primary_code`, `purpose.description`)
  - hard constraints (`forbidden_actions`)
  - autonomy (`autonomy.level`)
  - risk profile (`risk_profile.level`)
  - stopping authority (`stopping_authority`)
  - audit surface (`audit_surface`)
  - data handling (`data_handling`)

---

## Examples

### Starting points by domain

- A support chatbot → [customer-support-tier1.json](./customer-support-tier1.json)
- A financial execution system → [payment-execution-agent.json](./payment-execution-agent.json)
- A healthcare assistant → [healthcare-triage-assistant-agent.json](./healthcare-triage-assistant-agent.json)
- A human-in-the-loop workflow → [human-approval-gateway-agent.json](./human-approval-gateway-agent.json)
- A monitoring agent → [monitoring-observer-agent.json](./monitoring-observer-agent.json)
- A social media plugin → [hermes-tweet-social-plugin.json](./hermes-tweet-social-plugin.json)
- A data pipeline agent → [data-processing-agent.json](./data-processing-agent.json)
- A research assistant → [research-assistant.json](./research-assistant.json)
- A policy advisory system → [policy-advisory-agent.json](./policy-advisory-agent.json)

These examples illustrate how different domains declare authority, autonomy, and risk posture before execution. Values in the table below are read from the manifest files themselves.

Note on `basic-agent.json`: despite its filename it is not a minimal, low-risk
example. It declares autonomy level 2, medium risk, and personal-data storage, and
is close to a duplicate of `customer-support-tier1.json`. The filename is recorded
here as a known discrepancy rather than corrected, because the file is a published
example and renaming it would break existing references.

---


| Domain | File | Autonomy | Risk |
|--------|------|----------|------|
| research | [`research-assistant.json`](./research-assistant.json) | 1 | low |
| governance | [`human-approval-gateway-agent.json`](./human-approval-gateway-agent.json) | 1 | low |
| support | [`customer-support-tier1.json`](./customer-support-tier1.json) | 2 | medium |
| support | [`basic-agent.json`](./basic-agent.json) | 2 | medium |
| data | [`data-processing-agent.json`](./data-processing-agent.json) | 1 | medium |
| observability | [`monitoring-observer-agent.json`](./monitoring-observer-agent.json) | 2 | medium |
| social media | [`hermes-tweet-social-plugin.json`](./hermes-tweet-social-plugin.json) | 1 | medium |
| policy | [`policy-advisory-agent.json`](./policy-advisory-agent.json) | 1 | medium |
| healthcare | [`healthcare-triage-assistant-agent.json`](./healthcare-triage-assistant-agent.json) | 1 | high |
| finance | [`payment-execution-agent.json`](./payment-execution-agent.json) | 3 | high |

---

## Coverage

**Autonomy spectrum:** levels 1, 2, and 3  
**Risk spectrum:** low, medium, and high  
**Domains:** research, governance, support, data, observability, social media, policy, healthcare, finance

---

## Files

- `basic-agent.json` — Tier 1 support declaration, session-scoped retention, autonomy level 2
- `research-assistant.json` — read-only posture, opacity declared
- `human-approval-gateway-agent.json` — human-in-the-loop orchestration
- `customer-support-tier1.json` — session-scoped support agent
- `data-processing-agent.json` — transformation pipeline, bounded retention, autonomy level 1
- `monitoring-observer-agent.json` — observation-only, no remediation
- `hermes-tweet-social-plugin.json` — social research with human-approved publishing boundaries
- `policy-advisory-agent.json` — advisory posture, epistemic humility
- `healthcare-triage-assistant-agent.json` — high-sensitivity domain, life-safety
- `payment-execution-agent.json` — high-risk financial execution, level 3

---

Agent Manifest operates at the Declaration Layer.  
Enforcement and execution remain external to these examples.
