"use client";

import { useEffect, useState } from "react";
import type { ExplorerCatalog } from "@/lib/catalog/explorer";
import { loadNationalCatalog } from "@/lib/catalog/national-catalog";
import type { Locale } from "@/lib/i18n/locales";

export function useNationalCatalog(country: string, locale: Locale, enabled: boolean) {
  const key = `${country}/${locale}`;
  const [state, setState] = useState<{ key: string; catalog?: ExplorerCatalog; error?: boolean }>();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void loadNationalCatalog(country, locale).then(
      (catalog) => { if (!cancelled) setState({ key, catalog }); },
      () => { if (!cancelled) setState({ key, error: true }); },
    );
    return () => { cancelled = true; };
  }, [country, locale, key, enabled, attempt]);
  const current = state?.key === key ? state : undefined;
  return { catalog: current?.catalog, error: current?.error ?? false,
    retry: () => { setState(undefined); setAttempt((value) => value + 1); } };
}
