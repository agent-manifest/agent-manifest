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

## Architectural Reminder

Agent Manifest is:

- A declaration layer
- A precondition for verification
- A portability standard for agent boundaries

It is not:

- A runtime
- A compliance framework
- A policy engine
- A behavioral controller

The separation is intentional.
