import { decodeExplorerPage, EXPLORER_COMPACT_FORMAT, EXPLORER_COMPACT_PAGE_SIZE,
  type CompactExplorerPage, type ExplorerCatalog, type ExplorerCatalogPage } from "./explorer";
import type { Locale } from "../i18n/locales";

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_ENTRIES = 4;

/** Browser-memory public data only. Shared loads survive an explorer unmount. */
export function createNationalCatalogLoader(fetcher: typeof fetch, now = Date.now) {
  const cache = new Map<string, { pending: Promise<ExplorerCatalog>; expiresAt: number }>();

  async function readCatalog(country: string, locale: Locale): Promise<ExplorerCatalog> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      async function read(offset = 0, revision?: string): Promise<ExplorerCatalogPage> {
        const query = new URLSearchParams({ country, locale, format: EXPLORER_COMPACT_FORMAT,
          offset: String(offset), ...(revision ? { revision } : {}) });
        const response = await fetcher(`/api/catalog/v1/explorer?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Catalog unavailable");
        const body: CompactExplorerPage = await response.json();
        if (body.country !== country || body.offset !== offset ||
          !Number.isInteger(body.total) || body.total < 0 ||
          !Number.isInteger(body.limit) || body.limit <= 0 || body.limit > EXPLORER_COMPACT_PAGE_SIZE ||
          (revision && body.revision !== revision)) throw new Error("Catalog changed");
        return decodeExplorerPage(body);
      }
      const first = await read();
      const producers = [...first.producers];
      // Bounded concurrency, with complete coverage required before publication.
      for (let offset = first.limit; offset < first.total; offset += first.limit * 4) {
        const pages = await Promise.all(Array.from({ length: 4 }, (_, i) => offset + i * first.limit)
          .filter((value) => value < first.total).map((value) => read(value, first.revision)));
        for (const page of pages) {
          if (page.total !== first.total || page.limit !== first.limit) throw new Error("Catalog changed");
          producers.push(...page.producers);
        }
      }
      if (producers.length !== first.total || new Set(producers.map((p) => p.producerId)).size !== first.total) {
        throw new Error("Incomplete catalog");
      }
      return { revision: first.revision, producers };
    } finally {
      clearTimeout(timeout);
      controller.abort();
    }
  }

  return function loadNationalCatalog(country: string, locale: Locale): Promise<ExplorerCatalog> {
    const key = `${country}/${locale}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now()) {
      cache.delete(key);
      cache.set(key, cached);
      return cached.pending;
    }
    cache.delete(key);
    const entry = { expiresAt: Infinity, pending: readCatalog(country, locale) };
    cache.set(key, entry);
    while (cache.size > CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
    void entry.pending.then(() => { entry.expiresAt = now() + CACHE_TTL_MS; }, () => {
      if (cache.get(key) === entry) cache.delete(key);
    });
    return entry.pending;
  };
}

export const loadNationalCatalog = createNationalCatalogLoader((...args) => fetch(...args));
