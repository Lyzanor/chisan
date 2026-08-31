import "server-only";

import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import {
  findPublishedCountry,
  type LocatedProducerCsvRow,
} from "@/lib/csv-catalog";
import { getCategoryLabel } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";
import {
  producerSelectionItemKey,
  type ProducerSelectionItem,
} from "@/lib/producer-selections";

const DESCRIPTION_PREVIEW_MAX_LENGTH = 120;

function getDescriptionPreview(fields: Record<string, string>): string {
  const description =
    Object.entries(fields)
      .find(([field]) => field.toLocaleLowerCase() === "descripcion")?.[1]
      ?.trim() ?? "";
  const characters = Array.from(description);

  if (characters.length <= DESCRIPTION_PREVIEW_MAX_LENGTH) {
    return description;
  }

  return `${characters
    .slice(0, DESCRIPTION_PREVIEW_MAX_LENGTH - 1)
    .join("")
    .trimEnd()}…`;
}

export function buildProducerSelectionItems(
  producers: readonly (LocatedProducerCsvRow | null)[],
  presentation: { explicitLocale: Locale | null; locale: Locale },
): ProducerSelectionItem[] {
  return producers.flatMap((producer) => {
    if (!producer || !findPublishedCountry(producer.country)) return [];

    return [
      {
        key: producerSelectionItemKey(producer),
        country: producer.country,
        producerId: producer.producerId,
        area: producer.area,
        slug: producer.slug,
        name: producer.name,
        city: producer.city,
        description: getDescriptionPreview(producer.fields),
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
