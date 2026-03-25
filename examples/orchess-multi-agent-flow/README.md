# ORCHESS — Multi-Agent Development Flow with Declared Roles

## Context

ORCHESS is a multi-agent orchestration system under active development.

During its construction, the operator (Hernán Capucci) works daily with
multiple AI agents in a structured workflow: one agent builds, another evaluates.

This document captures that workflow as the first documented real-world
adoption case of Agent Manifest v1.0.

## Agent 1: Claude Code — ORCHESS Builder

Role: construction and implementation under operator direction.

Autonomy: Level 2 (scoped — bounded workflows within declared constraints).

Risk posture: moderate.

Full manifest: [claude-orchess-builder.json](claude-orchess-builder.json)

## Agent 2: ChatGPT — ORCHESS Evaluator

Role: architectural review and critical analysis of outputs produced by
other agents.

Autonomy: Level 1 (supervised — operates only under explicit operator instruction).

Risk posture: low.

Full manifest: [gpt-orchess-evaluator.json](gpt-orchess-evaluator.json)

## Why This Matters

These agents operate with different autonomy levels, risk profiles, and
explicitly distinct roles.

They do not share internal state or awareness of each other's declared
boundaries. The operator maintains that coordination layer.

Agent Manifest makes this structure explicit prior to interaction — not as
runtime enforcement, but as a declarative layer.

## What Agent Manifest Clarifies in This Workflow

Without declaration: agents produce outputs in isolation, compared only by result.

With declaration: agents operate with explicit roles, constraints, and
stopping authority — allowing comparison at the level of intention,
scope, and responsibility.

---

*Case documented: March 2026*  
*Agent Manifest v1.0 — DOI: https://doi.org/10.5281/zenodo.18833956*
