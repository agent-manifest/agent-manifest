---
title: Evaluations
description: Declarative Integrity Framework evaluation artifacts, written as self-applied worked examples over manifests published in this repository.
---

# Evaluations

This directory contains Declarative Integrity Framework (DIF)
evaluation artifacts.

Evaluations assess declarative coherence and structural completeness.

These evaluations are self-applied worked examples produced by the author over manifests in this repository. They are not third-party assessments.

They do not modify the normative specification.  
They do not enforce runtime behavior.  
They do not imply certification or endorsement by the maintainers.

## Evaluations in this directory

- [DIF evaluation — minimal example (summary)](./DIF_EVALUATION_COMINT_minimal-example.md)
- [DIF evaluation — extended](./DIF_EVALUATION_EXTENDED_minimal-example.md)

**Both evaluations carry a dated correction notice (2026-07-20) and contain
superseded sections.** They were written against field values that
[`examples/basic-agent.json`](../examples/basic-agent.json) does not carry: the
manifest declares `autonomy.level` 2, `risk_profile.level` medium,
`data_handling.stores_personal_data` true, `audit_surface.logging` detailed and
`reconstructability` full. The records are preserved rather than rewritten; the
manifest itself is authoritative, and re-running the checklist against the
current file is outstanding work.

The framework they apply is defined in
[Declarative Integrity Framework](../foundations/DECLARATIVE_INTEGRITY_FRAMEWORK.md).
