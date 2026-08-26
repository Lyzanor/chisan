import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import {
  createProducerProfileGiftService,
  type GrantProducerPremiumGiftInput,
} from "../lib/accounts/producer-profile-gifts";
import {
  PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
  PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
  PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
} from "../lib/accounts/producer-profile-upgrade-policy";
import type { Database } from "../lib/db";
import {
  auditEvents,
  entitlements,
  producerChangeExecutions,
  producerChangeRequests,
  producerMemberships,
  producerProfileUpgradeRequests,
  staffGrants,
  users,
} from "../lib/db/schema";
import * as schema from "../lib/db/schema";

const ADMIN_ID = "00000000-0000-4000-8000-000000000001";
const OWNER_ID = "00000000-0000-4000-8000-000000000002";
const NON_ADMIN_ID = "00000000-0000-4000-8000-000000000003";
const EXPIRED_ADMIN_ID = "00000000-0000-4000-8000-000000000004";
const INACTIVE_OWNER_ID = "00000000-0000-4000-8000-000000000005";
const GIFT_REASON = "Launch partner selected for the documented Chisan pilot.";
const REVOCATION_REASON = "The documented administrative pilot period has ended.";

async function migrate(client: PGlite): Promise<void> {
  await client.exec(`
    create role chisan_test_migration_owner login createrole;
    grant create on database postgres to chisan_test_migration_owner;
    alter schema public owner to chisan_test_migration_owner;
    set role chisan_test_migration_owner;
    begin;
  `);
  const migrationFiles = (await readdir("drizzle"))
    .filter((file) => /^\d{4}_.+\.sql$/.test(file))
    .sort();
  for (const migrationFile of migrationFiles) {
    const migration = await readFile(`drizzle/${migrationFile}`, "utf8");
    for (const statement of migration
      .split("--> statement-breakpoint")
      .map((candidate) => candidate.trim())
      .filter(Boolean)) {
      await client.exec(statement);
    }
  }
  await client.exec("commit; reset role;");
}

function grantInput(
  producerId: number,
  adminUserId = ADMIN_ID,
): GrantProducerPremiumGiftInput {
  return {
    adminUserId,
    country: "es",
    producerId,
    reason: GIFT_REASON,
  };
}

test("administrative premium gifts execute atomically without Stripe authority", async () => {
  const client = new PGlite();
  try {
    await migrate(client);
    const database = drizzle(client, { schema }) as unknown as Database;
    const publishedProducerIds = new Set([1, 2, 3, 5, 6, 7, 8]);
    const service = createProducerProfileGiftService({
      database,
      producerExists: async (country, producerId) =>
        country === "es" && publishedProducerIds.has(producerId),
    });
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1_000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1_000);

    await database.insert(users).values([
      { id: ADMIN_ID, displayName: "Active admin" },
      { id: OWNER_ID, displayName: "Producer owner" },
      { id: NON_ADMIN_ID, displayName: "Non-admin account" },
      { id: EXPIRED_ADMIN_ID, displayName: "Expired admin" },
      { id: INACTIVE_OWNER_ID, displayName: "Inactive owner", status: "suspended" },
    ]);
    await database.insert(staffGrants).values([
      {
        id: "10000000-0000-4000-8000-000000000001",
        userId: ADMIN_ID,
        role: "admin",
        reason: "Permanent operations authority for the test fixture.",
      },
      {
        id: "10000000-0000-4000-8000-000000000004",
        userId: EXPIRED_ADMIN_ID,
        role: "admin",
        grantedAt: twoHoursAgo,
        expiresAt: oneHourAgo,
        reason: "Expired operations authority for the test fixture.",
      },
    ]);
    await database.insert(producerMemberships).values(
      [1, 2, 3, 5, 6, 7, 8].map((producerId) => ({
        id: `20000000-0000-4000-8000-${String(producerId).padStart(12, "0")}`,
        userId: producerId === 3 ? INACTIVE_OWNER_ID : OWNER_ID,
        country: "es",
        producerId,
        role: "owner" as const,
        status: "active" as const,
      })),
    );

    assert.deepEqual(await service.grant(grantInput(1, NON_ADMIN_ID)), {
      kind: "not_admin",
    });
    assert.deepEqual(await service.grant(grantInput(6, EXPIRED_ADMIN_ID)), {
      kind: "not_admin",
    });
    const concurrentGrantKinds = (
      await Promise.all([service.grant(grantInput(6)), service.grant(grantInput(6))])
    )
      .map(({ kind }) => kind)
      .sort();
    assert.deepEqual(concurrentGrantKinds, ["active_entitlement", "granted"]);
    assert.deepEqual(await service.grant(grantInput(4)), {
      kind: "catalog_missing",
    });
    assert.deepEqual(await service.grant(grantInput(3)), {
      kind: "active_owner_required",
    });

    const granted = await service.grant(grantInput(1));
    assert.equal(granted.kind, "granted");
    if (granted.kind !== "granted") return;
    assert.deepEqual(await service.grant(grantInput(1)), {
      kind: "active_entitlement",
    });

    const [gift] = await database
      .select()
      .from(entitlements)
      .where(eq(entitlements.id, granted.entitlementId));
    assert.equal(gift?.source, PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE);
    assert.equal(gift?.sourceReference, granted.operationId);
    assert.deepEqual(gift?.metadata, {
      grantedByUserId: ADMIN_ID,
      grantReason: GIFT_REASON,
    });
    const [grantAudit] = await database
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.id, granted.operationId));
    assert.equal(grantAudit?.actorUserId, ADMIN_ID);
    assert.equal(grantAudit?.action, "producer_profile_upgrade.gift_granted");

    assert.deepEqual(
      await service.revoke({
        adminUserId: NON_ADMIN_ID,
        entitlementId: granted.entitlementId,
        reason: REVOCATION_REASON,
      }),
      { kind: "not_admin" },
    );
    const revoked = await service.revoke({
      adminUserId: ADMIN_ID,
      entitlementId: granted.entitlementId,
      reason: REVOCATION_REASON,
    });
    assert.deepEqual(revoked, { kind: "revoked", conflictedChangeCount: 0 });
    assert.deepEqual(
      await service.revoke({
        adminUserId: ADMIN_ID,
        entitlementId: granted.entitlementId,
        reason: REVOCATION_REASON,
      }),
      { kind: "state_changed" },
    );

    const stripeEntitlementId = "30000000-0000-4000-8000-000000000002";
    await database.insert(entitlements).values({
      id: stripeEntitlementId,
      subjectKind: "producer",
      producerCountry: "es",
      producerId: 2,
      key: PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
      source: PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
      sourceReference: "40000000-0000-4000-8000-000000000002",
    });
    assert.deepEqual(
      await service.revoke({
        adminUserId: ADMIN_ID,
        entitlementId: stripeEntitlementId,
        reason: REVOCATION_REASON,
      }),
      { kind: "not_revocable" },
    );
    const [unchangedStripeEntitlement] = await database
      .select({ status: entitlements.status })
      .from(entitlements)
      .where(eq(entitlements.id, stripeEntitlementId));
    assert.equal(unchangedStripeEntitlement?.status, "active");

    await database.insert(producerProfileUpgradeRequests).values({
      id: "40000000-0000-4000-8000-000000000005",
      requesterUserId: OWNER_ID,
      country: "es",
      producerId: 5,
      amountMinor: 4_900,
      currency: "eur",
      termsVersion: "producer-profile-upgrade-v1",
      termsUrl: "/terms/profile-upgrade-v1",
      termsAcceptedAt: new Date(),
      paymentProvider: "stripe",
      providerOfferId: "price_test_profile_upgrade",
    });
    assert.deepEqual(await service.grant(grantInput(5)), {
      kind: "commercial_request_open",
    });

    const giftBlockedByCommercialState = await service.grant(grantInput(8));
    assert.equal(giftBlockedByCommercialState.kind, "granted");
    if (giftBlockedByCommercialState.kind !== "granted") return;
    await database.insert(producerProfileUpgradeRequests).values({
      id: "40000000-0000-4000-8000-000000000008",
      requesterUserId: OWNER_ID,
      country: "es",
      producerId: 8,
      amountMinor: 4_900,
      currency: "eur",
      termsVersion: "producer-profile-upgrade-v1",
      termsUrl: "/terms/profile-upgrade-v1",
      termsAcceptedAt: new Date(),
      paymentProvider: "stripe",
      providerOfferId: "price_test_profile_upgrade",
    });
    assert.deepEqual(
      await service.revoke({
        adminUserId: ADMIN_ID,
        entitlementId: giftBlockedByCommercialState.entitlementId,
        reason: REVOCATION_REASON,
      }),
      { kind: "commercial_request_open" },
    );

    const premiumGrant = await service.grant(grantInput(7));
    assert.equal(premiumGrant.kind, "granted");
    if (premiumGrant.kind !== "granted") return;
    const changeRequestId = "50000000-0000-4000-8000-000000000007";
    const executionId = "60000000-0000-4000-8000-000000000007";
    await database.insert(producerChangeRequests).values({
      id: changeRequestId,
      authorUserId: OWNER_ID,
      country: "es",
      producerId: 7,
      baseRowHash: "a".repeat(64),
      baseSnapshot: {},
      patch: { "visitas guiadas": "sí" },
      requiredEntitlementKey: PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
    });
    await database.insert(producerChangeExecutions).values({
      id: executionId,
      changeRequestId,
      country: "es",
      producerId: 7,
      operatorKey: "gift-service-test",
      worktreeKey: "b".repeat(64),
      sourceHeadSha: "c".repeat(40),
      expectedRowHash: "d".repeat(64),
      leaseExpiresAt: new Date(Date.now() + 60 * 60 * 1_000),
      csvPath: "data/csv/es/test/test.csv",
    });
    assert.deepEqual(
      await service.revoke({
        adminUserId: ADMIN_ID,
        entitlementId: premiumGrant.entitlementId,
        reason: REVOCATION_REASON,
      }),
      { kind: "revoked", conflictedChangeCount: 1 },
    );
    const [[conflictedChange], [cancelledExecution], conflictAudits] = await Promise.all([
      database
        .select({ status: producerChangeRequests.status })
        .from(producerChangeRequests)
        .where(eq(producerChangeRequests.id, changeRequestId)),
      database
        .select({ status: producerChangeExecutions.status })
        .from(producerChangeExecutions)
        .where(eq(producerChangeExecutions.id, executionId)),
      database
        .select({ action: auditEvents.action })
        .from(auditEvents)
        .where(
          and(
            eq(auditEvents.targetType, "producer_change_request"),
            eq(auditEvents.targetId, changeRequestId),
          ),
        ),
    ]);
    assert.equal(conflictedChange?.status, "conflict");
    assert.equal(cancelledExecution?.status, "cancelled");
    assert.deepEqual(
      new Set(conflictAudits.map(({ action }) => action)),
      new Set([
        "producer_change.entitlement_conflict",
        "producer_change.execution_cancelled",
      ]),
    );
  } finally {
    await client.close();
  }
});
