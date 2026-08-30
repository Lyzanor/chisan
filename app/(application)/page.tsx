import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";

import { LocationOnboarding } from "@/components/location-onboarding";
import {
  buildHomeAlternateSet,
  buildLocalizedMetadata,
} from "@/lib/catalog-metadata";
import {
  buildCatalogHref,
  MANUAL_AREA_SELECTION_ID,
} from "@/lib/catalog-navigation";
import {
  CATALOG_UNIT,
  getLocalizedCatalogLabel,
  getLocalizedCatalogUnit,
  listPublishedCountries,
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
import { SITE_NAME } from "@/lib/site";

const HOME_LOCALE = "en" as const;

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMessages(HOME_LOCALE);
  const title = formatMessage(messages.metadata.homeTitle, { site: SITE_NAME });
  const description = formatMessage(messages.metadata.homeDescription, {
    unit: CATALOG_UNIT.one,
  });

  return buildLocalizedMetadata({
    title,
    description,
    locale: HOME_LOCALE,
    alternates: buildHomeAlternateSet(),
  });
}

type Countries = ReturnType<typeof listPublishedCountries>;

function CountryStart({
  countries,
  messages,
  locationAreas,
  explicitLocale,
  browserLocales,
}: {
  countries: Countries;
  messages: Messages;
  locationAreas: readonly LocationOnboardingArea[];
  explicitLocale: Locale | null;
  browserLocales: Locale[];
}) {
  const localePreferences = { explicitLocale, browserLocales };

  return (
    <main className="catalog-start-page">
      <section
        className="catalog-start-shell"
        aria-labelledby="country-start-title"
      >
        <LocationOnboarding
          areas={locationAreas}
          messages={messages.locationOnboarding}
          explicitLocale={explicitLocale}
          browserLocales={browserLocales}
        />
        <div className="catalog-start-head" id={MANUAL_AREA_SELECTION_ID}>
          <div>
            <p className="catalog-kicker">{SITE_NAME}</p>
            <h1 id="country-start-title">{messages.home.chooseCountry}</h1>
          </div>
        </div>

        <div className="country-card-list">
          {countries.map((country) => {
            const places = country.regions.reduce(
              (total, region) => total + region.areas.length,
              0,
            );
            const countryLabel = getLocalizedCatalogLabel(country, HOME_LOCALE);
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
              <Link
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
              </Link>
            );
          })}
        </div>

        <section
          id="about"
          className="home-about"
          aria-labelledby="home-about-title"
        >
          <div>
            <p className="catalog-kicker">{messages.home.aboutKicker}</p>
            <h2 id="home-about-title">{messages.siteHeader.tagline}</h2>
          </div>
          <div className="home-about__copy">
            <p>{messages.home.aboutDescription}</p>
            <p>{messages.home.aboutCatalogDescription}</p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default async function HomePage() {
  const countries = listPublishedCountries();
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
    <CountryStart
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
