import "server-only";

import { listCountryProducers, listPublishedCountries } from "../csv-catalog";
import { getCategoryPresentation } from "../i18n/categories";

// The catalog is immutable within a deployment, like its underlying CSV cache.
// Account state and request preferences never enter this process-local summary.
let summary: ReturnType<typeof summarizeHomeCatalog> | undefined;

async function summarizeHomeCatalog() {
  const producers = (await Promise.all(listPublishedCountries()
    .map((country) => listCountryProducers(country.slug)))).flat();
  const totals = new Map<string, number>();
  for (const { categories } of producers) {
    for (const category of new Set(categories)) {
      if (category === "Otros") continue;
      totals.set(category, (totals.get(category) ?? 0) + 1);
    }
  }
  return {
    producerCount: producers.length,
    categoryCounts: [...totals].sort(([, a], [, b]) => b - a).slice(0, 12)
      .map(([category, count]) => ({ ...getCategoryPresentation(category, "es"), count })),
  };
}

export function loadHomeCatalogSummary() {
  if (!summary) {
    const pending = summarizeHomeCatalog();
    summary = pending;
    void pending.catch(() => { if (summary === pending) summary = undefined; });
  }
  return summary;
}
