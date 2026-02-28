# Agent Manifest — Core Principles (v1)

## Status

These principles constitute the **constitutional core** of the Agent Manifest v1.x series, beginning with v1.0.

They are stable and may only be modified under a **major version change** (e.g., v2.0).

Minor versions (v1.1, v1.2, etc.) may clarify definitions, refine language, or introduce optional profiles, but must not alter these core guarantees.

---

## 1. Prior Declaration

No autonomous agent should act without first declaring:

- Identity  
- Responsible Party  
- Scope (Positive Scope and Negative Scope)  
- Capabilities (optional)  
- Risk Profile  
- Stopping Authority  
- Audit Surface  

---

## 2. Identity

Every agent must declare a distinct and persistent Identity sufficient for reference and audit.

---

## 3. Responsible Party

Every agent must declare a Responsible Party capable of answering for and stopping the agent.

Orphaned agents are structurally non-compliant for production deployment.

---

## 4. Scope Boundaries

Every agent must declare:

- What it is intended to do (Positive Scope)  
- What it explicitly will not do (Negative Scope)  

An agent without explicit boundaries is structurally unbounded.

---

## 5. Risk Profile

Every agent must declare a Risk Profile that includes known risks and uncertainty.

Unknown risk must be declared as unknown.

---

## 6. Stopping Authority

Every agent must declare a Stopping Authority specifying:

- Who can stop the agent  
- How the agent can be stopped  
- At what stage stopping may occur  

Agents without Stopping Authority are structurally uncontrollable.

---

## 7. Audit Surface

Every agent must declare its Audit Surface, including what can be:

- Logged  
- Observed  
- Reconstructed after execution  

Opacity must be declared if present.

---

## 8. Denial by Default

If an agent cannot truthfully declare the required structural elements defined above, the default structural position is non-authorization for autonomous operation.

---

These principles define the structural minimum for autonomous systems under Agent Manifest v1.x.
