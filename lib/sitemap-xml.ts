import type { MetadataRoute } from "next";

export const SITEMAP_SHARD_URL_LIMIT = 40_000;
export const SITEMAP_GOOGLE_URL_LIMIT = 50_000;
export const SITEMAP_SHARD_BYTE_LIMIT = 40 * 1024 * 1024;
export const SITEMAP_GOOGLE_BYTE_LIMIT = 50 * 1024 * 1024;

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n';
const URLSET_OPEN = `${XML_HEADER}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
const URLSET_CLOSE = "</urlset>\n";

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

function serializeEntry(entry: MetadataRoute.Sitemap[number]): string {
  const lines = [`  <url>`, `    <loc>${escapeXml(entry.url)}</loc>`];
  if (entry.lastModified) {
    const date = entry.lastModified instanceof Date
      ? entry.lastModified.toISOString() : entry.lastModified;
    lines.push(`    <lastmod>${escapeXml(date)}</lastmod>`);
  }
  for (const [language, url] of Object.entries(entry.alternates?.languages ?? {})) {
    if (url) lines.push(`    <xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(url)}" />`);
  }
  lines.push("  </url>\n");
  return lines.join("\n");
}

export function serializeSitemap(entries: readonly MetadataRoute.Sitemap[number][]): string {
  return URLSET_OPEN + entries.map(serializeEntry).join("") + URLSET_CLOSE;
}

// Count UTF-8 bytes including escaping, alternates and the XML envelope.
export function shardSitemapEntries(
  entries: readonly MetadataRoute.Sitemap[number][],
  urlLimit = SITEMAP_SHARD_URL_LIMIT,
  byteLimit = SITEMAP_SHARD_BYTE_LIMIT,
): MetadataRoute.Sitemap[] {
  if (!Number.isSafeInteger(urlLimit) || urlLimit < 1 || urlLimit >= SITEMAP_GOOGLE_URL_LIMIT) {
    throw new Error(`Sitemap shard limit must be an integer below ${SITEMAP_GOOGLE_URL_LIMIT}.`);
  }
  const envelopeBytes = Buffer.byteLength(URLSET_OPEN + URLSET_CLOSE);
  if (!Number.isSafeInteger(byteLimit) || byteLimit <= envelopeBytes || byteLimit >= SITEMAP_GOOGLE_BYTE_LIMIT) {
    throw new Error("Sitemap byte limit must fit the XML envelope and stay below 50 MiB.");
  }
  const shards: MetadataRoute.Sitemap[] = [];
  let shard: MetadataRoute.Sitemap = [];
  let bytes = envelopeBytes;
  for (const entry of entries) {
    const entryBytes = Buffer.byteLength(serializeEntry(entry));
    if (envelopeBytes + entryBytes > byteLimit) throw new Error(`Sitemap entry exceeds byte limit: ${entry.url}`);
    if (shard.length && (shard.length >= urlLimit || bytes + entryBytes > byteLimit)) {
      shards.push(shard);
      shard = [];
      bytes = envelopeBytes;
    }
    shard.push(entry);
    bytes += entryBytes;
  }
  if (shard.length) shards.push(shard);
  return shards;
}

export function serializeSitemapIndex(urls: readonly string[]): string {
  const xml = `${XML_HEADER}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <sitemap><loc>${escapeXml(url)}</loc></sitemap>\n`).join("")}</sitemapindex>\n`;
  if (urls.length > SITEMAP_GOOGLE_URL_LIMIT || Buffer.byteLength(xml) > SITEMAP_GOOGLE_BYTE_LIMIT) {
    throw new Error("Sitemap index exceeds protocol limits.");
  }
  return xml;
}

export function sitemapXmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
