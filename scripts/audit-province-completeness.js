#!/usr/bin/env node

const CSV_ROOT = "data/csv";
const DEFAULT_BASELINE = "data/csv/catalunya/barcelona.csv";

const METRICS = [
  {
    key: "horario",
    label: "Horario",
    count: (row) => hasValue(row.horario),
  },
  {
    key: "contacto",
    label: "Contacto",
    count: (row) => hasValue(row.telefono) || hasValue(row.correo),
  },
  {
    key: "web",
    label: "Web",
    count: (row) => hasValue(row.web),
  },
  {
    key: "social",
    label: "Social",
    count: (row) => hasValue(row.Facebook) || hasValue(row.Instagram),
  },
  {
    key: "maps",
    label: "Maps",
    count: (row) => hasValue(row["Google Maps"]),
  },
  {
    key: "coords",
    label: "Coords",
    count: (row) => hasValue(row.lat) && hasValue(row.lon),
  },
  {
    key: "imagen",
    label: "Imagen",
    count: (row) => hasValue(row.imagen),
  },
];

function hasValue(value) {
  return String(value ?? "").trim().length > 0;
}

function parseArgs(argv) {
  const args = {
    baseline: DEFAULT_BASELINE,
    format: "table",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--baseline" && argv[index + 1]) {
      args.baseline = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--baseline=")) {
      args.baseline = arg.slice("--baseline=".length);
      continue;
    }

    if (arg === "--json") {
      args.format = "json";
      continue;
    }
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

function auditFile(csvPath, dependencies, baselinePercentages = null) {
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
  const score =
    METRICS.reduce((sum, metric) => sum + percentages[metric.key], 0) /
    METRICS.length;
  const belowBaseline = baselinePercentages
    ? METRICS.filter(
        (metric) => percentages[metric.key] < baselinePercentages[metric.key],
      ).map((metric) => metric.key)
    : [];

  return {
    file: csvPath,
    rows: total,
    counts,
    percentages,
    score: Math.round(score * 10) / 10,
    belowBaseline,
  };
}

function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

function printTable(results, baseline) {
  console.log(`Baseline: ${baseline.file}`);
  console.log(
    `Baseline score: ${baseline.score} · rows: ${baseline.rows} · ${METRICS.map(
      (metric) => `${metric.key} ${formatPercent(baseline.percentages[metric.key])}`,
    ).join(" · ")}`,
  );
  console.log("");
  console.log(
    [
      "Score",
      "Rows",
      "CSV",
      "Below Barcelona",
      ...METRICS.map((metric) => metric.label),
    ].join("\t"),
  );

  for (const result of results) {
    console.log(
      [
        result.score.toFixed(1),
        String(result.rows),
        result.file,
        result.belowBaseline.length ? result.belowBaseline.join(",") : "-",
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
  const baselinePath = dependencies.path.normalize(args.baseline);

  if (!dependencies.fs.existsSync(baselinePath)) {
    console.error(`Baseline CSV not found: ${baselinePath}`);
    process.exit(1);
  }

  const baseline = auditFile(baselinePath, dependencies);
  const files = listCsvFiles(CSV_ROOT, dependencies.fs, dependencies.path);
  const results = files
    .map((file) => auditFile(file, dependencies, baseline.percentages))
    .sort((a, b) => a.score - b.score || a.file.localeCompare(b.file));

  if (args.format === "json") {
    console.log(JSON.stringify({ baseline, results }, null, 2));
    return;
  }

  printTable(results, baseline);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
