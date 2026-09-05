import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import {
  activeUserProfilePremiumEntitlementCondition,
  createUserProfileQrPreferenceService,
} from "../lib/accounts/profile-qr-entitlements";
import { selectionPreviewRevision } from "../lib/accounts/selection-preview";
import { publicProfileUpdateSchema } from "../lib/accounts/input";
import { isProfileQrEnabled } from "../lib/profile-qr";
import type { Database } from "../lib/db";
import * as schema from "../lib/db/schema";
const { users, favorites, entitlements, auditEvents } = schema;

test("selection QR journey rechecks the exact account, current selection and entitlement", async () => {
  const client = new PGlite();
  try {
    for (const file of (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort()) {
      await client.exec(await readFile(`drizzle/${file}`, "utf8"));
    }
    const db = drizzle(client, { schema });
    const [account] = await db
      .insert(users)
      .values({
        displayName: "Market",
        publicHandle: "autumn-market",
        publicProfileBaseCountry: "es",
        publicProfileBaseArea: "barcelona",
        publicProfileBaseMunicipality: "Barcelona",
      })
      .returning();
    const [other] = await db
      .insert(users)
      .values({
        displayName: "Other owner",
        publicHandle: "other-market",
        publicProfileBaseCountry: "es",
        publicProfileBaseArea: "barcelona",
        publicProfileBaseMunicipality: "Barcelona",
        publicProfileVisibility: "unlisted",
      })
      .returning();
    const service = createUserProfileQrPreferenceService({
      database: db as unknown as Database,
      resolvePublishedIdentities: async (identities) =>
        identities.filter(
          ({ country, producerId }) => country === "es" && producerId < 100,
        ),
    });
    const input = { userId: account.id, enabled: true };
    assert.equal(await service(input), "profile_not_public");
    await db
      .update(users)
      .set({ publicProfileVisibility: "unlisted" })
      .where(eq(users.id, account.id));
    assert.equal(await service(input), "selection_empty");
    await db.insert(favorites).values([
      { userId: account.id, country: "es", producerId: 1 },
      {
        userId: account.id,
        country: "es",
        producerId: 999,
        showOnPublicProfile: true,
      },
      {
        userId: account.id,
        country: "ar",
        producerId: 2,
        showOnPublicProfile: true,
      },
      {
        userId: other.id,
        country: "es",
        producerId: 2,
        showOnPublicProfile: true,
      },
    ]);
    assert.equal(
      await service(input),
      "selection_empty",
      "private, retired, standby and another account's favorites do not qualify",
    );
    await db
      .update(favorites)
      .set({ showOnPublicProfile: true })
      .where(eq(favorites.producerId, 1));
    const selected = [{ country: "es", producerId: 1 }];
    const revision = selectionPreviewRevision(account, selected);
    assert.equal(await service(input), "preview_changed");
    assert.equal(
      await service({ ...input, previewRevision: "stale" }),
      "preview_changed",
    );
    assert.equal(
      await service({ ...input, previewRevision: revision }),
      "not_entitled",
    );
    const [entitlement] = await db
      .insert(entitlements)
      .values({
        subjectKind: "user",
        userId: account.id,
        key: "user.profile.premium",
        source: "test",
      startsAt: new Date(Date.now() - 60_000),
        metadata: { preserved: true },
      })
      .returning();
    assert.equal(
      await service({ ...input, previewRevision: revision }),
      "updated",
    );
    const [active] = await db
      .select()
      .from(entitlements)
      .where(activeUserProfilePremiumEntitlementCondition(account.id));
    assert.equal(isProfileQrEnabled(active.metadata), true);
    assert.equal(active.metadata.preserved, true);
    const [privateFavorite] = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, other.id));
    assert.equal(
      privateFavorite.showOnPublicProfile,
      true,
      "another account's selection is unchanged",
    );
    await db
      .update(users)
      .set({ selectionTitle: "Revised market" })
      .where(eq(users.id, account.id));
    assert.equal(
      await service({ ...input, previewRevision: revision }),
      "preview_changed",
    );
    await db.delete(favorites).where(eq(favorites.userId, account.id));
    assert.equal(
      await service({ ...input, previewRevision: revision }),
      "selection_empty",
    );
    assert.equal(
      await service({ ...input, enabled: false }),
      "updated",
      "an emptied selection can always disable its label",
    );
    await db
      .update(users)
      .set({ publicProfileVisibility: "private" })
      .where(eq(users.id, account.id));
    assert.equal(await service({ ...input, enabled: false }), "updated");
    assert.equal(
      await service({ ...input, previewRevision: revision }),
      "profile_not_public",
    );
    await db
      .update(users)
      .set({ publicProfileVisibility: "public", status: "suspended" })
      .where(eq(users.id, account.id));
    assert.equal(
      await service({ ...input, enabled: false }),
      "profile_not_public",
    );
    await db
      .update(users)
      .set({ status: "active" })
      .where(eq(users.id, account.id));
    for (const patch of [
      { status: "revoked" as const, revokedAt: new Date() },
      {
        status: "active" as const,
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1000),
      },
      { expiresAt: null, startsAt: new Date(Date.now() + 60_000) },
    ]) {
      await db
        .update(entitlements)
        .set(patch)
        .where(eq(entitlements.id, entitlement.id));
      assert.equal(
        (
          await db
            .select()
            .from(entitlements)
            .where(activeUserProfilePremiumEntitlementCondition(account.id))
        ).length,
        0,
      );
      assert.equal(await service({ ...input, enabled: false }), "not_entitled");
    }
    assert.equal(
      (
        await db
          .select()
          .from(auditEvents)
          .where(eq(auditEvents.action, "profile_qr.preference_updated"))
      ).length,
      3,
      "only successful mutations are audited",
    );
    assert.notEqual(
      selectionPreviewRevision(other, selected),
      revision,
      "a preview never carries another account's authority",
    );
  } finally {
    await client.close();
  }
});

test("selection context is optional, trimmed and bounded", () => {
  const base = {
    publicHandle: "market",
    visibility: "private",
    baseLocation: "es/barcelona",
    baseMunicipality: "Barcelona",
  };
  assert.equal(publicProfileUpdateSchema.parse(base).selectionTitle, "");
  assert.equal(
    publicProfileUpdateSchema.parse({ ...base, selectionTitle: " Autumn " })
      .selectionTitle,
    "Autumn",
  );
  assert.equal(
    publicProfileUpdateSchema.safeParse({
      ...base,
      selectionTitle: "x".repeat(161),
    }).success,
    false,
  );
  assert.equal(
    publicProfileUpdateSchema.safeParse({
      ...base,
      selectionDescription: "x".repeat(601),
    }).success,
    false,
  );
});
