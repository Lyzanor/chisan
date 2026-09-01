import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export const SUPPORTED_TRANSLATION_TARGET_LOCALES = Object.freeze([
  "en",
  "es",
  "ca",
  "de",
  "ja",
  "fr",
  "it",
  "nl",
  "pt",
  "af",
  "as",
  "bn",
  "cy",
  "ga",
  "gd",
  "gu",
  "haw",
  "hi",
  "kn",
  "kok",
  "ml",
  "mr",
  "ne",
  "nso",
  "or",
  "pa",
  "ss",
  "st",
  "ta",
  "te",
  "tn",
  "xh",
  "zu",
]);
export const SUPPORTED_TRANSLATION_TARGET_LOCALE_SET = new Set(
  SUPPORTED_TRANSLATION_TARGET_LOCALES,
);
export const SUPPORTED_DESCRIPTION_SOURCE_LOCALES = Object.freeze([
  ...SUPPORTED_TRANSLATION_TARGET_LOCALES,
  "gl",
  "eu",
]);
export const SUPPORTED_DESCRIPTION_SOURCE_LOCALE_SET = new Set(
  SUPPORTED_DESCRIPTION_SOURCE_LOCALES,
);
export const TRANSLATION_FIELD = "descripcion";
export const TRANSLATION_FIELD_SPECS = Object.freeze([
  Object.freeze({
    field: TRANSLATION_FIELD,
    localeField: "descripcion_locale",
    canonicalMaxCharacters: 400,
    translatedMaxCharacters: 500,
  }),
  Object.freeze({
    field: "quien hay detras",
    localeField: "quien_hay_detras_locale",
    canonicalMaxCharacters: 2000,
    translatedMaxCharacters: 2500,
  }),
  Object.freeze({
    field: "historia",
    localeField: "historia_locale",
    canonicalMaxCharacters: 4000,
    translatedMaxCharacters: 5000,
  }),
]);
export const TRANSLATION_FIELDS = Object.freeze(
  TRANSLATION_FIELD_SPECS.map(({ field }) => field),
);
export const TRANSLATION_FIELD_SET = new Set(TRANSLATION_FIELDS);
const TRANSLATION_FIELD_SPEC_BY_FIELD = new Map(
  TRANSLATION_FIELD_SPECS.map((spec) => [spec.field, spec]),
);

export function translationFieldSpec(field) {
  return TRANSLATION_FIELD_SPEC_BY_FIELD.get(field) ?? null;
}
export const TRANSLATION_SIDECAR_HEADER = Object.freeze([
  "producer_id",
  "field",
  "source_locale",
  "source_hash",
  "text",
  "origin",
  "engine",
  "engine_version",
  "prompt_version",
  "glossary_version",
]);
export const TRANSLATION_PROMPT_VERSION = "chisan-description-v10";
export const TRANSLATION_ENGINE_REGISTRY_SCHEMA_VERSION = 1;
export const TRANSLATION_QUANTITATIVE_FACT_REGISTRY = Object.freeze({
  version: "chisan-quantitative-facts-v3",
  modifiers: Object.freeze([
    "+/-",
    "±",
    "−",
    "⁻",
    "⁺",
    "–",
    "—",
    "+",
    "-",
    "~",
    "≈",
    "<",
    ">",
    "≤",
    "≥",
    "⁄",
  ]),
  operators: Object.freeze(["×", "/", ":"]),
  percentages: Object.freeze(["%", "％", "٪", "‰", "‱"]),
  currencies: Object.freeze([
    "EUR",
    "USD",
    "GBP",
    "JPY",
    "CNY",
    "KRW",
    "€",
    "$",
    "£",
    "¥",
    "￥",
    "₩",
    "₹",
    "₽",
    "₺",
    "₴",
    "₦",
    "₱",
    "฿",
    "₫",
    "₪",
    "₾",
    "₿",
  ]),
  units: Object.freeze([
    "m s.n.m.",
    "L/año",
    "MW/h",
    "kg/ha",
    "kg/Ha",
    "kg/HA",
    "kg/h",
    "kgrs.",
    "kgs",
    "msnm",
    "M2",
    "Has",
    "mt.",
    "Km",
    "Kg",
    "grs.",
    "gr.",
    "gr",
    "km²",
    "km2",
    "m²",
    "m2",
    "cm²",
    "cm2",
    "°C",
    "ºC",
    "° C",
    "º C",
    "°F",
    "ºF",
    "kWh",
    "kW",
    "mL",
    "ml",
    "cL",
    "cl",
    "dL",
    "dl",
    "hL",
    "hl",
    "kg",
    "mg",
    "km",
    "cm",
    "mm",
    "ha",
    "Ha",
    "Wh",
    "W",
    "L",
    "l",
    "g",
    "t",
    "m",
    "h",
    "min",
    "am",
    "pm",
    "k",
    "M",
    "s",
  ]),
});
export const TRANSLATION_SYSTEM_PROMPT = `You translate Chisan producer profile prose as factual catalog prose.
Return only the requested JSON object. Translate every entry into the requested target locale.
Do not add or omit facts, qualifications, products, dates, numbers or URLs. Do not make the prose promotional.
Preserve proper names, brands, appellations, protected terms, romanized identities, numbers and URLs exactly.
Never replace, translate, transliterate, normalize, duplicate or omit a Latin-script proper-name token or romanized place-name fragment, even when an equivalent name also appears in another script. Preserve its exact spelling and case in the target text.
Before writing, silently map each source clause into entities, products, processes, modifiers, relations and quantities, and preserve that map in the translation.
Treat every quantity as an indivisible tuple of value, sign or range or operator, unit or counter, counted entity and scope. Preserve every component and its attachment exactly. Do not merge a counter with the counted noun, change what is counted, or turn one described entity into two through coordination or agreement.
Resolve polysemous producer and facility terms from the products and processes named in context. Translate ordinary generic categories into the exact target-language generic category, even when capitalized in the source, but never narrow, broaden, split or replace them with a culturally adjacent category. If a culture-bound product has no exact established equivalent, retain its source term instead of guessing a familiar analogue.
Preserve the exact identity of every product, ingredient, input, production method, tool and facility. Never replace a regional product or process with a familiar analogue or weaken a specific method into a generic one.
Keep every adjective, participle, ownership marker and qualifier attached only to the same noun or coordinated items as in the source. Preserve singular and plural entity structure; do not redistribute modifiers for fluency.
Preserve temporal and spatial relations at the same precision and granularity. Do not widen, narrow or substitute time of day, frequency, duration, facing, adjacency, containment, origin or destination.
Write clear, idiomatic catalog prose in the target locale, including unambiguous standard weekday wording, but never improve fluency by changing the source fact map.
Preserve the order and exact association of every number with its sign, range modifier or quantitative operator, percentage or currency marker, and abbreviated measurement unit.
Never introduce a digit where the source contains none, and never spell out or otherwise transform a source digit. Translate written numbers, ordinals, generations and century wording with words or the target language's native lexical form rather than digits.
When source and target locales differ, translate the surrounding prose genuinely; do not echo the source text unchanged.
Input text may contain normalized line breaks in place of spreadsheet formatting artifacts; preserve the prose, not the artifact.
Keep one output for each input id and never invent ids.
Each text value must start and end with a non-whitespace character; do not add wrapping whitespace.`;
export const TRANSLATION_REPAIR_SYSTEM_PROMPT = `${TRANSLATION_SYSTEM_PROMPT}
You are repairing one rejected translation. Use the supplied previous_text and validation_error to correct only the defect.
Return exactly one output for the one trusted input id. The same preservation and target-language rules still apply.`;

const COUNTRY_PATTERN = /^[a-z]{2}$/;
const POSITIVE_ID_PATTERN = /^[1-9]\d*$/;
const TRANSLATION_FILE_PATTERN = /^translations\.([a-z]{2,3})\.csv$/;
const TRANSLATION_LIKE_PATTERN = /^translations\..*\.csv$/i;

export function normalizeTranslationSource(value) {
  return String(value).replace(/\r\n?/g, "\n").normalize("NFC");
}

// Excel serializes embedded carriage returns as the literal token `_x000d_`
// in a handful of imported descriptions. It is presentation noise rather than
// a catalog fact, so providers receive a real line break while source hashes
// continue to cover the canonical bytes above.
export function prepareTranslationPromptText(value) {
  return normalizeTranslationSource(value).replaceAll("_x000d_", "\n");
}

export function hashTranslationSource(value) {
  return crypto.createHash("sha256").update(normalizeTranslationSource(value), "utf8").digest("hex");
}

function multiset(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
}

function urls(value) {
  return value.match(/https?:\/\/[^\s<>"']+/gu) ?? [];
}

function numbers(value) {
  return value.match(/\p{N}+(?:[.,:/-]\p{N}+)*/gu) ?? [];
}

function orderedRegistryValues(values) {
  return [...values].sort((left, right) =>
    Array.from(right).length - Array.from(left).length ||
    (left < right ? -1 : left > right ? 1 : 0),
  );
}

const PREFIX_QUANTITATIVE_MARKERS = Object.freeze(
  orderedRegistryValues([
    ...TRANSLATION_QUANTITATIVE_FACT_REGISTRY.modifiers,
    ...TRANSLATION_QUANTITATIVE_FACT_REGISTRY.operators,
    ...TRANSLATION_QUANTITATIVE_FACT_REGISTRY.percentages,
    ...TRANSLATION_QUANTITATIVE_FACT_REGISTRY.currencies,
  ]),
);
const SUFFIX_QUANTITATIVE_MARKERS = Object.freeze(
  orderedRegistryValues([
    ...TRANSLATION_QUANTITATIVE_FACT_REGISTRY.percentages,
    ...TRANSLATION_QUANTITATIVE_FACT_REGISTRY.currencies,
  ]),
);
const QUANTITATIVE_UNITS = Object.freeze(
  orderedRegistryValues(TRANSLATION_QUANTITATIVE_FACT_REGISTRY.units),
);
const QUANTITATIVE_OPERATOR_SET = new Set(
  TRANSLATION_QUANTITATIVE_FACT_REGISTRY.operators,
);

function codePointBefore(value, index) {
  return Array.from(value.slice(0, index)).at(-1) ?? "";
}

function codePointAt(value, index) {
  return Array.from(value.slice(index))[0] ?? "";
}

function isRegistryWordContinuation(value) {
  return Boolean(value) && /[\p{Script=Latin}\p{N}_]/u.test(value);
}

function skipWhitespaceBackward(value, index) {
  let cursor = index;
  while (cursor > 0 && /\s/u.test(codePointBefore(value, cursor))) {
    cursor -= codePointBefore(value, cursor).length;
  }
  return cursor;
}

function skipWhitespaceForward(value, index) {
  let cursor = index;
  while (cursor < value.length && /\s/u.test(codePointAt(value, cursor))) {
    cursor += codePointAt(value, cursor).length;
  }
  return cursor;
}

function registryValueBefore(value, index, candidates) {
  for (const candidate of candidates) {
    const start = index - candidate.length;
    if (start < 0 || value.slice(start, index) !== candidate) continue;
    if (
      isRegistryWordContinuation(Array.from(candidate)[0]) &&
      isRegistryWordContinuation(codePointBefore(value, start))
    ) {
      continue;
    }
    return { start, value: candidate };
  }
  return null;
}

function registryValueAfter(value, index, candidates) {
  for (const candidate of candidates) {
    const end = index + candidate.length;
    if (value.slice(index, end) !== candidate) continue;
    if (isRegistryWordContinuation(Array.from(candidate).at(-1))) {
      const next = codePointAt(value, end);
      if (isRegistryWordContinuation(next)) continue;
      // Catalan and other Latin-language elisions can put an apostrophe after
      // a one-letter word (for example, `25% s'exporta`). Do not mistake that
      // leading `s` for the registered seconds unit.
      if (
        /['’ʼ]/u.test(next) &&
        isRegistryWordContinuation(codePointAt(value, end + next.length))
      ) {
        continue;
      }
    }
    return { end, value: candidate };
  }
  return null;
}

function leadingQuantitativeMarkers(value, index) {
  const markers = [];
  let cursor = skipWhitespaceBackward(value, index);
  while (cursor > 0) {
    const match = registryValueBefore(value, cursor, PREFIX_QUANTITATIVE_MARKERS);
    if (!match) break;
    if (QUANTITATIVE_OPERATOR_SET.has(match.value)) {
      const beforeOperator = skipWhitespaceBackward(value, match.start);
      if (!/\p{N}/u.test(codePointBefore(value, beforeOperator))) break;
    }
    markers.unshift(match.value);
    cursor = skipWhitespaceBackward(value, match.start);
  }
  return markers;
}

function trailingQuantitativeContext(value, index) {
  const markers = [];
  let cursor = skipWhitespaceForward(value, index);
  while (cursor < value.length) {
    const match = registryValueAfter(value, cursor, SUFFIX_QUANTITATIVE_MARKERS);
    if (!match) break;
    markers.push(match.value);
    cursor = skipWhitespaceForward(value, match.end);
  }
  let unit = registryValueAfter(value, cursor, QUANTITATIVE_UNITS)?.value ?? "";
  // A directly adjacent English `s` is ambiguous with a decade suffix (`80s`,
  // `1990s`). Chisan's canonical descriptions use every observed unspaced
  // number+s occurrence for a decade and use a separator for the seconds unit.
  // Require that separator for `s`; exact digits remain protected separately.
  if (unit === "s" && cursor === index) {
    unit = "";
  }
  return { markers, unit };
}

export function quantitativeFingerprint(value) {
  const fingerprint = [];
  for (const match of value.matchAll(/\p{N}+(?:[.,:/-]\p{N}+)*/gu)) {
    const start = match.index;
    const end = start + match[0].length;
    const trailing = trailingQuantitativeContext(value, end);
    fingerprint.push(Object.freeze({
      number: match[0],
      leading_markers: Object.freeze(leadingQuantitativeMarkers(value, start)),
      trailing_markers: Object.freeze(trailing.markers),
      unit: trailing.unit,
    }));
  }
  return Object.freeze(fingerprint);
}

function formatTokenMultiset(tokenMultiset) {
  return JSON.stringify(tokenMultiset);
}

function occurrences(value, term) {
  if (!term) return 0;
  let count = 0;
  let offset = 0;
  while ((offset = value.indexOf(term, offset)) !== -1) {
    count += 1;
    offset += term.length;
  }
  return count;
}

function significantLength(value) {
  return Array.from(value).filter((character) => !/\s/u.test(character)).length;
}

function comparableTranslationText(value) {
  return normalizeTranslationSource(String(value)).replace(/\s+/gu, " ").trim();
}

const TARGET_SCRIPT_PATTERN = Object.freeze({
  as: /\p{Script=Bengali}/u,
  bn: /\p{Script=Bengali}/u,
  gu: /\p{Script=Gujarati}/u,
  hi: /\p{Script=Devanagari}/u,
  kn: /\p{Script=Kannada}/u,
  kok: /\p{Script=Devanagari}/u,
  ml: /\p{Script=Malayalam}/u,
  mr: /\p{Script=Devanagari}/u,
  ne: /\p{Script=Devanagari}/u,
  or: /\p{Script=Oriya}/u,
  pa: /\p{Script=Gurmukhi}/u,
  ta: /\p{Script=Tamil}/u,
  te: /\p{Script=Telugu}/u,
});

function validateTargetScript(text, targetLocale, producerName = "") {
  const expectedScript = TARGET_SCRIPT_PATTERN[targetLocale];
  if (!expectedScript) return;
  const textWithoutProducerName = producerName
    ? text.split(producerName).join(" ")
    : text;
  const letters = Array.from(textWithoutProducerName).filter((character) =>
    /\p{L}/u.test(character),
  );
  if (letters.length < 12) return;
  const expectedLetters = letters.filter((character) => expectedScript.test(character)).length;
  const ratio = expectedLetters / letters.length;
  if (ratio < 0.4) {
    throw new Error(
      `translation for '${targetLocale}' has suspicious native-script coverage ${ratio.toFixed(2)}`,
    );
  }
}

/**
 * @param {{
 *   source: string,
 *   sourceLocale?: string | null,
 *   text: string,
 *   targetLocale: string,
 *   protectedTerms: readonly string[],
 *   producerName?: string,
 * }} options
 */
export function validateTranslationOutput({
  source,
  sourceLocale = null,
  text,
  targetLocale,
  protectedTerms,
  producerName = "",
}) {
  const preparedSource = prepareTranslationPromptText(source);
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("translation text must be non-empty");
  }
  if (text !== text.trim()) throw new Error("translation text must not have outer whitespace");
  if (
    sourceLocale &&
    sourceLocale !== targetLocale &&
    comparableTranslationText(preparedSource) === comparableTranslationText(text)
  ) {
    throw new Error(
      "translation must not reproduce source text when source and target locales differ",
    );
  }
  const expectedNumbers = multiset(numbers(preparedSource));
  const receivedNumbers = multiset(numbers(text));
  if (JSON.stringify(expectedNumbers) !== JSON.stringify(receivedNumbers)) {
    throw new Error(
      `translation must preserve every number exactly; expected token multiset ${formatTokenMultiset(expectedNumbers)}; received token multiset ${formatTokenMultiset(receivedNumbers)}`,
    );
  }
  const expectedQuantitativeFingerprint = quantitativeFingerprint(preparedSource);
  const receivedQuantitativeFingerprint = quantitativeFingerprint(text);
  if (
    JSON.stringify(expectedQuantitativeFingerprint) !==
    JSON.stringify(receivedQuantitativeFingerprint)
  ) {
    throw new Error(
      `translation must preserve ordered quantitative facts exactly under registry '${TRANSLATION_QUANTITATIVE_FACT_REGISTRY.version}'; expected ordered quantitative fingerprint ${JSON.stringify(expectedQuantitativeFingerprint)}; received ordered quantitative fingerprint ${JSON.stringify(receivedQuantitativeFingerprint)}`,
    );
  }
  if (
    JSON.stringify(multiset(urls(preparedSource))) !==
    JSON.stringify(multiset(urls(text)))
  ) {
    throw new Error("translation must preserve every URL exactly");
  }
  for (const term of protectedTerms) {
    const sourceCount = occurrences(preparedSource, term);
    if (sourceCount > 0 && occurrences(text, term) !== sourceCount) {
      throw new Error(`translation must preserve protected term '${term}' exactly`);
    }
  }
  validateTargetScript(text, targetLocale, producerName);

  const sourceLength = significantLength(preparedSource);
  const textLength = significantLength(text);
  if (sourceLength >= 20) {
    const ratio = textLength / sourceLength;
    const minimum = targetLocale === "ja" ? 0.08 : 0.2;
    if (ratio < minimum || ratio > 4) {
      throw new Error(`suspicious translation length ratio ${ratio.toFixed(2)}`);
    }
  }
}

export function translationPairKey(producerId, field = TRANSLATION_FIELD) {
  return `${producerId}\u0000${field}`;
}

export function compareProducerIds(left, right) {
  if (left === right) return 0;
  if (POSITIVE_ID_PATTERN.test(left) && POSITIVE_ID_PATTERN.test(right)) {
    const leftNumber = BigInt(left);
    const rightNumber = BigInt(right);
    return leftNumber < rightNumber ? -1 : 1;
  }
  return left.localeCompare(right);
}

export function compareTranslationRows(left, right) {
  return compareProducerIds(String(left.producer_id), String(right.producer_id)) ||
    String(left.field).localeCompare(String(right.field));
}

export function classifyCatalogCsvPath(csvRoot, filePath) {
  const relative = path.relative(path.resolve(csvRoot), path.resolve(filePath));
  if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return { kind: "outside", relative };
  }

  const parts = relative.split(path.sep);
  const basename = parts.at(-1);
  const sidecarMatch = TRANSLATION_FILE_PATTERN.exec(basename);

  if (parts.length === 2 && COUNTRY_PATTERN.test(parts[0]) && sidecarMatch) {
    return {
      kind: "translation",
      relative,
      country: parts[0],
      targetLocale: sidecarMatch[1],
    };
  }
  if (TRANSLATION_LIKE_PATTERN.test(basename)) {
    return { kind: "invalid-translation", relative };
  }
  if (
    parts.length === 3 &&
    COUNTRY_PATTERN.test(parts[0]) &&
    basename.endsWith(".csv")
  ) {
    return {
      kind: "area",
      relative,
      country: parts[0],
      region: parts[1],
      area: basename.slice(0, -4),
    };
  }
  return { kind: "unknown", relative };
}

export function walkCsvFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];

  for (const entry of fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const child = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walkCsvFiles(child));
    else if (entry.isFile() && entry.name.endsWith(".csv")) files.push(child);
  }
  return files.sort();
}

export function listCatalogCsvFiles(csvRoot) {
  const result = { areaFiles: [], sidecarFiles: [], invalidTranslationFiles: [], unknownCsvFiles: [] };
  for (const filePath of walkCsvFiles(csvRoot)) {
    const classification = classifyCatalogCsvPath(csvRoot, filePath);
    if (classification.kind === "area") result.areaFiles.push(filePath);
    else if (classification.kind === "translation") result.sidecarFiles.push(filePath);
    else if (classification.kind === "invalid-translation") result.invalidTranslationFiles.push(filePath);
    else result.unknownCsvFiles.push(filePath);
  }
  return result;
}

function configuredLocaleList(value, inherited) {
  if (value === undefined) return [...inherited];
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("i18n.publishedLocales must be a non-empty array");
  }
  const locales = [];
  for (const locale of value) {
    if (!SUPPORTED_TRANSLATION_TARGET_LOCALE_SET.has(locale)) {
      throw new Error(`unsupported published locale '${locale}'`);
    }
    if (locales.includes(locale)) throw new Error(`duplicate published locale '${locale}'`);
    locales.push(locale);
  }
  return locales;
}

// Every country manifest declares the publication policy consumed here.
export function readPublishedAreaLocales(csvRoot, country) {
  const manifestPath = path.join(csvRoot, country, "country.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`${manifestPath}: country manifest is required`);
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`${manifestPath}: ${error.message}`);
  }
  if (!Array.isArray(manifest?.i18n?.publishedLocales)) {
    throw new Error(`${manifestPath}: i18n.publishedLocales is required`);
  }

  const countryLocales = configuredLocaleList(manifest.i18n.publishedLocales, []);
  const declaredRegions = Array.isArray(manifest.regions) ? manifest.regions : [];
  const catalog = listCatalogCsvFiles(csvRoot);
  return catalog.areaFiles
    .filter((filePath) => classifyCatalogCsvPath(csvRoot, filePath).country === country)
    .map((filePath) => {
      const classification = classifyCatalogCsvPath(csvRoot, filePath);
      const region = declaredRegions.find((entry) => entry?.slug === classification.region);
      const regionLocales = configuredLocaleList(
        region?.i18n?.publishedLocales,
        countryLocales,
      );
      const areas = Array.isArray(region?.areas) ? region.areas : [];
      const area = areas.find((entry) => entry?.slug === classification.area);
      return {
        country,
        region: classification.region,
        area: classification.area,
        filePath,
        locales: configuredLocaleList(area?.i18n?.publishedLocales, regionLocales),
      };
    });
}

function parseCsvRecords(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  if (raw.startsWith("\uFEFF")) throw new Error(`${filePath}: UTF-8 BOM is not allowed`);

  let records;
  try {
    records = parse(raw, {
      bom: false,
      relax_column_count: false,
      skip_empty_lines: true,
    });
  } catch (error) {
    throw new Error(`${filePath}: ${error.message}`);
  }
  if (records.length === 0) throw new Error(`${filePath}: missing CSV header`);
  return { raw, records };
}

function recordObject(header, record) {
  return Object.fromEntries(header.map((column, index) => [column, String(record[index] ?? "")]));
}

export function readCanonicalCountry(csvRoot, country) {
  if (!COUNTRY_PATTERN.test(country)) throw new Error(`Invalid country '${country}'`);
  const catalog = listCatalogCsvFiles(csvRoot);
  const areaFiles = catalog.areaFiles.filter(
    (filePath) => classifyCatalogCsvPath(csvRoot, filePath).country === country,
  );
  const rows = [];
  const translationSources = [];
  const byId = new Map();
  const byKey = new Map();
  const errors = [];

  for (const filePath of areaFiles) {
    const classification = classifyCatalogCsvPath(csvRoot, filePath);
    let records;
    try {
      ({ records } = parseCsvRecords(filePath));
    } catch (error) {
      errors.push(error.message);
      continue;
    }

    const header = records[0].map(String);
    const producerIdIndex = header.indexOf("producer_id");
    const producerNameIndex = header.indexOf("nombre");
    const missingTranslationColumns = TRANSLATION_FIELD_SPECS.flatMap((spec) =>
      [spec.field, spec.localeField].filter((column) => !header.includes(column)),
    );
    if (producerIdIndex === -1 || missingTranslationColumns.length > 0) {
      errors.push(
        `${filePath}: area header must contain producer_id and translatable field columns${
          missingTranslationColumns.length > 0
            ? `; missing ${missingTranslationColumns.join(", ")}`
            : ""
        }`,
      );
      continue;
    }

    for (let index = 1; index < records.length; index += 1) {
      const record = records[index];
      const producerId = String(record[producerIdIndex] ?? "");
      const producerName =
        producerNameIndex === -1 ? "" : String(record[producerNameIndex] ?? "");
      const label = `${filePath}: record ${index + 1}`;
      if (!POSITIVE_ID_PATTERN.test(producerId)) {
        errors.push(`${label}: producer_id must be a positive decimal integer`);
        continue;
      }
      if (byId.has(producerId)) {
        errors.push(
          `${label}: producer_id '${producerId}' is duplicated in country '${country}'`,
        );
        continue;
      }

      for (const spec of TRANSLATION_FIELD_SPECS) {
        const text = String(record[header.indexOf(spec.field)] ?? "");
        const sourceLocale = String(record[header.indexOf(spec.localeField)] ?? "");
        if (!text && sourceLocale) {
          errors.push(`${label}: empty ${spec.field} requires empty ${spec.localeField}`);
        }
        if (text && !SUPPORTED_DESCRIPTION_SOURCE_LOCALE_SET.has(sourceLocale)) {
          errors.push(
            `${label}: non-empty ${spec.field} requires a supported ${spec.localeField}`,
          );
        }

        const source = {
          country,
          region: classification.region,
          area: classification.area,
          filePath,
          recordNumber: index + 1,
          producerId,
          producerName,
          field: spec.field,
          text,
          sourceLocale,
        };
        translationSources.push(source);
        byKey.set(translationPairKey(producerId, spec.field), source);
        if (spec.field === TRANSLATION_FIELD) {
          rows.push(source);
          byId.set(producerId, source);
        }
      }
    }
  }

  return {
    country,
    areaFiles,
    rows,
    byId,
    translationSources,
    byKey,
    errors,
  };
}

export function readTranslationGlossary(glossaryPath) {
  let glossary;
  try {
    glossary = JSON.parse(fs.readFileSync(glossaryPath, "utf8"));
  } catch (error) {
    throw new Error(`${glossaryPath}: ${error.message}`);
  }
  if (!glossary || typeof glossary !== "object" || Array.isArray(glossary)) {
    throw new Error(`${glossaryPath}: glossary must be a JSON object`);
  }
  if (typeof glossary.version !== "string" || !glossary.version.trim()) {
    throw new Error(`${glossaryPath}: version must be a non-empty string`);
  }
  if (
    !Array.isArray(glossary.protectedTerms) ||
    glossary.protectedTerms.some((term) => typeof term !== "string" || !term)
  ) {
    throw new Error(`${glossaryPath}: protectedTerms must contain non-empty strings`);
  }
  if (
    !glossary.localeInstructions ||
    typeof glossary.localeInstructions !== "object" ||
    Array.isArray(glossary.localeInstructions)
  ) {
    throw new Error(`${glossaryPath}: localeInstructions must be an object`);
  }
  return glossary;
}

const VERSION_TOKEN_PATTERN = /^[^\s\u0000-\u001f\u007f]+$/u;
const PLAN_HASH_PATTERN = /^[a-f0-9]{64}$/;

function requireVersionToken(value, field, registryPath) {
  if (typeof value !== "string" || !VERSION_TOKEN_PATTERN.test(value)) {
    throw new Error(`${registryPath}: ${field} must be a non-empty version token`);
  }
  return value;
}

export function readTranslationEngineRegistry(registryPath) {
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  } catch (error) {
    throw new Error(`${registryPath}: ${error.message}`);
  }
  if (!registry || typeof registry !== "object" || Array.isArray(registry)) {
    throw new Error(`${registryPath}: engine registry must be a JSON object`);
  }
  if (registry.schema_version !== TRANSLATION_ENGINE_REGISTRY_SCHEMA_VERSION) {
    throw new Error(
      `${registryPath}: schema_version must be ${TRANSLATION_ENGINE_REGISTRY_SCHEMA_VERSION}`,
    );
  }
  requireVersionToken(registry.registry_version, "registry_version", registryPath);
  if (!Array.isArray(registry.approved_engines)) {
    throw new Error(`${registryPath}: approved_engines must be an array`);
  }

  const seenContexts = new Set();
  for (let index = 0; index < registry.approved_engines.length; index += 1) {
    const entry = registry.approved_engines[index];
    const owner = `approved_engines[${index}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${registryPath}: ${owner} must be an object`);
    }
    for (const field of [
      "engine",
      "model",
      "engine_version",
      "prompt_version",
      "glossary_version",
      "benchmark_version",
    ]) {
      requireVersionToken(entry[field], `${owner}.${field}`, registryPath);
    }
    if (!PLAN_HASH_PATTERN.test(entry.benchmark_plan_hash ?? "")) {
      throw new Error(
        `${registryPath}: ${owner}.benchmark_plan_hash must be a lowercase SHA-256 digest`,
      );
    }
    if (
      !Array.isArray(entry.target_locales) ||
      entry.target_locales.length === 0 ||
      entry.target_locales.some(
        (locale) => !SUPPORTED_TRANSLATION_TARGET_LOCALE_SET.has(locale),
      )
    ) {
      throw new Error(
        `${registryPath}: ${owner}.target_locales must contain supported translation targets`,
      );
    }
    if (new Set(entry.target_locales).size !== entry.target_locales.length) {
      throw new Error(`${registryPath}: ${owner}.target_locales must not contain duplicates`);
    }
    const contextKey = [
      entry.engine,
      entry.engine_version,
      entry.prompt_version,
      entry.glossary_version,
    ].join("\u0000");
    if (seenContexts.has(contextKey)) {
      throw new Error(
        `${registryPath}: approved_engines contains a duplicate engine/version context`,
      );
    }
    seenContexts.add(contextKey);
  }
  return registry;
}

export function findApprovedTranslationEngine(
  registry,
  {
    engine,
    model = undefined,
    engineVersion,
    promptVersion,
    glossaryVersion,
    targetLocale,
  },
) {
  return registry.approved_engines.find(
    (entry) =>
      entry.engine === engine &&
      (model === undefined || entry.model === model) &&
      entry.engine_version === engineVersion &&
      entry.prompt_version === promptVersion &&
      entry.glossary_version === glossaryVersion &&
      entry.target_locales.includes(targetLocale),
  );
}

export function assertApprovedTranslationEngine(registry, context) {
  const approved = findApprovedTranslationEngine(registry, context);
  if (approved) return approved;
  const model = context.model ? `, model '${context.model}'` : "";
  throw new Error(
    `unapproved machine translation context: engine '${context.engine}'${model}, engine_version '${context.engineVersion}', target '${context.targetLocale}', prompt '${context.promptVersion}', glossary '${context.glossaryVersion}'`,
  );
}

export function readTranslationSidecar(filePath) {
  const { raw, records } = parseCsvRecords(filePath);
  if (raw.includes("\r")) throw new Error(`${filePath}: only LF line endings are allowed`);
  const header = records[0].map(String);
  if (
    header.length !== TRANSLATION_SIDECAR_HEADER.length ||
    header.some((column, index) => column !== TRANSLATION_SIDECAR_HEADER[index])
  ) {
    throw new Error(
      `${filePath}: expected exact translation header '${TRANSLATION_SIDECAR_HEADER.join(",")}'`,
    );
  }
  return records.slice(1).map((record) => recordObject(header, record));
}

export function serializeTranslationSidecar(rows) {
  return stringify([...rows].sort(compareTranslationRows), {
    header: true,
    columns: TRANSLATION_SIDECAR_HEADER,
    record_delimiter: "\n",
    eof: true,
  });
}

export function writeTranslationSidecarAtomic(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isSymbolicLink()) {
    throw new Error(`${filePath}: refusing to replace a symbolic link`);
  }
  const temporaryPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  try {
    fs.writeFileSync(temporaryPath, serializeTranslationSidecar(rows), { encoding: "utf8", flag: "wx" });
    fs.renameSync(temporaryPath, filePath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
}

export function isPositiveProducerId(value) {
  return POSITIVE_ID_PATTERN.test(String(value));
}
