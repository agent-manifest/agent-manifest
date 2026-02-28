# Agent Manifest v1.0 Specification

**Status:** Stable  
**Released:** February 2026

---

## Normative Documents

- **[Specification](./spec.md)** — Complete specification document  
- **[JSON Schema](./schema.json)** — Machine-readable schema definition  

---

## About v1.0

Agent Manifest v1.0 is the first stable release of the specification.

### Stability Commitment

- The schema will not introduce breaking changes without a major version bump (v2.0).
- All v1.x releases are backward compatible.
- New optional fields may be added in minor releases.

See: [`VERSIONING_POLICY.md`](../../VERSIONING_POLICY.md) for full versioning rules.

---

## Quick Start

```json
{
  "manifest_version": "1.0",
  "agent_id": "my.agent",
  "agent_name": "My Agent",
  "agent_version": "1.0.0",
  "owner": {
    "type": "organization",
    "identifier": "My Company"
  },
  "purpose": {
    "primary_code": "general.assistance",
    "description": "Bounded assistance without irreversible execution"
  },
  "forbidden_actions": [],
  "autonomy": {
    "level": 1
  },
  "risk_profile": {
    "level": "low"
  },
  "data_handling": {
    "stores_personal_data": false
  }
}
