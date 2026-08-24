import type { MetadataRoute } from "next";

import { buildCatalogHref, buildProducerHref } from "@/lib/catalog-navigation";
import {
  listCountryAreaParams,
  listCountrySlugs,
  listProducerRouteParams,
} from "@/lib/csv-catalog";
import { SITE_ORIGIN } from "@/lib/site";

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_ORIGIN).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const producerRoutes = await listProducerRouteParams();

  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/our-purpose") },
    ...listCountrySlugs().map((country) => ({
      url: absoluteUrl(buildCatalogHref({ country })),
    })),
    ...listCountryAreaParams().map(({ country, area }) => ({
      url: absoluteUrl(buildCatalogHref({ country, area })),
    })),
    ...producerRoutes.map(({ country, area, slug }) => ({
      url: absoluteUrl(buildProducerHref({ slug }, { country, area })),
    })),
  ];
}
