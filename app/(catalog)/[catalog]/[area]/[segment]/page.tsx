import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";

import { ProducerAccountActions } from "@/components/account/producer-account-actions";
import { DetailDesktopNav } from "@/components/detail-desktop-nav";
import { ExpandedProducerProfile } from "@/components/expanded-producer-profile";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProducersMap } from "@/components/map/producers-map";
import { ProducerVerificationTableRow } from "@/components/producer-verification-table-row";
import {
  absoluteSiteUrl,
  buildCatalogAlternateSet,
  buildLocalizedMetadata,
} from "@/lib/catalog-metadata";
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
  getLocalizedCatalogLabel,
  listCategories,
  toProducerMapPoints,
} from "@/lib/csv-catalog";
import {
  formatCategoryList,
  getCategoryLabel,
  getCategoryPresentation,
} from "@/lib/i18n/categories";
import { buildCatalogScope } from "@/lib/i18n/catalog-scope";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";
import { getProducerActionLabels } from "@/lib/i18n/producer-action-labels";
import {
  formatProducerFieldValue,
  presentPublicProducerFields,
} from "@/lib/i18n/producer-fields";
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
  "direccion",
  "horario",
  "telefono",
  "correo",
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

  return buildLocalizedMetadata({
    title: producer.name,
    description,
    locale,
    alternates: buildCatalogAlternateSet(
      { kind: "producer", country, localePolicy: areaOption, area, producer },
      locale,
    ),
    image: {
      url: producer.imageSrc,
      alt: formatMessage(messages.producer.imageAlt, {
        producer: producer.name,
      }),
    },
  });
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
  const [producer, categories, messages] = await Promise.all([
    findProducerBySlug(resolved.producer.slug, country.slug, area, locale),
    listCategories(country.slug, area),
    loadMessages(locale),
  ]);

  if (!producer) {
    notFound();
  }

  const catalogQuery = readCatalogQueryContext(query);
  const canonicalSegment = buildProducerPathSegment(producer.slug);
  const backHref = buildCatalogHref({
    scope,
    area,
    category: catalogQuery.category,
    highlight: producer.slug,
  });

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
  const categoryPresentations = categories.map((producerCategory) =>
    getCategoryPresentation(producerCategory, locale),
  );
  const countryLabel = getLocalizedCatalogLabel(country, locale);
  const areaLabel = getLocalizedCatalogLabel(areaOption, locale);
  const primaryCategory = producer.categories[0];
  const countryHref = buildCatalogHref({ scope });
  const relatedCategoryHref = primaryCategory
    ? buildCatalogHref({ scope, area, category: primaryCategory })
    : null;
  const relatedAreaHref = buildCatalogHref({ scope, area });
  const actionLabels = getProducerActionLabels(locale);
  const navMessages = {
    navigation: messages.producer.navigation,
    map: messages.producer.map,
    categories: messages.producer.categories,
    allCategories: messages.producer.allCategories,
    information: messages.producer.information,
  };
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

  return (
    <main className="detail-page">
      <script
        id="producer-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(structuredData),
        }}
      />
      <div className="detail-mobile-bar">
        <Link href={backHref} className="detail-back-link">
          ← {messages.producer.backToMap}
        </Link>
      </div>
      <article className="detail-shell">
        <DetailDesktopNav
          categories={categoryPresentations}
          scope={scope}
          area={area}
          messages={navMessages}
        />
        <LanguageSwitcher
          currentLocale={locale}
          label={messages.languageSwitcher.label}
          options={languageOptions}
        />
        <Link
          href={backHref}
          className="detail-back-link detail-back-link--desktop"
        >
          ← {messages.producer.backToMap}
        </Link>

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
            <p className="detail-eyebrow">{messages.producer.profile}</p>
            <h1>{producer.name}</h1>
            <p className="detail-subtitle">
              {producer.city} · {localizedCategories.join(" · ")}
            </p>
            {description ? <p className="detail-intro">{description}</p> : null}
            <div className="detail-actions">
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className={canBuyOnline ? "detail-action--primary" : undefined}
                >
                  {canBuyOnline
                    ? actionLabels.buyOnline
                    : messages.producer.website}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {maps ? (
                <a href={maps} target="_blank" rel="noreferrer">
                  {actionLabels.directions}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {phone && phoneHref ? (
                <a href={phoneHref}>{actionLabels.call}</a>
              ) : null}
              {instagram ? (
                <a href={instagram} target="_blank" rel="noreferrer">
                  {messages.fieldLabels.instagram}
                  <span aria-hidden="true">↗</span>
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
            {email || facebook ? (
              <div className="detail-secondary-links">
                {email ? (
                  <a href={`mailto:${email}`}>{messages.producer.email}</a>
                ) : null}
                {facebook ? (
                  <a href={facebook} target="_blank" rel="noreferrer">
                    {messages.fieldLabels.facebook}
                  </a>
                ) : null}
              </div>
            ) : null}
            <Suspense fallback={null}>
              <ProducerAccountActions
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
            country={country.slug}
            producerId={producer.producerId}
            fields={producer.fields}
            locale={locale}
            messages={messages}
          />
        </Suspense>

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
                      {field.key === "telefono" && phoneHref ? (
                        <a href={phoneHref}>{field.displayValue}</a>
                      ) : field.key === "correo" && email ? (
                        <a href={`mailto:${email}`}>{field.displayValue}</a>
                      ) : (
                        field.displayValue
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="detail-location"
          className="detail-map-card"
          aria-labelledby="detail-location-title"
        >
          <h2 id="detail-location-title">{messages.producer.location}</h2>
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
              highlightedSlug={producer.slug}
              singlePointZoom={16}
              messages={mapMessages}
            />
          </div>
        </section>

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
      </article>
    </main>
  );
}
