import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { LanguageMenuRegistration } from "@/components/language-menu-registration";
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
import {
  getLocalizedCatalogLabel,
  getLocalizedCatalogUnit,
  listPublishedCountries,
} from "@/lib/csv-catalog";
import { buildCatalogScope, resolveDestinationLocale } from "@/lib/i18n/catalog-scope";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";
import { SITE_NAME } from "@/lib/site";

type CountryPageProps = {
  params: Promise<{ catalog: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return listPublishedCountries().map(({ slug: catalog }) => ({ catalog }));
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
  const countryLabel = getLocalizedCatalogLabel(country, locale);
  const unit = getLocalizedCatalogUnit(country, locale);
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
  const countryLabel = getLocalizedCatalogLabel(country, locale);
  const unit = getLocalizedCatalogUnit(country, locale);
  const localizedRegions = country.regions.map((region) => {
    const regionLocale = resolveDestinationLocale(region, {
      explicitLocale: scope.locale,
    });
    return {
      slug: region.slug,
      label: getLocalizedCatalogLabel(region, regionLocale),
      areas: region.areas.map((area) => {
        const destinationLocale = resolveDestinationLocale(area, {
          explicitLocale: scope.locale,
        });
        return {
          slug: area.slug,
          label: getLocalizedCatalogLabel(area, destinationLocale),
          href: buildCatalogHref({
            scope: buildCatalogScope(country, destinationLocale),
            area: area.slug,
            category: catalogQuery.category,
          }),
        };
      }),
    };
  });
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
  return (
    <main className="catalog-start-page catalog-start-page--country">
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
        </div>

        <LanguageMenuRegistration
          currentLocale={locale}
          label={messages.languageSwitcher.label}
          options={languageOptions}
        />

        <div className="region-group-list">
          {localizedRegions.map((region) => (
            <section
              key={region.slug}
              className="region-group-section"
              aria-labelledby={`region-group-${region.slug}`}
            >
              <h2 id={`region-group-${region.slug}`}>{region.label}</h2>
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
