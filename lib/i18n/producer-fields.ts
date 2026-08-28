import { getFieldLabel } from "../field-labels";
import { formatCategoryList, getCategoryLabel } from "./categories";
import {
  formatOnlineSales,
  formatSalesChannels,
  formatVerification,
} from "./controlled-values";
import {
  APPLICATION_DEFAULT_LOCALE,
  DESCRIPTION_SOURCE_LOCALES,
  getLocaleDisplayTag,
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

// These fields are omitted from the generic details table. Internal routing,
// identity and asset fields remain available to the page itself, while the
// expanded-profile component renders premium facts separately after checking
// the producer entitlement.
const GENERIC_TABLE_HIDDEN_FIELD_KEYS = new Set([
  "slug",
  "imagen",
  "producer_id",
  "verificacion",
  "descripcion_locale",
  "visitas guiadas",
  "mensaje a la comunidad",
  "mensaje_comunidad_locale",
  "enlace destacado 1",
  "enlace destacado 2",
]);

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
  displayLocale: Locale = APPLICATION_DEFAULT_LOCALE,
): string {
  const token = value.trim();
  if (!token) return messages.accountActions.descriptionLanguage.none;
  if (!hasDescriptionSourceLocale(token)) return value;

  return (
    messages.accountActions.descriptionLanguage.names[token] ??
    new Intl.DisplayNames([getLocaleDisplayTag(displayLocale)], { type: "language" }).of(token) ??
    token
  );
}

export function getDescriptionLocaleOptions(
  messages: Messages,
  displayLocale: Locale = APPLICATION_DEFAULT_LOCALE,
): DescriptionLocaleOption[] {
  return [
    { value: "", label: messages.accountActions.descriptionLanguage.none },
    ...DESCRIPTION_SOURCE_LOCALES.map((locale) => ({
      value: locale,
      label: formatDescriptionLocale(locale, messages, displayLocale),
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
  if (
    normalizedKey === "descripcion_locale" ||
    normalizedKey === "mensaje_comunidad_locale"
  ) {
    return formatDescriptionLocale(value, messages, locale);
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
    case "visitas guiadas":
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

export function presentProducerVerification(
  value: string,
  producerOwnershipVerified: boolean,
  locale: Locale,
  messages: Messages,
): ProducerFieldPresentation | null {
  const normalizedValue = value.trim();
  if (producerOwnershipVerified) {
    return {
      ...presentProducerField("verificacion", normalizedValue, locale, messages),
      displayValue: messages.accountActions.ownershipVerified,
    };
  }
  if (normalizedValue !== "pendiente") return null;
  return presentProducerField("verificacion", normalizedValue, locale, messages);
}

export function isPublicProducerField(key: string): boolean {
  return !GENERIC_TABLE_HIDDEN_FIELD_KEYS.has(normalizeFieldKey(key));
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
