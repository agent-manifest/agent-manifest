---
title: DIF evaluation — minimal example (summary)
description: Summary application of the Declarative Integrity Framework checklist to an example manifest, retained with a dated correction notice.
---

# DIF Evaluation — Minimal Example (Summary)

## Correction notice — 2026-07-20

This evaluation is retained as originally written. Its stated field values do not
match the manifest it names. `examples/basic-agent.json` declares
`autonomy.level` 2 · `risk_profile.level` medium · `data_handling.stores_personal_data` true · `audit_surface.logging` detailed · `audit_surface.reconstructability` full, and `agent_id` `example.customer.support.tier1`.

The evaluation text below reports a lower-autonomy, low-risk profile that the file
does not carry. The record is preserved rather than rewritten; readers should take
the manifest itself as authoritative. Re-running the checklist against the current
file is recorded as outstanding work.

---

This document summarizes the Declarative Integrity Framework (DIF)
assessment of the Minimal Example Agent Manifest.

## Verdict

PASS — Declaratively coherent baseline example.

## Observations

- Required declaration fields are present.
- Autonomy level (1) is consistent with low risk posture.
- Stopping authority is declared and structurally coherent.
- Audit surface is minimal but acceptable for low-risk usage.
- Data handling declaration is clear (no personal data stored).

## Notes

This evaluation assesses declarative coherence only.
It does not enforce runtime guarantees.
It does not modify the normative specification.
