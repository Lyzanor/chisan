#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../../..");

function usage() {
  return [
    "Usage:",
    "  node .agents/skills/chisan-area-discovery/scripts/inspect-area.mjs \\",
    "    --country <country> --area <area>",
  ].join("\n");
}

function fail(message) {
  process.stderr.write(`${message}\n\n${usage()}\n`);
  process.exit(1);
}

function parseArguments(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === "--country") {
      if (!value) fail("--country requires a value");
      options.country = value;
      index += 1;
    } else if (argument === "--area") {
      if (!value) fail("--area requires a value");
      options.area = value;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      process.stdout.write(`${usage()}\n`);
      process.exit(0);
    } else {
      fail(`Unknown argument: ${argument}`);
    }
  }

  if (!options.country) fail("Missing required --country");
  if (!options.area) fail("Missing required --area");
  if (!/^[a-z0-9-]+$/.test(options.country)) {
    fail("--country must be a lowercase catalog key");
  }
  if (!/^[a-z0-9-]+$/.test(options.area)) {
    fail("--area must be a lowercase public area key");
  }

  return options;
}

function resolveAreaCsv(country, area) {
  const countryDirectory = path.join(repositoryRoot, "data", "csv", country);
  if (!fs.existsSync(countryDirectory)) {
    fail(`Country directory does not exist: data/csv/${country}`);
  }

  const matches = [];
  for (const entry of fs.readdirSync(countryDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(countryDirectory, entry.name, `${area}.csv`);
    if (fs.existsSync(candidate)) {
      matches.push({ path: candidate, region: entry.name });
    }
  }

  if (matches.length === 0) {
    fail(`No CSV found for (${country}, ${area})`);
  }
  if (matches.length > 1) {
    fail(
      `Area (${country}, ${area}) is ambiguous: ${matches
        .map((match) => path.relative(repositoryRoot, match.path))
        .join(", ")}`,
    );
  }

  return matches[0];
}

function countPublishedRows(csvPath) {
  const rows = parse(fs.readFileSync(csvPath, "utf8"), {
    bom: true,
    columns: true,
    relax_column_count: false,
    skip_empty_lines: true,
  });
  return rows.length;
}

function isMarkdownSeparator(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function countOpenCandidates(notePath) {
  if (!fs.existsSync(notePath)) return 0;

  let count = 0;
  for (const line of fs.readFileSync(notePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) continue;

    const cells = trimmed
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());
    if (cells.length < 5 || isMarkdownSeparator(cells)) continue;

    const firstCell = cells[0].toLocaleLowerCase("en");
    if (["name", "nombre"].includes(firstCell)) continue;
    count += 1;
  }

  return count;
}

function countEvidenceRecords(evidencePath) {
  if (!fs.existsSync(evidencePath)) return 0;

  let count = 0;
  for (const [index, line] of fs
    .readFileSync(evidencePath, "utf8")
    .split(/\r?\n/)
    .entries()) {
    if (!line.trim()) continue;
    try {
      JSON.parse(line);
    } catch (error) {
      fail(
        `Malformed JSON in ${path.relative(repositoryRoot, evidencePath)}:${index + 1}: ${error.message}`,
      );
    }
    count += 1;
  }
  return count;
}

function relative(filePath) {
  return path.relative(repositoryRoot, filePath);
}

const options = parseArguments(process.argv.slice(2));
const resolved = resolveAreaCsv(options.country, options.area);
const candidateNotePath = path.join(
  repositoryRoot,
  "docs",
  "candidates",
  options.country,
  `${options.area}.md`,
);
const evidencePath = path.join(
  repositoryRoot,
  "data",
  "evidence",
  options.country,
  resolved.region,
  `${options.area}.jsonl`,
);
const openCandidates = countOpenCandidates(candidateNotePath);

process.stdout.write(
  `${JSON.stringify(
    {
      country: options.country,
      region: resolved.region,
      area: options.area,
      csvPath: relative(resolved.path),
      candidateNotePath: relative(candidateNotePath),
      candidateNoteExists: fs.existsSync(candidateNotePath),
      evidencePath: relative(evidencePath),
      evidenceExists: fs.existsSync(evidencePath),
      publishedRows: countPublishedRows(resolved.path),
      openCandidates,
      evidenceRecords: countEvidenceRecords(evidencePath),
    },
    null,
    2,
  )}\n`,
);
