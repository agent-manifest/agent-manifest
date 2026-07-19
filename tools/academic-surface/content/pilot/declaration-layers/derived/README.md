# Derived academic representations — NOT published (Gate D3)

Deterministic, offline derivations of the pilot Work `amw-014` from the SSOT
(`../work.json`). **Regenerated, never hand-edited.** All files stay under
`tools/` (excluded from Jekyll) and are **not** materialized on any public
`/works/` path in D3.

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
| `index.json` | machine API | carries `publication_status` + `_internal` (strip before D4/D5) |
| `signposting.json` | `<link>` model | `status: model-only`; no headers/HTML |

**DOI policy:** the version DOI `10.5281/zenodo.18880520` is the preferred /
immutable citation identifier; the concept DOI `10.5281/zenodo.18880519` is the
Work identity / continuity link. Both appear where the format supports it.

**Not materialized:** every future URL under `https://agent-manifest-spec.org/works/declaration-layers`
is planned only. No landing, no `/works/`, no sitemap, no HTML in D3.
