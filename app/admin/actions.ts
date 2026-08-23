"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

import { requireStaffAccount } from "@/lib/accounts/auth";
import {
  changeReviewSchema,
  claimReviewSchema,
  firstValidationMessage,
  formString,
} from "@/lib/accounts/input";
import { hashProducerFields } from "@/lib/accounts/producer-fields";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  auditEvents,
  producerChangeRequests,
  producerClaims,
  producerMemberships,
  users,
} from "@/lib/db/schema";

function adminRedirect(path: string, kind: "error" | "notice", message: string): never {
  const url = new URL(path, "https://chisan.invalid");
  url.searchParams.set(kind, message.slice(0, 300));
  redirect(`${url.pathname}${url.search}`);
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
    } else if (parsed.data.decision === "revoked") {
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
      await transaction
        .update(producerChangeRequests)
        .set({
          status: "conflict",
          failureReason: "Producer access was revoked before publication.",
          lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
          updatedAt: now,
        })
        .where(
          and(
            eq(producerChangeRequests.authorUserId, claim.claimantUserId),
            eq(producerChangeRequests.country, claim.country),
            eq(producerChangeRequests.producerId, claim.producerId),
            inArray(producerChangeRequests.status, [
              "submitted",
              "needs_changes",
              "approved",
              "applying",
            ]),
          ),
        );
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
        : "The request changed before this review was saved.",
  );
}
