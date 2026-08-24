import type { MetadataRoute } from "next";

import {
  getCatalogSitemapShard,
  listCatalogSitemapDescriptors,
} from "@/lib/catalog-sitemap";
import { isPublicDiscoveryEnabled } from "@/lib/site";

// Next.js 16 exposes each generated id at /sitemap/<id>.xml and passes the id
// to the handler as a Promise. Keep one empty shard addressable before launch
// so the feature-flag behavior remains directly testable without publishing it.
export async function generateSitemaps(): Promise<{ id: number }[]> {
  if (!isPublicDiscoveryEnabled()) return [{ id: 0 }];
  return listCatalogSitemapDescriptors();
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  if (!isPublicDiscoveryEnabled()) return [];
  return getCatalogSitemapShard(await id);
}
