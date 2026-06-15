#!/usr/bin/env node

const CSV_ROOT = "data/csv";

const METRICS = [
  {
    key: "horario",
    label: "Horario",
    target: 50,
    count: (row) => hasValue(row.horario),
  },
  {
    key: "contacto",
    label: "Contacto",
    target: 90,
    count: (row) => hasValue(row.telefono) || hasValue(row.correo),
  },
  {
    key: "web",
    label: "Web",
    target: 75,
    count: (row) => hasValue(row.web),
  },
  {
    key: "ventaOnline",
    label: "Venta online",
    target: 100,
    count: (row) => isOnlineSalesReviewed(row["Venta online"]),
  },
  {
    key: "social",
    label: "Social",
    target: 60,
    count: (row) => hasValue(row.Facebook) || hasValue(row.Instagram),
  },
  {
    key: "maps",
    label: "Maps",
    target: 100,
    count: (row) => hasValue(row["Google Maps"]),
  },
  {
    key: "coords",
    label: "Coords",
    target: 100,
    count: (row) => hasValue(row.lat) && hasValue(row.lon),
  },
  {
    key: "imagen",
    label: "Imagen",
    target: 60,
    count: (row) => hasValue(row.imagen),
  },
  {
    key: "verificacion",
    label: "Verificación",
    target: 100,
    count: (row) => isVerificationReviewed(row.verificacion),
  },
];

function hasValue(value) {
  return String(value ?? "").trim().length > 0;
}

function normalizeSearch(value) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isOnlineSalesReviewed(value) {
  const normalized = normalizeSearch(value);
  return normalized === "si" || normalized === "no";
}

function isVerificationReviewed(value) {
  const normalized = normalizeSearch(value);
  return normalized === "parcial" || normalized === "verificado";
}

function parseArgs(argv) {
  const args = {
    format: "table",
  };

  for (const arg of argv) {
    if (arg === "--json") {
      args.format = "json";
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

let dependenciesPromise;

async function getDependencies() {
  if (!dependenciesPromise) {
    dependenciesPromise = Promise.all([
      import("node:fs"),
      import("node:path"),
      import("csv-parse/sync"),
    ]).then(([fs, path, csvParse]) => ({
      fs,
      path,
      parse: csvParse.parse,
    }));
  }

  return dependenciesPromise;
}

function listCsvFiles(root, fs, path) {
  return fs
    .readdirSync(root, { recursive: true })
    .filter((file) => file.endsWith(".csv"))
    .map((file) => path.join(root, file))
    .sort();
}

function readRows(csvPath, fs, parse) {
  const raw = fs.readFileSync(csvPath, "utf8");
  return parse(raw, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });
}

function percentage(count, total) {
  if (total === 0) return 0;
  return Math.round((count / total) * 1000) / 10;
}

function auditFile(csvPath, dependencies) {
  const rows = readRows(csvPath, dependencies.fs, dependencies.parse);
  const total = rows.length;
  const counts = Object.fromEntries(
    METRICS.map((metric) => [
      metric.key,
      rows.filter((row) => metric.count(row)).length,
    ]),
  );
  const percentages = Object.fromEntries(
    METRICS.map((metric) => [
      metric.key,
      percentage(counts[metric.key], total),
    ]),
  );
  const progress =
    METRICS.reduce(
      (sum, metric) =>
        sum + Math.min(percentages[metric.key] / metric.target, 1) * 100,
      0,
    ) / METRICS.length;
  const gaps = METRICS.filter(
    (metric) => percentages[metric.key] < metric.target,
  ).map((metric) => metric.key);

  return {
    file: csvPath,
    rows: total,
    counts,
    percentages,
    progress: Math.round(progress * 10) / 10,
    gaps,
  };
}

function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

function printTable(results) {
  console.log(
    `Targets: ${METRICS.map(
      (metric) => `${metric.key} ${formatPercent(metric.target)}`,
    ).join(" · ")}`,
  );
  console.log("");
  console.log(
    [
      "Progress",
      "Rows",
      "CSV",
      "Gaps to target",
      ...METRICS.map((metric) => metric.label),
    ].join("\t"),
  );

  for (const result of results) {
    console.log(
      [
        result.progress.toFixed(1),
        String(result.rows),
        result.file,
        result.gaps.length ? result.gaps.join(",") : "-",
        ...METRICS.map((metric) =>
          formatPercent(result.percentages[metric.key]),
        ),
      ].join("\t"),
    );
  }
}

async function main() {
  const dependencies = await getDependencies();
  const args = parseArgs(process.argv.slice(2));

  const files = listCsvFiles(CSV_ROOT, dependencies.fs, dependencies.path);
  const results = files
    .map((file) => auditFile(file, dependencies))
    .sort((a, b) => a.file.localeCompare(b.file));
  const targets = Object.fromEntries(
    METRICS.map((metric) => [metric.key, metric.target]),
  );

  if (args.format === "json") {
    console.log(JSON.stringify({ targets, results }, null, 2));
    return;
  }

  printTable(results);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
