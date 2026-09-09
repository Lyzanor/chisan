import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { NavigationLink } from "@/components/navigation-link";

import { LocationOnboarding } from "@/components/location-onboarding";
import { HomeSections } from "@/components/home-sections";
import {
  buildHomeAlternateSet,
  buildLocalizedMetadata,
} from "@/lib/catalog-metadata";
import {
  buildCatalogHref,
  MANUAL_AREA_SELECTION_ID,
} from "@/lib/catalog-navigation";
import {
  getLocalizedCatalogLabel,
  getLocalizedCatalogUnit,
  listPublishedCountries,
  listCountryProducers,
} from "@/lib/csv-catalog";
import {
  buildCatalogScope,
  EXPLICIT_LOCALE_COOKIE,
  parseAcceptLanguage,
  parseExplicitLocale,
  resolveDestinationLocale,
} from "@/lib/i18n/catalog-scope";
import type { Locale } from "@/lib/i18n/locales";
import {
  formatMessage,
  formatUnitCount,
  loadMessages,
  type Messages,
} from "@/lib/i18n/messages";
import { listEnabledLocationAreas } from "@/lib/location/enabled-location-areas.server";
import type { LocationOnboardingArea } from "@/lib/location/location-onboarding";
import {
  buildHomeStructuredData,
  serializeStructuredData,
} from "@/lib/site-structured-data";
import { SITE_NAME } from "@/lib/site";

const HOME_LOCALE = "es" as const;

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMessages(HOME_LOCALE);
  const title = formatMessage(messages.metadata.homeTitle, { site: SITE_NAME });
  const description = formatMessage(messages.metadata.homeDescription, {
    unit: "provincia",
  });

  return buildLocalizedMetadata({
    title,
    description,
    locale: HOME_LOCALE,
    alternates: buildHomeAlternateSet(),
  });
}

type Countries = ReturnType<typeof listPublishedCountries>;

function ProjectSummary({
  countries,
  messages,
  locationAreas,
  explicitLocale,
  browserLocales,
  producerCount,
}: {
  producerCount: number;
  countries: Countries;
  messages: Messages;
  locationAreas: readonly LocationOnboardingArea[];
  explicitLocale: Locale | null;
  browserLocales: Locale[];
}) {
  const localePreferences = { explicitLocale, browserLocales };
  const onlyCountry = countries.length === 1 ? countries[0] : null;
  const catalogTitle = onlyCountry
    ? getLocalizedCatalogLabel(onlyCountry, HOME_LOCALE)
    : messages.home.chooseCountry;

  return (
    <main className="catalog-start-page catalog-start-page--home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(buildHomeStructuredData()),
        }}
      />
      <section
        className="catalog-start-shell"
        aria-labelledby="home-summary-title"
      >
        <div className="catalog-start-head">
          <div>
            <p className="catalog-kicker">{messages.home.aboutKicker}</p>
            <h1 id="home-summary-title">{messages.siteHeader.tagline}</h1>
          </div>
        </div>
        <section className="home-catalog" aria-labelledby="country-start-title">
          <div className="catalog-start-head" id={MANUAL_AREA_SELECTION_ID}>
            <div>
              <p className="catalog-kicker">
                {messages.siteFooter.catalogLink}
              </p>
              <h2 id="country-start-title">{catalogTitle}</h2>
            </div>
          </div>
          <LocationOnboarding
            areas={locationAreas}
            messages={messages.locationOnboarding}
            explicitLocale={explicitLocale}
            browserLocales={browserLocales}
          />

          <div
            className={`country-card-list${
              onlyCountry ? " country-card-list--single" : ""
            }`}
          >
            {countries.map((country) => {
              const places = country.regions.reduce(
                (total, region) => total + region.areas.length,
                0,
              );
              const countryLabel = getLocalizedCatalogLabel(
                country,
                HOME_LOCALE,
              );
              const areaUnit = getLocalizedCatalogUnit(country, HOME_LOCALE);
              const regionUnit = getLocalizedCatalogUnit(
                country,
                HOME_LOCALE,
                "region",
              );
              const areaCount = formatUnitCount(
                HOME_LOCALE,
                places,
                areaUnit,
                messages.common.unitCount,
              );
              const regionCount = formatUnitCount(
                HOME_LOCALE,
                country.regions.length,
                regionUnit,
                messages.common.unitCount,
              );
              const destinationLocale = resolveDestinationLocale(
                country,
                localePreferences,
              );

              return (
                <NavigationLink
                  key={country.slug}
                  href={buildCatalogHref({
                    scope: buildCatalogScope(country, destinationLocale),
                  })}
                  className="country-card"
                >
                  <strong>{countryLabel}</strong>
                  <small>
                    {formatMessage(messages.home.countrySummary, {
                      areas: areaCount,
                      regions: regionCount,
                    })}
                  </small>
                  <ArrowUpRightIcon
                    className="country-card__arrow"
                    size={28}
                    aria-hidden="true"
                  />
                </NavigationLink>
              );
            })}
          </div>
        </section>
        <div className="home-story-intro">
          <p>
            Conoce a quienes producen lo que comes. Explora sus lugares, guarda
            tus favoritos y conecta directamente con ellos.
          </p>
        </div>
      </section>
      <HomeSections producerCount={producerCount} />
    </main>
  );
}

export default async function HomePage() {
  const countries = listPublishedCountries();
  const producerCount = (
    await Promise.all(
      countries.map((country) => listCountryProducers(country.slug)),
    )
  ).reduce((total, producers) => total + producers.length, 0);
  const locationAreas = listEnabledLocationAreas({
    countries,
    locale: HOME_LOCALE,
  });
  const [messages, cookieStore, requestHeaders] = await Promise.all([
    loadMessages(HOME_LOCALE),
    cookies(),
    headers(),
  ]);
  return (
    <ProjectSummary
      producerCount={producerCount}
      countries={countries}
      messages={messages}
      locationAreas={locationAreas}
      explicitLocale={parseExplicitLocale(
        cookieStore.get(EXPLICIT_LOCALE_COOKIE)?.value,
      )}
      browserLocales={parseAcceptLanguage(
        requestHeaders.get("accept-language"),
      )}
    />
  );
}
