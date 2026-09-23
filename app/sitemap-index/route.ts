import { listNamedSitemaps } from "@/lib/sitemap-index";
import { serializeSitemapIndex, sitemapXmlResponse } from "@/lib/sitemap-xml";
import { isPublicDiscoveryEnabled } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const sitemaps = isPublicDiscoveryEnabled() ? await listNamedSitemaps() : [];
  return sitemapXmlResponse(serializeSitemapIndex(sitemaps.map(({ url }) => url)));
}
