import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { catalogResponse, readCatalogQuery } from "@/lib/agents/catalog-http";
import { readExplorerCatalog } from "@/lib/agents/public-catalog";
import { EXPLORER_COMPACT_FORMAT } from "@/lib/catalog/explorer";

export const runtime = "nodejs";
const input = z.strictObject({
  country: z.string().regex(/^[a-z]{2}$/),
  locale: z.enum(SUPPORTED_LOCALES),
  offset: z.number().int().min(0).max(1_000_000).default(0),
  revision: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  format: z.literal(EXPLORER_COMPACT_FORMAT).optional(),
});

/** Lazy browser index, also enabling national distance filtering without sending location. */
export async function GET(request: Request) {
  return catalogResponse(request, async () => {
    const query = input.parse(readCatalogQuery(request, ["offset"]));
    return readExplorerCatalog(query.country, query.locale, query.offset, query.revision, !!query.format);
  }, true);
}
