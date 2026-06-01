import fs from "node:fs";
import path from "node:path";
import { scoreReport } from "../packages/core/src/index.js";

const root = process.cwd();
const casesDir = path.join(root, "benchmarks", "cases");
const expectedPath = path.join(root, "benchmarks", "expected-results.json");
const expected = JSON.parse(fs.readFileSync(expectedPath, "utf8"));
let passed = 0;
let failed = 0;

for (const file of Object.keys(expected).sort()) {
  const report = JSON.parse(fs.readFileSync(path.join(casesDir, file), "utf8"));
  const result = scoreReport(report);
  if (result.status === expected[file]) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`${file}: expected ${expected[file]}, got ${result.status}`);
    console.error(JSON.stringify(result, null, 2));
  }
}

console.log(`benchmark: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
