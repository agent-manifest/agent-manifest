---
title: How to register an agent
description: Step-by-step guide for registering an agent with the Agent Manifest infrastructure, from manifest preparation to public discovery.
---

# How to register an agent

This guide explains how to register an agent using the Agent Manifest infrastructure.

The registration process follows this pipeline:

```
Manifest → Submission → Validation → Dataset → Registry → Discovery
```

-----

## 1. Prepare the Agent Manifest

A valid manifest is required before registration.

A manifest declares:

- identity (`agent_id`, `agent_name`)
- owner and accountability (`owner`, `contact`)
- purpose and scope (`purpose`)
- hard constraints (`forbidden_actions`)
- autonomy level (`autonomy.level`)
- risk profile (`risk_profile`)
- data handling (`data_handling`)
- stopping authority (`stopping_authority`)
- audit surface (`audit_surface`)

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

The manifest must follow the JSON schema defined in the Agent Manifest specification:

https://agent-manifest-spec.org/spec/v1.0/schema.json

Full structural reference: [`spec/v1.0/spec.md`](../spec/v1.0/spec.md)

-----

## 2. Generate the Manifest

Use the Agent Manifest Ambassador:

<https://agent-manifest.github.io/agent-manifest-ambassador/>

Steps:

1. Fill in the agent identity and description.
1. Define scope and boundaries.
1. Declare autonomy level.
1. Review the generated JSON.

The Ambassador helps produce a structurally complete manifest. Full conformance with the canonical v1.0 JSON Schema is validated at submission.

-----

## 3. Submit the Manifest

There are two submission paths:

**A. Direct submission (Ambassador).** The Ambassador submits the manifest to the Diplomat API:

```
POST https://agent-manifest-diplomat.vercel.app/api/register
```

The Diplomat validates the manifest against the canonical v1.0 JSON Schema and, if accepted, stores it in the dataset repository.

**B. Manual submission (GitHub Issue).** Alternatively, open an issue containing the manifest JSON in the dataset repository:

<https://github.com/agent-manifest/agent-manifest-dataset>

The issue should contain:

- agent identity
- manifest JSON
- submission metadata

Review the issue and click **Submit new issue**.

-----

## 4. Automated Validation

Direct submissions (path A) are validated by the Diplomat at the API endpoint before storage; no issue is involved.

After a manual issue submission (path B), an automated workflow is triggered.

The workflow:

1. Extracts the manifest JSON from the issue.
1. Validates the structure against the schema.
1. Checks required fields.
1. Prepares the manifest for storage.

If validation fails, the workflow returns an error comment.

-----

## 5. Manifest Storage

If validation succeeds, the manifest is stored in the dataset repository.

Storage structure:

```
manifests/YYYY/MM/agent-name.json
```

Example:

```
manifests/2026/03/example-agent.json
```

This creates a public, version-controlled record of the declaration.

-----

## 6. Registry Update

After storing the manifest, the registry index is updated.

The registry provides a machine-readable list of registered agents.

-----

## 7. Discovery

External systems can discover registered agents using the well-known endpoint:

```
https://agent-manifest-spec.org/.well-known/agent-manifest-registry.json
```

This endpoint exposes the public registry.

-----

## 8. Registration Result

A successful registration produces, by either path:

- a stored manifest document
- a registry entry

A manual submission (path B) additionally produces a closed GitHub issue
documenting the event: the workflow comments on the issue and closes it. A direct
submission (path A) involves no issue, as stated in section 4.

Everything a registration produces is public: the stored manifest, the registry
entry, and — for path B — the issue thread.

-----

## Summary

The registration pipeline has two submission paths.

Path A — direct submission (Ambassador):

```
Manifest generation
↓
Diplomat API (schema validation)
↓
Dataset storage
↓
Registry update
↓
Public discovery
```

Path B — manual submission (GitHub Issue):

```
Manifest generation
↓
GitHub Issue submission
↓
Automated workflow validation
↓
Dataset storage
↓
Registry update
↓
Public discovery
```
