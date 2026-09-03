#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  SUPPORTED_TRANSLATION_TARGET_LOCALE_SET,
  TRANSLATION_PROMPT_VERSION,
  TRANSLATION_REPAIR_SYSTEM_PROMPT,
  TRANSLATION_SYSTEM_PROMPT,
  compareTranslationRows,
  assertApprovedTranslationEngine,
  findApprovedTranslationEngine,
  hashTranslationSource,
  normalizeTranslationSource,
  prepareTranslationPromptText,
  readCanonicalCountry,
  readTranslationEngineRegistry,
  readTranslationGlossary,
  readTranslationSidecar,
  translationFieldSpec,
  translationPairKey,
  validateTranslationOutput,
  writeTranslationSidecarAtomic,
} from "./lib/catalog-translations.mjs";
import { resolveDefaultCatalogCountry } from "./lib/catalog-operation-scope.mjs";
import { createOpenAICompatibleAdapter } from "./lib/translation-providers.mjs";

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

function usage() {
  console.log(`Usage: node scripts/generate-catalog-translations.mjs \\
  --target-locale <locale> [--country <cc>] [options]

Options:
  --country <cc>        Override the sole published country used by default.
  --area <area>          Generate only one catalog area.
  --batch <n>/<total>    Generate one deterministic shard (1-based).
  --batch-size <n>       Maximum structured entries per provider request (default 25).
  --limit <n>            Cap pending entries in this run.
  --dry-run              Plan and validate without provider calls or file writes.
  --root <csv-root>      Override data/csv (primarily for isolated tests).
  --glossary <path>      Override the versioned glossary.
  --engines <path>       Override the approved-engine registry.
  -h, --help             Show this help.

Provider configuration is read only from CHISAN_TRANSLATION_* variables:
  CHISAN_TRANSLATION_PROVIDER=openai-compatible (default)
  CHISAN_TRANSLATION_BASE_URL=http://127.0.0.1:1234/v1 (LM Studio default)
  CHISAN_TRANSLATION_MODEL=<model id>
  CHISAN_TRANSLATION_API_KEY=<optional local/provider key>
  CHISAN_TRANSLATION_ENGINE_VERSION=<optional reproducibility label>
  CHISAN_TRANSLATION_REASONING_EFFORT=<optional none|minimal|low|medium|high|xhigh>
  CHISAN_TRANSLATION_TIMEOUT_MS=<optional positive milliseconds>
  CHISAN_TRANSLATION_MAX_RETRIES=<0..5; default 2>
  CHISAN_TRANSLATION_RETRY_BASE_MS=<0..10000; default 500>`);
}

function positiveInteger(value, label) {
  if (!/^[1-9]\d*$/.test(String(value ?? ""))) throw new Error(`${label} must be a positive integer`);
  return Number(value);
}

function parseBatch(value) {
  const match = /^([1-9]\d*)\/([1-9]\d*)$/.exec(value ?? "");
  if (!match) throw new Error("--batch must use <n>/<total>");
  const index = Number(match[1]);
  const total = Number(match[2]);
  if (index > total) throw new Error("--batch index cannot exceed its total");
  return { index, total };
}

function parseArgs(argv) {
  const args = {
    country: null,
    targetLocale: null,
    area: null,
    batch: null,
    batchSize: 25,
    limit: null,
    dryRun: false,
    csvRoot: DEFAULT_CSV_ROOT,
    glossaryPath: DEFAULT_GLOSSARY_PATH,
    engineRegistryPath: DEFAULT_ENGINE_REGISTRY_PATH,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value) throw new Error(`${argument} requires a value`);
      return value;
    };
    if (argument === "--country") args.country = next();
    else if (argument === "--target-locale" || argument === "--locale") args.targetLocale = next();
    else if (argument === "--area") args.area = next();
    else if (argument === "--batch") args.batch = parseBatch(next());
    else if (argument === "--batch-size") args.batchSize = positiveInteger(next(), "--batch-size");
    else if (argument === "--limit") args.limit = positiveInteger(next(), "--limit");
    else if (argument === "--dry-run") args.dryRun = true;
    else if (argument === "--root") args.csvRoot = path.resolve(next());
    else if (argument === "--glossary") args.glossaryPath = path.resolve(next());
    else if (argument === "--engines") args.engineRegistryPath = path.resolve(next());
    else if (argument === "--help" || argument === "-h") args.help = true;
    else throw new Error(`unknown argument '${argument}'`);
  }
  if (!args.help && !args.targetLocale) {
    throw new Error("--target-locale is required");
  }
  if (!args.help && !args.country) {
    args.country = resolveDefaultCatalogCountry(args.csvRoot);
  }
  return args;
}

export class TranslationBatchValidationError extends Error {
  constructor(message, { kind = "structure", entryId = null, cause = undefined } = {}) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "TranslationBatchValidationError";
    this.kind = kind;
    this.entryId = entryId;
  }
}

export function validateTranslationBatchResponse({ entries, response, targetLocale, glossary }) {
  if (!response || !Array.isArray(response.translations)) {
    throw new TranslationBatchValidationError(
      "provider response must contain a translations array",
    );
  }
  if (response.translations.length !== entries.length) {
    throw new TranslationBatchValidationError(
      `provider returned ${response.translations.length} outputs for ${entries.length} inputs`,
    );
  }
  const expected = new Map(entries.map((entry) => [entry.id, entry]));
  const seen = new Set();
  const outputById = new Map();

  for (const output of response.translations) {
    if (!output || typeof output.id !== "string" || typeof output.text !== "string") {
      throw new TranslationBatchValidationError(
        "provider output entries must contain string id and text values",
      );
    }
    if (!expected.has(output.id)) {
      throw new TranslationBatchValidationError(`provider returned unknown id '${output.id}'`);
    }
    if (seen.has(output.id)) {
      throw new TranslationBatchValidationError(`provider duplicated id '${output.id}'`);
    }
    seen.add(output.id);
    outputById.set(output.id, output);
  }
  for (const id of expected.keys()) {
    if (!seen.has(id)) {
      throw new TranslationBatchValidationError(`provider omitted id '${id}'`);
    }
  }

  const translations = [];
  for (const entry of entries) {
    const output = outputById.get(entry.id);
    const text = normalizeTranslationSource(output.text);
    try {
      const spec = translationFieldSpec(entry.field ?? "descripcion");
      if (!spec || Array.from(text).length > spec.translatedMaxCharacters) {
        throw new Error(
          `translation text must be at most ${spec?.translatedMaxCharacters ?? 0} Unicode characters`,
        );
      }
      validateTranslationOutput({
        source: entry.text,
        sourceLocale: entry.sourceLocale,
        text,
        targetLocale,
        protectedTerms: glossary.protectedTerms,
        producerName: entry.producerName,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new TranslationBatchValidationError(
        `provider output '${entry.id}' for target '${targetLocale}' failed validation: ${message}`,
        { kind: "content", entryId: entry.id, cause: error },
      );
    }
    translations.push({ id: entry.id, text });
  }
  return translations;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

const NON_REPAIRABLE_QUANTITATIVE_ERROR_PREFIXES = Object.freeze([
  "translation must preserve every number exactly",
  "translation must preserve ordered quantitative facts exactly",
]);

function isNonRepairableQuantitativeError(error) {
  const seen = new Set();
  let current = error;
  while (current instanceof Error && !seen.has(current)) {
    if (
      NON_REPAIRABLE_QUANTITATIVE_ERROR_PREFIXES.some((prefix) =>
        current.message.startsWith(prefix),
      )
    ) {
      return true;
    }
    seen.add(current);
    current = current.cause;
  }
  return false;
}

function previousCandidateForEntry(response, entryId) {
  if (!Array.isArray(response?.translations)) return null;
  const matches = response.translations.filter(
    (output) => output?.id === entryId && typeof output.text === "string",
  );
  return matches.length === 1 ? normalizeTranslationSource(matches[0].text) : null;
}

export async function translateValidatedBatch({
  adapter,
  targetLocale,
  entries,
  glossary,
  systemPrompt = TRANSLATION_SYSTEM_PROMPT,
}) {
  const response = await adapter.translate({
    systemPrompt,
    targetLocale,
    entries,
    glossary,
  });
  try {
    return validateTranslationBatchResponse({ entries, response, targetLocale, glossary }).map(
      (translation) => ({ ...translation, repaired: false }),
    );
  } catch (batchError) {
    if (isNonRepairableQuantitativeError(batchError)) throw batchError;
    const structuralFailure =
      !(batchError instanceof TranslationBatchValidationError) ||
      batchError.kind !== "content";
    const accepted = new Map();
    const repairs = [];

    for (const entry of entries) {
      const previousText = previousCandidateForEntry(response, entry.id);
      let validationError = errorMessage(batchError);
      if (!structuralFailure && previousText !== null) {
        try {
          const [translation] = validateTranslationBatchResponse({
            entries: [entry],
            response: { translations: [{ id: entry.id, text: previousText }] },
            targetLocale,
            glossary,
          });
          accepted.set(entry.id, { ...translation, repaired: false });
          continue;
        } catch (entryError) {
          if (isNonRepairableQuantitativeError(entryError)) throw entryError;
          validationError = errorMessage(entryError);
        }
      }
      repairs.push({ entry, previousText, validationError });
    }

    for (const repair of repairs) {
      const retryResponse = await adapter.translate({
        systemPrompt: TRANSLATION_REPAIR_SYSTEM_PROMPT,
        targetLocale,
        entries: [repair.entry],
        glossary,
        repair: {
          previousText: repair.previousText,
          validationError: repair.validationError,
        },
      });
      const [translation] = validateTranslationBatchResponse({
        entries: [repair.entry],
        response: retryResponse,
        targetLocale,
        glossary,
      });
      accepted.set(repair.entry.id, { ...translation, repaired: true });
    }

    return entries.map((entry) => accepted.get(entry.id));
  }
}

function machineRowIsReusable(row, source, targetLocale, adapter, glossary) {
  const metadataMatches =
    adapter &&
    row.origin === "machine" &&
    row.source_locale === source.sourceLocale &&
    row.source_hash === hashTranslationSource(source.text) &&
    row.engine === adapter.engine &&
    row.engine_version === adapter.engineVersion &&
    row.prompt_version === TRANSLATION_PROMPT_VERSION &&
    row.glossary_version === glossary.version;
  if (!metadataMatches) return false;
  try {
    const spec = translationFieldSpec(source.field);
    if (!spec || Array.from(row.text).length > spec.translatedMaxCharacters) {
      return false;
    }
    validateTranslationOutput({
      source: source.text,
      sourceLocale: source.sourceLocale,
      text: row.text,
      targetLocale,
      protectedTerms: glossary.protectedTerms,
      producerName: source.producerName,
    });
    return true;
  } catch {
    return false;
  }
}

function machineRowIsApproved(row, targetLocale, engineRegistry) {
  return Boolean(
    findApprovedTranslationEngine(engineRegistry, {
      engine: row.engine,
      engineVersion: row.engine_version,
      promptVersion: row.prompt_version,
      glossaryVersion: row.glossary_version,
      targetLocale,
    }),
  );
}

function reviewedRowIsCurrent(row, source) {
  return (
    source &&
    source.text &&
    row.source_locale === source.sourceLocale &&
    row.source_hash === hashTranslationSource(source.text)
  );
}

function selectSources(rows, { targetLocale, area, batch, limit }) {
  let selected = rows
    .filter((source) => source.text && source.sourceLocale !== targetLocale)
    .sort((left, right) => compareTranslationRows(
      { producer_id: left.producerId, field: left.field },
      { producer_id: right.producerId, field: right.field },
    ));
  if (area) selected = selected.filter((source) => source.area === area);
  if (batch) selected = selected.filter((_, index) => index % batch.total === batch.index - 1);
  if (limit !== null) selected = selected.slice(0, limit);
  return selected;
}

/**
 * @param {{
 *   country?: string,
 *   targetLocale?: string,
 *   adapter?: {engine: string, model: string, engineVersion: string, translate: (request: object) => Promise<any>},
 *   area?: string | null,
 *   batch?: {index: number, total: number} | null,
 *   batchSize?: number,
 *   limit?: number | null,
 *   dryRun?: boolean,
 *   csvRoot?: string,
 *   glossaryPath?: string,
 *   engineRegistryPath?: string,
 * }} [options]
 */
export async function generateCatalogTranslations({
  country = undefined,
  targetLocale = undefined,
  adapter = undefined,
  area = null,
  batch = null,
  batchSize = 25,
  limit = null,
  dryRun = false,
  csvRoot = DEFAULT_CSV_ROOT,
  glossaryPath = DEFAULT_GLOSSARY_PATH,
  engineRegistryPath = DEFAULT_ENGINE_REGISTRY_PATH,
} = {}) {
  if (!/^[a-z]{2}$/.test(country ?? "")) throw new Error(`Invalid country '${country}'`);
  if (!SUPPORTED_TRANSLATION_TARGET_LOCALE_SET.has(targetLocale)) {
    throw new Error(`Unsupported target locale '${targetLocale}'`);
  }
  if (
    !dryRun &&
    (!adapter ||
      typeof adapter.translate !== "function" ||
      !adapter.engine ||
      !adapter.model ||
      !adapter.engineVersion)
  ) {
    throw new Error("A versioned translation adapter with an explicit model is required");
  }
  positiveInteger(batchSize, "batchSize");
  const glossary = readTranslationGlossary(glossaryPath);
  const engineRegistry = readTranslationEngineRegistry(engineRegistryPath);
  if (!dryRun) {
    assertApprovedTranslationEngine(engineRegistry, {
      engine: adapter.engine,
      model: adapter.model,
      engineVersion: adapter.engineVersion,
      promptVersion: TRANSLATION_PROMPT_VERSION,
      glossaryVersion: glossary.version,
      targetLocale,
    });
  }
  const canonical = readCanonicalCountry(csvRoot, country);
  if (canonical.errors.length > 0) {
    throw new Error(`Canonical catalog is invalid:\n- ${canonical.errors.join("\n- ")}`);
  }
  if (area && !canonical.rows.some((row) => row.area === area)) {
    throw new Error(`Unknown area '${country}/${area}'`);
  }

  const sidecarPath = path.join(csvRoot, country, `translations.${targetLocale}.csv`);
  const existingRows = fs.existsSync(sidecarPath) ? readTranslationSidecar(sidecarPath) : [];
  const seen = new Set();
  for (const row of existingRows) {
    const key = translationPairKey(row.producer_id, row.field);
    if (seen.has(key)) throw new Error(`${sidecarPath}: duplicate (producer_id, field) row`);
    seen.add(key);
  }

  const selectedSources = selectSources(canonical.translationSources, {
    targetLocale,
    area,
    batch,
    limit,
  });
  const selectedKeys = new Set(
    selectedSources.map((source) => translationPairKey(source.producerId, source.field)),
  );
  const fullyScoped = !area && !batch && limit === null;
  const output = new Map();
  const pending = [];
  const staleReviewed = [];
  const obsoleteReviewed = [];
  let reusedMachine = 0;
  let reusedReviewed = 0;
  let prunedMachine = 0;

  for (const row of existingRows) {
    const key = translationPairKey(row.producer_id, row.field);
    const source = canonical.byKey.get(key);
    const expected = source?.text && source.sourceLocale !== targetLocale;

    if (row.origin === "reviewed") {
      output.set(key, row);
      if (!expected) obsoleteReviewed.push(row.producer_id);
      else if (!reviewedRowIsCurrent(row, source)) staleReviewed.push(row.producer_id);
      else reusedReviewed += 1;
      continue;
    }

    if (!expected) {
      const inSelectedArea = area && source?.area === area && !batch && limit === null;
      if (fullyScoped || inSelectedArea) prunedMachine += 1;
      else {
        if (!machineRowIsApproved(row, targetLocale, engineRegistry)) {
          throw new Error(
            `${sidecarPath}: unapproved machine row for producer_id '${row.producer_id}' falls outside the selected regeneration scope`,
          );
        }
        output.set(key, row);
      }
      continue;
    }
    if (machineRowIsReusable(row, source, targetLocale, adapter, glossary)) {
      output.set(key, row);
      reusedMachine += 1;
    } else if (!selectedKeys.has(key)) {
      if (!machineRowIsApproved(row, targetLocale, engineRegistry)) {
        throw new Error(
          `${sidecarPath}: unapproved machine row for producer_id '${row.producer_id}' falls outside the selected regeneration scope`,
        );
      }
      output.set(key, row);
    }
  }

  for (const source of selectedSources) {
    const key = translationPairKey(source.producerId, source.field);
    const existing = output.get(key);
    if (existing?.origin === "reviewed" || existing?.origin === "machine") continue;
    pending.push({
      id: `${source.producerId}:${source.field}`,
      producerId: source.producerId,
      field: source.field,
      producerName: source.producerName,
      sourceLocale: source.sourceLocale,
      sourceText: source.text,
      text: prepareTranslationPromptText(source.text),
    });
  }

  const estimatedCharacters = pending.reduce((total, entry) => total + Array.from(entry.text).length, 0);
  let generated = 0;
  let repaired = 0;
  if (!dryRun) {
    for (let offset = 0; offset < pending.length; offset += batchSize) {
      const entries = pending.slice(offset, offset + batchSize);
      const validated = await translateValidatedBatch({
        adapter,
        targetLocale,
        entries,
        glossary,
      });
      repaired += validated.filter((item) => item.repaired).length;
      const outputById = new Map(validated.map((item) => [item.id, item.text]));
      for (const entry of entries) {
        const key = translationPairKey(entry.producerId, entry.field);
        output.set(key, {
          producer_id: entry.producerId,
          field: entry.field,
          source_locale: entry.sourceLocale,
          source_hash: hashTranslationSource(entry.sourceText),
          text: outputById.get(entry.id),
          origin: "machine",
          engine: adapter.engine,
          engine_version: adapter.engineVersion,
          prompt_version: TRANSLATION_PROMPT_VERSION,
          glossary_version: glossary.version,
        });
        generated += 1;
      }
    }

    const outputRows = [...output.values()].sort(compareTranslationRows);
    for (const row of outputRows) {
      if (row.origin === "machine") {
        assertApprovedTranslationEngine(engineRegistry, {
          engine: row.engine,
          engineVersion: row.engine_version,
          promptVersion: row.prompt_version,
          glossaryVersion: row.glossary_version,
          targetLocale,
        });
      }
      const source = canonical.byKey.get(
        translationPairKey(row.producer_id, row.field),
      );
      if (
        !source ||
        source.sourceLocale === targetLocale ||
        !reviewedRowIsCurrent(row, source)
      ) {
        continue;
      }
      try {
        const spec = translationFieldSpec(row.field);
        if (!spec || Array.from(row.text).length > spec.translatedMaxCharacters) {
          throw new Error(
            `translation text must be at most ${spec?.translatedMaxCharacters ?? 0} Unicode characters`,
          );
        }
        validateTranslationOutput({
          source: source.text,
          sourceLocale: source.sourceLocale,
          text: row.text,
          targetLocale,
          protectedTerms: glossary.protectedTerms,
          producerName: source.producerName,
        });
      } catch (error) {
        throw new Error(
          `${sidecarPath}: producer_id '${row.producer_id}' field '${row.field}' translation content failed validation: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    if (outputRows.length > 0 || fs.existsSync(sidecarPath)) {
      writeTranslationSidecarAtomic(sidecarPath, outputRows);
    }
  }

  return {
    sidecarPath,
    selected: selectedSources.length,
    pending: pending.length,
    estimatedCharacters,
    generated,
    repaired,
    reusedMachine,
    reusedReviewed,
    prunedMachine,
    staleReviewed,
    obsoleteReviewed,
    dryRun,
    providerConfigured: Boolean(adapter),
  };
}

function adapterFromEnvironment(env) {
  const provider = String(env.CHISAN_TRANSLATION_PROVIDER ?? "openai-compatible").trim();
  if (provider !== "openai-compatible") {
    throw new Error(
      `Unsupported CHISAN_TRANSLATION_PROVIDER '${provider}'; expected 'openai-compatible'`,
    );
  }
  return createOpenAICompatibleAdapter({ env });
}

function printResult(result) {
  console.log("Translation generation summary");
  console.log(`- sidecar: ${path.relative(REPOSITORY_ROOT, result.sidecarPath)}`);
  console.log(`- selected canonical rows: ${result.selected}`);
  console.log(`- pending provider outputs: ${result.pending}`);
  console.log(`- estimated source characters: ${result.estimatedCharacters}`);
  console.log(`- generated: ${result.generated}`);
  console.log(`- repaired after validation failure: ${result.repaired}`);
  console.log(`- reused: ${result.reusedReviewed} reviewed, ${result.reusedMachine} machine`);
  console.log(`- pruned obsolete machine rows: ${result.prunedMachine}`);
  console.log(`- stale reviewed rows retained: ${result.staleReviewed.length}`);
  console.log(`- obsolete reviewed rows retained: ${result.obsoleteReviewed.length}`);
  if (result.dryRun && !result.providerConfigured) {
    console.log("- provider: not configured; pending volume is a credential-free upper-bound plan");
  }
  console.log(`- mode: ${result.dryRun ? "dry-run (no provider calls or writes)" : "materialized"}`);
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
    const adapter = args.dryRun ? undefined : adapterFromEnvironment(process.env);
    const result = await generateCatalogTranslations({ ...args, adapter });
    printResult(result);
    if (result.staleReviewed.length || result.obsoleteReviewed.length) process.exitCode = 1;
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
