import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { buildProducerHref } from "../catalog-navigation";
import {
  findArea,
  findPublishedCountry,
  findProducersByIds,
  getLocalizedCatalogLabel,
  type ProducerIdentity,
} from "../csv-catalog";
import { getCategoryIcon } from "../get-category-icon";
import { buildCatalogScope } from "../i18n/catalog-scope";
import type { ProducerSelectionItem } from "../producer-selections";
import type { Guide } from "./schema";
import { parseGuideMarkdown } from "./markdown";

export const GUIDE_TOPICS = ["Quesos", "Vinos", "Miel", "Aceite", "Despensa", "Territorios"] as const;
const FEATURED_GUIDES = ["quesos-de-espana", "vinos-de-espana-denominaciones-origen", "miel-de-espana"];
export function listFeaturedGuides(): Guide[] {
  const guides = listPublishedGuides();
  return FEATURED_GUIDES.flatMap((slug) => guides.filter((guide) => guide.slug === slug));
}

export const GUIDES_PATH = "/guias";
export const GUIDES_TITLE = "Guías de productores y alimentos de España";
export const GUIDES_DESCRIPTION =
  "Quesos, vinos, miel y sus lugares de origen. Guías de Chisan para entender qué hace cada productor, comparar propuestas y explorar el mapa.";

export function guidePath(slug: string): string {
  return `${GUIDES_PATH}/${slug}`;
}

let publishedReadModel: Guide[] | undefined;

export function readGuides(): Guide[] {
  // Production content is immutable for a deployment; development reads edits immediately.
  if (process.env.NODE_ENV === "production" && publishedReadModel) return publishedReadModel;
  const directory = path.join(process.cwd(), "data/guides/es");
  const guides = readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const guide = parseGuideMarkdown(readFileSync(path.join(directory, file), "utf8"));
      if (file !== `${guide.slug}.md`)
        throw new Error(`Guide filename does not match its slug: ${file}`);
      return guide;
    });
  const slugs = new Set(guides.map((guide) => guide.slug));
  for (const guide of guides) {
    for (const related of guide.related) {
      if (!slugs.has(related))
        throw new Error(`${guide.slug}: unknown related guide ${related}`);
    }
  }
  if (process.env.NODE_ENV === "production") publishedReadModel = guides;
  return guides;
}

export function isGuidePublished(guide: Guide): boolean {
  return (
    guide.status === "published" && Boolean(findPublishedCountry(guide.country))
  );
}

export function listPublishedGuides(): Guide[] {
  return readGuides().filter(isGuidePublished);
}

export function listGuidesForProducer(identity: ProducerIdentity): Guide[] {
  return listPublishedGuides().filter((guide) =>
    guide.sections.some(
      (section) =>
        section.type === "producers" &&
        section.items.some(
          (item) =>
            item.country === identity.country &&
            item.producerId === identity.producerId,
        ),
    ),
  );
}

export type GuideProducer = ProducerSelectionItem & {
  focus: string;
  areaLabel: string;
};

export async function resolveGuideProducers(
  guide: Guide,
): Promise<GuideProducer[]> {
  const selections = guide.sections.flatMap((section) =>
    section.type === "producers" ? section.items : [],
  );
  const producers = await findProducersByIds(selections, guide.locale);
  return producers.map((producer, index) => {
    const reference = selections[index];
    if (!producer)
      throw new Error(
        `${guide.slug}: missing producer ${reference.country}:${reference.producerId}`,
      );
    const country = findPublishedCountry(producer.country);
    const area = findArea(producer.country, producer.area);
    if (!country || !area || !area.publishedLocales.includes(guide.locale)) {
      throw new Error(
        `${guide.slug}: producer ${producer.producerId} is not available in ${guide.locale}`,
      );
    }
    return {
      key: `${producer.country}:${producer.producerId}`,
      country: producer.country,
      producerId: producer.producerId,
      area: producer.area,
      areaLabel: getLocalizedCatalogLabel(area, guide.locale),
      slug: producer.slug,
      name: producer.name,
      city: producer.city,
      description: producer.fields.descripcion || "",
      imageSrc: producer.imageSrc,
      icon: getCategoryIcon(producer.category),
      categories: producer.categories,
      href: buildProducerHref(producer, {
        scope: buildCatalogScope(country, guide.locale),
        area: producer.area,
      }),
      latitude: producer.latitude,
      longitude: producer.longitude,
      focus: reference.focus,
    };
  });
}

export async function loadGuide(slug: string) {
  const guide = listPublishedGuides().find((entry) => entry.slug === slug);
  if (!guide) return null;
  return { guide, producers: await resolveGuideProducers(guide) };
}
