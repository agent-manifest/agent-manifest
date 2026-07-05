# How Agent Manifest relates to A2A, MCP, agents.json, OASF, and Agent Spec

Agent Manifest is not a communication protocol and does not compete with one.

* A2A defines how agents communicate with each other.
* MCP defines how agents access tools, resources, and context.
* Agent Manifest defines under what identity, authority, boundaries, risk posture, auditability, and accountability an agent exists — before any interaction or execution begins.

Agent Manifest is a pre-interaction governance declaration layer. It composes with A2A and MCP; it does not replace them.

The specification declares. It does not execute, validate, score, enforce, or decide.

## How the layers line up

The table below places Agent Manifest v1.0 alongside the A2A Agent Card, agents.json, and MCP. The goal is to show where each one focuses, not to rank them. Where a row says "Not modeled," it simply means that concern lives in a different layer — often one of the other artifacts in this table. Agent Manifest field names are taken directly from `spec/v1.0/schema.json`.

| Dimension | Agent Manifest v1.0 | A2A Agent Card | agents.json | MCP |
| --- | --- | --- | --- | --- |
| **Nature** | Declarative governance manifest (static document) | Capability and discovery document for a communication protocol | Description of how an agent can use an API | Communication protocol (client–server) |
| **Layer** | Pre-interaction governance declaration | Agent-to-agent communication and interoperability | Agent-to-API integration | Agent-to-tool / resource / context access |
| **Agent identity** | `agent_id`, `agent_name`, `agent_version`, `manifest_version` | Card identity fields (name, description, version, provider) | Identifies the API/service rather than an agent | Server name and version via the initialize handshake |
| **Responsible party / owner** | `owner.type` (`individual` / `organization` / `system`), `owner.identifier`, plus `contact.email` | Provider / organization information (optional) | API provider information | Not modeled (deployment-dependent) |
| **Purpose / scope** | `purpose.primary_code`, `purpose.description` (positive scope); optional `capabilities` | Described through declared skills | Described through available API actions / flows | Implicit in the exposed tools and resources |
| **Forbidden actions / negative scope** | `forbidden_actions` (explicit hard constraints) | Not modeled | Not modeled | Not modeled |
| **Autonomy level** | `autonomy.level` (integer `0`–`3`) | Not modeled | Not modeled | Not modeled |
| **Risk profile / risk posture** | `risk_profile.level` (`low` / `medium` / `high`), optional `risk_profile.notes` | Not modeled | Not modeled | Not modeled |
| **Stopping authority** | `stopping_authority.stoppable_by`, `stopping_authority.mechanism`, optional `stopping_authority.stages` | Not modeled | Not modeled | Not modeled |
| **Audit surface** | `audit_surface.logging` (`none` / `basic` / `detailed`), `audit_surface.reconstructability` (`none` / `partial` / `full`), optional `audit_surface.opacity_declared` | Not modeled (runtime concern) | Not modeled | Not modeled at the protocol-declaration level |
| **Data handling** | `data_handling.stores_personal_data`, `data_handling.retention` | Not modeled | Not modeled | Not modeled |
| **Transport / endpoints / auth** | Out of scope; the manifest is execution-agnostic and declares no endpoints (`contact.email` is for accountability, not transport) | Defines endpoint URL, supported transports, and authentication schemes | References API endpoints and auth from the underlying API description | Defines transports (e.g. stdio, streamable HTTP) and authentication |
| **Skills / functional capabilities** | Optional `capabilities` (declarative only; must not contradict declared scope or `forbidden_actions`) | Skills with input/output modes — a core element | API actions / flows | Tools, resources, and prompts |
| **Cryptographic verification** | Not defined in v1.0 (out of scope) | Supports optional signatures on the Agent Card | Not defined | Relies on transport / authorization layers; no document-level signature |
| **Enforcement / runtime** | None — the manifest declares only; it does not execute, validate, score, enforce, or decide | Runtime protocol for agent-to-agent tasks and messages | Consumed by agents as API interaction metadata | Runtime protocol for tool/resource access |
| **Discovery** | Published as a static document at `.well-known/agent-manifest.json` | Published at a well-known URI (e.g. `.well-known/agent-card.json`) | Hosted `agents.json` file referencing the API | Host-configured server connections; registries emerging |
| **Governance / project maturity** | v1.0 specification; `spec/v1.0/` frozen | Open specification, actively maintained | Open specification | Open protocol specification |

A2A answers “how do I talk to this agent?”. MCP answers “how does this agent reach its tools?”. agents.json answers “what can this API do for an agent?”. Agent Manifest answers a question none of them ask: “who is accountable for this agent, what must it never do, who can stop it, and how can its actions be reconstructed?” These are complementary layers, not competing ones.

## Composability

Because Agent Manifest declares governance rather than behavior, it sits comfortably next to the documents that describe interaction. An agent can publish both side by side under `.well-known/`:

* `.well-known/agent-card.json` — so other agents can discover it, see its skills, and learn how to communicate with it (A2A).
* `.well-known/agent-manifest.json` — so the same agent declares its identity, owner, purpose, `forbidden_actions`, `autonomy.level`, `risk_profile`, `stopping_authority`, `audit_surface`, and `data_handling` before any interaction begins (Agent Manifest).

For example, a support agent might expose:

```text
https://agent.example.com/.well-known/agent-card.json
https://agent.example.com/.well-known/agent-manifest.json
```

The Agent Card tells a counterparty *how to reach and use* the agent. The Agent Manifest tells the same counterparty — and the agent's own operators, auditors, and accountable owner — *under what declared identity, boundaries, and accountability* it operates. The two documents describe different things about the same agent, and an agent that connects to tools over MCP can carry all three concerns at once: MCP for tool access, the Agent Card for communication, and the Agent Manifest for governance.

Nothing in Agent Manifest requires A2A, MCP, or agents.json, and nothing in those requires Agent Manifest. They are designed to coexist.

## Declarative agent specifications: OASF and Agent Spec

Beyond interaction protocols, two open declarative specifications describe agents as documents: the **Open Agentic Schema Framework** (OASF, an AGNTCY project under the Linux Foundation) and **Open Agent Specification** (Agent Spec, Oracle). Recent academic work treats these as the declarative-specification category (see [Agent Manifest and MAS-Lab](./comparison-mas-lab.md)).

All three are declarative. They declare different things, for different consumers. Different layers, different purposes.

* OASF describes itself as "a standardized schema system for defining and managing AI agent capabilities, interactions, and metadata." Its unit is a *record*: a capability-and-metadata description of one agentic workload, built for discovery through the AGNTCY Agent Directory.
* Agent Spec describes itself as "a declarative language that defines AI agents and agentic workflows in a way that is compatible across frameworks," so an agent can be "defined once and executed across different runtimes." Its unit is a *component tree* — agents, flows, nodes, edges, tools — consumed by runtimes (WayFlow as reference runtime; adapters for LangGraph, AutoGen, CrewAI, and others).
* Agent Manifest declares under what identity, ownership, boundaries, and accountability an agent operates — before any interaction begins.

As before, "Not modeled" means the concern lives in a different layer, not that the project is deficient. Sources are listed at the end of this section; Agent Manifest field names are taken from `spec/v1.0/schema.json`.

| Dimension | Agent Manifest v1.0 | OASF (schema v1.0.0) | Agent Spec (26.1.2) |
| --- | --- | --- | --- |
| **Nature** | Declarative governance manifest (static document) | Capability and metadata record for discovery | Portable, framework-agnostic definition of agents and workflows, meant to be executed |
| **Declared unit** | A single agent | One record per agentic workload | A component tree: `Agent`, `Flow`, `RemoteAgent`, `Swarm`, `ManagerWorkers` |
| **Primary consumer** | Third parties, counterparties, auditors, owners — before interaction | Directories and discovery systems | Runtimes and framework adapters |
| **Core fields / constructs** | `owner`, `purpose`, `forbidden_actions`, `autonomy`, `risk_profile`, `data_handling`, `stopping_authority`, `audit_surface`, `contact` | `name`, `version`, `schema_version`, `description`, `authors`, `created_at`, `skills`; optional `domains`, `locators`, `modules` | `id`/`name`/`description`, `system_prompt`, LLM configs, tools, nodes and control/data-flow edges, `human_in_the_loop` |
| **Relation to runtime** | Execution-agnostic; declares only | Purely descriptive metadata; no execution | Designed for execution by multiple runtimes; the serialized spec itself contains no executable code |
| **Responsible party / accountability** | Required: `owner` (`individual` / `organization` / `system`) + `contact.email` | Required `authors` list (name + optional email); no owner, contact, or accountability fields | Not modeled (generic `id`, `name`, `metadata` only) |
| **Forbidden actions / negative scope** | `forbidden_actions` (required, explicit hard constraints) | Not modeled — skills declare capabilities, not restrictions | Not modeled — allowlist-style controls only (`url_allow_list`, tool filters) |
| **Autonomy level** | `autonomy.level` (integer `0`–`3`) | Not modeled | `human_in_the_loop` (boolean) |
| **Risk / data handling** | `risk_profile` and `data_handling` (both required) | Not modeled | Not modeled (operational auth/TLS configuration only) |
| **Stopping authority** | Required: `stoppable_by` (who), `mechanism` (how), optional `stages` | Not modeled | Tool-level `requires_confirmation` and human-in-the-loop pauses; no declared *who* |
| **Audit surface** | Required self-declaration (`logging`, `reconstructability`, optional `opacity_declared`) | Optional observability module describing how the agent can be observed | Companion Agent Spec Tracing specification (OpenTelemetry-style spans) |
| **Multi-agent support** | By composition of independent per-agent manifests | One record per workload; multi-agent systems referenced via integration modules | First-class: `Swarm`, `ManagerWorkers`, `RemoteAgent`, nesting of flows and agents |
| **Discovery / registry** | Published at `.well-known/agent-manifest.json`; ecosystem registry | AGNTCY Agent Directory: content-addressed records, with signing at the directory layer | None for agents (tool discovery via MCP toolboxes) |
| **Validation / enforcement** | None in-spec; enables external validators | Schema-conformance validation | Input/output and static validation plus a cross-runtime conformance test suite; no runtime guardrails |
| **Maintainer / license** | Open specification, CC BY 4.0 | AGNTCY (a Linux Foundation project), Apache-2.0 | Oracle, Apache-2.0 / UPL 1.0 |

Each answers a different question. OASF answers "what is this agent and what can it do — in a record a directory can index?". Agent Spec answers "how is this agent built, so that any runtime can execute it?". Agent Manifest answers "who is accountable for this agent, what must it never do, who can stop it, and how can its actions be reconstructed?".

None replaces the others. An agent could plausibly carry all three: an OASF record for discovery, an Agent Spec definition for portable execution, and an Agent Manifest for public accountability. Composition among these artifacts is already the norm — OASF itself ships an `agentspec` integration module for embedding Agent Spec definitions in its records.

**Sources** (primary, accessed July 2026): [github.com/agntcy/oasf](https://github.com/agntcy/oasf) and [docs.agntcy.org](https://docs.agntcy.org/oasf/open-agentic-schema-framework/) (OASF); [arXiv:2510.04173](https://arxiv.org/abs/2510.04173) (Amini et al., *Open Agent Specification (Agent Spec) Technical Report*), [github.com/oracle/agent-spec](https://github.com/oracle/agent-spec), and [oracle.github.io/agent-spec](https://oracle.github.io/agent-spec/) (Agent Spec).

## See also

For how Agent Manifest relates to specification-driven runtime and validation frameworks, see [Agent Manifest and MAS-Lab](./comparison-mas-lab.md).
