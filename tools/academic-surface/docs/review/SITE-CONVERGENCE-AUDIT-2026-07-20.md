# Site convergence — editorial change record and audit evidence

**Date:** 2026-07-20
**Branch:** `editorial/site-convergence-v1`
**Base:** `0dcb712`
**Author:** Hernán Alfredo Capucci
**Authority:** Academic Editorial System v2.1 (`../EDITORIAL-SYSTEM-v2.1.md`)

This file is audit evidence, not a publication. It lives under `tools/`, which
`_config.yml` excludes from the Jekyll build, so it never reaches `_site`, the
sitemap, or any public route. It carries no front matter, so it can never become
a page. Both properties are asserted by `test/isolation.test.js`.

It records every editorial change made to public content during the convergence
pass, with the rule that authorised each one, so a reviewer can verify that no
change altered doctrine, project state, or a historical record.

---

## 1 · Scope and guarantees

- **Files deleted: 0.** **Sections deleted: 0.**
- Every content change is a 1:1 replacement (146 lines across 30 files).
- Additions are listed separately in §6.
- Four classes of over-correction were detected during a mid-pass audit and
  reverted; they are recorded in §5 so the reversal itself is auditable.

## 2 · Rule key

| Key | Rule |
|---|---|
| III.1 | Voice and register — third person, descriptive, unhurried |
| III.2.1 | Describe; never persuade |
| III.2.2 | State facts with their exact identifiers |
| III.2.3 | Hedge to the evidence |
| III.2.6 | Never announce novelty ("new", "first", "introducing") |
| III.2.9 | No ornament or persuasion words; no emoji |
| III.3 | Element rules (titles, headings, provenance, drafts, DOI) |
| III.4 | Closed status and class lexicon |
| III.5 | Terminology governance; prohibited framing |
| III.6 | Operational instruction is permitted; persuasion is not |
| II.1 | Colour is a semantic channel; `--ink-faint` is barred from text |
| II.8 | Iconography is near-zero; meaning is carried by words |
| II.11 | Constant orientation — SiteHeader and Breadcrumb on every non-home surface |
| II.14 | Accessibility as institutional ethic |
| II.15 | The boundary rule, exactly once per surface |
| VI.2 | The charter and its machine mirror never diverge |

---

## 3 · Editorial changes to public content

### A · Prohibited framing (III.5)

| File | Before | After |
|---|---|---|
| `PAPERS.md` | "A formalization of **the missing identity layer**, **introducing** a minimal declarative framework" | "Formalizes the pre-execution identity gap and describes a minimal declarative layer" |
| `WELL_KNOWN.md` | "defines **the standard** discovery location" | "defines the discovery location used by Agent Manifest" |
| `WELL_KNOWN.md` | "**internet-native** discovery layer for AI agents" | "Manifests published at this location can be retrieved by other agents and tooling" |
| `README.md` (×2) | "It **standardizes** how AI agents declare…" | "It defines a common form in which AI agents declare…" |
| `README.md` | "Core Declarative Specification **(Standard)**" | "Core Declarative Specification (v1.0)" |
| `SECURITY_REVIEW_CONTEXT.md` | "**introduces a standardized** declaration surface" | "defines a declaration surface" |
| `SECURITY_REVIEW_CONTEXT.md` | "A risk conversation **accelerator**" | "A structured input to risk review" |
| `DESIGN_RATIONALE.md` | "This is a core **differentiator**" | "This is what distinguishes the schema's constraint model" |
| `CHANGELOG.md` (×2) | "**First** canonical public release" | "Canonical public release (v1.0)" |
| `CONTRIBUTING.md` | "represents the **first** canonical specification freeze" | "v1.0 is the frozen canonical specification" |
| `spec/v1.0/index.md` | "is the **first** stable release" | "is the current stable version" |
| `README.md` | "Agent Manifest **introduces** a structural principle" | "states a structural principle" |
| `WHY_THIS_EXISTS.md` | "**introduces** a declarative layer before interaction" | "defines a declarative layer that precedes interaction" |
| `foundations/INCIDENT_ANALYSIS.md` | "It **introduces** structured declaration" | "It **defines** structured declaration" |
| `examples/orchess-multi-agent-flow/README.md` | "the **first documented real-world adoption case**" | "records the manifests used in the author's own workflow" |

Rules: III.5, III.2.6.

### B · Persuasion, urgency, intensifiers (III.2.1, III.2.9, III.6)

| File | Before | After |
|---|---|---|
| `README.md` | "## **5-Minute Integration**" / "integrate in under five minutes" | "## Integration" / "The following procedure produces a minimal valid manifest" |
| `README.md` | "Done." | *removed — conversational filler, carries no content* |
| `CONTRIBUTING.md` | "Thank you for your interest in contributing." | "This document states which contributions are accepted." |
| `WHY_THIS_EXISTS.md` | "a simple but increasingly **critical** problem" | "a specific problem" |
| `docs/architecture/system-flow.md` | "the **real** infrastructure flow" | "the infrastructure flow" |
| `docs/how-to-register.md` | "follows a **simple** pipeline" | "follows this pipeline" |
| `docs/comparison.md` | "it **simply** means" | "it means" |
| `docs/architecture/system-flow.md` | "provides **transparency, version history, and public auditability**" | "Manifests are stored by year and month and retain full Git history" |
| `docs/architecture/system-flow.md` | "**no prior configuration required**" | "The endpoint returns the registry location" |
| `docs/how-to-register.md`, `docs/registration-demo.md` (×3) | "a **transparent and auditable** / **permanent** public record" | "a public, version-controlled record" |
| `docs/registration-demo.md` | "This **demonstrates** the operational infrastructure" | *removed — self-congratulatory closing, carries no fact* |
| `docs/MISCONCEPTIONS.md` | "**Power lies** in structured commitment, not in runtime control" | "The commitment is structural; it is not a runtime control" |
| `DESIGN_RATIONALE.md` | "**Its power lies** in clarity / clarity in constraint / constraint in discipline" | "Its clarity derives from constraint, and its constraint from architectural discipline" |

Rules: III.2.1, III.2.9, III.2.5, III.6 (operational instruction retained).

### C · Overclaim and unhedged assertion (III.2.3)

| File | Before | After |
|---|---|---|
| `README.md` | "**requires** autonomous systems to declare" | "in which autonomous systems declare" |
| `PAPERS.md` | "positions declarative identity as a **necessary** architectural layer" | "argues that declarative identity **may be treated as** an architectural layer" |
| `ROADMAP.md` | "declarative authority frameworks **will be** necessary" | "**may become** necessary" |
| `ROADMAP.md` | "optimizes for long-term **legitimacy** and structural soundness" | "prioritizes structural stability over feature velocity" |
| `DESIGN_RATIONALE.md` | "keeps the spec adoptable and **prevents vendor capture**" | "is **intended to** keep the specification portable across vendors" |
| `DESIGN_RATIONALE.md` | "Their results **show** that stronger models…" | "The authors **report** that…" |
| `DESIGN_RATIONALE.md` | "**Most** ecosystems describe…" | "**Many existing formats** describe…" |
| `DESIGN_RATIONALE.md` | "enforcement **collapses into guesswork**" | "enforcement systems have no declared baseline to compare against" |
| `docs/ARCHITECTURE.md` | "verification is **fragile** / accountability **erodes**" | "A declaration is a precondition for third-party verification" |
| `docs/MISCONCEPTIONS.md` | "makes dishonesty **structurally visible**" | "can be compared against observed behavior by an external validator" |
| `WELL_KNOWN.md` (×2) | "**makes** the ecosystem machine-discoverable" / "**are considered** discoverable" | "is **intended to** make manifests machine-retrievable; automatic discovery is not yet implemented" |
| `WHAT_THIS_IS.md` (×2) | "a **shared** reference" / "orientation for **anyone**" | "a public reference document" / "It states what an agent declares before operating" |
| `README.md` | "maintained in the open — **a transparent process**" | "under an open license with public versioning; the process is described in GOVERNANCE.md" |
| `docs/registration-demo.md` | "follows a **real** registration flow" | "is an **illustrative** registration flow" |

Rule: III.2.3. The `WELL_KNOWN.md` pair also resolved an internal contradiction:
the page claimed machine-discoverability nineteen lines above admitting that
auto-discovery "is future work, not current behavior".

### D · Non-ranking comparison with third parties (III.5)

| File | Before | After |
|---|---|---|
| `docs/comparison.md` (×2) | "Agent Manifest answers a question **none of them ask**" | "addresses a different concern:" |
| `docs/comparison.md` | "Composition **is already the norm**" | "OASF ships an agentspec integration module, so composition is already possible" |
| `docs/comparison-mas-lab.md` | "## What MAS-Lab **does not replace**" + list of another project's gaps | "## Concerns Agent Manifest declares" + the same items stated positively. The author's claim is preserved verbatim: "remain necessary regardless of how well-specified the internals are" |
| `docs/comparison-mas-lab.md` | "A **trustworthy** agent ecosystem **needs** both layers" | "The two operate at different boundaries" |
| `docs/ARCHITECTURE.md` | Non-goal: "**Compete with** agent frameworks" | "Define or replace agent frameworks" |

The "No affiliation" disclaimer in `comparison-mas-lab.md` was left byte-identical.

### E · Emoji and glyphs (III.2.9, II.8, II.14) — hard rule

| File | Before | After |
|---|---|---|
| `foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md` (×10) | `✅ Pass if:` / `⚠️ Flags:` | `Pass if:` / `Flags:` |
| `docs/how-to-register.md`, `docs/registration-demo.md` (×4) | `👉 <url>` | `<url>` |
| `CONTRIBUTING.md` (×3) | `### ✅ Low-Risk (PR welcome)` etc. | `### Low-Risk (PR welcome)` etc. — the author's labels kept verbatim, only the glyph removed |

Emoji are prohibited outright and were the only meaning carried by colour alone
on those pages.

### F · Facts corrected against the file they describe

| File | Before | After | Evidence |
|---|---|---|---|
| `examples/README.md` | `basic-agent.json` \| 1 \| low \| general | `basic-agent.json` \| 2 \| medium \| support | The file declares `autonomy.level: 2`, `risk_profile.level: medium`, `stores_personal_data: true`, `agent_id: example.customer.support.tier1` |
| `examples/README.md` | `data-processing-agent.json` \| 2 | \| 1 | The file declares `autonomy.level: 1` |
| `examples/README.md` | "Domains: **general**, research…" | `general` removed | No example declares that domain |
| `foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md` | `spec/vX.Y/schema.json` | `spec/v1.0/schema.json` | Placeholder; only v1.0 exists (III.2.2) |
| `docs/architecture/system-flow.md` | "Updated: **March 2026**" | "Updated: July 2026" | Four months stale |
| `docs/architecture/system-flow.md` | Status "Automated via GitHub Actions" | Status `Operational` + a Note column | Outside the closed lexicon (III.4); the detail is preserved in Note |
| `docs/MISCONCEPTIONS.md` | "Applies to v1.**x**" | "Applies to v1.0" | Only v1.0 exists (III.2.2) |
| `docs/ecosystem-map.md` | "consists of **seven** repositories" | "organized as the repositories listed below" | The count was wrong and drifts with every new repository |
| `docs/index.md` | "The normative specification lives in `spec.md`" | "The normative specification is the **HTML edition**; `spec.md` is a rendering" | `spec.md` says so in its own header |
| `TERMINOLOGY.md` | "(README, CORE_PRINCIPLES, **ARCHITECTURE.md**, spec…)" | "All root documents and the versioned specification" | `ARCHITECTURE.md` is in `docs/`, not the root |
| `CORE_PRINCIPLES.md` | "structurally **non-compliant**" | "structurally **incomplete**" | Contradicted `TERMINOLOGY.md:29` for the same rule (III.5) |
| `CORE_PRINCIPLES.md` | "**non-authorization** for autonomous operation" | "**structural invalidity**" | Contradicted `TERMINOLOGY.md:110` (III.5) |
| `CONTRIBUTING.md` | "goal is clarity, **safety**, interoperability" | "goals are clarity and interoperability" | Contradicted `README.md:79` and `SECURITY.md:113`, which disclaim safety guarantees |
| `STABILITY.md` | "major-level changes **in spirit**" | "**require a major version**, per CORE_PRINCIPLES.md" | `CORE_PRINCIPLES.md:7` states it as a hard rule |
| `CODE_OF_CONDUCT.md` | Failed template substitution: a truncated sentence, the same sentence repeated, and a double period, leaving the reporting channel unstated | One sentence naming the private channel | Public defect; the channel it named (a public issue) is the one `SECURITY.md:29` forbids for sensitive reports |
| `docs/how-to-register.md` | Summary showed only the GitHub Issue path | Shows both paths | Contradicted its own §3 |
| `docs/ecosystem-map.md` | "minimal infrastructure for declarative AI agent identity" | "a **declaration layer** for AI agent identity" | Governed term (Appendix C) |
| `docs/comparison.md` | "pre-interaction governance declaration layer" | "a declaration layer that applies before interaction" | Governed term (Appendix C) |
| `GOVERNANCE.md` | "Initiator and founding author" | "author" + **ORCID added** | III.3 Provenance requires ORCID and excludes an author bio |
| `foundations/pre-execution-authority/README.md` | "Independent Researcher" | kept + **ORCID added** | III.3 — the affiliation was not removed |

### G · Register and structure

| File | Before | After |
|---|---|---|
| `docs/how-to-register.md` | "**you must** prepare a valid declaration" | "A valid manifest is required before registration" (III.1 third person; imperative procedures kept under III.6) |
| `docs/MISCONCEPTIONS.md` (×2) | "Yes." / "No." as standalone answers | Neutral clarifying statements with identical factual content (III.1) |
| `docs/ARCHITECTURE.md` | "does not grow by adding features / grows by improving clarity" | "Scope is fixed at v1.0; subsequent changes refine clarity rather than add features" (III.2.5) |
| `docs/ARCHITECTURE.md` | "The long-term **value** depends on preserving separation" | "The separation between the three layers is normative" |
| `docs/architecture/system-flow.md` | missing `- ` on the `Schema:` line | bullet added — it broke out of the list |
| `foundations/README.md` | orphan closing code fence at EOF | removed (syntax artifact, rendered literally) |
| `foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md` | "Recommended file location:" drafting note | "Location in this repository:" — the path is kept, the drafting frame removed (III.3 Provenance) |
| `examples/orchess-multi-agent-flow/README.md` | "Hernán Capucci" | "Hernán Alfredo Capucci" (governed form, Appendix C) |
| `examples/orchess-multi-agent-flow/README.md` | unlabelled DOI in the footer | "**Specification** DOI: …" so the page cannot be cited under the specification's identifier (III.3 DOI) |
| 25 files | H1 in Title Case with an "Agent Manifest — " prefix | H1 in sentence case, equal to the front-matter `title`; the institutional prefix is now supplied by the SiteHeader on every page (III.3, II.11) |

**Heading renames (content preserved in full, 18 total):** the 8 H1 normalisations
above, plus `README.md` "5-Minute Integration" → "Integration";
`docs/architecture/system-flow.md` "Future Extensions" → "Possible extensions";
`docs/comparison-mas-lab.md` "Declaration Layer vs. Specification-Driven Runtime"
→ lead sentence, and "What MAS-Lab does not replace" → "Concerns Agent Manifest
declares"; `examples/README.md` "If you are building..." → "Starting points by
domain"; `examples/orchess-multi-agent-flow/README.md` "Why This Matters" →
"Declared differences between the two agents", and the two agent headings, which
**retain the product names** (`(Claude Code)`, `(ChatGPT)`); `spec/v1.0/index.md`
"Quick Start" → "Example manifest".

---

## 4 · Additions (no counterpart removed)

- `spec/v1.0/index.md` — provenance block (author, ORCID, DOI, licence), which the
  specification's own landing lacked entirely (III.3).
- `evaluations/README.md` — a sentence stating these are self-applied worked
  examples, not third-party assessments (III.2.3).
- `foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md`,
  `foundations/pre-execution-authority/README.md` — "This document is
  non-normative" notices (III.3).
- `foundations/INCIDENT_ANALYSIS.md` — a cross-reference to the DIF, added
  alongside the existing §10 list rather than replacing it.
- `examples/README.md` — a note recording that `basic-agent.json` does not match
  its filename, stated as a known discrepancy rather than silently corrected.
- `PAPERS.md` — context on the "Ongoing" entry: it records that the work exists,
  not that it is published (III.3 DOI).
- 30 files — `title` and `description` front matter.

---

## 5 · Over-corrections detected and reverted

A mid-pass audit of every removed line found four classes of change that removed
content, altered a stated project state, or edited a historical record. All were
reverted. The reversal is recorded here so it is itself auditable.

| Over-correction | Why it was wrong | Action |
|---|---|---|
| The prose of `nist-comment/nist-comment-2026.md` was rewritten ("Declaration Gap", "Layer 1 absent from NIST's proposed stack") | It is a **submitted public comment** with its own DOI `10.5281/zenodo.19000957`. Its text is a historical fact and cannot be retro-edited | **Restored verbatim.** Only front matter was added |
| Both DIF evaluations were rewritten, erasing the `PASS` verdict and the `Confidence` line | That erased a dated record. The field values were wrong, but the remedy is to label and correct, not to rewrite | **Restored verbatim**, each with a dated "Correction notice — 2026-07-20" stating the manifest's actual values |
| `SECURITY.md` "Critical risks may require silent patching before public communication" was replaced with the opposite policy | That changes the project's **stated security policy**, not its wording | **Restored.** Recorded as an open decision (§7) |
| Roughly fourteen doctrinal statements were removed across eight files as rhetorical residue | The charter discourages the register, but the statements are the author's doctrine | **All restored**, some rephrased in plain register with meaning preserved |

**Statements restored:** `ROADMAP.md` — "Architecture first / Adoption second /
Monetization last", "Minimal surface area / Maximum clarity / Structural integrity
before ecosystem scale", "foundational stage", the "(Exploratory)" and
"(Conditional)" phase qualifiers, and the **DIF** name · `STABILITY.md` —
"Capability evolves / Principles remain constrained / Authority is declared before
autonomy" · `SECURITY.md` — the closing statement · `SECURITY_REVIEW_CONTEXT.md`
— "Its purpose is clarity before autonomy" and the "## The Structural Gap"
heading · `DESIGN_RATIONALE.md` and `README.md` — "Its value emerges through
adoption" · `CONTRIBUTING.md` — "grows by refinement, not accumulation" and its
three literal labels · `docs/ecosystem-map.md` — "declare before interacting" and
the word "experimental" · `docs/MISCONCEPTIONS.md` — the "models commitments, not
behavior" blockquote, the `arXiv:2606.30546` citation, and "complementary, not
competing" · `foundations/INCIDENT_ANALYSIS.md` — §10 in full (five failure
zones), §9 References, and the "publicly documented" sourcing statement ·
`examples/README.md` — the orientation section and the "(non-normative)"
qualifier · `examples/orchess-multi-agent-flow/README.md` — the product names and
"under active development" · `PAPERS.md` — the "## Ongoing" section ·
`spec/v1.0/index.md` — the status word "Stable" · `foundations/pre-execution-authority/README.md`
— the affiliation line.

---

## 6 · Removed public URLs

**One**, justified:

`/works/<slug>/cite.html` is no longer indexable. It is a build byproduct: Jekyll
renders the machine citation `cite.md` to HTML inside a published Work directory.
It is not one of the thirteen declared representations, it duplicates the
citation, and it competes with the record it sits inside. It now carries
`noindex, follow` and a `Disallow` in `robots.txt`, so **the URL still responds**;
it is de-indexed, not deleted. `cite.md`, the declared representation, is
unchanged and still served.

---

## 7 · Open doctrinal decisions — deliberately deferred

These are **not** addressed by this change. They require the maintainer's
judgement and are recorded here as separate pending items.

1. **`SECURITY.md` — "Critical risks may require silent patching before public
   communication."** Restored to its original wording. It sits in tension with
   III.3 ("silent alteration of the preserved archive is never authorized"),
   although that rule governs *published records* rather than tooling patches.
2. **"Open Specification — Standards Track"** on the Specification cover, and
   "Status of This Memo" in §2. Appendix F of the charter already registered this
   as a content decision pending separate authorisation. Unchanged.
3. **`foundations/INCIDENT_ANALYSIS.md` — "The incidents referenced here are
   publicly documented."** The document cites no incident; §9 names source
   categories, not sources. Either citations are added or the claim is relabelled.
   No answer was invented.
4. **`examples/basic-agent.json`** is named "basic" but declares autonomy 2,
   medium risk and personal-data storage, and is close to a duplicate of
   `customer-support-tier1.json`. The documentation now describes it accurately;
   renaming the file would break existing references.
5. **Google Scholar venue signal.** `/works/declaration-layers/` emits no
   `citation_journal_title` or `citation_technical_report_institution`. Asserting
   an institution would be fabrication (I.5.3). This may limit Scholar inclusion.

---

## 8 · Verification recorded at the time of this change

```
Jekyll build (github-pages gem, Ruby 4.0)   43 pages, 0 errors
Test suite                                  167/167
build-css --check                           OK
publish-site --check                        OK
isolation-check                             OK
derive --check (both Works)                 OK
derive-check consistency (both Works)       OK
ASV validate                                PASS (0 blocking)
Files deleted                               0
Sections deleted                            0
Broken internal links                       0 of 342 checked
Orphan public pages                         0 (was 21)
Sitemap URLs                                40 (was 12), 0 redirecting
Raw .md with an HTML twin                   0 (was 19)
Secrets / AI attribution / local paths      none
```
