import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { AreaCatalog } from "@/components/area-catalog";
import {
  buildCatalogAlternateSet,
  buildLocalizedMetadata,
} from "@/lib/catalog-metadata";
import { buildCatalogHref, readCatalogQueryContext } from "@/lib/catalog-navigation";
import {
  isCanonicalCatalogSegment,
  resolveAreaCatalog,
  resolveKnownCatalogScope,
} from "@/lib/catalog-routing";
import { type Country, getAreaLabel } from "@/lib/csv-catalog";
import type { Locale } from "@/lib/i18n/locales";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";

type AreaPageProps = {
  params: Promise<{ catalog: string; area: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function localizedAreaLabel(country: Country, area: string, locale: Locale): string {
  const areaOption = country.regions
    .flatMap((region) => region.areas)
    .find((candidate) => candidate.slug === area);

  return areaOption?.labels[locale] ?? areaOption?.label ?? getAreaLabel(country.slug, area);
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { catalog, area: rawArea } = await params;
  const resolved = resolveAreaCatalog(catalog, rawArea);

  if (!resolved) {
    const locale = resolveKnownCatalogScope(catalog)?.scope.locale ?? "en";
    const messages = await loadMessages(locale);
    return { title: messages.metadata.areaNotFoundTitle };
  }

  const { country, area, areaOption, scope } = resolved;
  const locale = scope.locale;
  const messages = await loadMessages(locale);
  const areaLabel = localizedAreaLabel(country, area, locale);
  const countryLabel = country.labels[locale] ?? country.label;
  const title = formatMessage(messages.metadata.areaTitle, { area: areaLabel });
  const description = formatMessage(messages.metadata.areaDescription, {
    area: areaLabel,
    country: countryLabel,
  });

  return buildLocalizedMetadata({
    title,
    description,
    locale,
    alternates: buildCatalogAlternateSet(
      { kind: "area", country, localePolicy: areaOption, area },
      locale,
    ),
  });
}

export default async function AreaPage({ params, searchParams }: AreaPageProps) {
  const [{ catalog, area: rawArea }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const resolved = resolveAreaCatalog(catalog, rawArea);

  if (!resolved) notFound();

  const { country, area, scope } = resolved;

  if (!isCanonicalCatalogSegment(catalog, scope) || rawArea !== area) {
    permanentRedirect(
      buildCatalogHref({
        scope,
        area,
        ...readCatalogQueryContext(query),
      }),
    );
  }

  return (
    <AreaCatalog
      country={country}
      area={area}
      locale={scope.locale}
      scope={scope}
      searchParams={query}
    />
  );
}
