import "server-only";

import { buildAccountProducerHrefForPolicy } from "@/lib/accounts/catalog-link-policy";
import {
  findArea,
  findCountry,
  type LocatedProducerCsvRow,
} from "@/lib/csv-catalog";
import type { Locale } from "@/lib/i18n/locales";

export function buildAccountProducerHref(
  producer: LocatedProducerCsvRow,
  explicitLocale: Locale | null,
): string {
  const country = findCountry(producer.country);
  const area = findArea(producer.country, producer.area);

  if (!country || !area) {
    throw new Error(
      `Cannot resolve the current public catalog path for ${producer.country}/${producer.producerId}.`,
    );
  }

  return buildAccountProducerHrefForPolicy(producer, {
    country,
    localePolicy: area,
    explicitLocale,
  });
}
