# Agent Manifest Examples (Non-Normative)

This directory contains **illustrative examples** of Agent Manifests across different
autonomy levels, risk profiles, and domains.

These examples are **not normative** and do not change the specification.
They exist to demonstrate correct structure and typical boundary declarations.

---

## Examples

| File | Autonomy | Risk | Domain | Notes |
|------|----------|------|--------|------|
| `basic.agent.json` | 1 | low | general | Minimal assistant with clear forbidden actions |
| `customer-support-tier1.json` | 2 | medium | customer support | Escalation constraints, limited operations |
| `research-assistant.json` | 1 | low/medium | research | Analysis-only posture, no execution |
| `payment-execution-agent.json` | 3 | high | payments | High-risk, scoped autonomy, strict boundaries |
| `policy-advisory-agent.json` | 0 | low | policy | Advisory-only, no execution capability |

---

## Usage Notes

- Replace placeholder identifiers and emails with real values in production.
- Add domain-specific forbidden actions to prevent ambiguity.
- Validators and runtimes may enforce these declarations differently.

---

Agent Manifest operates at the Declaration Layer.
Enforcement and execution remain external to these examples.