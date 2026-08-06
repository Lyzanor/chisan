#!/usr/bin/env node
// Maintenance utility: regenerate data/reference/municipalities.json from each
// country's own official catalog.
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
//   - Italy: "comune of Italy" (Q747074) with coordinates, minus anything
//     carrying a dissolution date — the 2010s fusioni left hundreds of
//     suppressed comuni in Wikidata. Labels in it and de, so the bilingual
//     South Tyrolean names (Bressanone / Brixen) share one centroid.
//   - France: the only country not taken from Wikidata. Its 34.900 communes
//     do not fit in one SPARQL request — the query returns HTTP 200 with a
//     body cut off at the 60 s endpoint timeout, every time — and the official
//     centroids are published anyway, so the catalog comes from Etalab's
//     "Découpage administratif" API (geo.api.gouv.fr) in a single call. Only
//     current communes are listed there, so no dissolution filter is needed,
//     and each commune carries one name, so there are no altLabels.
//   - Belgium: "municipality of Belgium" (Q493522) with coordinates, minus
//     anything carrying a dissolution date — the 1977 and 2019/2025 mergers
//     left every deelgemeente in Wikidata. Labels in nl / fr / de, so the two
//     official spellings of a bilingual municipality (Mons / Bergen,
//     Antwerpen / Anvers) share one centroid.
//   - Germany: "municipality of Germany" (Q262166) with coordinates, minus
//     anything carrying a dissolution date — the Gebietsreformen and the
//     post-1990 mergers left thousands of abolished Gemeinden in Wikidata.
//     Labels in de only: a German municipality carries one official name, and
//     the bilingual exceptions (Sorbian, Danish, Frisian) publish the German
//     form too. Marked `dropAmbiguous` for the same reason as France — the
//     country repeats municipality names on an industrial scale (Neustadt,
//     Bergen, Hausen, Neukirchen, Königsfeld), so an arbitrary winner would
//     fail correct rows instead of skipping unresolvable ones.
//   - Netherlands: "municipality of the Netherlands" (Q2039348) with
//     coordinates, minus anything carrying a dissolution date — the country
//     went from ~1.100 municipalities to ~340 by merger, so the dissolved ones
//     outnumber the current ones several times over. Labels in nl and fy: a
//     Frisian municipality is officially named in Frisian (Súdwest-Fryslân,
//     Tytsjerksteradiel) and a Dutch source will still write the Dutch form.
//
// The "mul" label
// - Wikidata's multilingual label holds the name of an entity spelled the same
//   in every language, and an editor who fills it in may remove the per-language
//   ones. Every country therefore asks for "mul" first: without it Charleroi has
//   no nl, fr or de label at all and drops out of the Belgian catalog entirely,
//   taking the geographic gate for every producer in Wallonia's largest city
//   with it. Four Belgian municipalities and five Italian comuni were reachable
//   only this way.
//
// Output
// - data/reference/municipalities.json
//   { "<country>": { "<normalized-key>": { lat, lon, label } } }
//   Keys are produced by normalizeSearch (lowercase, ASCII, single spaces),
//   matching how scripts/audit-csv.js looks up the municipio column, and the
//   country is the folder under data/csv the row lives in. One catalog per
//   country is what makes a name mean one thing: Chiba is only ever looked up
//   against Japan and Chiva against Spain, so no producer can be measured
//   against a town on another continent.
//   Inside one country a repeated name is still ambiguous, and which of the
//   two wins the key is arbitrary. A country marked `dropAmbiguous` (France)
//   removes the key instead: with 1.482 repeated commune names an arbitrary
//   winner turns correct rows into blocking geo errors, while no key at all
//   makes them skip, which is what an unresolvable name honestly is. The
//   names that matter get a per-region entry in municipality-overrides.json.
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
//                                                         the ones the source grew
//   node scripts/build-municipality-centroids.js --refresh    take the rebuild as is
//
// Notes
// - Self-contained: uses native fetch (Node 18+), no extra deps.
// - The script rewrites data/reference/municipalities.json in place; commit the
//   result if it differs. Default runs are additive, so the diff is reviewable.
//   `--refresh` also moves existing centroids: measured once against the file
//   committed in August 2026, a plain rebuild changed 149 keys and dropped 17,
//   most of them homonyms whose winner flipped rather than real corrections.
// - Two SPARQL requests per Wikidata country, one plain GET for France;
//   ~1-2 minutes total on a normal connection.
// - Cross-language label collisions inside one country (e.g. Catalan
//   "Figueres" → both real Figueres in Girona and Higueras in Castellón) still
//   cause one entity to win the key arbitrarily. Known collisions are
//   disambiguated via data/reference/municipality-overrides.json, which is
//   loaded by scripts/audit-csv.js after this file, keyed by country and
//   resolved by the region slug inferred from the CSV path. This file is not
//   touched by the rebuild.

const ENDPOINT = "https://query.wikidata.org/sparql";
const GEO_API_COMMUNES =
  "https://geo.api.gouv.fr/communes?fields=code,nom,centre&format=json";
const USER_AGENT = "km0-municipio-centroids/1.0 (https://github.com/Lyzanor/km0)";
const REQUEST_TIMEOUT_MS = 120000;

const langFilter = (langs) => langs.map((l) => `"${l}"`).join(", ");

// One entry per country folder under data/csv; `code` is that folder, and the
// catalog it produces is only ever read for rows in it. Order does not matter:
// no country can take a key from another.
const COUNTRIES = [
  {
    slug: "spain",
    code: "es",
    label: "Spain",
    rootClass: "wd:Q2074737",
    langs: ["mul", "es", "ca", "gl", "eu", "an", "ast"],
    canonicalLang: "es",
    extraFilter: "",
  },
  {
    slug: "japan",
    code: "jp",
    label: "Japan",
    rootClass: "wd:Q1054813",
    langs: ["mul", "en", "ja"],
    canonicalLang: "en",
    extraFilter: "  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }\n",
  },
  {
    slug: "portugal",
    code: "pt",
    label: "Portugal",
    rootClass: "wd:Q13217644",
    langs: ["mul", "pt"],
    canonicalLang: "pt",
    extraFilter: "",
  },
  {
    slug: "italy",
    code: "it",
    label: "Italy",
    rootClass: "wd:Q747074",
    langs: ["mul", "it", "de"],
    canonicalLang: "it",
    extraFilter: "  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }\n",
  },
  {
    slug: "france",
    code: "fr",
    label: "France",
    endpoint: GEO_API_COMMUNES,
    dropAmbiguous: true,
  },
  {
    slug: "belgium",
    code: "be",
    label: "Belgium",
    rootClass: "wd:Q493522",
    langs: ["mul", "nl", "fr", "de"],
    canonicalLang: "nl",
    extraFilter: "  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }\n",
  },
  {
    slug: "netherlands",
    code: "nl",
    label: "Netherlands",
    rootClass: "wd:Q2039348",
    langs: ["mul", "nl", "fy"],
    canonicalLang: "nl",
    extraFilter: "  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }\n",
  },
  {
    slug: "germany",
    code: "de",
    label: "Germany",
    rootClass: "wd:Q262166",
    langs: ["mul", "de"],
    canonicalLang: "de",
    extraFilter: "  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }\n",
    dropAmbiguous: true,
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

async function withRetry(run, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await run();
    } catch (err) {
      if (attempt >= attempts) throw err;
      console.log(`  attempt ${attempt}/${attempts} failed (${err.message.slice(0, 90)}); retrying...`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 5000));
    }
  }
}

function normalize(value) {
  return String(value || "")
    .replace(/[œŒ]/g, "oe")
    .replace(/[æÆ]/g, "ae")
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

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    const body = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    return JSON.parse(body);
  } finally {
    clearTimeout(timer);
  }
}

// geo.api.gouv.fr returns the whole list in one document, so the retry wrapper
// and the qid/altLabel machinery above have nothing to do here. The INSEE code
// plays the part of the qid: it is what keeps two communes from merging into
// one entry when they share a name.
async function collectFromGeoApi(country) {
  console.log(`[${country.label}] fetching communes from geo.api.gouv.fr...`);
  const raw = await withRetry(() => fetchJson(country.endpoint));
  console.log(`  ${raw.length} communes`);

  const items = new Map();
  for (const commune of raw) {
    const point = commune.centre?.coordinates;
    if (!point) continue;
    items.set(commune.code ?? commune.nom, {
      coord: { lon: point[0], lat: point[1] },
      labels: new Set([commune.nom]),
      canonical: commune.nom,
    });
  }
  return items;
}

async function collectItems(country) {
  if (country.endpoint) return collectFromGeoApi(country);
  const queries = buildQueries(country);

  console.log(`[${country.label}] fetching labels from Wikidata...`);
  const labelsRaw = await withRetry(() => fetchSparql(queries.labels));
  console.log(`  ${labelsRaw.results.bindings.length} label bindings`);

  console.log(`[${country.label}] fetching altLabels from Wikidata...`);
  const altRaw = await withRetry(() => fetchSparql(queries.alt));
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
  const summaries = [];

  for (const country of COUNTRIES) {
    const items = await collectItems(country);
    const catalog = {};
    const owners = new Map(); // key -> qid, inside this country only
    let keys = 0;
    let collisions = 0;
    let dropped = 0;

    for (const [qid, entry] of items) {
      for (const lbl of entry.labels) {
        const key = normalize(lbl);
        if (!key) continue;
        const owner = owners.get(key);
        if (owner && owner !== qid) {
          collisions++;
          if (country.dropAmbiguous && catalog[key]) {
            delete catalog[key];
            keys--;
            dropped++;
          }
          continue;
        }
        if (!owner) keys++;
        owners.set(key, qid);
        catalog[key] = {
          lat: Number(entry.coord.lat.toFixed(5)),
          lon: Number(entry.coord.lon.toFixed(5)),
          label: entry.canonical,
        };
      }
    }

    lookup[country.code] = catalog;
    summaries.push({ label: country.label, code: country.code, items: items.size, keys, collisions, dropped });
  }

  // Same file scripts/audit-csv.js reads. The rename to the English name during
  // the multi-country move missed this line, so every run since then wrote an
  // orphan municipios.json and left the real lookup untouched.
  const outPath = path.join(__dirname, "..", "data", "reference", "municipalities.json");
  const previous =
    !refresh && fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : {};

  // Which of two colliding municipalities wins a shared key is arbitrary, so a
  // plain rebuild silently reshuffles homonyms that producer rows are already
  // checked against (`portillo` jumping from Portillo de Toledo to Portillo de
  // Soria is a 200 km move, and the geo rule is blocking past 100 km). Merging
  // keeps every key already committed and only adds the new ones; `--refresh`
  // takes the rebuild verbatim, and then the diff must be reviewed municipio by
  // municipio. A country absent from the committed file simply has no base.
  const merged = {};
  let preserved = 0;
  let kept = 0;
  for (const country of COUNTRIES) {
    const base = previous[country.code] ?? {};
    const built = lookup[country.code];
    merged[country.code] = { ...built, ...base };
    preserved += Object.keys(base).filter(
      (key) => key in built && JSON.stringify(base[key]) !== JSON.stringify(built[key]),
    ).length;
    kept += Object.keys(base).filter((key) => !(key in built)).length;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(merged) + "\n");

  const sizeKb = Math.round(fs.statSync(outPath).size / 1024);
  console.log("---");
  for (const s of summaries) {
    const drops = s.dropped ? `, ${s.dropped} ambiguous names dropped` : "";
    console.log(`${s.label}: ${s.items} items, ${s.keys} keys (${s.collisions} collisions skipped${drops})`);
  }
  console.log(
    `Lookup keys: ${Object.values(merged).reduce((total, catalog) => total + Object.keys(catalog).length, 0)}`,
  );
  if (!refresh) {
    console.log(
      `Merged onto the committed file: ${preserved} keys the rebuild would have moved were preserved, ${kept} keys absent from the rebuild were kept (--refresh takes the rebuild instead).`,
    );
  }
  console.log(`Output: ${path.relative(process.cwd(), outPath)} (${sizeKb} KB)`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
