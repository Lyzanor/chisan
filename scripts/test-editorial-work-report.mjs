import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildEditorialWorkReport,
  countCandidateTables,
} from "./report-editorial-work.mjs";

function fixture(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-editorial-report-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return {
    root,
    csvRoot: path.join(root, "csv"),
    evidenceRoot: path.join(root, "evidence"),
    candidateRoot: path.join(root, "candidates"),
  };
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

test("candidate inventory counts only decision-ready tables", () => {
  const markdown = `
| name | locality / clue | discovery | remaining work |
|---|---|---|---|
| One | Place | <https://example.com/a> | Confirm activity. |
| Two | Place | <https://example.com/b> | Resolve cheese \\| dairy output. |

| Source | Verdict | Note |
|---|---|---|
| Directory | discovery | Not a candidate row. |
`;
  assert.deepEqual(countCandidateTables(markdown), { batches: 1, rows: 2 });
});

test("editorial report joins catalog, candidates and durable evidence", (context) => {
  const roots = fixture(context);
  write(
    path.join(roots.csvRoot, "xx", "region", "area.csv"),
    "slug,producer_id\none,1\ntwo,2\n",
  );
  write(
    path.join(roots.evidenceRoot, "xx", "region", "area.jsonl"),
    [
      {
        slug: "one",
        action: "keep",
        sources: [
          {
            url: "https://example.com/one",
            type: "official-site",
            checkedAt: "2026-09-14",
            claims: ["identity", "producer-activity", "own-offer", "municipality"],
          },
        ],
      },
      {
        slug: "old-candidate",
        action: "reject",
        reason: "not-producer",
        sources: [
          {
            url: "https://example.com/old",
            type: "official-site",
            checkedAt: "2026-09-14",
            claims: ["identity", "scope"],
          },
        ],
      },
    ]
      .map((record) => JSON.stringify(record))
      .join("\n") + "\n",
  );
  write(
    path.join(roots.candidateRoot, "xx", "area.md"),
    `| Name | Municipality / geographic clue | Current evidence | Blocking doubt and next check |
|---|---|---|---|
| Candidate | Place | Source | Confirm own offer. |
`,
  );

  const report = buildEditorialWorkReport({ country: "xx", ...roots });
  assert.deepEqual(report.catalog, { areas: 1, rows: 2 });
  assert.equal(report.candidates.files, 1);
  assert.equal(report.candidates.batches, 1);
  assert.equal(report.candidates.rows, 1);
  assert.equal(report.evidence.records, 2);
  assert.equal(report.evidence.sources, 2);
  assert.equal(report.evidence.actions.keep, 1);
  assert.equal(report.evidence.actions.reject, 1);
  assert.equal(report.evidence.currentKeeps, 1);
  assert.equal(report.evidence.coreClaimKeeps, 1);
});
