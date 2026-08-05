#!/usr/bin/env node
// Genera data/reference/geo-provenance.json: filas cuyo lat/lon coincide con el
// centroide de su municipio (firma del fallback del geocoding gap-fill), para
// que las pasadas de verificación no traten esas coordenadas como ubicación
// exacta de finca/obrador. Regenerable; la normalización y el lookup replican
// los de scripts/audit-csv.js (que no exporta).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSV_ROOT = path.join(ROOT, "data/csv");
const CENTROIDS_PATH = path.join(ROOT, "data/reference/municipalities.json");
const OVERRIDES_PATH = path.join(ROOT, "data/reference/municipality-overrides.json");
const OUTPUT_PATH = path.join(ROOT, "data/reference/geo-provenance.json");

// Copia literal del centroide: tolerancia ~1 m. Direcciones geocodificadas de
// verdad cerca del centro del pueblo no deben etiquetarse.
const TOLERANCE_DEG = 1e-5;

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

function pickCandidate(entry, scope) {
  if (Array.isArray(entry)) {
    if (!scope.region) return null;
    return entry.find((c) => c.region === scope.region) ?? null;
  }
  return entry;
}

// Same scoping as scripts/audit-csv.js: both centroid files are keyed by
// country first, so a municipio is only ever matched inside its own country.
function lookupCentroid(centroids, municipio, scope) {
  if (!centroids || !municipio) return null;
  const main = centroids.main[scope.country];
  if (!main) return null;
  const overrides = centroids.overrides[scope.country] ?? {};
  const stripped = municipio.split(" - ")[0].trim();
  const key1 = normalizeSearch(municipio);
  const key2 = normalizeSearch(stripped);
  const override = overrides[key1] || overrides[key2];
  if (override) {
    return pickCandidate(override, scope);
  }
  return main[key1] || main[key2] || null;
}

function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

async function main() {
  const centroids = {
    main: JSON.parse(await fs.readFile(CENTROIDS_PATH, "utf8")),
    overrides: JSON.parse(await fs.readFile(OVERRIDES_PATH, "utf8")),
  };

  const areas = {};
  let totalRows = 0;
  let totalTagged = 0;

  const readDirs = async (dir) =>
    (await fs.readdir(dir, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

  const countries = await readDirs(CSV_ROOT);
  const pairs = [];
  for (const country of countries) {
    for (const region of await readDirs(path.join(CSV_ROOT, country))) {
      pairs.push({ country, region });
    }
  }

  for (const { country, region } of pairs) {
    const files = (await fs.readdir(path.join(CSV_ROOT, country, region)))
      .filter((f) => f.endsWith(".csv"))
      .sort();
    for (const file of files) {
      const area = file.replace(/\.csv$/, "");
      const text = await fs.readFile(path.join(CSV_ROOT, country, region, file), "utf8");
      const lines = text.split("\n").filter((l) => l.length > 0);
      const header = parseCsvLine(lines[0]);
      const idx = {
        slug: header.indexOf("slug"),
        municipio: header.indexOf("municipio"),
        lat: header.indexOf("lat"),
        lon: header.indexOf("lon"),
      };
      const tagged = [];
      for (const line of lines.slice(1)) {
        const fields = parseCsvLine(line);
        totalRows += 1;
        const lat = Number.parseFloat(fields[idx.lat]);
        const lon = Number.parseFloat(fields[idx.lon]);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
        const centroid = lookupCentroid(centroids, fields[idx.municipio], { country, region });
        if (!centroid) continue;
        if (
          Math.abs(lat - centroid.lat) <= TOLERANCE_DEG &&
          Math.abs(lon - centroid.lon) <= TOLERANCE_DEG
        ) {
          tagged.push(fields[idx.slug]);
        }
      }
      if (tagged.length) {
        areas[`${country}/${region}/${area}`] = tagged.sort();
        totalTagged += tagged.length;
      }
    }
  }

  const output = {
    generatedAt: new Date().toISOString().slice(0, 10),
    generator: "scripts/build-geo-provenance.mjs",
    method: `lat/lon a ±${TOLERANCE_DEG}° del centroide municipal (municipalities.json + overrides): coordenada de pueblo, no de finca/obrador`,
    totals: { rows: totalRows, tagged: totalTagged },
    areas,
  };
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`geo-provenance: ${totalTagged}/${totalRows} filas etiquetadas centroide-municipal`);
  const top = Object.entries(areas)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8);
  for (const [prov, slugs] of top) console.log(`  ${prov}: ${slugs.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
