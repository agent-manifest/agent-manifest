# Registration Demo — Agent Manifest

This document demonstrates the full operational registration pipeline using the Agent Manifest infrastructure.

The example below follows a real registration flow.

-----

## 1. Generate the Manifest

The process begins using the Agent Manifest Ambassador.

👉 <https://hernancapucci.github.io/agent-manifest-ambassador/>

The user provides the required declaration fields:

- identity
- purpose
- scope
- capabilities
- autonomy level

Example declaration:

```json
{
  "identity": "agent-manifest-ambassador",
  "purpose": "Conversational generator that produces valid Agent Manifest declarations",
  "scope": {
    "positive": ["manifest generation", "schema validation"],
    "negative": ["no external execution", "no autonomous actions"]
  },
  "capabilities": [
    "generate-manifest",
    "schema-validation",
    "declaration-assistance"
  ],
  "autonomy_level": "supervised"
}
```

The Ambassador generates a valid Agent Manifest JSON.

-----

## 2. Create the Submission

After generating the manifest, the Ambassador opens a pre-filled GitHub Issue in the dataset repository:

👉 <https://github.com/hernancapucci/agent-manifest-dataset>

The issue includes:

- the manifest JSON
- the agent identity
- submission metadata

The user reviews the content and submits the issue.

-----

## 3. Workflow Execution

Submitting the issue triggers an automated workflow.

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

This creates a permanent public declaration record.

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

This demonstrates the operational infrastructure of the Agent Manifest system.
