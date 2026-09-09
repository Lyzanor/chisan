import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowUpRightIcon,
  ClockIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  GlobeIcon,
  InstagramLogoIcon,
  MapPinIcon,
  NavigationArrowIcon,
  PhoneIcon,
  SealCheckIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";
import { loadPublicProducerSources } from "@/lib/catalog/public-evidence";
import { ProducerGallery } from "@/components/producer-gallery";
import {
  loadPublicProducerGallery,
  hasPublicProducerPremiumAccess,
} from "@/lib/catalog/public-expanded";
import { isProducerOwnershipVerified } from "@/lib/accounts/producer-ownership";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import { ProducerFollowButton } from "@/components/account/producer-follow-button";
import { ProducerContact } from "@/components/producer-contact";
import { getProducerContactMessages } from "@/lib/i18n/producer-contact";

import { ProducerProfileView } from "@/components/analytics/producer-profile-view";
import { isProducerStatsEnabled } from "@/lib/producer-stats/policy";
import { ProducerAccountActions } from "@/components/account/producer-account-actions";
import { ProducerFavorites } from "@/components/account/producer-favorites";
import { ExpandedProducerProfile } from "@/components/expanded-producer-profile";
import { GuideHighlights } from "@/components/guides/guide-highlights";
import { LanguageMenuRegistration } from "@/components/language-menu-registration";
import { ProducersMap } from "@/components/map/producers-map";
import { ProducerDistance } from "@/components/producer-distance";
import { ProducerProfileQrLabel } from "@/components/producer-profile-qr-label";
import { ProducerVerificationTableRow } from "@/components/producer-verification-table-row";
import { SimilarProducers } from "@/components/similar-producers";
import { CATALOG_API_PATH } from "@/lib/agents/catalog-schema";
import {
  absoluteSiteUrl,
  buildCatalogAlternateSet,
  buildLocalizedMetadata,
} from "@/lib/catalog-metadata";
import { selectSimilarNearbyProducers } from "@/lib/catalog/similar-producers";
import {
  buildCatalogHref,
  buildProducerHref,
  buildProducerPathSegment,
  readCatalogQueryContext,
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
import { formatCategoryList, getCategoryLabel } from "@/lib/i18n/categories";
import { buildCatalogScope } from "@/lib/i18n/catalog-scope";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";
import { getProducerActionLabels } from "@/lib/i18n/producer-action-labels";
import { getProducerDistanceMessages } from "@/lib/i18n/producer-distance";
import { getSimilarProducersMessages } from "@/lib/i18n/similar-producers";
import {
  formatProducerFieldValue,
  presentPublicProducerFields,
} from "@/lib/i18n/producer-fields";
import { formatProducerDistanceKm } from "@/lib/location/producer-distance";
import {
  buildProducerStructuredData,
  serializeStructuredData,
} from "@/lib/producer-structured-data";

type ProducerPageProps = {
  params: Promise<{ catalog: string; area: string; segment: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

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

const PRACTICAL_FIELD_KEYS = new Set(["Venta online", "Canal de venta"]);

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
  const metadata = buildLocalizedMetadata({
    title: producer.name,
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
  searchParams,
}: ProducerPageProps) {
  const [{ catalog, area: rawArea, segment }, query] = await Promise.all([
    params,
    searchParams,
  ]);
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

  const catalogQuery = readCatalogQueryContext(query);
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
        ...catalogQuery,
        highlight: catalogQuery.highlight ? producer.slug : undefined,
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
  const canBuyOnline =
    onlineSales === "sí" &&
    salesChannels.includes("ecommerce") &&
    Boolean(website);

  const practicalFields = presentPublicProducerFields(
    producer.fields,
    locale,
    messages,
  ).filter(
    ({ key, value }) =>
      PRACTICAL_FIELD_KEYS.has(key) && value.trim().length > 0,
  );
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
  const [ownershipVerified, premiumActive, gallery] = await Promise.all([
    isProducerOwnershipVerified(country.slug, producer.producerId),
    hasPublicProducerPremiumAccess(country.slug, producer.producerId),
    loadPublicProducerGallery(country.slug, producer.producerId, locale),
  ]);
  const sources =
    verification === "pendiente" && !ownershipVerified
      ? await loadPublicProducerSources(
          country.slug,
          producer.fields.region,
          area,
          producer.slug,
        )
      : [];
  const returnTo = buildProducerHref(producer, {
    scope,
    area,
    ...catalogQuery,
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
  const publicLinks = [
    { url: website, label: messages.producer.website, Icon: GlobeIcon },
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
    { url: maps, label: "Google Maps", Icon: MapPinIcon },
  ].filter((link) => link.url);
  const profileQrPath = buildProducerHref(producer, {
    scope: buildCatalogScope(country),
    area,
  });
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
        ...catalogQuery,
      }),
    })),
  );
  const canonicalUrl = buildCatalogAlternateSet(
    { kind: "producer", country, localePolicy: areaOption, area, producer },
    locale,
  ).canonical;
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
    imageUrl:
      producer.imageSrc === DEFAULT_PRODUCER_IMAGE_SRC
        ? undefined
        : absoluteSiteUrl(producer.imageSrc),
    latitude: producer.latitude,
    longitude: producer.longitude,
    categories: localizedCategories,
    featuredProducts,
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
    distance: formatMessage(similarMessages.distance, {
      distance: formatProducerDistanceKm(candidate.distanceKm, locale),
    }),
    imageSrc: candidate.imageSrc,
    accessibleLabel: formatMessage(similarMessages.openProfile, {
      producer: candidate.name,
    }),
  }));

  return (
    <main className="detail-page">
      {isProducerStatsEnabled() ? (
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
        <LanguageMenuRegistration
          currentLocale={locale}
          label={messages.languageSwitcher.label}
          options={languageOptions}
        />
        <nav
          className="detail-breadcrumb"
          aria-label={messages.producer.navigation}
        >
          <ol>
            <li>
              <Link href={countryHref} prefetch={false}>
                {countryLabel}
              </Link>
            </li>
            <li>
              <Link href={relatedAreaHref} prefetch={false}>
                {areaLabel}
              </Link>
            </li>
            <li aria-current="page">{producer.name}</li>
          </ol>
        </nav>

        <header
          id="detail-hero"
          className={`detail-hero detail-hero--photographic${premiumActive ? " detail-hero--premium" : ""}`}
        >
          <div className="detail-hero-toolbar">
            <div className="detail-status">
              {ownershipVerified ? (
                <span
                  className="detail-status--verified"
                  title={profileWords.verifiedHelp}
                >
                  <SealCheckIcon size={22} weight="fill" aria-hidden="true" />
                  {profileWords.verified}
                </span>
              ) : verification === "pendiente" ? (
                <a href="#detail-info" className="detail-status--pending">
                  <WarningCircleIcon size={22} aria-hidden="true" />
                  {profileWords.pending}
                </a>
              ) : (
                <span className="detail-eyebrow">
                  {messages.producer.profile}
                </span>
              )}
            </div>
            <Suspense fallback={null}>
              <ProducerFollowButton
                country={country.slug}
                producerId={producer.producerId}
                returnTo={returnTo}
                messages={messages.accountActions}
              />
            </Suspense>
          </div>
          <div className="detail-profile-heading">
            <h1>{producer.name}</h1>
            <div className="detail-subtitle">
              <Link href={municipalityHref} prefetch={false}>
                {producer.city}
              </Link>
              {producer.categories.map((category) => (
                <Link
                  key={category}
                  href={buildCatalogHref({ scope, area, category })}
                  prefetch={false}
                >
                  {getCategoryLabel(category, locale)}
                </Link>
              ))}
            </div>
          </div>
          <div className="detail-profile-photos">
            <ProducerGallery
              featured={{
                src: producer.imageSrc,
                alt: formatMessage(messages.producer.imageAlt, {
                  producer: producer.name,
                }),
                width: 640,
                height: 480,
              }}
              gallery={gallery}
              locale={locale}
            />
          </div>
          <div className="detail-hero-summary">
            {description ? <p className="detail-intro">{description}</p> : null}
            <div className="detail-actions">
              {email ? (
                <a href="#detail-contact" className="detail-action--primary">
                  <EnvelopeSimpleIcon size={20} aria-hidden="true" />
                  {actionLabels.contact}
                </a>
              ) : null}
              {phone ? (
                <a href="#detail-contact">
                  <PhoneIcon size={20} aria-hidden="true" />
                  {actionLabels.call}
                </a>
              ) : null}
            </div>
            {publicLinks.length ? (
              <ul className="detail-social-links">
                {publicLinks.map(({ url, label, Icon }) => (
                  <li key={label}>
                    <a href={url} target="_blank" rel="noreferrer">
                      <Icon size={20} aria-hidden="true" />
                      <span>
                        <small>{label}</small>
                        {url
                          .split(/[?#]/)[0]
                          .replace(/^https?:\/\//, "")
                          .replace(/\/$/, "")}
                      </span>
                      <ArrowUpRightIcon size={16} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </header>

        <ProducerProfileQrLabel
          country={country.slug}
          locale={locale}
          name={producer.name}
          path={profileQrPath}
          producerId={producer.producerId}
        />

        {featuredProducts.length > 0 ||
        onlineSales === "sí" ||
        salesChannels.length > 0 ? (
          <section
            className="detail-products"
            aria-labelledby="detail-products-title"
          >
            <p className="detail-eyebrow">{localizedCategories[0]}</p>
            <h2 id="detail-products-title">
              {messages.fieldLabels.featuredProducts}
            </h2>
            <ul className="detail-product-list">
              {featuredProducts.map((product, index) => (
                <li key={`${index}-${product}`}>{product}</li>
              ))}
            </ul>
            {canBuyOnline ? (
              <a
                className="detail-buy-link"
                href={website}
                target="_blank"
                rel="noreferrer"
              >
                <GlobeIcon size={20} aria-hidden="true" />
                {actionLabels.buyOnline}
                <ArrowUpRightIcon size={18} aria-hidden="true" />
              </a>
            ) : null}
            {onlineSales === "sí" || salesChannels.length ? (
              <div
                className="detail-service-chips"
                aria-label={messages.fieldLabels.salesChannels}
              >
                {!salesChannels.length ? (
                  <span>{messages.fieldLabels.onlineSales}</span>
                ) : null}
                {salesChannels.map((channel) => (
                  <span key={channel}>
                    {formatProducerFieldValue(
                      "Canal de venta",
                      channel,
                      locale,
                      messages,
                    )}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <Suspense fallback={null}>
          <ExpandedProducerProfile
            canonicalUrl={canonicalUrl}
            country={country.slug}
            producerId={producer.producerId}
            fields={producer.fields}
            locale={locale}
            messages={messages}
          />
        </Suspense>

        {hasLocation || openingHours ? (
          <div className="detail-location-hours">
            {hasLocation ? (
              <section
                id="detail-location"
                className="detail-map-card"
                aria-labelledby="detail-location-title"
              >
                <div className="detail-location-heading">
                  <div>
                    <h2 id="detail-location-title">
                      <MapPinIcon size={24} aria-hidden="true" />
                      {messages.producer.location}
                    </h2>
                    {address ? (
                      <p className="detail-address">{address}</p>
                    ) : null}
                  </div>
                  {directionsHref ? (
                    <a
                      className="detail-directions"
                      href={directionsHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={actionLabels.directions + " · Google Maps"}
                    >
                      <NavigationArrowIcon size={20} aria-hidden="true" />
                      <span>
                        {actionLabels.directions}
                        <small>{profileWords.fromLocation}</small>
                      </span>
                      <ArrowUpRightIcon size={18} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
                {mapPoints.length ? (
                  <div
                    className="detail-producer-map"
                    aria-label={formatMessage(messages.producer.mapAria, {
                      producer: producer.name,
                    })}
                  >
                    <ProducersMap
                      points={mapPoints}
                      scope={scope}
                      area={area}
                      selectedSlug={producer.slug}
                      markerInteraction="static"
                      singlePointZoom={16}
                      messages={mapMessages}
                    />
                  </div>
                ) : null}
                {producer.latitude !== null && producer.longitude !== null ? (
                  <ProducerDistance
                    latitude={producer.latitude}
                    longitude={producer.longitude}
                    locale={locale}
                    messages={distanceMessages}
                  />
                ) : null}
              </section>
            ) : null}
            {openingHours ? (
              <section
                className="detail-opening-hours"
                aria-labelledby="detail-hours-title"
              >
                <ClockIcon size={24} aria-hidden="true" />
                <div>
                  <h2 id="detail-hours-title">
                    {messages.fieldLabels.openingHours}
                  </h2>
                  {openingHours
                    .split(/\n|;|\||\s+·\s+|,(?=\s*\d{1,2}:\d{2})/)
                    .map((line, index) =>
                      line.trim() ? <p key={index}>{line.trim()}</p> : null,
                    )}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        <div className="detail-info-contact">
          <section id="detail-info" className="detail-table-card">
            <h2>{messages.producer.details}</h2>
            <p
              className={
                verification === "pendiente" && !ownershipVerified
                  ? "detail-review-notice"
                  : "detail-trust-note"
              }
            >
              {ownershipVerified
                ? profileWords.verifiedHelp
                : verification === "pendiente"
                  ? profileWords.pendingHelp
                  : profileWords.editorial}
            </p>
            {sources.length ? (
              <details className="detail-sources">
                <summary>{profileWords.sources}</summary>
                <ul>
                  {sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.url.replace(/^https?:\/\//, "")}
                      </a>
                      <small>
                        {profileWords.checked}{" "}
                        <time dateTime={source.checkedAt}>
                          {source.checkedAt}
                        </time>
                      </small>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{messages.producer.field}</th>
                    <th>{messages.producer.value}</th>
                  </tr>
                </thead>
                <tbody>
                  <Suspense fallback={null}>
                    <ProducerVerificationTableRow
                      country={country.slug}
                      locale={locale}
                      messages={messages}
                      producerId={producer.producerId}
                      verification={verification}
                    />
                  </Suspense>
                  {practicalFields.map((field) => (
                    <tr key={field.key}>
                      <td>{field.label}</td>
                      <td>{field.displayValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {email || phone ? (
            <ProducerContact
              email={email}
              phone={phone}
              callLabel={actionLabels.call}
              name={producer.name}
              messages={contactMessages}
            />
          ) : null}
        </div>

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
        <section
          className="detail-participate"
          aria-labelledby="detail-participate-title"
        >
          <div>
            <h2 id="detail-participate-title">
              {ownershipVerified
                ? profileWords.contribute
                : profileWords.participate}
            </h2>
            <p>
              {ownershipVerified
                ? profileWords.contributeHelp
                : profileWords.participateHelp}
            </p>
          </div>
          <Suspense fallback={null}>
            <ProducerAccountActions
              locale={locale}
              country={country.slug}
              producerId={producer.producerId}
              returnTo={returnTo}
              messages={messages.accountActions}
            />
          </Suspense>
        </section>
      </article>
    </main>
  );
}
