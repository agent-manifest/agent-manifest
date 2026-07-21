---
title: Agent Manifest and MAS-Lab
description: Non-normative comparison relating the Agent Manifest declaration layer to the MAS-Lab specification-driven runtime and validation framework.
---

# Agent Manifest and MAS-Lab

This page relates the Agent Manifest declaration layer to the MAS-Lab specification-driven runtime.

Agent Manifest and MAS-Lab are complementary, not equivalent.

Agent Manifest declares external commitments before interaction.
MAS-Lab validates and enforces internal system specifications during execution.

This document is non-normative. It compares the two efforts to clarify layers, not to rank them.

---

## Context

MAS-Lab is a specification-driven validation framework for multi-agent systems, presented in:

> Jordan Augé, Giovanna Carofiglio, Giulio Grassi, Jacques Samain.
> *MAS-Lab: A Specification-Driven Validation Framework for Reliable Multi-Agent Systems.*
> [arXiv:2606.30546](https://arxiv.org/abs/2606.30546) \[cs.MA\], 2026-06-29.

The paper cites *Agent Manifest: Core Declarative Specification v1.0* in its introduction as one of the existing declarative specification formats:

> "Existing formats such as Open Agent Specification and Agent Manifest (Amini et al., 2025; Capucci, 2026; Härer, 2025) address parts of this need but still describe mostly static structure, leaving behavior and dynamics under-specified." (Section 1)

That characterization is accurate — and intentional on Agent Manifest's side. See [Static by design](#static-by-design) below.

**No affiliation.** This document, and the citation above, do not imply any affiliation, endorsement, collaboration, or coauthorship between the authors of MAS-Lab and the author of Agent Manifest, in either direction. MAS-Lab is not an adoption of Agent Manifest. All quotes are taken verbatim from the arXiv paper (v1).

---

## Static by design

Agent Manifest models commitments, not behavior.

A manifest declares identity, ownership, purpose, negative scope, autonomy posture, risk, data handling, stopping authority, and audit surface — before any interaction begins.

It deliberately does not model dynamics: reasoning patterns, orchestration flows, message exchange, or runtime state.

A declaration must remain static to be readable, portable, and verifiable by third parties before execution. Behavior belongs to the layers that execute and validate — which is where MAS-Lab operates.

MAS-Lab describes itself as "a declarative, framework-agnostic agentic specification layer (Spec)" (Abstract) combined with a stateful runtime (MAS-OS) and evaluation overlays (Labs). Its unifying principle — "what is specified can be validated" (Section 4.1) — is applied to the system's internal construction: "Nothing can be executed or evaluated unless it is first declared here." (Section 4.1, on the Spec layer)

Agent Manifest applies the same declaration-first principle at a different boundary: the public boundary between an agent and the parties that interact with it, own it, audit it, or stop it.

---

## How the layers line up

Agent Manifest field names are taken from `spec/v1.0/schema.json`. MAS-Lab descriptions are taken from arXiv:2606.30546v1. "Not modeled" means the concern lives in a different layer, not that the project is deficient.

| Dimension | Agent Manifest v1.0 | MAS-Lab |
| --- | --- | --- |
| **Purpose** | Public pre-interaction declaration of identity, boundaries, and accountability | Specification-driven construction, validation, and evaluation of multi-agent systems |
| **Declared unit** | A single agent (systems compose multiple independent manifests) | A complete MAS (agents, delegation topology, tools) plus per-agent specifications |
| **Audience** | Third parties, counterparties, auditors, owners — before interaction | The system's own developers, operators, and researchers |
| **Layer** | Declaration Layer only | Three layers: Spec, MAS-OS (runtime), Labs (evaluation) |
| **Runtime** | None (out of scope by design) | MAS-OS: contract-based runtime; per-agent kernels composed of finite Mealy machines |
| **Validation** | None in-spec; enables external validators | Central claim: "Validation occurs before execution (structural checks), during execution (contract enforcement), and after execution (trace analysis)." (Section 5.2) |
| **Enforcement** | None (declares only) | At every boundary: "Undeclared tools are rejected, undeclared delegations are blocked" (Section 4.1) |
| **Observability** | Declared only (`audit_surface`: logging, reconstructability, opacity) | Built-in: every boundary crossing produces a trace event; OpenTelemetry export |
| **Reproducibility** | Not applicable (static document) | Design objective: experiments as versioned, resumable, cached artifacts |
| **Multi-agent support** | By composition of independent per-agent manifests | Native: declared delegation edges, topologies, orchestration |
| **Lifecycle** | Pre-execution only | Explicit, from development through validation, testing, and deployment |
| **Registry / discovery** | Published at `.well-known/agent-manifest.json`; ecosystem registry | Not modeled (schema interoperability and discovery delegated to OASF) |
| **Schema / DSL** | JSON manifest + normative JSON Schema | Versioned YAML (`apiVersion: mas/v1`; MAS, Patch, Flavour, Scenario documents) |
| **Audit surface** | Required self-declaration, including admitted opacity | Runtime-generated traces (evidence, not declaration) |
| **Stopping authority** | Required: `stoppable_by` (who), `mechanism` (how), optional `stages` | Execution control primitives (pause, cancel, abort, approval) and circuit breakers; no declared *who* |
| **Accountable party** | Required: `owner` (individual / organization / system) + `contact.email` | Not modeled (traces support responsibility attribution, not ownership) |
| **Relation to MCP / A2A / OASF** | Composes with MCP and A2A as a governance declaration; independent of OASF | Extends OASF for its spec layer; MCP/A2A integration described as "mutual reinforcement rather than competition" (Section 9) |

---

## How they can work together

The two artifacts can describe the same system at different boundaries:

* **Agent Manifest** — the public pre-interaction declaration: what the agent commits to, who answers for it, who can stop it. Published at `.well-known/agent-manifest.json`, readable by any party before interaction.
* **MAS-Lab (or a comparable stack)** — the internal implementation and validation stack: how the system is specified, executed under contracts, observed, and evaluated.

A conceptual mapping from manifest fields to the concerns a MAS-Lab-style stack manages internally:

| Agent Manifest field | Internal counterpart (conceptual) |
| --- | --- |
| `owner`, `contact` | External accountability metadata (no direct MAS-Lab equivalent) |
| `forbidden_actions` | Governance overlay / Patch policies |
| `autonomy.level` | Execution approval mode (e.g. human-approval requirements) |
| `audit_surface` | Observability expectations the runtime should satisfy |
| `stopping_authority` | Halt / abort / escalation policy |
| `data_handling` | Compliance and governance constraints |

This mapping is conceptual, not an integration. No adapter or tooling between the two projects exists today. It illustrates that a public declaration can state externally what a specification-driven runtime enforces internally — and that neither replaces the other.

---

## What Agent Manifest deliberately does not do

* No runtime.
* No enforcement.
* No behavioral model.
* No trace engine.

These are not gaps. They are the boundary of the Declaration Layer. Frameworks like MAS-Lab exist precisely because those concerns require their own layers.

---

## Concerns Agent Manifest declares

At the public boundary, a manifest declares:

* Public accountability: a required `owner`.
* A human contact for escalation (`contact.email`).
* Commitments a third party can read before interaction.
* A published document any counterparty can retrieve.
* Negative scope (`forbidden_actions`) as a required, portable commitment.
* Human stopping authority: a declared *who* with the right to stop the agent.

MAS-Lab validates systems from the inside; these declarations are made at a different boundary, and remain necessary regardless of how well-specified the system's internals are.

---

## Closing

> Agent Manifest models commitments. MAS-Lab can validate implementations.

One is a promise made outward, before execution.
The other is machinery that checks a system against its own specification.

The two operate at different boundaries.

---

## See also

For how Agent Manifest relates to interaction protocols (A2A, MCP, agents.json) and to the declarative specifications MAS-Lab groups it with (OASF, Agent Spec), see [the general comparison](./comparison.md).
