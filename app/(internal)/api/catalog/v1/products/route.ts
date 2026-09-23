import { catalogOptions, catalogResponse, readCatalogQuery } from "@/lib/agents/catalog-http";
import { productSearchInputSchema } from "@/lib/agents/catalog-schema";
import { searchPublicProducts } from "@/lib/agents/public-products";

export const runtime = "nodejs";
export function GET(request: Request) {
  return catalogResponse(request, () => searchPublicProducts(productSearchInputSchema.parse(
    readCatalogQuery(request, ["producer_id", "limit", "offset"], ["lat", "lon", "radius_km"]),
  )));
}
export const OPTIONS = catalogOptions;
