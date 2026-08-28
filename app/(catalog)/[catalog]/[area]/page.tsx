import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { AreaCatalog } from "@/components/area-catalog";
import {
  buildCatalogAlternateSet,
  buildLocalizedMetadata,
} from "@/lib/catalog-metadata";
import { buildCatalogHref } from "@/lib/catalog-navigation";
import {
  isCanonicalCatalogSegment,
  resolveAreaCatalog,
  resolveKnownCatalogScope,
} from "@/lib/catalog-routing";
import {
  type Country,
  getLocalizedCatalogLabel,
} from "@/lib/csv-catalog";
import type { Locale } from "@/lib/i18n/locales";
import { formatMessage, loadMessages } from "@/lib/i18n/messages";

type AreaPageProps = {
  params: Promise<{ catalog: string; area: string }>;
};

// Catalog data changes only through a deployment. Returning no build-time
// params lets Next generate each area once, on first request, and keep the
// result in the Full Route Cache for the lifetime of that deployment.
export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = false;

function localizedAreaLabel(country: Country, area: string, locale: Locale): string {
  const areaOption = country.regions
    .flatMap((region) => region.areas)
    .find((candidate) => candidate.slug === area);

  if (!areaOption) {
    throw new Error(`Catalog area '${country.slug}/${area}' is missing from its manifest`);
  }
  return getLocalizedCatalogLabel(areaOption, locale);
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
  const countryLabel = getLocalizedCatalogLabel(country, locale);
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

export default async function AreaPage({ params }: AreaPageProps) {
  const { catalog, area: rawArea } = await params;
  const resolved = resolveAreaCatalog(catalog, rawArea);

  if (!resolved) notFound();

  const { country, area, scope } = resolved;

  if (!isCanonicalCatalogSegment(catalog, scope) || rawArea !== area) {
    permanentRedirect(buildCatalogHref({ scope, area }));
  }

  return (
    <AreaCatalog
      country={country}
      area={area}
      locale={scope.locale}
      scope={scope}
    />
  );
}
