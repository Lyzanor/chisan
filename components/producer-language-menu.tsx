"use client";

import { useSearchParams } from "next/navigation";
import { LanguageMenuRegistration, type LanguageMenuRegistrationOption } from "./language-menu-registration";
import { readCatalogQueryContext } from "@/lib/catalog-navigation";
import type { Locale } from "@/lib/i18n/locales";

export function ProducerLanguageMenu(props: {
  currentLocale: Locale; label: string; options: LanguageMenuRegistrationOption[];
}) {
  const search = useSearchParams();
  const context = readCatalogQueryContext({ category: search.getAll("category"), highlight: search.getAll("highlight") });
  const query = new URLSearchParams();
  if (context.category) query.set("category", context.category);
  if (context.highlight) query.set("highlight", String(context.highlight));
  return <LanguageMenuRegistration {...props} options={props.options.map((option) => ({
    ...option, href: `${option.href}${query.size ? `?${query}` : ""}`,
  }))} />;
}
