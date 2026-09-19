import { and, count, eq, sql } from "drizzle-orm";
import type { Database } from "../db";
import { auditEvents } from "../db/schema";

// Keep the historical ledger identity so upgrades and old workers cannot reset it.
const action = "whatsapp.extraction_reserved";
const targetId = "whatsapp-pilot";

export class AIAllowanceExhausted extends Error {
  constructor() {
    super("Shared Chisan AI allowance exhausted");
  }
}

export function aiCallLimit(
  environment: Record<string, string | undefined> = process.env,
) {
  const raw = (environment.CHISAN_AI_MAX_TOTAL_CALLS?.trim() || environment.CHISAN_WHATSAPP_MAX_TOTAL_CALLS?.trim()) || "0";
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)))
    throw new Error("Invalid Chisan AI call allowance");
  return Number(raw);
}

/** Commit before calling the provider: failures/rollbacks never refund a slot. */
export async function reserveAIAttempt(database: Database, limit: number, capability = "producer-intake") {
  if (!/^[a-z][a-z0-9.-]{0,63}$/.test(capability)) throw new Error("Invalid AI capability key");
  if (!Number.isSafeInteger(limit) || limit <= 0)
    throw new AIAllowanceExhausted();
  await database.transaction(async (tx) => {
    await tx.execute(sql`set local lock_timeout = '5s'`);
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext('whatsapp-extraction-allowance'))`,
    );
    const [used] = await tx
      .select({ value: count() })
      .from(auditEvents)
      .where(and(eq(auditEvents.action, action), eq(auditEvents.targetId, targetId)));
    if (used.value >= limit) throw new AIAllowanceExhausted();
    await tx.insert(auditEvents).values({
      actorKind: "system",
      actorKey: "chisan-ai",
      metadata: { capability },
      action,
      targetType: "integration",
      targetId,
    });
  }, { isolationLevel: "read committed" });
}
