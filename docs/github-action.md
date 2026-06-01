# GitHub Action

## Usage

```yaml
name: Agent Integrity

on:
  pull_request:

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

## Inputs

| Input | Default | Description |
|---|---|---|
| `report` | `completion-report.json` | Path to the completion report |
| `mode` | `default` | `default` or `strict` |

## Exit behavior

| Status | Exit code | CI behavior |
|---|---:|---|
| PASS | 0 | success |
| DELAY | 1 | fail until clarified |
| BLOCK | 2 | fail until blockers are resolved |
