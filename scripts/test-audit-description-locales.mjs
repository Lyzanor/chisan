import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { stringify } from "csv-stringify/sync";

import {
  auditDescriptionLocales,
  parseDescriptionLocaleAuditArgs,
  writeDescriptionLocaleAuditReport,
} from "./audit-description-locales.mjs";

const SCRIPT_PATH = path.resolve("scripts/audit-description-locales.mjs");
const HEADER = [
  "slug",
  "nombre",
  "municipio",
  "categoria",
  "productos estrella",
  "direccion",
  "descripcion",
  "horario",
  "telefono",
  "correo",
  "web",
  "Facebook",
  "Instagram",
  "Google Maps",
  "lat",
  "lon",
  "imagen",
  "verificacion",
  "Venta online",
  "Canal de venta",
  "categorias adicionales",
  "producer_id",
  "descripcion_locale",
];

function fixtureRoot(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-locale-audit-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function row(producerId, description, locale) {
  return {
    slug: `producer-${producerId}`,
    nombre: `Producer ${producerId}`,
    municipio: "Place",
    categoria: "Vino",
    descripcion: description,
    verificacion: "pendiente",
    "Venta online": "no comprobado",
    producer_id: String(producerId),
    descripcion_locale: locale,
  };
}

function writeArea(root, area, rows) {
  const directory = path.join(root, "es", "catalunya");
  fs.mkdirSync(directory, { recursive: true });
  const filePath = path.join(directory, `${area}.csv`);
  fs.writeFileSync(filePath, stringify(rows, { header: true, columns: HEADER }));
  return filePath;
}

test("source-locale audit is deterministic and emits candidates without decisions", (context) => {
  const root = fixtureRoot(context);
  const filePath = writeArea(root, "barcelona", [
    row(1, "Celler familiar amb producció pròpia i venda directa.", "es"),
    row(2, "Bodega familiar con producción propia y venta directa.", "es"),
    row(3, "家族経営の農園で有機野菜を生産し、直売しています。", "en"),
  ]);
  const before = fs.readFileSync(filePath, "utf8");
  const options = {
    csvRoot: root,
    country: "es",
    candidateLocales: ["ca", "ja"],
  };

  const first = auditDescriptionLocales(options);
  const second = auditDescriptionLocales(options);

  assert.deepEqual(first, second);
  assert.equal(first.review_status, "unreviewed_candidates");
  assert.equal(first.summary.candidates, 2);
  assert.deepEqual(
    first.candidates.map((candidate) => [candidate.producer_id, candidate.candidate_locale]),
    [
      ["1", "ca"],
      ["3", "ja"],
    ],
  );
  assert.equal(first.candidates[0].decision, undefined);
  assert.match(first.candidates[0].source_hash, /^[a-f0-9]{64}$/);
  assert.match(first.report_hash, /^[a-f0-9]{64}$/);
  assert.equal(fs.readFileSync(filePath, "utf8"), before);
});

test("unrestricted detection recognizes source languages without inferring UI activation", (context) => {
  const root = fixtureRoot(context);
  writeArea(root, "barcelona", [
    row(
      1,
      "Ferme familiale qui produit des légumes biologiques et vend directement à la ferme.",
      "es",
    ),
    row(
      2,
      "Azienda agricola familiare che produce olio biologico e vende direttamente in azienda.",
      "es",
    ),
    row(3, "Granxa familiar que produce queixos e vende directamente na explotación.", "es"),
  ]);

  const report = auditDescriptionLocales({ csvRoot: root, country: "es" });
  assert.equal(report.summary.unregistered_source_language_candidates, 0);
  assert.deepEqual(
    report.candidates.map((candidate) => [
      candidate.candidate_language,
      candidate.candidate_locale,
    ]),
    [
      ["fra", "fr"],
      ["ita", "it"],
      ["glg", "gl"],
    ],
  );
  assert.ok(report.candidates.every((candidate) => candidate.classifier_score === undefined));

  const catalanOnly = auditDescriptionLocales({
    csvRoot: root,
    country: "es",
    candidateLocales: ["ca"],
  });
  assert.equal(catalanOnly.summary.candidates, 0);
  assert.equal(catalanOnly.summary.candidate_locale_filtered, 3);
  assert.equal(catalanOnly.scope.unrestricted_detection, true);

  const frenchOnly = auditDescriptionLocales({
    csvRoot: root,
    country: "es",
    candidateLocales: ["fr"],
  });
  assert.equal(frenchOnly.summary.candidates, 1);
  assert.equal(frenchOnly.candidates[0].candidate_locale, "fr");
});

test("full-review roster is exhaustive and does not turn classifier output into a decision", (context) => {
  const root = fixtureRoot(context);
  writeArea(root, "barcelona", [
    row(1, "Celler familiar amb producció pròpia i venda directa.", "es"),
    row(2, "Bodega familiar con producción propia y venta directa.", "es"),
  ]);

  const report = auditDescriptionLocales({
    csvRoot: root,
    country: "es",
    areas: ["barcelona"],
    fullReviewRoster: true,
  });
  assert.equal(report.review_status, "full_review_roster");
  assert.equal(report.summary.review_items, 2);
  assert.equal(report.candidates, undefined);
  assert.ok(report.review_items.every((item) => item.candidate_locale === undefined));
  assert.ok(report.review_items.every((item) => /^[a-f0-9]{64}$/.test(item.source_hash)));
});

test("report output cannot enter or overwrite canonical state", (context) => {
  const root = fixtureRoot(context);
  const filePath = writeArea(root, "barcelona", [
    row(1, "Celler familiar amb producció pròpia i venda directa.", "es"),
  ]);
  const before = fs.readFileSync(filePath, "utf8");
  const report = auditDescriptionLocales({ csvRoot: root, country: "es" });
  const outputPath = path.join(path.dirname(root), `${path.basename(root)}-review.json`);
  context.after(() => fs.rmSync(outputPath, { force: true }));

  writeDescriptionLocaleAuditReport(report, outputPath, root);
  assert.deepEqual(JSON.parse(fs.readFileSync(outputPath, "utf8")), report);
  assert.throws(
    () => writeDescriptionLocaleAuditReport(report, outputPath, root),
    /EEXIST/,
  );
  assert.throws(
    () => writeDescriptionLocaleAuditReport(report, path.join(root, "review.json"), root),
    /outside the canonical CSV tree/,
  );
  assert.throws(
    () =>
      writeDescriptionLocaleAuditReport(
        report,
        path.resolve("docs", "description locale review.json"),
        root,
      ),
    /system temporary directory/,
  );

  const linkPath = path.join(path.dirname(root), `${path.basename(root)}-csv-link`);
  fs.symlinkSync(path.join(root, "es", "catalunya"), linkPath, "dir");
  context.after(() => fs.rmSync(linkPath, { force: true }));
  assert.throws(
    () => writeDescriptionLocaleAuditReport(report, path.join(linkPath, "review.json"), root),
    /outside the canonical CSV tree/,
  );
  assert.equal(fs.readFileSync(filePath, "utf8"), before);
});

test("CLI rejects mutation flags and honors narrow review scope", (context) => {
  const root = fixtureRoot(context);
  writeArea(root, "barcelona", [
    row(1, "Celler familiar amb producció pròpia i venda directa.", "es"),
  ]);
  writeArea(root, "girona", [
    row(2, "Bodega familiar con producción propia y venta directa.", "es"),
  ]);

  const parsed = parseDescriptionLocaleAuditArgs([
    "--",
    "--root",
    root,
    "--country",
    "es",
    "--area",
    "barcelona",
    "--declared-locale",
    "es",
    "--candidate-locale",
    "ca",
  ]);
  const report = auditDescriptionLocales(parsed);
  assert.equal(report.summary.descriptions_in_scope, 1);
  assert.equal(report.summary.candidates, 1);

  assert.throws(
    () => parseDescriptionLocaleAuditArgs(["--country", "es", "--write"]),
    /Unknown argument '--write'/,
  );
  const cli = spawnSync(
    process.execPath,
    [SCRIPT_PATH, "--root", root, "--country", "es", "--write"],
    { encoding: "utf8" },
  );
  assert.notEqual(cli.status, 0);
  assert.match(cli.stderr, /Unknown argument '--write'/);

  assert.throws(
    () => auditDescriptionLocales({ csvRoot: root, country: "zz" }),
    /Unknown catalog country 'zz'/,
  );
});
