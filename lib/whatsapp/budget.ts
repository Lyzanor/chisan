import { and, count, eq, sql } from "drizzle-orm";
import type { Database } from "../db";
import { auditEvents } from "../db/schema";
import type { ProductExtractor } from "../intake/extractor";

const action = "whatsapp.extraction_reserved";
const targetId = "whatsapp-pilot";

export class WhatsAppBudgetExhausted extends Error {
  constructor() {
    super("WhatsApp extraction allowance exhausted");
  }
}

export function extractionCallLimit(
  environment: Record<string, string | undefined> = process.env,
) {
  const raw = environment.CHISAN_WHATSAPP_MAX_TOTAL_CALLS?.trim() || "0";
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)))
    throw new Error("Invalid WhatsApp total call allowance");
  return Number(raw);
}

/** Commit before calling the provider: failures/rollbacks never refund a slot. */
export async function reserveExtraction(database: Database, limit: number) {
  if (!Number.isSafeInteger(limit) || limit <= 0)
    throw new WhatsAppBudgetExhausted();
  await database.transaction(async (tx) => {
    await tx.execute(sql`set local lock_timeout = '5s'`);
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext('whatsapp-extraction-allowance'))`,
    );
    const [used] = await tx
      .select({ value: count() })
      .from(auditEvents)
      .where(and(eq(auditEvents.action, action), eq(auditEvents.targetId, targetId)));
    if (used.value >= limit) throw new WhatsAppBudgetExhausted();
    await tx.insert(auditEvents).values({
      actorKind: "system",
      actorKey: "whatsapp",
      action,
      targetType: "integration",
      targetId,
    });
  }, { isolationLevel: "read committed" });
}

export function withExtractionAllowance(
  extractor: ProductExtractor,
  reserve: () => Promise<void>,
): ProductExtractor {
  return {
    profile: extractor.profile,
    async extract(input) {
      await reserve();
      return extractor.extract(input);
    },
  };
}
