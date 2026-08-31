import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  localizeProducerDescriptions,
  type ProducerCsvRow,
} from "../lib/csv-catalog";
import {
  DESCRIPTION_SOURCE_LOCALES,
  SUPPORTED_LOCALES,
} from "../lib/i18n/locales";
import {
  TRANSLATION_SIDECAR_HEADER as RUNTIME_TRANSLATION_SIDECAR_HEADER,
  hashTranslationSource as hashRuntimeSource,
  normalizeTranslationSource as normalizeRuntimeSource,
  parseDescriptionTranslations,
  resolveLocalizedDescription,
  type DescriptionTranslation,
} from "../lib/i18n/translations";
import {
  buildTranslationBenchmarkPlan,
  executeTranslationBenchmark,
  readTranslationBenchmarkSpec,
  sourceBenchmarkStrata,
} from "./benchmark-catalog-translations.mjs";
import {
  auditCatalogTranslations,
  buildTranslationRemediationPlan,
  resolveTranslationCheckScope,
  summarizeCanonicalChanges,
} from "./check-catalog-translations.mjs";
import {
  generateCatalogTranslations,
  validateTranslationBatchResponse,
} from "./generate-catalog-translations.mjs";
import { buildCatalogTranslationReadiness } from "./report-catalog-translation-readiness.mjs";
import {
  SUPPORTED_DESCRIPTION_SOURCE_LOCALES,
  SUPPORTED_TRANSLATION_TARGET_LOCALES,
  TRANSLATION_FIELD,
  TRANSLATION_PROMPT_VERSION,
  TRANSLATION_SIDECAR_HEADER,
  classifyCatalogCsvPath,
  hashTranslationSource,
  prepareTranslationPromptText,
  quantitativeFingerprint,
  readTranslationEngineRegistry,
  readTranslationSidecar,
  serializeTranslationSidecar,
  validateTranslationOutput,
} from "./lib/catalog-translations.mjs";
import {
  createFixtureTranslationAdapter,
  createOpenAICompatibleAdapter,
} from "./lib/translation-providers.mjs";

const GLOSSARY = {
  version: "test-glossary-v1",
  protectedTerms: ["DOP", "Chisan"],
  localeInstructions: {
    ca: "Catalan fixture instruction",
    de: "German fixture instruction",
    en: "English fixture instruction",
    es: "Spanish fixture instruction",
    ja: "Japanese fixture instruction",
  },
};

const FIXTURE_ENGINE_APPROVAL = {
  engine: "fixture",
  model: "fixture-model",
  engine_version: "fixture-v1",
  prompt_version: TRANSLATION_PROMPT_VERSION,
  glossary_version: GLOSSARY.version,
  benchmark_version: "fixture-benchmark-v1",
  benchmark_plan_hash: "a".repeat(64),
  target_locales: [...SUPPORTED_TRANSLATION_TARGET_LOCALES],
};

type Fixture = {
  root: string;
  csvRoot: string;
  glossaryPath: string;
  engineRegistryPath: string;
  country: string;
  areaPath: string;
  sidecarPath: string;
};

function fixture(context: test.TestContext, country = "xx"): Fixture {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-translations-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const csvRoot = path.join(root, "data", "csv");
  const areaDirectory = path.join(csvRoot, country, "region");
  const glossaryPath = path.join(root, "data", "reference", "translation-glossary.json");
  const engineRegistryPath = path.join(root, "data", "reference", "translation-engines.json");
  fs.mkdirSync(areaDirectory, { recursive: true });
  fs.mkdirSync(path.dirname(glossaryPath), { recursive: true });
  fs.writeFileSync(glossaryPath, `${JSON.stringify(GLOSSARY, null, 2)}\n`);
  fs.writeFileSync(
    engineRegistryPath,
    `${JSON.stringify({
      schema_version: 1,
      registry_version: "fixture-registry-v1",
      approved_engines: [FIXTURE_ENGINE_APPROVAL],
    }, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(csvRoot, country, "country.json"),
    `${JSON.stringify({
      label: "Fixture",
      unit: { one: "area", many: "areas" },
      regionUnit: { one: "region", many: "regions" },
      i18n: {
        defaultLocale: "ca",
        publishedLocales: ["ca"],
        labels: { ca: "Fixture" },
        unitLabels: { ca: { one: "àrea", many: "àrees" } },
        regionUnitLabels: { ca: { one: "regió", many: "regions" } },
      },
      regions: [{
        slug: "region",
        label: "Region",
        labels: { ca: "Regió" },
        areas: [{ slug: "area", label: "Area", labels: { ca: "Àrea" } }],
      }],
    }, null, 2)}\n`,
  );
  return {
    root,
    csvRoot,
    glossaryPath,
    engineRegistryPath,
    country,
    areaPath: path.join(areaDirectory, "area.csv"),
    sidecarPath: path.join(csvRoot, country, "translations.ca.csv"),
  };
}

function writeEngineRegistry(
  target: Fixture,
  approvedEngines: Array<Record<string, unknown>> = [FIXTURE_ENGINE_APPROVAL],
) {
  fs.writeFileSync(
    target.engineRegistryPath,
    `${JSON.stringify({
      schema_version: 1,
      registry_version: "fixture-registry-v1",
      approved_engines: approvedEngines,
    }, null, 2)}\n`,
  );
}

function writeArea(
  target: Fixture,
  rows: Array<{ producerId: string; text: string; locale?: string }>,
  { omitDescriptionLocale = false } = {},
) {
  const header = omitDescriptionLocale
    ? ["producer_id", "descripcion"]
    : ["producer_id", "descripcion", "descripcion_locale"];
  const records = [header];
  for (const row of rows) {
    records.push(
      omitDescriptionLocale
        ? [row.producerId, row.text]
        : [row.producerId, row.text, row.locale ?? "es"],
    );
  }
  const escaped = records.map((record) =>
    record
      .map((value) => {
        const text = String(value);
        return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
      })
      .join(","),
  );
  fs.writeFileSync(target.areaPath, `${escaped.join("\n")}\n`);
}

function sidecarRow({
  producerId,
  source,
  sourceLocale = "es",
  text = "Text traduït",
  origin = "machine",
  engine = "fixture",
  engineVersion = "fixture-v1",
  promptVersion = TRANSLATION_PROMPT_VERSION,
  glossaryVersion = GLOSSARY.version,
}: {
  producerId: string;
  source: string;
  sourceLocale?: string;
  text?: string;
  origin?: string;
  engine?: string;
  engineVersion?: string;
  promptVersion?: string;
  glossaryVersion?: string;
}) {
  return {
    producer_id: producerId,
    field: TRANSLATION_FIELD,
    source_locale: sourceLocale,
    source_hash: hashTranslationSource(source),
    text,
    origin,
    engine,
    engine_version: engineVersion,
    prompt_version: promptVersion,
    glossary_version: glossaryVersion,
  };
}

function writeSidecar(target: Fixture, rows: ReturnType<typeof sidecarRow>[]) {
  fs.writeFileSync(target.sidecarPath, serializeTranslationSidecar(rows));
}

function audit(target: Fixture, mode = "all", changedPaths?: string[]) {
  return auditCatalogTranslations({
    mode,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
    repositoryRoot: target.root,
    changedPaths,
  });
}

test("source normalization is NFC plus LF only and runtime/script hashes stay identical", () => {
  const decomposed = "  cafe\u0301\r\nnext\rline  ";
  assert.equal(normalizeRuntimeSource(decomposed), "  café\nnext\nline  ");
  assert.equal(hashRuntimeSource(decomposed), hashTranslationSource(decomposed));
  assert.notEqual(hashRuntimeSource(" text "), hashRuntimeSource("text"));
  assert.match(hashRuntimeSource("abc"), /^[a-f0-9]{64}$/);
});

test("script and runtime locale registries keep source languages separate from targets", () => {
  assert.deepEqual(SUPPORTED_TRANSLATION_TARGET_LOCALES, SUPPORTED_LOCALES);
  assert.deepEqual(SUPPORTED_DESCRIPTION_SOURCE_LOCALES, DESCRIPTION_SOURCE_LOCALES);
  assert.equal(SUPPORTED_DESCRIPTION_SOURCE_LOCALES.includes("fr"), true);
  assert.equal(new Set<string>(SUPPORTED_TRANSLATION_TARGET_LOCALES).has("fr"), true);
  assert.equal(SUPPORTED_DESCRIPTION_SOURCE_LOCALES.includes("gl"), true);
  assert.equal(new Set<string>(SUPPORTED_TRANSLATION_TARGET_LOCALES).has("gl"), false);
});

test("spreadsheet carriage-return escapes are prompt formatting, not source identity", async (context) => {
  const canonical = "Family farm_x000d_ raises hens.";
  assert.equal(prepareTranslationPromptText(canonical), "Family farm\n raises hens.");
  assert.notEqual(hashTranslationSource(canonical), hashTranslationSource(prepareTranslationPromptText(canonical)));

  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: canonical, locale: "en" }]);
  const adapter = createFixtureTranslationAdapter({
    handler: ({ entries }: { entries: Array<{ id: string; text: string }> }) => {
      assert.equal(entries[0].text, "Family farm\n raises hens.");
      return { translations: [{ id: entries[0].id, text: "La granja familiar cria gallines." }] };
    },
  });
  await generateCatalogTranslations({
    country: target.country,
    targetLocale: "ca",
    adapter,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
  });

  const [row] = readTranslationSidecar(target.sidecarPath);
  assert.equal(row.source_hash, hashTranslationSource(canonical));
  assert.equal(row.text, "La granja familiar cria gallines.");
});

test("numeric validation reports exact expected and received tokens for actionable repair", () => {
  let validationError = "";
  assert.throws(
    () =>
      validateTranslationOutput({
        source: "Instal·lacions de 2.500m², obertes el 24/08/2026 de 9–13h.",
        text: "Instalaciones de 2,500m2, abiertas el 08/24/2026 de 9-13h.",
        targetLocale: "es",
        protectedTerms: [],
      }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      validationError = error.message;
      return true;
    },
  );

  assert.match(validationError, /expected token multiset/);
  assert.match(validationError, /received token multiset/);
  for (const expectedToken of ["2.500", "²", "24/08/2026", "9", "13"]) {
    assert.ok(validationError.includes(JSON.stringify(expectedToken)));
  }
  for (const receivedToken of ["2,500", "2", "08/24/2026", "9-13"]) {
    assert.ok(validationError.includes(JSON.stringify(receivedToken)));
  }

  for (const [text, receivedCount] of [
    ["Lotes 12 y 24/08/2026.", 1],
    ["Lotes 12, 12 y 12 el 24/08/2026.", 3],
  ] as const) {
    let countError = "";
    assert.throws(
      () =>
        validateTranslationOutput({
          source: "Lots 12 and 12 on 24/08/2026.",
          text,
          targetLocale: "es",
          protectedTerms: [],
        }),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        countError = error.message;
        return true;
      },
    );
    assert.match(countError, /expected token multiset \[\["12",2\],\["24\/08\/2026",1\]\]/);
    assert.ok(countError.includes(`received token multiset [["12",${receivedCount}]`));
  }
});

test("Indic targets reject Latin-dominated output before publication", () => {
  assert.doesNotThrow(() =>
    validateTranslationOutput({
      source: "Family farm growing vegetables.",
      sourceLocale: "en",
      text: "सब्ज़ियाँ उगाने वाला पारिवारिक खेत।",
      targetLocale: "hi",
      protectedTerms: [],
    }),
  );
  assert.throws(
    () =>
      validateTranslationOutput({
        source: "Family farm growing vegetables.",
        sourceLocale: "en",
        text: "Family farm growing fresh vegetables in Delhi.",
        targetLocale: "hi",
        protectedTerms: [],
      }),
    /suspicious native-script coverage/,
  );
  assert.doesNotThrow(() =>
    validateTranslationOutput({
      source: "Lotus Harvest grows vegetables in Delhi.",
      sourceLocale: "en",
      text: "Lotus Harvest दिल्ली में सब्ज़ियाँ उगाता है।",
      targetLocale: "hi",
      protectedTerms: [],
      producerName: "Lotus Harvest",
    }),
  );
});

test("ordered quantitative fingerprints reject changed markers, units and fact order", () => {
  const cases = [
    ["Ingredientes 100% naturales.", "Ingredients 100 naturals."],
    ["Conservación a -5 °C.", "Conservació a 5 °C."],
    ["Precio de €12 por caja.", "Preu de $12 per caixa."],
    ["Rendimiento de 4.000 kg por cosecha.", "Rendiment de 4.000 g per collita."],
    ["Conservación a 25 ºC.", "Conservació a 25 ºF."],
    [
      "Fundada en 2020 y ampliada en 2024.",
      "Ampliada el 2024 i fundada el 2020.",
    ],
    ["Horario de 9–13.", "Horari de 13–9."],
  ] as const;

  for (const [source, text] of cases) {
    let validationError = "";
    assert.throws(
      () =>
        validateTranslationOutput({
          source,
          text,
          targetLocale: "ca",
          protectedTerms: [],
        }),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        validationError = error.message;
        return true;
      },
    );
    assert.match(validationError, /chisan-quantitative-facts-v3/);
    assert.match(validationError, /expected ordered quantitative fingerprint/);
    assert.match(validationError, /received ordered quantitative fingerprint/);
  }
});

test("quantitative fingerprints cover Unicode digits and numeric modifiers", () => {
  for (const [source, text, expectedError] of [
    ["Lote １２.", "Lot 12.", /expected token multiset/],
    ["Lote ١٢.", "Lot 12.", /expected token multiset/],
    ["Temperatura −5 °C.", "Temperatura de 5 °C.", /ordered quantitative fingerprint/],
    ["Dilución de 10⁻³.", "Dilució de 10^³.", /ordered quantitative fingerprint/],
  ] as const) {
    assert.throws(
      () =>
        validateTranslationOutput({
          source,
          text,
          targetLocale: "ca",
          protectedTerms: [],
        }),
      expectedError,
    );
  }
});

test("quantitative fingerprints accept preserved facts and do not read units inside words", () => {
  assert.doesNotThrow(() =>
    validateTranslationOutput({
      source: "Cuesta €12, rinde -5 °C, conserva el 100% y pesa 4.000kg.",
      text: "Costa € 12, rendeix -5 °C, conserva el 100 % i pesa 4.000 kg.",
      targetLocale: "ca",
      protectedTerms: [],
    }),
  );

  assert.doesNotThrow(() =>
    validateTranslationOutput({
      source: "Produce 12 litros y cultiva 5 manzanas.",
      text: "Produeix 12 litres i cultiva 5 melons.",
      targetLocale: "ca",
      protectedTerms: [],
    }),
  );
});

test("quantitative fingerprints preserve observed abbreviated unit variants", () => {
  const observedUnits = [
    "M2",
    "Has",
    "mt.",
    "Km",
    "msnm",
    "m s.n.m.",
    "Kg",
    "kgs",
    "kgrs.",
    "gr",
    "gr.",
    "grs.",
    "am",
    "pm",
    "kg/h",
    "L/año",
    "MW/h",
    "k",
    "M",
    "° C",
    "º C",
  ] as const;

  for (const unit of observedUnits) {
    assert.doesNotThrow(() =>
      validateTranslationOutput({
        source: `Valor registrado: 12 ${unit} en la ficha.`,
        text: `Valor registrat: 12 ${unit} a la fitxa.`,
        targetLocale: "ca",
        protectedTerms: [],
      }),
    );
    assert.throws(
      () =>
        validateTranslationOutput({
          source: `Valor registrado: 12 ${unit} en la ficha.`,
          text: "Valor registrat: 12 unitats a la fitxa.",
          targetLocale: "ca",
          protectedTerms: [],
        }),
      /expected ordered quantitative fingerprint|expected token multiset/,
    );
  }

  assert.throws(
    () =>
      validateTranslationOutput({
        source: "Superficie registrada: 12 M2.",
        text: "Superfície registrada: 12 m2.",
        targetLocale: "ca",
        protectedTerms: [],
      }),
    /ordered quantitative fingerprint/,
  );
});

test("quantitative fingerprints preserve spaced multiplication, division and time operators", () => {
  for (const [source, valid, invalid] of [
    ["Formato de 12 × 8 cm.", "Format de 12 × 8 cm.", "Format de 12 per 8 cm."],
    ["Proporción de 12 / 8.", "Proporció de 12 / 8.", "Proporció de 12 entre 8."],
    ["Horario de 9 : 30.", "Horari de 9 : 30.", "Horari de 9 h 30."],
    ["Horario de 9:30.", "Horari de 9:30.", "Horari de 9:31."],
  ] as const) {
    assert.doesNotThrow(() =>
      validateTranslationOutput({
        source,
        text: valid,
        targetLocale: "ca",
        protectedTerms: [],
      }),
    );
    assert.throws(
      () =>
        validateTranslationOutput({
          source,
          text: invalid,
          targetLocale: "ca",
          protectedTerms: [],
        }),
      /ordered quantitative fingerprint|expected token multiset/,
    );
  }
});

test("short quantitative units are not detected inside Latin words", () => {
  assert.doesNotThrow(() =>
    validateTranslationOutput({
      source:
        "Produce 12 manzanas, 11 litros, 10 kilos, 9 millones, 8 grados, 7 ambientes y 6 Hass.",
      text:
        "Produeix 12 pomes, 11 litres, 10 quilos, 9 milions, 8 graus, 7 ambients i 6 Hass.",
      targetLocale: "ca",
      protectedTerms: [],
    }),
  );

  for (const [sourceWord, targetWord] of [
    ["litros", "ampolles"],
    ["millones", "quantitats"],
    ["grados", "nivells"],
    ["ambientes", "espais"],
    ["Hass", "alvocats"],
  ] as const) {
    assert.doesNotThrow(() =>
      validateTranslationOutput({
        source: `Registra 12 ${sourceWord}.`,
        text: `Registra 12 ${targetWord}.`,
        targetLocale: "ca",
        protectedTerms: [],
      }),
    );
  }

  assert.doesNotThrow(() =>
    validateTranslationOutput({
      source: "Valor: 12 manzanas.",
      text: "Valor de 12 pomes.",
      targetLocale: "ca",
      protectedTerms: [],
    }),
  );

  for (const elision of ["s'exporta", "s’exporta", "sʼexporta"] as const) {
    assert.doesNotThrow(() =>
      validateTranslationOutput({
        source: "Más del 25% se exporta.",
        text: `Més del 25% ${elision}.`,
        targetLocale: "ca",
        protectedTerms: [],
      }),
    );
  }

  assert.deepEqual(quantitativeFingerprint("Reposo de 25 s."), [
    { number: "25", leading_markers: [], trailing_markers: [], unit: "s" },
  ]);

  assert.deepEqual(quantitativeFingerprint("Active since the 1990s."), [
    { number: "1990", leading_markers: [], trailing_markers: [], unit: "" },
  ]);
  assert.deepEqual(quantitativeFingerprint("Active since the 80s."), [
    { number: "80", leading_markers: [], trailing_markers: [], unit: "" },
  ]);
  assert.deepEqual(quantitativeFingerprint("Cycle of 25s."), [
    { number: "25", leading_markers: [], trailing_markers: [], unit: "" },
  ]);
  assert.deepEqual(quantitativeFingerprint("Cycle of 1990 s."), [
    { number: "1990", leading_markers: [], trailing_markers: [], unit: "s" },
  ]);
  assert.doesNotThrow(() =>
    validateTranslationOutput({
      source: "Active since the 1990s.",
      text: "1990年代から活動しています。",
      targetLocale: "ja",
      protectedTerms: [],
    }),
  );
});

test("description resolution uses canonical first, then current reviewed before machine", () => {
  const source = { producerId: "7", text: "Produce miel.", locale: "es" as const };
  const base = {
    producerId: "7",
    field: "descripcion" as const,
    targetLocale: "ca" as const,
    sourceLocale: "es" as const,
    sourceHash: hashRuntimeSource(source.text),
    engine: "fixture",
    engineVersion: "1",
    promptVersion: "1",
    glossaryVersion: "1",
  };
  const translations: DescriptionTranslation[] = [
    { ...base, text: "Màquina", origin: "machine" },
    { ...base, text: "Revisada", origin: "reviewed" },
    { ...base, sourceHash: hashRuntimeSource("old"), text: "Caducada", origin: "reviewed" },
  ];

  assert.deepEqual(resolveLocalizedDescription(source, "es", translations), {
    text: source.text,
    locale: "es",
    origin: "canonical",
  });
  assert.deepEqual(resolveLocalizedDescription(source, "ca", translations), {
    text: "Revisada",
    locale: "ca",
    origin: "reviewed",
  });
  assert.equal(
    resolveLocalizedDescription({ ...source, locale: "en" }, "ca", translations),
    null,
  );
  assert.equal(resolveLocalizedDescription({ ...source, text: "" }, "ca", translations), null);
});

test("runtime parses the dedicated sidecar schema and never mixes canonical prose", () => {
  assert.deepEqual(RUNTIME_TRANSLATION_SIDECAR_HEADER, TRANSLATION_SIDECAR_HEADER);
  const source = "Produce miel en la finca.";
  const parsed = parseDescriptionTranslations(
    [sidecarRow({ producerId: "7", source, text: "Produeix mel a la finca." })],
    "ca",
  );
  const row: ProducerCsvRow = {
    producerId: 7,
    slug: "producer-7",
    name: "Producer 7",
    city: "Town",
    category: "Miel",
    additionalCategories: [],
    categories: ["Miel"],
    featuredProducts: "",
    imageSrc: "",
    latitude: null,
    longitude: null,
    fields: { descripcion: source, descripcion_locale: "es" },
  };

  assert.equal(localizeProducerDescriptions([row], "ca", parsed)[0].fields.descripcion, "Produeix mel a la finca.");
  assert.equal(localizeProducerDescriptions([row], "de", [])[0].fields.descripcion, "");
  assert.equal(localizeProducerDescriptions([row], "es", [])[0], row);
  assert.equal(
    localizeProducerDescriptions(
      [{ ...row, fields: { descripcion: source } }],
      "ca",
      parsed,
    )[0].fields.descripcion,
    "",
  );
  assert.equal(
    localizeProducerDescriptions(
      [{ ...row, fields: { descripcion: source, descripcion_locale: "future" } }],
      "ca",
      parsed,
    )[0].fields.descripcion,
    "",
  );
});

test("source-only locales resolve through sidecars without becoming translation targets", (context) => {
  const source = "Produce mel na súa explotación.";
  const parsed = parseDescriptionTranslations(
    [
      sidecarRow({
        producerId: "7",
        source,
        sourceLocale: "gl",
        text: "Produeix mel a la seva explotació.",
      }),
    ],
    "ca",
  );
  const row: ProducerCsvRow = {
    producerId: 7,
    slug: "producer-7",
    name: "Producer 7",
    city: "Town",
    category: "Miel",
    additionalCategories: [],
    categories: ["Miel"],
    featuredProducts: "",
    imageSrc: "",
    latitude: null,
    longitude: null,
    fields: { descripcion: source, descripcion_locale: "gl" },
  };

  assert.equal(
    localizeProducerDescriptions([row], "ca", parsed)[0].fields.descripcion,
    "Produeix mel a la seva explotació.",
  );
  assert.equal(localizeProducerDescriptions([row], "es", [])[0].fields.descripcion, "");

  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: source, locale: "gl" }]);
  writeSidecar(target, [
    sidecarRow({
      producerId: "1",
      source,
      sourceLocale: "gl",
      text: "Produeix mel a la seva explotació.",
    }),
  ]);
  assert.deepEqual(audit(target).errors, []);

  fs.rmSync(target.sidecarPath);
  target.sidecarPath = path.join(target.csvRoot, target.country, "translations.gl.csv");
  writeSidecar(target, []);
  const result = audit(target);
  assert.ok(result.errors.some((error) => error.includes("unsupported target locale 'gl'")));
});

test("missing country manifest is rejected by the mandatory locale contract", (context) => {
  const target = fixture(context);
  fs.rmSync(path.join(target.csvRoot, target.country, "country.json"));
  writeArea(target, [{ producerId: "1", text: "Descripción ya migrada.", locale: "es" }]);

  const result = audit(target);
  assert.ok(result.errors.some((error) => error.includes("country.json")));
});

test("checker accepts a complete current sidecar and detects only the edited source variant", (context) => {
  const target = fixture(context);
  const sourceOne = "La DOP Example produce 12 botellas.";
  const sourceTwo = "Cultiva frutas en la finca.";
  writeArea(target, [
    { producerId: "1", text: sourceOne },
    { producerId: "2", text: sourceTwo },
    { producerId: "3", text: "Text canònic", locale: "ca" },
  ]);
  writeSidecar(target, [
    sidecarRow({ producerId: "1", source: sourceOne, text: "La DOP Example produeix 12 ampolles." }),
    sidecarRow({ producerId: "2", source: sourceTwo, text: "Cultiva fruita a la finca." }),
  ]);

  const current = audit(target);
  assert.deepEqual(current.errors, []);
  assert.equal(current.stats.current, 2);
  assert.equal(current.stats.missing, 0);

  writeArea(target, [
    { producerId: "1", text: `${sourceOne} Edición.` },
    { producerId: "2", text: sourceTwo },
    { producerId: "3", text: "Text canònic", locale: "ca" },
  ]);
  const stale = audit(target);
  assert.equal(stale.stats.stale, 1);
  assert.equal(stale.stats.current, 1);
  assert.ok(stale.errors.some((error) => error.includes("source_hash is stale")));
  assert.ok(!stale.errors.some((error) => error.includes("producer_id '2'")));
});

test("checker applies content preservation invariants to current machine and reviewed rows", (context) => {
  const target = fixture(context);
  const echoed = "La cooperativa produce 12 botellas de vino.";
  const renumbered = "La explotación produce 20 quesos al día.";
  writeArea(target, [
    { producerId: "1", text: echoed },
    { producerId: "2", text: renumbered },
  ]);
  writeSidecar(target, [
    sidecarRow({ producerId: "1", source: echoed, text: echoed }),
    sidecarRow({
      producerId: "2",
      source: renumbered,
      text: "L'explotació produeix 21 formatges al dia.",
      origin: "reviewed",
    }),
  ]);

  const result = audit(target);
  const joined = result.errors.join("\n");
  assert.match(joined, /must not reproduce source text/);
  assert.match(joined, /must preserve every number exactly/);
  assert.equal(result.stats.current, 0);
});

test("checker rejects overlong, contaminated or generic localized descriptions", (context) => {
  const target = fixture(context);
  const longSource = "Descripción extensa.";
  const contaminatedSource = "Otra descripción.";
  const genericSource = "Descripción distintiva.";
  writeArea(target, [
    { producerId: "1", text: longSource },
    { producerId: "2", text: contaminatedSource },
    { producerId: "3", text: genericSource },
  ]);
  writeSidecar(target, [
    sidecarRow({
      producerId: "1",
      source: longSource,
      text: "a".repeat(501),
      origin: "reviewed",
    }),
    sidecarRow({
      producerId: "2",
      source: contaminatedSource,
      text: "<nav>Inici</nav> Descripció.",
      origin: "reviewed",
    }),
    sidecarRow({
      producerId: "3",
      source: genericSource,
      text: "Produces honey at its Abrera unit.",
      origin: "reviewed",
    }),
  ]);

  const result = audit(target);
  assert.ok(result.errors.some((error) => error.includes("at most 500 Unicode characters")));
  assert.ok(result.errors.some((error) => error.includes("contains HTML copied from a source page")));
  assert.ok(
    result.errors.some((error) =>
      error.includes("uses a shared template that only repeats structured producer fields"),
    ),
  );
});

test("an explicitly published locale requires a current complete sidecar", (context) => {
  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: "Descripción publicada." }]);

  const result = audit(target);
  assert.ok(result.errors.some((error) => error.includes("required translation sidecar is missing")));
  assert.equal(result.stats.missing, 1);
  assert.deepEqual(buildTranslationRemediationPlan(result.remediations), [
    {
      action: "generate",
      country: target.country,
      targetLocale: "ca",
      region: "region",
      area: "area",
      producerIds: ["1"],
      command: `npx pnpm generate:translations --country ${target.country} --target-locale ca --area area`,
    },
  ]);
});

test("reviewed translation remediation requires renewed review instead of generation", () => {
  assert.deepEqual(
    buildTranslationRemediationPlan([
      {
        action: "review",
        country: "es",
        targetLocale: "ca",
        region: "catalunya",
        area: "barcelona",
        producerId: "7",
      },
    ]),
    [
      {
        action: "review",
        country: "es",
        targetLocale: "ca",
        region: "catalunya",
        area: "barcelona",
        producerIds: ["7"],
        command: null,
      },
    ],
  );
});

test("a valid preparatory sidecar may be incomplete before its locale is published", (context) => {
  const target = fixture(context);
  fs.writeFileSync(
    path.join(target.csvRoot, target.country, "country.json"),
    `${JSON.stringify({
      i18n: { defaultLocale: "es", publishedLocales: ["es"] },
    }, null, 2)}\n`,
  );
  writeArea(target, [
    { producerId: "1", text: "Primera descripción." },
    { producerId: "2", text: "Segunda descripción." },
  ]);
  target.sidecarPath = path.join(target.csvRoot, target.country, "translations.de.csv");
  writeSidecar(target, [
    sidecarRow({ producerId: "1", source: "Primera descripción.", text: "Erste Beschreibung." }),
  ]);

  const result = audit(target);
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.missing, 0);
});

test("stale and missing rows block only areas that explicitly publish the target", (context) => {
  const target = fixture(context);
  const otherAreaPath = path.join(path.dirname(target.areaPath), "other.csv");
  writeArea(target, [{ producerId: "1", text: "Descripción del área publicada." }]);
  fs.writeFileSync(
    otherAreaPath,
    [
      "producer_id,descripcion,descripcion_locale",
      "2,Descripción preparatoria dos.,es",
      "3,Descripción preparatoria tres.,es",
      "",
    ].join("\n"),
  );
  const manifest = (publishOther: boolean) => ({
    i18n: { defaultLocale: "es", publishedLocales: ["es"] },
    regions: [
      {
        slug: "region",
        areas: [
          { slug: "area", i18n: { publishedLocales: ["es", "ca"] } },
          ...(publishOther
            ? [{ slug: "other", i18n: { publishedLocales: ["es", "ca"] } }]
            : []),
        ],
      },
    ],
  });
  fs.writeFileSync(
    path.join(target.csvRoot, target.country, "country.json"),
    `${JSON.stringify(manifest(false), null, 2)}\n`,
  );
  writeSidecar(target, [
    sidecarRow({
      producerId: "1",
      source: "Descripción del área publicada.",
      text: "Descripció de l'àrea publicada.",
    }),
    sidecarRow({
      producerId: "2",
      source: "Fuente anterior.",
      text: "Traducció preparatòria antiga.",
    }),
  ]);

  const preparatory = audit(target);
  assert.deepEqual(preparatory.errors, []);
  assert.ok(preparatory.notices.some((notice) => notice.includes("preparatory scope")));

  fs.writeFileSync(
    path.join(target.csvRoot, target.country, "country.json"),
    `${JSON.stringify(manifest(true), null, 2)}\n`,
  );
  const published = audit(target);
  assert.ok(published.errors.some((error) => error.includes("source_hash is stale")));
  assert.ok(published.errors.some((error) => error.includes("producer_id '3'")));
});

test("checker rejects missing, unsorted, duplicate, orphaned, cross-locale and stale-version rows", (context) => {
  const target = fixture(context);
  const sourceOne = "Descripción suficientemente larga 10.";
  const sourceTwo = "Segunda descripción suficientemente larga 20.";
  writeArea(target, [
    { producerId: "1", text: sourceOne },
    { producerId: "2", text: sourceTwo },
  ]);
  writeSidecar(target, [
    sidecarRow({
      producerId: "2",
      source: sourceTwo,
      sourceLocale: "en",
      text: "Segona descripció prou llarga 20.",
      origin: "invalid",
      promptVersion: "old-prompt",
      glossaryVersion: "old-glossary",
    }),
    sidecarRow({ producerId: "1", source: sourceOne, text: "Descripció prou llarga 10." }),
    sidecarRow({ producerId: "1", source: sourceOne, text: "Duplicada 10." }),
    sidecarRow({ producerId: "99", source: "Orphan", text: "Òrfena" }),
  ]);
  const result = audit(target);
  const joined = result.errors.join("\n");
  assert.match(joined, /strictly sorted/);
  assert.match(joined, /duplicate \(producer_id, field\)/);
  assert.match(joined, /origin must be 'machine' or 'reviewed'/);
  assert.match(joined, /prompt_version is stale/);
  assert.match(joined, /glossary_version is stale/);
  assert.match(joined, /source_locale is stale/);
  assert.match(joined, /obsolete machine translation row/);
});

test("checker enforces the exact dedicated header and path classification", (context) => {
  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: "Descripción." }]);
  fs.writeFileSync(target.sidecarPath, "producer_id,text\n1,Traducció\n");
  const result = audit(target);
  assert.ok(result.errors.some((error) => error.includes("expected exact translation header")));
  assert.equal(classifyCatalogCsvPath(target.csvRoot, target.sidecarPath).kind, "translation");
  assert.equal(
    classifyCatalogCsvPath(
      target.csvRoot,
      path.join(target.csvRoot, target.country, "region", "translations.ca.csv"),
    ).kind,
    "invalid-translation",
  );
});

test("the checked-in engine registry contains only production-approved contexts", () => {
  const registry = readTranslationEngineRegistry(
    path.resolve(process.cwd(), "data/reference/translation-engines.json"),
  );
  assert.equal(registry.schema_version, 1);
  assert.match(registry.registry_version, /^\d{4}-\d{2}-\d{2}\.\d+$/);
  assert.equal(registry.approved_engines.length, 1);
  assert.deepEqual(
    registry.approved_engines.map((entry: typeof FIXTURE_ENGINE_APPROVAL) => ({
      engine: entry.engine,
      model: entry.model,
      engine_version: entry.engine_version,
      prompt_version: entry.prompt_version,
      target_locales: entry.target_locales,
    })),
    [
      {
        engine: "codex-subagent",
        model: "gpt-5.6-sol",
        engine_version: "gpt-5.6-sol-2026-08-24",
        prompt_version: TRANSLATION_PROMPT_VERSION,
        target_locales: ["en", "es", "ca", "de", "ja"],
      },
    ],
  );
  assert.equal(
    registry.approved_engines[0].review.benchmark_initial_quantitative_integrity_failures,
    0,
  );
  assert.equal(
    registry.approved_engines[0].benchmark_plan_hash,
    "628a6d2896e12df6e663c717510dd27aaa4d8b67f76d735b140a8b01010ecc97",
  );
  assert.equal(
    registry.approved_engines[0].review.supplemental_benchmark_plan_hash,
    "c89ef7def09f4403ba6172973fb90dc711888ecde66d5387fee9b0a232261131",
  );
  assert.equal(
    registry.approved_engines[0].review.late_canonical_delta_quantitative_integrity_failures,
    0,
  );
});

test("checker rejects unapproved machine rows while reviewed rows remain portable", (context) => {
  const target = fixture(context);
  const source = "La cooperativa produce 12 botellas.";
  const translated = "La cooperativa produeix 12 ampolles.";
  writeArea(target, [{ producerId: "1", text: source }]);
  writeEngineRegistry(target, []);
  writeSidecar(target, [sidecarRow({ producerId: "1", source, text: translated })]);

  const rejected = audit(target);
  assert.equal(rejected.stats.unapproved, 1);
  assert.ok(rejected.errors.some((error) => error.includes("is not approved")));

  writeSidecar(target, [
    sidecarRow({ producerId: "1", source, text: translated, origin: "reviewed" }),
  ]);
  const reviewed = audit(target);
  assert.deepEqual(reviewed.errors, []);
  assert.equal(reviewed.stats.reviewed, 1);
  assert.equal(reviewed.stats.unapproved, 0);
});

test("generator rejects an unapproved adapter before provider calls or writes", async (context) => {
  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: "Produce miel desde 2020." }]);
  writeEngineRegistry(target, []);
  const adapter = createFixtureTranslationAdapter({
    translations: { "1:descripcion": "Produeix mel des de 2020." },
  });

  await assert.rejects(
    generateCatalogTranslations({
      country: target.country,
      targetLocale: "ca",
      adapter,
      csvRoot: target.csvRoot,
      glossaryPath: target.glossaryPath,
      engineRegistryPath: target.engineRegistryPath,
    }),
    /unapproved machine translation context/,
  );
  assert.equal(adapter.calls.length, 0);
  assert.equal(fs.existsSync(target.sidecarPath), false);
});

test("engine registry forbids ambiguous model mappings for a machine row context", (context) => {
  const target = fixture(context);
  writeEngineRegistry(target, [
    FIXTURE_ENGINE_APPROVAL,
    { ...FIXTURE_ENGINE_APPROVAL, model: "other-fixture-model" },
  ]);
  assert.throws(
    () => readTranslationEngineRegistry(target.engineRegistryPath),
    /duplicate engine\/version context/,
  );
});

test("omitted descripcion_locale is a direct canonical contract error", async (context) => {
  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: "Descripción sin locale." }], {
    omitDescriptionLocale: true,
  });
  const before = fs.readFileSync(target.areaPath, "utf8");
  const result = audit(target);
  assert.ok(result.errors.some((error) => error.includes("descripcion_locale")));
  assert.equal(fs.readFileSync(target.areaPath, "utf8"), before);

  const adapter = createFixtureTranslationAdapter({ translations: {} });
  await assert.rejects(
    generateCatalogTranslations({
      country: target.country,
      targetLocale: "ca",
      adapter,
      csvRoot: target.csvRoot,
      glossaryPath: target.glossaryPath,
      engineRegistryPath: target.engineRegistryPath,
    }),
    /Canonical catalog is invalid[\s\S]*descripcion_locale/,
  );
  assert.equal(adapter.calls.length, 0);
  assert.equal(fs.existsSync(target.sidecarPath), false);
  assert.equal(fs.readFileSync(target.areaPath, "utf8"), before);
});

test("generate --dry-run plans without a model, credentials, provider calls or writes", async (context) => {
  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: "Descripción para planificar 42." }]);

  const result = await generateCatalogTranslations({
    country: target.country,
    targetLocale: "ca",
    dryRun: true,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
  });
  assert.equal(result.pending, 1);
  assert.equal(result.estimatedCharacters > 0, true);
  assert.equal(result.providerConfigured, false);
  assert.equal(fs.existsSync(target.sidecarPath), false);

  const cleanEnvironment: NodeJS.ProcessEnv = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) => !key.startsWith("CHISAN_TRANSLATION_")),
    ),
    NODE_ENV: process.env.NODE_ENV ?? "test",
  };
  const command = spawnSync(
    process.execPath,
    [
      path.resolve(process.cwd(), "scripts/generate-catalog-translations.mjs"),
      "--country",
      target.country,
      "--target-locale",
      "ca",
      "--root",
      target.csvRoot,
      "--glossary",
      target.glossaryPath,
      "--engines",
      target.engineRegistryPath,
      "--dry-run",
    ],
    { encoding: "utf8", env: cleanEnvironment },
  );
  assert.equal(command.status, 0, command.stderr);
  assert.match(command.stdout, /provider: not configured/);
  assert.equal(fs.existsSync(target.sidecarPath), false);
});

test("readiness dry-run reports area/locale generation and publication states", (context) => {
  const target = fixture(context);
  const source = "La cooperativa produce 12 botellas.";
  writeArea(target, [{ producerId: "1", text: source }]);
  const options = {
    country: target.country,
    area: "area",
    targetLocale: "ca",
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
    specPath: path.resolve(process.cwd(), "data/reference/translation-benchmark.json"),
  };

  const pending = buildCatalogTranslationReadiness(options);
  assert.equal(pending.records.length, 1);
  assert.equal(pending.records[0].status, "ready_to_generate");
  assert.equal(pending.records[0].manifest_published, true);
  assert.equal(pending.records[0].required_sidecar_rows, 1);
  assert.equal(pending.records[0].missing, 1);

  writeSidecar(target, [
    sidecarRow({
      producerId: "1",
      source,
      text: "La cooperativa produeix 12 ampolles.",
    }),
  ]);
  const materialized = buildCatalogTranslationReadiness(options);
  assert.equal(materialized.records[0].status, "materialized");
  assert.equal(materialized.records[0].translation_ready, true);
  assert.equal(materialized.publication_readiness_evaluated, false);
  assert.match(materialized.publication_readiness_note, /does not prove complete dictionaries/);

  writeEngineRegistry(target, []);
  const unapproved = buildCatalogTranslationReadiness(options);
  assert.equal(unapproved.records[0].status, "unapproved_machine_rows");
  assert.equal(unapproved.records[0].unapproved_machine, 1);
  assert.equal(unapproved.records[0].translation_ready, false);
});

test("readiness covers every presentation locale, including canonical English and Spanish", (context) => {
  const target = fixture(context);
  writeArea(target, [{ producerId: "1", text: "Descripción canónica." }]);

  const report = buildCatalogTranslationReadiness({
    country: target.country,
    area: "area",
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
    specPath: path.resolve(process.cwd(), "data/reference/translation-benchmark.json"),
  });

  assert.deepEqual(report.presentation_locales, [
    ...SUPPORTED_TRANSLATION_TARGET_LOCALES,
  ]);
  assert.deepEqual(
    report.records.map((record) => record.target_locale),
    [...SUPPORTED_TRANSLATION_TARGET_LOCALES],
  );
  const english = report.records.find((record) => record.target_locale === "en");
  const spanish = report.records.find((record) => record.target_locale === "es");
  assert.ok(english);
  assert.ok(spanish);
  assert.equal(english.required_sidecar_rows, 1);
  assert.equal(english.missing, 1);
  assert.equal(english.translation_ready, false);
  assert.equal(spanish.required_sidecar_rows, 0);
  assert.equal(spanish.translation_ready, true);
  assert.equal(spanish.manifest_published, false);
  assert.equal(report.summary.records, SUPPORTED_TRANSLATION_TARGET_LOCALES.length);
  assert.equal(report.summary.translation_ready, 1);
});

test("changed mode selects a sidecar affected by a canonical area edit", (context) => {
  const target = fixture(context);
  const source = "Descripción.";
  writeArea(target, [{ producerId: "1", text: source }]);
  writeSidecar(target, [sidecarRow({ producerId: "1", source })]);
  const changedPath = `data/csv/${target.country}/region/area.csv`;
  const scope = resolveTranslationCheckScope({
    mode: "changed",
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
    repositoryRoot: target.root,
    changedPaths: [changedPath],
  });
  assert.deepEqual(scope.selectedSidecars, [target.sidecarPath]);
  assert.deepEqual(scope.canonicalChanges.get(changedPath), [target.sidecarPath]);
  assert.deepEqual(summarizeCanonicalChanges(scope.canonicalChanges, target.root), [
    {
      country: target.country,
      areaFileCount: 1,
      sidecars: [`data/csv/${target.country}/translations.ca.csv`],
    },
  ]);
});

test("generator reuses reviewed, replaces stale machine and prunes only obsolete machine rows", async (context) => {
  const target = fixture(context);
  const sourceOne = "La DOP Example produce 12 botellas.";
  const sourceTwo = "Cultiva frutas en la finca 2026.";
  writeArea(target, [
    { producerId: "1", text: sourceOne },
    { producerId: "2", text: sourceTwo },
  ]);
  const reviewed = sidecarRow({
    producerId: "1",
    source: sourceOne,
    text: "La DOP Example produeix 12 ampolles.",
    origin: "reviewed",
  });
  const obsoleteReviewed = sidecarRow({
    producerId: "98",
    source: "Old reviewed",
    text: "Revisada antiga",
    origin: "reviewed",
  });
  writeSidecar(target, [
    reviewed,
    sidecarRow({ producerId: "2", source: "Old source", text: "Màquina antiga" }),
    obsoleteReviewed,
    sidecarRow({ producerId: "99", source: "Old machine", text: "Obsoleta" }),
  ]);
  const adapter = createFixtureTranslationAdapter({
    translations: {
      "2:descripcion": "Cultiva fruita a la finca 2026.",
    },
  });
  const result = await generateCatalogTranslations({
    country: target.country,
    targetLocale: "ca",
    adapter,
    batchSize: 1,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
  });
  assert.equal(result.generated, 1);
  assert.equal(result.reusedReviewed, 1);
  assert.equal(result.prunedMachine, 1);
  assert.deepEqual(result.obsoleteReviewed, ["98"]);
  assert.equal(adapter.calls.length, 1);

  const rows = readTranslationSidecar(target.sidecarPath);
  assert.deepEqual(rows.find((row) => row.producer_id === "1"), reviewed);
  assert.deepEqual(rows.find((row) => row.producer_id === "98"), obsoleteReviewed);
  assert.equal(rows.some((row) => row.producer_id === "99"), false);
  assert.equal(rows.find((row) => row.producer_id === "2")?.text, "Cultiva fruita a la finca 2026.");
});

test("generator never reuses a current machine row that fails content validation", async (context) => {
  const target = fixture(context);
  const source = "La cooperativa produce 12 botellas de vino.";
  writeArea(target, [{ producerId: "1", text: source }]);
  writeSidecar(target, [sidecarRow({ producerId: "1", source, text: source })]);
  const adapter = createFixtureTranslationAdapter({
    translations: {
      "1:descripcion": "La cooperativa produeix 12 ampolles de vi.",
    },
  });

  const result = await generateCatalogTranslations({
    country: target.country,
    targetLocale: "ca",
    adapter,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
  });

  assert.equal(result.reusedMachine, 0);
  assert.equal(result.generated, 1);
  assert.equal(adapter.calls.length, 1);
  assert.equal(
    readTranslationSidecar(target.sidecarPath)[0].text,
    "La cooperativa produeix 12 ampolles de vi.",
  );
});

test("generator repairs only non-quantitative rejected entries as bounded singletons", async (context) => {
  const target = fixture(context);
  writeArea(target, [
    { producerId: "1", text: "La DOP Example produce 12 botellas." },
    { producerId: "2", text: "Cultiva frutas en la finca 2026." },
  ]);
  const adapter = createFixtureTranslationAdapter({
    handler: (request: {
      entries: Array<{ id: string }>;
      repair?: { previousText: string | null; validationError: string };
    }, callIndex: number) => {
      if (callIndex === 0) {
        assert.equal(request.entries.length, 2);
        return {
          translations: [
            { id: "1:descripcion", text: "La Example produeix 12 ampolles." },
            { id: "2:descripcion", text: "Cultiva fruita a la finca 2026." },
          ],
        };
      }
      assert.deepEqual(request.entries.map((entry) => entry.id), ["1:descripcion"]);
      assert.equal(request.repair?.previousText, "La Example produeix 12 ampolles.");
      assert.match(
        request.repair?.validationError ?? "",
        /preserve protected term 'DOP' exactly/,
      );
      return {
        translations: [
          { id: "1:descripcion", text: "La DOP Example produeix 12 ampolles." },
        ],
      };
    },
  });

  const result = await generateCatalogTranslations({
    country: target.country,
    targetLocale: "ca",
    adapter,
    batchSize: 2,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
  });

  assert.equal(result.generated, 2);
  assert.equal(result.repaired, 1);
  assert.equal(adapter.calls.length, 2);
  assert.deepEqual(
    readTranslationSidecar(target.sidecarPath).map((row) => row.text),
    [
      "La DOP Example produeix 12 ampolles.",
      "Cultiva fruita a la finca 2026.",
    ],
  );
});

test("numeric separator changes abort without repair or sidecar writes", async (context) => {
  const target = fixture(context);
  const source =
    "Elaboradors de fruits secs amb instal·lacions pròpies de 2.500m² a Can Aguilera.";
  writeArea(target, [{ producerId: "6291", text: source, locale: "ca" }]);
  const adapter = createFixtureTranslationAdapter({
    handler: (request: {
      repair?: { previousText: string | null; validationError: string };
    }) => {
      assert.equal(request.repair, undefined);
      return {
        translations: [
          { id: "6291:descripcion", text: "Can Aguileraに2,500m²の自社施設を持つナッツ加工業者。" },
        ],
      };
    },
  });

  await assert.rejects(
    generateCatalogTranslations({
      country: target.country,
      targetLocale: "ja",
      adapter,
      csvRoot: target.csvRoot,
      glossaryPath: target.glossaryPath,
      engineRegistryPath: target.engineRegistryPath,
    }),
    /preserve every number exactly/,
  );

  assert.equal(adapter.calls.length, 1);
  assert.equal(
    fs.existsSync(path.join(target.csvRoot, target.country, "translations.ja.csv")),
    false,
  );
});

test("numeric corruption takes priority over native-script repair alarms", async (context) => {
  const target = fixture(context);
  const source = "Family farm founded in 2020 near Delhi.";
  writeArea(target, [{ producerId: "7", text: source, locale: "en" }]);
  const adapter = createFixtureTranslationAdapter({
    handler: (request: {
      repair?: { previousText: string | null; validationError: string };
    }) => {
      assert.equal(request.repair, undefined);
      return {
        translations: [
          { id: "7:descripcion", text: "Family farm founded in 2021 near Delhi." },
        ],
      };
    },
  });

  await assert.rejects(
    generateCatalogTranslations({
      country: target.country,
      targetLocale: "hi",
      adapter,
      csvRoot: target.csvRoot,
      glossaryPath: target.glossaryPath,
      engineRegistryPath: target.engineRegistryPath,
    }),
    /preserve every number exactly/,
  );

  assert.equal(adapter.calls.length, 1);
  assert.equal(
    fs.existsSync(path.join(target.csvRoot, target.country, "translations.hi.csv")),
    false,
  );
});

test("quantitative marker changes abort without repair or sidecar writes", async (context) => {
  const target = fixture(context);
  writeArea(target, [
    {
      producerId: "4264",
      text: "Conservera que elabora el 100% de sus productos.",
      locale: "es",
    },
  ]);
  const adapter = createFixtureTranslationAdapter({
    handler: (request: {
      repair?: { previousText: string | null; validationError: string };
    }) => {
      assert.equal(request.repair, undefined);
      return {
        translations: [
          { id: "4264:descripcion", text: "Conservera que elabora el 100 dels seus productes." },
        ],
      };
    },
  });

  await assert.rejects(
    generateCatalogTranslations({
      country: target.country,
      targetLocale: "ca",
      adapter,
      csvRoot: target.csvRoot,
      glossaryPath: target.glossaryPath,
      engineRegistryPath: target.engineRegistryPath,
    }),
    /preserve ordered quantitative facts exactly/,
  );

  assert.equal(adapter.calls.length, 1);
  assert.equal(fs.existsSync(target.sidecarPath), false);
});

test("written ordinals rendered as digits abort without repair or sidecar writes", async (context) => {
  const target = fixture(context);
  const source =
    "Tercera generación de una familia agricultora dedicada al cultivo ecológico.";
  writeArea(target, [{ producerId: "1252", text: source, locale: "es" }]);
  const initial = "家族経営の農園で、3代にわたり有機栽培を続けています。";
  const adapter = createFixtureTranslationAdapter({
    handler: (request: {
      repair?: { previousText: string | null; validationError: string };
    }) => {
      assert.equal(request.repair, undefined);
      return { translations: [{ id: "1252:descripcion", text: initial }] };
    },
  });

  await assert.rejects(
    generateCatalogTranslations({
      country: target.country,
      targetLocale: "ja",
      adapter,
      csvRoot: target.csvRoot,
      glossaryPath: target.glossaryPath,
      engineRegistryPath: target.engineRegistryPath,
    }),
    /expected token multiset \[\]; received token multiset \[\["3",1\]\]/,
  );

  assert.equal(adapter.calls.length, 1);
  assert.equal(
    fs.existsSync(path.join(target.csvRoot, target.country, "translations.ja.csv")),
    false,
  );
});

test("unchanged source text fails closed after one repair and writes no sidecar", async (context) => {
  const target = fixture(context);
  const source = "La DOP Example produce 12 botellas.";
  writeArea(target, [{ producerId: "1", text: source }]);
  const adapter = createFixtureTranslationAdapter({
    handler: ({ entries }: { entries: Array<{ id: string }> }) => ({
      translations: entries.map((entry) => ({ id: entry.id, text: source })),
    }),
  });

  await assert.rejects(
    generateCatalogTranslations({
      country: target.country,
      targetLocale: "ca",
      adapter,
      csvRoot: target.csvRoot,
      glossaryPath: target.glossaryPath,
      engineRegistryPath: target.engineRegistryPath,
    }),
    /must not reproduce source text/,
  );
  assert.equal(adapter.calls.length, 2);
  assert.equal(fs.existsSync(target.sidecarPath), false);
});

test("stale reviewed rows are retained byte-for-field and never submitted", async (context) => {
  const target = fixture(context);
  const currentSource = "Descripción corregida 42.";
  writeArea(target, [{ producerId: "1", text: currentSource }]);
  const reviewed = sidecarRow({
    producerId: "1",
    source: "Descripción anterior 42.",
    text: "Descripció revisada 42.",
    origin: "reviewed",
  });
  writeSidecar(target, [reviewed]);
  const adapter = createFixtureTranslationAdapter({ translations: {} });
  const result = await generateCatalogTranslations({
    country: target.country,
    targetLocale: "ca",
    adapter,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
  });
  assert.deepEqual(result.staleReviewed, ["1"]);
  assert.equal(adapter.calls.length, 0);
  assert.deepEqual(readTranslationSidecar(target.sidecarPath), [reviewed]);
  assert.ok(audit(target).errors.some((error) => error.includes("source_hash is stale")));
});

test("reviewed rows remain current across prompt and glossary evolution", async (context) => {
  const target = fixture(context);
  const source = "Descripción revisada contra esta fuente 42.";
  writeArea(target, [{ producerId: "1", text: source }]);
  const reviewed = sidecarRow({
    producerId: "1",
    source,
    text: "Descripció revisada contra aquesta font 42.",
    origin: "reviewed",
    promptVersion: "historic-prompt-v1",
    glossaryVersion: "historic-glossary-v1",
  });
  writeSidecar(target, [reviewed]);

  const checked = audit(target);
  assert.deepEqual(checked.errors, []);
  assert.equal(checked.stats.reviewed, 1);
  const adapter = createFixtureTranslationAdapter({ translations: {} });
  const generated = await generateCatalogTranslations({
    country: target.country,
    targetLocale: "ca",
    adapter,
    csvRoot: target.csvRoot,
    glossaryPath: target.glossaryPath,
    engineRegistryPath: target.engineRegistryPath,
  });
  assert.equal(generated.reusedReviewed, 1);
  assert.deepEqual(generated.staleReviewed, []);
  assert.equal(adapter.calls.length, 0);
  assert.deepEqual(readTranslationSidecar(target.sidecarPath), [reviewed]);
});

test("batch validation rejects changed URLs, numbers, protected terms, ids and suspicious ratios", () => {
  const source = "La DOP Example produjo 12 lotes. https://example.test/item";
  assert.throws(
    () =>
      validateTranslationOutput({
        source,
        text: "La Example va produir 13 lots. https://other.test/item",
        targetLocale: "ca",
        protectedTerms: GLOSSARY.protectedTerms,
      }),
    /preserve every URL|preserve every number|protected term/,
  );
  assert.throws(
    () =>
      validateTranslationOutput({
        source: "Aquesta és una descripció prou llarga per validar la proporció.",
        text: "X",
        targetLocale: "ca",
        protectedTerms: [],
      }),
    /suspicious translation length ratio/,
  );
  assert.throws(
    () =>
      validateTranslationBatchResponse({
        entries: [{ id: "1:descripcion", sourceLocale: "es", text: source }],
        response: { translations: [{ id: "wrong", text: source }] },
        targetLocale: "ca",
        glossary: GLOSSARY,
      }),
    /unknown id/,
  );
  assert.throws(
    () =>
      validateTranslationBatchResponse({
        entries: [{ id: "1:descripcion", sourceLocale: "es", text: source }],
        response: { translations: [{ id: "1:descripcion", text: source }] },
        targetLocale: "ca",
        glossary: GLOSSARY,
      }),
    /must not reproduce source text/,
  );
});

test("openai-compatible adapter supports LM Studio defaults, JSON Schema and CHISAN-only credentials", async () => {
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  const adapter = createOpenAICompatibleAdapter({
    env: {
      CHISAN_TRANSLATION_MODEL: "local-model",
      CHISAN_TRANSLATION_ENGINE_VERSION: "local-model-q4",
      CHISAN_TRANSLATION_REASONING_EFFORT: "none",
      OPENAI_API_KEY: "must-not-be-read",
    } as unknown as NodeJS.ProcessEnv,
    fetchImpl: (async (url: string | URL | Request, init?: RequestInit) => {
      requestUrl = String(url);
      requestInit = init;
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    translations: [{ id: "1:descripcion", text: "La DOP Example produeix 12." }],
                  }),
                },
              },
            ],
          };
        },
      } as Response;
    }) as typeof fetch,
  });
  const response = await adapter.translate({
    systemPrompt: "Locked prompt",
    targetLocale: "ca",
    entries: [
      { id: "1:descripcion", sourceLocale: "es", text: "La DOP Example produce 12." },
    ],
    glossary: GLOSSARY,
    repair: {
      previousText: "Example produeix 12.",
      validationError: "translation must preserve protected term 'DOP' exactly",
    },
  });

  assert.equal(requestUrl, "http://127.0.0.1:1234/v1/chat/completions");
  assert.equal(adapter.engine, "openai-compatible");
  assert.equal(adapter.engineVersion, "local-model-q4");
  assert.equal((requestInit?.headers as Record<string, string>).authorization, undefined);
  const body = JSON.parse(String(requestInit?.body));
  assert.equal(body.reasoning_effort, "none");
  assert.equal(body.response_format.type, "json_schema");
  assert.equal(body.response_format.json_schema.strict, true);
  assert.deepEqual(body.response_format.json_schema.schema.required, ["translations"]);
  assert.equal(
    body.response_format.json_schema.schema.properties.translations.minItems,
    1,
  );
  assert.equal(
    body.response_format.json_schema.schema.properties.translations.maxItems,
    1,
  );
  assert.deepEqual(
    body.response_format.json_schema.schema.properties.translations.items.properties.id.enum,
    ["1:descripcion"],
  );
  assert.deepEqual(JSON.parse(body.messages[1].content).repair_context, {
    previous_text: "Example produeix 12.",
    validation_error: "translation must preserve protected term 'DOP' exactly",
  });
  assert.deepEqual(response, {
    translations: [{ id: "1:descripcion", text: "La DOP Example produeix 12." }],
  });
});

test("openai-compatible retries only 429 and 5xx with a bounded deterministic budget", async () => {
  const statuses = [429, 503, 200];
  const delays: number[] = [];
  let calls = 0;
  const adapter = createOpenAICompatibleAdapter({
    env: {
      NODE_ENV: "test",
      CHISAN_TRANSLATION_MODEL: "retry-model",
      CHISAN_TRANSLATION_MAX_RETRIES: "2",
      CHISAN_TRANSLATION_RETRY_BASE_MS: "7",
    } as NodeJS.ProcessEnv,
    fetchImpl: (async () => {
      const status = statuses[calls++];
      return {
        ok: status === 200,
        status,
        headers: { get: () => null },
        async json() {
          return {
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    translations: [{ id: "1:descripcion", text: "Text 12." }],
                  }),
                },
              },
            ],
          };
        },
      } as unknown as Response;
    }) as typeof fetch,
    sleepImpl: async (milliseconds: number) => {
      delays.push(milliseconds);
    },
  });
  const response = await adapter.translate({
    systemPrompt: "Prompt",
    targetLocale: "ca",
    entries: [{ id: "1:descripcion", sourceLocale: "es", text: "Texto 12." }],
    glossary: GLOSSARY,
  });
  assert.equal(calls, 3);
  assert.deepEqual(delays, [7, 14]);
  assert.equal(response.translations[0].id, "1:descripcion");

  for (const status of [400, 401, 403, 404, 422]) {
    let clientCalls = 0;
    let sleeps = 0;
    const clientAdapter = createOpenAICompatibleAdapter({
      env: {
        NODE_ENV: "test",
        CHISAN_TRANSLATION_MODEL: "client-error-model",
        CHISAN_TRANSLATION_MAX_RETRIES: "5",
        CHISAN_TRANSLATION_RETRY_BASE_MS: "0",
      } as NodeJS.ProcessEnv,
      fetchImpl: (async () => {
        clientCalls += 1;
        return { ok: false, status, headers: { get: () => null } } as unknown as Response;
      }) as typeof fetch,
      sleepImpl: async () => {
        sleeps += 1;
      },
    });
    await assert.rejects(
      clientAdapter.translate({
        systemPrompt: "Prompt",
        targetLocale: "ca",
        entries: [{ id: "1:descripcion", sourceLocale: "es", text: "Texto." }],
        glossary: GLOSSARY,
      }),
      new RegExp(`HTTP ${status}`),
    );
    assert.equal(clientCalls, 1);
    assert.equal(sleeps, 0);
  }
});

test("benchmark strata share an immutable quantitative fingerprint and exact written phrases", () => {
  const spec = readTranslationBenchmarkSpec(
    path.resolve(process.cwd(), "data/reference/translation-benchmark.json"),
  );
  const fingerprint = quantitativeFingerprint("Formato de 12 × 8 cm al 100%.");
  assert.equal(Object.isFrozen(fingerprint), true);
  assert.ok(fingerprint.every((fact) => Object.isFrozen(fact)));
  assert.ok(fingerprint.every((fact) => Object.isFrozen(fact.leading_markers)));
  assert.ok(fingerprint.every((fact) => Object.isFrozen(fact.trailing_markers)));

  const strataFor = (text: string) =>
    sourceBenchmarkStrata({ country: "es", producerName: "", text }, spec);
  assert.ok(strataFor("Formato de 12 × 8 cm.").includes("quantitative-context"));
  assert.ok(strataFor("Ingredientes 100% naturales.").includes("quantitative-context"));
  assert.ok(strataFor("Horario de 9:30.").includes("quantitative-context"));
  assert.equal(strataFor("Fundada en 2020.").includes("quantitative-context"), false);
  for (const phrase of spec.writtenNumberOrOrdinalPhrases) {
    assert.ok(
      strataFor(`Explotación familiar de ${phrase} dedicada al cultivo.`).includes(
        "written-number-or-ordinal",
      ),
      phrase,
    );
  }
  assert.equal(
    strataFor("A third generational business.").includes("written-number-or-ordinal"),
    false,
  );
});

test("benchmark spec requires unique non-empty written number phrases", (context) => {
  const canonicalPath = path.resolve(
    process.cwd(),
    "data/reference/translation-benchmark.json",
  );
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
  assert.equal(canonical.version, "2026-08-25.5");
  assert.deepEqual(canonical.writtenNumberOrOrdinalPhrases, [
    "tercera generación",
    "third generation",
    "third-generation",
    "tres generacions",
  ]);

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-benchmark-spec-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [index, phrases] of [
    [],
    [""],
    ["third generation", "Third Generation"],
  ].entries()) {
    const specPath = path.join(root, `invalid-${index}.json`);
    fs.writeFileSync(
      specPath,
      `${JSON.stringify({ ...canonical, writtenNumberOrOrdinalPhrases: phrases })}\n`,
    );
    assert.throws(
      () => readTranslationBenchmarkSpec(specPath),
      /writtenNumberOrOrdinalPhrases must contain unique non-empty strings/,
    );
  }
});

test("translation benchmark is deterministic, enforces 50 samples per target and stays unreviewed", async () => {
  const spec = readTranslationBenchmarkSpec(
    path.resolve(process.cwd(), "data/reference/translation-benchmark.json"),
  );
  const representativeCorpus = [
    {
      country: "es",
      producerName: "Celler MontClar",
      text: "La DOP Celler MontClar elabora sobrasada des de 1986 a l'Empordà.",
    },
    {
      country: "de",
      producerName: "Müller Hofbräu",
      text: "Müller Hofbräu stellt Käse seit 1890 her.",
    },
    {
      country: "jp",
      producerName: "Yamada Shuzo",
      text: "山田酒造 Yamada Shuzo makes sake in 1888.",
    },
  ];
  const ordinalBenchmarkId = "ja:us:1:descripcion";
  const sources = [
    {
      country: "us",
      producerName: "山田酒造",
      producerId: "1",
      sourceLocale: "gl",
      text: "山田酒造 elabora matcha de tercera generación amb calçot i façana für Straße.",
    },
    {
      country: "us",
      producerName: "Third Valley Dairy",
      producerId: "62",
      sourceLocale: "gl",
      text: "Third generation family dairy producing cheese.",
    },
    {
      country: "us",
      producerName: "Third Valley Orchard",
      producerId: "63",
      sourceLocale: "gl",
      text: "Third-generation family orchard growing apples.",
    },
    ...Array.from({ length: 60 }, (_, index) => ({
      ...representativeCorpus[index % representativeCorpus.length],
      producerId: String(index + 2),
      sourceLocale: "gl",
      text: `${representativeCorpus[index % representativeCorpus.length].text} Lot ${index + 1}.`,
    })),
  ];
  const first = buildTranslationBenchmarkPlan({ sources, spec, glossary: GLOSSARY });
  const second = buildTranslationBenchmarkPlan({ sources, spec, glossary: GLOSSARY });
  assert.deepEqual(second, first);
  assert.equal(first.review_status, "not_started");
  assert.match(first.plan_hash, /^[a-f0-9]{64}$/);
  const benchmarkTargets = Object.keys(spec.targets);
  for (const target of benchmarkTargets) {
    assert.equal(first.targets[target].length, 50);
    assert.equal(new Set(first.targets[target].map((sample) => sample.benchmark_id)).size, 50);
    for (const [stratum, minimum] of Object.entries(first.stratum_requirements)) {
      assert.equal(first.coverage[target][stratum] >= minimum, true, `${target}/${stratum}`);
    }
  }
  assert.ok(
    first.targets.ja.some((sample) => sample.benchmark_id === ordinalBenchmarkId),
    "the shared benchmark path must include the digit-free ordinal fixture",
  );

  const withoutJapaneseScript = sources.map((source) => ({
    ...source,
    text: source.text.replace("山田酒造 ", ""),
  }));
  assert.throws(
    () => buildTranslationBenchmarkPlan({ sources: withoutJapaneseScript, spec, glossary: GLOSSARY }),
    /cannot meet stratum 'japanese-script'/,
  );

  const adapter = createFixtureTranslationAdapter({
    handler: ({
      entries,
      targetLocale,
      repair,
    }: {
      entries: Array<{ id: string; text: string }>;
      targetLocale: string;
      repair?: { previousText: string | null; validationError: string };
    }) => {
      assert.equal(repair, undefined);
      const nativeScriptCharacter: Record<string, string> = {
        as: "ক",
        bn: "ক",
        gu: "ક",
        hi: "क",
        kn: "ಕ",
        kok: "क",
        ml: "ക",
        mr: "क",
        ne: "क",
        or: "କ",
        pa: "ਕ",
        ta: "க",
        te: "క",
      };
      return {
        translations: entries.map((entry) => ({
          id: entry.id,
          text: nativeScriptCharacter[targetLocale]
            ? entry.text
                .replaceAll("DOP", "\u0000\u0001\u0000")
                .replace(/[A-Za-z]/g, nativeScriptCharacter[targetLocale])
                .replaceAll("\u0000\u0001\u0000", "DOP")
            : `${targetLocale}: ${entry.text}`,
        })),
      };
    },
    engine: "fixture-benchmark",
    engineVersion: "fixture-benchmark-v1",
  });
  const candidates = await executeTranslationBenchmark({
    plan: first,
    adapter,
    glossary: GLOSSARY,
    spec,
    batchSize: 50,
  });
  assert.equal(candidates.review_status, "unreviewed");
  assert.equal(candidates.model, "fixture-model");
  assert.equal(adapter.calls.length, benchmarkTargets.length);
  assert.equal(
    Object.values(candidates.targets)
      .flat()
      .filter((candidate) => candidate.repair_attempted).length,
    0,
  );
  assert.match(
    candidates.targets.ja.find(({ benchmark_id }) => benchmark_id === ordinalBenchmarkId)?.text ?? "",
    /^ja: /,
  );
  for (const target of benchmarkTargets) {
    assert.equal(candidates.targets[target].length, 50);
    assert.ok(candidates.targets[target].every((candidate) => candidate.human_review === null));
  }
});
