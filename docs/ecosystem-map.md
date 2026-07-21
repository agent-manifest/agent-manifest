---
title: Ecosystem map
description: Structure of the Agent Manifest ecosystem, the role of each repository, and the two submission paths of the operational pipeline.
---

# Ecosystem map

This document describes the structure of the Agent Manifest ecosystem and the role of each repository.

The system is organized as a declaration layer for AI agent identity.

-----

## Ecosystem Architecture

![Agent Manifest Ecosystem Architecture](architecture/agent-manifest-ecosystem.svg)

-----
## System Overview

The Agent Manifest system follows this operational flow:

```
Manifest Specification
↓
Manifest Generation
↓
Submission
↓
Validation Pipeline
↓
Dataset Storage
↓
Registry Index
↓
Discovery Endpoint
```

-----

## Repositories

The ecosystem is organized as the repositories listed below.

-----

## 1. agent-manifest

Repository: <https://github.com/agent-manifest/agent-manifest>

Role: Hosts the canonical Agent Manifest specification.

Contains:

- specification
- JSON schema
- terminology
- architecture documentation
- examples
- operational documentation

This repository defines the structure of a valid Agent Manifest.

-----

## 2. agent-manifest-ambassador

Repository: <https://github.com/agent-manifest/agent-manifest-ambassador>

Role: Manifest generator.

Ambassador assists users in creating valid Agent Manifest declarations and prepares submissions to the dataset repository.

Capabilities:

- generate manifest JSON
- assist declaration
- prepare GitHub submission

-----

## 3. agent-manifest-diplomat

Repository: <https://github.com/agent-manifest/agent-manifest-diplomat>

Role: Registration gateway.

The Diplomat is the operational API layer between manifest submissions and the dataset repository.

It receives manifest submissions, verifies structural conformance, and writes valid declarations to the dataset.

The Diplomat does not enforce policy, score risk, or determine compliance. It validates structure and records declarations.

-----

## 4. agent-manifest-dataset

Repository: <https://github.com/agent-manifest/agent-manifest-dataset>

Role: Operational dataset and registration pipeline.

Functions:

- receives manifest submissions
- validates manifest structure
- stores manifests
- maintains the public dataset

Manifests are stored using the following structure:

```
manifests/YYYY/MM/agent-name.json
```

-----

## 5. agent-manifest-registry

Repository: <https://github.com/agent-manifest/agent-manifest-registry>

Role: Registry definition and discovery layer.

The registry provides a machine-readable index of registered agents.

The public discovery endpoint is:

```
https://agent-manifest-spec.org/.well-known/agent-manifest-registry.json
```

-----

## 6. agent-manifest-cli

Repository: <https://github.com/agent-manifest/agent-manifest-cli>

Role: The Agent Manifest command-line interface (CLI) — the command-line validator for manifests against the canonical v1.0 JSON Schema. Validation runs against a vendored copy of the schema, so it needs no network to check a local file.

Package: [`@agent-manifest/cli`](https://www.npmjs.com/package/@agent-manifest/cli) · Command: `agent-manifest` · Documentation: [/docs/cli/](./cli/)

-----

## 7. boundary-handshake

Repository: <https://github.com/agent-manifest/boundary-handshake>

Role: Conceptual extension exploring compatibility evaluation between agents prior to interaction.

This repository is experimental and not part of the current operational pipeline.

-----

## Operational Pipeline

The current operational pipeline has two submission paths.

Direct (Ambassador):

```
Ambassador
↓
Diplomat API (schema validation)
↓
Dataset storage
↓
Registry update
↓
Discovery endpoint
```

Manual (GitHub Issue):

```
GitHub Issue submission
↓
Dataset workflow (schema validation)
↓
Dataset storage
↓
Registry update
↓
Discovery endpoint
```

-----

## Operational Components

Operational today:

- agent-manifest
- agent-manifest-ambassador
- agent-manifest-diplomat
- agent-manifest-dataset
- agent-manifest-registry
- agent-manifest-cli

Conceptual / research:

- boundary-handshake

-----

## Purpose of the Ecosystem

The ecosystem provides minimal infrastructure for:

- declarative AI agent identity
- transparent agent declarations
- auditable registration
- discoverable agent manifests

The system follows the principle: declare before interacting.
