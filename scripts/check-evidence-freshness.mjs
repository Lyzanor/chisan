#!/usr/bin/env node

// Cola de mantenimiento (advisory): ordena las filas actuales del CSV por
// antigüedad y riesgo de su evidencia, para que las recomprobaciones empiecen
// por lo más perecedero (venta online). Solo informa: nunca edita datos y no
// forma parte de ningún gate. Por defecto cubre las provincias listadas en
// data/evidence/coverage.json; una provincia sin ledger necesita primera
// pasada (docs/VERIFICATION_TECHNIQUES.md), no mantenimiento.

import fs from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";

const CSV_ROOT = "data/csv";
const EVIDENCE_ROOT = "data/evidence";
const COVERAGE_FILE = path.join(EVIDENCE_ROOT, "coverage.json");
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const BUCKET_LABELS = {
  0: "sí sin canal (cuarentena)",
  1: "sí sin evidencia de venta",
  2: "venta comprobada hace tiempo",
  3: "fila sin registro de evidencia",
  4: "decisión antigua",
};

function usage() {
  console.log(`Uso: node scripts/check-evidence-freshness.mjs [opciones]

Opciones:
  --provincia <stem>   Limita a provincias con ledger (ej. girona); coma o repetible.
  --todas              Incluye toda provincia con ledger, no solo coverage.json.
  --dias <n>           Solo filas con antigüedad >= n días (defecto 0).
  --limit <n>          Máximo de filas listadas (defecto 40; 0 = sin límite).
  --json               Salida JSON completa (resumen + cola sin límite).`);
}

function parseArgs(argv) {
  const args = { provincias: [], todas: false, dias: 0, limit: 40, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") {
      args.json = true;
    } else if (arg === "--todas") {
      args.todas = true;
    } else if (arg === "--provincia") {
      const value = argv[++i];
      if (!value) throw new Error("--provincia requiere un valor");
      args.provincias.push(
        ...value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      );
    } else if (arg === "--dias") {
      args.dias = Number(argv[++i]);
      if (!Number.isFinite(args.dias) || args.dias < 0) {
        throw new Error("--dias requiere un número >= 0");
      }
    } else if (arg === "--limit") {
      args.limit = Number(argv[++i]);
      if (!Number.isInteger(args.limit) || args.limit < 0) {
        throw new Error("--limit requiere un entero >= 0");
      }
    } else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Argumento desconocido: ${arg}`);
    }
  }
  return args;
}

function listLedgers() {
  if (!fs.existsSync(EVIDENCE_ROOT)) return [];
  return fs
    .readdirSync(EVIDENCE_ROOT, { recursive: true })
    .map((file) => String(file))
    .filter((file) => file.endsWith(".jsonl"))
    .map((file) => path.join(EVIDENCE_ROOT, file))
    .sort();
}

function readCoverage() {
  try {
    const parsed = JSON.parse(fs.readFileSync(COVERAGE_FILE, "utf8"));
    return new Set(parsed.strictProvinces ?? []);
  } catch {
    return new Set();
  }
}

function provinceKey(ledgerPath) {
  return path
    .relative(EVIDENCE_ROOT, ledgerPath)
    .replace(/\\/g, "/")
    .replace(/\.jsonl$/, "");
}

function daysSince(isoDate, now) {
  const timestamp = Date.parse(isoDate);
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Math.floor((now - timestamp) / MS_PER_DAY));
}

function latestOnlineSalesCheck(record) {
  let latest = null;
  for (const source of record.sources ?? []) {
    if (!Array.isArray(source.claims)) continue;
    if (!source.claims.includes("online-sales")) continue;
    const when = source.checkedAt ?? record.reviewedAt;
    if (when && (!latest || when > latest)) latest = when;
  }
  return latest;
}

function loadKeeps(ledgerPath) {
  const keeps = new Map();
  let invalid = 0;
  for (const line of fs.readFileSync(ledgerPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const record = JSON.parse(trimmed);
      if (record.action === "keep" && record.slug) keeps.set(record.slug, record);
    } catch {
      invalid += 1;
    }
  }
  return { keeps, invalid };
}

function classifyRow(row, record, now) {
  const vo = (row["Venta online"] ?? "").trim();
  const canal = (row["Canal de venta"] ?? "").trim();
  const isSi = vo === "sí";
  const decisionAge = record ? daysSince(record.reviewedAt, now) : null;
  const voDate = record ? latestOnlineSalesCheck(record) : null;

  if (isSi && !canal) {
    return {
      bucket: 0,
      age: voDate ? daysSince(voDate, now) : decisionAge,
      detail: record ? "re-derivar canal" : "re-derivar canal (sin evidencia)",
    };
  }
  if (isSi && !voDate) {
    return {
      bucket: 1,
      age: decisionAge,
      detail: record ? "keep sin claim online-sales" : "sin registro de evidencia",
    };
  }
  if (isSi) {
    return { bucket: 2, age: daysSince(voDate, now), detail: `venta comprobada ${voDate}` };
  }
  if (!record) {
    return { bucket: 3, age: null, detail: "sin registro de evidencia" };
  }
  return { bucket: 4, age: decisionAge, detail: `decisión ${record.reviewedAt}` };
}

function formatAge(age) {
  return age === null ? "—" : `${age}d`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const now = Date.now();
  const coverage = readCoverage();

  let ledgers = listLedgers();
  if (args.provincias.length) {
    ledgers = ledgers.filter((ledger) =>
      args.provincias.includes(path.basename(ledger, ".jsonl")),
    );
    for (const stem of args.provincias) {
      if (!ledgers.some((ledger) => path.basename(ledger, ".jsonl") === stem)) {
        console.error(
          `Aviso: «${stem}» no tiene ledger de evidencia; necesita primera pasada, no mantenimiento.`,
        );
      }
    }
  } else if (!args.todas) {
    ledgers = ledgers.filter((ledger) => coverage.has(provinceKey(ledger)));
  }

  const queue = [];
  const summaries = [];
  for (const ledger of ledgers) {
    const key = provinceKey(ledger);
    const csvPath = path.join(CSV_ROOT, `${key}.csv`);
    if (!fs.existsSync(csvPath)) continue;
    const rows = parse(fs.readFileSync(csvPath), {
      bom: true,
      columns: true,
      skip_empty_lines: true,
    });
    const { keeps, invalid } = loadKeeps(ledger);

    let withEvidence = 0;
    let siCount = 0;
    let siSinCanal = 0;
    let oldestSale = null;
    for (const row of rows) {
      const slug = (row.slug ?? "").trim();
      const record = keeps.get(slug);
      if (record) withEvidence += 1;
      const vo = (row["Venta online"] ?? "").trim();
      if (vo === "sí") {
        siCount += 1;
        if (!(row["Canal de venta"] ?? "").trim()) siSinCanal += 1;
      }
      const { bucket, age, detail } = classifyRow(row, record, now);
      if (bucket === 2 && age !== null && (oldestSale === null || age > oldestSale)) {
        oldestSale = age;
      }
      queue.push({
        provincia: key,
        slug,
        verificacion: (row.verificacion ?? "").trim(),
        ventaOnline: vo,
        canal: (row["Canal de venta"] ?? "").trim(),
        bucket,
        bucketLabel: BUCKET_LABELS[bucket],
        edadDias: age,
        detalle: detail,
      });
    }
    summaries.push({
      provincia: key,
      filas: rows.length,
      conEvidencia: withEvidence,
      si: siCount,
      siSinCanal,
      ventaMasAntiguaDias: oldestSale,
      lineasInvalidas: invalid,
    });
  }

  const filtered = queue
    .filter((entry) => entry.edadDias === null || entry.edadDias >= args.dias)
    .sort(
      (a, b) =>
        a.bucket - b.bucket ||
        (b.edadDias ?? Number.POSITIVE_INFINITY) - (a.edadDias ?? Number.POSITIVE_INFINITY),
    );

  if (args.json) {
    console.log(
      JSON.stringify(
        { generadoEl: new Date(now).toISOString().slice(0, 10), resumen: summaries, cola: filtered },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `Cola de frescura — ${summaries.length} provincia(s), ${queue.length} filas evaluadas, ` +
      `${filtered.length} en cola (antigüedad >= ${args.dias}d).`,
  );
  console.log("");
  for (const summary of summaries) {
    const oldest =
      summary.ventaMasAntiguaDias === null ? "—" : `${summary.ventaMasAntiguaDias}d`;
    console.log(
      `${summary.provincia}: ${summary.filas} filas · ${summary.conEvidencia} con evidencia · ` +
        `sí=${summary.si} (${summary.siSinCanal} sin canal) · venta más antigua: ${oldest}` +
        (summary.lineasInvalidas ? ` · ${summary.lineasInvalidas} líneas JSONL inválidas` : ""),
    );
  }
  console.log("");

  const shown = args.limit === 0 ? filtered : filtered.slice(0, args.limit);
  console.log(["EDAD", "ESTADO", "FILA", "MOTIVO"].join("\t"));
  for (const entry of shown) {
    const estado = `${entry.ventaOnline}${entry.canal ? `(${entry.canal})` : ""}·${entry.verificacion}`;
    console.log(
      [formatAge(entry.edadDias), estado, `${entry.provincia}/${entry.slug}`, entry.detalle].join(
        "\t",
      ),
    );
  }
  if (shown.length < filtered.length) {
    console.log(`… ${filtered.length - shown.length} filas más (usa --limit 0 o --json).`);
  }
  console.log("");
  console.log(
    "Recomprueba y actualiza CSV + JSONL según docs/VERIFICATION_TECHNIQUES.md (Mantenimiento).",
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
