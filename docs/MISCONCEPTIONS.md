---
title: Common Misconceptions
description: Clarifications of recurring misunderstandings about Agent Manifest scope and intent.
---

# Common Misconceptions

Applies to Agent Manifest v1.x canonical specification.

This document addresses recurring misunderstandings about Agent Manifest.

It clarifies scope, positioning, and architectural intent.

---

## 1. "Agents can lie"

Yes.

Agent Manifest does not prevent deception.

It standardizes how commitments are declared.

If an agent violates its own manifest:
- The contradiction becomes detectable.
- Provided that an external validator or enforcement layer evaluates the manifest against observed behavior.
- The deviation becomes auditable.
- Accountability becomes attributable.

Without declaration, contradiction cannot exist formally.

Agent Manifest does not eliminate dishonesty.
It makes dishonesty structurally visible.

---

## 2. "It’s just documentation"

No.

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

Power lies in structured commitment,
not in runtime control.

---

## 6. "It only describes static structure"

Correct — and deliberate.

Agent Manifest is static by design.

It declares commitments, boundaries, identity, and accountability.

It does not model behavior: reasoning patterns, orchestration flows, message exchange, or runtime dynamics.

> Agent Manifest models commitments, not behavior.

Behavior, enforcement, and observability belong to external layers.

Specification-driven runtime and validation frameworks — such as MAS-Lab (arXiv:2606.30546) — operate at those layers.

They are complementary, not competing.

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
