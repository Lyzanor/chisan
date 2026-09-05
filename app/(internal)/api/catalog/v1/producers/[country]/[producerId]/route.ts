import { catalogOptions, catalogResponse, readCatalogQuery } from "@/lib/agents/catalog-http";
import { producerInputSchema } from "@/lib/agents/catalog-schema";
import { CatalogRequestError, getPublicProducer } from "@/lib/agents/public-catalog";

export const runtime = "nodejs";
export function GET(request: Request, context: { params: Promise<{ country: string; producerId: string }> }) {
  return catalogResponse(request, async () => {
    const { country, producerId } = await context.params;
    if (!/^[1-9]\d*$/.test(producerId)) throw new CatalogRequestError(400, "invalid_query", "Producer ID must be a positive integer.");
    const query = readCatalogQuery(request);
    if ("country" in query || "producer_id" in query) throw new CatalogRequestError(400, "invalid_query", "Producer identity belongs in the URL path.");
    return getPublicProducer(producerInputSchema.parse({ ...query, country, producer_id: Number(producerId) }));
  });
}
export const OPTIONS = catalogOptions;
