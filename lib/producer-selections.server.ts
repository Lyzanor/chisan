import "server-only";

import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import {
  findPublishedCountry,
  type LocatedProducerCsvRow,
} from "@/lib/csv-catalog";
import { getCategoryIcon, getCategoryLabel } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";
import {
  producerSelectionItemKey,
  getProducerSelectionInitialFocusKeys,
  type ProducerSelectionPageModel,
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
        imageSrc: producer.imageSrc,
        icon: getCategoryIcon(producer.category),
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

export function buildAccountSelectionPage(
  profile: {
    publicHandle: string | null;
    displayName: string | null;
    selectionTitle: string | null;
    selectionDescription: string | null;
  },
  items: ProducerSelectionItem[],
  canonicalPath = `/u/${profile.publicHandle}`,
): ProducerSelectionPageModel {
  const owner =
    profile.displayName ||
    (profile.publicHandle ? `@${profile.publicHandle}` : "Chisan");
  return {
    kind: "account-selection",
    canonicalPath,
    eyebrow: profile.publicHandle
      ? `Selección de @${profile.publicHandle}`
      : "Selección de productores",
    title: profile.selectionTitle || owner,
    description:
      profile.selectionDescription ||
      `Una selección de productores elegidos por ${owner}.`,
    emptyMessage: "Esta selección todavía no tiene productores.",
    items,
    initialFocusKeys: getProducerSelectionInitialFocusKeys(items),
  };
}
