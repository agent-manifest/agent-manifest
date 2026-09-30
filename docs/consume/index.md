---
title: Consuming a manifest
description: "The path from not knowing what Agent Manifest is to a piece of software that changes one decision because it read a declaration: install the reading client, resolve a published manifest, and branch on a declared field. Four minimal worked examples."
permalink: /docs/consume/
---

# Consuming a manifest

This page is for someone building software that could read an Agent Manifest.
It goes from not knowing what this is to **one decision in your program taking a
different branch because a declaration said so** — nothing further.

It asks you to publish nothing, adopt no tooling of ours beyond a reading
library, and copy no schema.

## What a manifest is

An Agent Manifest is a JSON document in which the operator of an autonomous
system declares, before any interaction, what that system is for, what it will
not do, how much autonomy it has, who can stop it and what it records. The
normative definition is the
[specification](../../spec/v1.0/agent_manifest_v1.0.html) and its
[JSON Schema](../../spec/v1.0/schema.json).

It is a **declaration**, not a credential. It is not signed and proves nothing
about who issued it. That single fact decides how it can be used, and the last
section of this page says how.

## Install the reading client

```sh
npm install @agent-manifest/client
```

Node.js 22.12 or later. The package reads, canonicalises, fingerprints, compares
and structurally validates declarations. It ships no thresholds, no profiles and
no recommended lists, and it emits no verdict about trust, safety or compliance.

## Read one

Resolving by name takes two calls: a registry has to be discovered before a name
can be looked up in it.

```js
import { discoverRegistry, resolve } from '@agent-manifest/client/net';

const registry = await discoverRegistry('agent-manifest-spec.org');
const result = await resolve('the-diplomat', { registryUrl: registry.registryUrl });
const manifest = result.resolutions[0].document;

console.log(manifest.autonomy.level, manifest.forbidden_actions);
```

A URL resolves in one call. Passing a bare name with no registry returns a
result whose `absence.reason` is `no-registry-declared` — the client reports
what it could not conclude instead of guessing.

That reporting is why `resolutions` can be empty, and the line above takes
`resolutions[0]` without checking. A name the registry does not list resolves to
nothing, `absence.reason` is `not-in-registry-index`, and `resolutions[0]` is
`undefined`. Check the length, or read `absence`, before reaching for a
document: absence is an answer here, not an error.

## Read one from disk

```js
import { readFileSync } from 'node:fs';
import { parse } from '@agent-manifest/client';
import { validate } from '@agent-manifest/client/validate';

const { document } = parse(readFileSync('manifest.json', 'utf8'));
const { schemaValid, errors } = validate(document);
```

`parse()` returns `{ document, form }`, not the document. `form` records whether
it was read from text or from an already-parsed value. Passing the wrapper
straight into `validate()` reports every required field as missing, which looks
like a broken manifest and is not one — destructure it.

## Change one decision

Four worked examples, one file each, in the client repository:
[`examples/`](https://github.com/agent-manifest/agent-manifest-client/tree/main/examples).

| Example | The decision, which you are already making today | Field | A | B |
|---|---|---|---|---|
| CI gate | a run passes or fails | `autonomy.level` | `exit 0` | `exit 1` |
| Gateway | a call is forwarded or refused | `forbidden_actions` | `403`, upstream never touched | `200`, upstream reached |
| MCP server | which tools are advertised and which run | `forbidden_actions` | 1 advertised, call refused | 2 advertised, call runs |
| Runtime | which isolation a job is launched under | `risk_profile.level` | disk read allowed | `ERR_ACCESS_DENIED` |

Each one runs two inputs through the same code and produces two observable
behaviours. That pair is the whole point: reading a manifest and printing it is
not consuming it.

The MCP example is an explicit derivation of the gateway one rather than a case
of its own, and says so in the file. The case that would be native to an MCP
server — using a manifest to establish who is calling — is precisely the one a
manifest cannot support.

## The policy is yours

In all four examples the threshold sits in the example, marked to be edited.
Nothing in the package decides what an acceptable `autonomy.level` is, and
nothing will. The declaration layer stops at the declaration; the policy seat is
left deliberately empty because it belongs to whoever is running the software.

The mapping between an action your software knows about and a string a manifest
declares is part of that policy too: v1.0 defines neither a vocabulary nor a
matching rule. See [Known limits of v1.0](../../STABILITY.md#known-limits-of-v10).

## Keep the trust questions separate

A manifest answers one question: **what was declared?** It does not, by itself,
answer who issued the declaration, whether its claims are true, what a consumer
should allow, how a decision is enforced, or what happened at runtime.

| Question | Concern | Supplied by |
|---|---|---|
| What was declared? | declaration | Agent Manifest |
| Who issued it, and was it altered? | provenance / integrity | an external authenticated channel, signature, attestation, or other trust mechanism |
| What should this consumer allow? | policy | the consumer |
| How is that decision applied? | enforcement | a gateway, runtime, policy enforcement point, or equivalent |
| What actually happened? | runtime evidence | logs, traces, receipts, attestation, audit systems, or other evidence |

Agent Manifest mandates none of the external mechanisms in that table. Keeping
these questions separate prevents a structurally valid declaration from being
mistaken for authenticated identity, proof of truthfulness, or runtime evidence.

## Restrict, do not grant

Use what is declared **to narrow authority that was established independently**:
refuse a run, block a call, narrow a tool list, or add confinement.

Conceptually, safe composition is:

```text
effective authority = independently established authority ∩ manifest-derived restrictions
```

The intersection is a model, not syntax defined by v1.0. The important property
is directional: a manifest-derived rule may remove something from the
consumer's existing baseline, but it must never add a privilege, establish who a
caller is, or relax a control that came from an independent source.

A false or incomplete declaration can still evade a restriction that exists
*only because the consumer chose to derive that restriction from the
declaration*. An unsigned manifest is therefore not a security boundary. If a
favourable decision depends on who made a claim or whether the claim is true,
establish that provenance or evidence separately.

This is why nothing here authenticates an agent, treats a manifest as a
credential, applies enforcement on anyone's behalf, or issues badges, seals or
certifications.

## What is not being asked of you

Publishing your own manifest, adopting the CLI, the registration flow or any
other tool of ours, copying the schema into your repository, or mentioning this
project anywhere.
