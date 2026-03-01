# Security Policy

## Scope

This repository hosts a declarative specification and reference examples for the Agent Manifest.

Although it is not an executable runtime system, security and safety considerations may still arise from:

- Misuse patterns enabled by the specification or its examples  
- Ambiguities that could lead to unsafe, misleading, or irresponsible deployments  
- Vulnerabilities in reference integrations (if provided)  
- Documentation phrasing that could cause harmful misunderstandings  
- Specification design choices that could introduce systemic risk if widely adopted  
- Incorrect assumptions about authority, autonomy, or enforcement derived from this work  

Security concerns may originate not only from code, but from interpretation, implementation context, ecosystem adoption, or structural design decisions.

The scope of this policy includes both technical and structural risk.

---

## Responsible Disclosure

Security and safety-related concerns must be reported **privately**.

Use GitHub’s **Private Vulnerability Reporting** mechanism for this repository  
(Security → Advisories → Report a vulnerability).

Do **not** open a public issue for:

- Exploitable misuse patterns  
- Unsafe “how-to” constructions  
- Privileged configuration exposure  
- Issues involving private data, credentials, or access  
- Structural weaknesses that could be weaponized if prematurely disclosed  
- Systemic risks that may require coordinated mitigation  

Public disclosure before coordinated review may increase harm.

---

## What to Include in a Report

Please provide:

- A clear and precise description of the issue  
- The potential impact and severity  
- Exact location (file path / section / example)  
- A minimal reproduction scenario or theoretical failure model  
- Any proposed mitigation strategy (if available)  
- Whether the issue is technical, structural, semantic, or systemic  

Reports that are specific and reproducible allow faster evaluation and resolution.

---

## Evaluation Criteria

Reports will be assessed based on:

- Severity of potential impact  
- Likelihood of misuse  
- Clarity of specification language  
- Structural implications  
- Risk of cascading effects across implementations  

The Agent Manifest maintainers reserve the right to classify issues as:

- Specification clarification  
- Example correction  
- Normative amendment (minor revision)  
- Architectural reconsideration (major revision)  

---

## Response Expectations

We aim to:

- Acknowledge receipt within **7 days**, whenever reasonably possible  
- Provide an initial assessment within **14 days**, when feasible  
- Coordinate mitigation steps proportionate to impact  
- Publish clarifications, amendments, or structured guidance when appropriate  

Response timelines may vary depending on severity, complexity, and contributor availability.

Critical risks may require silent patching before public communication.

---

## Coordinated Disclosure

Where appropriate, coordinated disclosure may be conducted with:

- Downstream implementers  
- Research institutions  
- Infrastructure operators  
- Security researchers  

The goal is harm minimization, not reputational management.

---

## Limitations of the Specification

Agent Manifest is a declarative specification.

It does not:

- Enforce behavior  
- Monitor runtime execution  
- Prevent misuse  
- Certify safety  
- Guarantee compliance  
- Provide operational security controls  

Security responsibility ultimately resides with implementers, integrators, operators, and governance bodies deploying agent systems.

This repository provides structural guidance — not enforcement mechanisms.

---

## Non-Authority Clause

The maintainers of Agent Manifest do not claim regulatory authority, compliance certification power, or operational control over third-party implementations.

Adoption of this specification does not imply endorsement, certification, or approval by the maintainers.

---

## Good Faith Expectation

Security research conducted in good faith and reported responsibly is welcome.

Abusive, coercive, or exploitative behavior will not be engaged with publicly.

---

Agent Manifest prioritizes structural clarity over reactive expansion.  
Security considerations are treated as architectural responsibilities, not afterthoughts.
