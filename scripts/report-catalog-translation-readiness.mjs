#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  SUPPORTED_TRANSLATION_TARGET_LOCALES,
  SUPPORTED_TRANSLATION_TARGET_LOCALE_SET,
  TRANSLATION_PROMPT_VERSION,
  classifyCatalogCsvPath,
  findApprovedTranslationEngine,
  hashTranslationSource,
  listCatalogCsvFiles,
  readCanonicalCountry,
  readPublishedAreaLocales,
  readTranslationEngineRegistry,
  readTranslationGlossary,
  readTranslationSidecar,
  translationPairKey,
  validateTranslationOutput,
} from "./lib/catalog-translations.mjs";
import { readTranslationBenchmarkSpec } from "./benchmark-catalog-translations.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_CSV_ROOT = path.join(REPOSITORY_ROOT, "data", "csv");
const DEFAULT_GLOSSARY_PATH = path.join(
  REPOSITORY_ROOT,
  "data",
  "reference",
  "translation-glossary.json",
);
const DEFAULT_ENGINE_REGISTRY_PATH = path.join(
  REPOSITORY_ROOT,
  "data",
  "reference",
  "translation-engines.json",
);
const DEFAULT_BENCHMARK_SPEC_PATH = path.join(
  REPOSITORY_ROOT,
  "data",
  "reference",
  "translation-benchmark.json",
);

function usage() {
  console.log(`Usage: node scripts/report-catalog-translation-readiness.mjs [options]

Options:
  --country <cc>          Limit the report to one country.
  --area <area>           Limit the report to one area (requires --country).
  --target-locale <code>  Limit the report to one maintained presentation locale.
  --output <path>         Write deterministic JSON; no catalog file is changed.
  --root <csv-root>       Override data/csv (primarily for isolated tests).
  --glossary <path>       Override the versioned glossary.
  --engines <path>        Override the approved-engine registry.
  --spec <path>           Override the benchmark specification.
  -h, --help              Show this help.`);
}

function parseArgs(argv) {
  const args = {
    country: null,
    area: null,
    targetLocale: null,
    outputPath: null,
    csvRoot: DEFAULT_CSV_ROOT,
    glossaryPath: DEFAULT_GLOSSARY_PATH,
    engineRegistryPath: DEFAULT_ENGINE_REGISTRY_PATH,
    specPath: DEFAULT_BENCHMARK_SPEC_PATH,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value) throw new Error(`${argument} requires a value`);
      return value;
    };
    if (argument === "--") continue;
    if (argument === "--country") args.country = next();
    else if (argument === "--area") args.area = next();
    else if (argument === "--target-locale" || argument === "--locale") {
      args.targetLocale = next();
    } else if (argument === "--output") args.outputPath = path.resolve(next());
    else if (argument === "--root") args.csvRoot = path.resolve(next());
    else if (argument === "--glossary") args.glossaryPath = path.resolve(next());
    else if (argument === "--engines") args.engineRegistryPath = path.resolve(next());
    else if (argument === "--spec") args.specPath = path.resolve(next());
    else if (argument === "--help" || argument === "-h") args.help = true;
    else throw new Error(`unknown argument '${argument}'`);
  }
  if (args.area && !args.country) throw new Error("--area requires --country");
  if (args.country && !/^[a-z]{2}$/.test(args.country)) {
    throw new Error("--country must be a two-letter catalog code");
  }
  return args;
}

function currentSource(row, source) {
  return (
    row.source_locale === source.sourceLocale &&
    row.source_hash === hashTranslationSource(source.text)
  );
}

function validContent(row, source, targetLocale, glossary) {
  try {
    validateTranslationOutput({
      source: source.text,
      sourceLocale: source.sourceLocale,
      text: row.text,
      targetLocale,
      protectedTerms: glossary.protectedTerms,
    });
    return true;
  } catch {
    return false;
  }
}

function approvedContexts(registry, targetLocale, glossaryVersion) {
  return registry.approved_engines.filter(
    (entry) =>
      entry.target_locales.includes(targetLocale) &&
      entry.prompt_version === TRANSLATION_PROMPT_VERSION &&
      entry.glossary_version === glossaryVersion,
  );
}

function areaPublicationMap(csvRoot, country) {
  return new Map(
    readPublishedAreaLocales(csvRoot, country).map((scope) => [
      `${scope.region}/${scope.area}`,
      new Set(scope.locales),
    ]),
  );
}

function readinessStatus(record) {
  if (record.stale_reviewed > 0) return "human_review_required";
  if (record.unapproved_machine > 0) return "unapproved_machine_rows";
  if (record.stale_machine > 0 || record.missing > 0) {
    return record.approved_engine_contexts > 0
      ? "ready_to_generate"
      : "blocked_no_approved_engine";
  }
  return "materialized";
}

/**
 * @param {{
 *   country?: string | null,
 *   area?: string | null,
 *   targetLocale?: string | null,
 *   csvRoot?: string,
 *   glossaryPath?: string,
 *   engineRegistryPath?: string,
 *   specPath?: string,
 * }} [options]
 */
export function buildCatalogTranslationReadiness({
  country = null,
  area = null,
  targetLocale = null,
  csvRoot = DEFAULT_CSV_ROOT,
  glossaryPath = DEFAULT_GLOSSARY_PATH,
  engineRegistryPath = DEFAULT_ENGINE_REGISTRY_PATH,
  specPath = DEFAULT_BENCHMARK_SPEC_PATH,
} = {}) {
  const glossary = readTranslationGlossary(glossaryPath);
  const registry = readTranslationEngineRegistry(engineRegistryPath);
  const spec = readTranslationBenchmarkSpec(specPath);
  const targetLocales = targetLocale
    ? [targetLocale]
    : [...SUPPORTED_TRANSLATION_TARGET_LOCALES];
  if (targetLocales.some((locale) => !SUPPORTED_TRANSLATION_TARGET_LOCALE_SET.has(locale))) {
    throw new Error(`Target locale '${targetLocale}' is not a supported presentation locale`);
  }

  const catalog = listCatalogCsvFiles(csvRoot);
  const countries = [
    ...new Set(
      catalog.areaFiles.map((filePath) => classifyCatalogCsvPath(csvRoot, filePath).country),
    ),
  ]
    .filter((code) => !country || code === country)
    .sort();
  if (country && countries.length === 0) throw new Error(`Unknown country '${country}'`);

  const records = [];
  for (const countryCode of countries) {
    const canonical = readCanonicalCountry(csvRoot, countryCode);
    if (canonical.errors.length > 0) {
      throw new Error(`Canonical catalog is invalid:\n- ${canonical.errors.join("\n- ")}`);
    }
    const publication = areaPublicationMap(csvRoot, countryCode);
    const areas = canonical.areaFiles
      .map((filePath) => classifyCatalogCsvPath(csvRoot, filePath))
      .filter((entry) => entry.kind === "area" && (!area || entry.area === area))
      .sort((left, right) =>
        `${left.region}/${left.area}`.localeCompare(`${right.region}/${right.area}`),
      );
    if (area && areas.length === 0) throw new Error(`Unknown area '${countryCode}/${area}'`);

    for (const locale of targetLocales) {
      const sidecarPath = path.join(csvRoot, countryCode, `translations.${locale}.csv`);
      const sidecarRows = fs.existsSync(sidecarPath) ? readTranslationSidecar(sidecarPath) : [];
      const sidecarByKey = new Map(
        sidecarRows.map((row) => [translationPairKey(row.producer_id, row.field), row]),
      );
      const approvals = approvedContexts(registry, locale, glossary.version);

      for (const areaEntry of areas) {
        const sources = canonical.rows.filter(
          (source) => source.region === areaEntry.region && source.area === areaEntry.area,
        );
        const record = {
          country: countryCode,
          region: areaEntry.region,
          area: areaEntry.area,
          target_locale: locale,
          manifest_published:
            publication.get(`${areaEntry.region}/${areaEntry.area}`)?.has(locale) ?? false,
          approved_engine_contexts: approvals.length,
          canonical_descriptions: sources.filter((source) => source.text).length,
          canonical_target_descriptions: sources.filter(
            (source) => source.text && source.sourceLocale === locale,
          ).length,
          required_sidecar_rows: 0,
          current_reviewed: 0,
          current_machine: 0,
          stale_reviewed: 0,
          stale_machine: 0,
          unapproved_machine: 0,
          missing: 0,
          translation_ready: false,
          status: "",
        };

        for (const source of sources) {
          if (!source.text || source.sourceLocale === locale) continue;
          record.required_sidecar_rows += 1;
          const row = sidecarByKey.get(translationPairKey(source.producerId));
          if (!row) {
            record.missing += 1;
            continue;
          }
          const sourceAndContentCurrent =
            currentSource(row, source) && validContent(row, source, locale, glossary);
          if (row.origin === "reviewed") {
            if (sourceAndContentCurrent) record.current_reviewed += 1;
            else record.stale_reviewed += 1;
            continue;
          }
          const approved = Boolean(
            findApprovedTranslationEngine(registry, {
              engine: row.engine,
              engineVersion: row.engine_version,
              promptVersion: row.prompt_version,
              glossaryVersion: row.glossary_version,
              targetLocale: locale,
            }),
          );
          const versionCurrent =
            row.prompt_version === TRANSLATION_PROMPT_VERSION &&
            row.glossary_version === glossary.version;
          if (!approved) record.unapproved_machine += 1;
          if (!sourceAndContentCurrent || !versionCurrent) record.stale_machine += 1;
          else if (approved) record.current_machine += 1;
        }

        record.translation_ready =
          record.current_reviewed + record.current_machine === record.required_sidecar_rows;
        record.status = readinessStatus(record);
        records.push(record);
      }
    }
  }

  const statusCounts = {};
  for (const record of records) {
    statusCounts[record.status] = (statusCounts[record.status] ?? 0) + 1;
  }
  return {
    schema_version: 2,
    mode: "dry_run",
    signal_scope: "translation_materialization_only",
    publication_readiness_evaluated: false,
    publication_readiness_note:
      "Translation readiness covers canonical description-language pairing and current localized description materialization only. It does not prove complete dictionaries, labels, controlled values, metadata, routes, review, Preview or deployment readiness.",
    benchmark_version: spec.version,
    prompt_version: TRANSLATION_PROMPT_VERSION,
    glossary_version: glossary.version,
    engine_registry_version: registry.registry_version,
    approved_engines: registry.approved_engines.length,
    presentation_locales: targetLocales,
    filters: { country, area, target_locale: targetLocale },
    summary: {
      records: records.length,
      translation_ready: records.filter((record) => record.translation_ready).length,
      required_sidecar_rows: records.reduce(
        (total, record) => total + record.required_sidecar_rows,
        0,
      ),
      missing: records.reduce((total, record) => total + record.missing, 0),
      status_counts: statusCounts,
    },
    records,
  };
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  try {
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
    fs.renameSync(temporaryPath, filePath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
}

function printReport(report) {
  console.log("Translation materialization readiness dry-run");
  console.log(`- scope: ${report.publication_readiness_note}`);
  console.log(`- presentation locales: ${report.presentation_locales.join(", ")}`);
  console.log(`- approved engine/model contexts: ${report.approved_engines}`);
  console.log(`- country/area/locale records: ${report.summary.records}`);
  console.log(`- required sidecar rows: ${report.summary.required_sidecar_rows}`);
  console.log(`- missing sidecar rows: ${report.summary.missing}`);
  console.log(`- translation-ready records: ${report.summary.translation_ready}`);
  console.log(
    `- statuses: ${Object.entries(report.summary.status_counts)
      .map(([status, count]) => `${status}=${count}`)
      .join(", ")}`,
  );
  if (report.records.length <= 60) {
    for (const record of report.records) {
      console.log(
        `- ${record.country}/${record.region}/${record.area} [${record.target_locale}]: ${record.status}; required=${record.required_sidecar_rows}, missing=${record.missing}, reviewed=${record.current_reviewed}, machine=${record.current_machine}`,
      );
    }
  }
  console.log("- provider calls: none");
  console.log("- catalog writes: none");
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
  if (args.help) {
    usage();
    return;
  }
  try {
    const report = buildCatalogTranslationReadiness(args);
    if (args.outputPath) writeJsonAtomic(args.outputPath, report);
    printReport(report);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
