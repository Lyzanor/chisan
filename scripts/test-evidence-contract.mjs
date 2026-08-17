#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import csvAudit from "./audit-csv.js";
import { auditEvidence } from "./check-evidence.mjs";

const { CANONICAL_HEADER } = csvAudit;
const FORWARD_COMPATIBILITY_COLUMN = "future optional field";
const ROW_FIELDS = {
  slug: "productor-uno",
  nombre: "Productor Uno",
  municipio: "Abrera",
  categoria: "Vino",
  "productos estrella": "Vino",
  direccion: "Carrer Major 1",
  descripcion: "Productor sintético para probar el contrato",
  telefono: "+34600000000",
  correo: "uno@example.com",
  web: "https://example.com",
  "Google Maps": "https://www.google.com/maps/place/Uno",
  lat: "41.5",
  lon: "1.9",
  verificacion: "verificado",
  "Venta online": "sí",
  "Canal de venta": "ecommerce",
  [FORWARD_COMPATIBILITY_COLUMN]: "ignored safely",
};

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const FIXTURE_HEADER = [...CANONICAL_HEADER, FORWARD_COMPATIBILITY_COLUMN];
const HEADER = FIXTURE_HEADER.map(csvCell).join(",");
const ROW = FIXTURE_HEADER.map((column) => csvCell(ROW_FIELDS[column])).join(",");

function writeLedger(filePath, records) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  );
}

function validRecord() {
  return {
    slug: "productor-uno",
    reviewedAt: "2026-06-15",
    reviewedBy: "test",
    action: "keep",
    decision: {
      verification: "verificado",
      onlineSales: "sí",
      salesChannels: ["ecommerce"],
    },
    sources: [
      {
        url: "https://example.com",
        type: "official-site",
        checkedAt: "2026-06-15",
        claims: [
          "identity",
          "producer-activity",
          "municipality",
          "online-sales",
        ],
      },
    ],
  };
}

function validRejectRecord() {
  return {
    slug: "candidato-descartado",
    reviewedAt: "2026-06-15",
    reviewedBy: "test",
    action: "reject",
    reason: "not-producer",
    sources: [
      {
        url: "https://example.com/candidate",
        type: "official-site",
        checkedAt: "2026-06-15",
        claims: ["identity", "scope"],
      },
    ],
  };
}

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "km0-evidence-"));
  const csvRoot = path.join(root, "csv");
  const evidenceRoot = path.join(root, "evidence");
  const csvPath = path.join(
    csvRoot,
    "test-country",
    "test-region",
    "test-area.csv",
  );
  const ledgerPath = path.join(
    evidenceRoot,
    "test-country",
    "test-region",
    "test-area.jsonl",
  );

  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.writeFileSync(csvPath, `${HEADER}\n${ROW}\n`);

  return { root, csvRoot, evidenceRoot, ledgerPath };
}

function main() {
  const fixture = createFixture();
  try {
    writeLedger(fixture.ledgerPath, [validRecord()]);
    let result = auditEvidence(fixture);
    assert.deepEqual(result.errors, []);
    assert.equal(result.catalogAreas, 1);
    assert.equal(result.catalogRows, 1);
    assert.equal(result.files, 1);
    assert.equal(result.completeAreas, 1);
    assert.equal(result.documentedRows, 1);

    const missingClaim = validRecord();
    missingClaim.sources[0].claims = ["identity", "municipality", "online-sales"];
    writeLedger(fixture.ledgerPath, [missingClaim]);
    result = auditEvidence(fixture);
    assert.ok(
      result.errors.some((error) =>
        error.includes("missing required claim 'producer-activity'"),
      ),
    );

    const mismatchedDecision = validRecord();
    mismatchedDecision.decision.onlineSales = "no";
    mismatchedDecision.decision.salesChannels = [];
    writeLedger(fixture.ledgerPath, [mismatchedDecision]);
    result = auditEvidence(fixture);
    assert.ok(
      result.errors.some((error) => error.includes("does not match CSV")),
    );

    const sourceAfterReview = validRecord();
    sourceAfterReview.reviewedAt = "2026-06-14";
    writeLedger(fixture.ledgerPath, [sourceAfterReview]);
    result = auditEvidence(fixture);
    assert.ok(
      result.errors.some((error) =>
        error.includes("checkedAt cannot be after reviewedAt"),
      ),
    );

    writeLedger(fixture.ledgerPath, [validRejectRecord()]);
    result = auditEvidence(fixture);
    assert.deepEqual(result.errors, []);

    const uncertainReject = validRejectRecord();
    uncertainReject.sources[0].claims = ["identity"];
    writeLedger(fixture.ledgerPath, [uncertainReject]);
    result = auditEvidence(fixture);
    assert.ok(
      result.errors.some((error) =>
        error.includes("missing required claim 'scope'"),
      ),
    );

    const publishedReject = validRejectRecord();
    publishedReject.slug = "productor-uno";
    writeLedger(fixture.ledgerPath, [publishedReject]);
    result = auditEvidence(fixture);
    assert.ok(
      result.errors.some((error) =>
        error.includes("reject slug still exists in area CSV"),
      ),
    );

    // Coverage is derived and advisory: an empty ledger is valid but incomplete.
    writeLedger(fixture.ledgerPath, []);
    result = auditEvidence(fixture);
    assert.deepEqual(result.errors, []);
    assert.equal(result.completeAreas, 0);
    assert.equal(result.documentedRows, 0);

    console.log("Evidence contract tests OK.");
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
