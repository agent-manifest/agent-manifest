![Status](https://img.shields.io/badge/status-published-1a1917?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0-1a1917?style=flat-square)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-lightgrey?style=flat-square)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18833956.svg)](https://doi.org/10.5281/zenodo.18833956)

# Agent Manifest

A minimal declaration layer for autonomous AI systems.

**Start here**

- **Specification** — https://agent-manifest-spec.org/spec/v1.0/agent_manifest_v1.0.html
- **Schema** — https://agent-manifest-spec.org/spec/v1.0/schema.json
- **Generator (Ambassador)** — https://agent-manifest.github.io/agent-manifest-ambassador/
- **Registry / Discovery** — https://agent-manifest-spec.org/.well-known/agent-manifest-registry.json

-----

## Canonical Specification (v1.0 — Standards Track)

- **HTML (rendered canonical document):**  
  https://agent-manifest-spec.org/spec/v1.0/agent_manifest_v1.0.html

- **Normative JSON Schema:**  
  https://agent-manifest-spec.org/spec/v1.0/schema.json

- **Markdown rendering (normatively identical):**  
  [`spec/v1.0/spec.md`](./spec/v1.0/spec.md)

-----

## Conceptual Architecture

The Agent Manifest ecosystem forms a layered declarative infrastructure for autonomous systems.

![Agent Manifest Ecosystem Architecture](docs/architecture/agent-manifest-ecosystem.svg)

A minimal specification that requires autonomous systems to declare operational boundaries before execution.

It standardizes how AI agents declare identity, constraints, autonomy level, risk profile, and data handling prior to interacting with external systems.

This repository defines a Declaration Layer only.

It does not define behavior. It defines boundaries.

Agent Manifest does not execute, validate, score, enforce, or decide.

It is static by design: Agent Manifest models commitments, not behavior.  
Runtime behavior, enforcement, and observability belong to external layers.  
See [Common Misconceptions](./docs/MISCONCEPTIONS.md).

-----

## What Agent Manifest is

Agent Manifest is a declarative surface that may include:

- Agent identity  
- Operational domain (Scope)  
- Autonomy level  
- Tool access scope  
- Data handling guarantees  
- Risk profile  
- Human oversight conditions  
- Version commitments  

It is intentionally minimal and does not mandate internal architecture.

-----

## What Agent Manifest is not

Agent Manifest does not:

- Execute agents  
- Enforce compliance  
- Guarantee safety  
- Replace governance frameworks  
- Certify correctness  
- Score risk  
- Monitor behavior  

It defines what an agent *declares* — not what it *does*.

Validation, scoring, auditing, and enforcement belong to separate systems.

-----

## Why Agent Manifest exists

As AI systems become increasingly autonomous, interactions between agents, humans, APIs, and infrastructures require clarity prior to execution.

Most systems describe capabilities.  
Few describe constraints.

Agent Manifest introduces a structural principle:

> Autonomous systems should declare boundaries before action.

This specification provides a public declaration layer — not a runtime, not a framework, not a governance engine.

It is designed to be:

- Minimal  
- Composable  
- Execution-agnostic  
- Forward-compatible  

-----

## 5-Minute Integration

You can integrate Agent Manifest in under five minutes.

### 1. Create `manifest.json`

```json
{
  "$schema": "https://agent-manifest-spec.org/spec/v1.0/schema.json",

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
    "description": "Provides bounded assistance without irreversible execution."
  },

  "forbidden_actions": [
    "execute_irreversible_actions"
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
    "email": "contact@mycompany.com"
  }
}
```

### 2. Validate against the schema

```bash
ajv validate -s spec/v1.0/schema.json -d manifest.json
```

### 3. Commit it to your repository

Done.

Your agent now declares its boundary surface before execution.

-----

## Minimal Example

```json
{
  "$schema": "https://agent-manifest-spec.org/spec/v1.0/schema.json",

  "manifest_version": "1.0",
  "agent_id": "example.minimal.agent",
  "agent_name": "Minimal Example Agent",
  "agent_version": "1.0.0",

  "owner": {
    "type": "individual",
    "identifier": "Example Owner"
  },

  "purpose": {
    "primary_code": "general.assistance",
    "description": "Provides bounded general assistance without executing irreversible actions."
  },

  "forbidden_actions": [
    "execute_financial_transactions",
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
    "mechanism": "Agent can be halted via manual override by the declared owner.",
    "stages": [
      "pre-execution",
      "mid-execution"
    ]
  },

  "audit_surface": {
    "logging": "basic",
    "reconstructability": "partial",
    "opacity_declared": false
  },

  "contact": {
    "email": "contact@example.com"
  }
}
```

This example is non-normative and provided for structural clarity.  
Full structural reference: [`spec/v1.0/spec.md`](./spec/v1.0/spec.md)

For additional examples see:  
[`examples/`](./examples/)

-----

## Architectural Layering

Agent Manifest operates strictly at the Declaration Layer.

It does not execute agents.  
It does not enforce policy.  
It does not perform runtime validation.

Instead, it standardizes how agents declare:

- Identity  
- Purpose  
- Boundaries  
- Autonomy level  
- Risk profile  
- Data handling commitments  

The ecosystem separates into three distinct layers:

### 1. Declaration Layer

Agent Manifest (this repository)  
Defines how boundaries and commitments are declared.

### 2. Enforcement Layer

Validators, policy engines, audit systems, and compliance tooling.  
These systems verify whether declarations are internally consistent and externally respected.

### 3. Execution Layer

Agents and runtimes that perform actions.

Without structured declaration, validation is fragile.  
Without validation, accountability erodes.

-----

## Ecosystem Infrastructure

Agent Manifest defines the declaration layer of a broader open ecosystem.

Operational components such as the generator, dataset repository, registry, and discovery endpoint are documented in:

[docs/ecosystem-map.md](docs/ecosystem-map.md)

These infrastructure components operate independently from the core specification and may evolve without modifying the normative spec.

-----

## Stability and versioning

The normative specification contract is defined in:

- [`spec/v1.0/spec.md`](./spec/v1.0/spec.md)  
- [`spec/v1.0/schema.json`](./spec/v1.0/schema.json)  

The constitutional core is defined in:

- [`CORE_PRINCIPLES.md`](./CORE_PRINCIPLES.md)

See: [`STABILITY.md`](./STABILITY.md) and [`VERSIONING_POLICY.md`](./VERSIONING_POLICY.md)

Agent Manifest follows semantic versioning:

- MAJOR: structural or constitutional changes  
- MINOR: compatible clarifications  
- PATCH: editorial or formatting updates  

Documentation and examples may evolve while `manifest_version` remains `1.0` until a formal spec bump is declared.

-----

## Governance

This repository defines the open specification.

Interpretations, validators, scoring engines, and audit systems may be built independently and are not part of this core specification.

Proposals for modification must preserve the core principles defined in  
[CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md).

-----

## Further reading

The structural reasoning behind the specification — its architectural decisions, boundary-first philosophy, autonomy model, and execution-agnostic design principles — is documented in:

[DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md)

Agent Manifest may also be referenced during security and governance review of autonomous systems. For structured review guidance, see:

[SECURITY_REVIEW_CONTEXT.md](./SECURITY_REVIEW_CONTEXT.md)

For how Agent Manifest composes with adjacent agent protocols, see:

[How Agent Manifest relates to A2A, MCP, and agents.json](./docs/comparison.md)

For how it relates to specification-driven runtime and validation frameworks, see:

[Agent Manifest and MAS-Lab: Declaration Layer vs. Specification-Driven Runtime](./docs/comparison-mas-lab.md)

-----

## Recommended reading order

If you are new to Agent Manifest, read in this order:

1. [WHY_THIS_EXISTS.md](./WHY_THIS_EXISTS.md)  
2. [WHAT_THIS_IS.md](./WHAT_THIS_IS.md)  
3. [CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md)  
4. [`spec/v1.0/`](./spec/v1.0/)  
5. [`examples/`](./examples/)  

-----

## Foundational Doctrine

Agent Manifest is grounded in the principle of Pre-Execution Authority.

Before autonomy, execution, or capability, an agent must declare the authority framework under which it operates.

> No autonomy without authority.

See:  
[Pre-Execution Authority](./foundations/pre-execution-authority/README.md)

-----

## Long-term Intent

Agent Manifest proposes a structural layer for autonomous systems:

Agents should be able to declare who they are, what they can do, and where their boundaries lie before interaction begins.

This specification remains neutral, minimal, and open.

Its value emerges through adoption.

-----

## Empirical Studies

Empirical evidence related to boundary declaration behavior in AI systems:

- **AI Boundary Declaration Study Dataset**  
  https://github.com/agent-manifest/agent-manifest-dataset/tree/main/studies/ai-boundary-declaration-study  

  Companion dataset and analysis for the study:  
  “When AI Systems Don’t Know When to Stop: A Comparative Study of Spontaneous Boundary Declaration and Epistemic Limits in Six Major Models”

  Dataset DOI: https://doi.org/10.5281/zenodo.19235488  
  Paper DOI: https://doi.org/10.5281/zenodo.19235116

-----

## Companion analysis (working paper)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19432968.svg)](https://doi.org/10.5281/zenodo.19432968)

**The Pre-Execution Identity Gap in AI Agents: A Minimal Declarative Layer Proposal**

-----

## Citation

The citable archived version of Agent Manifest v1.0 is available on Zenodo:

Core Declarative Specification (Standard):  
https://doi.org/10.5281/zenodo.18833956  

Companion analysis:  
https://doi.org/10.5281/zenodo.18834845

External works citing Agent Manifest are tracked in [CITATIONS.md](./CITATIONS.md).

-----

## Authorship

Agent Manifest was conceived and authored by  
**Hernán Alfredo Capucci** (2026)

The specification is maintained as an open standard.

---

**Part of the [Agent Manifest](https://agent-manifest-spec.org) ecosystem**

[Spec](https://github.com/agent-manifest/agent-manifest) ·
[Registry](https://github.com/agent-manifest/agent-manifest-registry) ·
[Dataset](https://github.com/agent-manifest/agent-manifest-dataset) ·
[Ambassador](https://github.com/agent-manifest/agent-manifest-ambassador) ·
[Diplomat](https://github.com/agent-manifest/agent-manifest-diplomat) ·
[Boundary Handshake](https://github.com/agent-manifest/boundary-handshake) ·
[∈ Principle](https://github.com/agent-manifest/e-principle)

CC BY 4.0 · Hernán Alfredo Capucci · [ORCID 0009-0008-7216-3032](https://orcid.org/0009-0008-7216-3032)
