#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { auditEvidence } from "./check-evidence.mjs";

const HEADER =
  "slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta";
const ROW =
  "productor-uno,Productor Uno,Abrera,Bodega,Vino,Carrer Major 1,Productor sintético para probar el contrato,,+34600000000,uno@example.com,https://example.com,,,https://www.google.com/maps/place/Uno,41.5,1.9,,verificado,sí,ecommerce";

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

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

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "km0-evidence-"));
  const csvRoot = path.join(root, "csv");
  const evidenceRoot = path.join(root, "evidence");
  const csvPath = path.join(
    csvRoot,
    "test-country",
    "test-community",
    "test-province.csv",
  );
  const ledgerPath = path.join(
    evidenceRoot,
    "test-country",
    "test-community",
    "test-province.jsonl",
  );

  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.writeFileSync(csvPath, `${HEADER}\n${ROW}\n`);
  writeJson(path.join(evidenceRoot, "coverage.json"), {
    version: 1,
    strictAreas: [],
  });

  return { root, csvRoot, evidenceRoot, ledgerPath };
}

function main() {
  const fixture = createFixture();
  try {
    writeLedger(fixture.ledgerPath, [validRecord()]);
    let result = auditEvidence(fixture);
    assert.deepEqual(result.errors, []);

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

    // Strict coverage is advisory: a province listed in coverage.json with an
    // empty ledger must not raise a blocking "missing keep record" error.
    writeLedger(fixture.ledgerPath, []);
    writeJson(path.join(fixture.evidenceRoot, "coverage.json"), {
      version: 1,
      strictAreas: ["test-country/test-community/test-province"],
    });
    result = auditEvidence(fixture);
    assert.ok(
      !result.errors.some((error) =>
        error.includes("strict coverage missing keep record"),
      ),
      "strict coverage must no longer require keep records",
    );

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
