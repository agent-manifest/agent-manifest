A minimal, shared declaration surface for autonomous and semi-autonomous agents.

# Agent Manifest

Agent Manifest is a minimal, execution-agnostic, declarative specification.

It allows AI agents to publicly declare identity, purpose, constraints, autonomy, risk boundaries, and data handling **before interaction**.

This repository does not define behavior.  
It defines **boundaries**.

Agent Manifest does not execute, validate, score, enforce, or decide.
## Stability

The constitutional core of Agent Manifest v1.x is defined in `CORE_PRINCIPLES.md`.

Core principles may only change under a major version. Minor versions may refine definitions without altering core guarantees.
---

## Start here

If you are new to Agent Manifest, read in this order:

1. `WHY_THIS_EXISTS.md` — foundational intent and motivation  
2. `WHAT_THIS_IS.md` — scope and boundary clarification  
3. `/spec` — optional structural reference  
4. `/examples` — illustrative, non-normative examples  

Nothing here is required.  
Nothing here is enforced.

---

## Why this exists

Before agents act, interact, or scale, there must be a way to state:

- who the agent is  
- what it is meant to do  
- what it will not do  
- where its autonomy ends  
- how it handles data  
- which risks it refuses to take  

Agent Manifest exists to make those declarations explicit.

It is not a control layer.  
It is not an enforcement mechanism.  
It is a declaration of intent and limits.

---

## What this is

Agent Manifest is a declarative document that can be published alongside an agent.

It is designed to be readable by humans and interpretable by systems, without requiring execution.

It describes:

- agent identity  
- declared purpose  
- non-goals  
- autonomy boundaries  
- risk posture  
- data handling intent  

It exists **before** runtime, interaction, or deployment.

---

## What this is not

Agent Manifest is not:

- a technical specification  
- an implementation guide  
- a protocol  
- a business proposal  
- a marketing document  
- a compliance framework  

Any implementation inspired by this repository is intentionally out of scope.

---

## How to use this

You may:

- read it  
- reference it  
- disagree with it  
- extend it  
- fork it  
- ignore it  

You do not need permission.

If this document influences how you design, govern, or reason about agents, that influence is voluntary.

---

## Structure

This repository is intentionally small.

It includes:

- foundational declarations (`WHY_THIS_EXISTS.md`)  
- scope clarification (`WHAT_THIS_IS.md`)  
- an optional spec reference (`/spec`)  
- illustrative examples (`/examples`)  

Nothing here is required.  
Nothing here is enforced.

---

## Final note

This repository does not aim to be finished.

It aims to be **foundational**.