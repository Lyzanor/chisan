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
//   - United Kingdom: the one country with no "municipality of" class to ask
//     for. Its local-government units are counties, districts and councils,
//     none of which a producer address names, and the settlement layer below
//     them is classified differently in each nation: England has civil
//     parishes (which stop at unparished towns), Scotland has none at all, and
//     what an address actually carries is a city, town, village or hamlet. So
//     the catalog is the union of those classes (`classes`), asked for one at
//     a time and restricted by country (P17 = Q145). Each class is a direct
//     P31 match: the transitive P31/P279* walk the other countries use returns
//     HTTP 502 here, because it has to explore the whole settlement subtree of
//     a country with ~40.000 of them. Labels in en / cy / gd, so a Welsh or
//     Gaelic address (Y Fenni, Caernarfon) resolves as well as the English
//     spelling. Marked `dropAmbiguous` like France and Germany, and for a
//     stronger reason: English village names repeat relentlessly (Newton,
//     Sutton, Weston, Whitchurch), so an arbitrary winner would turn correct
//     rows into blocking geo errors.
//   - Ireland: the same settlement union as the United Kingdom and for the same
//     absence of a municipality layer — an Irish address carries a town or
//     village, never one of the 31 local authorities. Asked for one class at a
//     time and restricted by country (P17 = Q27), because the transitive
//     P31/P279* walk times out here too. The townland, the layer below the
//     village that rural addresses do sometimes name, is deliberately left out:
//     Wikidata holds ~60.000 of them, their names repeat far more than
//     settlement names do, and one that shares a name with a real town (Fermoy)
//     would take that town's key down with it. Labels in en and ga, so a
//     Gaeltacht producer writing An Daingean or An Spidéal resolves as well as
//     the English spelling. Marked `dropAmbiguous` for the usual reason: Ballina
//     in Mayo and Ballina in Tipperary are 150 km apart, past the blocking
//     threshold, so an arbitrary winner would fail a correct row.
//   - India: another country with no "municipality of" class worth asking for —
//     the one that exists (Q112684326) holds eight items. What an Indian address
//     names is a city or town, so the catalog is the settlement union again,
//     restricted by country (P17 = Q668) and asked for one class at a time,
//     plus the two India-specific town classes (`census town of India`,
//     `town in India`) that hold what the generic ones miss. The settlement
//     classes alone are not enough here: an Indian city of any size is typed
//     `big city`, `metropolis`, `megacity`, `largest city` or `state capital`
//     and carries none of them, so Kolkata, Nashik, Darjeeling, Ahmedabad and
//     Lucknow were all absent until those five were asked for as well. Leaving
//     them out did worse than lose a key — with only the Uttarakhand Srinagar
//     typed as a city, `srinagar` resolved 470 km from the Kashmiri one and no
//     collision was ever detected. The village layer is
//     deliberately left out for the same reason as the Irish townland, only
//     larger: `village in India` (Q56436498) holds 75.172 items with
//     coordinates, Indian village names repeat across states on a scale nothing
//     else in the catalog approaches, and under `dropAmbiguous` a village
//     sharing a name with a real town removes that town's key and the gate for
//     every producer in it. Labels in en and mul: an Indian producer publishes
//     in English, and the romanisation variants a CSV may carry
//     (Bangalore/Bengaluru, Calicut/Kozhikode) are English altLabels the alt
//     query already collects. `dropAmbiguous` for the usual reason.
//   - Mexico: "municipality of Mexico" (Q1952852) plus "territorial demarcation
//     of Mexico City" (Q2734310), the 16 alcaldías, which are not municipios and
//     sit outside that class. Asked for as exact types restricted by country
//     (P17 = Q96) rather than through the subclass walk, because the two classes
//     are unrelated. Together they return 2.477 items, the whole country. The
//     settlement union the other class-based countries use is not an option
//     here: Wikidata types barely 120 Mexican places as city or town, so
//     `municipio` is the only layer with national coverage.
//     The catch is that the Spanish label of a Mexican municipality is the
//     administrative form — 2.470 of them read "Municipio de Tequila", which no
//     producer address ever writes. The bare name a row carries lives in the
//     altLabels the alt query already collects, and 2.465 of the 2.477 items
//     have one, so the working keys come from there and the prefixed labels are
//     inert extra keys. Labels in es and mul. `dropAmbiguous` for the usual
//     reason, and Mexico is its most extreme case: municipality names honour the
//     same national figures in state after state (Guadalupe, Juárez, Hidalgo,
//     Morelos, Zaragoza), so an arbitrary winner would be wrong far more often
//     than right.
//   - United States: the official U.S. Census Bureau national Places Gazetteer
//     for the 50 states and District of Columbia. It covers incorporated places
//     and census-designated places and supplies their representative points.
//     Legal/statistical suffixes (`city`, `town`, `village`, `borough`, `CDP`,
//     consolidated-government forms...) are removed because producer addresses
//     name Montpelier, not "Montpelier city". Puerto Rico is excluded because it
//     is not in the country tree, and nationwide homonyms are dropped rather
//     than choosing one state arbitrarily.
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
//   node scripts/build-municipality-centroids.js --only gb   rebuild one country,
//                                                         leave every other
//                                                         catalog exactly as
//                                                         committed
//
// - Rebuilding every country in one run means ~15 requests to an endpoint that
//   rate-limits and truncates bodies under load; one failure past the retries
//   loses the whole run. When the reason to re-run concerns a single country —
//   opening one, or filling a gap its rows exposed — `--only <code>` is both
//   faster and the smaller diff.
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
const US_CENSUS_PLACES_GAZETTEER =
  "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_place_national.zip";
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
  {
    slug: "united-kingdom",
    code: "gb",
    label: "United Kingdom",
    classes: ["wd:Q515", "wd:Q3957", "wd:Q1115575", "wd:Q532", "wd:Q5084", "wd:Q486972"],
    countryClass: "wd:Q145",
    langs: ["mul", "en", "cy", "gd"],
    canonicalLang: "en",
    extraFilter: "",
    dropAmbiguous: true,
  },
  {
    slug: "ireland",
    code: "ie",
    label: "Ireland",
    classes: ["wd:Q515", "wd:Q3957", "wd:Q532", "wd:Q5084", "wd:Q486972"],
    countryClass: "wd:Q27",
    langs: ["mul", "en", "ga"],
    canonicalLang: "en",
    extraFilter: "",
    dropAmbiguous: true,
  },
  {
    slug: "india",
    code: "in",
    label: "India",
    classes: [
      "wd:Q515",
      "wd:Q3957",
      "wd:Q532",
      "wd:Q5084",
      "wd:Q486972",
      "wd:Q16830604",
      "wd:Q58339518",
      "wd:Q1549591",
      "wd:Q200250",
      "wd:Q174844",
      "wd:Q11271835",
      "wd:Q51929311",
    ],
    countryClass: "wd:Q668",
    langs: ["mul", "en"],
    canonicalLang: "en",
    extraFilter: "",
    dropAmbiguous: true,
  },
  {
    slug: "mexico",
    code: "mx",
    label: "Mexico",
    classes: ["wd:Q1952852", "wd:Q2734310"],
    countryClass: "wd:Q96",
    langs: ["mul", "es"],
    canonicalLang: "es",
    extraFilter: "  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }\n",
    dropAmbiguous: true,
  },
  {
    slug: "united-states",
    code: "us",
    label: "United States",
    gazetteer: US_CENSUS_PLACES_GAZETTEER,
    dropAmbiguous: true,
  },
];

// `rootClass` walks a subclass tree; `classes` asks for a list of exact types
// instead, one request each. A country uses one or the other, never both.
function buildQueries(country, cls) {
  const type = cls
    ? `wdt:P31 ${cls};
        wdt:P17 ${country.countryClass};`
    : `wdt:P31/wdt:P279* ${country.rootClass};`;
  return {
    labels: `SELECT ?item ?label ?coord WHERE {
  ?item ${type}
        wdt:P625 ?coord.
${country.extraFilter}  ?item rdfs:label ?label.
  FILTER(LANG(?label) IN (${langFilter(country.langs)})).
}`,
    alt: `SELECT ?item ?alt WHERE {
  ?item ${type}
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

// Two items under one name are only ambiguous if they are two different places.
// Wikidata routinely holds a town and its civil parish, or a settlement and its
// community, as separate items carrying the same label — most of what looks like
// a homonym in the United Kingdom is that. Dropping the key over it would cost
// the gate a name it can resolve perfectly well, and anything this close is the
// same place for the purpose of a 15 km warning band anyway.
const SAME_PLACE_KM = 10;

function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
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

async function fetchBuffer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/zip", "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

// The Census national download is one deflated text file in a ZIP archive.
// Reading its central-directory metadata keeps this maintenance script
// dependency-free and avoids shelling out to a platform-specific `unzip`.
async function readFirstZipText(buffer) {
  const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
  const CENTRAL_FILE_HEADER = 0x02014b50;
  const LOCAL_FILE_HEADER = 0x04034b50;
  const minOffset = Math.max(0, buffer.length - 65_557);
  let endOffset = -1;

  for (let offset = buffer.length - 22; offset >= minOffset; offset--) {
    if (buffer.readUInt32LE(offset) === END_OF_CENTRAL_DIRECTORY) {
      endOffset = offset;
      break;
    }
  }
  if (endOffset === -1) throw new Error("ZIP end-of-central-directory record not found");

  const centralOffset = buffer.readUInt32LE(endOffset + 16);
  if (buffer.readUInt32LE(centralOffset) !== CENTRAL_FILE_HEADER) {
    throw new Error("ZIP central file header not found");
  }

  const compression = buffer.readUInt16LE(centralOffset + 10);
  const compressedSize = buffer.readUInt32LE(centralOffset + 20);
  const localOffset = buffer.readUInt32LE(centralOffset + 42);
  if (buffer.readUInt32LE(localOffset) !== LOCAL_FILE_HEADER) {
    throw new Error("ZIP local file header not found");
  }

  const nameLength = buffer.readUInt16LE(localOffset + 26);
  const extraLength = buffer.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + nameLength + extraLength;
  const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
  if (compression === 0) return compressed.toString("utf8");
  if (compression !== 8) throw new Error(`unsupported ZIP compression method ${compression}`);

  const { inflateRawSync } = await import("node:zlib");
  return inflateRawSync(compressed).toString("utf8");
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

function stripCensusPlaceType(name) {
  return name.replace(
    /\s+(?:(?:city and borough|consolidated government|metro government|metropolitan government|unified government|urban county)(?: \(balance\))?|municipality|borough|village|town|city|CDP)$/i,
    "",
  );
}

async function collectFromCensusGazetteer(country) {
  console.log(`[${country.label}] fetching places from the U.S. Census Bureau...`);
  const archive = await withRetry(() => fetchBuffer(country.gazetteer));
  const text = await readFirstZipText(archive);
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split("|");
  const index = Object.fromEntries(headers.map((header, position) => [header, position]));
  const required = ["USPS", "GEOID", "NAME", "INTPTLAT", "INTPTLONG"];
  if (required.some((header) => index[header] === undefined)) {
    throw new Error(`unexpected Census Gazetteer header: ${headerLine}`);
  }

  const items = new Map();
  for (const line of lines) {
    if (!line) continue;
    const row = line.split("|");
    if (row[index.USPS] === "PR") continue;
    const lat = Number(row[index.INTPTLAT]);
    const lon = Number(row[index.INTPTLONG]);
    const label = stripCensusPlaceType(row[index.NAME]);
    if (!label || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    items.set(row[index.GEOID], {
      coord: { lat, lon },
      labels: new Set([label]),
      canonical: label,
    });
  }
  console.log(`  ${items.size} current places`);
  return items;
}

async function collectItems(country) {
  if (country.gazetteer) return collectFromCensusGazetteer(country);
  if (country.endpoint) return collectFromGeoApi(country);

  const items = new Map(); // qid -> { coord, labels: Set, canonical }
  for (const cls of country.classes ?? [null]) {
    await collectQueryPair(country, cls, items);
  }
  return items;
}

async function collectQueryPair(country, cls, items) {
  const queries = buildQueries(country, cls);
  const tag = cls ? `${country.label} ${cls}` : country.label;

  console.log(`[${tag}] fetching labels from Wikidata...`);
  const labelsRaw = await withRetry(() => fetchSparql(queries.labels));
  console.log(`  ${labelsRaw.results.bindings.length} label bindings`);

  console.log(`[${tag}] fetching altLabels from Wikidata...`);
  const altRaw = await withRetry(() => fetchSparql(queries.alt));
  console.log(`  ${altRaw.results.bindings.length} altLabel bindings`);

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
}

async function main() {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const refresh = process.argv.includes("--refresh");
  const onlyFlag = process.argv.indexOf("--only");
  const only = onlyFlag === -1 ? null : process.argv[onlyFlag + 1] || null;
  if (only && !COUNTRIES.some((country) => country.code === only)) {
    throw new Error(`--only ${only}: no country with that code in data/csv`);
  }
  const lookup = {};
  const summaries = [];

  for (const country of COUNTRIES) {
    if (only && country.code !== only) continue;
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
          if (
            country.dropAmbiguous &&
            catalog[key] &&
            distanceKm(catalog[key], entry.coord) > SAME_PLACE_KM
          ) {
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
    // A country skipped by --only has no rebuild, so it keeps exactly what the
    // committed file holds.
    const built = lookup[country.code] ?? {};
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
