#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { evaluateEditorialFacts } from "./editorial-policy.mjs";

const CASES_PATH = path.resolve(
  "data/evals/editorial-policy-cases.json",
);
const REQUIRED_DIMENSIONS = new Set([
  "verification",
  "scope",
  "online-sales",
  "deduplication",
  "freshness",
  "geography",
]);
const CASE_KEYS = new Set([
  "id",
  "dimensions",
  "description",
  "facts",
  "expected",
  "why",
]);
const FACT_KEYS = new Set([
  "existenceStatus",
  "scope",
  "operatingStatus",
  "territory",
  "duplicate",
  "identityEvidence",
  "activityEvidence",
  "municipalityEvidence",
  "onlineSalesEvidence",
  "onlineSalesChannels",
]);

function unknownKeys(value, allowed) {
  return Object.keys(value).filter((key) => !allowed.has(key));
}

function main() {
  const suite = JSON.parse(fs.readFileSync(CASES_PATH, "utf8"));
  assert.equal(suite.version, 1, "evaluation suite version must be 1");
  assert.ok(Array.isArray(suite.cases), "evaluation suite requires cases");
  assert.ok(suite.cases.length > 0, "evaluation suite cannot be empty");

  const ids = new Set();
  const coveredDimensions = new Set();

  for (const testCase of suite.cases) {
    assert.deepEqual(
      unknownKeys(testCase, CASE_KEYS),
      [],
      `${testCase.id}: unknown case fields`,
    );
    assert.match(testCase.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!ids.has(testCase.id), `duplicated case id '${testCase.id}'`);
    ids.add(testCase.id);

    assert.ok(
      typeof testCase.description === "string" && testCase.description.trim(),
      `${testCase.id}: description is required`,
    );
    assert.ok(
      typeof testCase.why === "string" && testCase.why.trim(),
      `${testCase.id}: why is required`,
    );
    assert.ok(
      Array.isArray(testCase.dimensions) && testCase.dimensions.length > 0,
      `${testCase.id}: dimensions are required`,
    );
    testCase.dimensions.forEach((dimension) => {
      assert.ok(
        REQUIRED_DIMENSIONS.has(dimension),
        `${testCase.id}: unknown dimension '${dimension}'`,
      );
      coveredDimensions.add(dimension);
    });
    assert.deepEqual(
      unknownKeys(testCase.facts, FACT_KEYS),
      [],
      `${testCase.id}: unknown fact fields`,
    );

    const actual = evaluateEditorialFacts(testCase.facts);
    assert.deepEqual(actual, testCase.expected, `${testCase.id}: wrong outcome`);
  }

  for (const dimension of REQUIRED_DIMENSIONS) {
    assert.ok(
      coveredDimensions.has(dimension),
      `evaluation suite does not cover '${dimension}'`,
    );
  }

  console.log(
    `Editorial policy evaluations OK (${suite.cases.length} cases, ${coveredDimensions.size} dimensions).`,
  );
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
