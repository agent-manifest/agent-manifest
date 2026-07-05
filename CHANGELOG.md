# Changelog

All notable changes to this project will be documented in this file.

Repository releases and the specification version move on separate
tracks; see [`VERSIONING_POLICY.md`](./VERSIONING_POLICY.md). The
specification has remained `manifest_version: 1.0` since [1.0].

---

## [Unreleased]

### Changed

- Normalized author metadata in `CITATION.cff` to full legal name ("Hernán Alfredo Capucci") for bibliographic consistency.
  
- Configured `CITATION.cff` to use Zenodo v1.0 archived specification as the preferred citation target (DOI: 10.5281/zenodo.18833956).

---

## [1.1.0] - 2026-03-12

Repository release. No changes to the normative specification
(`spec/v1.0/`); `manifest_version` remains `1.0`.

### Added

- Conceptual architecture diagram for the ecosystem
  (`docs/architecture/agent-manifest-ecosystem.svg`), referenced from
  `README.md` and `docs/ARCHITECTURE.md`.
- Ecosystem mapping documentation (`docs/ecosystem-map.md`).
- Registration guides: `docs/how-to-register.md` and
  `docs/registration-demo.md`.
- Well-known discovery endpoint on the spec site
  (`.well-known/agent-manifest-registry.json`).
- `$schema` references in all examples to improve editor validation.

### Changed

- Architecture documentation refinements and documentation structure
  improvements.

---

## [1.0.0] - 2026-03-02

Zenodo trigger release for DOI registration. Content identical to
[1.0] (zero commits between the `v1.0` and `v1.0.0` tags); the tag
exists so the GitHub–Zenodo integration could publish the archived,
citable version of the specification
(DOI: 10.5281/zenodo.18833956).

---

## [1.0] - 2026-02-28

First canonical public release.

> Date note: 2026-02-28 is the repository/specification release date.
> The archived citable version (DOI 10.5281/zenodo.18833956) was published
> on Zenodo on 2026-03-02, which is the date recorded in `CITATION.cff`
> and `codemeta.json`. Both dates are correct; they refer to different events.

### Added

- Established canonical specification under `spec/v1.0/`.
- Introduced canonical JSON Schema endpoint:
  `https://agent-manifest-spec.org/spec/v1.0/schema.json`
- Aligned manifest_version to "1.0".
- Standardized domain-based $id for schema.
- Prepared release for DOI publication.

### Changed

- Updated all documentation references to point to v1.0 canonical endpoints.
- Clarified versioning model separating specification version from historical development iterations.

### Notes

- This release supersedes all pre-1.0 development iterations.
- Version 1.0 represents the first frozen, canonical specification state.

---

## [0.2.0] - 2026-02-14

Foundational consolidation. No modifications to the normative
specification or JSON Schema.

### Added

- Pre-Execution Authority as explicit grounding doctrine
  (`foundations/pre-execution-authority/`).
- `DESIGN_RATIONALE.md` (architectural reasoning).
- `ROADMAP.md` (architecture-first direction).
- `CORE_PRINCIPLES.md`, `CONTRIBUTING.md`, `SECURITY.md`.
- Doctrinal references integrated into `README.md`.

### Changed

- Clarified the separation between doctrine and technical
  specification, and the stability-over-velocity posture.

### Notes

- The [0.1.0] section below was written on 2026-02-16 and documents the
  cumulative pre-1.0 baseline; several of its doctrinal items landed
  between the `v0.1.0` (2026-02-04) and `v0.2.0` (2026-02-14) tags and
  are the substance of this release.

---

## [0.1.0] - 2026-02-16

Pre-canonical structural baseline.

### Added

- Introduced foundational doctrine under `foundations/pre-execution-authority/`.
- Formalized Pre-Execution Authority as grounding principle.
- Introduced `DESIGN_RATIONALE.md`.
- Introduced `ROADMAP.md`.
- Integrated foundational references into `README.md`.
- Added normative terminology reference (`TERMINOLOGY.md`).
- Added required `stopping_authority` declaration.
- Added required `audit_surface` declaration.
- Added required `forbidden_actions` field.
- Added optional `capabilities` declaration.
- Added optional `language` declaration.

### Changed

- Updated JSON Schema (`spec/manifest.schema.json`) for structural alignment.
- Introduced conditional validation for `data_handling.retention`.
- Improved `purpose.primary_code` constraints.
- Harmonized accountability terminology.

### Notes

- Pre-1.0 development release.
- Superseded by canonical v1.0 specification.
