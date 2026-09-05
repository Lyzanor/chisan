import { catalogOptions, catalogResponse, readCatalogQuery } from "@/lib/agents/catalog-http";
import { searchInputSchema } from "@/lib/agents/catalog-schema";
import { searchPublicProducers } from "@/lib/agents/public-catalog";

export const runtime = "nodejs";
export function GET(request: Request) {
  return catalogResponse(request, () => searchPublicProducers(searchInputSchema.parse(readCatalogQuery(request, ["limit", "offset"]))), true);
}
export const OPTIONS = catalogOptions;
