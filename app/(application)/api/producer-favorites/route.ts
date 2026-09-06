import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import { producerKeySchema } from "@/lib/accounts/input";
import { listProducerFavoriteSupporters } from "@/lib/accounts/producer-favorites";
import { findProducerById, findPublishedCountry } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET(request: Request) {
  const url = new URL(request.url);
  const identity = producerKeySchema.safeParse(
    Object.fromEntries(url.searchParams),
  );
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const config = getAccountSystemConfiguration();
  if (!config.featureEnabled || !config.databaseConfigured)
    return Response.json({ error: "unavailable" }, { status: 503, headers });
  if (
    !identity.success ||
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    offset > 100_000
  )
    return Response.json({ error: "invalid" }, { status: 400, headers });
  try {
    if (
      !findPublishedCountry(identity.data.country) ||
      !(await findProducerById(identity.data.country, identity.data.producerId))
    )
      return Response.json({ error: "missing" }, { status: 404, headers });
    return Response.json(
      await listProducerFavoriteSupporters(
        getDatabase(),
        identity.data,
        offset,
      ),
      { headers },
    );
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503, headers });
  }
}
