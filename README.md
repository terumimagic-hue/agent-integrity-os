# Agent Integrity OS

**Completion is not integrity.**

Agent Integrity OS is a lightweight trust layer for AI-generated work.

It helps humans and AI agents decide whether a task is truly complete, safely restartable, and supported by evidence before continuing, merging, or deploying.

## What it is

Agent Integrity OS provides:

- a deterministic `PASS / DELAY / BLOCK` scoring engine
- a standard `completion-report.json` format
- a restartable handoff standard
- a CLI for local checks
- a GitHub Action for PR and release gates
- a benchmark suite for completion-quality examples

It does **not** replace tests, review, security scanning, or human judgment. It sits above them and asks one final question:

> Can this work safely be treated as complete?

## Why it exists

AI agents increasingly produce code, documentation, migrations, release notes, and operational changes. But an agent saying “done” is not enough.

Agent Integrity OS checks for:

- objective clarity
- concrete change summary
- evidence anchors
- tests or verification commands
- unresolved risks
- rollback path
- restart point for the next human or agent
- dangerous mismatch between claimed completion and missing evidence

## Quick start

Create a `completion-report.json`:

```json
{
  "version": "0.1.0",
  "objective": "Add a deterministic completion gate.",
  "what_changed": ["Added core scoring engine", "Added CLI"],
  "evidence_anchor": [
    { "type": "test", "label": "Unit tests", "value": "npm test passed" }
  ],
  "tests_run": ["npm test", "npm run build"],
  "unresolved": ["MCP server planned for v0.2"],
  "risk_level": "low",
  "rollback_path": "Revert this PR",
  "restart_point": "Continue with packages/mcp-server in v0.2",
  "stop_condition": "Stop if schema validation fails",
  "gate_output": "PASS"
}
```

Run:

```bash
node packages/cli/src/index.js check --report completion-report.json
```

## CLI usage

```bash
agent-integrity check --report completion-report.json
agent-integrity check --report completion-report.json --mode strict
agent-integrity check --report completion-report.json --json
```

Exit codes:

| Status | Exit code |
|---|---:|
| PASS | 0 |
| DELAY | 1 |
| BLOCK | 2 |

## GitHub Action usage

```yaml
name: Agent Integrity

on:
  pull_request:
  push:
    branches: [main]

jobs:
  integrity:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: terumimorita/agent-integrity-os@v0
        with:
          report: completion-report.json
          mode: strict
```

## Example output

```txt
Agent Integrity OS: DELAY
Score: 70

Missing:
- evidence_anchor
- restart_point

Recommendation:
Delay completion. Add the missing evidence, tests, unresolved notes, and restart point before continuing.
```

## Protocol overview

Agent Integrity Protocol v0.1 classifies work as:

- `PASS`: minimum integrity evidence exists and the work is restartable
- `DELAY`: work may be valid but needs more evidence, review, or handoff clarity
- `BLOCK`: unsafe to continue because of missing rollback, production risk, security risk, or false completion claims

See:

- [`docs/specification.md`](docs/specification.md)
- [`docs/scoring-model.md`](docs/scoring-model.md)
- [`docs/handoff-standard.md`](docs/handoff-standard.md)
- [`docs/whitepaper.md`](docs/whitepaper.md)

## Benchmark

```bash
npm run benchmark
```

The benchmark includes representative AI completion reports with expected `PASS / DELAY / BLOCK` outcomes.

## Roadmap

- v0.1: Protocol, schemas, deterministic engine, CLI, GitHub Action, benchmark
- v0.2: MCP server for agent-native `completion.check`
- v0.3: OpenSSF / SLSA / release hardening
- v0.4: Domain guards for recipe safety, SEO/GEO, health claims, revenue funnels, and legal wording
- v0.5: Agent Memory Ledger
- v0.6: JARVIS Operator Layer

## 日本語

Agent Integrity OS は、AIが生成した作業を「完了」として扱ってよいかを判定するための軽量な信頼レイヤーです。

目的、変更内容、証拠、テスト、未解決点、再開地点、ロールバック方法をもとに、作業を `PASS / DELAY / BLOCK` に分類します。

> AIの「完了しました」を、そのまま信じない。次の人間とAIが安全に再開できる状態へ変換する。

## Citation

If you reference Agent Integrity OS in an article, paper, or repository, please cite this project using [`CITATION.cff`](CITATION.cff).

## License

MIT
