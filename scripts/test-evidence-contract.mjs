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
  producer_id: "1",
  [FORWARD_COMPATIBILITY_COLUMN]: "ignored safely",
};

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const FIXTURE_HEADER = [...CANONICAL_HEADER, FORWARD_COMPATIBILITY_COLUMN];
const HEADER = FIXTURE_HEADER.map(csvCell).join(",");
const row = (overrides) =>
  FIXTURE_HEADER.map((column) =>
    csvCell({ ...ROW_FIELDS, ...overrides }[column]),
  ).join(",");

function writeLedger(filePath, records) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  );
}

function validKeep() {
  return {
    slug: "productor-uno",
    action: "keep",
    sources: [
      {
        url: "https://example.com",
        type: "official-site",
        checkedAt: "2026-06-15",
        claims: ["identity", "producer-activity", "municipality"],
      },
    ],
  };
}

function validReject() {
  return {
    slug: "candidato-descartado",
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

function validMerge() {
  return {
    slug: "productor-uno-duplicado",
    action: "merge",
    targetSlug: "productor-uno",
    sources: [
      {
        url: "https://example.com/about",
        type: "official-site",
        checkedAt: "2026-06-15",
        claims: ["identity", "duplicate"],
      },
    ],
  };
}

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-evidence-"));
  const csvRoot = path.join(root, "csv");
  const evidenceRoot = path.join(root, "evidence");
  const area = path.join("test-country", "test-region", "test-area");
  const csvPath = path.join(csvRoot, `${area}.csv`);
  const ledgerPath = path.join(evidenceRoot, `${area}.jsonl`);

  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.writeFileSync(
    csvPath,
    `${HEADER}\n${row()}\n${row({ slug: "productor-dos", nombre: "Productor Dos", producer_id: "2" })}\n`,
  );

  return { root, csvRoot, evidenceRoot, ledgerPath };
}

function main() {
  const fixture = createFixture();
  const expectError = (records, fragment) => {
    writeLedger(fixture.ledgerPath, records);
    const { errors } = auditEvidence(fixture);
    assert.ok(
      errors.some((error) => error.includes(fragment)),
      `expected an error containing '${fragment}', got: ${errors.join(" | ") || "(none)"}`,
    );
  };

  try {
    writeLedger(fixture.ledgerPath, [validKeep(), validReject(), validMerge()]);
    let result = auditEvidence(fixture);
    assert.deepEqual(result.errors, []);
    assert.equal(result.catalogAreas, 1);
    assert.equal(result.catalogRows, 2);
    assert.equal(result.files, 1);
    assert.equal(result.records, 3);
    assert.equal(result.documentedRows, 1);
    assert.equal(result.tombstones, 2);

    // The pruned shape is the contract: the old decision block, the reviewer tag
    // and the review date are Git's or the CSV's job, and must not come back.
    expectError(
      [{ ...validKeep(), decision: { verification: "verificado" } }],
      "unknown field(s): decision",
    );
    expectError(
      [{ ...validKeep(), reviewedBy: "test" }],
      "unknown field(s): reviewedBy",
    );
    expectError(
      [{ ...validKeep(), reviewedAt: "2026-06-15" }],
      "unknown field(s): reviewedAt",
    );
    expectError(
      [{ ...validKeep(), producer_id: "1" }],
      "unknown field(s): producer_id",
    );
    expectError(
      [{ ...validKeep(), slug_aliases: "productor-antiguo" }],
      "unknown field(s): slug_aliases",
    );
    expectError([{ ...validKeep(), action: "add" }], "unsupported action 'add'");

    // A keep says the row is in the CSV; a tombstone says it is not.
    expectError(
      [{ ...validKeep(), slug: "productor-inexistente" }],
      "keep record slug does not exist in area CSV",
    );
    expectError(
      [{ ...validReject(), slug: "productor-uno" }],
      "reject slug still exists in area CSV",
    );
    expectError([{ ...validKeep(), reason: "closed" }], "cannot set reason");
    expectError(
      [{ ...validReject(), reason: "inactive" }],
      "unsupported reject reason 'inactive'",
    );
    expectError(
      [{ ...validMerge(), targetSlug: "productor-inexistente" }],
      "is not in area CSV",
    );

    const badClaim = validKeep();
    badClaim.sources[0].claims = ["products"];
    expectError([badClaim], "unsupported claim 'products'");

    const badType = validKeep();
    badType.sources[0].type = "producer-association";
    expectError([badType], "unsupported source type 'producer-association'");

    const futureCheck = validKeep();
    futureCheck.sources[0].checkedAt = "2099-01-01";
    expectError([futureCheck], "checkedAt cannot be in the future");

    const noSources = validKeep();
    noSources.sources = [];
    expectError([noSources], "'sources' must be a non-empty array");

    expectError([validKeep(), validKeep()], "duplicated evidence slug");

    // Coverage is derived and advisory: an empty ledger is valid, just silent.
    writeLedger(fixture.ledgerPath, []);
    result = auditEvidence(fixture);
    assert.deepEqual(result.errors, []);
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
