# Examples (non-normative)

This directory contains illustrative Agent Manifest examples.

These examples are **non-normative** and provided for clarity only.
They demonstrate how to declare boundaries and accountability fields 
**before interaction**.

Validation rules are defined by the schema:
- [`spec/manifest.schema.json`](../spec/manifest.schema.json)

---

## Notes

- Examples are designed to be readable first, strict second.
- All examples target `manifest_version: "0.1.0"`.
- Required structural elements include:
  - identity (`agent_id`, `agent_name`, `agent_version`)
  - accountability (`owner`, `contact`)
  - purpose (`purpose.primary_code`, `purpose.description`)
  - hard constraints (`forbidden_actions`)
  - autonomy (`autonomy.level`)
  - risk profile (`risk_profile.level`)
  - stopping authority (`stopping_authority`)
  - audit posture (`audit_surface`)
  - data handling (`data_handling`)

---

## Examples

| File | Autonomy | Risk | Domain |
|------|----------|------|--------|
| `basic-agent.json` | 1 | low | general |
| `research-assistant.json` | 1 | low | research |
| `human-approval-gateway-agent.json` | 1 | low | governance |
| `customer-support-tier1.json` | 2 | medium | support |
| `data-processing-agent.json` | 2 | medium | data |
| `monitoring-observer-agent.json` | 2 | medium | observability |
| `policy-advisory-agent.json` | 1 | medium | policy |
| `healthcare-triage-assistant.json` | 1 | high | healthcare |
| `payment-execution-agent.json` | 3 | high | finance |

---

## Coverage

**Autonomy spectrum:** levels 1, 2, and 3
**Risk spectrum:** low, medium, and high
**Domains:** general, research, governance, support, 
             data, observability, policy, healthcare, finance

---

## Files

- `basic-agent.json` — minimal compliant example (low-risk, low autonomy)
- `research-assistant.json` — read-only posture, opacity declared
- `human-approval-gateway-agent.json` — human-in-the-loop orchestration
- `customer-support-tier1.json` — session-scoped support agent
- `data-processing-agent.json` — transformation pipeline, bounded retention
- `monitoring-observer-agent.json` — observation-only, no remediation
- `policy-advisory-agent.json` — advisory posture, epistemic humility
- `healthcare-triage-assistant.json` — high-sensitivity domain, life-safety
- `payment-execution-agent.json` — high-risk financial execution, level 3

---

Agent Manifest operates at the Declaration Layer.
Enforcement and execution remain external to these examples.
