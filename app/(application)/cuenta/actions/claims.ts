"use server";

import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  claimSubmissionSchema,
  firstValidationMessage,
  formString,
} from "@/lib/accounts/input";
import { hashProducerFields } from "@/lib/accounts/producer-fields";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  auditEvents,
  producerClaims,
  producerMemberships,
  users,
} from "@/lib/db/schema";

import { redirectWithMessage } from "./navigation";
const CLAIM_MAX_OPEN_PER_ACCOUNT = 5;
const CLAIM_MAX_SUBMISSIONS_PER_DAY = 10;
const ONE_DAY_MS = 24 * 60 * 60 * 1_000;
export async function submitProducerClaimAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/reclamaciones/nueva");
  if (!account.emailVerified) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "Verify your sign-in email before claiming a producer.",
    );
  }
  if (!account.termsAcceptedAt) {
    redirect("/cuenta/bienvenida");
  }

  const parsed = claimSubmissionSchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
    method: formString(formData, "method"),
    contactEmail: formString(formData, "contactEmail"),
    proof: formString(formData, "proof"),
  });
  if (!parsed.success) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      firstValidationMessage(parsed.error),
    );
  }

  const producer = await findProducerById(
    parsed.data.country,
    parsed.data.producerId,
  );
  if (!producer) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "That producer is no longer in the catalog.",
    );
  }
  const database = getDatabase();
  const claimResult = await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${parsed.data.country}:${parsed.data.producerId}`}))`,
    );
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`account-claim:${account.id}`}))`,
    );

    const [[activeOwner], [openCount], [recentCount]] = await Promise.all([
      transaction
        .select({ userId: producerMemberships.userId })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.country, parsed.data.country),
            eq(producerMemberships.producerId, parsed.data.producerId),
            eq(producerMemberships.role, "owner"),
            eq(producerMemberships.status, "active"),
          ),
        )
        .for("update")
        .limit(1),
      transaction
        .select({ value: count() })
        .from(producerClaims)
        .where(
          and(
            eq(producerClaims.claimantUserId, account.id),
            inArray(producerClaims.status, ["draft", "pending", "needs_info"]),
          ),
        ),
      transaction
        .select({ value: count() })
        .from(auditEvents)
        .where(
          and(
            eq(auditEvents.actorUserId, account.id),
            eq(auditEvents.action, "producer_claim.submitted"),
            gte(auditEvents.occurredAt, new Date(Date.now() - ONE_DAY_MS)),
          ),
        ),
    ]);

    if (activeOwner) {
      return activeOwner.userId === account.id
        ? "already-owner"
        : "already-claimed";
    }
    if (openCount.value >= CLAIM_MAX_OPEN_PER_ACCOUNT) return "open-limit";
    if (recentCount.value >= CLAIM_MAX_SUBMISSIONS_PER_DAY)
      return "daily-limit";

    const [created] = await transaction
      .insert(producerClaims)
      .values({
        claimantUserId: account.id,
        country: parsed.data.country,
        producerId: parsed.data.producerId,
        status: "pending",
        proofMethod: parsed.data.method,
        proof: {
          contactEmail: parsed.data.contactEmail || null,
          producerName: producer.name,
          producerSlug: producer.slug,
          area: producer.area,
          baseRowHash: hashProducerFields(producer.fields),
        },
        claimantMessage: parsed.data.proof,
        submittedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning({ id: producerClaims.id });

    if (!created) return "duplicate";
    await transaction
      .update(users)
      .set({ profileKind: "producer", updatedAt: new Date() })
      .where(eq(users.id, account.id));
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "producer_claim.submitted",
      targetType: "producer_claim",
      targetId: created.id,
      metadata: {
        country: parsed.data.country,
        producerId: parsed.data.producerId,
        method: parsed.data.method,
      },
    });
    return created.id;
  });

  if (claimResult === "already-owner") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "notice",
      "You already have access to this producer.",
    );
  }
  if (claimResult === "already-claimed") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "This producer already has a verified owner and cannot be claimed again.",
    );
  }
  if (claimResult === "open-limit" || claimResult === "daily-limit") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      claimResult === "open-limit"
        ? "Resolve an existing ownership claim before submitting another."
        : "The daily ownership-claim limit has been reached. Try again later.",
    );
  }
  if (claimResult === "duplicate") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "notice",
      "You already have an open claim for this producer.",
    );
  }
  redirectWithMessage(
    "/cuenta/reclamaciones",
    "notice",
    "Claim submitted for manual verification.",
  );
}

export async function withdrawProducerClaimAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/reclamaciones");
  const claimId = formString(formData, "claimId");
  if (!/^[0-9a-f-]{36}$/i.test(claimId)) {
    redirectWithMessage("/cuenta/reclamaciones", "error", "Invalid claim.");
  }

  const withdrawn = await getDatabase().transaction(async (transaction) => {
    const [updated] = await transaction
      .update(producerClaims)
      .set({
        status: "withdrawn",
        lockVersion: sql`${producerClaims.lockVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(producerClaims.id, claimId),
          eq(producerClaims.claimantUserId, account.id),
          inArray(producerClaims.status, ["draft", "pending", "needs_info"]),
        ),
      )
      .returning({ id: producerClaims.id });
    if (!updated) return false;
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "producer_claim.withdrawn",
      targetType: "producer_claim",
      targetId: updated.id,
      metadata: {},
    });
    return true;
  });

  redirectWithMessage(
    "/cuenta/reclamaciones",
    withdrawn ? "notice" : "error",
    withdrawn ? "Claim withdrawn." : "This claim can no longer be withdrawn.",
  );
}
