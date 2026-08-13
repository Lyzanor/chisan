#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const ROOT = process.cwd();
const CSV_ROOT = path.join(ROOT, "data", "csv");
const DEFAULT_CONCURRENCY = 2;
const API_URL = "https://places.googleapis.com/v1/places:searchText";
const QUERY_VERSION = 3;
const COUNTRY_NAMES = {
  de: "Deutschland",
  es: "España",
  fr: "France",
  it: "Italia",
  pt: "Portugal",
};
const LANGUAGE_CODES = { de: "de", es: "es", fr: "fr", it: "it", pt: "pt" };
const CATEGORY_TERMS = {
  de: {
    Cerveza: "Brauerei",
    Miel: "Imkerei",
    Carne: "Fleischerei",
    "Legumbres y cereales": "Getreide",
    Huevos: "Eierhof",
    "Fruta y verdura": "Obst Gemüse Hof",
  },
  es: { Cerveza: "cervecería", Miel: "apicultura" },
  fr: { Cerveza: "brasserie", Miel: "apiculture" },
  it: { Cerveza: "birrificio", Miel: "apicoltura" },
  pt: { Cerveza: "cervejaria", Miel: "apicultura" },
};
const LEGAL_TOKENS = new Set([
  "ag", "co", "company", "e", "eg", "gbr", "gmbh", "kg", "ohg", "sarl", "sas",
  "sl", "srl", "societa", "sociedade", "und",
]);
const GENERIC_NAME_TOKENS = new Set([
  "bier", "brewery", "brasserie", "birrificio", "brau", "brauerei", "brauhaus",
  "cerveceria", "cervejaria", "gasthaus", "gasthof", "gaststatte", "hotel", "privat",
  "restaurant", "wirtshaus",
]);

function usage() {
  console.log(`Usage: node scripts/review-google-maps.mjs --country <iso> [options]

Options:
  --area <slug>       Limit the review to one area CSV.
  --apply             Apply only high-confidence matches to the CSV files.
  --concurrency <n>   Concurrent Places requests (default: ${DEFAULT_CONCURRENCY}).
  --cache <path>      Review cache (default: tmp/google-maps-review-<iso>.jsonl).
  --report <path>     Current compact report (default: tmp/google-maps-review-<iso>-current.json).
  --decisions <path>  Apply reviewed accept/clear decisions from a JSON array (requires --apply).
  --clear-unresolved  Empty every ambiguous or missing legacy link (requires --apply).
  --repair-verification  Downgrade verified rows left without a public link (requires --apply).
  --help              Show this help.

The API key is read from GOOGLE_MAPS_API_KEY or .env.local. The cache never
contains the key. Ambiguous and missing matches are never applied.`);
}

function parseArgs(argv) {
  const args = { apply: false, concurrency: DEFAULT_CONCURRENCY };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--country") args.country = argv[++i];
    else if (arg === "--area") args.area = argv[++i];
    else if (arg === "--cache") args.cache = argv[++i];
    else if (arg === "--report") args.report = argv[++i];
    else if (arg === "--decisions") args.decisions = argv[++i];
    else if (arg === "--clear-unresolved") args.clearUnresolved = true;
    else if (arg === "--repair-verification") args.repairVerification = true;
    else if (arg === "--concurrency") args.concurrency = Number(argv[++i]);
    else if (arg === "--apply") args.apply = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`unknown argument '${arg}'`);
  }
  if (!args.help && !/^[a-z]{2}$/.test(args.country ?? "")) {
    throw new Error("--country requires a two-letter country code");
  }
  if (!Number.isInteger(args.concurrency) || args.concurrency < 1 || args.concurrency > 10) {
    throw new Error("--concurrency must be an integer from 1 to 10");
  }
  if (args.decisions && !args.apply) throw new Error("--decisions requires --apply");
  if (args.clearUnresolved && !args.apply) throw new Error("--clear-unresolved requires --apply");
  if (args.repairVerification && !args.apply) throw new Error("--repair-verification requires --apply");
  if (args.clearUnresolved && args.decisions) {
    throw new Error("--clear-unresolved and --decisions cannot be combined");
  }
  return args;
}

function loadEnvFile() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}

function walkCsvFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkCsvFiles(target);
    return entry.name.endsWith(".csv") ? [target] : [];
  });
}

function clean(value) {
  return String(value ?? "").trim();
}

function normalize(value) {
  return clean(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value, { legal = false } = {}) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1 && (!legal || !LEGAL_TOKENS.has(token)));
}

function tokenSimilarity(left, right) {
  const a = new Set(tokens(left, { legal: true }));
  const b = new Set(tokens(right, { legal: true }));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) if (b.has(token)) common += 1;
  return common / Math.min(a.size, b.size);
}

function nameTokens(value) {
  return normalize(value)
    .split(" ")
    .map((token) => token
      .replace(/privatbrauerei|hausbrauerei|brauereigasthof|braumanufaktur|brauerei|brauhaus|braustuben|braustubl|brau/g, "")
      .replace(/birrificio|brasserie|cerveceria|cervejaria|brewery/g, ""))
    .filter((token) => token.length > 1 && !LEGAL_TOKENS.has(token) && !GENERIC_NAME_TOKENS.has(token));
}

function nameSimilarity(left, right) {
  const a = new Set(nameTokens(left));
  const b = new Set(nameTokens(right));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) {
    if ([...b].some((candidate) => candidate === token
      || (token.length >= 4 && candidate.length >= 4
        && (candidate.includes(token) || token.includes(candidate))))) common += 1;
  }
  return common / Math.min(a.size, b.size);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return null;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function postcode(value, country) {
  const patterns = {
    de: /\b\d{5}\b/,
    es: /\b\d{5}\b/,
    fr: /\b\d{5}\b/,
    it: /\b\d{5}\b/,
    pt: /\b\d{4}-\d{3}\b/,
  };
  return clean(value).match(patterns[country] ?? /$^/)?.[0] ?? "";
}

function currentPlaceId(value) {
  try {
    return clean(new URL(value).searchParams.get("query_place_id"));
  } catch {
    return "";
  }
}

function hostname(value) {
  try {
    return new URL(clean(value)).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function phoneDigits(value) {
  return clean(value).replace(/\D/g, "").slice(-9);
}

function buildQuery(row, country) {
  const categoryTerm = CATEGORY_TERMS[country]?.[row.categoria] ?? "";
  return [row.nombre, categoryTerm, row.direccion || row.municipio, COUNTRY_NAMES[country] || country]
    .map(clean)
    .filter(Boolean)
    .join(", ");
}

function canonicalMapsUrl(row, placeId) {
  const fallback = [row.nombre, row.direccion || row.municipio].map(clean).filter(Boolean).join(", ");
  const params = new URLSearchParams({ api: "1", query: fallback, query_place_id: placeId });
  return `https://www.google.com/maps/search/?${params.toString().replace(/\+/g, "%20")}`;
}

function scoreCandidate(row, candidate, country) {
  const candidateName = typeof candidate.displayName === "string"
    ? candidate.displayName
    : candidate.displayName?.text;
  const identitySimilarity = nameSimilarity(row.nombre, candidateName);
  const municipalityTokens = tokens(row.municipio);
  const candidateAddress = normalize(candidate.formattedAddress);
  const municipalityMatch = municipalityTokens.length > 0
    && municipalityTokens.every((token) => candidateAddress.includes(token));
  const expectedPostcode = postcode(row.direccion, country);
  const postcodeMatch = Boolean(expectedPostcode && candidate.formattedAddress?.includes(expectedPostcode));
  const addressSimilarity = tokenSimilarity(row.direccion, candidate.formattedAddress);
  const distanceKm = haversineKm(
    Number.parseFloat(row.lat),
    Number.parseFloat(row.lon),
    candidate.location?.latitude,
    candidate.location?.longitude,
  );
  const expectedHost = hostname(row.web);
  const candidateHost = hostname(candidate.websiteUri);
  const hostMatch = Boolean(expectedHost && candidateHost && expectedHost === candidateHost);
  const expectedPhone = phoneDigits(row.telefono);
  const candidatePhone = phoneDigits(candidate.nationalPhoneNumber);
  const phoneMatch = Boolean(expectedPhone && candidatePhone && expectedPhone === candidatePhone);

  let score = identitySimilarity * 5 + addressSimilarity * 2;
  if (municipalityMatch) score += 2;
  if (postcodeMatch) score += 3;
  if (distanceKm !== null) {
    if (distanceKm <= 0.1) score += 4;
    else if (distanceKm <= 0.5) score += 3;
    else if (distanceKm <= 2) score += 1;
    else if (distanceKm > 10) score -= 5;
  }

  return {
    id: candidate.id,
    displayName: clean(candidateName),
    formattedAddress: clean(candidate.formattedAddress),
    location: candidate.location ?? null,
    nameSimilarity: Number(identitySimilarity.toFixed(3)),
    addressSimilarity: Number(addressSimilarity.toFixed(3)),
    municipalityMatch,
    postcodeMatch,
    distanceKm: distanceKm === null ? null : Number(distanceKm.toFixed(3)),
    websiteUri: clean(candidate.websiteUri),
    nationalPhoneNumber: clean(candidate.nationalPhoneNumber),
    types: candidate.types ?? [],
    businessStatus: clean(candidate.businessStatus),
    hostMatch,
    phoneMatch,
    score: Number(score.toFixed(3)),
  };
}

function classify(row, candidates) {
  if (!candidates.length) return { status: "missing", selected: null };
  const ranked = [...candidates].sort((a, b) => b.score - a.score);
  const best = ranked[0];
  const second = ranked[1];
  const hasAddress = Boolean(clean(row.direccion));
  const identityOkay = best.nameSimilarity >= 0.6;
  const locationOkay = best.distanceKm !== null && best.distanceKm <= 2;
  const addressOkay = hasAddress
    ? best.postcodeMatch || best.addressSimilarity >= 0.45 || (best.distanceKm !== null && best.distanceKm <= 0.15)
    : best.municipalityMatch && best.distanceKm !== null && best.distanceKm <= 0.5;
  const exactNearby = best.nameSimilarity >= 0.6
    && best.distanceKm !== null
    && best.distanceKm <= 0.15;
  const clearlyFirst = !second || best.score - second.score >= 1.5 || exactNearby;
  const sourceMatch = best.hostMatch || best.phoneMatch;
  const sourceLocationOkay = best.distanceKm !== null && best.distanceKm <= 2;
  const status = ((identityOkay && locationOkay && addressOkay && clearlyFirst)
    || (sourceMatch && sourceLocationOkay)) ? "accepted" : "ambiguous";
  return { status, selected: status === "accepted" ? best : null, ranked };
}

async function fetchJson(url, options, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, options);
    const body = await response.json().catch(() => ({}));
    if (response.ok) return body;
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === attempts) {
      throw new Error(`Places API ${response.status}: ${body.error?.message ?? "unknown error"}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
  }
  throw new Error("Places API retry loop exhausted");
}

async function searchPlaces(row, country, apiKey) {
  const body = await fetchJson(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.websiteUri,places.nationalPhoneNumber,places.types,places.businessStatus",
    },
    body: JSON.stringify({
      textQuery: buildQuery(row, country),
      maxResultCount: 5,
      languageCode: LANGUAGE_CODES[country] || "en",
      regionCode: country.toUpperCase(),
    }),
  });
  return body.places ?? [];
}

function loadCache(cachePath) {
  const cache = new Map();
  if (!fs.existsSync(cachePath)) return cache;
  for (const line of fs.readFileSync(cachePath, "utf8").split(/\r?\n/).filter(Boolean)) {
    const record = JSON.parse(line);
    cache.set(record.key, record);
  }
  return cache;
}

function appendCache(cachePath, record) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.appendFileSync(cachePath, `${JSON.stringify(record)}\n`);
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

function applyReplacements(records) {
  const byFile = new Map();
  for (const record of records.filter((item) => item.status === "accepted")) {
    const list = byFile.get(record.file) ?? [];
    list.push(record);
    byFile.set(record.file, list);
  }
  let changedRows = 0;
  for (const [file, fileRecords] of byFile) {
    let raw = fs.readFileSync(file, "utf8");
    for (const record of fileRecords) {
      const replacement = canonicalMapsUrl(record.row, record.selected.id);
      raw = replaceMapsUrl(raw, record, replacement);
      changedRows += 1;
    }
    fs.writeFileSync(file, raw);
  }
  return changedRows;
}

function replaceMapsUrl(raw, record, replacement) {
  const prefixes = [`${record.row.slug},`, `"${record.row.slug}",`];
  const lines = raw.split("\n");
  const matches = lines
    .map((line, index) => (prefixes.some((prefix) => line.startsWith(prefix)) ? index : -1))
    .filter((index) => index >= 0);
  if (matches.length !== 1) {
    throw new Error(`${path.relative(ROOT, record.file)}:${record.row.slug}: expected one CSV row, found ${matches.length}`);
  }
  const index = matches[0];
  const occurrences = lines[index].split(record.oldUrl).length - 1;
  if (occurrences !== 1) {
    throw new Error(`${path.relative(ROOT, record.file)}:${record.row.slug}: expected one old URL in row, found ${occurrences}`);
  }
  lines[index] = lines[index].replace(record.oldUrl, replacement);
  return lines.join("\n");
}

function replaceVerification(raw, record, replacement) {
  const prefixes = [`${record.row.slug},`, `"${record.row.slug}",`];
  const lines = raw.split("\n");
  const matches = lines
    .map((line, index) => (prefixes.some((prefix) => line.startsWith(prefix)) ? index : -1))
    .filter((index) => index >= 0);
  if (matches.length !== 1) {
    throw new Error(`${path.relative(ROOT, record.file)}:${record.row.slug}: expected one CSV row, found ${matches.length}`);
  }
  const index = matches[0];
  const unquoted = ",verificado,";
  const quoted = ",\"verificado\",";
  if (lines[index].includes(unquoted)) {
    lines[index] = lines[index].replace(unquoted, `,${replacement},`);
  } else if (lines[index].includes(quoted)) {
    lines[index] = lines[index].replace(quoted, `,\"${replacement}\",`);
  } else {
    throw new Error(`${path.relative(ROOT, record.file)}:${record.row.slug}: verificado token was not found`);
  }
  return lines.join("\n");
}

function applyDecisions(records, decisionsPath) {
  const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8"));
  if (!Array.isArray(decisions)) throw new Error("decisions file must contain a JSON array");
  const recordsByKey = new Map(records.map((record) => [
    `${path.basename(record.file, ".csv")}:${record.row.slug}`,
    record,
  ]));
  const seen = new Set();
  const reviewed = decisions.map((decision) => {
    const key = `${clean(decision.area)}:${clean(decision.slug)}`;
    if (seen.has(key)) throw new Error(`duplicate decision for ${key}`);
    seen.add(key);
    const record = recordsByKey.get(key);
    if (!record) throw new Error(`decision does not match a queued link: ${key}`);
    if (!["accept", "clear"].includes(decision.decision)) {
      throw new Error(`invalid decision for ${key}: ${decision.decision}`);
    }
    const placeId = clean(decision.placeId);
    if (decision.decision === "accept" && !placeId) {
      throw new Error(`accepted decision is missing placeId: ${key}`);
    }
    return { ...record, decision: decision.decision, placeId };
  });

  const byFile = new Map();
  for (const record of reviewed) {
    const list = byFile.get(record.file) ?? [];
    list.push(record);
    byFile.set(record.file, list);
  }
  let changedRows = 0;
  for (const [file, fileRecords] of byFile) {
    let raw = fs.readFileSync(file, "utf8");
    for (const record of fileRecords) {
      const replacement = record.decision === "accept"
        ? canonicalMapsUrl(record.row, record.placeId)
        : "";
      raw = replaceMapsUrl(raw, record, replacement);
      changedRows += 1;
    }
    fs.writeFileSync(file, raw);
  }
  return changedRows;
}

function clearUnresolved(records) {
  const unresolved = records.filter((record) => record.status !== "accepted");
  const byFile = new Map();
  for (const record of unresolved) {
    const list = byFile.get(record.file) ?? [];
    list.push(record);
    byFile.set(record.file, list);
  }
  let changedRows = 0;
  for (const [file, fileRecords] of byFile) {
    let raw = fs.readFileSync(file, "utf8");
    for (const record of fileRecords) {
      raw = replaceMapsUrl(raw, record, "");
      const hasOtherPublicLink = [record.row.web, record.row.Facebook, record.row.Instagram]
        .some((value) => Boolean(clean(value)));
      if (record.row.verificacion === "verificado" && !hasOtherPublicLink) {
        raw = replaceVerification(raw, record, "parcial");
      }
      changedRows += 1;
    }
    fs.writeFileSync(file, raw);
  }
  return changedRows;
}

function repairVerification(files) {
  let changedRows = 0;
  for (const file of files) {
    let raw = fs.readFileSync(file, "utf8");
    const rows = parse(raw, { columns: true, skip_empty_lines: true });
    for (const row of rows) {
      const hasPublicLink = [row.web, row.Facebook, row.Instagram, row["Google Maps"]]
        .some((value) => Boolean(clean(value)));
      if (row.verificacion === "verificado" && !hasPublicLink) {
        raw = replaceVerification(raw, { file, row }, "parcial");
        changedRows += 1;
      }
    }
    fs.writeFileSync(file, raw);
  }
  return changedRows;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    usage();
    process.exitCode = 1;
    return;
  }
  if (args.help) return usage();
  loadEnvFile();
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is missing (environment or .env.local)");

  const countryRoot = path.join(CSV_ROOT, args.country);
  const files = walkCsvFiles(countryRoot).filter((file) => !args.area || path.basename(file, ".csv") === args.area);
  if (args.area && !files.length) throw new Error(`area '${args.area}' was not found in ${args.country}`);
  const queue = [];
  for (const file of files.sort()) {
    const rows = parse(fs.readFileSync(file), { columns: true, skip_empty_lines: true });
    for (const row of rows) {
      const oldUrl = clean(row["Google Maps"]);
      if (!oldUrl || currentPlaceId(oldUrl)) continue;
      const key = `v${QUERY_VERSION}:${path.relative(CSV_ROOT, file)}:${row.slug}:${oldUrl}`;
      queue.push({ file, row, oldUrl, key });
    }
  }

  const cachePath = path.resolve(ROOT, args.cache ?? `tmp/google-maps-review-${args.country}.jsonl`);
  const cache = loadCache(cachePath);
  let completed = 0;
  const records = await mapConcurrent(queue, args.concurrency, async (item) => {
    if (cache.has(item.key)) {
      const stored = cache.get(item.key);
      const rescored = (stored.candidates ?? []).map((candidate) => (
        scoreCandidate(item.row, candidate, args.country)
      ));
      const classification = classify(item.row, rescored);
      return {
        ...item,
        ...stored,
        status: classification.status,
        selected: classification.selected,
        candidates: classification.ranked ?? rescored,
      };
    }
    const candidates = (await searchPlaces(item.row, args.country, apiKey))
      .map((candidate) => scoreCandidate(item.row, candidate, args.country));
    const classification = classify(item.row, candidates);
    const stored = {
      key: item.key,
      country: args.country,
      area: path.basename(item.file, ".csv"),
      slug: item.row.slug,
      query: buildQuery(item.row, args.country),
      status: classification.status,
      selected: classification.selected,
      candidates: classification.ranked ?? candidates,
      reviewedAt: new Date().toISOString(),
    };
    appendCache(cachePath, stored);
    completed += 1;
    if (completed % 50 === 0) console.error(`reviewed ${completed}/${queue.length} uncached rows`);
    return { ...item, ...stored };
  });

  const counts = { accepted: 0, ambiguous: 0, missing: 0 };
  for (const record of records) counts[record.status] += 1;
  const reportPath = path.resolve(
    ROOT,
    args.report ?? `tmp/google-maps-review-${args.country}-current.json`,
  );
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(records.map((record) => ({
    area: path.basename(record.file, ".csv"),
    file: path.relative(ROOT, record.file),
    slug: record.row.slug,
    nombre: record.row.nombre,
    categoria: record.row.categoria,
    municipio: record.row.municipio,
    direccion: record.row.direccion,
    telefono: record.row.telefono,
    web: record.row.web,
    oldUrl: record.oldUrl,
    status: record.status,
    selected: record.selected,
    candidates: record.candidates,
  })), null, 2)}\n`);
  let changedRows = args.apply
    ? (args.decisions
      ? applyDecisions(records, path.resolve(ROOT, args.decisions))
      : (args.clearUnresolved ? clearUnresolved(records) : applyReplacements(records)))
    : 0;
  if (args.repairVerification) changedRows += repairVerification(files);
  console.log(`Google Maps review — ${args.country}${args.area ? `/${args.area}` : ""}`);
  console.log(`- queued legacy links: ${queue.length}`);
  console.log(`- accepted: ${counts.accepted}`);
  console.log(`- ambiguous: ${counts.ambiguous}`);
  console.log(`- missing: ${counts.missing}`);
  console.log(`- applied: ${changedRows}`);
  console.log(`- cache: ${path.relative(ROOT, cachePath)}`);
  console.log(`- report: ${path.relative(ROOT, reportPath)}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
