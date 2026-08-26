"use server";

import { and, eq, gt, inArray, isNull, lte, ne, or, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

import { requireAdminAccount, requireStaffAccount } from "@/lib/accounts/auth";
import {
  changeReviewSchema,
  claimReviewSchema,
  firstValidationMessage,
  formString,
  profileUpgradeGiftGrantSchema,
  profileUpgradeGiftRevokeSchema,
  profileUpgradeRetrySchema,
} from "@/lib/accounts/input";
import { hashProducerFields } from "@/lib/accounts/producer-fields";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "@/lib/accounts/producer-profile-upgrade-policy";
import {
  grantProducerPremiumGift,
  revokeProducerPremiumGift,
} from "@/lib/accounts/producer-profile-gifts";
import { fulfillProducerProfileUpgradeCheckout } from "@/lib/payments/stripe-profile-upgrades";
import { STRIPE_PAYMENT_PROVIDER } from "@/lib/payments/payment-provider";
import { canRetryPaidUnfulfilledProfileUpgrade } from "@/lib/payments/stripe-profile-upgrade-domain";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerChangeExecutions,
  producerChangeRequests,
  producerClaims,
  producerMemberships,
  producerProfileUpgradeRequests,
  users,
} from "@/lib/db/schema";

function adminRedirect(path: string, kind: "error" | "notice", message: string): never {
  const url = new URL(path, "https://chisan.invalid");
  url.searchParams.set(kind, message.slice(0, 300));
  redirect(`${url.pathname}${url.search}`);
}

function profilePaymentRedirect(result: string): never {
  redirect(`/admin/pagos?result=${encodeURIComponent(result)}`);
}

function profileAccessRedirect(result: string): never {
  redirect(`/admin/premium?result=${encodeURIComponent(result)}`);
}

export async function grantProducerPremiumGiftAction(
  formData: FormData,
): Promise<void> {
  const operator = await requireAdminAccount("/admin/premium");
  const parsed = profileUpgradeGiftGrantSchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
    reason: formString(formData, "reason"),
  });
  if (!parsed.success) profileAccessRedirect("invalid_gift");

  let outcome: Awaited<ReturnType<typeof grantProducerPremiumGift>>;
  try {
    outcome = await grantProducerPremiumGift({
      adminUserId: operator.id,
      country: parsed.data.country,
      producerId: parsed.data.producerId,
      reason: parsed.data.reason,
    });
  } catch {
    profileAccessRedirect("gift_failed");
  }
  profileAccessRedirect(outcome.kind);
}

export async function revokeProducerPremiumGiftAction(
  formData: FormData,
): Promise<void> {
  const operator = await requireAdminAccount("/admin/premium");
  const parsed = profileUpgradeGiftRevokeSchema.safeParse({
    confirmation: formString(formData, "confirmation"),
    entitlementId: formString(formData, "entitlementId"),
    reason: formString(formData, "reason"),
  });
  if (!parsed.success) profileAccessRedirect("invalid_revocation");

  let outcome: Awaited<ReturnType<typeof revokeProducerPremiumGift>>;
  try {
    outcome = await revokeProducerPremiumGift({
      adminUserId: operator.id,
      entitlementId: parsed.data.entitlementId,
      reason: parsed.data.reason,
    });
  } catch {
    profileAccessRedirect("revocation_failed");
  }
  profileAccessRedirect(outcome.kind);
}

export async function retryProducerProfileUpgradeAction(
  formData: FormData,
): Promise<void> {
  const operator = await requireAdminAccount("/admin/pagos");
  const parsed = profileUpgradeRetrySchema.safeParse({
    requestId: formString(formData, "requestId"),
  });
  if (!parsed.success) profilePaymentRedirect("invalid_request");

  const database = getDatabase();
  const [request] = await database
    .select()
    .from(producerProfileUpgradeRequests)
    .where(eq(producerProfileUpgradeRequests.id, parsed.data.requestId))
    .limit(1);
  if (!request) profilePaymentRedirect("not_found");
  if (request.status !== "paid_unfulfilled") {
    profilePaymentRedirect(request.status === "paid" ? "already_paid" : "state_changed");
  }
  if (
    request.paymentProvider !== STRIPE_PAYMENT_PROVIDER ||
    !request.providerCheckoutId ||
    !canRetryPaidUnfulfilledProfileUpgrade(request.failureCode)
  ) {
    profilePaymentRedirect("manual_review_required");
  }

  const attemptId = `admin-retry:${crypto.randomUUID()}`;
  let outcome: Awaited<ReturnType<typeof fulfillProducerProfileUpgradeCheckout>>;
  try {
    outcome = await fulfillProducerProfileUpgradeCheckout({
      eventId: attemptId,
      occurredAt: new Date(),
      sessionId: request.providerCheckoutId,
    });
  } catch (error) {
    await database.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: operator.id,
      action: "producer_profile_upgrade.reconciliation_failed",
      targetType: "producer_profile_upgrade_request",
      targetId: request.id,
      requestId: attemptId,
      metadata: {
        failureCode: request.failureCode,
        error:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Unknown reconciliation error",
      },
    });
    profilePaymentRedirect("retry_failed");
  }

  const [current] = await database
    .select({ status: producerProfileUpgradeRequests.status })
    .from(producerProfileUpgradeRequests)
    .where(eq(producerProfileUpgradeRequests.id, request.id))
    .limit(1);
  await database.insert(auditEvents).values({
    actorKind: "user",
    actorUserId: operator.id,
    action: "producer_profile_upgrade.reconciliation_retried",
    targetType: "producer_profile_upgrade_request",
    targetId: request.id,
    requestId: attemptId,
    metadata: {
      failureCode: request.failureCode,
      outcome,
      resultingStatus: current?.status ?? null,
    },
  });

  if (current?.status === "paid") profilePaymentRedirect("reconciled");
  if (current?.status === "paid_unfulfilled") profilePaymentRedirect("still_unfulfilled");
  profilePaymentRedirect("state_changed");
}

export async function reviewProducerClaimAction(formData: FormData): Promise<void> {
  const reviewer = await requireStaffAccount();
  const parsed = claimReviewSchema.safeParse({
    claimId: formString(formData, "claimId"),
    decision: formString(formData, "decision"),
    note: formString(formData, "note"),
  });
  if (!parsed.success) {
    adminRedirect("/admin/reclamaciones", "error", firstValidationMessage(parsed.error));
  }
  if (parsed.data.note.length < 10) {
    adminRedirect(
      "/admin/reclamaciones",
      "error",
      "Record how ownership was verified and why this decision was made.",
    );
  }

  const database = getDatabase();
  const [claim] = await database
    .select()
    .from(producerClaims)
    .where(eq(producerClaims.id, parsed.data.claimId))
    .limit(1);
  if (!claim) {
    adminRedirect("/admin/reclamaciones", "error", "Claim not found.");
  }

  const reviewable = ["pending", "needs_info"] as const;
  const canReview = reviewable.includes(claim.status as (typeof reviewable)[number]);
  const canRevoke = parsed.data.decision === "revoked" && claim.status === "approved";
  if ((!canReview && !canRevoke) || (canRevoke && parsed.data.decision !== "revoked")) {
    adminRedirect(
      "/admin/reclamaciones",
      "error",
      "This claim has already moved to another state.",
    );
  }
  if (parsed.data.decision === "revoked" && !canRevoke) {
    adminRedirect("/admin/reclamaciones", "error", "Only approved claims can be revoked.");
  }

  if (
    parsed.data.decision === "approved" &&
    !(await findProducerById(claim.country, claim.producerId))
  ) {
    adminRedirect(
      "/admin/reclamaciones",
      "error",
      "The producer is no longer present in the canonical catalog.",
    );
  }

  const now = new Date();
  const result = await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${claim.country}:${claim.producerId}`}))`,
    );

    if (parsed.data.decision === "approved") {
      const [[claimant], [existingOwner]] = await Promise.all([
        transaction
          .select({ status: users.status })
          .from(users)
          .where(eq(users.id, claim.claimantUserId))
          .for("update")
          .limit(1),
        transaction
          .select({ userId: producerMemberships.userId })
          .from(producerMemberships)
          .where(
            and(
              eq(producerMemberships.country, claim.country),
              eq(producerMemberships.producerId, claim.producerId),
              eq(producerMemberships.role, "owner"),
              eq(producerMemberships.status, "active"),
            ),
          )
          .for("update")
          .limit(1),
      ]);

      if (!claimant || claimant.status !== "active") return "inactive-account";
      if (existingOwner && existingOwner.userId !== claim.claimantUserId) {
        return "owner-taken";
      }
    }

    const [reviewedClaim] = await transaction
      .update(producerClaims)
      .set({
        status: parsed.data.decision,
        reviewerUserId: reviewer.id,
        decisionReason: parsed.data.note || null,
        reviewedAt: now,
        revokedAt: parsed.data.decision === "revoked" ? now : null,
        lockVersion: sql`${producerClaims.lockVersion} + 1`,
        updatedAt: now,
      })
      .where(
        and(
          eq(producerClaims.id, claim.id),
          eq(producerClaims.lockVersion, claim.lockVersion),
          canRevoke
            ? eq(producerClaims.status, "approved")
            : inArray(producerClaims.status, ["pending", "needs_info"]),
        ),
      )
      .returning({ id: producerClaims.id });
    if (!reviewedClaim) return "stale";

    if (parsed.data.decision === "approved") {
      await transaction
        .insert(producerMemberships)
        .values({
          userId: claim.claimantUserId,
          country: claim.country,
          producerId: claim.producerId,
          role: "owner",
          status: "active",
          sourceClaimId: claim.id,
          grantedByUserId: reviewer.id,
        })
        .onConflictDoNothing();

      await transaction
        .update(users)
        .set({ profileKind: "producer", updatedAt: now })
        .where(eq(users.id, claim.claimantUserId));

      const competingClaims = await transaction
        .update(producerClaims)
        .set({
          status: "rejected",
          reviewerUserId: reviewer.id,
          decisionReason: "Ownership was verified for another account.",
          reviewedAt: now,
          lockVersion: sql`${producerClaims.lockVersion} + 1`,
          updatedAt: now,
        })
        .where(
          and(
            eq(producerClaims.country, claim.country),
            eq(producerClaims.producerId, claim.producerId),
            ne(producerClaims.id, claim.id),
            inArray(producerClaims.status, ["pending", "needs_info"]),
          ),
        )
        .returning({ id: producerClaims.id });

      if (competingClaims.length > 0) {
        await transaction.insert(auditEvents).values(
          competingClaims.map(({ id }) => ({
            actorKind: "user" as const,
            actorUserId: reviewer.id,
            action: "producer_claim.rejected",
            targetType: "producer_claim",
            targetId: id,
            metadata: {
              country: claim.country,
              producerId: claim.producerId,
              supersededByClaimId: claim.id,
            },
          })),
        );
      }
    } else if (parsed.data.decision === "revoked") {
      const accessRevocationReason = "Producer access was revoked before publication.";
      await transaction
        .update(producerMemberships)
        .set({
          status: "revoked",
          revokedAt: now,
          revokedByUserId: reviewer.id,
          revocationReason: parsed.data.note,
        })
        .where(
          and(
            eq(producerMemberships.sourceClaimId, claim.id),
            eq(producerMemberships.status, "active"),
          ),
        );
      const conflictedChanges = await transaction
        .update(producerChangeRequests)
        .set({
          status: "conflict",
          failureReason: accessRevocationReason,
          lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
          updatedAt: now,
        })
        .where(
          and(
            eq(producerChangeRequests.authorUserId, claim.claimantUserId),
            eq(producerChangeRequests.country, claim.country),
            eq(producerChangeRequests.producerId, claim.producerId),
            inArray(producerChangeRequests.status, [
              "draft",
              "submitted",
              "needs_changes",
              "approved",
              "applying",
            ]),
          ),
        )
        .returning({
          id: producerChangeRequests.id,
          country: producerChangeRequests.country,
          producerId: producerChangeRequests.producerId,
        });
      if (conflictedChanges.length) {
        const cancelledExecutions = await transaction
          .update(producerChangeExecutions)
          .set({
            status: "cancelled",
            finishedAt: now,
            errorMessage: accessRevocationReason,
            updatedAt: now,
          })
          .where(
            and(
              inArray(
                producerChangeExecutions.changeRequestId,
                conflictedChanges.map((change) => change.id),
              ),
              inArray(producerChangeExecutions.status, ["leased", "materialized"]),
            ),
          )
          .returning({
            id: producerChangeExecutions.id,
            changeRequestId: producerChangeExecutions.changeRequestId,
          });

        await transaction.insert(auditEvents).values([
          ...conflictedChanges.map((change) => ({
            actorKind: "user" as const,
            actorUserId: reviewer.id,
            action: "producer_change.membership_conflict",
            targetType: "producer_change_request",
            targetId: change.id,
            metadata: {
              country: change.country,
              producerId: change.producerId,
              reason: accessRevocationReason,
            },
          })),
          ...cancelledExecutions.map((execution) => ({
            actorKind: "user" as const,
            actorUserId: reviewer.id,
            action: "producer_change.execution_cancelled",
            targetType: "producer_change_request",
            targetId: execution.changeRequestId,
            metadata: {
              executionId: execution.id,
              country: claim.country,
              producerId: claim.producerId,
              reason: accessRevocationReason,
            },
          })),
        ]);
      }
    }

    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: reviewer.id,
      action: `producer_claim.${parsed.data.decision}`,
      targetType: "producer_claim",
      targetId: claim.id,
      metadata: { country: claim.country, producerId: claim.producerId },
    });
    return "saved";
  });

  if (result === "inactive-account" || result === "owner-taken") {
    adminRedirect(
      "/admin/reclamaciones",
      "error",
      result === "inactive-account"
        ? "The claimant account is not active."
        : "Another verified owner already controls this producer.",
    );
  }

  adminRedirect(
    "/admin/reclamaciones",
    result === "saved" ? "notice" : "error",
    result === "saved"
      ? "Claim review saved."
      : "The claim changed before this review was saved.",
  );
}

export async function reviewProducerChangeAction(formData: FormData): Promise<void> {
  const reviewer = await requireStaffAccount();
  const parsed = changeReviewSchema.safeParse({
    changeId: formString(formData, "changeId"),
    decision: formString(formData, "decision"),
    note: formString(formData, "note"),
  });
  if (!parsed.success) {
    adminRedirect("/admin/cambios", "error", firstValidationMessage(parsed.error));
  }
  const detailPath = `/admin/cambios/${parsed.data.changeId}`;
  if (parsed.data.note.length < 10) {
    adminRedirect(detailPath, "error", "Add a clear editorial review note.");
  }

  const database = getDatabase();
  const [change] = await database
    .select()
    .from(producerChangeRequests)
    .where(eq(producerChangeRequests.id, parsed.data.changeId))
    .limit(1);
  if (!change || !["submitted", "needs_changes"].includes(change.status)) {
    adminRedirect(detailPath, "error", "This change is no longer reviewable.");
  }

  const producer = await findProducerById(change.country, change.producerId);
  const currentHash = producer ? hashProducerFields(producer.fields) : null;
  if (!producer || currentHash !== change.baseRowHash) {
    const conflicted = await database.transaction(async (transaction) => {
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`producer:${change.country}:${change.producerId}`}))`,
      );
      const [updated] = await transaction
        .update(producerChangeRequests)
        .set({
          status: "conflict",
          failureReason: producer
            ? "The CSV row changed after this proposal was submitted."
            : "The producer no longer exists in the CSV catalog.",
          reviewerUserId: reviewer.id,
          reviewedAt: new Date(),
          lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(producerChangeRequests.id, change.id),
            eq(producerChangeRequests.lockVersion, change.lockVersion),
            inArray(producerChangeRequests.status, ["submitted", "needs_changes"]),
          ),
        )
        .returning({ id: producerChangeRequests.id });
      if (!updated) return false;
      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: reviewer.id,
        action: "producer_change.conflict",
        targetType: "producer_change_request",
        targetId: change.id,
        metadata: { country: change.country, producerId: change.producerId },
      });
      return true;
    });
    adminRedirect(
      detailPath,
      "error",
      conflicted
        ? "The catalog changed after submission; the request was marked as a conflict."
        : "The request changed before this review was saved.",
    );
  }

  const result = await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${change.country}:${change.producerId}`}))`,
    );

    if (parsed.data.decision === "approved") {
      const [membership] = await transaction
        .select({ id: producerMemberships.id })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.userId, change.authorUserId),
            eq(producerMemberships.country, change.country),
            eq(producerMemberships.producerId, change.producerId),
            eq(producerMemberships.status, "active"),
          ),
        )
        .for("update")
        .limit(1);
      if (!membership) {
        const [cancelled] = await transaction
          .update(producerChangeRequests)
          .set({
            status: "conflict",
            reviewerUserId: reviewer.id,
            decisionNote: parsed.data.note,
            failureReason: "Producer access was revoked before approval.",
            reviewedAt: new Date(),
            lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(producerChangeRequests.id, change.id),
              eq(producerChangeRequests.lockVersion, change.lockVersion),
              inArray(producerChangeRequests.status, ["submitted", "needs_changes"]),
            ),
          )
          .returning({ id: producerChangeRequests.id });
        if (!cancelled) return "stale";
        await transaction.insert(auditEvents).values({
          actorKind: "user",
          actorUserId: reviewer.id,
          action: "producer_change.membership_conflict",
          targetType: "producer_change_request",
          targetId: change.id,
          metadata: { country: change.country, producerId: change.producerId },
        });
        return "membership-revoked";
      }
      if (change.requiredEntitlementKey) {
        const [activeEntitlement] = await transaction
          .select({ id: entitlements.id })
          .from(entitlements)
          .where(
            and(
              eq(entitlements.subjectKind, "producer"),
              eq(entitlements.producerCountry, change.country),
              eq(entitlements.producerId, change.producerId),
              eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
              eq(entitlements.key, change.requiredEntitlementKey),
              eq(entitlements.status, "active"),
              lte(entitlements.startsAt, new Date()),
              or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, new Date())),
              isNull(entitlements.revokedAt),
            ),
          )
          .for("update")
          .limit(1);
        if (!activeEntitlement) {
          const [cancelled] = await transaction
            .update(producerChangeRequests)
            .set({
              status: "conflict",
              reviewerUserId: reviewer.id,
              decisionNote: parsed.data.note,
              failureReason: "The required producer entitlement was revoked before approval.",
              reviewedAt: new Date(),
              lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(producerChangeRequests.id, change.id),
                eq(producerChangeRequests.lockVersion, change.lockVersion),
                inArray(producerChangeRequests.status, ["submitted", "needs_changes"]),
              ),
            )
            .returning({ id: producerChangeRequests.id });
          if (!cancelled) return "stale";
          await transaction.insert(auditEvents).values({
            actorKind: "user",
            actorUserId: reviewer.id,
            action: "producer_change.entitlement_conflict",
            targetType: "producer_change_request",
            targetId: change.id,
            metadata: { country: change.country, producerId: change.producerId },
          });
          return "entitlement-revoked";
        }
      }
    }

    const [updated] = await transaction
      .update(producerChangeRequests)
      .set({
        status: parsed.data.decision,
        reviewerUserId: reviewer.id,
        decisionNote: parsed.data.note,
        reviewedAt: new Date(),
        lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(producerChangeRequests.id, change.id),
          eq(producerChangeRequests.lockVersion, change.lockVersion),
          inArray(producerChangeRequests.status, ["submitted", "needs_changes"]),
        ),
      )
      .returning({ id: producerChangeRequests.id });
    if (!updated) return "stale";

    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: reviewer.id,
      action: `producer_change.${parsed.data.decision}`,
      targetType: "producer_change_request",
      targetId: change.id,
      metadata: {
        country: change.country,
        producerId: change.producerId,
        fields: Object.keys(change.patch),
      },
    });
    return "saved";
  });

  adminRedirect(
    detailPath,
    result === "saved" ? "notice" : "error",
    result === "saved"
      ? `Change request ${parsed.data.decision}.`
      : result === "membership-revoked"
        ? "The producer membership was revoked; the request was marked as a conflict."
        : result === "entitlement-revoked"
          ? "The expanded-profile right was revoked; the request was marked as a conflict."
        : "The request changed before this review was saved.",
  );
}
