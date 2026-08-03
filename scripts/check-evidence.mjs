#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";

const DEFAULT_CSV_ROOT = "data/csv";
const DEFAULT_EVIDENCE_ROOT = "data/evidence";
const COVERAGE_FILE = "coverage.json";

const ACTIONS = new Set(["keep", "purge", "merge"]);
const VERIFICATION_VALUES = new Set(["pendiente", "parcial", "verificado"]);
const ONLINE_SALES_VALUES = new Set(["sí", "no", "no comprobado"]);
const SALES_CHANNEL_VALUES = new Set([
  "ecommerce",
  "whatsapp",
  "email",
  "telefono",
  "suscripcion",
  "marketplace",
]);
const SOURCE_TYPES = new Set([
  "official-site",
  "official-store",
  "official-social",
  "google-maps",
  "public-registry",
  "regulatory-council",
  "institutional-directory",
  "marketplace",
  "press",
  "other",
]);
const CLAIMS = new Set([
  "identity",
  "producer-activity",
  "municipality",
  "location",
  "contact",
  "online-sales",
  "link-ownership",
  "duplicate",
  "closure",
  "scope",
  "existence",
]);
const PURGE_REASONS = new Set([
  "not-producer",
  "other-province",
  "closed",
  "nonexistent",
  "out-of-scope",
]);
const PRIMARY_SOURCE_TYPES = new Set([
  "official-site",
  "official-store",
  "official-social",
  "google-maps",
  "marketplace",
]);

const TOP_LEVEL_KEYS = new Set([
  "slug",
  "reviewedAt",
  "reviewedBy",
  "action",
  "decision",
  "targetSlug",
  "reason",
  "sources",
  "notes",
]);
const DECISION_KEYS = new Set([
  "verification",
  "onlineSales",
  "salesChannels",
]);
const SOURCE_KEYS = new Set(["url", "type", "checkedAt", "claims", "note"]);

function parseArgs(argv) {
  const args = {
    csvRoot: DEFAULT_CSV_ROOT,
    evidenceRoot: DEFAULT_EVIDENCE_ROOT,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--csv-root") {
      args.csvRoot = argv[++index];
      continue;
    }
    if (arg === "--evidence-root") {
      args.evidenceRoot = argv[++index];
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.csvRoot || !args.evidenceRoot) {
    throw new Error("--csv-root and --evidence-root require a path");
  }

  return args;
}

function listFiles(root, extension) {
  if (!fs.existsSync(root)) return [];

  return fs
    .readdirSync(root, { recursive: true })
    .filter((file) => file.endsWith(extension))
    .map((file) => path.join(root, file))
    .sort();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unknownKeys(value, allowed) {
  if (!isPlainObject(value)) return [];
  return Object.keys(value).filter((key) => !allowed.has(key));
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeOnlineSales(value) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase() === "si"
    ? "sí"
    : String(value ?? "").trim();
}

function parseSalesChannels(value) {
  return String(value ?? "")
    .split("|")
    .map((token) => token.trim())
    .filter(Boolean);
}

function sameSet(left, right) {
  return (
    left.length === right.length &&
    [...new Set(left)].sort().join("|") === [...new Set(right)].sort().join("|")
  );
}

function readCsvRows(csvPath) {
  const raw = fs.readFileSync(csvPath, "utf8");
  const rows = parse(raw, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });

  return new Map(rows.map((row) => [String(row.slug ?? "").trim(), row]));
}

function loadCoverage(evidenceRoot, errors) {
  const coveragePath = path.join(evidenceRoot, COVERAGE_FILE);
  if (!fs.existsSync(coveragePath)) {
    errors.push(`${coveragePath}: missing coverage manifest`);
    return [];
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
  } catch (error) {
    errors.push(`${coveragePath}: invalid JSON (${error.message})`);
    return [];
  }

  if (
    !isPlainObject(manifest) ||
    manifest.version !== 1 ||
    !Array.isArray(manifest.strictProvinces)
  ) {
    errors.push(
      `${coveragePath}: expected {"version":1,"strictProvinces":[...]}`,
    );
    return [];
  }

  const unknown = unknownKeys(manifest, new Set(["version", "strictProvinces"]));
  if (unknown.length) {
    errors.push(`${coveragePath}: unknown field(s): ${unknown.join(", ")}`);
  }

  const seen = new Set();
  for (const province of manifest.strictProvinces) {
    if (
      typeof province !== "string" ||
      !/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/.test(province)
    ) {
      errors.push(`${coveragePath}: invalid strict province '${province}'`);
      continue;
    }
    if (seen.has(province)) {
      errors.push(`${coveragePath}: duplicated strict province '${province}'`);
    }
    seen.add(province);
  }

  return [...seen].sort();
}

function validateString(record, key, location, errors) {
  if (typeof record[key] !== "string" || !record[key].trim()) {
    errors.push(`${location}: '${key}' must be a non-empty string`);
    return "";
  }
  return record[key].trim();
}

function validateSources(record, reviewedAt, location, errors) {
  if (!Array.isArray(record.sources) || record.sources.length === 0) {
    errors.push(`${location}: 'sources' must be a non-empty array`);
    return { claims: new Set(), types: new Set() };
  }

  const claims = new Set();
  const types = new Set();
  const urls = new Set();

  record.sources.forEach((source, index) => {
    const sourceLocation = `${location} source ${index + 1}`;
    if (!isPlainObject(source)) {
      errors.push(`${sourceLocation}: source must be an object`);
      return;
    }

    const unknown = unknownKeys(source, SOURCE_KEYS);
    if (unknown.length) {
      errors.push(`${sourceLocation}: unknown field(s): ${unknown.join(", ")}`);
    }

    const url = validateString(source, "url", sourceLocation, errors);
    if (url) {
      try {
        const parsedUrl = new URL(url);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          errors.push(`${sourceLocation}: source URL must use http or https`);
        }
      } catch {
        errors.push(`${sourceLocation}: source URL is invalid`);
      }
      if (urls.has(url)) {
        errors.push(`${sourceLocation}: duplicated source URL '${url}'`);
      }
      urls.add(url);
    }

    const type = validateString(source, "type", sourceLocation, errors);
    if (type && !SOURCE_TYPES.has(type)) {
      errors.push(
        `${sourceLocation}: unsupported source type '${type}' (allowed: ${[...SOURCE_TYPES].join(", ")})`,
      );
    }
    types.add(type);

    const checkedAt = validateString(
      source,
      "checkedAt",
      sourceLocation,
      errors,
    );
    if (checkedAt && !isIsoDate(checkedAt)) {
      errors.push(`${sourceLocation}: checkedAt must be YYYY-MM-DD`);
    } else if (checkedAt > todayIso()) {
      errors.push(`${sourceLocation}: checkedAt cannot be in the future`);
    } else if (reviewedAt && checkedAt > reviewedAt) {
      errors.push(
        `${sourceLocation}: checkedAt cannot be after reviewedAt '${reviewedAt}'`,
      );
    }

    if (!Array.isArray(source.claims) || source.claims.length === 0) {
      errors.push(`${sourceLocation}: claims must be a non-empty array`);
      return;
    }

    const sourceClaims = new Set();
    for (const claim of source.claims) {
      if (typeof claim !== "string" || !CLAIMS.has(claim)) {
        errors.push(`${sourceLocation}: unsupported claim '${claim}'`);
        continue;
      }
      if (sourceClaims.has(claim)) {
        errors.push(`${sourceLocation}: duplicated claim '${claim}'`);
      }
      sourceClaims.add(claim);
      claims.add(claim);
    }

    if (source.note !== undefined && typeof source.note !== "string") {
      errors.push(`${sourceLocation}: note must be a string`);
    }
  });

  return { claims, types };
}

function requireClaims(claims, required, location, errors) {
  for (const claim of required) {
    if (!claims.has(claim)) {
      errors.push(`${location}: evidence is missing required claim '${claim}'`);
    }
  }
}

function validateKeepRecord({
  record,
  row,
  claims,
  types,
  location,
  errors,
}) {
  if (!row) {
    errors.push(`${location}: keep record slug does not exist in province CSV`);
    return;
  }

  if (!isPlainObject(record.decision)) {
    errors.push(`${location}: keep record requires a decision object`);
    return;
  }

  const unknown = unknownKeys(record.decision, DECISION_KEYS);
  if (unknown.length) {
    errors.push(`${location}: decision has unknown field(s): ${unknown.join(", ")}`);
  }

  const verification = record.decision.verification;
  const onlineSales = record.decision.onlineSales;
  const salesChannels = record.decision.salesChannels;

  if (!VERIFICATION_VALUES.has(verification)) {
    errors.push(`${location}: unsupported verification '${verification}'`);
  }
  if (!ONLINE_SALES_VALUES.has(onlineSales)) {
    errors.push(`${location}: unsupported onlineSales '${onlineSales}'`);
  }
  if (!Array.isArray(salesChannels)) {
    errors.push(`${location}: salesChannels must be an array`);
  } else {
    const uniqueChannels = new Set();
    for (const channel of salesChannels) {
      if (!SALES_CHANNEL_VALUES.has(channel)) {
        errors.push(`${location}: unsupported sales channel '${channel}'`);
      }
      if (uniqueChannels.has(channel)) {
        errors.push(`${location}: duplicated sales channel '${channel}'`);
      }
      uniqueChannels.add(channel);
    }
  }

  const csvVerification = String(row.verificacion ?? "").trim();
  const csvOnlineSales = normalizeOnlineSales(row["Venta online"]);
  const csvSalesChannels = parseSalesChannels(row["Canal de venta"]);

  if (verification !== csvVerification) {
    errors.push(
      `${location}: verification '${verification}' does not match CSV '${csvVerification}'`,
    );
  }
  if (onlineSales !== csvOnlineSales) {
    errors.push(
      `${location}: onlineSales '${onlineSales}' does not match CSV '${csvOnlineSales}'`,
    );
  }
  if (
    Array.isArray(salesChannels) &&
    !sameSet(salesChannels, csvSalesChannels)
  ) {
    errors.push(
      `${location}: salesChannels do not match CSV Canal de venta '${csvSalesChannels.join("|")}'`,
    );
  }

  if (
    Array.isArray(salesChannels) &&
    onlineSales !== "sí" &&
    salesChannels.length > 0
  ) {
    errors.push(`${location}: salesChannels require onlineSales='sí'`);
  }

  if (verification === "verificado") {
    requireClaims(
      claims,
      ["identity", "producer-activity", "municipality"],
      location,
      errors,
    );
    if (![...types].some((type) => PRIMARY_SOURCE_TYPES.has(type))) {
      errors.push(
        `${location}: verificado requires at least one current primary/reliable source type (${[...PRIMARY_SOURCE_TYPES].join(", ")})`,
      );
    }
  } else if (verification === "parcial") {
    requireClaims(claims, ["identity", "municipality"], location, errors);
  }

  if (onlineSales === "sí" || onlineSales === "no") {
    requireClaims(claims, ["online-sales"], location, errors);
  }

  if (record.targetSlug !== undefined || record.reason !== undefined) {
    errors.push(`${location}: keep record cannot set targetSlug or reason`);
  }
}

function validatePurgeRecord({ record, row, claims, location, errors }) {
  if (row) {
    errors.push(`${location}: purged slug still exists in province CSV`);
  }
  if (record.decision !== undefined || record.targetSlug !== undefined) {
    errors.push(`${location}: purge record cannot set decision or targetSlug`);
  }
  if (!PURGE_REASONS.has(record.reason)) {
    errors.push(`${location}: unsupported purge reason '${record.reason}'`);
    return;
  }

  const claimByReason = {
    "not-producer": "scope",
    "other-province": "municipality",
    closed: "closure",
    nonexistent: "existence",
    "out-of-scope": "scope",
  };
  requireClaims(claims, [claimByReason[record.reason]], location, errors);
}

function validateMergeRecord({
  record,
  row,
  rows,
  claims,
  location,
  errors,
}) {
  if (row) {
    errors.push(`${location}: merged source slug still exists in province CSV`);
  }
  if (record.decision !== undefined || record.reason !== undefined) {
    errors.push(`${location}: merge record cannot set decision or reason`);
  }

  const targetSlug = validateString(record, "targetSlug", location, errors);
  if (targetSlug && !rows.has(targetSlug)) {
    errors.push(`${location}: merge target '${targetSlug}' is not in province CSV`);
  }
  if (targetSlug === record.slug) {
    errors.push(`${location}: merge target must differ from source slug`);
  }
  requireClaims(claims, ["duplicate"], location, errors);
}

function validateEvidenceFile(evidencePath, csvPath, errors) {
  const rows = readCsvRows(csvPath);
  const raw = fs.readFileSync(evidencePath, "utf8");
  const records = new Map();

  raw.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim()) return;

    const location = `${evidencePath}:${index + 1}`;
    let record;
    try {
      record = JSON.parse(line);
    } catch (error) {
      errors.push(`${location}: invalid JSON (${error.message})`);
      return;
    }

    if (!isPlainObject(record)) {
      errors.push(`${location}: each JSONL line must be an object`);
      return;
    }

    const unknown = unknownKeys(record, TOP_LEVEL_KEYS);
    if (unknown.length) {
      errors.push(`${location}: unknown field(s): ${unknown.join(", ")}`);
    }

    const slug = validateString(record, "slug", location, errors);
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.push(`${location}: slug must use lowercase ASCII kebab-case`);
    }
    if (slug && records.has(slug)) {
      errors.push(`${location}: duplicated evidence slug '${slug}'`);
    }

    const reviewedAt = validateString(record, "reviewedAt", location, errors);
    if (reviewedAt && !isIsoDate(reviewedAt)) {
      errors.push(`${location}: reviewedAt must be YYYY-MM-DD`);
    } else if (reviewedAt > todayIso()) {
      errors.push(`${location}: reviewedAt cannot be in the future`);
    }

    validateString(record, "reviewedBy", location, errors);

    const action = validateString(record, "action", location, errors);
    if (action && !ACTIONS.has(action)) {
      errors.push(`${location}: unsupported action '${action}'`);
    }

    if (record.notes !== undefined && typeof record.notes !== "string") {
      errors.push(`${location}: notes must be a string`);
    }

    const { claims, types } = validateSources(
      record,
      reviewedAt,
      location,
      errors,
    );
    const row = rows.get(slug);

    if (action === "keep") {
      validateKeepRecord({ record, row, claims, types, location, errors });
    } else if (action === "purge") {
      validatePurgeRecord({ record, row, claims, location, errors });
    } else if (action === "merge") {
      validateMergeRecord({
        record,
        row,
        rows,
        claims,
        location,
        errors,
      });
    }

    if (slug) {
      records.set(slug, record);
    }
  });

  return { rows, records };
}

export function auditEvidence({
  csvRoot = DEFAULT_CSV_ROOT,
  evidenceRoot = DEFAULT_EVIDENCE_ROOT,
} = {}) {
  const resolvedCsvRoot = path.resolve(csvRoot);
  const resolvedEvidenceRoot = path.resolve(evidenceRoot);
  const errors = [];
  const strictProvinces = loadCoverage(resolvedEvidenceRoot, errors);
  const evidenceFiles = listFiles(resolvedEvidenceRoot, ".jsonl");
  const provinceResults = new Map();

  for (const evidencePath of evidenceFiles) {
    const relative = path.relative(resolvedEvidenceRoot, evidencePath);
    const provinceKey = relative.slice(0, -".jsonl".length);
    if (!/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/.test(provinceKey)) {
      errors.push(
        `${evidencePath}: evidence path must be <country>/<community>/<province>.jsonl`,
      );
      continue;
    }

    const csvPath = path.join(resolvedCsvRoot, `${provinceKey}.csv`);
    if (!fs.existsSync(csvPath)) {
      errors.push(`${evidencePath}: matching CSV not found at ${csvPath}`);
      continue;
    }

    provinceResults.set(
      provinceKey,
      validateEvidenceFile(evidencePath, csvPath, errors),
    );
  }

  // Strict coverage is advisory, not enforced. Evidence is an optional audit
  // layer, so a province listed in coverage.json is never required to carry a
  // keep record for every CSV row. The list still marks fully-documented
  // provinces, but its gaps never block.

  return {
    errors,
    files: evidenceFiles.length,
    records: [...provinceResults.values()].reduce(
      (sum, result) => sum + result.records.size,
      0,
    ),
    strictProvinces: strictProvinces.length,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = auditEvidence(args);

  console.log("Evidence contract audit summary");
  console.log(`- files: ${result.files}`);
  console.log(`- records: ${result.records}`);
  console.log(`- advisory strict provinces: ${result.strictProvinces}`);
  console.log(`- issues: ${result.errors.length}`);

  if (result.errors.length === 0) {
    console.log("- status: OK");
    return;
  }

  console.log("");
  for (const error of result.errors) {
    console.log(`WARN ${error}`);
  }
  console.log("");
  console.log(
    "Evidence is an optional audit layer; the issues above are warnings and never block.",
  );
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
