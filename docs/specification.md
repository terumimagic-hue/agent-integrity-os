# Agent Integrity Protocol v0.1

## Status

Draft v0.1.

## Purpose

Agent Integrity Protocol defines the minimum information required before AI-generated work can be treated as complete, continued, merged, or deployed.

The protocol is not a replacement for testing, security review, code review, or domain review. It is a final integrity gate that checks whether those signals are present, explicit, and restartable.

## Core principle

> Completion is not integrity.

A task is not complete merely because an agent says it is complete. Completion requires evidence, unresolved-risk disclosure, rollback clarity, and a restart point.

## Required completion report fields

| Field | Meaning |
|---|---|
| `version` | Protocol/report version |
| `objective` | What the work was supposed to accomplish |
| `what_changed` | Concrete list of changes made |
| `evidence_anchor` | Test, build, audit, review, or manual verification evidence |
| `tests_run` | Exact verification commands or explicit N/A explanation |
| `unresolved` | Known gaps, pending items, or explicit statement of none |
| `risk_level` | `low`, `medium`, `high`, or `critical` |
| `rollback_path` | How to undo or safely back out |
| `restart_point` | Where the next human or agent should continue |
| `gate_output` | Claimed gate output: `PASS`, `DELAY`, or `BLOCK` |

## Optional but recommended fields

- `must_preserve`
- `stop_condition`
- `mitigation`
- `reviewer`
- `destructive_change`
- `production_impact`
- `security_or_secret_risk`
- `data_loss_risk`

## Gate outputs

### PASS

Minimum evidence exists. The work has a rollback path and a restart point. Known unresolved items are disclosed.

### DELAY

The work may be valid, but completion should be delayed until evidence, tests, unresolved notes, or restartability is improved.

### BLOCK

Unsafe to merge, deploy, or continue. Typical causes include destructive changes without rollback, production impact without evidence, or PASS claims with missing required evidence.

## Determinism

v0.1 is deterministic. It does not use LLM inference. This makes the result reproducible in CI and suitable for GitHub Action gates.
