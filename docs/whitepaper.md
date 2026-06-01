# Completion Is Not Integrity

AI agents can now produce code, documentation, release notes, migrations, and operational changes. The bottleneck is no longer only generation. The bottleneck is trust.

A generated task can look complete while still being unsafe to continue:

- tests may be missing
- evidence may be vague
- destructive changes may lack rollback
- unresolved risks may be hidden
- the next agent may not know where to restart

Agent Integrity OS treats completion as a claim, not a fact.

The system asks a narrower and more operational question:

> Is this work supported by enough evidence, disclosure, and restartability to be safely continued?

This is the difference between completion and integrity.

## Design choice: deterministic first

v0.1 avoids LLM-based scoring. The first version is a deterministic gate because integrity checks must be reproducible in CI.

LLM-assisted review can be added later as an advisory layer, but the core gate should remain inspectable and predictable.

## The missing layer

Most teams already have test runners, linters, type checks, security scanners, and code review.

Agent Integrity OS does not compete with them. It aggregates their existence as evidence anchors and checks whether the work has a restartable operational shape.
