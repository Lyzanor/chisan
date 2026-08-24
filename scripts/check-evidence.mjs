#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";

import { classifyCatalogCsvPath } from "./lib/catalog-translations.mjs";

const DEFAULT_CSV_ROOT = "data/csv";
const DEFAULT_EVIDENCE_ROOT = "data/evidence";

const ACTIONS = new Set(["keep", "reject", "purge", "merge"]);
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
const EXCLUSION_REASONS = new Set([
  "not-producer",
  "other-area",
  "closed",
  "nonexistent",
  "out-of-scope",
]);

const TOP_LEVEL_KEYS = new Set([
  "slug",
  "action",
  "reason",
  "targetSlug",
  "sources",
  "notes",
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

function readCsvRows(csvPath) {
  const raw = fs.readFileSync(csvPath, "utf8");
  const rows = parse(raw, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });

  return new Map(rows.map((row) => [String(row.slug ?? "").trim(), row]));
}

function validateString(record, key, location, errors) {
  if (typeof record[key] !== "string" || !record[key].trim()) {
    errors.push(`${location}: '${key}' must be a non-empty string`);
    return "";
  }
  return record[key].trim();
}

// A record proves nothing without sources: this is the only part of the record
// that is not already answered by the CSV or by Git.
function validateSources(record, location, errors) {
  if (!Array.isArray(record.sources) || record.sources.length === 0) {
    errors.push(`${location}: 'sources' must be a non-empty array`);
    return;
  }

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

    const checkedAt = validateString(source, "checkedAt", sourceLocation, errors);
    if (checkedAt && !isIsoDate(checkedAt)) {
      errors.push(`${sourceLocation}: checkedAt must be YYYY-MM-DD`);
    } else if (checkedAt > todayIso()) {
      errors.push(`${sourceLocation}: checkedAt cannot be in the future`);
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
    }

    if (source.note !== undefined && typeof source.note !== "string") {
      errors.push(`${sourceLocation}: note must be a string`);
    }
  });
}

// Each action states where the slug must be: present for `keep`, gone for the
// tombstones. That relationship is the only thing the CSV cannot say by itself.
function validateAction({ record, row, rows, location, errors }) {
  const action = record.action;

  if (action === "keep") {
    if (!row) {
      errors.push(`${location}: keep record slug does not exist in area CSV`);
    }
    if (record.reason !== undefined || record.targetSlug !== undefined) {
      errors.push(`${location}: keep record cannot set reason or targetSlug`);
    }
    return;
  }

  if (action === "reject" || action === "purge") {
    if (row) {
      errors.push(`${location}: ${action} slug still exists in area CSV`);
    }
    if (record.targetSlug !== undefined) {
      errors.push(`${location}: ${action} record cannot set targetSlug`);
    }
    if (!EXCLUSION_REASONS.has(record.reason)) {
      errors.push(
        `${location}: unsupported ${action} reason '${record.reason}' (allowed: ${[...EXCLUSION_REASONS].join(", ")})`,
      );
    }
    return;
  }

  if (action === "merge") {
    if (row) {
      errors.push(`${location}: merged source slug still exists in area CSV`);
    }
    if (record.reason !== undefined) {
      errors.push(`${location}: merge record cannot set reason`);
    }
    const targetSlug = validateString(record, "targetSlug", location, errors);
    if (targetSlug && !rows.has(targetSlug)) {
      errors.push(`${location}: merge target '${targetSlug}' is not in area CSV`);
    }
    if (targetSlug === record.slug) {
      errors.push(`${location}: merge target must differ from source slug`);
    }
  }
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

    const action = validateString(record, "action", location, errors);
    if (action && !ACTIONS.has(action)) {
      errors.push(`${location}: unsupported action '${action}'`);
    }

    if (record.notes !== undefined && typeof record.notes !== "string") {
      errors.push(`${location}: notes must be a string`);
    }

    validateSources(record, location, errors);
    if (ACTIONS.has(action)) {
      validateAction({ record, row: rows.get(slug), rows, location, errors });
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
  const catalogFiles = listFiles(resolvedCsvRoot, ".csv").filter(
    (file) => classifyCatalogCsvPath(resolvedCsvRoot, file).kind === "area",
  );
  const catalogRows = catalogFiles.reduce(
    (sum, csvPath) => sum + readCsvRows(csvPath).size,
    0,
  );
  const evidenceFiles = listFiles(resolvedEvidenceRoot, ".jsonl");
  const areaResults = new Map();

  for (const evidencePath of evidenceFiles) {
    const relative = path.relative(resolvedEvidenceRoot, evidencePath);
    const areaKey = relative.slice(0, -".jsonl".length);
    if (!/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/.test(areaKey)) {
      errors.push(
        `${evidencePath}: evidence path must be <country>/<region>/<area>.jsonl`,
      );
      continue;
    }

    const csvPath = path.join(resolvedCsvRoot, `${areaKey}.csv`);
    if (!fs.existsSync(csvPath)) {
      errors.push(`${evidencePath}: matching CSV not found at ${csvPath}`);
      continue;
    }

    areaResults.set(areaKey, validateEvidenceFile(evidencePath, csvPath, errors));
  }

  let documentedRows = 0;
  let tombstones = 0;
  for (const { rows, records } of areaResults.values()) {
    documentedRows += [...rows.keys()].filter(
      (slug) => records.get(slug)?.action === "keep",
    ).length;
    tombstones += [...records.values()].filter(
      (record) => record.action !== "keep",
    ).length;
  }

  return {
    errors,
    catalogAreas: catalogFiles.length,
    catalogRows,
    files: evidenceFiles.length,
    records: [...areaResults.values()].reduce(
      (sum, result) => sum + result.records.size,
      0,
    ),
    documentedRows,
    tombstones,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = auditEvidence(args);

  console.log("Evidence contract audit summary");
  console.log(`- catalog areas: ${result.catalogAreas}`);
  console.log(`- evidence ledgers: ${result.files}`);
  console.log(`- records: ${result.records} (${result.tombstones} tombstones)`);
  console.log(
    `- current catalog rows with a keep record: ${result.documentedRows}/${result.catalogRows}`,
  );
  console.log(`- issues: ${result.errors.length}`);

  if (result.errors.length === 0) {
    console.log("- status: OK");
    return;
  }

  console.log("");
  for (const error of result.errors) {
    console.log(`ERROR ${error}`);
  }
  console.log("");
  console.log(
    "Coverage is advisory and never fails; the malformed records above do.",
  );
  process.exitCode = 1;
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
