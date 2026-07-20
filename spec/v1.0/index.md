---
title: Agent Manifest v1.0 specification
description: The entry point to the v1.0 normative documents — the specification text, the JSON Schema, the stability commitment, and an example manifest.
---

# Agent Manifest v1.0 specification

**Status:** Stable (published)  
**Released:** February 2026

---

## Normative Documents

- **[Specification](./spec.md)** — Complete specification document  
- **[JSON Schema](./schema.json)** — Machine-readable schema definition  

---

## About v1.0

v1.0 is the current stable version of the specification.

### Stability Commitment

- The schema will not introduce breaking changes without a major version bump (v2.0).
- All v1.x releases are backward compatible.
- New optional fields may be added in minor releases.

See: [`VERSIONING_POLICY.md`](../../VERSIONING_POLICY.md) for full versioning rules.

---

## Example manifest

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
    "description": "Bounded assistance without irreversible execution."
  },
  "forbidden_actions": [
    "no-irreversible-actions",
    "no-financial-transactions"
  ],
  "autonomy": {
    "level": 1
  },
  "risk_profile": {
    "level": "low"
  },
  "data_handling": {
    "stores_personal_data": false
  },
  "stopping_authority": {
    "stoppable_by": ["owner"],
    "mechanism": "Runtime disable via owner-controlled kill switch."
  },
  "audit_surface": {
    "logging": "basic",
    "reconstructability": "partial"
  },
  "contact": {
    "email": "contact@example.com"
  }
}
```

---

## About this record

Hernán Alfredo Capucci  
ORCID 0009-0008-7216-3032  
DOI: https://doi.org/10.5281/zenodo.18833956  
License: CC BY 4.0
