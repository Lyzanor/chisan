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

export function explorerSearchFields(producer: ExplorerProducer): CatalogSearchFields {
  return { name: producer.name, municipality: producer.city,
    categories: [...producer.categories, ...producer.categoryLabels],
    featuredProducts: producer.featuredProducts, description: producer.description };
}
