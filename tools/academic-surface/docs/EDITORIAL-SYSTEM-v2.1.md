# Academic Editorial System — Foundational Charter

**Version:** 2.1 — **FROZEN** as the operative editorial authority for the ecosystem (2026-07-20). Surgical pass over v2.0; **v2.0 is retained unchanged as the antecedent** in `EDITORIAL-SYSTEM.md`. Branch `editorial/academic-editorial-system`. The only change made at freeze was the single-accent correction in §II (`--focus` is the one interaction accent; `--ok` is a semantic state colour, not an editorial accent); no rule was reopened and none was added. The charter is authoritative now; the pending *surface* edits it governs (Home, Works, the Records, and the Specification representation repair) remain staged on the working branch and enter production only through the human pre-integration review.
**Nature:** this is not a design system. It is the **editorial charter that governs how the Agent Manifest ecosystem publishes** — written to remain coherent for twenty years and across an unbounded number of contributors, none of whom may be the original one. It asks the ecosystem to hold itself to the discipline of a durable scholarly and technical publisher; it does **not** claim to be a formal standards body, an accredited journal, or an externally recognized institution. Where this document says *"the institution,"* it means the ecosystem's publishing practice as a durable, rule‑bound editorial actor — an internal standard of conduct, not a claim of formal or recognized institutional status.
**Authority:** the charter is the **source of truth** for the entire ecosystem. Home, Academic Surface, Works, Docs, Spec, White Papers, AGTS, Registry, Dataset, Boundary Handshake, E‑Principle, and every future publication **converge toward the charter — never the reverse.** No surface becomes the canonical reference by virtue of having existed first.
**Scope boundary (frozen):** the charter governs the *editorial layer only* — identity, language, typography, spacing, color, components, microcopy, information architecture, and the rules for producing publications. It never alters SSOT, Work/Version/Artifact, URLs, canonical, JSON‑LD, Highwire, `citation_*`, exports, Existence Compiler, DEL, SEO/GEO, validators, tests, gates, or determinism. Those are load‑bearing and out of scope.
**Author:** Hernán Alfredo Capucci.
**Location:** `tools/…/docs/` (Jekyll `exclude: [tools]`) — never built into the public site.
**Antecedent & changes:** supersedes v2.0 as the operative charter; the seven precisions applied in this pass are listed in Appendix E. Tokens, components, and archetypes are unchanged from v2.0.

---

## 0 · Preamble: what this document must achieve

A charter earns its name only if it survives the loss of its author. The acceptance test for this document is stated once and governs everything that follows:

> **The Replaceability Test.** If, five years from now, the 250th work of the ecosystem must be produced, the original designer no longer exists, and a completely new person has *only this document*, could that person produce a publication indistinguishable from the previous ones?

If the answer is *no*, the charter is incomplete and no surface convergence is authorized. Part VII answers this test explicitly and honestly. Every earlier part exists to make the answer *yes*: not by teaching taste, but by removing the need for taste — by codifying identity into principles, principles into rules, rules into deterministic generation, and leaving no consequential decision to individual judgment.

The charter therefore has three registers, in this order of authority:

1. **Identity** (Part I) — why the ecosystem publishes as it does and what it refuses to become. The source of every downstream rule.
2. **Principle** (Parts II–III) — every visual and verbal decision, each with a methodological justification, derived from identity, not from precedent or preference.
3. **Reproduction** (Parts IV–VI) — components, surface archetypes, and a production protocol precise enough that conformance is mechanical.

A rule without a justification rooted in identity is not a rule of this charter; it is a habit, and habits are not inheritable.

---

# PART I · EDITORIAL IDENTITY

## I.1 · What Agent Manifest is, institutionally

Agent Manifest is an **open specification initiative accompanied by a governed scholarly and technical record**. Around an open specification for declaring agent identity, authority, and boundaries before execution, it maintains a body of scholarly works, governance documents, and the tooling that produces, validates, distributes, and preserves them. It does not present itself as a formal standards body or an accredited journal, and it claims no adoption, endorsement, or authority it has not demonstrably earned. Two facts determine its editorial identity:

- **Records are the center; tools serve the records.** The intellectual and citable core of the ecosystem is the *record* — a specification version, a working paper, a dataset, a piece of software — each durable, citable, and preserved with a DOI. Tools (CLI, validators, generators, registry, dataset tooling) exist to *produce, validate, distribute, or preserve* those records. No tool may dominate the editorial identity or turn the ecosystem into a product experience; software and datasets are themselves citable records with their own treatment (III.3). The page is a rendering of the record.
- **It declares; it does not exercise authority.** Doctrinally, Agent Manifest is a declarative, non‑enforcing, actor‑side, pre‑interaction layer. It does not authenticate, grant authority, enforce, decide for counterparties, guarantee conduct, or substitute for policy engines, runtime controls, or authorization mechanisms. Its tooling *does* perform deterministic technical operations — validating, generating, deriving, registering — but those operations only *process records*; they exercise no authority over agents and never turn the declarative layer into enforcement. "Non‑acting" is a claim about *authority over agents*, not a denial that the ecosystem runs software.

From these facts the editorial identity follows. A publishing practice built on durable records, that does not persuade or claim authority it lacks, cannot borrow the visual or verbal grammar of software products or marketing, whose purpose is to drive action and admiration. It borrows instead the grammar of the archive, the open specification, and the scholarly record.

## I.2 · What it transmits

A reader arriving at any surface should, within seconds and before reading a word of content, receive four impressions:

1. **This is a place of record.** What I am reading is fixed, dated, attributed, and preserved. I can cite it and it will still be here.
2. **This is serious and neutral.** No one is trying to convince me of anything. The absence of persuasion is itself the signal of confidence.
3. **This is legible and oriented.** I always know what kind of thing I am looking at, who made it, when, and where it sits.
4. **This has been considered.** The restraint and space communicate that decisions were made deliberately and will not change on a whim.

## I.3 · Institutional emotions

Design and language provoke emotion whether or not we intend it. We therefore choose, deliberately, which emotions the institution seeks and which it refuses.

**Sought.**
- **Trust** — the belief that the record is accurate, stable, and complete.
- **Calm** — the absence of urgency, alarm, or stimulation; the reader is not being hurried or excited.
- **Orientation** — the constant, effortless sense of *where am I, what is this, who made it, when*.
- **Gravity** — a quiet seriousness proportional to subject matter that concerns oversight of autonomous systems.
- **Permanence** — the sense that this will read the same in twenty years.

**Refused, with reason.**
- **Excitement / delight** — the emotional currency of consumer products; it implies the reader should feel *rewarded* for engaging, which reframes a record as an experience and undermines neutrality.
- **Urgency** — implies a call to act now; incompatible with a non‑enforcing initiative whose records have no expiry.
- **Awe / aspiration** — the currency of marketing ("the future is here"); it asks the reader to admire the ecosystem rather than assess the evidence.
- **Novelty‑thrill** — anchors the work to a moment ("new!"), which contradicts permanence; today's novelty is tomorrow's embarrassment.

The refusal is operational: any element whose primary function is to produce a refused emotion is prohibited, regardless of aesthetic merit.

## I.4 · Investigation of identity values

The brief proposed ten candidate values. A charter cannot simply adopt a list; a value earns its place only if it passes three tests:

- **True** — is it actually characteristic of *this* ecosystem, not a generic virtue?
- **Distinctive** — does it separate us from what we are not (a product, a marketing site, a generic doc theme)?
- **Generative** — does it *produce decisions*? A value that cannot resolve a concrete design or wording question is decoration.

Evaluated against those tests, the candidates resolve into a small set of **core pillars** (which pass all three and generate rules) and a set of **derived qualities** (true, but expressions of a pillar rather than independent sources).

**Core pillars (each is a source of rules):**

1. **Permanence.** The record outlives its author, its tooling, and its era. *(Absorbs: continuity, permanencia.)* Generative because it forbids anything trend‑bound, vendor‑bound, or moment‑bound, and requires that everything remain legible in print, plain text, and future displays.
2. **Evidence.** Authority derives from what can be checked — exact identifiers, honest hedging, visible metadata — not from assertion. *(Absorbs: precisión.)* Generative because it dictates that facts are shown exactly and claims are never overstated.
3. **Restraint.** The ecosystem reaches its form by subtraction. Calm and low entropy are *engineered by removal*, not added by decoration. *(Absorbs: calma, sobriedad, baja entropía.)* Generative because it is the default answer to "should we add this?" — no, unless it carries meaning.
4. **Clarity.** Structure and status are always legible, to humans and machines alike; nothing decorative masquerades as meaning. *(Absorbs: claridad, transparencia.)* Generative because it requires semantic hierarchy, honest labeling, and accessibility.
5. **Neutrality.** The ecosystem declares; it never persuades, enforces, or sells. This is the pillar most specific to Agent Manifest and the one most often violated by default web conventions. Generative because it prohibits the entire vocabulary of persuasive calls‑to‑action, promotion, and superlative.
6. **Governance.** The ecosystem is rule‑bound and accountable — *including about itself*. The charter governs the charter. Generative because it requires that the system's own evolution be controlled, versioned, and non‑fragmenting.

**Derived qualities** (real, but consequences of the pillars, not independent axioms): *transparency* is Clarity applied to provenance; *sobriety* is Restraint applied to tone; *low entropy* is Restraint applied to visual and verbal variety; *continuity* is Permanence applied across works.

*Evidence* over *evidencia*: we keep the value but name its mechanism — checkability — so it produces rules rather than a mood.

These six pillars are the axioms. Every rule in Parts II and III cites at least one. If a proposed rule cannot be derived from a pillar, it does not belong in the charter.

## I.5 · Non‑negotiables — what the ecosystem never trades

Stated once, binding on every surface, present and future:

1. **The record is never altered to look better.** Presentation adapts to the record; the record never bends to presentation.
2. **The ecosystem never persuades.** No persuasive calls‑to‑action, no promotion, no superlatives, no urgency, no marketing framing. (Neutral operational instruction is not persuasion; see III.6.)
3. **Nothing is fabricated.** No invented metric, citation count, adoption claim, endorsement, badge, or preview image.
4. **Color, motion, and emphasis carry meaning or are absent.** Decoration that carries no information is entropy and is removed.
5. **Every reader is first‑class.** Human, assistive‑technology user, and machine parser are the same commitment expressed three ways. A record that excludes any of them is incomplete.
6. **Permanence over fashion.** No decision is made because it is current. Every decision must be defensible in twenty years.
7. **One institution, one *editorial* voice.** Every surface shares one editorial voice — chrome, navigation, visible metadata, states, and microcopy — and no surface, work, or author receives a bespoke *editorial* look or tone. This governs the editorial layer only: the scholarly voice of each author's *content* (titles, abstracts, body) is preserved unchanged from the SSOT. "One voice" means one common editorial voice, never a single academic voice (see III.7).
8. **The system governs its own change.** Extensions go through the charter (Part VI). One‑off forks are prohibited.

## I.6 · The three permanent tensions

The ecosystem must hold three tensions without collapsing to either pole. Each has an operational resolution that downstream rules enforce.

- **Authority without grandiloquence.** *Resolution:* authority is expressed by precision, completeness, and permanence — never by scale, boldness, or claim. Operationally: importance is shown by **position and completeness**, never by enlarging, coloring, or emboldening to assert "this matters." Big type and saturated color are grandiloquence; a complete, exactly‑cited, well‑placed record is authority.
- **Rigor without bureaucracy.** *Resolution:* rigor is exactness and structure; bureaucracy is ceremony and friction. Operationally: metadata is **complete but never obstructs reading**; forms are honest, not officious; copy is precise, not formal‑for‑its‑own‑sake. The reader reaches the content immediately and finds the apparatus below it, not in front of it.
- **Innovation without marketing.** *Resolution:* the novelty lives entirely in the *content*; the *frame* never announces it. Operationally: the design never performs modernity (no trend styling), and the copy never says "new," "first," "introducing," or "revolutionary." A genuinely novel result presented plainly reads as more confident than a modest one dressed as a breakthrough.

---

# PART II · THE DESIGN SYSTEM (derived, each decision justified)

Every subsection states the **decision**, the **methodological justification** (traced to pillars), and, where relevant, the **rule**. The justification is the point; the value is only its shorthand.

## II.1 · Ground and color

**Warm paper ground, not white.** *Decision:* the page background is a warm off‑white (`--paper #f5f4f0`), never pure `#ffffff`. *Justification:* pure white is the ground of the application and the dashboard; it maximizes luminance and reads as a live software surface, which contradicts *Permanence* (a record is not an app) and taxes the eye over the long reading a scholarly work demands. A warm, low‑chroma off‑white references the physical page of the archive and the journal, lowers glare, and signals "durable document." It is also stable and predictable across displays and print, where saturated or pure grounds are not. *(Permanence, Restraint, Clarity.)*

**Near‑monochrome; color is a semantic channel, not a mood.** *Decision:* the palette is ink on paper with a single reserved functional accent; saturated color never appears as decoration. *Justification:* color is the strongest pre‑attentive signal a page has. Spending it on branding or ornament trains the reader to ignore it, which destroys its value for the rare moments when color must *mean* something — a status, a warning. Reserving saturated color for state keeps color as information. A near‑monochrome page is also colorblind‑safe by construction, because color is never the sole carrier of meaning. *(Evidence, Clarity, Restraint.)*

**One functional accent.** *Decision:* the system has exactly one **interaction accent** — `--focus #1a3a5c`, a restrained navy — used for keyboard‑focus indication and, sparingly, active state. The one other saturated value in the palette, `--ok #3a6b3a`, is a **semantic state color**, not an editorial accent: it reports a lifecycle state and is confined to the status component (III.4), never used for emphasis, hierarchy, or decoration. There is, therefore, exactly one accent available to editorial composition. *Justification:* an ecosystem that permits two accents will permit three; a single accent is a hard boundary that prevents palette drift over twenty years and keeps the semantic channel unambiguous — where the reader sees the accent, something is *focused or active*, always; where the status tone appears, it is reporting a state, never asserting importance. *(Restraint, Governance.)*

**Hierarchy is never expressed by color.** *Decision:* text importance is carried by scale, weight, and position — not hue. *Justification:* coloring text to rank it substitutes a decorative signal for a structural one and fails for colorblind and monochrome readers. *(Clarity, Authority‑without‑grandiloquence.)*

**The canonical palette** (values in Appendix A; each justified):
- `--ink #1a1917` — primary text; near‑black warmed to sit on paper without the harsh contrast of pure black on pure white (harsh contrast is fatiguing and reads as "screen," not "page").
- `--ink-2 #57544d` — secondary text; the *darkest* muted tone that still clearly recedes, chosen so that all informational secondary text clears WCAG AA (≥ 4.5:1). *Evidence/Clarity forbid unreadable "muted" text.*
- `--ink-faint #8a8780` — permitted only for genuinely non‑informational marks (rule‑adjacent glyphs, separators). Never for text a reader must read. This is a governed exception, not a text color.
- `--rule #dcdad4`, `--rule-strong #c4c1b8` — hairlines.
- `--focus #1a3a5c` — the one accent.
- `--ok #3a6b3a` — the single status‑positive tone, used only inside status components.
- Reserved, never in production: `--paper-dark #8a1c1c` for the staging banner, which is guaranteed to never reach a published artifact.

## II.2 · No shadows

*Decision:* the system uses no drop shadows, inner shadows, or elevation of any kind. *Justification:* a shadow simulates a physical light source and a third dimension that do not exist, causing elements to appear to float at different distances from the reader. This manufactures a visual hierarchy of *elevation* — "this floats above, therefore it matters more" — which is a decorative signal standing in for a substantive one. An evidence‑based editorial ranks content by argument, structure, and position, never by simulated depth; permitting shadows lets the eye be told what is important by lighting rather than by reason. Shadows also render inconsistently across print, e‑ink, forced‑colors/high‑contrast modes, and future display technologies, violating *Permanence*. Hierarchy is therefore expressed only by typographic scale, position, and whitespace — signals that are semantic, durable, and legible to machines. *(Evidence, Restraint, Permanence, Clarity.)*

## II.3 · No gradients

*Decision:* no gradients, anywhere, for any purpose. *Justification:* a gradient encodes brand energy or atmosphere — a marketing device whose entire function is to produce mood (a refused emotion). It carries no information, so by the non‑negotiable "decoration that carries no meaning is entropy," it is removed. It also degrades or inverts unpredictably under accessibility transforms and in print, and it dates rapidly, binding the surface to the visual fashion of its year. *(Restraint, Neutrality, Permanence.)*

## II.4 · Borders and containment — hairlines, not boxes

*Decision:* separation is achieved with single 1px hairline rules; the system does not enclose content in bordered or filled boxes. *Justification:* a box *encloses* and thereby declares its contents a discrete, self‑contained, swappable module — the grammar of product UI. A scholarly page is a *continuous document*, not an assembly of modules; enclosing its sections fragments the reading flow and imposes a "scan the components" mentality. A hairline *separates without enclosing*: it marks a boundary while preserving continuity, exactly as rules do in a printed journal. The only permitted filled surface is the sunken code/quote inset (`--paper-sunk`), which marks "this is verbatim machine text, a different register," and is information, not decoration. *(Restraint, Clarity, Permanence.)*

## II.5 · No cards

*Decision:* lists of records (works, downloads, related items) are hairline‑separated sequences, never grids of elevated cards. *Justification:* the card is an elevated, bounded, often shadowed module borrowed from consumer product galleries. It imposes equal visual weight on unlike things and invites browsing by image rather than reading by sequence. Our lists are *bibliographies* — ordered sequences of records read top to bottom — not galleries. A hairline‑separated list preserves order, weightlessness, and the reading posture of a reference document. *(Restraint, Clarity, Neutrality; and it inherits the no‑shadow and no‑box justifications.)*

## II.6 · Typography

**Two registers, two families.** *Decision:* a humanist‑geometric sans for human argument and a monospace for the machine register (identifiers, metadata keys, code, status, DOIs). *Justification:* the ecosystem continuously interleaves two kinds of content — *prose that argues* and *data that identifies*. Giving them one voice blurs the line between claim and fact; giving them two typographic registers makes that line visible at a glance: monospace says "this is an exact, machine‑meaningful string; do not read it as rhetoric." The sans is chosen to be **neutral** (not expressive or fashionable — expressiveness is a brand signal we refuse), highly legible at text sizes, and calm in rhythm. *(Clarity, Evidence, Restraint.)*

**Face selection is by criteria, not by brand — a permanence safeguard.** *Decision:* the system currently specifies **DM Sans** and **DM Mono**, but the charter binds identity to *criteria*, not to a vendor. Any successor face is conformant if it meets all of: (a) neutral, low‑personality humanist or geometric‑humanist construction; (b) open apertures and unambiguous letterforms (distinct `I l 1`, `0 O`, `rn/m`); (c) at least the weights the scale uses (300, 400, 500); (d) a true monospace companion or a compatible one; (e) an open, redistributable license permitting self‑hosting; (f) full Latin coverage with correct diacritics (the record carries names like *Capucci* and *Hernán*). A robust system fallback stack is mandatory so that a font failure degrades legibly, never breaks the page. *This clause exists so the ecosystem survives the disappearance of any single typeface.* *(Permanence, Governance, Clarity.)*

**The type scale is ergonomic, not decorative.** *Decision:* a fixed modular scale (Appendix A) on a 16px root; one H1 per document; headings step by the scale, never by ad‑hoc sizes. *Justification:* a closed scale prevents size entropy across hundreds of works and authors; a single H1 and strict heading order are semantic (machine‑ and screen‑reader‑legible) as well as visual. Sizes are assigned by *role*, never chosen to make something "stand out" — standing‑out‑by‑size is grandiloquence. *(Clarity, Restraint, Authority‑without‑grandiloquence.)*

**Measure and reading rhythm.** *Decision:* running prose is constrained to ~60–72 characters per line (`--measure`), body line‑height 1.6–1.65, even inside a wider page frame. *Justification:* these are researched constants for sustained reading comfort, not stylistic choices; long measures cause line‑loss and fatigue. The page frame may be wider (for metadata tables), but prose never is — the reader's eye is protected regardless of container. *(Evidence of care for the reader; Clarity.)*

## II.7 · Space and rhythm — the primary tool

*Decision:* whitespace, allocated on a fixed spacing scale (Appendix A), is the primary means of structure and calm; density is deliberately low. *Justification:* space is how *calm* and *consideration* are engineered. Dense layouts communicate urgency and information overload (the dashboard); generous, regular space communicates permanence and deliberation (the monograph). A *fixed* scale is essential over a twenty‑year horizon: ad‑hoc spacing is the most common source of drift, and only a shared scale keeps the vertical rhythm identical across works produced by different people years apart. *(Restraint, Permanence, Calm.)*

## II.8 · Iconography — near‑zero

*Decision:* no icon set is introduced; meaning is carried by words. The only permitted glyphs are typographic (a `/` separator, a `—`), treated as decoration in `--ink-faint`, and, exceptionally, a single inline `currentColor` functional glyph (e.g., copy) always paired with a text label and hidden from assistive tech. *Justification:* an icon trades precision for compression and recognizability — an acceptable trade in dense product UI, an unacceptable one in a bibliographic and multilingual record, where a labeled word is unambiguous, translatable, and screen‑reader‑exact while an icon is culturally variable and imprecise. Icons are also a branding surface; refusing them refuses a marketing channel. *(Clarity, Evidence, Neutrality, Permanence.)*

## II.9 · Motion and microinteraction

*Decision:* motion is minimal and never load‑bearing. At most, a single subtle entrance fade; link underlines transition on hover; a copy control may confirm via `aria-live`. `prefers-reduced-motion` is always honored, and content must render fully and legibly with zero motion. *Justification:* motion signals *change* and *interactivity* — properties of a live application, not a fixed record. A record does not animate because a record does not change. More importantly, motion must never be *required* to reveal content: an entrance animation that begins at `opacity:0` must fall back to visible when motion is disabled, or the record becomes unreadable for reduced‑motion users — a correctness failure, not a taste one. Restraint here is also anti‑fashion: elaborate motion is the clearest marker of a product performing modernity. *(Permanence, Clarity, Accessibility‑as‑ethic, Neutrality.)*

## II.10 · Buttons vs. links

*Decision:* navigation and retrieval use text links (ink, underlined); styled buttons are reserved exclusively for genuine local state changes (e.g., copy‑to‑clipboard) and never used for navigation or downloads. *Justification:* a button is an affordance for *action* in an application and carries an implicit "do this now" (urgency, a refused emotion). A document offers *reference and retrieval*, not actions; an underlined link says "here is where this leads," which is the correct, non‑persuasive speech act. Reserving buttons for true state changes keeps their meaning intact. *(Neutrality, Clarity, Calm.)*

**Functional labels are permitted; calls‑to‑action are not.** A label that names an operation — "Download PDF," "Copy citation," "Validate a manifest" — is neutral operational instruction, not a call‑to‑action (III.6). It describes a destination or a task; it does not urge engagement. Such labels are permitted on links and on the few permitted state‑change buttons alike.

**Links are distinguished by underline, never by color alone.** *Justification:* color‑only link differentiation fails for colorblind and monochrome readers and spends the reserved semantic channel; a persistent underline is unambiguous for everyone. *(Clarity, Accessibility.)*

## II.11 · Navigation and orientation

*Decision:* every non‑home surface carries a consistent site header (institution + surface label) and a breadcrumb; the home uses a sectioned link directory. Orientation is constant and identical across surfaces. *Justification:* *Orientation* (I.3) is a sought emotion; a reader must always know, without effort, what ecosystem they are in, what kind of surface this is, and where it sits. Consistency of chrome is what makes hundreds of independently‑produced pages feel like one publisher. *(Clarity, Continuity, One‑voice.)*

## II.12 · Visual density and reading posture

*Decision:* single‑column, generous margins, one idea per vertical band, apparatus below content. *Justification:* the single column enforces a reading posture (top‑to‑bottom, considered) over a scanning posture (grid, comparative). Low density is the visual form of *Restraint* and the antidote to the "control panel" impression. *(Restraint, Rigor‑without‑bureaucracy.)*

## II.13 · Responsive — reflow, not redesign

*Decision:* responsiveness is reflow of one design across widths, never a different design per device. No content is hidden at small sizes; wide apparatus (tables, code) scrolls within its own bounds; the page itself never scrolls horizontally at any width. *Justification:* a citation resolves to *a record*, and that record must present the *same content and structure* on every device — *Permanence* and *Continuity* forbid a page from becoming a different artifact per breakpoint. Hiding content on mobile would make the record's completeness device‑dependent, which is unacceptable for a place of record. *(Permanence, Continuity, Clarity.)*

## II.14 · Accessibility as institutional ethic

*Decision:* WCAG 2.1 AA is the floor, treated as an expression of identity, not a compliance checkbox: AA‑or‑better contrast (with `--ink-faint` barred from text), one H1 and correct heading order, every section labeled, visible keyboard focus, skip‑to‑content, semantic landmarks, `lang`, `<time datetime>`, and no meaning carried by color or motion alone. *Justification:* the ecosystem declares that *every reader is first‑class* (non‑negotiable 5). A record that a blind reader, a keyboard user, or a machine cannot fully obtain is an *incomplete record* — the same defect as a missing page, expressed for a different audience. Accessibility is therefore *Clarity* and *Transparency* owed to all readers, and *machine‑readability* (already excellent in the metadata layer) is the same commitment owed to the machine reader. *(Clarity, Evidence, Permanence, Neutrality.)*

## II.15 · The boundary rule — the one proprietary gesture

The ecosystem permits exactly **one** proprietary editorial gesture, defined here so that identity is recognizable without any logo, color, illustration, or ornament. It is not decoration; it is doctrine rendered as geometry, and it is admitted only because it carries meaning.

**What it is.** The masthead separator — the single hairline that closes the identity block on every surface — is drawn as **two segments**: a short **solid ink origin segment** (`--boundary-seg`, a fixed system constant) that continues as a **faint hairline** (`--rule`) to the edge of the content column. Mechanically it is one 1px faint rule with a 2px ink segment at its left origin: no fill, no shadow, no gradient (the two tones meet at a hard edge, never a blend), no motion. Its machine mirror is `.boundary-rule` in `editorial.js`; token and stylesheet must always agree (VI.2).

**What it means.** Agent Manifest is a *declarative, non‑enforcing, actor‑side, pre‑interaction* layer (I.1): it declares up to a boundary and makes no claim beyond it. The rule renders exactly that stance — **solid where the ecosystem declares** (its own name, its own record, its own side) and **faint/open beyond** (the undeclared, over which it asserts nothing and enforces nothing). The origin at the left is the point of declaration; the line opens rightward into what precedes execution and is never claimed.

**Which pillar it expresses.** Primarily **Neutrality** — it is the one mark that states the ecosystem's non‑enforcing stance instead of asserting authority — reinforced by **Evidence** and **Permanence** (a fixed, print‑safe hairline whose meaning is carried by position and weight, never by color).

**When it is used.** Exactly **once per surface**, as the separator that anchors the masthead/identity block: below the Home hero, below the SiteHeader on generated Record and Index surfaces, and below the Specification cover. It replaces — never supplements — the plain hairline that would otherwise sit there.

**When it is *not* used.** Never inside content; never around or between sections; never as a decorative divider, a repeated motif, a bracket, or a flourish; never colored, filled, animated, or widened into a bar or band; never more than once on a surface. A second instance would convert a statement of stance into ornament and is prohibited.

**Why it is not decoration.** Remove it and the surface loses a *statement of doctrine* (declaration up to a boundary, no claim beyond), not an ornament. It carries information — the ink segment marks the exact extent of what the ecosystem speaks for; the faint continuation marks what it does not — and it introduces no new color, shadow, gradient, or motion, so it violates no prior rule of Part II. It is the separator that had to exist regardless; the gesture only makes that separator *mean* what the ecosystem is. *(Neutrality, Evidence, Permanence; consistent with II.1–II.9.)*

---

# PART III · THE EDITORIAL COMMUNICATION SYSTEM

Design governs how the ecosystem *looks*; this part governs how it *writes*. It is normative: rules, not examples. Copy that violates it is non‑conformant regardless of correctness of fact.

## III.1 · Voice and register

- **Person and tense.** Third person, present indicative, for descriptions of what things are. First‑person plural ("we") is permitted only for statements of institutional practice ("we preserve records via Zenodo"), never for aspiration or promotion.
- **Register.** The register of an open specification and a scholarly record: sober, exact, unhurried. Neither colloquial nor ceremonially formal (rigor without bureaucracy).
- **Stance.** Descriptive and, where a task requires it, operationally instructive — never persuasive. The ecosystem states facts and, in documentation, gives neutral reproducible instructions; it never argues that the reader should feel, admire, or engage (III.6).
- **Scope.** This voice governs the editorial layer, not authored scholarship (III.7).

## III.2 · The global writing laws

1. **Describe; never persuade.** No sentence exists to move the reader to admiration or to drive engagement. Neutral operational instruction — a command, a procedure, a functional label — is not persuasion and is permitted (III.6).
2. **State facts with their exact identifiers.** Dates, DOIs, versions, licenses appear in full and exact form.
3. **Hedge to the evidence.** A claim is worded to exactly the strength the evidence supports ("may," "can," "is presented as") and never beyond it. Overstatement is a factual error.
4. **Prefer the plain word.** Between two correct words, use the shorter and more common.
5. **Structure over rhetoric.** Convey relationships by structure (lists, order, labeled fields), not by rhetorical emphasis.
6. **Never announce novelty.** The words *new, first, introducing, revolutionary, breakthrough* are prohibited; novelty is carried by content.
7. **Fixed terminology.** Governed terms have one form each (glossary, III.5); synonyms and coinages for them are prohibited. Consistency of terms across hundreds of works is *Continuity*.
8. **No fabrication.** No number, ranking, endorsement, or status that is not true and sourced.
9. **No ornament or persuasion words.** No superlatives, no intensifiers (*powerful, seamless, cutting‑edge, world‑class*), no exclamation, no emoji, and no *persuasive* calls‑to‑action (III.6). Neutral operational imperatives that name a task ("Download PDF," "Validate a manifest") are permitted.
10. **The editorial layer never rewrites scholarly content.** Author‑authored text (titles, abstracts) is presented verbatim from the SSOT; the surface presents, it does not paraphrase (see III.7 for the scope this implies).

## III.3 · Element rules

Each element below is governed by rule. These are binding constraints; a newcomer applies them without needing an example.

- **Titles (of works).** Descriptive noun phrases naming the object of study; specific, not slogans; no marketing hook; no trailing punctuation. Taken verbatim from the SSOT and citable exactly. A subtitle, if any, narrows scope after a colon, in the same register.
- **UI headings (section headings on surfaces).** Sentence case, plain nouns ("Abstract," "Downloads," "How to cite," "Revision history," "About this record"). They name a function, never editorialize. The set is closed (III.4 / Part IV); new headings are added only through governance.
- **Subtitles / leads.** One factual sentence stating scope or purpose. Never a tagline, never a value proposition.
- **Abstracts.** Verbatim from the author via SSOT. The surface never edits, truncates for effect, or paraphrases an abstract. A shortened form is governed by the Summaries rule below, never produced ad hoc.
- **Summaries / index descriptions.** In strict priority order: (1) use an explicit authorial `summary` field when present, verbatim; (2) otherwise a *deterministic* extract may be used **only** when segmentation is unambiguous, it does not truncate an abbreviation, reference, or formula, it preserves the sentence's meaning, and a test guards the extraction; (3) when neither can be guaranteed, show the full abstract or no summary at all; (4) never generate a paraphrase by AI or by any other means; (5) never present a misleading fragment as an editorial summary.
- **Introductions (site/section prose).** State what the thing *is* in one or two plain sentences, in the declarative Concept register ("Agent Manifest allows … to declare …"). No benefits language.
- **Statuses.** Drawn only from the closed status lexicon (III.4), each used only under its defined condition. Status words are facts about the record's lifecycle, never marketing ("live," "hot," "featured" are prohibited).
- **Badges.** A single word or short phrase naming a record *class* or *state* from a closed list; uppercase, mono; never colored except where a state genuinely warrants the one status tone, and even then by restraint. A badge never praises ("Editor's pick") — it classifies.
- **DOI.** Always presented as a full `https://doi.org/…` URL, in mono, never abbreviated in a way that breaks copy/paste. The **version DOI** is labeled the *preferred, immutable* citation; the **concept DOI** is labeled *all versions*. A DOI is never invented; a record without a registered DOI is not described as "published."
- **Versions.** Named `vN`; the current version is marked; the version DOI is the immutable citation. Revision history is newest‑first, each entry dated (`<time datetime>`). A **substantive** change — anything affecting the argument, results, scope, interpretation, academic structure, or any citable file or content a reader could cite — is a *new version*, with a changelog entry and its own version DOI, conforming to the versioning architecture. The preserved Artifact of a published version is never silently altered. This is *Permanence* in the version dimension.
- **Corrections (non‑substantive).** An obvious typo in editorial text, external/discovery metadata, a broken link, an accessibility fix, non‑semantic formatting, or an editorial label may be corrected **without** a new version or DOI, provided the correction changes no citable content. Such corrections apply to the **landing and derived surface only**, are documented with an administrative timestamp/changelog when material, and are never described as a change to the academic content. The **preserved Artifact** (the deposited PDF and its DOI record) is immutable: any change that would alter citable content requires a new Version and Artifact, never an in‑place edit of the archive. *Rule of thumb: if it changes what someone could cite, it is a new version; if it does not, it is a documented landing correction.* Silent alteration of the preserved archive is never authorized.
- **Drafts.** The word *draft* and any staging or "coming soon" language never appear on a public surface. Drafts exist only behind `visibility=draft`; index suppression and staging banners are staging‑only and provably absent from production.
- **Withdrawn.** A withdrawn work **retains its page and its DOI** — citations must never break (*Permanence*). It is labeled *Withdrawn* with a dated, factual reason; the full text may remain, prefaced by a neutral withdrawal notice. The notice states what and when and, briefly, why, without blame or drama. Nothing is deleted.
- **Superseded.** A work replaced by a later one links forward to its successor and is labeled *Superseded by vN / DOI*, remaining available. "Superseded" describes lifecycle; it never disparages the earlier work.
- **Software.** Described by *what it does* and its *version*, with its own type label and citation form (`SoftwareSourceCode`). Never described in feature‑marketing terms; capabilities are stated, not sold.
- **Datasets.** Described by *what they contain*, their *schema/format*, and *extent*, with the `Dataset` type and its citation form. No claims about significance; the description enables reuse.
- **Specifications.** Described by *what they declare* and their *normative status* and *version*; the declarative, non‑enforcing stance is stated where relevant. A specification is never described as a solution, a platform, or "the standard."
- **Notes.** Neutral asides that add precision (e.g., "— preferred, immutable"). Brief, factual, in the muted register.
- **Warnings.** Reserved for genuinely reader‑consequential facts (withdrawal, non‑normative status, external‑metadata caveats). One restrained visual pattern; copy is factual and calm, never alarmist. A warning that is merely emphatic is prohibited — warnings are rare, or they stop meaning anything.
- **Provenance.** States author + ORCID, preservation location (Zenodo), and the canonical‑record statement, exactly. Never exposes internal paths, tool names, build metadata, or checksums. Provenance is *disclosure for trust*, not credit‑claiming; it is worded as fact, not as an author bio.
- **Governance.** Where the ecosystem's authority or process is described, it links to the governance record and states the declarative, non‑enforcing stance plainly. It never claims adoption, endorsement, or authority it does not hold; the prohibited framing ("the missing layer," "first," "the standard," "replaces") is barred here above all.

## III.4 · The closed status and class lexicon

Only these terms may appear, only with these meanings. Additions go through governance (Part VI).

- **Record classes:** *Working paper · Paper · Specification · Report · Essay · Manifesto · Book · Dataset · Software · Public comment.* (These mirror the SSOT type vocabulary; the badge shows the class.)
- **Lifecycle states:** *Draft* (internal only, never public) · *Published* · *Superseded* · *Withdrawn.*
- **Infrastructure states** (home/status only): *Operational · Public · Active.*
- **Positive status tone** `--ok` is permitted only on infrastructure states in the status component.

## III.5 · Terminology governance

- **Governed terms** carry exactly one canonical form (e.g., *Academic Surface*, *version DOI*, *concept DOI*, *declaration layer*, *Agent Manifest*). The glossary (Appendix C) is authoritative; a work that needs a new governed term adds it there through governance, and thereafter everyone uses that form.
- **Prohibited framing (permanent):** "the missing layer," "the first," "the standard," "standards body," "journal of record," "replaces," "the future of," "seamless," "powerful," "revolutionary," "cutting‑edge," and all superlatives and hype verbs. This list is a floor, not a ceiling; anything functioning as marketing or as an unearned claim of institutional status is prohibited whether or not it is listed.

## III.6 · Operational instruction vs. persuasion (mandatory distinction)

Documentation, procedures, downloads, citation, validation, installation, and navigation all require the surface to tell the reader how to do something. This is *not* persuasion, and the prohibition on persuasion never bars it. The governing test is **communicational purpose**: language whose purpose is to increase engagement, conversion, or admiration is prohibited; language whose purpose is to enable a necessary, reproducible operation is permitted.

### Prohibited (persuasion / engagement)
- commercial calls‑to‑action; urgency; conversion; persuasion; promotion;
- "get started now," "try it," "join," "discover," "unlock";
- any imperative whose purpose is to increase engagement.

### Permitted (neutral operation)
- neutral technical instruction; a reproducible procedure; a command;
- an identified download; functional labels — "Copy citation," "Download PDF," "Validate a manifest";
- step‑by‑step references in Docs.

The same imperative mood may fall on either side: "Download PDF" (a functional label for retrieving a named file) is permitted; "Download it now — it's free!" is prohibited. **Judge by purpose, not by grammatical form.** Persuasion is prohibited; necessary operation is permitted.

## III.7 · Scope of the editorial voice

The institutional voice governs the **editorial layer**: chrome, navigation, visible metadata, states, badges, microcopy, and institutional documentation. It does **not** govern authored academic content. Titles, abstracts, and the body of each work are preserved verbatim from the SSOT and retain the author's own scholarly voice; the charter never homogenizes arguments, findings, or intellectual style across authors. "One institution, one voice" (I.5.7) therefore means one common *editorial* voice, not a single *academic* voice. This is what reconciles I.5.7 with law III.2.10: the editorial frame is uniform; the scholarship it frames is not, and must not be made so.

---

# PART IV · COMPONENT SYSTEM (closed set; anatomies)

Every surface is assembled from this closed set. Components have fixed anatomy, fixed class names, and fixed copy roles, so that a page produced by any author is structurally identical to every other. New components are added only through governance.

- **SiteHeader** — institution name (sans, medium) + surface label (mono, uppercase, muted). Hairline below. Identical on every surface.
- **Breadcrumb** — `nav[aria-label="Breadcrumb"] > ol`, `/` separators (faint), current page `aria-current="page"`, non‑link. Order: Home / Works / <Title>.
- **Eyebrow** — mono, uppercase, tracked, `--ink-2`. Opens a section or classifies.
- **Badge** — Eyebrow inside a hairline box. One record class/state word.
- **PageTitle** — single H1, sans, tight tracking, ink.
- **Byline** — author(s) + ORCID link.
- **MetaLine** — mono, muted: class · date · language · surface.
- **FactList** (`dl.facts`) — mono uppercase keys, sans values; the record's fixed fact rows.
- **Abstract** — verbatim prose, constrained to `--measure`.
- **KeywordTags** — mono chips on `--paper-sunk`, hairline, pill radius; muted. (Chips are labels, not cards: no elevation, no action.)
- **DownloadList** — hairless sequence of retrieval links with an em‑dash marker; size as a muted note.
- **CitationBlock** — "How to cite" + immutable‑DOI note + APA (prose), BibTeX (`pre`), RIS (`pre`), all verbatim from the deriver.
- **RelatedWorks** — declared relations only, as sentences with the external DOI.
- **RevisionHistory** — newest‑first `<time>`‑dated entries.
- **Provenance** — "About this record": author/ORCID, preservation, canonical statement.
- **StatusTable** — name (mono ink) / state (mono, `--ok`), hairline rows. Home only.
- **LinkList / Pipeline** — home directory and the operational pipeline glyph‑sequence.
- **Alert** — one restrained note/warning pattern (left rule, sunken ground), rare.
- **SiteFooter** — institution · license · preservation statement.

The machine mirror of the tokens and shared chrome is `tools/academic-surface/src/lib/editorial.js`; it and Appendix A must always agree.

---

# PART V · SURFACE ARCHETYPES

So that *every* kind of page — not only generated Works — can be produced on‑system, the ecosystem's surfaces reduce to five archetypes. Each new surface must declare which archetype it is and inherit that archetype's contract. This is what lets Home, Docs, and Spec eventually converge without invention.

1. **Record page** — a single citable work (paper, spec version, dataset, software). Contract: Hero (Breadcrumb, Badge=class, Title, Byline, MetaLine, FactList) → Abstract → Keywords → Downloads → CitationBlock → RevisionHistory → RelatedWorks → Provenance → Footer. Generated from SSOT. *The current pilot landing is the reference implementation.*
2. **Index page** — a directory of records (the `/works` index; a future dataset index). Contract: Header → Breadcrumb → Title → one‑sentence lead → hairline‑separated record sequence (title, byline‑line, summary per III.3, DOI) → Footer. Generated.
3. **Home / institutional page** — the ecosystem front. Contract: Hero (Badge=institutional class, Title, one‑line description, DOI/license) → sectioned LinkList directories with mono Eyebrow labels → optional StatusTable/Pipeline → Footer. One H1, accessibility scaffolding mandatory.
4. **Documentation page** — long‑form prose (Docs). Contract: Header → Breadcrumb → Title → constrained‑measure prose using the type scale, hairline‑ruled H2 sections, code in sunken insets, no cards. Documentation may contain neutral, reproducible **operational instruction** — procedures, commands, identified downloads, step‑by‑step registration or validation guides — as functional content, never as persuasion (III.6). Must be brought under a layout that applies the tokens (convergence item).
5. **Specification page** — normative text with dense internal structure (Spec). Contract: as Documentation, plus a stable section‑numbering and anchor scheme, and the mono register for schema/field names. Convergence item.

Any page in the ecosystem is one of these five. A page that appears to need a sixth archetype is a governance question (Part VI), not a license to improvise.

---

# PART VI · PRODUCTION PROTOCOL AND SYSTEM GOVERNANCE

## VI.1 · How to produce publication #N (the newcomer's procedure)

The protocol is designed so that indistinguishability is produced *by construction*, not by the newcomer's judgment.

1. **Author the record, not the page.** Create/extend the SSOT (`work.json`) with correct data. Never hand‑write HTML. The page is a derivation of the record.
2. **Declare the type.** The type selects, deterministically: the JSON‑LD `@type`, the badge/class word (III.4), the citation register (III.3), and the required FactList rows. Use the type table; do not invent a type.
3. **Fill required metadata** (title, authors+ORCID, version, dates, DOIs, license, language, abstract, keywords, relations, artifacts+checksums, and an explicit `summary` where a short form is wanted, III.3). Follow the communication rules (Part III) for every human‑authored string.
4. **Choose the surface archetype** (Part V). For records, it is the Record page; the generator applies it.
5. **Generate.** Run the deterministic generators. The editorial layer (tokens, chrome, components) is applied automatically from the shared module; **the newcomer does not style anything.**
6. **Validate.** Run the full battery: schema/ASV, cross‑format consistency, drift `--check`, PDF fixity, isolation, and the test suite. All must pass with zero blocking errors.
7. **Run the conformance checklist** (Appendix B) — visual and communication conformance.
8. **If the content type or need is not covered,** stop and use the extension procedure (VI.2). Never fork a one‑off style, word, or component.

Because steps 5–6 are deterministic and codified, two different people who correctly complete steps 1–4 produce byte‑identical, fully on‑system pages. The newcomer's only real responsibilities are *correct data* and *conformant words* — both fully specified by this charter.

## VI.2 · Governing the system's own evolution

The ecosystem is *rule‑bound about itself* (pillar 6). The charter changes only as follows:

- **Amendment.** A change to a token, component, rule, or lexicon term is proposed as an edit to this charter with its justification traced to a pillar, reviewed by the maintainer, and — only once accepted — reflected in `editorial.js` and the tests in the same change. The charter and the machine mirror never diverge.
- **Extension over exception.** A new content type, surface, or need is met by *extending* the closed sets (a new type row, a new archetype clause, a new lexicon term), never by a local exception. One‑off exceptions are the mechanism by which twenty‑year systems fragment; they are prohibited.
- **Versioning.** The charter is versioned (this is v2.1). Breaking changes to the visual/verbal identity increment the major version and require an explicit migration note for existing surfaces.
- **Precedence.** Where a surface and the charter disagree, the charter wins and the surface is a defect to be corrected — including the Home, the Academic Surface, and this pilot.

---

# PART VII · THE REPLACEABILITY TEST — EXPLICIT ANSWER

> *Could a completely new person, five years from now, with only this document, produce the 250th work indistinguishable from the previous ones?*

**For the governed record‑publishing domain (Record and Index pages): yes — by construction.** The evidence:
- The page is *generated* from the SSOT through a *shared, deterministic* module; identical input yields identical bytes, verified by drift‑check and fixity. The look is codified in `editorial.js` and this charter, not held in any person's taste.
- The visual system is a *closed set* — fixed tokens (Appendix A), a closed component catalog (Part IV), five surface archetypes (Part V) — so there is nothing to invent.
- Every human‑authored string is governed by *rules, not examples* (Part III), the class/status vocabulary is *closed* (III.4), the instruction‑vs‑persuasion boundary is explicit (III.6), and the scope of the editorial voice is bounded (III.7).
- A *decision procedure* (VI.1) and a *conformance checklist* (Appendix B) convert production into a mechanical, checkable process.
- The type table maps any record type to its exact treatment, so a novel record type within the vocabulary is covered.

Under these conditions, the newcomer cannot produce a *distinguishable* page while following the protocol, because they do not style anything — they produce correct data and conformant words, and the system produces the page. The v2.1 precisions *strengthen* this answer: they remove ambiguities (overclaim, tools, instruction‑vs‑persuasion, corrections, summaries, voice scope) that a newcomer could otherwise have resolved inconsistently.

**Where the answer is "not yet," stated honestly:**
- **Bespoke surfaces** (Home, Docs, Spec) are not yet generated from the charter; until they are either generated or bound to their archetype's contract (Part V), a newcomer editing them by hand could drift. *These are precisely the convergence targets, deferred by your instruction.* The charter now contains their archetypes, so convergence is a mechanical application, not a redesign.
- **Genuinely novel content types** beyond the current vocabulary require a governance amendment (VI.2) *before* their first publication — the charter mandates that the type be added to the closed sets first, which preserves indistinguishability rather than breaking it.

**Verdict.** For everything the system generates today, the charter answers the test affirmatively and demonstrably. For the whole ecosystem, it establishes the *complete mechanism* — archetypes, closed sets, rules, protocol, and governance — by which the answer becomes universally affirmative as each surface converges. The remaining gap is *application*, which is deferred and now fully specified, not *design*, which is complete. On that basis the charter is ready to freeze, and surface convergence — beginning with a re‑derivation of the pilot against this v2.1 and then Home, Works, Docs, and Spec — is the next authorizable phase.

---

## Appendix A · Canonical tokens (source of truth; mirror of `src/lib/editorial.js`)

```css
:root{
  --sans:"DM Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"DM Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
  --paper:#f5f4f0; --paper-sunk:#edecea;
  --ink:#1a1917; --ink-2:#57544d; --ink-faint:#8a8780;
  --rule:#dcdad4; --rule-strong:#c4c1b8;
  --focus:#1a3a5c; --ok:#3a6b3a; --paper-dark:#8a1c1c; /* paper-dark: staging only */
  --page-max:45rem; --measure:40rem;
  --s-1:.25rem;--s-2:.5rem;--s-3:.75rem;--s-4:1rem;--s-5:1.5rem;--s-6:2rem;--s-7:3rem;--s-8:4rem;--s-9:6rem;
  --boundary-seg:4rem; /* II.15 boundary rule: length of the solid ink origin segment */
}
```
Type scale (16px root, role‑assigned): display 2.5rem/500/−.04em · h1 2rem/500/−.03em · h2 1.375rem/500/−.02em · h3 1.0625rem/500 · body 1.0625rem/300/1.65 · ui 1rem/300 · small .8125rem · eyebrow .6875rem/500/.14em‑tracked. One H1 per document; headings by role, never by ad‑hoc size. **Unchanged from v2.0.**

## Appendix B · Conformance checklist (run before any page is considered on‑system)

**Visual:** warm paper ground; no white `#fff` surfaces; no shadow/gradient/card/box (only hairlines + one sunken inset); one accent only, used only for focus/active; hierarchy by scale/position/space, never color; single H1; type from the scale; prose within `--measure`; no horizontal scroll at 320–1440px; visible keyboard focus; AA contrast (no `--ink-faint` text); reduced‑motion renders full content.
**Communication:** no superlatives/hype/persuasive‑CTA/emoji; no prohibited framing (incl. "standards body," "journal of record"); neutral operational instruction permitted (III.6); exact DOIs/dates/versions; status/class words from the closed lexicon only; abstract verbatim; summary follows the III.3 priority (authorial `summary` → guarded deterministic extract → full/none; never AI paraphrase); corrections vs. versions applied per III.3; no fabricated signals; provenance exposes no internal paths/tools/checksums; drafts/staging vocabulary absent.
**Machine:** canonical present and correct; `citation_*`, JSON‑LD (`ScholarlyArticle` + `WebPage` + `BreadcrumbList`), Highwire, Dublin Core, OpenGraph, signposting, exports byte‑identical to the deriver; no `noindex` on a published record; determinism (`--check`) and fixity pass.

## Appendix C · Glossary (governed terms — one canonical form each)

*Agent Manifest* · *Academic Surface* · *declaration layer* · *record* · *Work / Version / Artifact* · *version DOI* (preferred, immutable) · *concept DOI* (all versions) · *Working paper* · *Specification* · *Provenance* · *substantive change* (new version) vs. *non‑substantive correction* (documented landing correction, III.3) · *Working paper vs. paper* (working paper = pre‑refereed; paper = refereed/final). New governed terms are added here through governance (VI.2) and thereafter used in this exact form everywhere.

## Appendix D · Relationship to the prior iteration (v1.0)

v1.0 derived the standard from the Home surface. v2.0 reversed that: the standard is derived from **institutional identity** (Part I), and the Home — like every other surface — is a *convergence target*, correct only insofar as it conforms. Token *values* largely persist because they were already defensible from first principles; what changed is that they are now *justified from identity*, not inherited from precedent, and are embedded in a complete reproduction mechanism (Parts IV–VI) that the prior iteration lacked.

## Appendix E · Changes from v2.0 (the v2.1 surgical pass)

v2.1 changes wording and adds two rule subsections (III.6, III.7); it changes **no** token, component, archetype contract, architecture, metadata, SSOT, or public page. The seven precisions:

1. **Identity without overclaim.** I.1 opening reworded from "a standards body fused with a journal of record" to "an open specification initiative accompanied by a governed scholarly and technical record"; the Nature line no longer claims to be "a scientific institution"; "institution" is defined as internal shorthand, not a status claim; "standards body" and "journal of record" added to the prohibited‑framing list (III.5).
2. **Records and tools.** I.1's "produces records, not products" replaced by a normative distinction: records are the citable center; tools (CLI, validators, generators, registry, dataset tooling) serve them; no tool dominates the editorial identity; software and datasets remain citable records.
3. **Declaration vs. technical action.** I.1's "it declares; it does not act" precised: no authentication/authority/enforcement/decision/guarantee/substitution for policy engines — but tooling performs deterministic technical operations that only *process records* and never become enforcement.
4. **Operational instruction vs. persuasion.** New III.6 with explicit Prohibited/Permitted lists judged by communicational purpose; propagated to I.1, I.5.2, III.1, III.2 (laws 1, 9), II.10, and the Documentation archetype (V.4).
5. **Versioning and corrections.** III.3 Versions split into *substantive change* (new version + DOI) vs. *non‑substantive correction* (documented landing‑only correction, no forced DOI); the preserved Artifact remains immutable; silent alteration never authorized.
6. **Summary / abstract first sentence.** III.3 Summaries rewritten to the five‑point priority policy (authorial `summary` → guarded deterministic extract with a test → full/none → never AI paraphrase → never a misleading fragment).
7. **Scope of the editorial voice.** New III.7 plus a reworded I.5.7: the institutional voice governs the editorial layer only; authored scholarship keeps its own voice; "one voice" = one editorial voice, resolving any tension between I.5.7 and III.2.10.

## Appendix F · Art‑direction iteration (identity pass, on top of convergence)

A bounded pass to move the ecosystem from "coherent minimalist academic editorial" to a surface recognizable as *Agent Manifest*, with no spectacle and no gratuitous decoration. It changes **no** SSOT, metadata, canonical, JSON‑LD, Highwire, exports, PDF, URLs, or academic content; every machine‑metadata block on the generated surfaces is byte‑identical to production, verified. The five fronts:

1. **`/works` as a deliberate small collection.** The Index archetype (V.2) gains an institutional scope note (what the surface gathers, the inclusion criterion, the governed‑growth stance — declarative, no promises, III.3), a factual published‑work count, and a per‑record affordance line (canonical landing · version DOI · machine‑readable metadata). The single record now reads as an editorial decision, not an empty page — by composition, never by arbitrary enlargement.
2. **Home, de‑consoled.** The Home archetype (V.3) directory becomes an editorial directory: each entry is a sans **name + one‑line description** (institutional voice) with the machine locator in mono; monospace is now reserved for identifiers, paths, formats, and machine data (II.6). Nine sections regroup into six (Concept · Specification · Documentation · Research · Infrastructure · Discovery). Doctrinal content is unchanged; only grouping, hierarchy, and functional microcopy moved.
3. **Specification, a normative‑document variant.** A same‑system variant (Part V.5) that keeps tokens, paper/ink, DM Sans/Mono, hairlines, and accessibility but recovers gravity: a heavier body register (400, not the 300 of a reading surface), 600/700 headings, a left‑anchored cover (no floating centered hero), the boundary rule as the cover anchor, and RFC 2119 keywords set in the machine register (mono) so every MUST/SHOULD/MAY reads as a normative token. Uniformity is one editorial voice, not one typographic weight — this variant is admitted under Part V.5, not an exception.
4. **Citation block as editorial utility.** APA is the primary human citation, always visible and selectable; BibTeX and RIS become secondary technical formats behind native `<details>` disclosure (no JavaScript) with co‑located download links; a "Copy citation" control is added strictly as progressive enhancement (II.10) — injected by script, absent without JS, so the record stays fully functional with JavaScript disabled. Downloadable bytes and citation content are unchanged.
5. **The boundary rule (II.15).** The ecosystem's single proprietary gesture, defined above and applied once per surface.

**Registered doctrinal observations (not acted on in this pass):**
- **"Standards Track" (Spec cover + §2).** The Specification cover label reads "Open Specification — Standards Track" and §2 is "Status of This Memo." III.5 bars "standards body"; "Standards Track" is adjacent RFC‑register language that may warrant review for the same reason. Left unchanged by instruction; recorded here for a separate content decision, not the editorial layer.
- **Literal code fences in the Spec body (pre‑existing, production).** `spec/v1.0/agent_manifest_v1.0.html` contains 36 stray Markdown code‑fence lines (```` ``` ````) in the document body, and the §5.1 ASCII architecture diagram is split by them, so both render as literal text in production. This is a **content/structure defect that predates this pass** (present in the committed production file, not introduced by convergence or this iteration) and lies outside the authorized editorial‑layer scope. It is a blocking‑quality issue for the Specification surface and is flagged for a separate, explicitly authorized content correction (III.3 permits it as a non‑substantive landing correction that changes no citable content).
