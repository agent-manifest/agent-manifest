---
title: Why this exists
description: "The problem the Agent Manifest declaration layer addresses: declared authority before execution."
section: Concept
---

# Why this exists

Agent Manifest addresses a specific problem:

As AI agents become more autonomous, composable, and networked, much of the surrounding tooling describes how they communicate, what they can do, or how the services they call constrain access. Comparatively little lets an agent's deployer declare, before interaction and in a neutral, portable form, **who it is**, **what it intends**, **what it will not do**, and **who is accountable for it**.

The adjacent work this project has examined — set out project by project, with
sources, in [Relation to adjacent specifications](/docs/comparison.html) and
[Agent Manifest and MAS-Lab](/docs/comparison-mas-lab.html) — focuses on:
- execution
- enforcement
- scoring
- policy
- control
- runtime behavior

Agent Manifest intentionally does **none** of those.

## The Gap

Today, agents can act before any clear declaration of:
- identity
- purpose
- declared boundaries
- autonomy level
- risk profile
- data handling assumptions

This creates opacity by default.

Agent Manifest defines a declarative layer that precedes interaction, rather than following execution.

## What This Is

Agent Manifest is:
- open
- minimal
- execution-agnostic
- framework-independent
- protocol-neutral

It is designed to be read by:
- humans
- agents
- systems
- validators
- auditors

Without requiring trust in the runtime.

## What This Is Not

Agent Manifest does **not**:
- execute code
- validate behavior
- enforce rules
- score agents
- grant permissions
- make decisions

Those responsibilities belong elsewhere.

## The Intent

The intent is not control.

The intent is **clarity before action**.

Agent Manifest allows any agent to say, in advance:

> “This is who I am.  
> This is what I am for.  
> These are my limits.”

Nothing more.  
Nothing less.

## Why Now

The need for declarations precedes:
- regulation
- institutions
- enforcement layers

Agent Manifest is intentionally small so it can:
- coexist with future systems
- be embedded anywhere
- remain stable as runtimes evolve

## A Primitive, Not a Platform

Agent Manifest is not a product.

It is a primitive.

A building block that others can adopt, ignore, extend, or reference.

Its value comes from being **simple enough to survive**.

---

## Where to go next

- [What this is](/WHAT_THIS_IS.html) — the scope, and what falls outside it.
- [Specification v1.0](/spec/v1.0/agent_manifest_v1.0.html) — the normative text.
- [JSON Schema](/spec/v1.0/schema.json) — the machine-readable form.
- [Design rationale](/DESIGN_RATIONALE.html) — why each field is defined as it is.
- [Relation to adjacent specifications](/docs/comparison.html) — the comparison, with sources.
- [Examples](/examples/) — manifests covering the declared field surface.
- [Contact](/contact/) — how to reach the maintainer.
