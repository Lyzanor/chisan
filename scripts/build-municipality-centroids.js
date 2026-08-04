#!/usr/bin/env node
// Maintenance utility: regenerate data/reference/municipalities.json from Wikidata.
//
// Source
// - Wikidata SPARQL endpoint: https://query.wikidata.org/sparql
// - One catalog per country in data/csv:
//   - Spain: every entity classified (transitively via P31/P279*) as
//     "municipality of Spain" (Q2074737) with point coordinates (P625).
//     Labels in es / ca / gl / eu / an / ast so multilingual variants
//     (Monóvar / Monòver, Mutxamel / Muchamiel, ...) share one centroid.
//   - Japan: "municipality of Japan" (Q1054813) with coordinates, minus
//     anything carrying a dissolution date (P576) — the Heisei mergers left
//     ~13.000 dissolved municipalities in Wikidata. Labels in en (the rōmaji
//     the CSVs use) and ja (so a kanji spelling also resolves).
//   - Portugal: "municipality of Portugal" (Q13217644) with coordinates — the
//     308 concelhos, islands included. Labels in pt only: the CSVs write them
//     in Portuguese and no concelho carries a dissolution date, so neither an
//     extra language nor the Japanese filter buys anything.
//
// Output
// - data/reference/municipalities.json
//   { "<normalized-key>": { lat, lon, label } }
//   Keys are produced by normalizeSearch (lowercase, ASCII, single spaces),
//   matching how scripts/audit-csv.js looks up the municipio column.
//   Spain is written first and wins any cross-country key collision, so
//   adding another country can never move an existing Spanish centroid. The
//   losing side is resolved by region in municipality-overrides.json.
//
// When to re-run
// - You suspect the lookup is missing a real municipio (Wikidata may have
//   updated; new municipios are rare but happen).
// - Periodic refresh (yearly is fine — municipios change slowly).
// - After making producer additions that flag many new geo-check warnings
//   in case some are due to lookup gaps.
//
// Usage
//   node scripts/build-municipality-centroids.js             merge: keep every key
//                                                         already committed, add
//                                                         the ones Wikidata grew
//   node scripts/build-municipality-centroids.js --refresh    take the rebuild as is
//
// Notes
// - Self-contained: uses native fetch (Node 18+), no extra deps.
// - The script rewrites data/reference/municipalities.json in place; commit the
//   result if it differs. Default runs are additive, so the diff is reviewable.
//   `--refresh` also moves existing centroids: measured once against the file
//   committed in August 2026, a plain rebuild changed 149 keys and dropped 17,
//   most of them homonyms whose winner flipped rather than real corrections.
// - Two SPARQL requests per country, ~1-2 minutes total on a normal connection.
// - Cross-language label collisions (e.g. Catalan "Figueres" → both real
//   Figueres in Girona and Higueras in Castellón) cause one entity to win
//   the key arbitrarily. Known collisions are disambiguated via
//   data/reference/municipality-overrides.json, which is loaded by
//   scripts/audit-csv.js after this file and resolves the match using the
//   region slug inferred from the CSV path. This file is not
//   touched by the rebuild.

const ENDPOINT = "https://query.wikidata.org/sparql";
const USER_AGENT = "km0-municipio-centroids/1.0 (https://github.com/Lyzanor/km0)";
const REQUEST_TIMEOUT_MS = 120000;

const langFilter = (langs) => langs.map((l) => `"${l}"`).join(", ");

// Order matters: the first country to claim a normalized key keeps it, so Spain
// stays authoritative for names that exist in both catalogs.
const COUNTRIES = [
  {
    slug: "spain",
    label: "Spain",
    rootClass: "wd:Q2074737",
    langs: ["es", "ca", "gl", "eu", "an", "ast"],
    canonicalLang: "es",
    extraFilter: "",
  },
  {
    slug: "japan",
    label: "Japan",
    rootClass: "wd:Q1054813",
    langs: ["en", "ja"],
    canonicalLang: "en",
    extraFilter: "  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }\n",
  },
  {
    slug: "portugal",
    label: "Portugal",
    rootClass: "wd:Q13217644",
    langs: ["pt"],
    canonicalLang: "pt",
    extraFilter: "",
  },
];

function buildQueries(country) {
  return {
    labels: `SELECT ?item ?label ?coord WHERE {
  ?item wdt:P31/wdt:P279* ${country.rootClass};
        wdt:P625 ?coord.
${country.extraFilter}  ?item rdfs:label ?label.
  FILTER(LANG(?label) IN (${langFilter(country.langs)})).
}`,
    alt: `SELECT ?item ?alt WHERE {
  ?item wdt:P31/wdt:P279* ${country.rootClass};
        wdt:P625 ?coord;
        skos:altLabel ?alt.
${country.extraFilter}  FILTER(LANG(?alt) IN (${langFilter(country.langs)})).
}`,
  };
}

async function fetchSparql(query) {
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
    const body = await res.text();
    if (!res.ok) {
      throw new Error(`Wikidata HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    // Under load the endpoint hangs up mid-body: HTTP 200, well-formed prefix,
    // and the JSON simply stops inside an object. That reads as a parse error
    // but is a transport failure, so it is worth retrying rather than reporting.
    return JSON.parse(body);
  } finally {
    clearTimeout(timer);
  }
}

async function sparql(query, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetchSparql(query);
    } catch (err) {
      if (attempt >= attempts) throw err;
      console.log(`  attempt ${attempt}/${attempts} failed (${err.message.slice(0, 90)}); retrying...`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 5000));
    }
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

async function collectItems(country) {
  const queries = buildQueries(country);

  console.log(`[${country.label}] fetching labels from Wikidata...`);
  const labelsRaw = await sparql(queries.labels);
  console.log(`  ${labelsRaw.results.bindings.length} label bindings`);

  console.log(`[${country.label}] fetching altLabels from Wikidata...`);
  const altRaw = await sparql(queries.alt);
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
    if (b.label["xml:lang"] === country.canonicalLang) entry.canonical = lbl;
  }
  for (const b of altRaw.results.bindings) {
    const qid = b.item.value.split("/").pop();
    const entry = items.get(qid);
    if (entry) entry.labels.add(b.alt.value);
  }

  return items;
}

async function main() {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const refresh = process.argv.includes("--refresh");
  const lookup = {};
  const owners = new Map(); // key -> { qid, country } (collision tracking)
  const summaries = [];
  const crossCountry = [];

  for (const country of COUNTRIES) {
    const items = await collectItems(country);
    let keys = 0;
    let collisions = 0;

    for (const [qid, entry] of items) {
      for (const lbl of entry.labels) {
        const key = normalize(lbl);
        if (!key) continue;
        const owner = owners.get(key);
        if (owner && owner.qid !== qid) {
          collisions++;
          // A name shared across countries is the dangerous kind: the loser's
          // rows would measure their distance against a town on another
          // continent, which is a blocking geo error rather than a skip.
          // Disambiguate those in data/reference/municipality-overrides.json.
          if (owner.country !== country.slug) crossCountry.push(`${lbl} (${country.slug} lost to ${owner.country})`);
          continue;
        }
        if (!owner) keys++;
        owners.set(key, { qid, country: country.slug });
        lookup[key] = {
          lat: Number(entry.coord.lat.toFixed(5)),
          lon: Number(entry.coord.lon.toFixed(5)),
          label: entry.canonical,
        };
      }
    }

    summaries.push({ label: country.label, items: items.size, keys, collisions });
  }

  // Same file scripts/audit-csv.js reads. The rename to the English name during
  // the multi-country move missed this line, so every run since then wrote an
  // orphan municipios.json and left the real lookup untouched.
  const outPath = path.join(__dirname, "..", "data", "reference", "municipalities.json");
  const existing =
    !refresh && fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : {};

  // Which of the two colliding items wins a shared key is arbitrary, so a plain
  // rebuild silently reshuffles homonyms that producer rows are already checked
  // against (`portillo` jumping from Portillo de Toledo to Portillo de Soria is
  // a 200 km move, and the geo rule is blocking past 100 km). Merging keeps every
  // key already committed and only adds the new ones; `--refresh` takes the
  // rebuild verbatim, and then the diff must be reviewed municipio by municipio.
  const merged = { ...lookup, ...existing };
  const preserved = Object.keys(existing).filter(
    (key) => key in lookup && JSON.stringify(existing[key]) !== JSON.stringify(lookup[key]),
  ).length;
  const kept = Object.keys(existing).filter((key) => !(key in lookup)).length;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(merged) + "\n");

  const sizeKb = Math.round(fs.statSync(outPath).size / 1024);
  console.log("---");
  for (const s of summaries) {
    console.log(`${s.label}: ${s.items} items, ${s.keys} keys (${s.collisions} collisions skipped)`);
  }
  console.log(`Lookup keys: ${Object.keys(merged).length}`);
  if (!refresh) {
    console.log(
      `Merged onto the committed file: ${preserved} keys the rebuild would have moved were preserved, ${kept} keys absent from the rebuild were kept (--refresh takes the rebuild instead).`,
    );
  }
  if (crossCountry.length) {
    console.log(`Cross-country name collisions: ${crossCountry.length}`);
    for (const line of crossCountry.slice(0, 40)) console.log(`  - ${line}`);
    if (crossCountry.length > 40) console.log(`  ... ${crossCountry.length - 40} more`);
  }
  console.log(`Output: ${path.relative(process.cwd(), outPath)} (${sizeKb} KB)`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
