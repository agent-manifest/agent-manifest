---
title: Registration demo
description: Illustrative end-to-end walkthrough of the Agent Manifest registration pipeline, from manifest generation to the discovery endpoint.
---

# Registration demo

This document demonstrates the full operational registration pipeline using the Agent Manifest infrastructure.

The example below is an illustrative registration flow.

-----

## 1. Generate the Manifest

The process begins using the Agent Manifest Ambassador.

<https://agent-manifest.github.io/agent-manifest-ambassador/>

The user provides the required declaration fields and the Ambassador produces a manifest JSON.

Example declaration:

```json
{
  "$schema": "https://agent-manifest-spec.org/spec/v1.0/schema.json",
  "manifest_version": "1.0",
  "agent_id": "agent-manifest-ambassador",
  "agent_name": "Agent Manifest Ambassador",
  "agent_version": "0.1.0",

  "owner": {
    "type": "organization",
    "identifier": "agent-manifest"
  },

  "purpose": {
    "primary_code": "general.assistance",
    "description": "Conversational generator that produces valid Agent Manifest declarations."
  },

  "forbidden_actions": [
    "execute_external_actions",
    "store_user_data_beyond_session"
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
    "email": "contact@agent-manifest-spec.org"
  }
}
```

Full structural reference: [`spec/v1.0/spec.md`](../spec/v1.0/spec.md)

-----

## 2. Create the Submission

After generating the manifest, the Ambassador submits it directly to the Diplomat API:

```
POST https://agent-manifest-diplomat.vercel.app/api/register
```

The Diplomat validates the manifest against the canonical v1.0 JSON Schema and, if accepted, stores it in the dataset repository.

A manifest can also be submitted manually, by opening an issue with the manifest JSON in the dataset repository:

<https://github.com/agent-manifest/agent-manifest-dataset>

-----

## 3. Workflow Execution

Direct API submissions are validated by the Diplomat at the endpoint.

A manual issue submission triggers an automated workflow.

The workflow performs:

1. JSON extraction from the issue
1. schema validation
1. field verification
1. preparation of the dataset entry

If the manifest structure is invalid, the workflow reports an error.

-----

## 4. Manifest Stored in Dataset

If validation succeeds, the manifest is stored in the dataset repository.

Storage path format:

```
manifests/YYYY/MM/agent-name.json
```

Example:

```
manifests/2026/03/agent-manifest-ambassador.json
```

This creates a public, version-controlled record.

-----

## 5. Registry Update

After the manifest is stored, the registry index is updated.

The registry provides a machine-readable list of registered agents.

Each entry references the stored manifest.

-----

## 6. Issue Closed Automatically

If the registration process succeeds:

- the workflow posts a confirmation comment
- the issue is automatically closed

This provides a transparent public trace of the registration.

-----

## 7. Discovery Endpoint

External systems can discover registered agents through the well-known endpoint:

```
https://agent-manifest-spec.org/.well-known/agent-manifest-registry.json
```

This endpoint exposes the registry in machine-readable form.

-----

## Result

The full registration pipeline produces:

```
Manifest JSON
↓
GitHub Issue submission
↓
Automated workflow validation
↓
Manifest stored in dataset
↓
Registry index updated
↓
Discovery endpoint available
```
