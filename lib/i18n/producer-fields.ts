import { getFieldLabel } from "../field-labels";
import { formatCategoryList, getCategoryLabel } from "./categories";
import {
  formatOnlineSales,
  formatSalesChannels,
  formatVerification,
} from "./controlled-values";
import {
  DESCRIPTION_SOURCE_LOCALES,
  hasDescriptionSourceLocale,
  type DescriptionSourceLocale,
  type Locale,
} from "./locales";
import type { Messages } from "./messages";

export type ProducerFieldPresentation = Readonly<{
  key: string;
  value: string;
  label: string;
  displayValue: string;
}>;

export type DescriptionLocaleOption = Readonly<{
  value: "" | DescriptionSourceLocale;
  label: string;
}>;

function normalizeFieldKey(key: string): string {
  return key
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function pipeTokens(value: string): string[] {
  return value
    .split("|")
    .map((token) => token.trim())
    .filter(Boolean);
}

export function formatDescriptionLocale(
  value: string,
  messages: Messages,
): string {
  const token = value.trim();
  if (!token) return messages.accountActions.descriptionLanguage.none;
  return hasDescriptionSourceLocale(token)
    ? messages.accountActions.descriptionLanguage.names[token]
    : value;
}

export function getDescriptionLocaleOptions(
  messages: Messages,
): DescriptionLocaleOption[] {
  return [
    { value: "", label: messages.accountActions.descriptionLanguage.none },
    ...DESCRIPTION_SOURCE_LOCALES.map((locale) => ({
      value: locale,
      label: messages.accountActions.descriptionLanguage.names[locale],
    })),
  ];
}

export function formatProducerFieldLabel(
  key: string,
  locale: Locale,
  messages: Messages,
): string {
  return getFieldLabel(key, messages.fieldLabels, locale);
}

export function formatProducerFieldValue(
  key: string,
  value: string,
  locale: Locale,
  messages: Messages,
): string {
  const normalizedKey = normalizeFieldKey(key);
  if (normalizedKey === "descripcion_locale") {
    return formatDescriptionLocale(value, messages);
  }
  if (!value) return messages.common.unavailable;

  switch (normalizedKey) {
    case "categoria":
      return getCategoryLabel(value, locale);
    case "categorias adicionales": {
      const categories = pipeTokens(value);
      return categories.length > 0
        ? formatCategoryList(categories, locale)
        : messages.common.unavailable;
    }
    case "verificacion":
      return formatVerification(value, messages.controlledValues);
    case "venta online":
      return formatOnlineSales(value, messages.controlledValues);
    case "canal de venta":
      return formatSalesChannels(value, locale, messages.controlledValues);
    default:
      return value;
  }
}

export function presentProducerField(
  key: string,
  value: string,
  locale: Locale,
  messages: Messages,
): ProducerFieldPresentation {
  return {
    key,
    value,
    label: formatProducerFieldLabel(key, locale, messages),
    displayValue: formatProducerFieldValue(key, value, locale, messages),
  };
}

export function isPublicProducerField(key: string): boolean {
  return normalizeFieldKey(key) !== "descripcion_locale";
}

export function presentPublicProducerFields(
  fields: Readonly<Record<string, string>>,
  locale: Locale,
  messages: Messages,
): ProducerFieldPresentation[] {
  return Object.entries(fields)
    .filter(([key]) => isPublicProducerField(key))
    .map(([key, value]) => presentProducerField(key, value, locale, messages));
}
