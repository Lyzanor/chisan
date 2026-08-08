#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { auditEvidence } from "./check-evidence.mjs";

const HEADER =
  "slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta";
const ROW =
  "productor-uno,Productor Uno,Abrera,Vino,Vino,Carrer Major 1,Productor sintético para probar el contrato,,+34600000000,uno@example.com,https://example.com,,,https://www.google.com/maps/place/Uno,41.5,1.9,,verificado,sí,ecommerce";

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
