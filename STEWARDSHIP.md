---
title: Stewardship and continuity
description: Which faculties of the project rest with the steward, which conditions oblige a dated public statement, and what continuation is already possible without anyone's permission.
section: Governance
---

# Stewardship and continuity

This document describes what the steward of Agent Manifest does, and what would
happen if the steward stopped being available.

It restricts the steward. It places no obligation on any reader, asks nothing of
any implementer, and confers no rights on anyone.

As of 1 August 2026 there are no known external dependents of any package or
document in this ecosystem. This document exists so that the first one does not
have to ask.

## 1. Scope

This document covers three things that are not the specification: the packages
published under the project's namespace, the namespaces themselves, and the
continuity of the project.

It does not cover the normative content of the specification, and it does not
change how that content evolves:

- [`GOVERNANCE.md`](./GOVERNANCE.md) states who originated the project, what
  stewardship of the v1.x series means, and how contributions are handled.
- [`VERSIONING_POLICY.md`](./VERSIONING_POLICY.md) and
  [`STABILITY.md`](./STABILITY.md) govern the mechanics of specification change:
  what is frozen, what may evolve, and what requires a version increment.
- This document adds nothing to either, and nothing here should be read as
  modifying them.

Where this document and those documents appear to disagree, they prevail.

## 2. Faculties

"Governance" is not one thing. The faculties below are distinct, they rest with
different artefacts, and a reader evaluating whether to depend on this project
is usually asking about one of them rather than all of them.

| Faculty | What it decides | What carries it today | Independently checkable today |
| --- | --- | --- | --- |
| Operational maintenance | Fixes, CI, dependencies, triage, responses | Nothing stated | No |
| Specification authorship | What enters `spec/vX.Y/`, what is normative | `VERSIONING_POLICY.md`, `STABILITY.md`, `CORE_PRINCIPLES.md` | Partly |
| Package publication | What is published under the namespace, when, containing what | The release workflow described in section 3 | **Yes** |
| Namespace control | The npm scope, the GitHub organization, the domain, the DOIs, the ORCID identity | External registries | Only indirectly |
| Change review | Who may approve a change, and over which paths | Nothing stated | No |
| Continuity | What happens if the steward stops being available | This document | Yes, from section 5 |
| Adding maintainers | Who holds permissions, and which ones | Nothing stated | No |
| Moving the project to another organization | Whether the project is placed with a third party | Nothing stated | No |
| Conditions that change nothing | Which facts leave everything as it is | Section 6 | Yes |

None of these is currently delegated. Every one of them rests with the steward
named in [`GOVERNANCE.md`](./GOVERNANCE.md).

## 3. How packages are published

Publication under the project's npm scope runs through a workflow that a third
party can inspect without taking anyone's word for it. On the date of this
document the mechanism is:

- Publication is dispatched by hand. The workflow cannot be started by a push, a
  tag, a pull request, or a schedule.
- It runs in a repository environment that requires a reviewer before the job
  begins.
- Authentication is OpenID Connect, using npm trusted publishing. There is no npm
  token stored in the repository and none is read by the workflow.
- The dispatch must carry the literal string `publish`. Anything else stops the
  run before checkout.
- The dispatch must carry the sha-256 of the tarball recorded by hand
  beforehand. The workflow builds the tarball, compares the two, and stops on any
  difference rather than publish an artefact nobody looked at.
- The git tag being published must match the version in the package manifest.
- The test suite and a schema-parity check both run before publication.
- The package is published with provenance, attested by npm from the OIDC claim,
  so a reader can trace the published artefact back to the commit it was built
  from.
- After publication the workflow installs the published package from the registry
  and runs it, so a broken release is visible immediately.
- The workflow creates no tags, no releases and no commits.

There is one act that the workflow above cannot cover, and it is a limitation of
the registry rather than a choice. A package that does not yet exist cannot be
configured for trusted publishing: the setting lives on the package's own page,
and that page does not exist until the package does. So the earliest version of
a new package name under this scope is published by hand, once. That act is
called a bootstrap publication and its limits are fixed:

- It happens once per package name, and cannot happen again for that name once
  trusted publishing is configured.
- It exists to reserve the name and to make the trusted publisher configurable.
  It is not an operating release.
- It is published under a dist-tag other than `latest`, so nothing installs it
  by default, and it is deprecated in favour of the release that follows it.
- No credential is created in, or read by, any repository for it.
- Every version meant to be installed and used goes through the workflow
  described above, with provenance.

The registry records who published each version and whether it carries
provenance, so the difference between a bootstrap publication and a release is
visible without asking anyone. A version under this scope offered for use and
lacking provenance would be a departure from what this section describes.

This section is a description of what is in place, not an undertaking that it
will remain unchanged. If it changes, this document changes with it.

## 4. Conditions that oblige a dated statement

Each condition below can be checked by a third party without asking the steward
anything. Each of them obliges one thing only: publishing a dated statement of
what was decided. **None of them obliges any action, and "nothing changes" is
always an admissible answer.**

**A first external runtime dependency.** When a project outside this ecosystem
declares a package published under the project's namespace among its
dependencies — visible in the npm registry and in public code — a support policy
for that package would be published within 90 days: what is maintained, what
counts as a breaking change, and what would happen if it were discontinued. A
policy stating that no support is offered would satisfy this condition.

**Two independent external implementations.** When two implementations that
consume Agent Manifest declarations exist, neither authored nor commissioned by
the steward, a dated assessment would be published on whether to add maintainers
or delegate change review, stating the decision either way. An assessment
concluding that nothing changes would satisfy this condition.

**Continued inactivity.** If no commits, no releases and no public responses
appear in any canonical repository for 180 consecutive days — checkable from the
public git history alone — the continuity statement in section 5 applies. This is
the one condition that requires no act by the steward, because if the steward
were available it would not have been reached.

**An unattended security report.** If a valid security report concerning a
package with external dependents remains unattended past the window stated in
[`SECURITY.md`](./SECURITY.md), an alternative route would be published: a fork
the steward points to, a mirror, or a notice of discontinuation with a
recommendation to migrate. This does not oblige a fix. It obliges not leaving
dependents without information.

**What none of these conditions does.** No condition in this document, and no
fact of any kind, moves control of the npm scope, the GitHub organization, the
domain, the DOIs or the ORCID identity to anyone, and none of them places the
project with any organization. Those two faculties are outside every condition
stated here, permanently and by design.

## 5. Continuity

**Continuing this work already requires no one's permission.** That is true
today, it is the most reassuring thing the project can say, and it has not been
said anywhere until now. The licences in force are:

- the specification and its schema, and the manifest generator: Creative Commons
  Attribution 4.0 International;
- the command-line validator: Apache License 2.0;
- the registration gateway and the registry documentation: MIT;
- the public dataset: CC0 1.0 Universal.

Anyone may read, copy, modify, redistribute and build on that material under
those terms, without asking, without notifying anyone, and without any decision
by the steward.

**What is not inherited.** The npm scope, the GitHub organization, the domain,
the DOIs and the ORCID identity do not pass to anyone through inactivity, and the
steward does not pass them to anyone through the conditions in this document.
Past the threshold they become inactive, not reassigned. The practical
consequence is that those names stay unavailable to anyone else.

This is a protection for whoever depends on the project, not a restriction on
whoever continues it. A namespace that quietly changes hands is a supply-chain
risk: a reader who trusts a name would have no way to notice that the party
behind it is no longer the same. Leaving the name inactive makes the
discontinuity visible rather than silent.

**What a reader may assume past the threshold.** That the v1.0 specification
remains as published and unmaintained; that a fork under another name is the
expected way to continue; and that silence is not an objection to anyone doing
so.

**This version names no one.** Designating a person to be contacted, or
instructing anyone to act, involves another human being who would have to agree
to it. That is a decision of a different kind from the ones in this document, and
it is deliberately left out of this version rather than made by implication.

## 6. Conditions that change nothing

Listing what changes nothing is what keeps the previous sections from being read
as a set of implied conditions. None of the following alters anything stated
here:

- a request to participate, to be added as a maintainer, or to be credited as a
  co-author, which may be declined without reasons being given;
- adoption or mention of Agent Manifest by any company, institution or public
  body, which confers no voice in how the project is run;
- any number of stars, forks, downloads, citations or mentions, whatever the
  figure;
- publication by anyone of an implementation, an extension or a fork, all of
  which are already permitted and none of which obliges anything;
- public criticism, technical disagreement, or pressure from any quarter;
- a proposal to change the specification, however good; the mechanics of
  specification change are in `VERSIONING_POLICY.md` and `STABILITY.md`, and the
  decision remains with the steward;
- funding, sponsorship, or an offer of resources, none of which buys influence
  over the specification;
- interest from any organization in hosting the project, which may be considered
  or declined at the steward's discretion, without an obligation to reply or to
  give reasons;
- the appearance of a comparable specification, or of a body standardising the
  same ground.

## 7. Status of this document

This is a unilateral statement of intent by the steward. It may be withdrawn or
replaced by public notice and a version increment of this document.

It is not a contract. It is not an offer. It creates no rights in any third
party and no obligations that anyone may demand be performed. It does not claim
regulatory standing, certification power, or control over any implementation
built by anyone else.

Version 1.0 — 1 August 2026.
