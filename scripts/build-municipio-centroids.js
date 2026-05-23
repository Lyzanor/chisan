#!/usr/bin/env node
// Maintenance utility: regenerate data/reference/municipios.json from Wikidata.
//
// Source
// - Wikidata SPARQL endpoint: https://query.wikidata.org/sparql
// - Selects every entity classified (transitively via P31/P279*) as
//   "municipality of Spain" (Q2074737) that has point coordinates (P625).
// - Pulls rdfs:label and skos:altLabel in es / ca / gl / eu / an / ast
//   so multilingual variants (Monóvar / Monòver, Mutxamel / Muchamiel, ...)
//   all map to the same centroid.
//
// Output
// - data/reference/municipios.json
//   { "<normalized-key>": { lat, lon, label } }
//   Keys are produced by normalizeSearch (lowercase, ASCII, single spaces),
//   matching how scripts/audit-csv.js looks up the municipio column.
//
// When to re-run
// - You suspect the lookup is missing a real municipio (Wikidata may have
//   updated; new municipios are rare but happen).
// - Periodic refresh (yearly is fine — municipios change slowly).
// - After making producer additions that flag many new geo-check warnings
//   in case some are due to lookup gaps.
//
// Usage
//   node scripts/build-municipio-centroids.js
//
// Notes
// - Self-contained: uses native fetch (Node 18+), no extra deps.
// - The script overwrites data/reference/municipios.json in place; commit
//   the result if it differs.
// - Two SPARQL requests, ~30 seconds total on a normal connection.

const ENDPOINT = "https://query.wikidata.org/sparql";
const USER_AGENT = "km0-municipio-centroids/1.0 (https://github.com/Lyzanor/km0)";
const LANGS = ["es", "ca", "gl", "eu", "an", "ast"];
const REQUEST_TIMEOUT_MS = 120000;

const LANG_FILTER = LANGS.map((l) => `"${l}"`).join(", ");
const QUERIES = {
  labels: `SELECT ?item ?label ?coord WHERE {
  ?item wdt:P31/wdt:P279* wd:Q2074737;
        wdt:P625 ?coord.
  ?item rdfs:label ?label.
  FILTER(LANG(?label) IN (${LANG_FILTER})).
}`,
  alt: `SELECT ?item ?alt WHERE {
  ?item wdt:P31/wdt:P279* wd:Q2074737;
        wdt:P625 ?coord;
        skos:altLabel ?alt.
  FILTER(LANG(?alt) IN (${LANG_FILTER})).
}`,
};

async function sparql(query) {
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": USER_AGENT,
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Wikidata HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseWkt(wkt) {
  const m = wkt.match(/Point\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/);
  if (!m) return null;
  return { lon: Number(m[1]), lat: Number(m[2]) };
}

async function main() {
  const fs = await import("node:fs");
  const path = await import("node:path");

  console.log("Fetching labels from Wikidata...");
  const labelsRaw = await sparql(QUERIES.labels);
  console.log(`  ${labelsRaw.results.bindings.length} label bindings`);

  console.log("Fetching altLabels from Wikidata...");
  const altRaw = await sparql(QUERIES.alt);
  console.log(`  ${altRaw.results.bindings.length} altLabel bindings`);

  const items = new Map(); // qid -> { coord, labels: Set, canonical }
  for (const b of labelsRaw.results.bindings) {
    const qid = b.item.value.split("/").pop();
    const coord = parseWkt(b.coord.value);
    if (!coord) continue;
    const lbl = b.label.value;
    if (!items.has(qid)) {
      items.set(qid, { coord, labels: new Set(), canonical: lbl });
    }
    const entry = items.get(qid);
    entry.labels.add(lbl);
    if (b.label["xml:lang"] === "es") entry.canonical = lbl;
  }
  for (const b of altRaw.results.bindings) {
    const qid = b.item.value.split("/").pop();
    const entry = items.get(qid);
    if (entry) entry.labels.add(b.alt.value);
  }

  const lookup = {};
  const owners = new Map(); // key -> qid (collision tracking)
  let collisions = 0;
  for (const [qid, entry] of items) {
    for (const lbl of entry.labels) {
      const key = normalize(lbl);
      if (!key) continue;
      if (owners.has(key) && owners.get(key) !== qid) {
        collisions++;
        continue;
      }
      owners.set(key, qid);
      lookup[key] = {
        lat: Number(entry.coord.lat.toFixed(5)),
        lon: Number(entry.coord.lon.toFixed(5)),
        label: entry.canonical,
      };
    }
  }

  const outPath = path.join(__dirname, "..", "data", "reference", "municipios.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(lookup) + "\n");

  const sizeKb = Math.round(fs.statSync(outPath).size / 1024);
  console.log("---");
  console.log(`Wikidata items: ${items.size}`);
  console.log(`Lookup keys: ${Object.keys(lookup).length} (${collisions} collisions skipped)`);
  console.log(`Output: ${path.relative(process.cwd(), outPath)} (${sizeKb} KB)`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
