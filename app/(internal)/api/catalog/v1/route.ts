import { catalogOptions, catalogResponse, readCatalogQuery } from "@/lib/agents/catalog-http";
import { catalogInputSchema } from "@/lib/agents/catalog-schema";
import { describePublicCatalog } from "@/lib/agents/public-catalog";

export const runtime = "nodejs";
export function GET(request: Request) {
  return catalogResponse(request, () => {
    catalogInputSchema.parse(readCatalogQuery(request));
    return describePublicCatalog();
  }, true);
}
export const OPTIONS = catalogOptions;
