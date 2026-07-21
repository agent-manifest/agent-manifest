---
title: Well-known endpoint
description: The discovery location at which an agent publishes its manifest, and what a consumer can expect to find there.
section: Discovery
---

# Well-known endpoint

This document defines the discovery location used by Agent Manifest.

The goal is to allow machines to discover the identity and declared boundaries of an AI agent through a predictable endpoint.

---

## 1. Discovery Location

Agents should publish their manifest at the following location:

/.well-known/agent-manifest.json

Example:

https://example.com/.well-known/agent-manifest.json

This endpoint serves as the canonical discovery location for an agent declaration.

### Two different well-known documents

The ecosystem uses two `.well-known` paths. They are unrelated, and a consumer
must not treat one as the other:

| Path | Published by | Contains | Where |
| --- | --- | --- | --- |
| `/.well-known/agent-manifest.json` | **each agent**, on its own host | that agent's manifest, conforming to the v1.0 schema | `https://<the-agent-host>/.well-known/agent-manifest.json` |
| `/.well-known/agent-manifest-registry.json` | **this project**, on this host only | a discovery document pointing to the public registry and the dataset | [`/.well-known/agent-manifest-registry.json`](/.well-known/agent-manifest-registry.json) |

The rest of this page describes the first. The second is the registry discovery
document, which is published and reachable today; it is what the site's status
table means by "Discovery endpoint". Neither one implies that agents are
discovered automatically — see sections 3 and 4.

---

## 2. Manifest Format

The file must contain a valid Agent Manifest JSON document conforming to the Agent Manifest specification.

Normative JSON Schema:

https://agent-manifest-spec.org/spec/v1.0/schema.json

Example:

```json
{
  "$schema": "https://agent-manifest-spec.org/spec/v1.0/schema.json",
  "manifest_version": "1.0",
  "agent_id": "example.agent",
  "agent_name": "Example Agent",
  "agent_version": "1.0.0",

  "owner": {
    "type": "organization",
    "identifier": "Example Organization"
  },

  "purpose": {
    "primary_code": "general.assistance",
    "description": "Provides bounded assistance without irreversible execution."
  },

  "forbidden_actions": [
    "execute_irreversible_actions",
    "access_private_data_without_consent"
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
    "mechanism": "Manual disable via hosting interface."
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

Full structural reference: [`spec/v1.0/spec.md`](./spec/v1.0/spec.md)

---

## 3. Purpose

Publishing a manifest at the well-known endpoint enables:

- discovery by other agents and tooling
- compatibility checks between agents
- registry indexing
- validation tooling — the [command-line interface (CLI)](/docs/cli/), `@agent-manifest/cli`, which validates a manifest against a vendored copy of the canonical v1.0 schema

This is intended to make manifests machine-retrievable; automatic discovery is not yet implemented (see the discovery section below).

---

## 4. Relationship to the Registry

Today, registration is submission-based: manifests reach the registry
through the Ambassador → Diplomat pipeline or the dataset's issue-based
path, and accepted manifests are archived in the public dataset and
indexed in `registry.json`.

The well-known endpoint is what makes automatic discovery possible.
Future registry versions may crawl well-known endpoints to:

- discover manifests automatically
- index them
- archive them in the dataset
- validate them

That auto-discovery layer is future work, not current behavior.

---

## 5. Optional Fields

Future versions may include optional metadata fields such as:

- hosting organization
- contact endpoint
- agent API endpoint
- boundary handshake compatibility

These fields may be added in later specification versions.

---

## 6. Design Principles

The well-known manifest endpoint follows several design principles:

- predictable location
- machine readability
- minimal structure
- compatibility with existing web infrastructure

Manifests published at this location can be retrieved by other agents and tooling.

---

## 7. Status

This document defines the canonical discovery endpoint for Agent Manifest declarations.

Agents that publish a manifest at this location can be retrieved by tooling that expects this path.
