# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

_No changes recorded yet._

---

## [1.0] - 2026-02-28

First canonical public release.

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
