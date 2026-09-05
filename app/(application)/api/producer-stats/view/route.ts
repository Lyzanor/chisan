import { getCurrentAccount } from "@/lib/accounts/auth";
import { handleProducerProfileView } from "@/lib/producer-stats/ingestion";
import { isProducerStatsEnabled } from "@/lib/producer-stats/policy";
import { getProducerStatsService } from "@/lib/producer-stats/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleProducerProfileView(request, {
    enabled: isProducerStatsEnabled(),
    viewerId: async () => (await getCurrentAccount())?.id ?? null,
    record: (input) => getProducerStatsService().record(input),
  });
}
