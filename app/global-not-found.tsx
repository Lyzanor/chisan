import type { Metadata } from "next";
import { headers } from "next/headers";

import { SiteRootShell } from "@/app/_components/site-root-shell";
import { buildCatalogHref } from "@/lib/catalog-navigation";
import { findArea, findCountry, listCountries, normalizeAreaSlug } from "@/lib/csv-catalog";
import { buildCatalogScope, parseCatalogScope } from "@/lib/i18n/catalog-scope";
import { loadMessages } from "@/lib/i18n/messages";
import { CHISAN_REQUEST_PATH_HEADER } from "@/lib/request-path";

function publishedParentHref(pathname: string, catalog: string) {
  const scope = parseCatalogScope(catalog, listCountries());
  if (!scope) return "/";

  const country = findCountry(scope.country);
  if (!country) return "/";

  const rawArea = pathname.split("/").filter(Boolean)[1] ?? "";
  const area = rawArea ? normalizeAreaSlug(country.slug, rawArea) : "";
  const areaOption = area ? findArea(country.slug, area) : null;
  const policy = areaOption ?? country;
  const locale = policy.publishedLocales.includes(scope.locale)
    ? scope.locale
    : policy.publishedLocales.includes(country.defaultLocale)
      ? country.defaultLocale
      : policy.publishedLocales[0];

  if (!locale) return "/";

  return buildCatalogHref({
    scope: buildCatalogScope(country, locale),
    area: areaOption?.slug,
  });
}

async function resolveNotFoundPresentation() {
  const pathname = (await headers()).get(CHISAN_REQUEST_PATH_HEADER) ?? "/";
  const catalog = pathname.split("/").filter(Boolean)[0] ?? "";
  const scope = parseCatalogScope(catalog, listCountries());
  const locale = scope?.locale ?? "en";
  const messages = await loadMessages(locale);

  return {
    backHref: publishedParentHref(pathname, catalog),
    htmlLang: scope?.htmlLang ?? "en",
    messages,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await resolveNotFoundPresentation();
  return {
    title: messages.notFound.title,
    description: messages.notFound.description,
  };
}

export default async function GlobalNotFoundPage() {
  const { backHref, htmlLang, messages } = await resolveNotFoundPresentation();

  return (
    <SiteRootShell
      htmlLang={htmlLang}
      footerMessages={messages.siteFooter}
      headerMessages={messages.siteHeader}
    >
      <main className="page-shell">
        <section className="panel">
          <h1>{messages.notFound.title}</h1>
          <p>{messages.notFound.description}</p>
          <a href={backHref} className="back-link">
            ← {messages.notFound.backToCatalog}
          </a>
        </section>
      </main>
    </SiteRootShell>
  );
}
