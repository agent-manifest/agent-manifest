# Agent Manifest Well-Known Endpoint

This document defines the standard discovery location for an Agent Manifest.

The goal is to allow machines to discover the identity and capabilities of an AI agent through a predictable endpoint.

---

## 1. Discovery Location

Agents should publish their manifest at the following location:

/.well-known/agent-manifest.json

Example:

https://example.com/.well-known/agent-manifest.json

This endpoint serves as the canonical discovery location for an agent declaration.

---

## 2. Manifest Format

The file must contain a valid Agent Manifest JSON document following the Agent Manifest specification.

Example:

```json
{
  "$schema": "https://agent-manifest-spec.org/schema/v1/manifest.schema.json",
  "specVersion": "1.0.0",
  "identity": "example-agent",
  "purpose": "Provides information retrieval capabilities",
  "capabilities": [
    "search",
    "knowledge-query"
  ],
  "boundaries": [
    "no-autonomous-execution",
    "no-system-modification"
  ],
  "autonomy_level": "supervised",
  "declaration_date": "2026-03-08"
}
```

---

## 3. Purpose

Publishing a manifest at the well-known endpoint allows:

• automatic discovery by other agents  
• compatibility checks between agents  
• registry indexing  
• validator verification  

This makes the Agent Manifest ecosystem machine-discoverable.

---

## 4. Relationship to the Registry

The central registry may discover manifests through the well-known endpoint.

The registry does not require agents to submit manifests manually.

Instead it may:

• discover manifests automatically  
• index them  
• archive them in the dataset  
• validate them using the validator  

---

## 5. Optional Fields

Future versions may include optional metadata fields such as:

• hosting organization  
• contact endpoint  
• agent API endpoint  
• boundary handshake compatibility  

These fields may be added in later specification versions.

---

## 6. Design Principles

The well-known manifest endpoint follows several design principles:

• predictable location  
• machine readability  
• minimal structure  
• compatibility with existing web infrastructure  

This approach allows Agent Manifest to function as an internet-native discovery layer for AI agents.

---

## 7. Status

This document defines the canonical discovery endpoint for Agent Manifest declarations.

Agents that publish a manifest at this location are considered discoverable within the Agent Manifest ecosystem.
