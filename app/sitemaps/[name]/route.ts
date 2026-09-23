import { getNamedSitemapXml, listNamedSitemaps } from "@/lib/sitemap-index";
import { serializeSitemap, sitemapXmlResponse } from "@/lib/sitemap-xml";
import { isPublicDiscoveryEnabled } from "@/lib/site";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return isPublicDiscoveryEnabled()
    ? (await listNamedSitemaps()).map(({ name }) => ({ name }))
    : [];
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!isPublicDiscoveryEnabled()) return sitemapXmlResponse(serializeSitemap([]));
  const xml = await getNamedSitemapXml((await params).name);
  if (xml === null) return new Response("Sitemap not found", { status: 404 });
  return sitemapXmlResponse(xml);
}
