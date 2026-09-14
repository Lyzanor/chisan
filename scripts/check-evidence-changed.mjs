#!/usr/bin/env node

// Warning-only companion to `check:evidence`. For every CSV changed in the
// working tree (staged, unstaged, or untracked) under data/csv, it diffs the
// row state against HEAD and warns when an editorial decision that the evidence
// contract expects to be recorded — a new producer, a changed `verificacion` or
// `Venta online`, or a removed row (purge/merge) — has no matching line touched
// in the matching area evidence ledger. For a new producer it also warns when
// the touched `keep` does not map every admission claim.
// Rows match by stable `producer_id` when both revisions have it, then by slug.
// During the one-time ID bootstrap, a unique set of unchanged identity/location
// fields prevents a pure slug cleanup from looking like an add plus a removal.
//
// It never fails the build. It makes the evidence invariant visible while a
// ledger is still incomplete, where `check:evidence` alone cannot require a
// record to exist. Use it while iterating; `verify:data` still fails on a
// malformed record.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";

import { classifyCatalogCsvPath } from "./lib/catalog-translations.mjs";
import { missingAdmissionEvidenceClaims } from "./check-evidence.mjs";

const CSV_PREFIX = "data/csv/";
const CSV_ROOT = CSV_PREFIX.slice(0, -1);
const EVIDENCE_PREFIX = "data/evidence/";
const MAX_LINES_PER_FILE = 15;

function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      stdio: ["pipe", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

export function isEvidenceAreaCsvPath(csvPath, csvRoot = CSV_ROOT) {
  return classifyCatalogCsvPath(csvRoot, csvPath).kind === "area";
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

  return [...files].filter((file) => isEvidenceAreaCsvPath(file)).sort();
}

function headContent(relPath) {
  return git(["show", `HEAD:${relPath}`]);
}

function currentContent(relPath) {
  return fs.existsSync(relPath) ? fs.readFileSync(relPath, "utf8") : "";
}

function parseCsvRows(content) {
  if (!content.trim()) return [];
  return parse(content, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });
}

function parseJsonlBySlug(content) {
  const map = new Map();
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let record;
    try {
      record = JSON.parse(trimmed);
    } catch {
      return;
    }
    const slug = String(record?.slug ?? "").trim();
    if (slug) map.set(slug, { line: trimmed, record });
  });
  return map;
}

function value(row, key) {
  return String(row?.[key] ?? "").trim();
}

function bootstrapIdentity(row) {
  return ["nombre", "municipio", "direccion", "web", "lat", "lon"]
    .map((key) => value(row, key))
    .join("\0");
}

// Slugs whose evidence line was added or changed in the working tree.
function touchedEvidenceSlugs(evidencePath) {
  const head = parseJsonlBySlug(headContent(evidencePath));
  const current = parseJsonlBySlug(currentContent(evidencePath));
  const touched = new Set();
  for (const [slug, item] of current) {
    if (head.get(slug)?.line !== item.line) touched.add(slug);
  }
  return touched;
}

function decisionsNeedingEvidence(headRows, currentRows) {
  const needs = [];
  const headById = new Map(
    headRows
      .map((row) => [value(row, "producer_id"), row])
      .filter(([producerId]) => producerId),
  );
  const headBySlug = new Map(
    headRows
      .map((row) => [value(row, "slug"), row])
      .filter(([slug]) => slug),
  );
  const bootstrapOwners = new Map();
  if (!headRows.some((row) => value(row, "producer_id"))) {
    for (const row of headRows) {
      const key = bootstrapIdentity(row);
      const owners = bootstrapOwners.get(key) ?? [];
      owners.push(row);
      bootstrapOwners.set(key, owners);
    }
  }
  const matchedHeadSlugs = new Set();

  for (const row of currentRows) {
    const slug = value(row, "slug");
    const producerId = value(row, "producer_id");
    const bootstrapMatches = bootstrapOwners.get(bootstrapIdentity(row)) ?? [];
    const prev =
      (producerId ? headById.get(producerId) : undefined) ??
      headBySlug.get(slug) ??
      (bootstrapMatches.length === 1 ? bootstrapMatches[0] : undefined);
    if (!prev) {
      needs.push({ slug, reason: "new producer" });
      continue;
    }
    matchedHeadSlugs.add(value(prev, "slug"));
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

  for (const row of headRows) {
    const slug = value(row, "slug");
    if (!matchedHeadSlugs.has(slug)) {
      needs.push({ slug, reason: "removed (purge/merge)" });
    }
  }

  return needs;
}

export function findIncompleteNewAdmissions(needs, touched, currentEvidence) {
  return needs.flatMap((need) => {
    if (need.reason !== "new producer" || !touched.has(need.slug)) return [];
    const record = currentEvidence.get(need.slug)?.record;
    if (record?.action !== "keep") return [];
    const claims = missingAdmissionEvidenceClaims(record);
    return claims.length ? [{ ...need, claims }] : [];
  });
}

export function auditChangedEvidence() {
  const csvFiles = changedCsvFiles();
  const warnings = [];
  let decisions = 0;
  let missing = 0;
  let incompleteAdmissions = 0;

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
    const currentEvidence = parseJsonlBySlug(currentContent(evidencePath));
    const incomplete = findIncompleteNewAdmissions(
      needs,
      touched,
      currentEvidence,
    );
    if (uncovered.length === 0 && incomplete.length === 0) continue;

    missing += uncovered.length;
    incompleteAdmissions += incomplete.length;
    warnings.push({ csvPath, evidencePath, uncovered, incomplete });
  }

  return {
    files: csvFiles.length,
    decisions,
    missing,
    incompleteAdmissions,
    warnings,
  };
}

function report(result) {
  if (result.files === 0) {
    console.log("No changed CSV files under data/csv.");
    return;
  }

  console.log("Changed-evidence audit (warning-only)");

  for (const warning of result.warnings) {
    if (warning.uncovered.length) {
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

    if (warning.incomplete.length) {
      console.log("");
      console.log(
        `WARN ${warning.csvPath}: ${warning.incomplete.length} new admission(s) with an incomplete claim map in ${warning.evidencePath}`,
      );
      warning.incomplete.slice(0, MAX_LINES_PER_FILE).forEach((need) => {
        console.log(`  - ${need.slug}: missing ${need.claims.join(", ")}`);
      });
      const remaining = warning.incomplete.length - MAX_LINES_PER_FILE;
      if (remaining > 0) {
        console.log(`  … and ${remaining} more`);
      }
    }
  }

  console.log("");
  console.log("Summary");
  console.log(`- changed CSV files: ${result.files}`);
  console.log(`- decisions needing evidence: ${result.decisions}`);
  console.log(`- without a matching record: ${result.missing}`);
  console.log(
    `- new admissions with an incomplete claim map: ${result.incompleteAdmissions}`,
  );
  console.log(
    `- status: ${result.missing === 0 && result.incompleteAdmissions === 0 ? "OK" : "WARN (non-blocking)"}`,
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
