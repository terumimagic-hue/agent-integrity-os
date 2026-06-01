const REQUIRED_FIELDS = [
  "objective",
  "what_changed",
  "evidence_anchor",
  "tests_run",
  "unresolved",
  "restart_point",
  "risk_level",
  "rollback_path",
  "gate_output"
];

const VALID_RISK_LEVELS = new Set(["low", "medium", "high", "critical"]);
const VALID_GATE_OUTPUTS = new Set(["PASS", "DELAY", "BLOCK"]);

function isBlank(value) {
  return value === undefined || value === null || (typeof value === "string" && value.trim().length === 0);
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0 && value.some((item) => !isBlank(item));
}

function hasExplicitField(report, field) {
  const value = report?.[field];
  if (Array.isArray(value)) return isNonEmptyArray(value);
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "object" && value !== null) return Object.keys(value).length > 0;
  return value !== undefined && value !== null;
}

function normalizeMode(mode = "default") {
  return mode === "strict" ? "strict" : "default";
}

function normalizeBool(value) {
  return value === true || value === "true";
}

export function validateReport(report) {
  const issues = [];
  if (!report || typeof report !== "object" || Array.isArray(report)) {
    return {
      valid: false,
      issues: ["Report must be a JSON object."]
    };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!hasExplicitField(report, field)) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  if (report.risk_level && !VALID_RISK_LEVELS.has(report.risk_level)) {
    issues.push(`Invalid risk_level: ${report.risk_level}`);
  }

  if (report.gate_output && !VALID_GATE_OUTPUTS.has(report.gate_output)) {
    issues.push(`Invalid gate_output: ${report.gate_output}`);
  }

  if (report.version && typeof report.version !== "string") {
    issues.push("version must be a string when present.");
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function generateFindings(report, options = {}) {
  const mode = normalizeMode(options.mode);
  const missing = [];
  const warnings = [];
  const blockers = [];

  for (const field of REQUIRED_FIELDS) {
    if (!hasExplicitField(report, field)) {
      missing.push(field);
    }
  }

  const evidenceMissing = !hasExplicitField(report, "evidence_anchor");
  const testsMissing = !hasExplicitField(report, "tests_run");
  const rollbackMissing = !hasExplicitField(report, "rollback_path");
  const unresolvedMissing = !hasExplicitField(report, "unresolved");
  const restartMissing = !hasExplicitField(report, "restart_point");
  const mitigationMissing = !hasExplicitField(report, "mitigation");

  if (report.gate_output === "PASS" && missing.length > 0) {
    blockers.push("gate_output is PASS but required integrity fields are missing.");
  }

  if (normalizeBool(report.destructive_change) && rollbackMissing) {
    blockers.push("destructive_change is true but rollback_path is missing.");
  }

  if (normalizeBool(report.data_loss_risk) && rollbackMissing) {
    blockers.push("data_loss_risk is true but rollback_path is missing.");
  }

  if (normalizeBool(report.production_impact) && evidenceMissing) {
    blockers.push("production_impact is true but evidence_anchor is missing.");
  }

  if (normalizeBool(report.security_or_secret_risk) && mitigationMissing) {
    blockers.push("security_or_secret_risk is true but mitigation is missing.");
  }

  if (report.risk_level === "critical" && report.gate_output === "PASS") {
    warnings.push("risk_level is critical; human review is recommended even when required fields exist.");
  }

  if (report.risk_level === "high" && mode === "strict" && !hasExplicitField(report, "reviewer")) {
    warnings.push("strict mode: high risk report should include reviewer.");
  }

  if (unresolvedMissing) {
    warnings.push("unresolved is missing; every report should explicitly state known gaps, even if none.");
  }

  if (restartMissing) {
    warnings.push("restart_point is missing; the next human or agent may not be able to continue safely.");
  }

  if (testsMissing) {
    warnings.push("tests_run is missing; add exact commands or explain why tests were not applicable.");
  }

  if (mode === "strict") {
    if (!hasExplicitField(report, "stop_condition")) {
      warnings.push("strict mode: stop_condition is recommended.");
    }
    if (!hasExplicitField(report, "must_preserve")) {
      warnings.push("strict mode: must_preserve is recommended.");
    }
  }

  return { missing, warnings, blockers };
}

export function scoreReport(report, options = {}) {
  const validation = validateReport(report);
  const findings = generateFindings(report || {}, options);

  if (!validation.valid) {
    for (const issue of validation.issues) {
      if (issue.startsWith("Invalid")) findings.blockers.push(issue);
      else if (!issue.startsWith("Missing required field")) findings.warnings.push(issue);
    }
  }

  let score = 100;
  score -= findings.missing.length * 10;
  score -= findings.warnings.length * 5;
  score -= findings.blockers.length * 25;
  score = Math.max(0, Math.min(100, score));

  let status = "PASS";
  if (findings.blockers.length > 0) {
    status = "BLOCK";
  } else if (findings.missing.length > 0 || findings.warnings.length > 0 || report?.gate_output !== "PASS") {
    status = "DELAY";
  }

  return {
    status,
    score,
    missing: findings.missing,
    warnings: findings.warnings,
    blockers: findings.blockers,
    recommendation: recommendationFor(status, findings)
  };
}

export function recommendationFor(status, findings) {
  if (status === "PASS") {
    return "The work has the minimum evidence, rollback path, and restartability required to continue.";
  }
  if (status === "BLOCK") {
    return "Do not merge or continue. Resolve blockers and rerun Agent Integrity OS.";
  }
  const missing = findings.missing.length > 0 ? ` Missing: ${findings.missing.join(", ")}.` : "";
  return `Delay completion. Add the missing evidence, tests, unresolved notes, and restart point before continuing.${missing}`;
}

export function formatResult(result) {
  const lines = [];
  lines.push(`Agent Integrity OS: ${result.status}`);
  lines.push(`Score: ${result.score}`);
  if (result.missing.length > 0) {
    lines.push("\nMissing:");
    for (const item of result.missing) lines.push(`- ${item}`);
  }
  if (result.warnings.length > 0) {
    lines.push("\nWarnings:");
    for (const item of result.warnings) lines.push(`- ${item}`);
  }
  if (result.blockers.length > 0) {
    lines.push("\nBlockers:");
    for (const item of result.blockers) lines.push(`- ${item}`);
  }
  lines.push(`\nRecommendation:\n${result.recommendation}`);
  return lines.join("\n");
}

export function statusToExitCode(status) {
  if (status === "PASS") return 0;
  if (status === "DELAY") return 1;
  return 2;
}
