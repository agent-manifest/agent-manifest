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

### If you are building...

- A support chatbot → start with [customer-support-tier1.json](./customer-support-tier1.json)
- A financial execution system → see [payment-execution-agent.json](./payment-execution-agent.json)
- A healthcare assistant → review [healthcare-triage-assistant-agent.json](./healthcare-triage-assistant-agent.json)
- A human-in-the-loop workflow → examine [human-approval-gateway-agent.json](./human-approval-gateway-agent.json)
- A monitoring agent → use [monitoring-observer-agent.json](./monitoring-observer-agent.json)
- A social media plugin -> review [hermes-tweet-social-plugin.json](./hermes-tweet-social-plugin.json)
- A data pipeline agent → see [data-processing-agent.json](./data-processing-agent.json)
- A research assistant → review [research-assistant.json](./research-assistant.json)
- A policy advisory system → examine [policy-advisory-agent.json](./policy-advisory-agent.json)
- A minimal structurally complete agent → start with [basic-agent.json](./basic-agent.json)

These examples illustrate how different domains declare authority, autonomy, and risk posture before execution.

---

| File | Autonomy | Risk | Domain |
|------|----------|------|--------|
| `basic-agent.json` | 1 | low | general |
| `research-assistant.json` | 1 | low | research |
| `human-approval-gateway-agent.json` | 1 | low | governance |
| `customer-support-tier1.json` | 2 | medium | support |
| `data-processing-agent.json` | 2 | medium | data |
| `monitoring-observer-agent.json` | 2 | medium | observability |
| `hermes-tweet-social-plugin.json` | 1 | medium | social media |
| `policy-advisory-agent.json` | 1 | medium | policy |
| `healthcare-triage-assistant-agent.json` | 1 | high | healthcare |
| `payment-execution-agent.json` | 3 | high | finance |

---

## Coverage

**Autonomy spectrum:** levels 1, 2, and 3  
**Risk spectrum:** low, medium, and high  
**Domains:** general, research, governance, support, data, observability, social media, policy, healthcare, finance

---

## Files

- `basic-agent.json` — minimal structurally complete example (low-risk, low autonomy)
- `research-assistant.json` — read-only posture, opacity declared
- `human-approval-gateway-agent.json` — human-in-the-loop orchestration
- `customer-support-tier1.json` — session-scoped support agent
- `data-processing-agent.json` — transformation pipeline, bounded retention
- `monitoring-observer-agent.json` — observation-only, no remediation
- `hermes-tweet-social-plugin.json` - social research with human-approved publishing boundaries
- `policy-advisory-agent.json` — advisory posture, epistemic humility
- `healthcare-triage-assistant-agent.json` — high-sensitivity domain, life-safety
- `payment-execution-agent.json` — high-risk financial execution, level 3

---

Agent Manifest operates at the Declaration Layer.  
Enforcement and execution remain external to these examples.
