import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRightIcon, ClockIcon, EnvelopeSimpleIcon, FacebookLogoIcon, GlobeIcon, InstagramLogoIcon, MapPinIcon, NavigationArrowIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
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
import {
  formatCategoryList,
  getCategoryLabel,
} from "@/lib/i18n/categories";
import { buildCatalogScope } from "@/lib/i18n/catalog-scope";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";
import { getProducerActionLabels } from "@/lib/i18n/producer-action-labels";
import { getProducerDistanceMessages } from "@/lib/i18n/producer-distance";
import { getSimilarProducersMessages } from "@/lib/i18n/similar-producers";
import {
  formatProducerFieldValue,
  presentPublicProducerFields,
} from "@/lib/i18n/producer-fields";
import { getCategoryIcon } from "@/lib/get-category-icon";
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

function buildPhoneHref(phone: string): string {
  return phone ? `tel:${phone}` : "";
}

function splitFieldValues(value: string, separator: "," | "|"): string[] {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

const PRACTICAL_FIELD_KEYS = new Set([
  "Venta online",
  "Canal de venta",
]);

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

  const indexableLocales = (await listIndexableProducerLocales(country.slug, area, areaOption.publishedLocales)).get(producer.producerId) ?? [];
  const metadata = buildLocalizedMetadata({
    title: producer.name,
    description,
    locale,
    alternates: buildCatalogAlternateSet(
      { kind: "producer", country, localePolicy: areaOption, area, producer, indexableLocales },
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
    onlineSales === "sí" && salesChannels.includes("ecommerce") && Boolean(website);
  const phoneHref = buildPhoneHref(phone);
  const practicalFields = presentPublicProducerFields(
    producer.fields,
    locale,
    messages,
  ).filter(
    ({ key, value }) => PRACTICAL_FIELD_KEYS.has(key) && value.trim().length > 0,
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
  const primaryCategory = producer.categories[0];
  const countryHref = buildCatalogHref({ scope });
  const relatedCategoryHref = primaryCategory
    ? buildCatalogHref({ scope, area, category: primaryCategory })
    : null;
  const relatedAreaHref = buildCatalogHref({ scope, area });
  const actionLabels = getProducerActionLabels(locale);
  const distanceMessages = getProducerDistanceMessages(locale);
  const similarMessages = getSimilarProducersMessages(locale);
  const contactMessages = getProducerContactMessages(locale);
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
        .filter((candidateArea) => candidateArea.publishedLocales.includes(locale))
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
      {isProducerStatsEnabled() ? <ProducerProfileView country={country.slug} producerId={producer.producerId} /> : null}
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
        <nav className="detail-breadcrumb" aria-label={messages.producer.navigation}>
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

        <header id="detail-hero" className="detail-hero">
          <div className="detail-hero-copy">
            <div className="detail-profile-heading">
              {primaryCategory ? (
                <span className="detail-category-icon" aria-hidden="true">
                  {getCategoryIcon(primaryCategory)}
                </span>
              ) : null}
              <div>
                <p className="detail-eyebrow">{messages.producer.profile}</p>
                <h1>{producer.name}</h1>
                <p className="detail-subtitle">
                  {producer.city} · {localizedCategories.join(" · ")}
                </p>
              </div>
            </div>
            {description ? <p className="detail-intro">{description}</p> : null}
            {openingHours ? (
              <section className="detail-opening-hours" aria-labelledby="detail-hours-title">
                <ClockIcon size={22} aria-hidden="true" />
                <div>
                  <h2 id="detail-hours-title">{messages.fieldLabels.openingHours}</h2>
                  <p>{openingHours}</p>
                </div>
              </section>
            ) : null}
            {website ? (
              <a className="detail-website" href={website} target="_blank" rel="noreferrer">
                <GlobeIcon size={24} aria-hidden="true" />
                <span>
                  <small>{canBuyOnline ? actionLabels.buyOnline : messages.producer.website}</small>
                  <strong>{website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</strong>
                </span>
                <ArrowUpRightIcon size={22} aria-hidden="true" />
              </a>
            ) : null}
            <div className="detail-actions">
              {email ? (
                <a href="#detail-contact" className="detail-action--primary">
                  <EnvelopeSimpleIcon size={20} aria-hidden="true" />{contactMessages.title}
                </a>
              ) : null}
              {phone && phoneHref ? (
                <a href={phoneHref} aria-label={actionLabels.call + " · " + phone}>
                  <PhoneIcon size={20} aria-hidden="true" />{phone}
                </a>
              ) : null}
              {instagram ? (
                <a href={instagram} target="_blank" rel="noreferrer" aria-label={messages.fieldLabels.instagram} title={messages.fieldLabels.instagram}>
                  <InstagramLogoIcon size={22} aria-hidden="true" />
                </a>
              ) : null}
              {facebook ? (
                <a href={facebook} target="_blank" rel="noreferrer" aria-label={messages.fieldLabels.facebook} title={messages.fieldLabels.facebook}>
                  <FacebookLogoIcon size={22} aria-hidden="true" />
                </a>
              ) : null}
            </div>
            {onlineSales === "sí" ? (
              <div
                className="detail-service-chips"
                aria-label={messages.fieldLabels.salesChannels}
              >
                {salesChannels.length === 0 ? (
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
          </div>
          <figure className="detail-hero-media">
            <Image
              src={producer.imageSrc}
              alt={formatMessage(messages.producer.imageAlt, {
                producer: producer.name,
              })}
              width={640}
              height={480}
              sizes="(max-width: 980px) calc(100vw - 2.75rem), 420px"
              priority
              className="detail-hero-image"
            />
          </figure>
        </header>

        <ProducerProfileQrLabel
          country={country.slug}
          locale={locale}
          name={producer.name}
          path={profileQrPath}
          producerId={producer.producerId}
        />

        {featuredProducts.length > 0 ? (
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

        {hasLocation || email ? <div className="detail-visit-contact">
          {hasLocation ? <section
            id="detail-location"
            className="detail-map-card"
            aria-labelledby="detail-location-title"
          >
            <div className="detail-location-heading">
              <div>
                <h2 id="detail-location-title"><MapPinIcon size={24} aria-hidden="true" />{messages.producer.location}</h2>
                {address ? <p className="detail-address">{address}</p> : null}
              </div>
              {maps ? (
                <a className="detail-directions" href={maps} target="_blank" rel="noreferrer" aria-label={actionLabels.directions + " · Google Maps"}>
                  <NavigationArrowIcon size={20} aria-hidden="true" />
                  <span>{actionLabels.directions}<small>Google Maps</small></span>
                  <ArrowUpRightIcon size={18} aria-hidden="true" />
                </a>
              ) : null}
            </div>
            {mapPoints.length ? <div
              className="detail-producer-map"
              aria-label={formatMessage(messages.producer.mapAria, { producer: producer.name })}
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
            </div> : null}
            {producer.latitude !== null && producer.longitude !== null ? (
              <ProducerDistance
                latitude={producer.latitude}
                longitude={producer.longitude}
                locale={locale}
                messages={distanceMessages}
              />
            ) : null}
          </section> : null}
          {email ? <ProducerContact email={email} name={producer.name} messages={contactMessages} /> : null}
        </div> : null}

        <section id="detail-info" className="detail-table-card">
          <h2>{messages.producer.details}</h2>
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
                    <td>
                      {field.displayValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Suspense fallback={null}>
          <ProducerFavorites country={country.slug} producerId={producer.producerId} />
          <ProducerAccountActions
            locale={locale}
            country={country.slug}
            producerId={producer.producerId}
            returnTo={buildProducerHref(producer, {
              scope,
              area,
              ...catalogQuery,
            })}
            messages={messages.accountActions}
          />
        </Suspense>

        <GuideHighlights producer={{ country: country.slug, producerId: producer.producerId }} />

        <section className="detail-related" aria-labelledby="detail-related-title">
          <p className="detail-eyebrow">{messages.producer.categories}</p>
          <h2 id="detail-related-title">{messages.catalog.producers}</h2>
          <div className="detail-related-links">
            {relatedCategoryHref && primaryCategory ? (
              <Link href={relatedCategoryHref} prefetch={false}>
                {getCategoryLabel(primaryCategory, locale)} · {areaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
            <Link href={relatedAreaHref} prefetch={false}>
              {messages.producer.allCategories} · {areaLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <SimilarProducers
          title={similarMessages.title}
          producers={similarProducers}
        />
      </article>
    </main>
  );
}
