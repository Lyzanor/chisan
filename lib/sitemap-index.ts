import { listCatalogSitemapGroups } from "./catalog-sitemap";
import { SITE_ORIGIN } from "./site";
import { serializeSitemap, shardSitemapEntries } from "./sitemap-xml";

export const SITEMAP_INDEX_PATH = "/sitemap.xml";

export async function listNamedSitemaps() {
  const groups = await listCatalogSitemapGroups();
  return groups.flatMap(({ key, entries }) =>
    shardSitemapEntries(entries).map((entries, index) => {
      // Always keep the part suffix: growth never renames the first file.
      const name = `${key}-${index + 1}`;
      return { name, url: `${SITE_ORIGIN}/sitemap-${name}.xml`, entries };
    }),
  );
}

export async function getNamedSitemapXml(name: string): Promise<string | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) return null;
  const sitemap = (await listNamedSitemaps()).find((sitemap) => sitemap.name === name);
  return sitemap ? serializeSitemap(sitemap.entries) : null;
}
