# Derived academic representations (source of the public surface)

Deterministic, offline derivations of the pilot Work `amw-014` from the SSOT
(`../work.json`). **Regenerated, never hand-edited.** These are the internal source
representations under `tools/` (excluded from Jekyll). The **public** copy is a
byte-identical materialization written by `npm run publish-site` to the repo-root
`/works/declaration-layers/` tree (13 representations + the fixity-verified PDF);
`npm run publish-check` fails on any drift. This README is internal and is never
published.

Regenerate / verify (from the module root):

```
npm run derive -- content/pilot/declaration-layers/work.json          # write
npm run derive -- content/pilot/declaration-layers/work.json --check  # fail on drift
```

| File | Representation | Notes |
|---|---|---|
| `cite.json` | CSL-JSON (canonical) | central bibliographic source |
| `cite.bib` | BibTeX (`@misc`) | derived from CSL |
| `cite.ris` | RIS (`TY GEN`) | derived from CSL |
| `cite-apa.txt` | APA citation | plain text |
| `cite-plain.txt` | plain citation | plain text |
| `cite.md` | Markdown citation | italic title |
| `highwire.json` | Highwire `citation_*` | `.tags` lifted to `<meta>` in D4; `status: not-published` |
| `schema.json` | schema.org JSON-LD | `ScholarlyArticle`; embedded in D4 |
| `dublin-core.json` | Dublin Core | data object |
| `opengraph.json` | OpenGraph | data object; no image asset |
| `index.json` | machine API | carries `publication_status` + `_internal` (strip before D5) |
| `signposting.json` | `<link>` model | `status: model-only`; no headers/HTML |
| `index.html` | human landing page | production-faithful; **no** noindex; renders the metadata above |

**DOI policy:** the version DOI `10.5281/zenodo.18880520` is the preferred /
immutable citation identifier; the concept DOI `10.5281/zenodo.18880519` is the
Work identity / continuity link. Both appear where the format supports it.

**Landing (`index.html`):** the production-faithful human page. It embeds the
canonical link, `citation_*`, Dublin Core, OpenGraph, signposting `<link>`s and
schema.org JSON-LD rendered from the same builders as the metadata files. It
carries **no** `noindex` — index-suppression is never baked into the Work.

**Local staging (`npm run stage`):** assembles a servable, git-ignored,
non-indexable preview under `../../../../staging/works/declaration-layers/`
(landing + PDF + all metadata). Only there is a **temporary** `noindex` (robots
meta + `robots.txt` Disallow) injected; it must disappear before production.
See `../../../../staging/STAGING.md` after building.

**Not materialized publicly:** every URL under
`https://agent-manifest-spec.org/works/declaration-layers` is planned only. No
public `/works/`, no sitemap, no robots or nav change. The staging tree is local
and never deployed.
