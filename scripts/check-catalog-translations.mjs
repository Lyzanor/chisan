#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  SUPPORTED_DESCRIPTION_SOURCE_LOCALE_SET,
  SUPPORTED_TRANSLATION_TARGET_LOCALE_SET,
  TRANSLATION_FIELD,
  TRANSLATION_PROMPT_VERSION,
  classifyCatalogCsvPath,
  compareTranslationRows,
  findApprovedTranslationEngine,
  hashTranslationSource,
  isPositiveProducerId,
  listCatalogCsvFiles,
  readCanonicalCountry,
  readPublishedAreaLocales,
  readTranslationEngineRegistry,
  readTranslationGlossary,
  readTranslationSidecar,
  translationPairKey,
  validateTranslationOutput,
} from "./lib/catalog-translations.mjs";
import {
  TRANSLATED_DESCRIPTION_MAX_CHARACTERS,
  codePointLength,
  descriptionContaminationReason,
  descriptionNaturalnessReason,
} from "./lib/description-quality.mjs";

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
const SOURCE_HASH_PATTERN = /^[a-f0-9]{64}$/;
const VERSION_VALUE_PATTERN = /^[^\s\u0000-\u001f\u007f]+$/u;

function usage() {
  console.log(`Usage: node scripts/check-catalog-translations.mjs --all
       node scripts/check-catalog-translations.mjs --changed

Options:
  --all               Check every checked-in translation sidecar.
  --changed           Check changed sidecars and sidecars affected by canonical CSV changes.
  --root <csv-root>   Override data/csv (primarily for isolated tests).
  --glossary <path>   Override the versioned glossary.
  --engines <path>    Override the approved-engine registry.
  -h, --help          Show this help.`);
}

function parseArgs(argv) {
  let mode = null;
  let csvRoot = DEFAULT_CSV_ROOT;
  let glossaryPath = DEFAULT_GLOSSARY_PATH;
  let engineRegistryPath = DEFAULT_ENGINE_REGISTRY_PATH;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--all" || argument === "--changed") {
      if (mode) throw new Error("choose exactly one of --all or --changed");
      mode = argument.slice(2);
    } else if (argument === "--root") {
      const value = argv[++index];
      if (!value) throw new Error("--root requires a path");
      csvRoot = path.resolve(value);
    } else if (argument === "--glossary") {
      const value = argv[++index];
      if (!value) throw new Error("--glossary requires a path");
      glossaryPath = path.resolve(value);
    } else if (argument === "--engines") {
      const value = argv[++index];
      if (!value) throw new Error("--engines requires a path");
      engineRegistryPath = path.resolve(value);
    } else if (argument === "--help" || argument === "-h") {
      help = true;
    } else {
      throw new Error(`unknown argument '${argument}'`);
    }
  }
  if (!help && !mode) throw new Error("choose exactly one of --all or --changed");
  return { mode, csvRoot, glossaryPath, engineRegistryPath, help };
}

function collectGitChangedPaths(
  repositoryRoot = REPOSITORY_ROOT,
  glossaryPath = DEFAULT_GLOSSARY_PATH,
  engineRegistryPath = DEFAULT_ENGINE_REGISTRY_PATH,
) {
  const paths = new Set();
  const collect = (arguments_) => {
    let output;
    try {
      output = execFileSync("git", arguments_, {
        cwd: repositoryRoot,
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      return;
    }
    for (const relative of output.split(/\r?\n/).filter(Boolean)) paths.add(relative);
  };

  const watched = [
    "data/csv",
    path.relative(repositoryRoot, glossaryPath),
    path.relative(repositoryRoot, engineRegistryPath),
  ];
  collect(["diff", "--name-only", "--diff-filter=ACMRD", "--", ...watched]);
  collect(["diff", "--cached", "--name-only", "--diff-filter=ACMRD", "--", ...watched]);
  collect(["ls-files", "--others", "--exclude-standard", "--", ...watched]);
  return [...paths].sort();
}

function sidecarsByCountry(csvRoot, files) {
  const result = new Map();
  for (const filePath of files) {
    const { country } = classifyCatalogCsvPath(csvRoot, filePath);
    const values = result.get(country) ?? [];
    values.push(filePath);
    result.set(country, values);
  }
  return result;
}

/**
 * @param {{
 *   mode?: string,
 *   csvRoot?: string,
 *   glossaryPath?: string,
 *   engineRegistryPath?: string,
 *   changedPaths?: string[],
 *   repositoryRoot?: string,
 * }} [options]
 */
export function resolveTranslationCheckScope({
  mode = undefined,
  csvRoot = DEFAULT_CSV_ROOT,
  glossaryPath = DEFAULT_GLOSSARY_PATH,
  engineRegistryPath = DEFAULT_ENGINE_REGISTRY_PATH,
  changedPaths = undefined,
  repositoryRoot = REPOSITORY_ROOT,
} = {}) {
  const catalog = listCatalogCsvFiles(csvRoot);
  const errors = catalog.invalidTranslationFiles.map(
    (filePath) =>
      `${path.relative(repositoryRoot, filePath)}: translation sidecars must be named data/csv/<country>/translations.<locale>.csv`,
  );
  const byCountry = sidecarsByCountry(csvRoot, catalog.sidecarFiles);
  const selectedSidecars = new Set();
  const selectedCountries = new Set();
  const canonicalChanges = new Map();
  const normalizedChangedPaths = [];

  if (mode === "all") {
    for (const filePath of catalog.sidecarFiles) selectedSidecars.add(filePath);
    for (const filePath of catalog.areaFiles) {
      selectedCountries.add(classifyCatalogCsvPath(csvRoot, filePath).country);
    }
  } else if (mode === "changed") {
    const changed =
      changedPaths ?? collectGitChangedPaths(repositoryRoot, glossaryPath, engineRegistryPath);
    const glossaryRelative = path.relative(repositoryRoot, glossaryPath).split(path.sep).join("/");
    const engineRegistryRelative = path
      .relative(repositoryRoot, engineRegistryPath)
      .split(path.sep)
      .join("/");
    for (const relativePath of changed) {
      const normalized = relativePath.split(path.sep).join("/");
      normalizedChangedPaths.push(normalized);
      if (normalized === glossaryRelative || normalized === engineRegistryRelative) {
        for (const filePath of catalog.sidecarFiles) selectedSidecars.add(filePath);
        for (const country of byCountry.keys()) selectedCountries.add(country);
        continue;
      }
      if (!normalized.startsWith("data/csv/")) continue;
      const manifestMatch = /^data\/csv\/([a-z]{2})\/country\.json$/.exec(normalized);
      if (manifestMatch) {
        const country = manifestMatch[1];
        selectedCountries.add(country);
        for (const filePath of byCountry.get(country) ?? []) selectedSidecars.add(filePath);
        continue;
      }
      const absolute = path.resolve(repositoryRoot, relativePath);
      const classification = classifyCatalogCsvPath(csvRoot, absolute);
      if (classification.kind === "translation") {
        selectedCountries.add(classification.country);
        if (fs.existsSync(absolute)) selectedSidecars.add(absolute);
      } else if (classification.kind === "area") {
        selectedCountries.add(classification.country);
        const affected = byCountry.get(classification.country) ?? [];
        for (const filePath of affected) selectedSidecars.add(filePath);
        canonicalChanges.set(normalized, [...affected]);
      } else if (classification.kind === "invalid-translation") {
        errors.push(
          `${relativePath}: translation sidecars must be named data/csv/<country>/translations.<locale>.csv`,
        );
      }
    }
  } else {
    throw new Error(`Unknown translation check mode '${mode}'`);
  }

  return {
    errors,
    selectedCountries: [...selectedCountries].sort(),
    selectedSidecars: [...selectedSidecars].sort(),
    canonicalChanges,
    changedPaths: normalizedChangedPaths,
  };
}

function pushError(result, filePath, recordNumber, message) {
  const location = recordNumber ? `${filePath}: record ${recordNumber}` : filePath;
  result.errors.push(`${location}: ${message}`);
}

function validateVersion(value, field, result, filePath, recordNumber) {
  if (!VERSION_VALUE_PATTERN.test(value)) {
    pushError(result, filePath, recordNumber, `${field} must be a non-empty version token`);
  }
}

function publicationRequestFilters(
  mode,
  scope,
  csvRoot,
  glossaryPath,
  engineRegistryPath,
  repositoryRoot,
) {
  if (mode === "all") return null;
  const filters = new Map();
  const ensure = (country) => {
    const current = filters.get(country) ?? { all: false, targets: new Set(), areas: new Set() };
    filters.set(country, current);
    return current;
  };
  const glossaryRelative = path.relative(repositoryRoot, glossaryPath).split(path.sep).join("/");
  const engineRegistryRelative = path
    .relative(repositoryRoot, engineRegistryPath)
    .split(path.sep)
    .join("/");

  for (const normalized of scope.changedPaths) {
    if (normalized === glossaryRelative || normalized === engineRegistryRelative) {
      for (const filePath of scope.selectedSidecars) {
        const classification = classifyCatalogCsvPath(csvRoot, filePath);
        if (classification.kind === "translation") {
          ensure(classification.country).targets.add(classification.targetLocale);
        }
      }
      continue;
    }
    const manifestMatch = /^data\/csv\/([a-z]{2})\/country\.json$/.exec(normalized);
    if (manifestMatch) {
      ensure(manifestMatch[1]).all = true;
      continue;
    }
    const absolute = path.resolve(repositoryRoot, normalized);
    const classification = classifyCatalogCsvPath(csvRoot, absolute);
    if (classification.kind === "translation") {
      ensure(classification.country).targets.add(classification.targetLocale);
    } else if (classification.kind === "area") {
      ensure(classification.country).areas.add(path.resolve(absolute));
    }
  }
  return filters;
}

function buildPublicationRequirements({
  mode,
  scope,
  csvRoot,
  glossaryPath,
  engineRegistryPath,
  repositoryRoot,
  canonicalByCountry,
  errors,
}) {
  const filters = publicationRequestFilters(
    mode,
    scope,
    csvRoot,
    glossaryPath,
    engineRegistryPath,
    repositoryRoot,
  );
  const requirements = new Map();

  for (const [country, canonical] of canonicalByCountry) {
    const countryFilter = filters?.get(country);
    if (filters && !countryFilter) continue;
    let scopes;
    try {
      scopes = readPublishedAreaLocales(csvRoot, country);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(message.replace(`${repositoryRoot}${path.sep}`, ""));
      continue;
    }
    for (const areaScope of scopes) {
      const areaSelected =
        !filters || countryFilter.all || countryFilter.areas.has(path.resolve(areaScope.filePath));
      for (const targetLocale of areaScope.locales) {
        const targetSelected =
          !filters || countryFilter.all || countryFilter.targets.has(targetLocale);
        if (!areaSelected && !targetSelected) continue;
        const sources = canonical.rows.filter(
          (source) =>
            path.resolve(source.filePath) === path.resolve(areaScope.filePath) &&
            source.text &&
            source.sourceLocale !== targetLocale,
        );
        if (sources.length === 0) continue;
        const key = `${country}\u0000${targetLocale}`;
        const requirement = requirements.get(key) ?? {
          country,
          targetLocale,
          sources: new Map(),
          areas: new Set(),
        };
        requirement.areas.add(`${areaScope.region}/${areaScope.area}`);
        for (const source of sources) requirement.sources.set(source.producerId, source);
        requirements.set(key, requirement);
      }
    }
  }
  return requirements;
}

function validateSidecar({
  filePath,
  csvRoot,
  glossary,
  engineRegistry,
  canonical,
  publicationRequirement,
  result,
}) {
  const classification = classifyCatalogCsvPath(csvRoot, filePath);
  const displayPath = path.relative(result.repositoryRoot, filePath);
  if (!SUPPORTED_TRANSLATION_TARGET_LOCALE_SET.has(classification.targetLocale)) {
    pushError(result, displayPath, null, `unsupported target locale '${classification.targetLocale}'`);
  }

  let rows;
  try {
    rows = readTranslationSidecar(filePath);
  } catch (error) {
    pushError(result, displayPath, null, error.message.replace(`${filePath}: `, ""));
    return;
  }
  result.stats.rows += rows.length;

  const seen = new Set();
  let previous = null;
  const presentPairs = new Set();

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const recordNumber = index + 2;
    if (previous && compareTranslationRows(previous, row) >= 0) {
      pushError(
        result,
        displayPath,
        recordNumber,
        "rows must be strictly sorted by numeric producer_id then field",
      );
    }
    previous = row;

    const pair = translationPairKey(row.producer_id, row.field);
    if (seen.has(pair)) {
      pushError(result, displayPath, recordNumber, "duplicate (producer_id, field) row");
    }
    seen.add(pair);
    presentPairs.add(pair);

    if (!isPositiveProducerId(row.producer_id)) {
      pushError(result, displayPath, recordNumber, "producer_id must be a positive decimal integer");
    }
    if (row.field !== TRANSLATION_FIELD) {
      pushError(result, displayPath, recordNumber, `field must be '${TRANSLATION_FIELD}'`);
    }
    if (!SUPPORTED_DESCRIPTION_SOURCE_LOCALE_SET.has(row.source_locale)) {
      pushError(result, displayPath, recordNumber, "source_locale is not supported");
    }
    if (!SOURCE_HASH_PATTERN.test(row.source_hash)) {
      pushError(result, displayPath, recordNumber, "source_hash must be lowercase hexadecimal SHA-256");
    }
    if (!row.text || !row.text.trim()) {
      pushError(result, displayPath, recordNumber, "text must be non-empty");
    } else if (row.text !== row.text.normalize("NFC")) {
      pushError(result, displayPath, recordNumber, "text must use Unicode NFC normalization");
    } else {
      const textLength = codePointLength(row.text);
      if (textLength > TRANSLATED_DESCRIPTION_MAX_CHARACTERS) {
        pushError(
          result,
          displayPath,
          recordNumber,
          `text must be at most ${TRANSLATED_DESCRIPTION_MAX_CHARACTERS} Unicode characters; found ${textLength}`,
        );
      }
      const contamination = descriptionContaminationReason(row.text);
      if (contamination) {
        pushError(result, displayPath, recordNumber, `text ${contamination}`);
      }
      const naturalness = descriptionNaturalnessReason(row.text);
      if (naturalness) {
        pushError(result, displayPath, recordNumber, `text ${naturalness}`);
      }
    }
    if (row.origin !== "machine" && row.origin !== "reviewed") {
      pushError(result, displayPath, recordNumber, "origin must be 'machine' or 'reviewed'");
    }
    validateVersion(row.engine, "engine", result, displayPath, recordNumber);
    validateVersion(row.engine_version, "engine_version", result, displayPath, recordNumber);
    validateVersion(row.prompt_version, "prompt_version", result, displayPath, recordNumber);
    validateVersion(row.glossary_version, "glossary_version", result, displayPath, recordNumber);
    if (
      row.origin === "machine" &&
      !findApprovedTranslationEngine(engineRegistry, {
        engine: row.engine,
        engineVersion: row.engine_version,
        promptVersion: row.prompt_version,
        glossaryVersion: row.glossary_version,
        targetLocale: classification.targetLocale,
      })
    ) {
      pushError(
        result,
        displayPath,
        recordNumber,
        "machine translation engine/model context is not approved for this target locale",
      );
      result.stats.unapproved += 1;
    }
    // Review adopts the text against this exact source. Later prompt or
    // glossary revisions only affect machine reproducibility; they do not
    // invalidate a human-reviewed variant.
    if (row.origin !== "reviewed" && row.prompt_version !== TRANSLATION_PROMPT_VERSION) {
      pushError(
        result,
        displayPath,
        recordNumber,
        `prompt_version is stale; expected '${TRANSLATION_PROMPT_VERSION}'`,
      );
    }
    if (row.origin !== "reviewed" && row.glossary_version !== glossary.version) {
      pushError(
        result,
        displayPath,
        recordNumber,
        `glossary_version is stale; expected '${glossary.version}'`,
      );
    }

    const source = canonical.byId.get(row.producer_id);
    if (!source || !source.text || source.sourceLocale === classification.targetLocale) {
      const origin = row.origin === "reviewed" ? "reviewed (retained for human review)" : "machine";
      pushError(result, displayPath, recordNumber, `obsolete ${origin} translation row`);
      result.stats.obsolete += 1;
      continue;
    }
    if (row.source_locale !== source.sourceLocale) {
      const message = `source_locale is stale; expected '${source.sourceLocale}'`;
      if (publicationRequirement?.sources.has(row.producer_id)) {
        pushError(result, displayPath, recordNumber, message);
      } else {
        result.notices.push(`${displayPath}: record ${recordNumber}: ${message} (preparatory scope)`);
      }
      result.stats.stale += 1;
      continue;
    }
    const expectedHash = hashTranslationSource(source.text);
    if (row.source_hash !== expectedHash) {
      const message = `source_hash is stale; expected '${expectedHash}'`;
      if (publicationRequirement?.sources.has(row.producer_id)) {
        pushError(result, displayPath, recordNumber, message);
      } else {
        result.notices.push(`${displayPath}: record ${recordNumber}: ${message} (preparatory scope)`);
      }
      result.stats.stale += 1;
      continue;
    }
    try {
      validateTranslationOutput({
        source: source.text,
        sourceLocale: source.sourceLocale,
        text: row.text,
        targetLocale: classification.targetLocale,
        protectedTerms: glossary.protectedTerms,
        producerName: source.producerName,
      });
    } catch (error) {
      pushError(
        result,
        displayPath,
        recordNumber,
        `translation content failed validation: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }
    result.stats.current += 1;
    if (row.origin === "reviewed") result.stats.reviewed += 1;
    else result.stats.machine += 1;
  }

  for (const source of publicationRequirement?.sources.values() ?? []) {
    const pair = translationPairKey(source.producerId, TRANSLATION_FIELD);
    if (!presentPairs.has(pair)) {
      pushError(
        result,
        displayPath,
        null,
        `published area '${source.region}/${source.area}' is missing descripcion translation for producer_id '${source.producerId}'`,
      );
      result.stats.missing += 1;
    }
  }
}

/**
 * @param {{
 *   mode?: string,
 *   csvRoot?: string,
 *   glossaryPath?: string,
 *   engineRegistryPath?: string,
 *   changedPaths?: string[],
 *   repositoryRoot?: string,
 * }} [options]
 */
export function auditCatalogTranslations({
  mode = "all",
  csvRoot = DEFAULT_CSV_ROOT,
  glossaryPath = DEFAULT_GLOSSARY_PATH,
  engineRegistryPath = DEFAULT_ENGINE_REGISTRY_PATH,
  changedPaths = undefined,
  repositoryRoot = REPOSITORY_ROOT,
} = {}) {
  const glossary = readTranslationGlossary(glossaryPath);
  const engineRegistry = readTranslationEngineRegistry(engineRegistryPath);
  const scope = resolveTranslationCheckScope({
    mode,
    csvRoot,
    glossaryPath,
    engineRegistryPath,
    changedPaths,
    repositoryRoot,
  });
  const result = {
    repositoryRoot,
    errors: [...scope.errors],
    notices: /** @type {string[]} */ ([]),
    canonicalChanges: scope.canonicalChanges,
    selectedSidecars: scope.selectedSidecars,
    stats: {
      countries: scope.selectedCountries.length,
      sidecars: scope.selectedSidecars.length,
      rows: 0,
      current: 0,
      reviewed: 0,
      machine: 0,
      stale: 0,
      missing: 0,
      obsolete: 0,
      unapproved: 0,
    },
  };

  const canonicalByCountry = new Map();
  for (const country of scope.selectedCountries) {
    const canonical = readCanonicalCountry(csvRoot, country);
    canonicalByCountry.set(country, canonical);
    result.errors.push(
      ...canonical.errors.map((error) => error.replace(`${repositoryRoot}${path.sep}`, "")),
    );
  }

  const publicationRequirements = buildPublicationRequirements({
    mode,
    scope,
    csvRoot,
    glossaryPath,
    engineRegistryPath,
    repositoryRoot,
    canonicalByCountry,
    errors: result.errors,
  });
  const selectedSidecarKeys = new Set(
    scope.selectedSidecars.map((filePath) => {
      const classification = classifyCatalogCsvPath(csvRoot, filePath);
      return `${classification.country}\u0000${classification.targetLocale}`;
    }),
  );
  for (const [key, requirement] of publicationRequirements) {
    if (selectedSidecarKeys.has(key)) continue;
    const displayPath = path.relative(
      repositoryRoot,
      path.join(csvRoot, requirement.country, `translations.${requirement.targetLocale}.csv`),
    );
    result.errors.push(
      `${displayPath}: manifest publishes '${requirement.targetLocale}' for ${[
        ...requirement.areas,
      ].sort().join(", ")} but the required translation sidecar is missing`,
    );
    result.stats.missing += requirement.sources.size;
  }

  for (const filePath of scope.selectedSidecars) {
    const classification = classifyCatalogCsvPath(csvRoot, filePath);
    const canonical =
      canonicalByCountry.get(classification.country) ??
      readCanonicalCountry(csvRoot, classification.country);
    const publicationRequirement = publicationRequirements.get(
      `${classification.country}\u0000${classification.targetLocale}`,
    );
    validateSidecar({
      filePath,
      csvRoot,
      glossary,
      engineRegistry,
      canonical,
      publicationRequirement,
      result,
    });
  }

  return result;
}

function printResult(result) {
  for (const notice of result.notices) console.log(`Notice: ${notice}`);
  if (result.canonicalChanges.size > 0) {
    console.log("Canonical changes and affected sidecars:");
    for (const [changedPath, sidecars] of result.canonicalChanges) {
      const display = sidecars.length
        ? sidecars.map((filePath) => path.relative(result.repositoryRoot, filePath)).join(", ")
        : "none materialized yet";
      console.log(`- ${changedPath} -> ${display}`);
    }
  }
  for (const error of result.errors) console.error(`- ERROR ${error}`);
  console.log("Translation check summary");
  console.log(`- countries: ${result.stats.countries}`);
  console.log(`- sidecars: ${result.stats.sidecars}`);
  console.log(`- rows: ${result.stats.rows}`);
  console.log(`- current: ${result.stats.current} (${result.stats.reviewed} reviewed, ${result.stats.machine} machine)`);
  console.log(`- stale: ${result.stats.stale}`);
  console.log(`- missing: ${result.stats.missing}`);
  console.log(`- obsolete: ${result.stats.obsolete}`);
  console.log(`- unapproved machine rows: ${result.stats.unapproved}`);
  console.log(`- status: ${result.errors.length ? "FAILED" : "OK"}`);
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
    const result = auditCatalogTranslations(args);
    printResult(result);
    process.exitCode = result.errors.length ? 1 : 0;
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
