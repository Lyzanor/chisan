import { getCurrentAccount } from "@/lib/accounts/auth";
import { handleProducerIntentClick } from "@/lib/producer-stats/ingestion";
import { isProducerStatsEnabled } from "@/lib/producer-stats/policy";
import { getProducerStatsService } from "@/lib/producer-stats/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleProducerIntentClick(request, {
    enabled: isProducerStatsEnabled(),
    viewerId: async () => (await getCurrentAccount())?.id ?? null,
    record: (input) => getProducerStatsService().recordAction(input),
  });
}
