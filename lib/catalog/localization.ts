import { parse } from "csv-parse/sync";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { hasDescriptionSourceLocale, type Locale } from "../i18n/locales";
import {
  TRANSLATABLE_PRODUCER_FIELDS,
  TRANSLATABLE_PRODUCER_FIELD_LOCALES,
  TRANSLATION_SIDECAR_HEADER,
  parseProducerTranslations,
  resolveLocalizedProducerField,
  type ProducerTranslation,
  type RawProducerTranslation,
} from "../i18n/translations";
import type { ProducerCsvRow } from "./producers";
const CSV_DATA_DIR = "data/csv";
const translationCache = new Map<string, Promise<ProducerTranslation[]>>();
function cleanCell(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}
export async function loadCountryTranslations(
  country: string,
  targetLocale: Locale,
): Promise<ProducerTranslation[]> {
  const countrySlug = cleanCell(country).toLowerCase();
  const cacheKey = `${countrySlug}/${targetLocale}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const pending = (async () => {
    const sidecarPath = path.resolve(
      process.cwd(),
      CSV_DATA_DIR,
      countrySlug,
      `translations.${targetLocale}.csv`,
    );
    let raw: string;
    try {
      raw = await readFile(sidecarPath, "utf8");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return [];
      }
      throw error;
    }
    if (raw.startsWith("\uFEFF"))
      throw new Error(`${sidecarPath}: UTF-8 BOM is not allowed`);
    if (raw.includes("\r"))
      throw new Error(`${sidecarPath}: only LF line endings are allowed`);
    const records = parse(raw, {
      bom: false,
      skip_empty_lines: true,
    }) as string[][];
    const header = records[0] ?? [];
    if (
      header.length !== TRANSLATION_SIDECAR_HEADER.length ||
      header.some(
        (column, index) => column !== TRANSLATION_SIDECAR_HEADER[index],
      )
    ) {
      throw new Error(
        `${sidecarPath}: expected exact translation header '${TRANSLATION_SIDECAR_HEADER.join(",")}'`,
      );
    }
    const rows = records.slice(1).map((record, index) => {
      if (record.length !== TRANSLATION_SIDECAR_HEADER.length) {
        throw new Error(
          `${sidecarPath}: record ${index + 2} has ${record.length} columns instead of ${TRANSLATION_SIDECAR_HEADER.length}`,
        );
      }
      return Object.fromEntries(
        TRANSLATION_SIDECAR_HEADER.map((column, columnIndex) => [
          column,
          record[columnIndex] ?? "",
        ]),
      ) as RawProducerTranslation;
    });
    return parseProducerTranslations(rows, targetLocale);
  })();
  translationCache.set(cacheKey, pending);
  void pending.catch(() => {
    if (translationCache.get(cacheKey) === pending)
      translationCache.delete(cacheKey);
  });
  return pending;
}

export function localizeProducerFields(
  rows: readonly ProducerCsvRow[],
  requestedLocale: Locale,
  translations: readonly ProducerTranslation[],
): ProducerCsvRow[] {
  const byProducer = indexProducerTranslations(translations);
  return rows.map((row) => {
    let localizedFields: Record<string, string> | null = null;
    for (const field of TRANSLATABLE_PRODUCER_FIELDS) {
      const localeField = TRANSLATABLE_PRODUCER_FIELD_LOCALES[field];
      const text = row.fields[field] ?? "";
      const sourceLocale = row.fields[localeField];
      if (!text) continue;
      if (!hasDescriptionSourceLocale(sourceLocale)) {
        localizedFields ??= { ...row.fields };
        localizedFields[field] = "";
        localizedFields[localeField] = "";
        continue;
      }

      const resolved = resolveLocalizedProducerField(
        {
          producerId: String(row.producerId),
          field,
          text,
          locale: sourceLocale,
        },
        requestedLocale,
        byProducer.get(row.producerId) ?? [],
      );
      const localizedText = resolved?.text ?? "";
      if (localizedText === text && sourceLocale === requestedLocale) continue;
      localizedFields ??= { ...row.fields };
      localizedFields[field] = localizedText;
      localizedFields[localeField] = resolved?.locale ?? "";
    }
    return localizedFields ? { ...row, fields: localizedFields } : row;
  });
}

export const localizeProducerDescriptions = localizeProducerFields;

const translationIndexes = new WeakMap<
  readonly ProducerTranslation[],
  ReadonlyMap<number, ProducerTranslation[]>
>();

/** Reuse a country's parsed translations across its areas and producer views. */
export function indexProducerTranslations(
  translations: readonly ProducerTranslation[],
): ReadonlyMap<number, ProducerTranslation[]> {
  const cached = translationIndexes.get(translations);
  if (cached) return cached;
  const index = new Map<number, ProducerTranslation[]>();
  for (const translation of translations) {
    const id = Number(translation.producerId);
    const group = index.get(id) ?? [];
    group.push(translation);
    index.set(id, group);
  }
  translationIndexes.set(translations, index);
  return index;
}

export function hasCurrentProducerProse(
  row: ProducerCsvRow,
  locale: Locale,
  translations: readonly ProducerTranslation[],
): boolean {
  return TRANSLATABLE_PRODUCER_FIELDS.every((field) => {
    const text = row.fields[field] ?? "";
    if (!text) return true;
    const sourceLocale = row.fields[TRANSLATABLE_PRODUCER_FIELD_LOCALES[field]];
    return (
      hasDescriptionSourceLocale(sourceLocale) &&
      Boolean(
        resolveLocalizedProducerField(
          {
            producerId: String(row.producerId),
            field,
            text,
            locale: sourceLocale,
          },
          locale,
          translations,
        ),
      )
    );
  });
}
