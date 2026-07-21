---
title: Command-line interface (CLI)
description: "The Agent Manifest CLI: the command-line validator for v1.0 declarations. Package @agent-manifest/cli, command agent-manifest — install, commands, exit codes, machine-readable output and limits."
permalink: /docs/cli/
---

# Command-line interface (CLI)

The Agent Manifest command-line interface (CLI) is the command-line validator for
Agent Manifest v1.0 declarations. It is distributed as the npm package
`@agent-manifest/cli` and installs the command `agent-manifest`.

`agent-manifest` reads a manifest document and checks it against the Agent
Manifest v1.0 JSON Schema. It validates structure only.

This page is the canonical documentation for the CLI. The repository and the npm
package page are the source and the distribution point; what they publish is
described here.

## Status

| | |
| --- | --- |
| Name | Agent Manifest command-line interface (CLI) |
| Package | [`@agent-manifest/cli`](https://www.npmjs.com/package/@agent-manifest/cli) |
| Command | `agent-manifest` |
| Version | [0.1.0](https://github.com/agent-manifest/agent-manifest-cli/releases/tag/v0.1.0), published 2026-07-21 |
| Source | <https://github.com/agent-manifest/agent-manifest-cli> |
| Licence | Apache-2.0 |
| Node.js | 20 or later |

## What it does not do

It does not score, rank, certify, or attest. It does not enforce anything at
runtime. It does not write files. A manifest that validates is a well-formed
declaration, not evidence that the declaring agent behaves as declared.

## Install

    npm install -g @agent-manifest/cli
    npx @agent-manifest/cli validate ./manifest.json

The unscoped npm package `agent-manifest` and the `@agentmanifest/*` scope are
unrelated third-party projects.

## Commands

    agent-manifest validate <file|url|-> [--schema <path-or-url>] [--json] [--no-color]

`validate` is the only command.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Manifest is valid. |
| 1 | Manifest was read and parsed but failed schema validation. |
| 2 | Validation did not complete: I/O, parse, schema-load or usage error. |

## Machine-readable output

    {"valid":true,"schema_version":"1.0","errors":[]}

`valid` is `true`, `false` or `null`, matching exit codes 0, 1 and 2.

## Relationship to the specification

The CLI ships a byte-for-byte copy of
[`spec/v1.0/schema.json`](/spec/v1.0/schema.json) and never fetches it at run
time. The copy's sha-256 is recorded in the repository and checked on every
build. The CLI consumes the specification; it does not define it.

## Release 0.1.0

| | |
| --- | --- |
| Tarball sha-256 | `7f9fa8fbdb6a18fd71aa7dc5b151fb6a8f51a3cf905f29d81ac70122e2253221` |
| Vendored schema sha-256 | `c1e3caaf9543f2a5d610ccdfaf36329562fe03b6db00c4ea30b7ef0b7b8ef70a` |

0.1.0 was published without npm provenance attestation: it was released before
the automated publishing workflow was in use. The two checksums above are the
means of verification for this version.

## Limits

Node.js 20 or later. Input is read as UTF-8. Network reads happen only for a
reference given as a URL, and are bounded. No telemetry, no install-time script,
no auto-update.

## Reporting

Issues: <https://github.com/agent-manifest/agent-manifest-cli/issues>.

Vulnerabilities: use GitHub Private Vulnerability Reporting on
[`agent-manifest-cli`](https://github.com/agent-manifest/agent-manifest-cli/security/advisories/new),
or, without a GitHub account, the route described in the
[security policy](/SECURITY.html). Anything else: the
[contact path](/contact/).
