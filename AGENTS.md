# AGENTS.md — Agent Integrity OS

## Project
Agent Integrity OS is a lightweight trust layer for AI-generated work.

Core statement:
Completion is not integrity.

## Scope for v0.1
- Deterministic PASS / DELAY / BLOCK scoring only.
- No LLM-based scoring.
- No paid APIs.
- No network calls during tests.
- Preserve benchmark cases.
- Do not weaken BLOCK conditions.

## Required verification
Before claiming completion, run:

npm test
npm run build
npm run benchmark

## Completion report format
Every task must end with:

- objective
- what_changed
- evidence_anchor
- tests_run
- unresolved
- risk_level
- rollback_path
- restart_point
- gate_output

Do not say "complete" unless the repository passes its own checks.
