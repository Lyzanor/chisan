import "server-only";

import { and, eq, gt, inArray, isNull, lte, or, sql } from "drizzle-orm";

import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "@/lib/accounts/producer-profile-upgrade-policy";
import { getDatabase, type Database } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerChangeExecutions,
  producerChangeRequests,
} from "@/lib/db/schema";

export type AccountTransaction = Parameters<
  Parameters<Database["transaction"]>[0]
>[0];

export type PremiumEntitlementAuditActor =
  | { kind: "service"; key: string }
  | { kind: "user"; userId: string };

export function activeProducerPremiumEntitlementCondition(
  country: string,
  producerId: number,
  now = new Date(),
) {
  return and(
    eq(entitlements.subjectKind, "producer"),
    eq(entitlements.producerCountry, country),
    eq(entitlements.producerId, producerId),
    eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
    eq(entitlements.status, "active"),
    lte(entitlements.startsAt, now),
    or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
    isNull(entitlements.revokedAt),
  );
}

export async function getActiveProducerPremiumEntitlement(
  country: string,
  producerId: number,
) {
  const [entitlement] = await getDatabase()
    .select()
    .from(entitlements)
    .where(activeProducerPremiumEntitlementCondition(country, producerId))
    .limit(1);
  return entitlement ?? null;
}

export async function hasActiveProducerPremiumEntitlement(
  country: string,
  producerId: number,
): Promise<boolean> {
  return Boolean(await getActiveProducerPremiumEntitlement(country, producerId));
}

function auditActor(actor: PremiumEntitlementAuditActor) {
  return actor.kind === "user"
    ? {
        actorKind: "user" as const,
        actorUserId: actor.userId,
      }
    : {
        actorKind: "service" as const,
        actorKey: actor.key,
      };
}

export async function conflictUnpublishedPremiumChanges(
  transaction: AccountTransaction,
  input: {
    actor: PremiumEntitlementAuditActor;
    country: string;
    producerId: number;
    reason: string;
  },
): Promise<number> {
  const now = new Date();
  const conflicted = await transaction
    .update(producerChangeRequests)
    .set({
      status: "conflict",
      failureReason: input.reason,
      lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
      updatedAt: now,
    })
    .where(
      and(
        eq(producerChangeRequests.country, input.country),
        eq(producerChangeRequests.producerId, input.producerId),
        eq(
          producerChangeRequests.requiredEntitlementKey,
          PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
        ),
        inArray(producerChangeRequests.status, [
          "draft",
          "submitted",
          "needs_changes",
          "approved",
          "applying",
        ]),
      ),
    )
    .returning({ id: producerChangeRequests.id });

  if (!conflicted.length) return 0;

  const cancelledExecutions = await transaction
    .update(producerChangeExecutions)
    .set({
      status: "cancelled",
      finishedAt: now,
      errorMessage: input.reason,
      updatedAt: now,
    })
    .where(
      and(
        inArray(
          producerChangeExecutions.changeRequestId,
          conflicted.map(({ id }) => id),
        ),
        inArray(producerChangeExecutions.status, ["leased", "materialized"]),
      ),
    )
    .returning({
      changeRequestId: producerChangeExecutions.changeRequestId,
      id: producerChangeExecutions.id,
    });

  await transaction.insert(auditEvents).values([
    ...conflicted.map(({ id }) => ({
      ...auditActor(input.actor),
      action: "producer_change.entitlement_conflict",
      targetType: "producer_change_request",
      targetId: id,
      metadata: {
        country: input.country,
        producerId: input.producerId,
        reason: input.reason,
      },
    })),
    ...cancelledExecutions.map((execution) => ({
      ...auditActor(input.actor),
      action: "producer_change.execution_cancelled",
      targetType: "producer_change_request",
      targetId: execution.changeRequestId,
      metadata: {
        country: input.country,
        executionId: execution.id,
        producerId: input.producerId,
        reason: input.reason,
      },
    })),
  ]);

  return conflicted.length;
}
