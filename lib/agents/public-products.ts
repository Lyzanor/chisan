import "server-only";
import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import { loadProducerContent } from "../catalog/content";
import { isDemoProducer } from "../catalog/product-commerce";
import { publicProductVisibility } from "../catalog/public-expanded";
import { normalizeCatalogSearch, rankCatalogEntries } from "../catalog-search";
import type { Locale } from "../i18n/locales";
import { SITE_ORIGIN } from "../site";
import { CATALOG_API_PATH, CATALOG_SCHEMA_VERSION, type PublicProduct, type PublicProducerBase, type productSearchInputSchema } from "./catalog-schema";
import { CatalogRequestError, producerSearchPredicate, publicExpanded, publicProducerIndex } from "./public-catalog";

export function productIndexEntry(producer: PublicProducerBase, product: PublicProduct["product"]) {
  return {
    country: producer.country,
    producerId: producer.producer_id,
    producer,
    result: {
      country: producer.country,
      producer_id: producer.producer_id,
      product_id: product.id,
      producer_name: producer.name,
      municipality: producer.municipality,
      url: producer.url,
      api_url: producer.api_url,
      store_url: producer.store_url,
      product,
    } satisfies PublicProduct,
    search: [
      { text: normalizeCatalogSearch(product.name), weight: 8 },
      { text: normalizeCatalogSearch(product.format ?? ""), weight: 2 },
      { text: normalizeCatalogSearch(product.description), weight: 1 },
    ],
  };
}
type ProductIndexEntry = ReturnType<typeof productIndexEntry>;

// Only immutable reviewed files are cached. Every response rechecks visibility.
const indexes = new Map<string, Promise<ProductIndexEntry[]>>();
async function productIndex(locale?: Locale): Promise<ProductIndexEntry[]> {
  const key = locale ?? "default";
  const existing = indexes.get(key);
  if (existing) return existing;
  const pending = (async () => {
    const base = await publicProducerIndex(locale);
    const producers = new Map(base.entries.map(({ producer }) => [`${producer.country}:${producer.producer_id}`, producer]));
    const candidates: PublicProducerBase[] = [];
    for (const country of new Set(base.entries.map(({ country }) => country))) {
      const files = await readdir(path.join(process.cwd(), "data/content", country)).catch((error) => {
        if (error.code === "ENOENT") return [];
        throw error;
      });
      for (const file of files) {
        if (!/^[1-9]\d*\.json$/.test(file)) continue;
        const producer = producers.get(`${country}:${file.slice(0, -5)}`);
        if (producer && !isDemoProducer(country, producer.producer_id)) candidates.push(producer);
      }
    }
    const entries: ProductIndexEntry[] = [];
    // Bound filesystem work; never probe a nonexistent package for every CSV row.
    for (let offset = 0; offset < candidates.length; offset += 16) {
      const batches = await Promise.all(candidates.slice(offset, offset + 16).map(async (producer) => {
        try {
          const content = await loadProducerContent(producer.country, producer.producer_id, producer.locale);
          return (publicExpanded({}, content)?.products ?? []).map((product) => productIndexEntry(producer, product));
        } catch {
          console.error("A reviewed product package is temporarily unavailable.");
          return [];
        }
      }));
      entries.push(...batches.flat());
    }
    return entries.sort((a, b) => a.country.localeCompare(b.country) || a.producerId - b.producerId || a.result.product_id.localeCompare(b.result.product_id));
  })();
  indexes.set(key, pending);
  void pending.catch(() => { if (indexes.get(key) === pending) indexes.delete(key); });
  return pending;
}

export function createPublicProductSearch(dependencies: {
  index: (locale?: Locale) => Promise<readonly ProductIndexEntry[]>;
  visibility: typeof publicProductVisibility;
}) {
  return async (input: z.infer<typeof productSearchInputSchema>) => {
    const matches = producerSearchPredicate(input);
    if (input.producer_id && !input.country)
      throw new CatalogRequestError(400, "invalid_query", "producer_id requires country.");
    if (input.product_id && (!input.country || !input.producer_id))
      throw new CatalogRequestError(400, "invalid_query", "product_id requires country and producer_id.");
    const index = (await dependencies.index(input.locale)).filter(({ country, producerId }) => !isDemoProducer(country, producerId));
    // Visibility is independent of the query. An unavailable database must not
    // turn the status flag into an oracle for text in hidden retained products.
    const identities = new Map(index.map(({ country, producerId }) => [`${country}:${producerId}`, { country, producerId }]));
    const visible = await dependencies.visibility([...identities.values()]);
    const results = rankCatalogEntries(index.filter((entry) =>
      visible?.has(`${entry.country}:${entry.producerId}`) && matches(entry.producer) &&
      (!input.producer_id || entry.producerId === input.producer_id) &&
      (!input.product_id || entry.result.product_id === input.product_id),
    ), input.q ?? "").map(({ result }) => result);
    const visibility = visible === null ? "unavailable" as const : "checked" as const;
    // Neither hashes nor totals disclose retained, currently hidden products.
    const revision = createHash("sha256").update("literal-products-v1").update(visibility).update(JSON.stringify(results)).digest("hex");
    if (input.revision && input.revision !== revision)
      throw new CatalogRequestError(409, "catalog_changed", "Products or visibility changed. Restart pagination at offset 0 without revision.");
    const nextOffset = input.offset + input.limit;
    const query = new URLSearchParams(Object.entries({ ...input, revision, offset: nextOffset })
      .filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]));
    return {
      schema_version: CATALOG_SCHEMA_VERSION,
      revision,
      total: results.length,
      limit: input.limit,
      offset: input.offset,
      next: nextOffset < results.length ? `${SITE_ORIGIN}${CATALOG_API_PATH}/products?${query}` : null,
      visibility,
      products: results.slice(input.offset, nextOffset),
    };
  };
}

export const searchPublicProducts = createPublicProductSearch({ index: productIndex, visibility: publicProductVisibility });
