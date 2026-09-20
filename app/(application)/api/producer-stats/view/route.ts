import { getCurrentAccount } from "@/lib/accounts/auth";
import { handleProducerProfileView } from "@/lib/producer-stats/ingestion";
import { isProducerStatsEnabled, PRODUCER_STATS_COLLECTION_PAUSED } from "@/lib/producer-stats/policy";
import { getProducerStatsService } from "@/lib/producer-stats/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleProducerProfileView(request, {
    enabled: !PRODUCER_STATS_COLLECTION_PAUSED && isProducerStatsEnabled(),
    viewerId: async () => (await getCurrentAccount())?.id ?? null,
    record: (input) => getProducerStatsService().record(input),
  });
}
