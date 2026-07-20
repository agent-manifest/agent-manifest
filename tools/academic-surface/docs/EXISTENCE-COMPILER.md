# Existence Compiler / SEO / GEO / DEL — applied layer & traceability

This maps every publication-gate signal on the Academic Surface to the rule or
principle it implements in the **Digital Existence Layer (DEL)** open standard
(`~/DEL/SPEC.md`, `~/DEL/rules/del-v0.1.json`) and its reference implementation,
the **Existence Compiler** (`~/existence-compiler`). The audit was performed
directly against those repositories, not from generic SEO practice.

DEL defines six pillars: **Technical Presence**, **Semantic Clarity**,
**AI Readability**, **Trust Signals**, **Distribution Readiness**,
**Agentic Readiness** (`SPEC.md:67-149`). GEO is realized through AI Readability +
the Agentic Discovery surface (`existence-compiler/lib/agentic-discovery.ts`); it
is not a separate pillar. Scoring is explicitly **non-normative**
(`SPEC.md:151-163`) — no numeric "existence score" is surfaced as a certification.

## Applied on the work landing (`/works/declaration-layers`)

| Signal | DEL/EC basis | Where |
|---|---|---|
| Unique descriptive `<title>` (56 chars) | Semantic Clarity · descriptive-titles (`SPEC.md:85`) | `landing.js` head |
| `<meta name="description">` | AI Readability · semantic-metadata | `landing.js` head |
| `<meta name="author">` | Trust · content-traceability (`SPEC.md:122`) | `landing.js` head |
| `<link rel="canonical">` = work URL | Technical Presence · canonical-urls (`SPEC.md:78`) | `landing.js` head |
| One `<h1>` + `<h2>` sections with stable anchor ids | Semantic Clarity · heading-hierarchy | `landing.js` body |
| Abstract as real HTML text (≥300 chars, not PDF-only) | AI Readability · machine-readable-content | `landing.js` body |
| `ScholarlyArticle` JSON-LD (+ `dateModified`, `version`, `mainEntityOfPage`) | AI Readability · structured-data (`SPEC.md:103`); the versioned-paper analog `existence-compiler/lib/papers/del-paper.ts` (`TechArticle`→`ScholarlyArticle`) | `derive.js` `toJSONLD` |
| `WebPage` + `BreadcrumbList` JSON-LD | EC paper layout emits WebPage + BreadcrumbList | `landing.js` `structuralJsonLd` |
| Visible breadcrumb nav | Semantic Clarity · information-architecture | `landing.js` `breadcrumbHtml` |
| Visible **revision history** with `<time>` (datePublished/dateModified) | Trust · content-traceability + GEO freshness (`agentic-discovery.ts:159-197`) | `landing.js` `historyHtml` |
| author = Person + ORCID (`sameAs`/`identifier`), DOI as `identifier` | Trust/authorship — academic realization of content-traceability (the DOI/ORCID slot EC leaves abstract) | `derive.js` `toJSONLD` |
| Visible "How to cite" + BibTeX/RIS + co-located exports | Trust/provenance; EC paper landing does the same | `landing.js` `citeHtml`/`downloadsHtml` |
| Open Graph (title/description/url/type/site_name) | Distribution Readiness · social-card-metadata (`SPEC.md:126`) | `derive.js` `toOpenGraph` |
| Twitter card `summary` (no image) | Distribution Readiness — **no invented preview image**, so `summary`, never `summary_large_image` | `landing.js` `twitterMeta` |
| Signposting typed `<link>` (cite-as/describedby/author/license/type/item/alternate) | AI Readability · additional-machine-representations | `derive.js` `toSignposting` |
| License metadata (visible + JSON-LD `license`) | Trust · reuse terms | `landing.js` + `toJSONLD` |

## Applied on the second work landing (`/works/e-principle`)

The layer is applied by the **same deterministic generators**, so ∈ Principle
(Foundational Work amw-005) carries the same structural head + body signals as the
table above — with the signals correctly adapted to its **software** resource type:

| Signal | Value on this work | Where |
|---|---|---|
| schema.org `@type` | `SoftwareSourceCode` (canonical type is software; Zenodo is authoritative for the resource type — V-A closed as software) | `TYPE_TO_JSONLD['software']` |
| `codeRepository` | the source repository `github.com/agent-manifest/e-principle`, also shown as a visible "Source repository" line | `toJSONLD` / `provenanceHtml` |
| Google Scholar `citation_*` | **omitted** — a non-textual Work is not a Highwire+PDF article; no `citation_pdf_url` is fabricated | `toHighwire` (gated by `isTextual`) |
| Served artifact | the **real release source archive** `e-principle-v1.0.zip` (kind=code), fixity-verified (sha-256; Zenodo MD5 `2f6242…b24c` cross-check). The two book editions are **related Works, never the artifact** | `artifact-manifest.json` |
| DataCite relations | `isBasedOn` the two book editions (18945860 EN, 18945953 ES), carried verbatim into JSON-LD + Dublin Core + the visible "Related work" block | `toJSONLD`/`toDublinCore`/`relationsHtml` |
| Dublin Core / Open Graph | `DC.type` = `Software`; `og:type` = `website` (no `article:*`) | `toDublinCore`/`toOpenGraph` |
| Preferred citation | ∈ Principle **version DOI** 18965669 (per the work's CITATION.cff); concept DOI 18965668 | `facts` / exports |
| Intellectual function | visible **"Role in the ecosystem"** section — factual, non-promotional, states independence (no layer/component framing). "Foundational work" is an editorial role, independent of the resource type | `ecosystemRoleHtml` |
| Type observation | codemeta/ORCID may classify the content differently; recorded observationally under `provenance.type_discrepancies`, never as a second canonical type | SSOT provenance |

Deliberately **not** invented: no PDF (the software deposit has none, so this Work
is not a Scholar candidate), no ISBN, no publisher, no affiliation, no preview image
(`summary` Twitter card only).

## Applied on the site (once)

| Signal | DEL/EC basis | Where |
|---|---|---|
| `/works/` index with `CollectionPage` + `ItemList` + `BreadcrumbList` JSON-LD | GEO · generative_ui_transformability (structured, transformable listing) | `works-index.js` |
| `sitemap.xml` entries for `/works/` and each work (declaration-layers, e-principle), with `<lastmod>` | Technical Presence · xml-sitemap (`SPEC.md:79`); freshness (`agentic-discovery.ts:168`) | repo `sitemap.xml` |
| `robots.txt` `Allow: /` + `Sitemap:` (already present) | Technical Presence · robots-txt-valid | repo `robots.txt` (unchanged) |
| `llms.txt` links to the Academic Surface and to each canonical work | AI Readability · llms-txt (`existence-compiler/public/llms.txt`) | repo `llms.txt` |
| Discoverable links from the home page (Research: Academic Surface + each work) | Technical Presence · crawlability / internal linking | repo `index.html` (Research section) |

## Deliberately deferred / NOT applied (with reason)

Per DEL's own guardrails (`structured-data.ts:4-5`, `del-paper.ts:9-11`,
`agentic-discovery.ts:14-16`) and the project's conservative academic-integrity
posture:

- **No promissory claims** of ranking, traffic, citation, AI-Overview inclusion, or
  Google affiliation. **No** certification/adoption/conformance badges.
- **No fabricated signals**: no `Review`/`AggregateRating`, no invented citation
  counts, no keyword stuffing (Highwire `citation_keywords` are the real keywords).
- **No `summary_large_image`, no `og:image`** — no preview image is invented.
- **No FAQPage/QAPage** — the work has no genuine Q&A; none is fabricated.
- **No Offer/Product/Review/Reservation/SoftwareApplication schema**, no forms/CTA/
  conversion paths (Agentic Readiness is sales-shaped; N/A to a citable document).
- **No RSS/Atom feed**, no Core Web Vitals tooling, no analytics.
- **No `.well-known/security.txt` change** — a site-level trust artifact already
  exists and is outside this publication frente.
- **No numeric existence score** surfaced as conformance (scoring is non-normative).
- **AI is never** author, contributor, maintainer, steward, or identity.
- **Nothing** from `existence-compiler-growth` (Product Hunt/directory/social
  outreach tactics) is ported — it is marketing, not existence structure.

## Positioning guardrails

Language on the surface avoids "the standard / the first / the missing layer /
replaces" (Agent Manifest is a declarative, actor-side, non-enforcing layer). The
`llms.txt` and landing copy state what the work and project **are**, never claims of
primacy or adoption.
