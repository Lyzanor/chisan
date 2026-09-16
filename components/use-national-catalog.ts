"use client";

import { useEffect, useState } from "react";
import type { ExplorerCatalog, ExplorerCatalogPage } from "@/lib/catalog/explorer";
import type { Locale } from "@/lib/i18n/locales";

// Lazily load bounded pages once per mounted explorer; no visitor position is sent.
export function useNationalCatalog(country: string, locale: Locale, enabled: boolean) {
  const [catalog, setCatalog] = useState<ExplorerCatalog>();
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled || catalog) return;
    const controller = new AbortController();
    async function load() {
      try {
        async function read(offset = 0, revision?: string): Promise<ExplorerCatalogPage> {
          const query = new URLSearchParams({ country, locale, offset: String(offset), ...(revision ? { revision } : {}) });
          const response = await fetch(`/api/catalog/v1/explorer?${query}`, { signal: controller.signal });
          if (!response.ok) throw new Error("Catalog unavailable");
          return response.json();
        }
        const first = await read();
        const producers = [...first.producers];
        // Four independent pages at a time; never expose a partial national set.
        for (let offset = first.limit; offset < first.total; offset += first.limit * 4) {
          const pages = await Promise.all(Array.from({ length: 4 }, (_, i) => offset + i * first.limit)
            .filter((value) => value < first.total).map((value) => read(value, first.revision)));
          for (const page of pages) {
            if (page.revision !== first.revision) throw new Error("Catalog changed");
            producers.push(...page.producers);
          }
        }
        if (!controller.signal.aborted) {
          setCatalog({ revision: first.revision, producers });
          setError(false);
        }
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [country, locale, enabled, catalog, attempt]);
  return { catalog, error, retry: () => { setError(false); setAttempt((value) => value + 1); } };
}
