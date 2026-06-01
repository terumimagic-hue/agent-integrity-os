# Scoring Model

Agent Integrity OS v0.1 uses deterministic rules.

## Base score

Every report starts at 100.

Penalties:

- missing required field: -10
- warning: -5
- blocker: -25

The final score is clamped between 0 and 100.

## Status selection

1. If any blocker exists, status is `BLOCK`.
2. Else if any missing field or warning exists, status is `DELAY`.
3. Else if `gate_output` is not `PASS`, status is `DELAY`.
4. Otherwise status is `PASS`.

## Blocker rules

A report becomes `BLOCK` when:

- `destructive_change` is true and `rollback_path` is missing
- `data_loss_risk` is true and `rollback_path` is missing
- `production_impact` is true and `evidence_anchor` is missing
- `security_or_secret_risk` is true and `mitigation` is missing
- `gate_output` is `PASS` while required integrity fields are missing
- invalid enum values are used for `risk_level` or `gate_output`

## Strict mode

Strict mode adds warnings for missing `stop_condition` and `must_preserve`, and recommends a `reviewer` for high-risk reports.
