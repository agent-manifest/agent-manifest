# Public Comment — NIST NCCoE

## Accelerating the Adoption of Software and AI Agent Identity and Authorization

**Submitted by:** Hernán Alfredo Capucci  
**Date:** March 13, 2026  
**To:** AI-Identity@nist.gov  
**ORCID:** 0009-0008-7216-3032  
**Spec:** https://agent-manifest-spec.org  
**DOI:** https://doi.org/10.5281/zenodo.18833956

-----

## Context

This document was submitted as a formal public comment in response to the NIST NCCoE concept paper:

> *“Accelerating the Adoption of Software and AI Agent Identity and Authorization”*  
> National Cybersecurity Center of Excellence (NCCoE), February 5, 2026  
> Comment period open through April 2, 2026

-----

## Core Argument

Current AI agent identity frameworks — OAuth, OpenID Connect, SPIFFE/SPIRE — address authentication and authorization but do not address **declaration**: the structured, public statement of what an agent is, what it may and may not do, and who is responsible for it.

This is the **Declaration Gap**.

Agent Manifest fills this gap with a minimal pre-execution declaration layer.

-----

## Proposed Architecture (4 layers)

|Layer            |Function                                           |Example                      |
|-----------------|---------------------------------------------------|-----------------------------|
|1. Declaration   |What does the agent declare before acting?         |**Agent Manifest**           |
|2. Authentication|Is the agent who it claims to be at runtime?       |OAuth, OpenID Connect, SPIFFE|
|3. Authorization |Is the agent permitted to perform this action?     |Policy engines, NGAC         |
|4. Audit         |What did the agent do, and can it be reconstructed?|Logging, SIEM                |

Agent Manifest occupies Layer 1 — currently absent from NIST’s proposed stack.

-----

## Key Recommendations to NIST

1. Include a **pre-execution declaration standard** in the demonstration scope.
1. Consider the `/.well-known/agent-manifest` pattern as a low-friction discovery mechanism.
1. Evaluate the **autonomy level field** as a structured mechanism for human-in-the-loop policy.
1. Treat **declaration and authentication as separate concerns**.

-----

## Full Document

The complete submission is available in this directory:

- [Capucci AgentManifest NIST PublicComment 2026.pdf](./Capucci%20AgentManifest%20NIST%20PublicComment%202026.pdf)
  
- [Capucci AgentManifest NIST PublicComment 2026.docx](./Capucci%20AgentManifest%20NIST%20PublicComment%202026.docx)


Also archived on Zenodo:  
DOI: https://doi.org/10.5281/zenodo.18833956

-----

## Status

- [x] Submitted to AI-Identity@nist.gov — March 13, 2026
- [ ] Archived on Zenodo
- [ ] Listed in NIST public comment record

-----

*Agent Manifest — agent-manifest-spec.org — CC BY 4.0*
