# Examples (non-normative)

This directory contains illustrative Agent Manifest examples.

These examples are **non-normative** and provided for clarity only.
They demonstrate how to declare boundaries and accountability fields **before interaction**.

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

## Files

- `basic.agent.json` — minimal compliant example (low-risk, low autonomy)
- `customer-support-tier1.json` — constrained support agent example
- `research-assistant.json` — research-oriented example with stronger audit posture
- `policy-advisory-agent.json` — policy advisory example (higher oversight expectations)
- `payment-execution-agent.json` — high-risk example (strict boundaries + stoppability + audit)