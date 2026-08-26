import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";

import {
  canAdminRevokeProfileUpgradeGift,
  resolveProfileUpgradeAdminGiftGrant,
  type ProfileUpgradeAdminGiftGrantDecision,
} from "@/lib/accounts/producer-profile-upgrade-domain";
import {
  PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
  PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
  PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
} from "@/lib/accounts/producer-profile-upgrade-policy";
import {
  conflictUnpublishedPremiumChanges,
  type AccountTransaction,
} from "@/lib/accounts/producer-premium-entitlements";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase, type Database } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerMemberships,
  producerProfileUpgradeRequests,
  staffGrants,
  users,
} from "@/lib/db/schema";

const ADMIN_GIFT_REVOCATION_REASON =
  "The administratively gifted expanded-profile right was revoked.";

export type GrantProducerPremiumGiftResult =
  | { kind: "granted"; entitlementId: string; operationId: string }
  | { kind: Exclude<ProfileUpgradeAdminGiftGrantDecision, "grant"> | "not_admin" };

export type RevokeProducerPremiumGiftResult =
  | { kind: "revoked"; conflictedChangeCount: number }
  | {
      kind:
        | "commercial_request_open"
        | "not_admin"
        | "not_found"
        | "not_revocable"
        | "state_changed";
    };

export type GrantProducerPremiumGiftInput = {
  adminUserId: string;
  country: string;
  producerId: number;
  reason: string;
};

export type RevokeProducerPremiumGiftInput = {
  adminUserId: string;
  entitlementId: string;
  reason: string;
};

type ProducerProfileGiftServiceDependencies = {
  database: Database;
  producerExists: (country: string, producerId: number) => Promise<boolean>;
};

function normalizedReason(reason: string): string {
  return reason.replace(/\r\n?/g, "\n").trim();
}

async function lockActiveAdmin(
  transaction: AccountTransaction,
  adminUserId: string,
  now: Date,
): Promise<boolean> {
  const [admin] = await transaction
    .select({ grantId: staffGrants.id })
    .from(staffGrants)
    .innerJoin(users, eq(staffGrants.userId, users.id))
    .where(
      and(
        eq(staffGrants.userId, adminUserId),
        eq(staffGrants.role, "admin"),
        isNull(staffGrants.revokedAt),
        or(isNull(staffGrants.expiresAt), gt(staffGrants.expiresAt, now)),
        eq(users.status, "active"),
      ),
    )
    .for("update")
    .limit(1);
  return Boolean(admin);
}

async function grantProducerPremiumGiftWithDependencies(
  input: GrantProducerPremiumGiftInput,
  dependencies: ProducerProfileGiftServiceDependencies,
): Promise<GrantProducerPremiumGiftResult> {
  const reason = normalizedReason(input.reason);
  if (reason.length < 10 || reason.length > 1_000) {
    throw new Error("An administrative gift requires a substantive reason.");
  }
  const catalogProducer = await dependencies.producerExists(
    input.country,
    input.producerId,
  );
  if (!catalogProducer) return { kind: "catalog_missing" };

  return dependencies.database.transaction(async (transaction) => {
    // Producer mutations share this lock order with claims, payment adapters and changes.
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${input.country}:${input.producerId}`}))`,
    );
    const now = new Date();
    if (!(await lockActiveAdmin(transaction, input.adminUserId, now))) {
      return { kind: "not_admin" };
    }

    const [[owner], [activeEntitlement], [openCommercialRequest]] =
      await Promise.all([
        transaction
          .select({
            membershipId: producerMemberships.id,
            userStatus: users.status,
          })
          .from(producerMemberships)
          .innerJoin(users, eq(producerMemberships.userId, users.id))
          .where(
            and(
              eq(producerMemberships.country, input.country),
              eq(producerMemberships.producerId, input.producerId),
              eq(producerMemberships.role, "owner"),
              eq(producerMemberships.status, "active"),
            ),
          )
          .for("update")
          .limit(1),
        transaction
          .select({ id: entitlements.id })
          .from(entitlements)
          .where(
            and(
              eq(entitlements.subjectKind, "producer"),
              eq(entitlements.producerCountry, input.country),
              eq(entitlements.producerId, input.producerId),
              eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
              eq(entitlements.status, "active"),
            ),
          )
          .for("update")
          .limit(1),
        transaction
          .select({ id: producerProfileUpgradeRequests.id })
          .from(producerProfileUpgradeRequests)
          .where(
            and(
              eq(producerProfileUpgradeRequests.country, input.country),
              eq(producerProfileUpgradeRequests.producerId, input.producerId),
              inArray(producerProfileUpgradeRequests.status, [
                ...PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
              ]),
            ),
          )
          .for("update")
          .limit(1),
      ]);

    const decision = resolveProfileUpgradeAdminGiftGrant({
      activeEntitlement: Boolean(activeEntitlement),
      activeOwner: Boolean(owner && owner.userStatus === "active"),
      catalogProducer,
      openCommercialRequest: Boolean(openCommercialRequest),
    });
    if (decision !== "grant") return { kind: decision };

    const entitlementId = randomUUID();
    const operationId = randomUUID();
    await transaction.insert(entitlements).values({
      id: entitlementId,
      subjectKind: "producer",
      producerCountry: input.country,
      producerId: input.producerId,
      key: PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
      status: "active",
      source: PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
      sourceReference: operationId,
      metadata: {
        grantedByUserId: input.adminUserId,
        grantReason: reason,
      },
      startsAt: now,
    });
    await transaction.insert(auditEvents).values({
      id: operationId,
      actorKind: "user",
      actorUserId: input.adminUserId,
      action: "producer_profile_upgrade.gift_granted",
      targetType: "entitlement",
      targetId: entitlementId,
      requestId: operationId,
      metadata: {
        country: input.country,
        producerId: input.producerId,
        reason,
      },
    });

    return { kind: "granted", entitlementId, operationId };
  });
}

async function revokeProducerPremiumGiftWithDependencies(
  input: RevokeProducerPremiumGiftInput,
  dependencies: ProducerProfileGiftServiceDependencies,
): Promise<RevokeProducerPremiumGiftResult> {
  const reason = normalizedReason(input.reason);
  if (reason.length < 10 || reason.length > 1_000) {
    throw new Error("An administrative revocation requires a substantive reason.");
  }
  return dependencies.database.transaction(async (transaction) => {
    const [candidate] = await transaction
      .select({
        country: entitlements.producerCountry,
        producerId: entitlements.producerId,
      })
      .from(entitlements)
      .where(eq(entitlements.id, input.entitlementId))
      .limit(1);
    if (!candidate?.country || !candidate.producerId) {
      const authorizationTime = new Date();
      return (await lockActiveAdmin(
        transaction,
        input.adminUserId,
        authorizationTime,
      ))
        ? { kind: "not_found" }
        : { kind: "not_admin" };
    }
    const country = candidate.country;
    const producerId = candidate.producerId;

    // Resolve without a row lock, then acquire the canonical producer lock first.
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${country}:${producerId}`}))`,
    );
    const now = new Date();
    if (!(await lockActiveAdmin(transaction, input.adminUserId, now))) {
      return { kind: "not_admin" };
    }
    const [entitlement] = await transaction
      .select()
      .from(entitlements)
      .where(eq(entitlements.id, input.entitlementId))
      .for("update")
      .limit(1);
    if (!entitlement) return { kind: "not_found" };
    if (
      entitlement.producerCountry !== country ||
      entitlement.producerId !== producerId
    ) {
      return { kind: "state_changed" };
    }
    if (
      !canAdminRevokeProfileUpgradeGift({
        key: entitlement.key,
        source: entitlement.source,
        status: entitlement.status,
        subjectKind: entitlement.subjectKind,
      })
    ) {
      return {
        kind:
          entitlement.source ===
            PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE &&
          entitlement.status !== "active"
            ? "state_changed"
            : "not_revocable",
      };
    }

    const [openCommercialRequest] = await transaction
      .select({ id: producerProfileUpgradeRequests.id })
      .from(producerProfileUpgradeRequests)
      .where(
        and(
          eq(producerProfileUpgradeRequests.country, country),
          eq(producerProfileUpgradeRequests.producerId, producerId),
          inArray(producerProfileUpgradeRequests.status, [
            ...PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
          ]),
        ),
      )
      .for("update")
      .limit(1);
    if (openCommercialRequest) return { kind: "commercial_request_open" };

    const [revoked] = await transaction
      .update(entitlements)
      .set({
        status: "revoked",
        revokedAt: now,
        updatedAt: now,
        metadata: {
          ...entitlement.metadata,
          revokedByUserId: input.adminUserId,
          revocationReason: reason,
        },
      })
      .where(
        and(
          eq(entitlements.id, entitlement.id),
          eq(entitlements.status, "active"),
          eq(
            entitlements.source,
            PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
          ),
        ),
      )
      .returning({ id: entitlements.id });
    if (!revoked) return { kind: "state_changed" };

    const conflictedChangeCount = await conflictUnpublishedPremiumChanges(
      transaction,
      {
        actor: { kind: "user", userId: input.adminUserId },
        country,
        producerId,
        reason: ADMIN_GIFT_REVOCATION_REASON,
      },
    );
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: input.adminUserId,
      action: "producer_profile_upgrade.gift_revoked",
      targetType: "entitlement",
      targetId: entitlement.id,
      requestId: entitlement.sourceReference,
      metadata: {
        country,
        producerId,
        reason,
        conflictedChangeCount,
      },
    });

    return { kind: "revoked", conflictedChangeCount };
  });
}

export function createProducerProfileGiftService(
  dependencies: ProducerProfileGiftServiceDependencies,
) {
  return {
    grant: (input: GrantProducerPremiumGiftInput) =>
      grantProducerPremiumGiftWithDependencies(input, dependencies),
    revoke: (input: RevokeProducerPremiumGiftInput) =>
      revokeProducerPremiumGiftWithDependencies(input, dependencies),
  };
}

function productionProducerProfileGiftService() {
  return createProducerProfileGiftService({
    database: getDatabase(),
    producerExists: async (country, producerId) =>
      Boolean(await findProducerById(country, producerId)),
  });
}

export async function grantProducerPremiumGift(
  input: GrantProducerPremiumGiftInput,
): Promise<GrantProducerPremiumGiftResult> {
  return productionProducerProfileGiftService().grant(input);
}

export async function revokeProducerPremiumGift(
  input: RevokeProducerPremiumGiftInput,
): Promise<RevokeProducerPremiumGiftResult> {
  return productionProducerProfileGiftService().revoke(input);
}
