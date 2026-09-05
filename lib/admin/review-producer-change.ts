import { and, eq, gt, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { loadProducerContent } from "@/lib/catalog/content";
import {
  hashProducerContent,
  resolveProducerContentChange,
} from "@/lib/accounts/producer-content-change";
import {
  changeReviewSchema,
  firstValidationMessage,
  formString,
} from "@/lib/accounts/input";
import { hashProducerFields } from "@/lib/accounts/producer-fields";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "@/lib/accounts/producer-profile-upgrade-policy";
import { findProducerById } from "@/lib/csv-catalog";
import type { Database } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerChangeRequests,
  producerMemberships,
} from "@/lib/db/schema";

type ReviewDependencies = {
  getDatabase: () => Database;
  requireStaffAccount: () => Promise<{ id: string }>;
  adminRedirect: (
    path: string,
    kind: "error" | "notice",
    message: string,
  ) => never;
};
export function createProducerChangeReviewService(
  dependencies: ReviewDependencies,
) {
  const { getDatabase, requireStaffAccount, adminRedirect } = dependencies;
  return async function reviewProducerChange(
    formData: FormData,
  ): Promise<void> {
    const reviewer = await requireStaffAccount();
    const parsed = changeReviewSchema.safeParse({
      changeId: formString(formData, "changeId"),
      decision: formString(formData, "decision"),
      note: formString(formData, "note"),
    });
    if (!parsed.success) {
      return adminRedirect(
        "/admin/cambios",
        "error",
        firstValidationMessage(parsed.error),
      );
    }
    const detailPath = `/admin/cambios/${parsed.data.changeId}`;
    if (parsed.data.note.length < 10) {
      return adminRedirect(
        detailPath,
        "error",
        "Add a clear editorial review note.",
      );
    }

    const database = getDatabase();
    const [change] = await database
      .select()
      .from(producerChangeRequests)
      .where(eq(producerChangeRequests.id, parsed.data.changeId))
      .limit(1);
    if (!change || !["submitted", "needs_changes"].includes(change.status)) {
      return adminRedirect(
        detailPath,
        "error",
        "This change is no longer reviewable.",
      );
    }

    const producer = await findProducerById(change.country, change.producerId);
    const currentHash = producer ? hashProducerFields(producer.fields) : null;
    let contentMatches = true;
    if (change.contentChange) {
      try {
        const { change: proposedContent } = resolveProducerContentChange(
          change.contentChange,
          change.country,
          change.producerId,
        );
        const content = await loadProducerContent(
          change.country,
          change.producerId,
        );
        contentMatches =
          hashProducerContent(content) === proposedContent.baseHash;
      } catch {
        contentMatches = false;
      }
    }
    if (!producer || currentHash !== change.baseRowHash || !contentMatches) {
      const conflicted = await database.transaction(async (transaction) => {
        await transaction.execute(
          sql`select pg_advisory_xact_lock(hashtext(${`producer:${change.country}:${change.producerId}`}))`,
        );
        const [updated] = await transaction
          .update(producerChangeRequests)
          .set({
            status: "conflict",
            failureReason: producer
              ? "The profile or products changed after this proposal was submitted."
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
              inArray(producerChangeRequests.status, [
                "submitted",
                "needs_changes",
              ]),
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
      return adminRedirect(
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
                inArray(producerChangeRequests.status, [
                  "submitted",
                  "needs_changes",
                ]),
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
            metadata: {
              country: change.country,
              producerId: change.producerId,
            },
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
                or(
                  isNull(entitlements.expiresAt),
                  gt(entitlements.expiresAt, new Date()),
                ),
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
                failureReason:
                  "The required producer entitlement was revoked before approval.",
                reviewedAt: new Date(),
                lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(producerChangeRequests.id, change.id),
                  eq(producerChangeRequests.lockVersion, change.lockVersion),
                  inArray(producerChangeRequests.status, [
                    "submitted",
                    "needs_changes",
                  ]),
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
              metadata: {
                country: change.country,
                producerId: change.producerId,
              },
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
            inArray(producerChangeRequests.status, [
              "submitted",
              "needs_changes",
            ]),
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
          fields: [
            ...Object.keys(change.patch),
            ...(change.contentChange ? ["products"] : []),
          ],
        },
      });
      return "saved";
    });

    return adminRedirect(
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
  };
}
