import { createHash, randomUUID } from "node:crypto";

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { and, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";

import {
  markClerkIdentityDeleted,
  syncClerkIdentity,
  type ClerkIdentityInput,
} from "@/lib/accounts/auth";
import { isAccountSystemConfigured } from "@/lib/accounts/config";
import { getDatabase } from "@/lib/db";
import { webhookReceipts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const PROCESSING_LEASE_MS = 5 * 60 * 1_000;

type ClerkEmailAddress = {
  id?: string;
  email_address?: string;
  verification?: { status?: string | null } | null;
};

type ClerkUserPayload = {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
  has_image?: boolean;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
  updated_at?: number | null;
};

function normalizedSubject(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const subject = value.trim();
  return subject && subject.length <= 255 ? subject : null;
}

function clerkUpdatedAt(value: number | null | undefined): Date | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function svixOccurredAt(value: string | null): Date | null {
  if (!value || !/^\d{1,12}$/.test(value)) return null;
  const seconds = Number(value);
  if (!Number.isSafeInteger(seconds) || seconds <= 0) return null;
  const date = new Date(seconds * 1_000);
  return Number.isNaN(date.getTime()) ? null : date;
}

function identityFromWebhook(
  data: ClerkUserPayload,
  eventId: string,
  eventOccurredAt: Date,
): ClerkIdentityInput | null {
  const subject = normalizedSubject(data.id);
  if (!subject) return null;
  const emails = data.email_addresses ?? [];
  const primary =
    emails.find((email) => email.id === data.primary_email_address_id) ?? emails[0];
  const email = primary?.email_address?.trim() || null;
  const displayName =
    [data.first_name, data.last_name].filter(Boolean).join(" ").trim() ||
    data.username?.trim() ||
    email?.split("@")[0] ||
    null;

  return {
    subject,
    email,
    emailVerified: primary?.verification?.status === "verified",
    displayName,
    imageUrl: data.has_image ? data.image_url : null,
    providerUpdatedAt: clerkUpdatedAt(data.updated_at) ?? eventOccurredAt,
    providerEventId: eventId,
  };
}

function safeErrorMessage(error: unknown): string {
  const errorName =
    error instanceof Error && /^[A-Za-z][A-Za-z0-9]*$/.test(error.name)
      ? error.name
      : "Error";
  return `Webhook processing failed (${errorName}).`;
}

export async function POST(request: NextRequest): Promise<Response> {
  if (
    !isAccountSystemConfigured() ||
    !process.env.CLERK_WEBHOOK_SIGNING_SECRET?.trim()
  ) {
    return new Response("Webhook integration is not configured.", { status: 503 });
  }

  const eventId = request.headers.get("svix-id")?.trim();
  if (!eventId || eventId.length > 255) {
    return new Response("Missing webhook event ID.", { status: 400 });
  }

  const rawBody = await request.clone().text();
  const payloadHash = createHash("sha256").update(rawBody).digest("hex");

  let event: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response("Webhook signature verification failed.", { status: 400 });
  }

  const eventOccurredAt = svixOccurredAt(request.headers.get("svix-timestamp"));
  if (!eventOccurredAt) {
    return new Response("Invalid webhook timestamp.", { status: 400 });
  }
  const subject = normalizedSubject((event.data as { id?: unknown }).id);

  const database = getDatabase();
  const [createdReceipt] = await database
    .insert(webhookReceipts)
    .values({
      provider: "clerk",
      eventId,
      eventType: event.type,
      subject,
      eventOccurredAt,
      payloadHash,
    })
    .onConflictDoNothing()
    .returning({ id: webhookReceipts.id });

  if (!createdReceipt) {
    const [existing] = await database
      .select()
      .from(webhookReceipts)
      .where(
        and(
          eq(webhookReceipts.provider, "clerk"),
          eq(webhookReceipts.eventId, eventId),
        ),
      )
      .limit(1);

    if (!existing || existing.payloadHash !== payloadHash) {
      return new Response("Webhook event ID does not match its original payload.", {
        status: 409,
      });
    }
    if (existing.status === "processed") {
      return Response.json({ received: true, duplicate: true });
    }
  }

  const receiptId = createdReceipt?.id ??
    (
      await database
        .select({ id: webhookReceipts.id })
        .from(webhookReceipts)
        .where(
          and(
            eq(webhookReceipts.provider, "clerk"),
            eq(webhookReceipts.eventId, eventId),
          ),
        )
        .limit(1)
    )[0]?.id;
  if (!receiptId) {
    return new Response("Webhook receipt could not be loaded.", { status: 500 });
  }

  const processingStartedAt = new Date();
  const processingToken = randomUUID();
  const leaseCutoff = new Date(processingStartedAt.getTime() - PROCESSING_LEASE_MS);
  const [claimedReceipt] = await database
    .update(webhookReceipts)
    .set({
      status: "processing",
      subject,
      eventOccurredAt,
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

  if (!claimedReceipt) {
    const [currentReceipt] = await database
      .select({ status: webhookReceipts.status })
      .from(webhookReceipts)
      .where(eq(webhookReceipts.id, receiptId))
      .limit(1);
    if (currentReceipt?.status === "processed") {
      return Response.json({ received: true, duplicate: true });
    }
    if (currentReceipt?.status === "processing") {
      return Response.json({ received: true, processing: true }, { status: 202 });
    }
    return new Response("Webhook receipt is available for retry.", { status: 503 });
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      const identity = identityFromWebhook(
        event.data as ClerkUserPayload,
        eventId,
        eventOccurredAt,
      );
      if (!identity) {
        throw new Error("Clerk user event did not include a user ID.");
      }
      await syncClerkIdentity(identity);
    } else if (event.type === "user.deleted") {
      if (!subject) throw new Error("Clerk deletion event did not include a user ID.");
      await markClerkIdentityDeleted(subject, { eventId, occurredAt: eventOccurredAt });
    }

    const [completedReceipt] = await database
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
    if (!completedReceipt) {
      return Response.json({ received: true, superseded: true }, { status: 202 });
    }
    return Response.json({ received: true });
  } catch (error) {
    await database
      .update(webhookReceipts)
      .set({
        status: "failed",
        errorMessage: safeErrorMessage(error),
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
    return new Response("Webhook processing failed and may be retried.", { status: 500 });
  }
}
