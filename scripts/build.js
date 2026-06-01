import fs from "node:fs";
import { scoreReport } from "../packages/core/src/index.js";

for (const schema of ["schemas/completion-report.schema.json", "schemas/handoff.schema.json"]) {
  JSON.parse(fs.readFileSync(schema, "utf8"));
}

const sample = JSON.parse(fs.readFileSync("examples/pass-basic/completion-report.json", "utf8"));
const result = scoreReport(sample);
if (result.status !== "PASS") {
  throw new Error(`Expected pass-basic example to PASS, got ${result.status}`);
}

console.log("build validation passed");
