import "server-only";

import { headers } from "next/headers";

import { buildCatalogHref } from "./catalog-navigation";
import {
  findArea,
  findPublishedCountry,
  listPublishedCountries,
  normalizeAreaSlug,
} from "./csv-catalog";
import { buildCatalogScope, parseCatalogScope } from "./i18n/catalog-scope";
import { loadMessages } from "./i18n/messages";
import { CHISAN_REQUEST_PATH_HEADER } from "./request-path";

function publishedParentHref(pathname: string, catalog: string) {
  const scope = parseCatalogScope(catalog, listPublishedCountries());
  if (!scope) return "/";

  const country = findPublishedCountry(scope.country);
  if (!country) return "/";

  const rawArea = pathname.split("/").filter(Boolean)[1] ?? "";
  const area = rawArea ? normalizeAreaSlug(country.slug, rawArea) : "";
  const areaOption = area ? findArea(country.slug, area) : null;
  const policy = areaOption ?? country;
  const locale = policy.publishedLocales.includes(scope.locale)
    ? scope.locale
    : country.defaultLocale;

  return buildCatalogHref({
    scope: buildCatalogScope(country, locale),
    area: areaOption?.slug,
  });
}

export async function loadNotFoundPresentation() {
  const pathname = (await headers()).get(CHISAN_REQUEST_PATH_HEADER) ?? "/";
  const catalog = pathname.split("/").filter(Boolean)[0] ?? "";
  const scope = parseCatalogScope(catalog, listPublishedCountries());
  const locale = scope?.locale ?? "en";
  const messages = await loadMessages(locale);

  return {
    backHref: publishedParentHref(pathname, catalog),
    htmlLang: scope?.htmlLang ?? "en",
    messages,
  };
}
