import { isAccountSystemConfigured } from "@/lib/accounts/config";
import { producerKeySchema } from "@/lib/accounts/input";
import { loadProducerViewerState } from "@/lib/accounts/producer-viewer-state.server";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  const identity = producerKeySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!identity.success) return Response.json({ error: "invalid" }, { status: 400, headers });
  if (!isAccountSystemConfigured()) return Response.json({ error: "unavailable" }, { status: 503, headers });
  try {
    const state = await loadProducerViewerState(identity.data.country, identity.data.producerId);
    if (!state.signedIn) return Response.json({ error: "unauthorized" }, { status: 401, headers });
    return Response.json(state, { headers });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503, headers });
  }
}
