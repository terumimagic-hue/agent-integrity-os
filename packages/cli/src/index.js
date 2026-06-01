#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatResult, scoreReport, statusToExitCode } from "../../core/src/index.js";

function usage() {
  return `Agent Integrity OS CLI\n\nUsage:\n  agent-integrity check --report completion-report.json [--mode strict] [--json]\n\nExit codes:\n  PASS  = 0\n  DELAY = 1\n  BLOCK = 2`;
}

function parseArgs(argv) {
  const args = {
    command: argv[2],
    report: null,
    mode: "default",
    json: false,
    help: false
  };

  for (let i = 3; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--report") {
      args.report = argv[++i];
    } else if (token === "--mode") {
      args.mode = argv[++i] || "default";
    } else if (token === "--json") {
      args.json = true;
    } else if (token === "--help" || token === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

export function loadReport(reportPath) {
  if (!reportPath) throw new Error("--report is required.");
  const fullPath = path.resolve(process.cwd(), reportPath);
  const text = fs.readFileSync(fullPath, "utf8");
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse JSON report: ${error.message}`);
  }
}

export function run(argv = process.argv) {
  const args = parseArgs(argv);
  if (args.help || !args.command) {
    console.log(usage());
    return 0;
  }
  if (args.command !== "check") {
    throw new Error(`Unknown command: ${args.command}\n\n${usage()}`);
  }

  const report = loadReport(args.report);
  const result = scoreReport(report, { mode: args.mode });
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatResult(result));
  }
  return statusToExitCode(result.status);
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] === thisFile) {
  try {
    process.exitCode = run(process.argv);
  } catch (error) {
    console.error(`Agent Integrity OS error: ${error.message}`);
    process.exitCode = 2;
  }
}
