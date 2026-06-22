# How Agent Manifest relates to A2A, MCP, and agents.json

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
