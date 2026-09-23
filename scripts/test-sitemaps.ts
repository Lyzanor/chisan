import assert from "node:assert/strict";
import test from "node:test";

import { GET as getIndex } from "../app/sitemap-index/route";
import { GET as getSitemap } from "../app/sitemaps/[name]/route";
import robots from "../app/robots";
import { listCatalogSitemapEntries, listCatalogSitemapGroups } from "../lib/catalog-sitemap";
import { getNamedSitemapXml, listNamedSitemaps } from "../lib/sitemap-index";
import {
  serializeSitemap, serializeSitemapIndex, shardSitemapEntries,
  SITEMAP_SHARD_BYTE_LIMIT, SITEMAP_SHARD_URL_LIMIT,
} from "../lib/sitemap-xml";

test("named sitemaps cover the catalog once with explicit territorial boundaries", async () => {
  const [sitemaps, entries, groups] = await Promise.all([
    listNamedSitemaps(), listCatalogSitemapEntries(), listCatalogSitemapGroups(),
  ]);
  assert.equal(new Set(sitemaps.map(({ name }) => name)).size, sitemaps.length);
  assert.deepEqual(sitemaps.flatMap(({ entries }) => entries), entries);
  for (const { name, url, entries } of sitemaps) {
    assert.equal(url, `https://chisan.app/sitemap-${name}.xml`);
    assert.ok(entries.length > 0 && entries.length <= SITEMAP_SHARD_URL_LIMIT);
    assert.ok(Buffer.byteLength(serializeSitemap(entries)) <= SITEMAP_SHARD_BYTE_LIMIT);
  }
  for (const { key, entries } of groups) {
    for (const entry of entries) {
      const segments = new URL(entry.url).pathname.split("/").filter(Boolean);
      if (key.startsWith("producers-")) {
        assert.equal(segments.length, 3);
        assert.equal(key, `producers-${segments[0].split("-").at(-1)}-${segments[1]}`);
        assert.equal(entry.lastModified, undefined, "No invented profile modification date");
      } else if (key.startsWith("catalog-")) {
        assert.ok(segments.length === 1 || segments.length === 2);
      } else if (key.startsWith("guides-")) {
        assert.equal(segments[1], "guias");
      } else if (key.startsWith("events-")) {
        assert.equal(segments[1], "eventos");
      } else {
        assert.equal(key, "pages");
      }
    }
  }
  assert.ok(sitemaps.some(({ name }) => name === "pages-1"));
  assert.ok(sitemaps.some(({ name }) => name === "producers-es-barcelona-1"));
  assert.equal(await getNamedSitemapXml("missing-1"), null);
  assert.equal(await getNamedSitemapXml("../pages-1"), null);
});

test("XML escapes URLs and alternates, preserves editorial dates and adds no SEO guesses", () => {
  const url = 'https://chisan.app/es/a?x=1&y="<test>"';
  const xml = serializeSitemap([{ url, lastModified: "2026-09-20", alternates: { languages: { es: url } } }]);
  assert.match(xml, /xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml"/);
  assert.match(xml, /&amp;y=&quot;&lt;test&gt;&quot;/);
  assert.match(xml, /<lastmod>2026-09-20<\/lastmod>/);
  assert.doesNotMatch(xml, /priority|changefreq/);
  assert.doesNotMatch(serializeSitemap([{ url }]), /lastmod/);
  assert.match(serializeSitemapIndex([url]), /&amp;y=&quot;&lt;test&gt;&quot;/);
  assert.doesNotMatch(serializeSitemapIndex([url]), /lastmod/);
});

test("shards split on serialized UTF-8 bytes as well as URL count", () => {
  const entry = { url: `https://chisan.app/${"ñ&".repeat(50)}` };
  const oneEntryBytes = Buffer.byteLength(serializeSitemap([entry]));
  const entries = Array.from({ length: 5 }, () => entry);
  const shards = shardSitemapEntries(entries, 100, oneEntryBytes);
  assert.deepEqual(shards.map((shard) => shard.length), [1, 1, 1, 1, 1]);
  assert.ok(shards.every((shard) => Buffer.byteLength(serializeSitemap(shard)) === oneEntryBytes));
  assert.deepEqual(shardSitemapEntries(entries, 2).map((shard) => shard.length), [2, 2, 1]);
  assert.deepEqual(shardSitemapEntries([]), []);
  assert.throws(() => shardSitemapEntries([entry], 100, oneEntryBytes - 1), /exceeds byte limit/);
  assert.throws(() => shardSitemapEntries([entry], 100, 50 * 1024 * 1024), /below 50 MiB/);
});

test("HTTP discovery is empty outside public Production and unknown public files return 404", async () => {
  const oldEnvironment = process.env.VERCEL_ENV;
  const oldDiscovery = process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED;
  const request = new Request("https://chisan.app/sitemap-pages-1.xml");
  const params = Promise.resolve({ name: "pages-1" });
  try {
    for (const [environment, enabled] of [["preview", "true"], ["production", "false"]]) {
      process.env.VERCEL_ENV = environment;
      process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = enabled;
      assert.doesNotMatch(await (await getIndex()).text(), /<loc>/);
      assert.doesNotMatch(await (await getSitemap(request, { params })).text(), /<loc>/);
      assert.equal((await robots()).sitemap, undefined);
    }
    process.env.VERCEL_ENV = "production";
    process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = "true";
    assert.equal((await robots()).sitemap, "https://chisan.app/sitemap.xml");
    const index = await getIndex();
    assert.equal(index.headers.get("content-type"), "application/xml; charset=utf-8");
    assert.match(await index.text(), /https:\/\/chisan.app\/sitemap-pages-1.xml/);
    const pages = await getSitemap(request, { params });
    assert.equal(pages.status, 200);
    assert.match(await pages.text(), /hreflang="es"/);
    assert.equal((await getSitemap(request, { params: Promise.resolve({ name: "missing-1" }) })).status, 404);
  } finally {
    if (oldEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = oldEnvironment;
    if (oldDiscovery === undefined) delete process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED;
    else process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = oldDiscovery;
  }
});
