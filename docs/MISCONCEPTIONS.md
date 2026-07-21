---
title: Common misconceptions
description: Clarifications of recurring misunderstandings about the scope, positioning, and architectural intent of Agent Manifest v1.0.
---

# Common misconceptions

Applies to Agent Manifest v1.0.

This document addresses recurring misunderstandings about Agent Manifest.

It clarifies scope, positioning, and architectural intent.

---

## 1. "Agents can lie"

An agent can state commitments it does not honor in execution.

Agent Manifest does not prevent deception.

It standardizes how commitments are declared.

If an agent violates its own manifest:
- The contradiction becomes detectable.
- Provided that an external validator or enforcement layer evaluates the manifest against observed behavior.
- The deviation becomes auditable.
- Accountability becomes attributable.

Without declaration, contradiction cannot exist formally.

Agent Manifest does not eliminate dishonesty.
A declared commitment can be compared against observed behavior by an external validator. The commitment is structural; it is not a runtime control.

---

## 2. "It’s just documentation"

A manifest and a document describing an agent serve different functions.

Documentation describes behavior.

Agent Manifest declares operational boundaries in a structured,
machine-readable format that can be consumed by:

- Validators
- Policy engines
- Auditors
- Governance systems

It is not prose.
It is a formal declaration layer.

---

## 3. "Autonomy levels are arbitrary"

They are intentionally coarse.

Fine-grained scales create false precision.

The autonomy gradient is designed to:

- Be interpretable across domains
- Map to operational modes
- Avoid artificial numerical complexity

Clarity is prioritized over granularity.

---

## 4. "Execution-agnostic means weak integration"

Execution-agnostic means portability.

Agent Manifest does not bind to:

- A specific runtime
- A specific framework
- A specific vendor

This enables:

- Cross-platform validation
- Independent enforcement layers
- Long-term architectural stability

Execution systems may integrate deeply.
The specification itself remains neutral.

---

## 5. "If it doesn’t enforce, it has no power"

Enforcement without declaration is undefined.

Agent Manifest operates in the declaration layer.

It enables enforcement systems to:

- Detect contradiction
- Verify declared boundaries
- Audit behavioral commitments

---

## 6. "It only describes static structure"

Correct — and deliberate.

Agent Manifest is static by design.

It declares commitments, boundaries, identity, and accountability.

It does not model behavior: reasoning patterns, orchestration flows, message exchange, or runtime dynamics.

Behavior, enforcement, and observability belong to external layers.

> Agent Manifest models commitments, not behavior.

Specification-driven runtime and validation frameworks — such as MAS-Lab ([arXiv:2606.30546](https://arxiv.org/abs/2606.30546)) — operate at those layers.
They are complementary, not competing. See [Agent Manifest and MAS-Lab](./comparison-mas-lab.md).

A declaration must remain static to be readable, portable, and verifiable by third parties before any interaction begins.

---

## Architectural Reminder

Agent Manifest is:

- A declaration layer
- A precondition for verification
- A portable declaration format for agent boundaries

It is not:

- A runtime
- A compliance framework
- A policy engine
- A behavioral controller

The separation is intentional.
