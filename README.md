# Agent Manifest
Agent Manifest is a minimal, execution-agnostic, declarative specification that
allows AI agents to publicly declare identity, purpose, constraints, autonomy, risk
boundaries, and data handling before interaction.
This specification declares agent boundaries. It does not execute, validate, score,
enforce, or decide.
## What it is
Agent Manifest is a declarative document intended to be attached to an AI agent (or
published alongside it) so humans and other systems can understand, before any
execution:
- who the agent is
- what it is designed to do
- what it will not do
- what autonomy and risk boundaries are declared
- how it handles data
## What it is NOT
- Not a runtime or framework
- Not a tool protocol (it does not connect to APIs/tools)
- Not an orchestration layer
- Not a compliance decision-maker
- Not a validator, scorer, or enforcement mechanism
It declares. It does not execute.
## Why it exists
As AI agents become autonomous and multi-vendor, systems need a simple,
auditable way to understand agent boundaries and risk up front. Agent Manifest
provides a neutral declaration layer that can complement any runtime or protocol.
## Quick start
1. Create a manifest JSON document for your agent (see examples).
2. Validate it against the JSON Schema in `spec/manifest.schema.json`.
3. Publish it alongside the agent, repository, or endpoint metadata.
## Specification and Schema
- Specification: `spec/spec.md`
- JSON Schema: `spec/manifest.schema.json`
- Current version: **0.1.0**
## Examples
- Basic agent: `examples/basic.agent.json`
## Governance
Initial author and maintainer: **Hernán Alfredo Capucci**.
Contributions are welcome via issues and pull requests.
## License
Apache-2.0
