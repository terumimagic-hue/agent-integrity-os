import assert from "node:assert/strict";
import { scoreReport, statusToExitCode } from "../packages/core/src/index.js";

const baseReport = {
  version: "0.1.0",
  objective: "Test deterministic scoring.",
  what_changed: ["Added test"],
  evidence_anchor: [{ type: "test", label: "unit", value: "passed" }],
  tests_run: ["npm test"],
  unresolved: ["No unresolved items"],
  risk_level: "low",
  rollback_path: "Revert test commit",
  restart_point: "Continue with benchmark tests",
  gate_output: "PASS"
};

const pass = scoreReport(baseReport);
assert.equal(pass.status, "PASS");
assert.equal(statusToExitCode(pass.status), 0);

const delay = scoreReport({ ...baseReport, tests_run: [], gate_output: "DELAY" });
assert.equal(delay.status, "DELAY");
assert.equal(statusToExitCode(delay.status), 1);
assert.ok(delay.missing.includes("tests_run"));

const block = scoreReport({ ...baseReport, destructive_change: true, rollback_path: "", gate_output: "PASS" });
assert.equal(block.status, "BLOCK");
assert.equal(statusToExitCode(block.status), 2);
assert.ok(block.blockers.some((item) => item.includes("destructive_change")));

const invalid = scoreReport({ ...baseReport, risk_level: "severe" });
assert.equal(invalid.status, "BLOCK");

console.log("core tests passed");
