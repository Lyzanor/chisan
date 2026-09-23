import type { PublicProducerBase } from "../agents/catalog-schema";
import type { CatalogSearchFields } from "../catalog-search";

export function publicCatalogSearchFields(producer: PublicProducerBase): CatalogSearchFields {
  return {
    name: producer.name,
    municipality: producer.municipality,
    categories: producer.categories.flatMap(({ token, label }) => [token, label]),
    featuredProducts: producer.featured_products ?? "",
    description: producer.description?.text ?? "",
  };
}

/** Compact public projection for the browser. Coordinates belong to producers. */
export function toExplorerProducer(producer: PublicProducerBase) {
  return {
    country: producer.country,
    producerId: producer.producer_id,
    key: String(producer.producer_id),
    slug: producer.slug,
    href: new URL(producer.url).pathname,
    area: producer.area.slug,
    areaLabel: producer.area.name,
    name: producer.name,
    city: producer.municipality,
    category: producer.categories[0]?.token ?? "",
    categories: producer.categories.map(({ token }) => token),
    categoryLabels: producer.categories.map(({ label }) => label),
    featuredProducts: producer.featured_products ?? "",
    description: producer.description?.text ?? "",
    imageSrc: producer.image_url ? new URL(producer.image_url).pathname : "/productores/generica.webp",
    latitude: producer.coordinates?.latitude ?? null,
    longitude: producer.coordinates?.longitude ?? null,
  };
}

export type ExplorerProducer = ReturnType<typeof toExplorerProducer>;
export type ExplorerCatalog = { revision: string; producers: ExplorerProducer[] };
export type ExplorerCatalogPage = ExplorerCatalog & { total: number; limit: number; offset: number };

// Lossless transport: share labels and derive identity fields once in the browser.
// Every producer, searchable word and coordinate remains in the projection.
export const EXPLORER_COMPACT_FORMAT = "compact-v1";
export const EXPLORER_COMPACT_PAGE_SIZE = 5000;
type ExplorerRow = [
  id: number, slug: string, area: number, name: string, city: string,
  categories: number[], featuredProducts: string, description: string,
  image: string, latitude: number | null, longitude: number | null,
];
export type CompactExplorerPage = Omit<ExplorerCatalogPage, "producers"> & {
  format: typeof EXPLORER_COMPACT_FORMAT;
  country: string;
  pathPrefix: string;
  areas: [slug: string, label: string][];
  categories: [token: string, label: string][];
  producers: ExplorerRow[];
};

export function encodeExplorerPage(
  page: ExplorerCatalogPage, country: string, pathPrefix: string,
): CompactExplorerPage {
  const areas: CompactExplorerPage["areas"] = [];
  const categories: CompactExplorerPage["categories"] = [];
  const areaIds = new Map<string, number>();
  const categoryIds = new Map<string, number>();
  const producers = page.producers.map((producer): ExplorerRow => {
    if (!areaIds.has(producer.area)) {
      areaIds.set(producer.area, areas.length);
      areas.push([producer.area, producer.areaLabel]);
    }
    const tokens = producer.categories.map((token, i) => {
      if (!categoryIds.has(token)) {
        categoryIds.set(token, categories.length);
        categories.push([token, producer.categoryLabels[i]]);
      }
      return categoryIds.get(token)!;
    });
    return [producer.producerId, producer.slug, areaIds.get(producer.area)!,
      producer.name, producer.city, tokens, producer.featuredProducts,
      producer.description, producer.imageSrc, producer.latitude, producer.longitude];
  });
  return { ...page, format: EXPLORER_COMPACT_FORMAT, country, pathPrefix,
    areas, categories, producers };
}

export function decodeExplorerPage(page: CompactExplorerPage): ExplorerCatalogPage {
  if (page.format !== EXPLORER_COMPACT_FORMAT) throw new Error("Unsupported explorer format");
  const producers = page.producers.map((row): ExplorerProducer => {
    const [producerId, slug, areaId, name, city, categoryIds,
      featuredProducts, description, imageSrc, latitude, longitude] = row;
    const [area, areaLabel] = page.areas[areaId];
    const categories = categoryIds.map((id) => page.categories[id][0]);
    return { country: page.country, producerId, key: String(producerId), slug,
      href: `${page.pathPrefix}/${area}/${slug}`, area, areaLabel, name, city,
      category: categories[0] ?? "", categories,
      categoryLabels: categoryIds.map((id) => page.categories[id][1]),
      featuredProducts, description, imageSrc, latitude, longitude };
  });
  return { revision: page.revision, total: page.total, limit: page.limit,
    offset: page.offset, producers };
}

export function explorerSearchFields(producer: ExplorerProducer): CatalogSearchFields {
  return { name: producer.name, municipality: producer.city,
    categories: [...producer.categories, ...producer.categoryLabels],
    featuredProducts: producer.featuredProducts, description: producer.description };
}
