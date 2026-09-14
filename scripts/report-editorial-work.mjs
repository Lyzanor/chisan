#!/usr/bin/env node

// Read-only view of the editorial footprint that already exists across the
// catalog, candidate workspace and evidence ledgers. Counts are derived so
// area notes do not need hand-maintained queue totals.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";

import { classifyCatalogCsvPath } from "./lib/catalog-translations.mjs";
import { resolveDefaultCatalogCountry } from "./lib/catalog-operation-scope.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_CSV_ROOT = path.join(REPO_ROOT, "data", "csv");
const DEFAULT_EVIDENCE_ROOT = path.join(REPO_ROOT, "data", "evidence");
const DEFAULT_CANDIDATE_ROOT = path.join(REPO_ROOT, "docs", "candidates");
const CORE_KEEP_CLAIMS = ["identity", "producer-activity", "municipality"];

function listFiles(root, extension) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { recursive: true })
    .filter((file) => file.endsWith(extension))
    .map((file) => path.join(root, file))
    .sort();
}

function normalizeHeading(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function splitMarkdownRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return [];
  const body = trimmed.endsWith("|") ? trimmed.slice(1, -1) : trimmed.slice(1);
  const cells = [];
  let current = "";

  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    if (char === "\\" && body[index + 1] === "|") {
      current += "|";
      index += 1;
      continue;
    }
    if (char === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

function isTableSeparator(line) {
  const cells = splitMarkdownRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isCandidateHeader(cells) {
  const headings = cells.map(normalizeHeading);
  if (!["name", "nombre"].includes(headings[0])) return false;
  return headings.some(
    (heading) =>
      heading.includes("remaining work") ||
      heading.includes("visible doubt") ||
      heading.includes("blocking doubt") ||
      heading.includes("trabajo restante") ||
      heading.includes("duda visible"),
  );
}

export function countCandidateTables(markdown) {
  const lines = markdown.split(/\r?\n/);
  let batches = 0;
  let rows = 0;

  for (let index = 0; index + 1 < lines.length; index += 1) {
    const header = splitMarkdownRow(lines[index]);
    if (!isCandidateHeader(header) || !isTableSeparator(lines[index + 1])) {
      continue;
    }

    batches += 1;
    let rowIndex = index + 2;
    while (rowIndex < lines.length && lines[rowIndex].trim().startsWith("|")) {
      const cells = splitMarkdownRow(lines[rowIndex]);
      if (cells.some(Boolean)) rows += 1;
      rowIndex += 1;
    }
    index = rowIndex - 1;
  }

  return { batches, rows };
}

function readCatalog(csvRoot, country) {
  const countryRoot = path.join(csvRoot, country);
  const files = listFiles(countryRoot, ".csv").filter(
    (file) => classifyCatalogCsvPath(csvRoot, file).kind === "area",
  );
  const rowKeys = new Set();
  let rows = 0;

  for (const file of files) {
    const records = parse(fs.readFileSync(file, "utf8"), {
      bom: true,
      columns: true,
      skip_empty_lines: true,
    });
    const areaKey = path
      .relative(countryRoot, file)
      .replace(/\.csv$/, "")
      .split(path.sep)
      .join("/");
    for (const record of records) {
      const slug = String(record.slug ?? "").trim();
      if (slug) rowKeys.add(`${areaKey}/${slug}`);
    }
    rows += records.length;
  }

  return { areas: files.length, rows, rowKeys };
}

function readEvidence(evidenceRoot, country, catalogKeys) {
  const countryRoot = path.join(evidenceRoot, country);
  const files = listFiles(countryRoot, ".jsonl");
  const actions = { keep: 0, reject: 0, purge: 0, merge: 0 };
  let records = 0;
  let sources = 0;
  let currentKeeps = 0;
  let coreClaimKeeps = 0;

  for (const file of files) {
    const areaKey = path
      .relative(countryRoot, file)
      .replace(/\.jsonl$/, "")
      .split(path.sep)
      .join("/");
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) continue;
      const record = JSON.parse(line);
      records += 1;
      if (Object.hasOwn(actions, record.action)) actions[record.action] += 1;
      const recordSources = Array.isArray(record.sources) ? record.sources : [];
      sources += recordSources.length;

      const slug = String(record.slug ?? "").trim();
      if (record.action !== "keep" || !catalogKeys.has(`${areaKey}/${slug}`)) {
        continue;
      }
      currentKeeps += 1;
      const claims = new Set(
        recordSources.flatMap((source) =>
          Array.isArray(source?.claims) ? source.claims : [],
        ),
      );
      if (CORE_KEEP_CLAIMS.every((claim) => claims.has(claim))) {
        coreClaimKeeps += 1;
      }
    }
  }

  return {
    ledgers: files.length,
    records,
    sources,
    actions,
    currentKeeps,
    coreClaimKeeps,
  };
}

function readCandidates(candidateRoot, country) {
  const countryRoot = path.join(candidateRoot, country);
  const areas = [];
  let batches = 0;
  let rows = 0;

  for (const file of listFiles(countryRoot, ".md")) {
    const counted = countCandidateTables(fs.readFileSync(file, "utf8"));
    if (counted.rows === 0) continue;
    const relativePath = path.relative(candidateRoot, file).split(path.sep).join("/");
    areas.push({
      area: path.basename(file, ".md"),
      path: relativePath,
      batches: counted.batches,
      rows: counted.rows,
    });
    batches += counted.batches;
    rows += counted.rows;
  }

  areas.sort((left, right) => right.rows - left.rows || left.area.localeCompare(right.area));
  return { files: areas.length, batches, rows, areas };
}

export function buildEditorialWorkReport({
  country,
  csvRoot = DEFAULT_CSV_ROOT,
  evidenceRoot = DEFAULT_EVIDENCE_ROOT,
  candidateRoot = DEFAULT_CANDIDATE_ROOT,
}) {
  if (!/^[a-z]{2}$/.test(country)) {
    throw new Error("country must be a lowercase two-letter catalog slug");
  }

  const catalog = readCatalog(csvRoot, country);
  const evidence = readEvidence(evidenceRoot, country, catalog.rowKeys);
  const candidates = readCandidates(candidateRoot, country);
  return {
    country,
    catalog: { areas: catalog.areas, rows: catalog.rows },
    candidates,
    evidence,
  };
}

function parseArgs(argv) {
  const args = { country: "", json: false, top: 10 };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      continue;
    } else if (arg === "--country") {
      args.country = String(argv[++index] ?? "");
    } else if (arg === "--json") {
      args.json = true;
    } else if (arg === "--top") {
      args.top = Number.parseInt(argv[++index] ?? "", 10);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isInteger(args.top) || args.top < 0) {
    throw new Error("--top must be a non-negative integer");
  }
  if (!args.country) args.country = resolveDefaultCatalogCountry(DEFAULT_CSV_ROOT);
  return args;
}

function percentage(part, total) {
  return total ? `${((part / total) * 100).toFixed(1)}%` : "0.0%";
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function printReport(report, top) {
  const { catalog, candidates, country, evidence } = report;
  console.log(`Editorial work report — ${country}`);
  console.log("");
  console.log("Catalog");
  console.log(`- published producer rows: ${formatNumber(catalog.rows)}`);
  console.log(`- area CSV files: ${formatNumber(catalog.areas)}`);
  console.log("");
  console.log("Open candidate workspace");
  console.log(`- structured candidate rows: ${formatNumber(candidates.rows)}`);
  console.log(`- area notes with candidates: ${formatNumber(candidates.files)}`);
  console.log(`- structured candidate tables: ${formatNumber(candidates.batches)}`);
  if (top > 0 && candidates.areas.length) {
    const queues = candidates.areas
      .slice(0, top)
      .map((area) => `${area.area} ${formatNumber(area.rows)}`)
      .join(" · ");
    console.log(`- largest queues: ${queues}`);
  }
  console.log("");
  console.log("Durable evidence");
  console.log(`- evidence records: ${formatNumber(evidence.records)}`);
  console.log(`- decision-source references: ${formatNumber(evidence.sources)}`);
  console.log(
    `- current rows with keep evidence: ${formatNumber(evidence.currentKeeps)}/${formatNumber(catalog.rows)} (${percentage(evidence.currentKeeps, catalog.rows)})`,
  );
  console.log(
    `- keeps mapping identity, activity and municipality: ${formatNumber(evidence.coreClaimKeeps)}/${formatNumber(evidence.currentKeeps)} (${percentage(evidence.coreClaimKeeps, evidence.currentKeeps)})`,
  );
  console.log(
    `- closed decisions: reject ${formatNumber(evidence.actions.reject)} · purge ${formatNumber(evidence.actions.purge)} · merge ${formatNumber(evidence.actions.merge)}`,
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = buildEditorialWorkReport({ country: args.country });
  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  printReport(report, args.top);
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
