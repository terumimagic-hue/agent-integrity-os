#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { formatResult, scoreReport, statusToExitCode } from "../../core/src/index.js";

function getInput(name, fallback = "") {
  return process.env[`INPUT_${name.toUpperCase().replace(/-/g, "_")}`] || fallback;
}

function markdownSummary(result) {
  const lines = [];
  lines.push(`# Agent Integrity OS: ${result.status}`);
  lines.push("");
  lines.push(`**Score:** ${result.score}`);
  lines.push("");
  if (result.missing.length) {
    lines.push("## Missing");
    for (const item of result.missing) lines.push(`- ${item}`);
    lines.push("");
  }
  if (result.warnings.length) {
    lines.push("## Warnings");
    for (const item of result.warnings) lines.push(`- ${item}`);
    lines.push("");
  }
  if (result.blockers.length) {
    lines.push("## Blockers");
    for (const item of result.blockers) lines.push(`- ${item}`);
    lines.push("");
  }
  lines.push("## Recommendation");
  lines.push(result.recommendation);
  lines.push("");
  return lines.join("\n");
}

try {
  const reportPath = getInput("report", "completion-report.json");
  const mode = getInput("mode", "default");
  const fullPath = path.resolve(process.cwd(), reportPath);
  const report = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const result = scoreReport(report, { mode });
  const summary = markdownSummary(result);
  console.log(formatResult(result));

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }

  process.exitCode = statusToExitCode(result.status);
} catch (error) {
  console.error(`Agent Integrity OS action failed: ${error.message}`);
  process.exitCode = 2;
}
