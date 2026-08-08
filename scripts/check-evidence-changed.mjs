#!/usr/bin/env node

// Warning-only companion to `check:evidence`. For every CSV changed in the
// working tree (staged, unstaged, or untracked) under data/csv, it diffs the
// row state against HEAD and warns when an editorial decision that the evidence
// contract expects to be recorded — a new producer, a changed `verificacion` or
// `Venta online`, or a removed row (purge/merge) — has no matching line touched
// in the matching area evidence ledger.
//
// It never fails the build. It makes the evidence invariant visible while a
// ledger is still incomplete, where `check:evidence` alone cannot require a
// record to exist. Use it while iterating; `verify:data` still checks evidence
// structure and CSV parity.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";

const CSV_PREFIX = "data/csv/";
const EVIDENCE_PREFIX = "data/evidence/";
const MAX_LINES_PER_FILE = 15;

function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

function changedCsvFiles() {
  const files = new Set();
  const collect = (args) => {
    git(args)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((file) => files.add(file));
  };

  collect(["diff", "--name-only", "--", `${CSV_PREFIX}*.csv`]);
  collect(["diff", "--name-only", "--cached", "--", `${CSV_PREFIX}*.csv`]);
  collect([
    "ls-files",
    "--others",
    "--exclude-standard",
    "--",
    `${CSV_PREFIX}*.csv`,
  ]);

  return [...files].sort();
}

function headContent(relPath) {
  return git(["show", `HEAD:${relPath}`]);
}

function currentContent(relPath) {
  return fs.existsSync(relPath) ? fs.readFileSync(relPath, "utf8") : "";
}

function parseCsvRows(content) {
  if (!content.trim()) return new Map();
  const rows = parse(content, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });
  return new Map(
    rows
      .map((row) => [String(row.slug ?? "").trim(), row])
      .filter(([slug]) => slug),
  );
}

function parseJsonlBySlug(content) {
  const map = new Map();
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let slug = "";
    try {
      slug = String(JSON.parse(trimmed).slug ?? "").trim();
    } catch {
      return;
    }
    if (slug) map.set(slug, trimmed);
  });
  return map;
}

function value(row, key) {
  return String(row?.[key] ?? "").trim();
}

// Slugs whose evidence line was added or changed in the working tree.
function touchedEvidenceSlugs(evidencePath) {
  const head = parseJsonlBySlug(headContent(evidencePath));
  const current = parseJsonlBySlug(currentContent(evidencePath));
  const touched = new Set();
  for (const [slug, line] of current) {
    if (head.get(slug) !== line) touched.add(slug);
  }
  return touched;
}

function decisionsNeedingEvidence(headRows, currentRows) {
  const needs = [];

  for (const [slug, row] of currentRows) {
    const prev = headRows.get(slug);
    if (!prev) {
      needs.push({ slug, reason: "new producer" });
      continue;
    }
    const verifChanged =
      value(prev, "verificacion") !== value(row, "verificacion");
    const ventaChanged =
      value(prev, "Venta online") !== value(row, "Venta online");
    if (!verifChanged && !ventaChanged) continue;

    const parts = [];
    if (verifChanged) {
      parts.push(
        `verificacion ${value(prev, "verificacion")}→${value(row, "verificacion")}`,
      );
    }
    if (ventaChanged) {
      parts.push(
        `Venta online ${value(prev, "Venta online")}→${value(row, "Venta online")}`,
      );
    }
    needs.push({ slug, reason: parts.join(", ") });
  }

  for (const slug of headRows.keys()) {
    if (!currentRows.has(slug)) {
      needs.push({ slug, reason: "removed (purge/merge)" });
    }
  }

  return needs;
}

export function auditChangedEvidence() {
  const csvFiles = changedCsvFiles();
  const warnings = [];
  let decisions = 0;
  let missing = 0;

  for (const csvPath of csvFiles) {
    const evidencePath = `${EVIDENCE_PREFIX}${csvPath.slice(CSV_PREFIX.length)}`.replace(
      /\.csv$/,
      ".jsonl",
    );

    const headRows = parseCsvRows(headContent(csvPath));
    const currentRows = parseCsvRows(currentContent(csvPath));
    const needs = decisionsNeedingEvidence(headRows, currentRows);
    if (needs.length === 0) continue;

    decisions += needs.length;
    const touched = touchedEvidenceSlugs(evidencePath);
    const uncovered = needs.filter((need) => !touched.has(need.slug));
    if (uncovered.length === 0) continue;

    missing += uncovered.length;
    warnings.push({ csvPath, evidencePath, uncovered });
  }

  return { files: csvFiles.length, decisions, missing, warnings };
}

function report(result) {
  if (result.files === 0) {
    console.log("No changed CSV files under data/csv.");
    return;
  }

  console.log("Changed-evidence audit (warning-only)");

  for (const warning of result.warnings) {
    console.log("");
    console.log(
      `WARN ${warning.csvPath}: ${warning.uncovered.length} editorial decision(s) without a matching record in ${warning.evidencePath}`,
    );
    warning.uncovered.slice(0, MAX_LINES_PER_FILE).forEach((need) => {
      console.log(`  - ${need.slug}: ${need.reason}`);
    });
    const remaining = warning.uncovered.length - MAX_LINES_PER_FILE;
    if (remaining > 0) {
      console.log(`  … and ${remaining} more`);
    }
  }

  console.log("");
  console.log("Summary");
  console.log(`- changed CSV files: ${result.files}`);
  console.log(`- decisions needing evidence: ${result.decisions}`);
  console.log(`- without a matching record: ${result.missing}`);
  console.log(
    `- status: ${result.missing === 0 ? "OK" : "WARN (non-blocking)"}`,
  );
}

function main() {
  const repoRoot = git(["rev-parse", "--show-toplevel"]).trim();
  if (repoRoot) process.chdir(repoRoot);
  report(auditChangedEvidence());
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
