import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { ProducerAccountActions } from "@/components/account/producer-account-actions";
import { DetailDesktopNav } from "@/components/detail-desktop-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProducersMap } from "@/components/map/producers-map";
import {
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
import { presentPublicProducerFields } from "@/lib/i18n/producer-fields";

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
  const description = formatMessage(messages.metadata.producerDescription, {
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
  const phoneHref = buildPhoneHref(phone);
  const publicFields = presentPublicProducerFields(
    producer.fields,
    locale,
    messages,
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

  return (
    <main className="detail-page">
      <div className="detail-mobile-bar">
        <Link href={backHref} className="detail-back-link">
          ← {messages.producer.backToMap}
        </Link>
      </div>
      <section className="detail-shell">
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

        <header id="detail-hero" className="detail-hero">
          <div className="detail-hero-copy">
            <p className="detail-eyebrow">{messages.producer.profile}</p>
            <h1>{producer.name}</h1>
            <p className="detail-subtitle">
              {producer.city} · {localizedCategories.join(" · ")}
            </p>
            <div className="detail-links">
              {website ? (
                <a href={website} target="_blank" rel="noreferrer">
                  {messages.producer.website}
                </a>
              ) : null}
              {maps ? (
                <a href={maps} target="_blank" rel="noreferrer">
                  {messages.producer.googleMaps}
                </a>
              ) : null}
              {phone && phoneHref ? (
                <a href={phoneHref}>{messages.producer.phone}</a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`}>{messages.producer.email}</a>
              ) : null}
              {instagram ? (
                <a href={instagram} target="_blank" rel="noreferrer">
                  {messages.fieldLabels.instagram}
                </a>
              ) : null}
              {facebook ? (
                <a href={facebook} target="_blank" rel="noreferrer">
                  {messages.fieldLabels.facebook}
                </a>
              ) : null}
            </div>
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
          </div>
          <figure className="detail-hero-media">
            <Image
              src={producer.imageSrc}
              alt={formatMessage(messages.producer.imageAlt, {
                producer: producer.name,
              })}
              width={640}
              height={480}
              sizes="(max-width: 980px) calc(100vw - 2.75rem), 330px"
              unoptimized
              priority
              className="detail-hero-image"
            />
          </figure>
        </header>

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
                {publicFields.map((field) => (
                  <tr key={field.key}>
                    <td>{field.label}</td>
                    <td>{field.displayValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
