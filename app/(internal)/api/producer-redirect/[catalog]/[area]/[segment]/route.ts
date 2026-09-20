import { buildProducerHref, readCatalogQueryContext } from "@/lib/catalog-navigation";
import { resolveProducerCatalog } from "@/lib/catalog-routing";

export async function GET(request: Request, { params }: {
  params: Promise<{ catalog: string; area: string; segment: string }>;
}) {
  const { catalog, area, segment } = await params;
  const resolved = await resolveProducerCatalog(catalog, area, segment);
  if (!resolved) return new Response(null, { status: 404 });
  const search = new URL(request.url).searchParams;
  const query = readCatalogQueryContext({ category: search.getAll("category"), highlight: search.getAll("highlight") });
  return new Response(null, { status: 308, headers: {
    location: buildProducerHref(resolved.producer, {
      scope: resolved.scope, area: resolved.area, ...query,
      highlight: query.highlight ? resolved.producer.slug : undefined,
    }),
  } });
}
