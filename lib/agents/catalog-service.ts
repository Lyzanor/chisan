import "server-only";
import { catalogInputSchema, producerInputSchema, productSearchInputSchema, searchInputSchema, type catalogOperations } from "./catalog-schema";
import { describePublicCatalog, getPublicProducer, searchPublicProducers } from "./public-catalog";
import { searchPublicProducts } from "./public-products";

export type CatalogOperationName = typeof catalogOperations[number]["name"];
export async function executeCatalogOperation(name: CatalogOperationName, input: unknown) {
  switch (name) {
    case "chisan_catalog":
      catalogInputSchema.parse(input);
      return describePublicCatalog();
    case "chisan_search_producers": return searchPublicProducers(searchInputSchema.parse(input));
    case "chisan_search_products": return searchPublicProducts(productSearchInputSchema.parse(input));
    case "chisan_get_producer": return getPublicProducer(producerInputSchema.parse(input));
  }
}
