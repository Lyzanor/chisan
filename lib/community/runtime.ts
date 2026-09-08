import "server-only";
import { findProducerById, findPublishedCountry, findArea } from "@/lib/csv-catalog";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { getDatabase } from "@/lib/db";
import { createCommunityService } from "./service";
import { loadProducerContent } from "@/lib/catalog/content";
import { hashProducerContent } from "@/lib/accounts/producer-content-change";

export function communityService() {
  return createCommunityService({
    database: getDatabase(),
    catalog: async ({ country, producerId }) => {
      if (!findPublishedCountry(country)) return null;
      const producer = await findProducerById(country, producerId);
      if (producer && !findArea(country, producer.area)?.publishedLocales.length) return null;
      return producer
        ? {
            name: producer.name,
            city: producer.city,
            href: buildAccountProducerHref(producer, null),
            fields: producer.fields,
            contentHash: hashProducerContent(
              await loadProducerContent(country, producerId),
            ),
          }
        : null;
    },
  });
}
