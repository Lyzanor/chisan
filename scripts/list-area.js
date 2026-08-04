#!/usr/bin/env node

// Compact roster for one area CSV: one line per producer.
// Use it to de-duplicate before discovery and to browse a catalog without
// loading the whole CSV into context.
//
// Usage:
//   node scripts/list-area.js cuenca
//   node scripts/list-area.js data/csv/es/castilla-la-mancha/cuenca.csv
//   node scripts/list-area.js cuenca --categoria "Bodega"
//   node scripts/list-area.js cuenca --pending

let fs;
let path;
let parse;

async function loadDependencies() {
  const [fsMod, pathMod, csvParse] = await Promise.all([
    import("node:fs"),
    import("node:path"),
    import("csv-parse/sync"),
  ]);
  fs = fsMod;
  path = pathMod;
  parse = csvParse.parse;
}

function cleanCell(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return cleanCell(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function parseArgs(argv) {
  let target = null;
  let category = null;
  let onlyPending = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--category" && argv[i + 1]) {
      category = argv[i + 1];
      i += 1;
    } else if (arg === "--pending") {
      onlyPending = true;
    } else if (!arg.startsWith("--")) {
      target = arg;
    }
  }

  return { target, category, onlyPending };
}

function resolveCsvPath(csvRoot, target) {
  if (!target) return null;

  if (target.endsWith(".csv")) {
    const abs = path.resolve(process.cwd(), target);
    return fs.existsSync(abs) ? abs : null;
  }

  const slug = normalize(target).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const matches = [];
  for (const country of fs.readdirSync(csvRoot)) {
    const countryDir = path.join(csvRoot, country);
    if (!fs.statSync(countryDir).isDirectory()) continue;
    for (const region of fs.readdirSync(countryDir)) {
      const dir = path.join(countryDir, region);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const file of fs.readdirSync(dir)) {
        if (file === `${slug}.csv`) matches.push(path.join(dir, file));
      }
    }
  }
  return matches.length === 1 ? matches[0] : matches.length > 1 ? matches : null;
}

async function main() {
  await loadDependencies();

  const csvRoot = path.join(__dirname, "..", "data", "csv");
  const { target, category, onlyPending } = parseArgs(process.argv.slice(2));

  if (!target) {
    console.error("Usage: node scripts/list-area.js <area|path> [--category X] [--pending]");
    process.exit(1);
  }

  const resolved = resolveCsvPath(csvRoot, target);
  if (!resolved) {
    console.error(`Error: no CSV found for '${target}'.`);
    process.exit(1);
  }
  if (Array.isArray(resolved)) {
    console.error(`Error: '${target}' is ambiguous:\n${resolved.join("\n")}`);
    process.exit(1);
  }

  const rows = parse(fs.readFileSync(resolved, "utf8"), {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  });

  const catFilter = category ? normalize(category) : null;
  const counts = { pendiente: 0, parcial: 0, verificado: 0, otro: 0 };
  const lines = [];

  for (const row of rows) {
    const verif = normalize(row.verificacion) || "otro";
    counts[verif in counts ? verif : "otro"] += 1;

    if (catFilter && normalize(row.categoria) !== catFilter) continue;
    if (onlyPending && verif !== "pendiente") continue;

    lines.push(
      [
        cleanCell(row.slug),
        cleanCell(row.nombre),
        cleanCell(row.municipio),
        cleanCell(row.categoria),
        cleanCell(row.verificacion),
        cleanCell(row["Venta online"]),
      ].join(" | "),
    );
  }

  console.log(`# ${path.relative(path.join(__dirname, ".."), resolved)}`);
  console.log(
    `# ${rows.length} filas — verificado ${counts.verificado} · parcial ${counts.parcial} · pendiente ${counts.pendiente}` +
      (counts.otro ? ` · otro ${counts.otro}` : ""),
  );
  console.log("# slug | nombre | municipio | categoria | verificacion | Venta online");
  if (catFilter || onlyPending) {
    console.log(`# (filtrado${catFilter ? ` categoria=${categoria}` : ""}${onlyPending ? " pendientes" : ""}: ${lines.length} filas)`);
  }
  for (const line of lines) console.log(line);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
