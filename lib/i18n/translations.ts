import { TRANSLATABLE_FIELD_SPECS } from "../catalog/producer-schema";
import { createHash } from "node:crypto";

import {
  hasDescriptionSourceLocale,
  type DescriptionSourceLocale,
  type Locale,
} from "./locales";

export const TRANSLATABLE_DESCRIPTION_FIELD = "descripcion" as const;
export const TRANSLATABLE_PRODUCER_FIELDS = TRANSLATABLE_FIELD_SPECS.map(({ field }) => field);
export type TranslatableProducerField = (typeof TRANSLATABLE_FIELD_SPECS)[number]["field"];
export const TRANSLATABLE_PRODUCER_FIELD_LOCALES = Object.fromEntries(
  TRANSLATABLE_FIELD_SPECS.map(({ field, localeField }) => [field, localeField]),
) as Record<TranslatableProducerField, string>;

const TRANSLATABLE_PRODUCER_FIELD_SET = new Set<string>(TRANSLATABLE_PRODUCER_FIELDS);

export const TRANSLATION_SIDECAR_HEADER = [
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
] as const;

export type TranslationOrigin = "machine" | "reviewed";

export type ProducerTranslationSource = {
  producerId: string;
  field: TranslatableProducerField;
  text: string;
  locale: DescriptionSourceLocale;
};

export type DescriptionSource = Omit<ProducerTranslationSource, "field">;

export type ProducerTranslation = {
  producerId: string;
  field: TranslatableProducerField;
  targetLocale: Locale;
  sourceLocale: DescriptionSourceLocale;
  sourceHash: string;
  text: string;
  origin: TranslationOrigin;
  engine: string;
  engineVersion: string;
  promptVersion: string;
  glossaryVersion: string;
};

export type DescriptionTranslation = ProducerTranslation;

export type ResolvedTranslation = {
  text: string;
  locale: Locale;
  origin: "canonical" | TranslationOrigin;
};

export type ResolvedDescription = ResolvedTranslation;

export type RawProducerTranslation = Record<
  (typeof TRANSLATION_SIDECAR_HEADER)[number],
  string
>;

export type RawDescriptionTranslation = RawProducerTranslation;

export function isTranslatableProducerField(value: string): value is TranslatableProducerField {
  return TRANSLATABLE_PRODUCER_FIELD_SET.has(value);
}

export function normalizeTranslationSource(value: string): string {
  return value.replace(/\r\n?/g, "\n").normalize("NFC");
}

export function hashTranslationSource(value: string): string {
  return createHash("sha256").update(normalizeTranslationSource(value), "utf8").digest("hex");
}

export function parseProducerTranslations(
  rows: readonly RawProducerTranslation[],
  targetLocale: Locale,
): ProducerTranslation[] {
  const seen = new Set<string>();

  return rows.map((row, index) => {
    const record = index + 2;
    const fail = (message: string): never => {
      throw new Error(`translation sidecar record ${record}: ${message}`);
    };
    if (!/^[1-9]\d*$/.test(row.producer_id)) fail("producer_id must be a positive integer");
    const field = isTranslatableProducerField(row.field)
      ? row.field
      : fail(`field must be one of: ${TRANSLATABLE_PRODUCER_FIELDS.join(", ")}`);
    const sourceLocale: DescriptionSourceLocale = hasDescriptionSourceLocale(
      row.source_locale,
    )
      ? row.source_locale
      : fail("source_locale is not supported");
    if (!/^[a-f0-9]{64}$/.test(row.source_hash)) fail("source_hash must be lowercase SHA-256");
    if (!row.text) fail("text must be non-empty");
    if (row.text !== row.text.normalize("NFC")) fail("text must use Unicode NFC");
    const origin: TranslationOrigin =
      row.origin === "machine" || row.origin === "reviewed"
        ? row.origin
        : fail("origin must be 'machine' or 'reviewed'");
    for (const key of [
      "engine",
      "engine_version",
      "prompt_version",
      "glossary_version",
    ] as const) {
      if (!row[key] || /\s|[\u0000-\u001f\u007f]/u.test(row[key])) {
        fail(`${key} must be a non-empty version token`);
      }
    }
    const pair = `${row.producer_id}\u0000${field}`;
    if (seen.has(pair)) fail("duplicate (producer_id, field) row");
    seen.add(pair);

    return {
      producerId: row.producer_id,
      field,
      targetLocale,
      sourceLocale,
      sourceHash: row.source_hash,
      text: row.text,
      origin,
      engine: row.engine,
      engineVersion: row.engine_version,
      promptVersion: row.prompt_version,
      glossaryVersion: row.glossary_version,
    };
  });
}

// Compatibility name retained for description-only callers. The sidecar parser
// now accepts every contract-owned translatable producer field.
export const parseDescriptionTranslations = parseProducerTranslations;

export function isCurrentProducerTranslation(
  source: ProducerTranslationSource,
  translation: ProducerTranslation,
): boolean {
  return (
    translation.producerId === source.producerId &&
    translation.field === source.field &&
    translation.sourceLocale === source.locale &&
    translation.sourceHash === hashTranslationSource(source.text)
  );
}

export function isCurrentDescriptionTranslation(
  source: DescriptionSource,
  translation: DescriptionTranslation,
): boolean {
  return isCurrentProducerTranslation(
    { ...source, field: TRANSLATABLE_DESCRIPTION_FIELD },
    translation,
  );
}

export function resolveLocalizedProducerField(
  source: ProducerTranslationSource,
  requestedLocale: Locale,
  translations: readonly ProducerTranslation[],
): ResolvedTranslation | null {
  if (!source.text) return null;
  if (source.locale === requestedLocale) {
    return { text: source.text, locale: requestedLocale, origin: "canonical" };
  }

  const current = translations
    .filter(
      (translation) =>
        translation.targetLocale === requestedLocale &&
        translation.text.length > 0 &&
        isCurrentProducerTranslation(source, translation),
    )
    .sort((left, right) => Number(right.origin === "reviewed") - Number(left.origin === "reviewed"));

  const translation = current[0];
  if (!translation) return null;
  return {
    text: translation.text,
    locale: requestedLocale,
    origin: translation.origin,
  };
}

export function resolveLocalizedDescription(
  source: DescriptionSource,
  requestedLocale: Locale,
  translations: readonly DescriptionTranslation[],
): ResolvedDescription | null {
  return resolveLocalizedProducerField(
    { ...source, field: TRANSLATABLE_DESCRIPTION_FIELD },
    requestedLocale,
    translations,
  );
}
