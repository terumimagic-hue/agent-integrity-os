# Handoff — Agent Integrity OS v0.1 Bootstrap

## Objective

Bootstrap Agent Integrity OS v0.1 as an English-first OSS starter repository for AI-generated work integrity checks.

## Current state

The repository skeleton is generated and locally validated. It contains Protocol, Schema, Core, CLI, GitHub Action, Benchmark, Examples, and Docs.

## What changed

- Created deterministic core scoring engine.
- Created CLI command: `agent-integrity check --report <file>`.
- Created composite GitHub Action wrapper.
- Created JSON schemas for completion reports and handoffs.
- Created 30 benchmark cases.
- Created README and protocol documentation.
- Created project metadata files: LICENSE, CITATION, CONTRIBUTING, SECURITY, ROADMAP, CHANGELOG.

## Evidence anchor

Commands run successfully:

```bash
npm test
npm run build
npm run benchmark
node packages/cli/src/index.js check --report examples/pass-basic/completion-report.json
node packages/cli/src/index.js check --report examples/delay-missing-tests/completion-report.json
node packages/cli/src/index.js check --report examples/block-destructive-change/completion-report.json
```

Benchmark result: `30 passed, 0 failed`.

## Unresolved

- Publish to GitHub.
- Add TypeScript declarations or convert source to TypeScript if desired.
- Add MCP server in v0.2.
- Add OpenSSF/SLSA hardening in v0.3.
- Add domain guards in v0.4.

## Must preserve

- Core scoring stays deterministic in v0.1.
- No external API calls.
- No LLM calls.
- No telemetry.
- Exit code contract: PASS=0, DELAY=1, BLOCK=2.

## Restart point

Create a GitHub repository named `agent-integrity-os`, copy this directory, rerun:

```bash
npm test
npm run build
npm run benchmark
```

Then commit:

```bash
git add .
git commit -m "feat: bootstrap Agent Integrity OS v0.1"
git branch -M main
git remote add origin git@github.com:terumimorita/agent-integrity-os.git
git push -u origin main
```

## Stop condition

Stop before publishing if tests fail, benchmark cases diverge, or secrets accidentally appear in the repository.

## Next recommended action

Publish the repo privately first, verify GitHub Action execution on a test PR, then switch to public once the README and author/repo URLs are final.
