import "server-only";

import { revalidatePath } from "next/cache";
import { buildProducerHref } from "../catalog-navigation";
import { findArea, findProducerById, findPublishedCountry } from "../csv-catalog";
import { buildCatalogScope } from "../i18n/catalog-scope";

/** Call after commit. Only public presentation is cached, never authorization. */
export async function revalidatePublicProducer(countrySlug: string, producerId: number) {
  const country = findPublishedCountry(countrySlug);
  if (!country) return;
  const producer = await findProducerById(countrySlug, producerId);
  const area = producer ? findArea(countrySlug, producer.area) : null;
  if (!producer || !area) return;
  for (const locale of area.publishedLocales) {
    revalidatePath(buildProducerHref(producer, {
      scope: buildCatalogScope(country, locale), area: area.slug,
    }));
  }
}
