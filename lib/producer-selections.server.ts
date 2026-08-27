import "server-only";

import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import type { LocatedProducerCsvRow } from "@/lib/csv-catalog";
import { getCategoryLabel } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";
import {
  producerSelectionItemKey,
  type ProducerSelectionItem,
} from "@/lib/producer-selections";

export function buildProducerSelectionItems(
  producers: readonly (LocatedProducerCsvRow | null)[],
  presentation: { explicitLocale: Locale | null; locale: Locale },
): ProducerSelectionItem[] {
  return producers.flatMap((producer) => {
    if (!producer) return [];

    return [
      {
        key: producerSelectionItemKey(producer),
        country: producer.country,
        producerId: producer.producerId,
        area: producer.area,
        slug: producer.slug,
        name: producer.name,
        city: producer.city,
        category: producer.category,
        categories: producer.categories.map((category) =>
          getCategoryLabel(category, presentation.locale),
        ),
        href: buildAccountProducerHref(producer, presentation.explicitLocale),
        latitude: producer.latitude,
        longitude: producer.longitude,
      },
    ];
  });
}
