import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  MapPinIcon,
} from "@phosphor-icons/react/ssr";
import { loadPublicProducerSources } from "@/lib/catalog/public-evidence";
import {
  ProducerGallery,
} from "@/components/producer-gallery";
import {
  loadPublicProducerGallery,
  hasPublicProducerPremiumAccess,
} from "@/lib/catalog/public-expanded";
import { ProducerAccountProvider } from "@/components/account/producer-account-provider";
import { isAccountSystemConfigured } from "@/lib/accounts/config";
import { isProducerOwnershipVerified } from "@/lib/accounts/producer-ownership";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import { getProducerContactMessages } from "@/lib/i18n/producer-contact";

import { ProducerProfileView } from "@/components/analytics/producer-profile-view";
import { isProducerStatsEnabled, PRODUCER_STATS_COLLECTION_PAUSED } from "@/lib/producer-stats/policy";
import {
  ProducerAccountActions,
  ProducerGalleryAction,
} from "@/components/account/producer-account-actions";
import { loadPublicExpandedContent } from "@/lib/catalog/public-expanded";
import { ProducerFavorites } from "@/components/account/producer-favorites";
import { ExpandedProducerProfile } from "@/components/expanded-producer-profile";
import { GuideHighlights } from "@/components/guides/guide-highlights";
import { LanguageMenuRegistration } from "@/components/language-menu-registration";
import { ProducerLanguageMenu } from "@/components/producer-language-menu";
import { SimilarProducers } from "@/components/similar-producers";
import { ProducerHero } from "@/components/producer/producer-hero";
import { ProducerProducts, ProducerSales } from "@/components/producer/producer-products";
import { ProducerMethods } from "@/components/producer/producer-methods";
import { ProducerNewsPrompt } from "@/components/producer/producer-news-prompt";
import { ProducerVisit } from "@/components/producer/producer-visit";
import { ProducerDetails } from "@/components/producer/producer-details";
import { CATALOG_API_PATH } from "@/lib/agents/catalog-schema";
import {
  absoluteSiteUrl,
  buildCatalogAlternateSet,
  buildLocalizedMetadata,
  buildProducerPageTitle,
} from "@/lib/catalog-metadata";
import { selectSimilarNearbyProducers } from "@/lib/catalog/similar-producers";
import { resolveProducerStoreLink } from "@/lib/catalog/store-link";
import { resolveProducerWhatsAppLink } from "@/lib/catalog/producer-contact";
import {
  buildCatalogHref,
  buildProducerHref,
  buildProducerPathSegment,
} from "@/lib/catalog-navigation";
import {
  isCanonicalCatalogSegment,
  resolveKnownCatalogScope,
  resolveProducerCatalog,
} from "@/lib/catalog-routing";
import {
  findProducerBySlug,
  listCountryProducers,
  listIndexableProducerLocales,
  getLocalizedCatalogLabel,
  toProducerMapPoints,
} from "@/lib/csv-catalog";
import { formatCategoryList, getCategoryIcon, getCategoryLabel } from "@/lib/i18n/categories";
import { buildCatalogScope } from "@/lib/i18n/catalog-scope";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";
import { getProducerActionLabels } from "@/lib/i18n/producer-action-labels";
import { getProducerDistanceMessages } from "@/lib/i18n/producer-distance";
import { getSimilarProducersMessages } from "@/lib/i18n/similar-producers";
import { formatProducerDistanceKm } from "@/lib/location/producer-distance";
import {
  buildProducerStructuredData,
  serializeStructuredData,
} from "@/lib/producer-structured-data";

type ProducerPageProps = {
  params: Promise<{ catalog: string; area: string; segment: string }>;
};

// Generate once on first access, then serve shared HTML/RSC without session reads.
// Public account presentation refreshes hourly and after ownership/Pro changes.
export function generateStaticParams() { return []; }
export const dynamic = "error";
export const dynamicParams = true;
export const revalidate = 3600;

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

function splitFieldValues(value: string, separator: "," | "|"): string[] {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

const DEFAULT_PRODUCER_IMAGE_SRC = "/productores/generica.webp";

export async function generateMetadata({
  params,
}: ProducerPageProps): Promise<Metadata> {
  const { catalog, area: rawArea, segment } = await params;
  const resolved = await resolveProducerCatalog(catalog, rawArea, segment);
  const producer = resolved
    ? await findProducerBySlug(
        resolved.producer.slug,
        resolved.country.slug,
        resolved.area,
        resolved.scope.locale,
      )
    : null;

  if (!producer || !resolved) {
    const locale =
      resolved?.scope.locale ??
      resolveKnownCatalogScope(catalog)?.scope.locale ??
      "en";
    const messages = await loadMessages(locale);
    return {
      title: messages.metadata.producerNotFoundTitle,
      description: messages.metadata.producerNotFoundDescription,
    };
  }

  const { country, area, areaOption, scope } = resolved;
  const locale = scope.locale;
  const messages = await loadMessages(locale);
  const description =
    getFieldValue(producer.fields, "descripcion") ||
    formatMessage(messages.metadata.producerDescription, {
      producer: producer.name,
      city: producer.city,
      categories: formatCategoryList(producer.categories, locale),
    });

  const indexableLocales =
    (
      await listIndexableProducerLocales(
        country.slug,
        area,
        areaOption.publishedLocales,
      )
    ).get(producer.producerId) ?? [];
  const categoryLabel = getCategoryLabel(producer.category, locale);
  const areaLabel = getLocalizedCatalogLabel(areaOption, locale);
  const pageTitle = buildProducerPageTitle({
    producerName: producer.name,
    categoryLabel,
    city: producer.city,
    areaLabel,
    locale,
  });
  const metadata = buildLocalizedMetadata({
    title: pageTitle,
    description,
    locale,
    alternates: buildCatalogAlternateSet(
      {
        kind: "producer",
        country,
        localePolicy: areaOption,
        area,
        producer,
        indexableLocales,
      },
      locale,
    ),
    image: {
      url: producer.imageSrc,
      alt: formatMessage(messages.producer.imageAlt, {
        producer: producer.name,
      }),
    },
  });
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: {
        "application/json": `${CATALOG_API_PATH}/producers/${country.slug}/${producer.producerId}?locale=${locale}`,
      },
    },
  };
}

export default async function ProducerPage({
  params,
}: ProducerPageProps) {
  const { catalog, area: rawArea, segment } = await params;
  const resolved = await resolveProducerCatalog(catalog, rawArea, segment);

  if (!resolved) notFound();

  const { country, area, areaOption, scope, isProducerRouteAlias } = resolved;
  const locale = scope.locale;
  const [producer, messages, countryProducers] = await Promise.all([
    findProducerBySlug(resolved.producer.slug, country.slug, area, locale),
    loadMessages(locale),
    listCountryProducers(country.slug),
  ]);

  if (!producer) {
    notFound();
  }

  const canonicalSegment = buildProducerPathSegment(producer.slug);

  if (
    !isCanonicalCatalogSegment(catalog, scope) ||
    isProducerRouteAlias ||
    rawArea !== area ||
    segment !== canonicalSegment
  ) {
    permanentRedirect(
      buildProducerHref(producer, {
        scope,
        area,
      }),
    );
  }

  const website = getFieldValue(producer.fields, "web");
  const maps = getFieldValue(producer.fields, "Google Maps");
  const email = getFieldValue(producer.fields, "correo");
  const phone = getFieldValue(producer.fields, "telefono");
  const instagram = getFieldValue(producer.fields, "Instagram");
  const facebook = getFieldValue(producer.fields, "Facebook");
  const verification = getFieldValue(producer.fields, "verificacion");
  const address = getFieldValue(producer.fields, "direccion");
  const openingHours = getFieldValue(producer.fields, "horario");
  const description = getFieldValue(producer.fields, "descripcion");
  const featuredProducts = splitFieldValues(
    getFieldValue(producer.fields, "productos estrella"),
    ",",
  );
  const onlineSales = getFieldValue(producer.fields, "Venta online");
  const salesChannels = splitFieldValues(
    getFieldValue(producer.fields, "Canal de venta"),
    "|",
  );
  const storeLink = resolveProducerStoreLink({
    onlineSales,
    salesChannels,
    storeUrl: getFieldValue(producer.fields, "url_tienda"),
    website,
  });
  const whatsAppLink = resolveProducerWhatsAppLink({
    phone,
    salesChannels,
    producerName: producer.name,
  });

  const localizedCategories = producer.categories.map((producerCategory) =>
    getCategoryLabel(producerCategory, locale),
  );
  const mapPoints = toProducerMapPoints([producer]).map((point) => ({
    ...point,
    categories: point.categories.map((pointCategory) =>
      getCategoryLabel(pointCategory, locale),
    ),
  }));
  const hasLocation = Boolean(address || maps || mapPoints.length);
  const countryLabel = getLocalizedCatalogLabel(country, locale);
  const areaLabel = getLocalizedCatalogLabel(areaOption, locale);
  const countryHref = buildCatalogHref({ scope });
  const relatedAreaHref = buildCatalogHref({ scope, area });
  const actionLabels = getProducerActionLabels(locale);
  const distanceMessages = getProducerDistanceMessages(locale);
  const similarMessages = getSimilarProducersMessages(locale);
  const contactMessages = getProducerContactMessages(locale);
  const profileWords = producerProfileLabels(locale);
  const [ownershipVerified, premiumActive, gallery, content] = await Promise.all([
    isProducerOwnershipVerified(country.slug, producer.producerId),
    hasPublicProducerPremiumAccess(country.slug, producer.producerId),
    loadPublicProducerGallery(country.slug, producer.producerId, locale),
    loadPublicExpandedContent(country.slug, producer.producerId, locale),
  ]);
  const identityImageSrc =
    producer.imageSrc === DEFAULT_PRODUCER_IMAGE_SRC ? "" : producer.imageSrc;
  const sources = await loadPublicProducerSources(
    country.slug,
    producer.fields.region,
    area,
    producer.slug,
  );
  const returnTo = buildProducerHref(producer, {
    scope,
    area,
  });
  const municipalityHref = buildCatalogHref({
    scope,
    area,
    municipality: producer.city,
  });
  const destination =
    producer.latitude !== null && producer.longitude !== null
      ? `${producer.latitude},${producer.longitude}`
      : address
        ? [producer.name, address, producer.city, countryLabel].join(", ")
        : "";
  const directionsHref = destination
    ? `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination })}`
    : "";
  const socialLinks = [
    {
      url: instagram,
      label: messages.fieldLabels.instagram,
      Icon: InstagramLogoIcon,
    },
    {
      url: facebook,
      label: messages.fieldLabels.facebook,
      Icon: FacebookLogoIcon,
    },
    {
      url: maps,
      label: messages.fieldLabels.googleMaps || "Google Maps",
      Icon: MapPinIcon,
    },
  ].filter((link) => link.url);
  const mapMessages = {
    loading: messages.map.loading,
    emptyCoordinates: messages.map.emptyCoordinates,
    openProfile: messages.map.openProfile,
  };
  const languageOptions = await Promise.all(
    areaOption.publishedLocales.map(async (targetLocale) => ({
      locale: targetLocale,
      label:
        targetLocale === locale
          ? messages.languageName
          : (await loadMessages(targetLocale)).languageName,
      href: buildProducerHref(producer, {
        scope: buildCatalogScope(country, targetLocale),
        area,
          }),
    })),
  );
  const canonicalUrl = buildCatalogAlternateSet(
    { kind: "producer", country, localePolicy: areaOption, area, producer },
    locale,
  ).canonical;
  const lastApprovedChange = getFieldValue(
    producer.fields,
    "fecha ultimo cambio",
  );
  const newsDate = getFieldValue(producer.fields, "fecha novedades");
  const latestSourceDate = sources.length
    ? [...sources].map((s) => s.checkedAt).sort().reverse()[0]
    : undefined;
  const verifiedDates = [
    lastApprovedChange,
    newsDate,
    latestSourceDate,
  ].filter(
    (date): date is string =>
      Boolean(date && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())),
  );
  const dateModified = verifiedDates.length
    ? [...verifiedDates].sort().reverse()[0]
    : undefined;

  const structuredData = buildProducerStructuredData({
    producerName: producer.name,
    canonicalUrl,
    countryName: countryLabel,
    countryCode: country.slug,
    countryUrl: absoluteSiteUrl(countryHref),
    areaName: areaLabel,
    areaUrl: absoluteSiteUrl(relatedAreaHref),
    city: producer.city,
    locale,
    description,
    address,
    telephone: phone,
    email,
    website,
    facebook,
    instagram,
    mapUrl: maps,
    imageUrl: identityImageSrc ? absoluteSiteUrl(identityImageSrc) : undefined,
    latitude: producer.latitude,
    longitude: producer.longitude,
    categories: localizedCategories,
    featuredProducts,
    dateModified,
  });
  const publishedAreas = new Set(
    country.regions.flatMap((region) =>
      region.areas
        .filter((candidateArea) =>
          candidateArea.publishedLocales.includes(locale),
        )
        .map((candidateArea) => candidateArea.slug),
    ),
  );
  const similarProducers = selectSimilarNearbyProducers(
    { ...producer, area },
    countryProducers.filter((candidate) => publishedAreas.has(candidate.area)),
  ).map((candidate) => ({
    producerId: candidate.producerId,
    href: buildProducerHref(candidate, { scope, area: candidate.area }),
    name: candidate.name,
    city: candidate.city,
    category: getCategoryLabel(candidate.sharedCategory, locale),
    categoryIcon: getCategoryIcon(candidate.sharedCategory),
    distance: formatMessage(similarMessages.distance, {
      distance: formatProducerDistanceKm(candidate.distanceKm, locale),
    }),
    imageSrc: candidate.imageSrc,
    accessibleLabel: formatMessage(similarMessages.openProfile, {
      producer: candidate.name,
    }),
  }));
  const accountsEnabled = isAccountSystemConfigured();

  return (
    <ProducerAccountProvider
      enabled={accountsEnabled}
      country={country.slug}
      producerId={producer.producerId}
      activeOwner={ownershipVerified}
    >
    <main className="detail-page" data-category={producer.category}>
      {!PRODUCER_STATS_COLLECTION_PAUSED && isProducerStatsEnabled() ? (
        <ProducerProfileView
          country={country.slug}
          producerId={producer.producerId}
        />
      ) : null}
      <script
        id="producer-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(structuredData),
        }}
      />
      <article className="detail-shell">
        <Suspense fallback={<LanguageMenuRegistration currentLocale={locale} label={messages.languageSwitcher.label} options={languageOptions} />}>
          <ProducerLanguageMenu currentLocale={locale} label={messages.languageSwitcher.label} options={languageOptions} />
        </Suspense>
        <ProducerHero
          actionLabels={actionLabels}
          area={area}
          areaHref={relatedAreaHref}
          areaLabel={areaLabel}
          categories={producer.categories}
          city={producer.city}
          countryHref={countryHref}
          countryLabel={countryLabel}
          countrySlug={country.slug}
          description={description}
          email={email}
          identityImageSrc={identityImageSrc}
          locale={locale}
          messages={messages}
          municipalityHref={municipalityHref}
          name={producer.name}
          ownershipVerified={ownershipVerified}
          phone={phone}
          premiumActive={premiumActive}
          producerId={producer.producerId}
          profileWords={profileWords}
          returnTo={returnTo}
          scope={scope}
          socialLinks={socialLinks}
          verification={verification}
          website={website}
          whatsAppLink={whatsAppLink}
        />

        <div className="detail-lead">
          <div className="detail-lead__main">
            <ProducerGallery
              photos={gallery}
              title={profileWords.gallery}
              captionLabel={profileWords.photoCaption}
            />
            <ProducerMethods
              text={getFieldValue(producer.fields, "como producimos")}
              textLocale={getFieldValue(producer.fields, "como_producimos_locale")}
              locale={locale}
              messages={messages}
            />
            {accountsEnabled ? (
              <Suspense fallback={null}>
                <ProducerGalleryAction
                  country={country.slug}
                  producerId={producer.producerId}
                  locale={locale}
                  messages={messages.accountActions}
                />
              </Suspense>
            ) : null}
          </div>
        </div>

        <Suspense fallback={null}>
          <ProducerAccountActions
            accountsEnabled={accountsEnabled}
            country={country.slug}
            locale={locale}
            messages={messages.accountActions}
            ownershipVerified={ownershipVerified}
            producerId={producer.producerId}
            producerName={producer.name}
            profileUrl={canonicalUrl}
          />
        </Suspense>

        <ProducerProducts featuredProducts={featuredProducts} messages={messages} content={content} locale={locale} country={country.slug} producerId={producer.producerId} premiumActive={premiumActive} />
        <ProducerSales
          locale={locale}
          messages={messages}
          onlineSales={onlineSales}
          salesChannels={salesChannels}
          storeLink={storeLink}
        />

        <Suspense fallback={null}>
          <ExpandedProducerProfile
            content={content}
            identityImageSrc={identityImageSrc}
            canonicalUrl={canonicalUrl}
            country={country.slug}
            producerId={producer.producerId}
            fields={producer.fields}
            hasSources={sources.length > 0}
            locale={locale}
            messages={messages}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ProducerNewsPrompt country={country.slug} producerId={producer.producerId} locale={locale} premiumActive={premiumActive} />
        </Suspense>

        <ProducerVisit
          actionLabels={actionLabels}
          address={address}
          area={area}
          contactMessages={contactMessages}
          directionsHref={directionsHref}
          distanceMessages={distanceMessages}
          email={email}
          hasLocation={hasLocation}
          locale={locale}
          mapMessages={mapMessages}
          mapPoints={mapPoints}
          messages={messages}
          name={producer.name}
          openingHours={openingHours}
          phone={phone}
          producerLatitude={producer.latitude}
          producerLongitude={producer.longitude}
          producerSlug={producer.slug}
          profileWords={profileWords}
          scope={scope}
          whatsAppLink={whatsAppLink}
        />

        <Suspense fallback={null}>
          <ProducerFavorites
            country={country.slug}
            producerId={producer.producerId}
          />
        </Suspense>

        <GuideHighlights
          producer={{ country: country.slug, producerId: producer.producerId }}
        />

        <SimilarProducers
          title={similarMessages.title}
          producers={similarProducers}
        />

        <ProducerDetails
          accountsEnabled={accountsEnabled}
          countrySlug={country.slug}
          lastApprovedChange={lastApprovedChange}
          locale={locale}
          messages={messages}
          ownershipVerified={ownershipVerified}
          producerId={producer.producerId}
          profileWords={profileWords}
          sources={sources}
          verification={verification}
        />
      </article>
    </main>
    </ProducerAccountProvider>
  );
}
