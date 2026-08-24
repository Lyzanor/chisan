import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { AreaSelector } from "@/components/area-selector";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  buildCatalogAlternateSet,
  buildLocalizedMetadata,
} from "@/lib/catalog-metadata";
import { buildCatalogHref, readCatalogQueryContext } from "@/lib/catalog-navigation";
import {
  isCanonicalCatalogSegment,
  resolveCountryCatalog,
  resolveKnownCatalogScope,
} from "@/lib/catalog-routing";
import { listCountrySlugs } from "@/lib/csv-catalog";
import { buildCatalogScope, resolveDestinationLocale } from "@/lib/i18n/catalog-scope";
import type { Locale } from "@/lib/i18n/locales";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";
import { SITE_NAME } from "@/lib/site";

type CountryPageProps = {
  params: Promise<{ catalog: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return listCountrySlugs().map((catalog) => ({ catalog }));
}

function capitalizeLabel(value: string, locale: Locale): string {
  return value.charAt(0).toLocaleUpperCase(locale) + value.slice(1);
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { catalog } = await params;
  const resolved = resolveCountryCatalog(catalog);

  if (!resolved) {
    const locale = resolveKnownCatalogScope(catalog)?.scope.locale ?? "en";
    const messages = await loadMessages(locale);
    return {
      title: formatMessage(messages.metadata.homeTitle, { site: SITE_NAME }),
    };
  }

  const { country, scope } = resolved;
  const locale = scope.locale;
  const messages = await loadMessages(locale);
  const countryLabel = country.labels[locale] ?? country.label;
  const unit = country.unitLabels[locale] ?? country.unit;
  const title = formatMessage(messages.metadata.countryTitle, {
    country: countryLabel,
    site: SITE_NAME,
  });
  const description = formatMessage(messages.metadata.countryDescription, {
    country: countryLabel,
    unit: unit.one,
  });

  return buildLocalizedMetadata({
    title,
    description,
    locale,
    alternates: buildCatalogAlternateSet(
      { kind: "country", country, localePolicy: country },
      locale,
    ),
  });
}

export default async function CountryPage({ params, searchParams }: CountryPageProps) {
  const [{ catalog }, query] = await Promise.all([params, searchParams]);
  const resolved = resolveCountryCatalog(catalog);

  if (!resolved) notFound();

  const { country, scope } = resolved;
  const catalogQuery = readCatalogQueryContext(query);

  if (!isCanonicalCatalogSegment(catalog, scope)) {
    permanentRedirect(buildCatalogHref({ scope, ...catalogQuery }));
  }

  const locale = scope.locale;
  const messages = await loadMessages(locale);
  const countryLabel = country.labels[locale] ?? country.label;
  const unit = country.unitLabels[locale] ?? country.unit;
  const localizedRegions = country.regions.map((region) => ({
    slug: region.slug,
    label: region.labels[locale] ?? region.label,
    areas: region.areas.map((area) => ({
      slug: area.slug,
      label: area.labels[locale] ?? area.label,
      href: buildCatalogHref({
        scope: buildCatalogScope(
          country,
          resolveDestinationLocale(area, { explicitLocale: scope.locale }),
        ),
        area: area.slug,
        category: catalogQuery.category,
      }),
    })),
  }));
  const languageOptions = await Promise.all(
    country.publishedLocales.map(async (targetLocale) => ({
      locale: targetLocale,
      label:
        targetLocale === locale
          ? messages.languageName
          : (await loadMessages(targetLocale)).languageName,
      href: buildCatalogHref({
        scope: buildCatalogScope(country, targetLocale),
        ...catalogQuery,
      }),
    })),
  );
  const selectorMessages = {
    label: capitalizeLabel(
      formatMessage(messages.areaSelector.label, { unit: unit.one }),
      locale,
    ),
    placeholder: formatMessage(messages.areaSelector.placeholder, { unit: unit.one }),
    submit: messages.areaSelector.submit,
  };

  return (
    <main className="catalog-start-page">
      <section className="catalog-start-shell" aria-labelledby="area-start-title">
        <div className="catalog-start-head">
          <div>
            <p className="catalog-kicker">
              <Link href="/" className="country-back-link">
                {SITE_NAME}
              </Link>{" "}
              · {countryLabel}
            </p>
            <h1 id="area-start-title">
              {formatMessage(messages.country.chooseUnit, { unit: unit.one })}
            </h1>
          </div>
          <div className="catalog-header-controls">
            <LanguageSwitcher
              currentLocale={locale}
              label={messages.languageSwitcher.label}
              options={languageOptions}
            />
            <AreaSelector
              country={{ regions: localizedRegions }}
              currentArea=""
              messages={selectorMessages}
            />
          </div>
        </div>

        <div className="region-group-list">
          {localizedRegions.map((region) => (
            <section
              key={region.slug}
              className="region-group-section"
              aria-labelledby={`region-group-${region.slug}`}
            >
              <h3 id={`region-group-${region.slug}`}>{region.label}</h3>
              <div className="area-link-list">
                {region.areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={area.href}
                    className="area-link"
                  >
                    {area.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
