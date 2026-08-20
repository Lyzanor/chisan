import type { MetadataRoute } from "next";

import { buildCatalogHref, buildProducerHref } from "@/lib/catalog-navigation";
import {
  listCountryAreaParams,
  listCountrySlugs,
  listProducerRouteParams,
} from "@/lib/csv-catalog";

const SITE_URL = "https://km0-nu.vercel.app";

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const producerRoutes = await listProducerRouteParams();

  return [
    { url: absoluteUrl("/") },
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
