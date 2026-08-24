#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { francAll } from "franc";

import {
  SUPPORTED_DESCRIPTION_SOURCE_LOCALES,
  SUPPORTED_DESCRIPTION_SOURCE_LOCALE_SET,
  compareProducerIds,
  hashTranslationSource,
  prepareTranslationPromptText,
  readCanonicalCountry,
} from "./lib/catalog-translations.mjs";

export const DESCRIPTION_LOCALE_AUDIT_VERSION = "description-locale-review-v5";
export const DEFAULT_MINIMUM_LENGTH = 10;
export const DEFAULT_PRIORITY_MARGIN = 0.05;

const COUNTRY_PATTERN = /^[a-z]{2}$/;
const FRANC_CODE_BY_LOCALE = Object.freeze({
  en: "eng",
  es: "spa",
  ca: "cat",
  de: "deu",
  ja: "jpn",
  fr: "fra",
  it: "ita",
  nl: "nld",
  pt: "por",
  gl: "glg",
  eu: "eus",
});
const LOCALE_BY_FRANC_CODE = new Map(
  Object.entries(FRANC_CODE_BY_LOCALE).map(([locale, code]) => [code, locale]),
);

for (const locale of SUPPORTED_DESCRIPTION_SOURCE_LOCALES) {
  if (!FRANC_CODE_BY_LOCALE[locale]) {
    throw new Error(
      `Source-locale review requires an explicit franc code for supported locale '${locale}'`,
    );
  }
}

function usage() {
  return `Usage: pnpm audit:description-locales --country <cc> [options]

Creates a deterministic, advisory review report. It never edits canonical CSVs,
sidecars or evidence.

Options:
  --root <path>                 CSV root (default: data/csv)
  --country <cc>               One required catalog country
  --area <slug>                Limit to an area; repeatable
  --declared-locale <locale>   Limit current source locales; repeatable
  --candidate-locale <locale>  Keep candidate locales; repeatable
  --full-review-roster         Emit every in-scope description instead of guesses
  --min-length <integer>       Minimum classifier input length (default: 10)
  --priority-margin <0..1>     Likely-vs-ambiguous margin threshold (default: 0.05)
  --output <path>              Create a new JSON report in the system temp tree
  -h, --help                   Show this help

If --output is omitted, the JSON report is written to stdout. Existing output
files are never overwritten. A classifier result is a review lead, not an
editorial decision; absence from the report does not confirm the declared locale.`;
}

function parseInteger(value, option) {
  if (!/^\d+$/.test(value ?? "")) throw new Error(`${option} requires an integer`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${option} must be a positive safe integer`);
  }
  return parsed;
}

function parseMargin(value, option) {
  if (value === undefined || value === "") throw new Error(`${option} requires a number`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new Error(`${option} must be between 0 and 1`);
  }
  return parsed;
}

function nextValue(argv, index, option) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${option} requires a value`);
  return value;
}

export function parseDescriptionLocaleAuditArgs(argv, cwd = process.cwd()) {
  const options = {
    csvRoot: path.resolve(cwd, "data/csv"),
    country: null,
    areas: [],
    declaredLocales: [],
    candidateLocales: [],
    minimumLength: DEFAULT_MINIMUM_LENGTH,
    priorityMargin: DEFAULT_PRIORITY_MARGIN,
    fullReviewRoster: false,
    outputPath: null,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") {
      continue;
    } else if (argument === "--root") {
      options.csvRoot = path.resolve(cwd, nextValue(argv, index, argument));
      index += 1;
    } else if (argument === "--country") {
      options.country = nextValue(argv, index, argument);
      index += 1;
    } else if (argument === "--area") {
      options.areas.push(nextValue(argv, index, argument));
      index += 1;
    } else if (argument === "--declared-locale") {
      options.declaredLocales.push(nextValue(argv, index, argument));
      index += 1;
    } else if (argument === "--candidate-locale") {
      options.candidateLocales.push(nextValue(argv, index, argument));
      index += 1;
    } else if (argument === "--full-review-roster") {
      options.fullReviewRoster = true;
    } else if (argument === "--min-length") {
      options.minimumLength = parseInteger(nextValue(argv, index, argument), argument);
      index += 1;
    } else if (argument === "--priority-margin" || argument === "--min-margin") {
      options.priorityMargin = parseMargin(nextValue(argv, index, argument), argument);
      index += 1;
    } else if (argument === "--output") {
      options.outputPath = path.resolve(cwd, nextValue(argv, index, argument));
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown argument '${argument}'`);
    }
  }

  return options;
}

function assertSupportedLocales(locales, option) {
  for (const locale of locales) {
    if (!SUPPORTED_DESCRIPTION_SOURCE_LOCALE_SET.has(locale)) {
      throw new Error(`${option} does not support locale '${locale}'`);
    }
  }
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function portableRelative(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function roundedScore(value) {
  return Number(value.toFixed(6));
}

function digestReport(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
}

function classifyDescription(text, minimumLength, only = null) {
  const result = francAll(prepareTranslationPromptText(text), {
    minLength: minimumLength,
    ...(only ? { only } : {}),
  });
  return result
    .filter(([code]) => code !== "und")
    .map(([language, score]) => ({
      language,
      locale: LOCALE_BY_FRANC_CODE.get(language) ?? null,
      score,
    }));
}

function sourceReviewItem(resolvedRoot, row) {
  return {
    file: portableRelative(resolvedRoot, row.filePath),
    record_number: row.recordNumber,
    producer_id: row.producerId,
    declared_locale: row.sourceLocale,
    source_hash: hashTranslationSource(row.text),
    descripcion: row.text,
  };
}

export function auditDescriptionLocales({
  csvRoot = path.resolve(process.cwd(), "data/csv"),
  country,
  areas = [],
  declaredLocales = [],
  candidateLocales = [],
  minimumLength = DEFAULT_MINIMUM_LENGTH,
  priorityMargin = DEFAULT_PRIORITY_MARGIN,
  fullReviewRoster = false,
} = {}) {
  if (!COUNTRY_PATTERN.test(country ?? "")) {
    throw new Error("--country must be one lowercase two-letter catalog country");
  }
  if (!Number.isSafeInteger(minimumLength) || minimumLength < 1) {
    throw new Error("minimumLength must be a positive safe integer");
  }
  if (!Number.isFinite(priorityMargin) || priorityMargin < 0 || priorityMargin > 1) {
    throw new Error("priorityMargin must be between 0 and 1");
  }
  if (typeof fullReviewRoster !== "boolean") {
    throw new Error("fullReviewRoster must be a boolean");
  }

  const selectedAreas = uniqueSorted(areas);
  const selectedDeclaredLocales = uniqueSorted(declaredLocales);
  const selectedCandidateLocales = uniqueSorted(candidateLocales);
  assertSupportedLocales(selectedDeclaredLocales, "--declared-locale");
  assertSupportedLocales(selectedCandidateLocales, "--candidate-locale");

  const resolvedRoot = path.resolve(csvRoot);
  const canonical = readCanonicalCountry(resolvedRoot, country);
  if (canonical.areaFiles.length === 0) {
    throw new Error(`Unknown catalog country '${country}'`);
  }
  if (canonical.errors.length > 0) {
    throw new Error(`Canonical catalog is invalid:\n- ${canonical.errors.join("\n- ")}`);
  }
  if (canonical.legacyFiles.length > 0) {
    throw new Error(
      `Description-locale migration is incomplete for ${canonical.legacyFiles.length} area CSV file(s)`,
    );
  }

  const knownAreas = new Set(canonical.rows.map((row) => row.area));
  for (const area of selectedAreas) {
    if (!knownAreas.has(area)) throw new Error(`Unknown area '${country}/${area}'`);
  }

  const areaSet = new Set(selectedAreas);
  const declaredLocaleSet = new Set(selectedDeclaredLocales);
  const candidateLocaleSet = new Set(selectedCandidateLocales);
  const rowsInScope = canonical.rows
    .filter(
      (row) =>
        row.text &&
        (areaSet.size === 0 || areaSet.has(row.area)) &&
        (declaredLocaleSet.size === 0 || declaredLocaleSet.has(row.sourceLocale)),
    )
    .sort(
      (left, right) =>
        compareProducerIds(left.producerId, right.producerId) ||
        portableRelative(resolvedRoot, left.filePath).localeCompare(
          portableRelative(resolvedRoot, right.filePath),
        ),
    );
  const baseScope = {
    country,
    areas: selectedAreas,
    declared_locales: selectedDeclaredLocales,
  };

  if (fullReviewRoster) {
    const reviewItems = rowsInScope.map((row) => sourceReviewItem(resolvedRoot, row));
    const unsignedReport = {
      schema_version: 1,
      audit_version: DESCRIPTION_LOCALE_AUDIT_VERSION,
      review_status: "full_review_roster",
      scope: { ...baseScope, mode: "full_review_roster" },
      summary: {
        canonical_rows: canonical.rows.length,
        descriptions_in_scope: rowsInScope.length,
        review_items: reviewItems.length,
      },
      review_items: reviewItems,
    };
    return { ...unsignedReport, report_hash: digestReport(unsignedReport) };
  }

  const targetedLocaleComparison = candidateLocaleSet.size > 0;
  const candidates = [];
  const summary = {
    canonical_rows: canonical.rows.length,
    descriptions_in_scope: rowsInScope.length,
    classifier_agreements: 0,
    candidates: 0,
    unregistered_source_language_candidates: 0,
    undetermined: 0,
    ambiguous_candidates: 0,
    candidate_locale_filtered: 0,
  };

  for (const row of rowsInScope) {
    const ranking = classifyDescription(row.text, minimumLength);
    const top = ranking[0];
    if (!top) {
      summary.undetermined += 1;
      continue;
    }
    if (top.locale === row.sourceLocale) {
      summary.classifier_agreements += 1;
      continue;
    }
    if (targetedLocaleComparison && !candidateLocaleSet.has(top.locale)) {
      summary.candidate_locale_filtered += 1;
      continue;
    }

    const runnerUp = ranking[1] ?? { language: null, locale: null, score: 0 };
    const margin = top.score - runnerUp.score;
    const priority = margin < priorityMargin ? "ambiguous" : "review_first";
    if (priority === "ambiguous") {
      summary.ambiguous_candidates += 1;
    }

    if (top.locale === null) summary.unregistered_source_language_candidates += 1;
    candidates.push({
      ...sourceReviewItem(resolvedRoot, row),
      classification_scope: "unrestricted",
      candidate_language: top.language,
      candidate_locale: top.locale,
      priority,
      classifier_margin: roundedScore(margin),
      runner_up_language: runnerUp.language,
      runner_up_locale: runnerUp.locale,
    });
  }

  summary.candidates = candidates.length;
  const unsignedReport = {
    schema_version: 1,
    audit_version: DESCRIPTION_LOCALE_AUDIT_VERSION,
    review_status: "unreviewed_candidates",
    classifier: {
      engine: "franc",
      engine_version: "6.2.0",
      source_locale_map: { ...FRANC_CODE_BY_LOCALE },
      caution:
        "Scores are relative rankings, not confidence; short catalog prose can be misclassified and every candidate requires editorial review.",
    },
    scope: {
      ...baseScope,
      mode: "classifier_candidates",
      candidate_locales: selectedCandidateLocales,
      unrestricted_detection: true,
      minimum_length: minimumLength,
      priority_margin: priorityMargin,
    },
    summary,
    candidates,
  };

  return { ...unsignedReport, report_hash: digestReport(unsignedReport) };
}

function isInside(parentPath, childPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

export function writeDescriptionLocaleAuditReport(report, outputPath, csvRoot) {
  const resolvedOutput = path.resolve(outputPath);
  if (path.extname(resolvedOutput).toLowerCase() !== ".json") {
    throw new Error("Review reports must use a .json filename");
  }
  const parent = path.dirname(resolvedOutput);
  if (!fs.existsSync(parent) || !fs.statSync(parent).isDirectory()) {
    throw new Error(`Output directory does not exist: ${parent}`);
  }
  const realParent = fs.realpathSync(parent);
  const realOutput = path.join(realParent, path.basename(resolvedOutput));
  const realTemporaryRoots = [...new Set([os.tmpdir(), "/tmp"])]
    .filter((temporaryRoot) => fs.existsSync(temporaryRoot))
    .map((temporaryRoot) => fs.realpathSync(temporaryRoot));
  const realCsvRoot = fs.realpathSync(csvRoot);
  if (!realTemporaryRoots.some((temporaryRoot) => isInside(temporaryRoot, realOutput))) {
    throw new Error("Review reports must remain in the system temporary directory");
  }
  if (isInside(realCsvRoot, realOutput)) {
    throw new Error("Review reports must remain outside the canonical CSV tree");
  }
  fs.writeFileSync(realOutput, `${JSON.stringify(report, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });
}

function main() {
  const options = parseDescriptionLocaleAuditArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const report = auditDescriptionLocales(options);
  if (options.outputPath) {
    writeDescriptionLocaleAuditReport(report, options.outputPath, options.csvRoot);
    const count = report.summary.candidates ?? report.summary.review_items;
    const noun = report.review_status === "full_review_roster" ? "review item(s)" : "unreviewed candidate(s)";
    console.log(`Wrote ${count} ${noun} to ${options.outputPath}`);
    console.log(`Report hash: ${report.report_hash}`);
  } else {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
