import categoriesRegistry from "@/data/reference/categories.json";

import { getLocaleDisplayTag, type Locale } from "./locales";

type CategoryRegistry = {
  categories: string[];
  labels: Record<string, Record<Locale, string>>;
  icons: Record<string, string>;
};

const registry = categoriesRegistry as CategoryRegistry;
const FALLBACK_ICON = registry.icons.Otros ?? "🧺";

export type CategoryPresentation = {
  token: string;
  label: string;
  icon: string;
};

export function getCategoryLabel(token: string, locale: Locale): string {
  const labels = registry.labels[token];
  return labels?.[locale] ?? labels?.en ?? token;
}

export function getCategoryIcon(token: string): string {
  return registry.icons[token] ?? FALLBACK_ICON;
}

export function getCategoryPresentation(
  token: string,
  locale: Locale,
): CategoryPresentation {
  return {
    token,
    label: getCategoryLabel(token, locale),
    icon: getCategoryIcon(token),
  };
}

export function formatCategoryList(
  categories: readonly string[],
  locale: Locale,
): string {
  return new Intl.ListFormat(getLocaleDisplayTag(locale), {
    style: "long",
    type: "conjunction",
  }).format(categories.map((category) => getCategoryLabel(category, locale)));
}
