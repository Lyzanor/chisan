import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";

import { getDatabase } from "@/lib/db";
import { webhookReceipts } from "@/lib/db/schema";

const PROCESSING_LEASE_MS = 5 * 60 * 1_000;

export type WebhookReceiptClaim =
  | { kind: "claimed"; processingToken: string; receiptId: string }
  | { kind: "conflict" }
  | { kind: "processed" }
  | { kind: "processing" }
  | { kind: "retry" };

export async function claimWebhookReceipt(input: {
  eventId: string;
  eventOccurredAt: Date | null;
  eventType: string;
  payloadHash: string;
  provider: string;
  subject: string | null;
}): Promise<WebhookReceiptClaim> {
  const database = getDatabase();
  const [created] = await database
    .insert(webhookReceipts)
    .values({
      provider: input.provider,
      eventId: input.eventId,
      eventType: input.eventType,
      subject: input.subject,
      eventOccurredAt: input.eventOccurredAt,
      payloadHash: input.payloadHash,
    })
    .onConflictDoNothing()
    .returning({ id: webhookReceipts.id });

  let receiptId = created?.id;
  if (!receiptId) {
    const [existing] = await database
      .select({
        id: webhookReceipts.id,
        payloadHash: webhookReceipts.payloadHash,
        status: webhookReceipts.status,
      })
      .from(webhookReceipts)
      .where(
        and(
          eq(webhookReceipts.provider, input.provider),
          eq(webhookReceipts.eventId, input.eventId),
        ),
      )
      .limit(1);
    if (!existing || existing.payloadHash !== input.payloadHash) {
      return { kind: "conflict" };
    }
    if (existing.status === "processed") return { kind: "processed" };
    receiptId = existing.id;
  }

  const processingStartedAt = new Date();
  const processingToken = randomUUID();
  const leaseCutoff = new Date(processingStartedAt.getTime() - PROCESSING_LEASE_MS);
  const [claimed] = await database
    .update(webhookReceipts)
    .set({
      status: "processing",
      subject: input.subject,
      eventOccurredAt: input.eventOccurredAt,
      attempts: sql`${webhookReceipts.attempts} + 1`,
      errorMessage: null,
      processingStartedAt,
      processingToken,
      processedAt: null,
    })
    .where(
      and(
        eq(webhookReceipts.id, receiptId),
        or(
          inArray(webhookReceipts.status, ["received", "failed"]),
          and(
            eq(webhookReceipts.status, "processing"),
            or(
              isNull(webhookReceipts.processingStartedAt),
              lt(webhookReceipts.processingStartedAt, leaseCutoff),
            ),
          ),
        ),
      ),
    )
    .returning({ id: webhookReceipts.id });

  if (claimed) return { kind: "claimed", processingToken, receiptId };
  const [current] = await database
    .select({ status: webhookReceipts.status })
    .from(webhookReceipts)
    .where(eq(webhookReceipts.id, receiptId))
    .limit(1);
  if (current?.status === "processed") return { kind: "processed" };
  if (current?.status === "processing") return { kind: "processing" };
  return { kind: "retry" };
}

export async function completeWebhookReceipt(
  receiptId: string,
  processingToken: string,
): Promise<boolean> {
  const [completed] = await getDatabase()
    .update(webhookReceipts)
    .set({
      status: "processed",
      processedAt: new Date(),
      processingStartedAt: null,
      processingToken: null,
      errorMessage: null,
    })
    .where(
      and(
        eq(webhookReceipts.id, receiptId),
        eq(webhookReceipts.status, "processing"),
        eq(webhookReceipts.processingToken, processingToken),
      ),
    )
    .returning({ id: webhookReceipts.id });
  return Boolean(completed);
}

export async function failWebhookReceipt(
  receiptId: string,
  processingToken: string,
  errorMessage: string,
): Promise<void> {
  await getDatabase()
    .update(webhookReceipts)
    .set({
      status: "failed",
      errorMessage: errorMessage.slice(0, 2_000),
      processingStartedAt: null,
      processingToken: null,
      processedAt: null,
    })
    .where(
      and(
        eq(webhookReceipts.id, receiptId),
        eq(webhookReceipts.status, "processing"),
        eq(webhookReceipts.processingToken, processingToken),
      ),
    );
}
