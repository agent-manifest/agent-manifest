# Agent Manifest

A minimal specification that requires autonomous systems to declare operational boundaries before execution.

It standardizes how AI agents declare identity, constraints, autonomy level, risk posture, and data handling prior to interacting with external systems.

This repository defines a declaration layer only.

It does not define behavior. It defines boundaries.

Agent Manifest does not execute, validate, score, enforce, or decide.

-----

## 5-Minute Integration

You can integrate Agent Manifest in under five minutes.

### 1. Create `manifest.json`

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
    "description": "Provides bounded assistance without irreversible execution."
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
    "stoppable_by": [
      "owner"
    ],
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
Full structural reference: [`spec/v1.0/spec.md`](/spec/v1.0/spec.html)

For additional examples see:  
[`examples/`](/examples/)

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

## What Agent Manifest is

Agent Manifest is a declarative surface that may include:

- Agent identity
- Operational domain
- Autonomy level
- Tool access scope
- Data handling guarantees
- Risk boundaries
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

## Stability

The normative specification contract is defined in:

- [`spec/v1.0/spec.md`](./spec/v1.0/spec.md)
- [`spec/v1.0/schema.json`](./spec/v1.0/schema.json)

The constitutional core is defined in:

- [`CORE_PRINCIPLES.md`](./CORE_PRINCIPLES.md)

See: [`STABILITY.md`](./STABILITY.md) and [`VERSIONING_POLICY.md`](./VERSIONING_POLICY.md)

-----

## Start here

If you are new to Agent Manifest, read in this order:

1. [WHY_THIS_EXISTS.md](./WHY_THIS_EXISTS.md)
1. [WHAT_THIS_IS.md](./WHAT_THIS_IS.md)
1. [CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md)
1. [`spec/v1.0/`](/spec/v1.0/)
1. [`examples/`](/examples/)

-----

## Design Rationale

The structural reasoning behind the specification is documented in:

[DESIGN_RATIONALE.md](./DESIGN_RATIONALE.md)

This document explains the architectural decisions, boundary-first philosophy, autonomy model, and execution-agnostic design principles that shape Agent Manifest.

-----

## Security & Governance Context

Agent Manifest may be referenced during security and governance review of autonomous systems.

For structured review guidance, see:

[SECURITY_REVIEW_CONTEXT.md](./SECURITY_REVIEW_CONTEXT.md)

-----

## Design Philosophy

Agent Manifest is built around three structural ideas:

1. Declaration before execution
1. Boundaries over capabilities
1. Separation between declaration and validation

The specification is designed to evolve alongside AI systems without becoming dependent on any specific model, vendor, or orchestration framework.

It is compatible with:

- RAG agents
- Tool-calling agents
- Multi-agent systems
- Data agents
- Orchestrated workflows
- Future autonomous architectures

-----

## Foundations

Agent Manifest is supported by a set of structural and doctrinal documents that clarify its governance philosophy and evaluation posture.

These documents are non-normative and do not modify the schema contract.

- **Pre-Execution Authority**  
  Authority must be declared before autonomy or execution.  
  [`foundations/pre-execution-authority/`](./foundations/pre-execution-authority/)
- **Incident Analysis — Architectural Gap Patterns**  
  Recurring structural governance absences mapped to the declaration layer.  
  [`foundations/INCIDENT_ANALYSIS.md`](./foundations/INCIDENT_ANALYSIS.md)
- **Declarative Integrity Framework (DIF)**  
  A structural evaluation lens for assessing manifest coherence and completeness.  
  [`foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md`](./foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md)

-----

## Core Design Principle

> Agent Manifest does not grow by accumulation.  
> It grows by refinement.

This project optimizes for:

- Minimal surface area
- Maximum clarity
- Structural integrity before ecosystem scale

See: [ROADMAP.md](./ROADMAP.md)

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
- Risk posture
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

Without structured declaration, validation is impossible.  
Without validation, accountability collapses.  
Without accountability, autonomy becomes opaque.

-----

## Governance

This repository defines the open specification.

Interpretations, validators, scoring engines, and audit systems may be built independently and are not part of this core specification.

Proposals for modification must preserve the core principles defined in  
[CORE_PRINCIPLES.md](./CORE_PRINCIPLES.md).

-----

## Enforcement Positioning

Agent Manifest defines declarations only.

Enforcement systems may validate:

- Internal consistency
- Boundary coherence
- Policy compliance
- Risk alignment

The specification itself performs no validation.

For common misunderstandings, see:  
[MISCONCEPTIONS.md](./MISCONCEPTIONS.md)

-----

## Examples

Illustrative, non-normative manifests can be found in the  
[`examples/`](/examples/) directory.

-----

## Versioning

Agent Manifest follows semantic versioning:

- MAJOR: structural or constitutional changes
- MINOR: clarifications and compatible refinements
- PATCH: editorial or formatting updates

Documentation and examples may evolve while `manifest_version` remains `1.0` until a formal spec bump is declared.

-----

## Long-term Intent

Agent Manifest proposes a structural layer for autonomous systems:

Agents should be able to declare who they are, what they can do, and where their boundaries lie before interaction begins.

This specification remains neutral, minimal, and open.

Its value emerges through adoption.

-----

## Foundational Doctrine

Agent Manifest is grounded in the principle of Pre-Execution Authority.

Before autonomy, execution, or capability, an agent must declare the authority framework under which it operates.

See:  
[Pre-Execution Authority](./foundations/pre-execution-authority/README.md)
