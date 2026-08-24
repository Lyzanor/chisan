#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  TRANSLATION_FIELD,
  TRANSLATION_PROMPT_VERSION,
  hashTranslationSource,
  listCatalogCsvFiles,
  prepareTranslationPromptText,
  quantitativeFingerprint,
  readCanonicalCountry,
  readTranslationGlossary,
} from "./lib/catalog-translations.mjs";
import { createOpenAICompatibleAdapter } from "./lib/translation-providers.mjs";
import { translateValidatedBatch } from "./generate-catalog-translations.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_CSV_ROOT = path.join(REPOSITORY_ROOT, "data", "csv");
const DEFAULT_GLOSSARY_PATH = path.join(
  REPOSITORY_ROOT,
  "data",
  "reference",
  "translation-glossary.json",
);
const DEFAULT_SPEC_PATH = path.join(
  REPOSITORY_ROOT,
  "data",
  "reference",
  "translation-benchmark.json",
);
const MINIMUM_SAMPLES_PER_TARGET = 50;
export const REQUIRED_BENCHMARK_STRATA = Object.freeze([
  "proper-name-or-brand",
  "appellation",
  "culture-bound-product",
  "number",
  "quantitative-context",
  "written-number-or-ordinal",
  "date",
  "catalan-orthography",
  "german-orthography",
  "japanese-script",
  "romanized-identity",
]);
const REQUIRED_BENCHMARK_TARGETS = Object.freeze(["ca", "de", "ja"]);
const VERSION_TOKEN_PATTERN = /^[^\s\u0000-\u001f\u007f]+$/u;
const DATE_PATTERN = /\b(?:1[5-9]\d{2}|20\d{2})\b|\b\d{1,2}[/.\-]\d{1,2}[/.\-]\d{2,4}\b/u;
const LATIN_IDENTITY_PATTERN = /^[\p{Script=Latin}\p{M}\p{N} &'’.()\/-]+$/u;

/**
 * @typedef {{
 *   benchmark_id: string,
 *   country: string,
 *   producer_id: string,
 *   producer_name: string,
 *   field: string,
 *   source_locale: string,
 *   source_hash: string,
 *   target_locale: string,
 *   strata: string[],
 *   text: string,
 * }} BenchmarkSample
 */

/**
 * @typedef {{benchmark_id: string, text: string, repair_attempted: boolean, human_review: null}} BenchmarkCandidate
 */

function usage() {
  console.log(`Usage: node scripts/benchmark-catalog-translations.mjs --plan [options]
       node scripts/benchmark-catalog-translations.mjs --run <plan.json> --output <results.json> [options]

Modes:
  --plan                 Build the deterministic, source-only benchmark plan.
  --run <plan.json>      Generate unreviewed candidate outputs; never writes catalog sidecars.

Options:
  --output <path>        Write the plan/result JSON atomically; plan mode prints a summary if omitted.
  --batch-size <n>       Entries per provider request in run mode (default 25).
  --root <csv-root>      Override data/csv (primarily for isolated tests).
  --glossary <path>      Override the versioned glossary.
  --spec <path>          Override the benchmark specification.
  -h, --help             Show this help.

Run mode uses the same CHISAN_TRANSLATION_* openai-compatible configuration as
generate:translations. Results are always marked unreviewed and require a
separate human assessment before any provider is selected.`);
}

function positiveInteger(value, label) {
  if (!/^[1-9]\d*$/.test(String(value ?? ""))) throw new Error(`${label} must be a positive integer`);
  return Number(value);
}

function parseArgs(argv) {
  const args = {
    mode: null,
    planPath: null,
    outputPath: null,
    batchSize: 25,
    csvRoot: DEFAULT_CSV_ROOT,
    glossaryPath: DEFAULT_GLOSSARY_PATH,
    specPath: DEFAULT_SPEC_PATH,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      const value = argv[++index];
      if (!value) throw new Error(`${argument} requires a value`);
      return value;
    };
    if (argument === "--plan") {
      if (args.mode) throw new Error("choose exactly one of --plan or --run");
      args.mode = "plan";
    } else if (argument === "--run") {
      if (args.mode) throw new Error("choose exactly one of --plan or --run");
      args.mode = "run";
      args.planPath = path.resolve(next());
    } else if (argument === "--output") args.outputPath = path.resolve(next());
    else if (argument === "--batch-size") args.batchSize = positiveInteger(next(), "--batch-size");
    else if (argument === "--root") args.csvRoot = path.resolve(next());
    else if (argument === "--glossary") args.glossaryPath = path.resolve(next());
    else if (argument === "--spec") args.specPath = path.resolve(next());
    else if (argument === "--help" || argument === "-h") args.help = true;
    else throw new Error(`unknown argument '${argument}'`);
  }
  if (!args.help && !args.mode) throw new Error("choose exactly one of --plan or --run");
  if (!args.help && args.mode === "run" && !args.outputPath) {
    throw new Error("--run requires --output so candidate results remain separate from sidecars");
  }
  return args;
}

export function readTranslationBenchmarkSpec(specPath = DEFAULT_SPEC_PATH) {
  let spec;
  try {
    spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  } catch (error) {
    throw new Error(`${specPath}: ${error.message}`);
  }
  if (spec.schema_version !== 1) {
    throw new Error(`${specPath}: schema_version must be 1`);
  }
  if (typeof spec.version !== "string" || !VERSION_TOKEN_PATTERN.test(spec.version)) {
    throw new Error(`${specPath}: version must be a non-empty version token`);
  }
  if (!spec.targets || typeof spec.targets !== "object" || Array.isArray(spec.targets)) {
    throw new Error(`${specPath}: targets must be an object`);
  }
  if (
    JSON.stringify(Object.keys(spec.targets).sort()) !==
    JSON.stringify([...REQUIRED_BENCHMARK_TARGETS].sort())
  ) {
    throw new Error(`${specPath}: targets must be exactly ca, de and ja`);
  }
  for (const target of REQUIRED_BENCHMARK_TARGETS) {
    const sampleSize = spec.targets[target]?.sampleSize;
    if (!Number.isInteger(sampleSize) || sampleSize < MINIMUM_SAMPLES_PER_TARGET) {
      throw new Error(
        `${specPath}: target '${target}' requires at least ${MINIMUM_SAMPLES_PER_TARGET} samples`,
      );
    }
  }
  if (
    !Array.isArray(spec.stratumOrder) ||
    spec.stratumOrder.length !== REQUIRED_BENCHMARK_STRATA.length ||
    new Set(spec.stratumOrder).size !== spec.stratumOrder.length ||
    spec.stratumOrder.some((stratum) => !REQUIRED_BENCHMARK_STRATA.includes(stratum))
  ) {
    throw new Error(`${specPath}: stratumOrder must contain every required stratum exactly once`);
  }
  if (!spec.strata || typeof spec.strata !== "object" || Array.isArray(spec.strata)) {
    throw new Error(`${specPath}: strata must be an object`);
  }
  if (
    JSON.stringify(Object.keys(spec.strata).sort()) !==
    JSON.stringify([...REQUIRED_BENCHMARK_STRATA].sort())
  ) {
    throw new Error(`${specPath}: strata must define every required stratum exactly once`);
  }
  for (const stratum of REQUIRED_BENCHMARK_STRATA) {
    const minimum = spec.strata[stratum]?.minimumPerTarget;
    if (!Number.isInteger(minimum) || minimum < 1) {
      throw new Error(`${specPath}: stratum '${stratum}' needs a positive minimumPerTarget`);
    }
  }
  const minimumTotal = REQUIRED_BENCHMARK_STRATA.reduce(
    (total, stratum) => total + spec.strata[stratum].minimumPerTarget,
    0,
  );
  for (const target of REQUIRED_BENCHMARK_TARGETS) {
    if (minimumTotal > spec.targets[target].sampleSize) {
      throw new Error(
        `${specPath}: stratum minima total ${minimumTotal}, above target '${target}' sampleSize ${spec.targets[target].sampleSize}`,
      );
    }
  }
  for (const field of [
    "appellationTerms",
    "cultureBoundProductTerms",
    "writtenNumberOrOrdinalPhrases",
  ]) {
    const values = spec[field];
    if (
      !Array.isArray(values) ||
      values.length === 0 ||
      values.some((value) => typeof value !== "string" || !value.trim()) ||
      new Set(values.map((value) => value.normalize("NFC").toLocaleLowerCase("und"))).size !==
        values.length
    ) {
      throw new Error(`${specPath}: ${field} must contain unique non-empty strings`);
    }
  }
  return spec;
}

const WORD_CHARACTER_PATTERN = /[\p{L}\p{M}\p{N}]/u;

function containsNormalizedTerm(text, term) {
  let offset = 0;
  while (offset <= text.length - term.length) {
    const index = text.indexOf(term, offset);
    if (index === -1) return false;
    const before = text[index - 1] ?? "";
    const after = text[index + term.length] ?? "";
    if (!WORD_CHARACTER_PATTERN.test(before) && !WORD_CHARACTER_PATTERN.test(after)) {
      return true;
    }
    offset = index + term.length;
  }
  return false;
}

export function sourceBenchmarkStrata(source, spec) {
  const strata = [];
  const producerName = String(source.producerName ?? source.producer_name ?? "");
  const normalizedText = source.text.normalize("NFC").toLocaleLowerCase("und");
  const normalizedProducerName = producerName.normalize("NFC").toLocaleLowerCase("und");
  const hasTerm = (term) =>
    containsNormalizedTerm(
      normalizedText,
      term.normalize("NFC").toLocaleLowerCase("und"),
    );
  const namedIdentity = normalizedProducerName && containsNormalizedTerm(
    normalizedText,
    normalizedProducerName,
  );
  if (
    namedIdentity ||
    /\b(?:[A-ZÀ-ÖØ-Þ]{2,}|[A-Z][a-z]+[A-Z][A-Za-z]*)\b/u.test(source.text)
  ) {
    strata.push("proper-name-or-brand");
  }
  if (spec.appellationTerms.some(hasTerm)) {
    strata.push("appellation");
  }
  if (spec.cultureBoundProductTerms.some(hasTerm)) {
    strata.push("culture-bound-product");
  }
  if (/\p{N}/u.test(source.text)) strata.push("number");
  const quantitativeFacts = quantitativeFingerprint(source.text);
  const orderedNumberParts = quantitativeFacts.reduce(
    (total, fact) => total + (fact.number.match(/\p{N}+/gu)?.length ?? 0),
    0,
  );
  if (
    orderedNumberParts > 1 ||
    quantitativeFacts.some(
      (fact) =>
        fact.leading_markers.length > 0 ||
        fact.trailing_markers.length > 0 ||
        Boolean(fact.unit),
    )
  ) {
    strata.push("quantitative-context");
  }
  if (spec.writtenNumberOrOrdinalPhrases.some(hasTerm)) {
    strata.push("written-number-or-ordinal");
  }
  if (DATE_PATTERN.test(source.text)) strata.push("date");
  if (/[àèòç]|l·l/iu.test(source.text)) strata.push("catalan-orthography");
  if (/[äöüß]/iu.test(source.text)) strata.push("german-orthography");
  if (/\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/u.test(source.text)) {
    strata.push("japanese-script");
  }
  if (
    source.country === "jp" &&
    namedIdentity &&
    /\p{Script=Latin}/u.test(producerName) &&
    LATIN_IDENTITY_PATTERN.test(producerName)
  ) {
    strata.push("romanized-identity");
  }
  return spec.stratumOrder.filter((stratum) => strata.includes(stratum));
}

function stableRank(benchmarkVersion, targetLocale, source) {
  return crypto
    .createHash("sha256")
    .update(
      `${benchmarkVersion}\u0000${targetLocale}\u0000${source.country}\u0000${source.producerId}\u0000${hashTranslationSource(source.text)}`,
      "utf8",
    )
    .digest("hex");
}

function emptyStratumCounts(spec) {
  return Object.fromEntries(spec.stratumOrder.map((stratum) => [stratum, 0]));
}

function addCandidateCoverage(coverage, candidate) {
  for (const stratum of candidate.strata) coverage[stratum] += 1;
}

function selectTargetSamples({ sources, targetLocale, sampleSize, spec }) {
  const ranked = sources
    .filter((source) => source.text && source.sourceLocale !== targetLocale)
    .map((source) => ({
      source,
      strata: sourceBenchmarkStrata(source, spec),
      rank: stableRank(spec.version, targetLocale, source),
    }))
    .sort((left, right) => left.rank.localeCompare(right.rank));
  if (ranked.length < sampleSize) {
    throw new Error(
      `Benchmark target '${targetLocale}' needs ${sampleSize} eligible descriptions but found ${ranked.length}`,
    );
  }

  const selected = [];
  const selectedKeys = new Set();
  const coverage = emptyStratumCounts(spec);
  for (const stratum of spec.stratumOrder) {
    const minimum = spec.strata[stratum].minimumPerTarget;
    while (coverage[stratum] < minimum) {
      const candidate = ranked.find(
        ({ source, strata }) =>
          strata.includes(stratum) &&
          !selectedKeys.has(`${source.country}/${source.producerId}`),
      );
      if (!candidate) {
        throw new Error(
          `Benchmark target '${targetLocale}' cannot meet stratum '${stratum}' minimum ${minimum}; found ${coverage[stratum]}`,
        );
      }
      selected.push(candidate);
      selectedKeys.add(`${candidate.source.country}/${candidate.source.producerId}`);
      addCandidateCoverage(coverage, candidate);
    }
  }
  for (const candidate of ranked) {
    if (selected.length >= sampleSize) break;
    const key = `${candidate.source.country}/${candidate.source.producerId}`;
    if (selectedKeys.has(key)) continue;
    selected.push(candidate);
    selectedKeys.add(key);
    addCandidateCoverage(coverage, candidate);
  }

  return {
    coverage,
    samples: selected.map(({ source, strata }) => ({
      benchmark_id: `${targetLocale}:${source.country}:${source.producerId}:${TRANSLATION_FIELD}`,
      country: source.country,
      producer_id: source.producerId,
      producer_name: source.producerName ?? "",
      field: TRANSLATION_FIELD,
      source_locale: source.sourceLocale,
      source_hash: hashTranslationSource(source.text),
      target_locale: targetLocale,
      strata,
      text: source.text,
    })),
  };
}

function digestPlan(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
}

export function buildTranslationBenchmarkPlan({ sources, spec, glossary }) {
  const targets = /** @type {Record<string, BenchmarkSample[]>} */ ({});
  const coverage = /** @type {Record<string, Record<string, number>>} */ ({});
  for (const [targetLocale, targetSpec] of Object.entries(spec.targets)) {
    if (!Number.isInteger(targetSpec.sampleSize) || targetSpec.sampleSize < MINIMUM_SAMPLES_PER_TARGET) {
      throw new Error(
        `Benchmark target '${targetLocale}' requires at least ${MINIMUM_SAMPLES_PER_TARGET} samples`,
      );
    }
    const selected = selectTargetSamples({
      sources,
      targetLocale,
      sampleSize: targetSpec.sampleSize,
      spec,
    });
    targets[targetLocale] = selected.samples;
    coverage[targetLocale] = selected.coverage;
  }
  const stratumRequirements = Object.fromEntries(
    spec.stratumOrder.map((stratum) => [stratum, spec.strata[stratum].minimumPerTarget]),
  );
  const unsigned = {
    schema_version: 2,
    benchmark_version: spec.version,
    prompt_version: TRANSLATION_PROMPT_VERSION,
    glossary_version: glossary.version,
    review_status: "not_started",
    stratum_requirements: stratumRequirements,
    coverage,
    targets,
  };
  return { ...unsigned, plan_hash: digestPlan(unsigned) };
}

export function loadBenchmarkSources(csvRoot = DEFAULT_CSV_ROOT) {
  const catalog = listCatalogCsvFiles(csvRoot);
  const countries = [
    ...new Set(
      catalog.areaFiles.map((filePath) => path.relative(csvRoot, filePath).split(path.sep)[0]),
    ),
  ].sort();
  const sources = [];
  const legacyFiles = [];
  const errors = [];
  for (const country of countries) {
    const canonical = readCanonicalCountry(csvRoot, country);
    sources.push(...canonical.rows);
    legacyFiles.push(...canonical.legacyFiles);
    errors.push(...canonical.errors);
  }
  if (errors.length > 0) throw new Error(`Canonical catalog is invalid:\n- ${errors.join("\n- ")}`);
  if (legacyFiles.length > 0) {
    throw new Error(
      `Phase 4 prerequisite missing: ${legacyFiles.length} area CSV file(s) do not have descripcion_locale; no benchmark plan was written.`,
    );
  }
  return sources;
}

export function assertBenchmarkPlan(plan, spec) {
  if (!plan || typeof plan !== "object" || plan.schema_version !== 2) {
    throw new Error("Benchmark plan has an unsupported schema");
  }
  const { plan_hash: planHash, ...unsigned } = plan;
  if (planHash !== digestPlan(unsigned)) throw new Error("Benchmark plan_hash does not match its content");
  if (plan.benchmark_version !== spec.version) {
    throw new Error(
      `Benchmark plan version '${plan.benchmark_version}' does not match spec '${spec.version}'`,
    );
  }
  const expectedRequirements = Object.fromEntries(
    spec.stratumOrder.map((stratum) => [stratum, spec.strata[stratum].minimumPerTarget]),
  );
  if (JSON.stringify(plan.stratum_requirements) !== JSON.stringify(expectedRequirements)) {
    throw new Error("Benchmark plan stratum requirements do not match the current spec");
  }
  if (
    JSON.stringify(Object.keys(plan.targets ?? {}).sort()) !==
      JSON.stringify([...REQUIRED_BENCHMARK_TARGETS].sort()) ||
    JSON.stringify(Object.keys(plan.coverage ?? {}).sort()) !==
      JSON.stringify([...REQUIRED_BENCHMARK_TARGETS].sort())
  ) {
    throw new Error("Benchmark plan targets and coverage must be exactly ca, de and ja");
  }

  for (const target of REQUIRED_BENCHMARK_TARGETS) {
    const samples = plan.targets[target];
    const expectedSize = spec.targets[target].sampleSize;
    if (!Array.isArray(samples) || samples.length !== expectedSize) {
      throw new Error(
        `Benchmark plan target '${target}' must contain exactly ${expectedSize} samples`,
      );
    }
    const seen = new Set();
    const coverage = emptyStratumCounts(spec);
    for (const sample of samples) {
      const expectedId = `${target}:${sample.country}:${sample.producer_id}:${TRANSLATION_FIELD}`;
      if (
        !/^[a-z]{2}$/.test(sample.country ?? "") ||
        !/^[1-9]\d*$/.test(sample.producer_id ?? "") ||
        typeof sample.producer_name !== "string" ||
        !/^[a-z]{2}$/.test(sample.source_locale ?? "") ||
        sample.benchmark_id !== expectedId ||
        sample.field !== TRANSLATION_FIELD ||
        sample.target_locale !== target ||
        sample.source_locale === target ||
        typeof sample.text !== "string" ||
        !sample.text ||
        sample.source_hash !== hashTranslationSource(sample.text)
      ) {
        throw new Error(`Benchmark plan target '${target}' contains an invalid sample`);
      }
      if (seen.has(sample.benchmark_id)) {
        throw new Error(`Benchmark plan target '${target}' contains duplicate samples`);
      }
      seen.add(sample.benchmark_id);
      const recomputed = sourceBenchmarkStrata(sample, spec);
      if (JSON.stringify(sample.strata) !== JSON.stringify(recomputed)) {
        throw new Error(
          `Benchmark sample '${sample.benchmark_id}' has strata that do not match its source text`,
        );
      }
      addCandidateCoverage(coverage, { strata: recomputed });
    }
    if (JSON.stringify(plan.coverage[target]) !== JSON.stringify(coverage)) {
      throw new Error(`Benchmark plan target '${target}' coverage does not match its samples`);
    }
    for (const stratum of spec.stratumOrder) {
      const minimum = spec.strata[stratum].minimumPerTarget;
      if (coverage[stratum] < minimum) {
        throw new Error(
          `Benchmark plan target '${target}' does not meet stratum '${stratum}' minimum ${minimum}`,
        );
      }
    }
  }
}

export async function executeTranslationBenchmark({
  plan,
  adapter,
  glossary,
  spec,
  batchSize = 25,
}) {
  assertBenchmarkPlan(plan, spec);
  if (plan.prompt_version !== TRANSLATION_PROMPT_VERSION) {
    throw new Error(
      `Benchmark plan prompt_version '${plan.prompt_version}' is not current ('${TRANSLATION_PROMPT_VERSION}')`,
    );
  }
  if (plan.glossary_version !== glossary.version) {
    throw new Error(
      `Benchmark plan glossary_version '${plan.glossary_version}' is not current ('${glossary.version}')`,
    );
  }
  positiveInteger(batchSize, "batchSize");
  if (
    !adapter ||
    typeof adapter.translate !== "function" ||
    !adapter.engine ||
    !adapter.model ||
    !adapter.engineVersion
  ) {
    throw new Error("A versioned translation adapter with an explicit model is required");
  }
  const targets = /** @type {Record<string, BenchmarkCandidate[]>} */ ({});
  for (const [targetLocale, samples] of Object.entries(plan.targets)) {
    const outputs = [];
    for (let offset = 0; offset < samples.length; offset += batchSize) {
      const batch = samples.slice(offset, offset + batchSize);
      const entries = batch.map((sample) => ({
        id: sample.benchmark_id,
        sourceLocale: sample.source_locale,
        text: prepareTranslationPromptText(sample.text),
      }));
      const validated = await translateValidatedBatch({
        adapter,
        targetLocale,
        entries,
        glossary,
      });
      for (const output of validated) {
        outputs.push({
          benchmark_id: output.id,
          text: output.text,
          repair_attempted: output.repaired,
          human_review: null,
        });
      }
    }
    targets[targetLocale] = outputs;
  }
  return {
    schema_version: 2,
    benchmark_version: plan.benchmark_version,
    plan_hash: plan.plan_hash,
    engine: adapter.engine,
    model: adapter.model,
    engine_version: adapter.engineVersion,
    prompt_version: TRANSLATION_PROMPT_VERSION,
    glossary_version: glossary.version,
    review_status: "unreviewed",
    targets,
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

function printPlanSummary(plan) {
  console.log("Translation benchmark plan");
  console.log(`- benchmark version: ${plan.benchmark_version}`);
  console.log(`- plan hash: ${plan.plan_hash}`);
  for (const [target, samples] of Object.entries(plan.targets)) {
    console.log(`- ${target}: ${samples.length} source samples`);
    console.log(
      `  strata: ${Object.entries(plan.coverage[target])
        .map(([stratum, count]) => `${stratum}=${count}`)
        .join(", ")}`,
    );
  }
  console.log("- review status: not started");
  console.log("- provider calls: none");
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
    const glossary = readTranslationGlossary(args.glossaryPath);
    if (args.mode === "plan") {
      const spec = readTranslationBenchmarkSpec(args.specPath);
      const plan = buildTranslationBenchmarkPlan({
        sources: loadBenchmarkSources(args.csvRoot),
        spec,
        glossary,
      });
      if (args.outputPath) writeJsonAtomic(args.outputPath, plan);
      printPlanSummary(plan);
      return;
    }

    const spec = readTranslationBenchmarkSpec(args.specPath);
    const plan = JSON.parse(fs.readFileSync(args.planPath, "utf8"));
    const provider = String(process.env.CHISAN_TRANSLATION_PROVIDER ?? "openai-compatible").trim();
    if (provider !== "openai-compatible") {
      throw new Error(`Unsupported CHISAN_TRANSLATION_PROVIDER '${provider}'`);
    }
    const results = await executeTranslationBenchmark({
      plan,
      adapter: createOpenAICompatibleAdapter({ env: process.env }),
      glossary,
      spec,
      batchSize: args.batchSize,
    });
    writeJsonAtomic(args.outputPath, results);
    console.log(`Unreviewed benchmark candidates written to ${args.outputPath}`);
    console.log("No catalog sidecar was changed; human review is still required.");
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
