# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

_No changes recorded yet._

---

## [0.1.0] - 2026-02-16

Initial stable release.

### Added

- Introduced foundational doctrine under `foundations/pre-execution-authority/`.
- Formalized Pre-Execution Authority as the explicit grounding principle of Agent Manifest.
- Introduced `DESIGN_RATIONALE.md` documenting architectural reasoning.
- Introduced `ROADMAP.md` clarifying long-term architectural direction.
- Integrated foundational references into `README.md`.
- Added normative terminology reference (`TERMINOLOGY.md`).
- Added required `stopping_authority` declaration to schema.
- Added required `audit_surface` declaration to schema.
- Added required `forbidden_actions` field.
- Added optional `capabilities` declaration.
- Added optional `language` declaration.

### Changed

- Updated JSON Schema (`spec/manifest.schema.json`) to reflect structural alignment with CORE_PRINCIPLES and TERMINOLOGY.
- Introduced conditional validation for `data_handling.retention`.
- Improved `purpose.primary_code` machine-readability constraints.
- Harmonized accountability and structural terminology across documents.

### Clarified

- Explicit separation between doctrine and technical specification.
- Confirmed non-commercial posture during foundational maturation phase.
- Reinforced stability-over-velocity development approach.
- Clarified declaration / enforcement / execution layer separation.

### Notes

- No constitutional guarantees modified.
- Core principles remain stable under v1.x doctrine.
- Version 0.1.0 establishes the first complete structural baseline.