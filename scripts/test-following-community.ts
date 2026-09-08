import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { and, eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import type { Database } from "../lib/db";
import { setProducerFollow } from "../lib/accounts/producer-follows";
import {
  createCommunityService,
  type PublishedProducer,
} from "../lib/community/service";
import {
  decodeTimelineCursor,
  encodeTimelineCursor,
  isPublishedChange,
} from "../lib/community/policy";
import { emptyProducerContent } from "../lib/catalog/content-schema";
import {
  hashProducerContent,
  proposeProducerProducts,
  type ProducerContentChange,
} from "../lib/accounts/producer-content-change";

test("publication checks require deployed base facts and exact related content", () => {
  assert.equal(isPublishedChange({}, {}, null, "published"), false);
  assert.equal(
    isPublishedChange(
      { historia: "Approved" },
      { historia: "Old" },
      null,
      "hash",
    ),
    false,
  );
  assert.equal(
    isPublishedChange(
      { historia: "Approved" },
      { historia: "Approved" },
      null,
      "hash",
    ),
    true,
  );
  assert.equal(isPublishedChange({}, {}, "new", "old"), false);
  assert.equal(isPublishedChange({}, {}, "new", "new"), true);
  const cursor = { at: "2026-01-01T12:00:00.000Z", id: `u:${randomUUID()}` };
  assert.deepEqual(decodeTimelineCursor(encodeTimelineCursor(cursor)), cursor);
  for (const input of [
    "garbage",
    "a".repeat(301),
    Buffer.from('{"at":"tomorrow","id":"other"}').toString("base64url"),
  ])
    assert.equal(decodeTimelineCursor(input), null);
});

test("following preserves legacy privacy and exposes only followed, published, current changes", async () => {
  const pg = new PGlite();
  try {
    for (const file of (await readdir("drizzle"))
      .filter((f) => /^\d{4}_.+\.sql$/.test(f))
      .sort())
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    const db = drizzle(pg, { schema });
    const database = db as unknown as Database;
    const [reader, stranger, owner, reviewer] = await db
      .insert(schema.users)
      .values(
        ["Reader", "Stranger", "Owner", "Reviewer"].map((displayName) => ({
          displayName,
        })),
      )
      .returning();
    const keys = { country: "es", producerId: 1 };
    const started = new Date("2026-01-01T00:00:00Z");
    const at = new Date("2026-01-02T12:00:00Z");
    const fields = {
      historia: "Published history",
      "mensaje a la comunidad": "Nuestro mensaje publicado",
      mensaje_comunidad_locale: "es",
    };
    const catalog = new Map<string, PublishedProducer>([
      [
        "es:1",
        {
          name: "Producer One",
          href: "/es/test/one",
          city: "Vic",
          fields,
          contentHash: hashProducerContent(emptyProducerContent("es", 1)),
        },
      ],
      [
        "fr:1",
        {
          name: "Other country",
          href: "/fr/test/one",
          city: "Test",
          fields: { ...fields },
          contentHash: "other",
        },
      ],
    ]);
    const exists = async (key: typeof keys) =>
      catalog.has(`${key.country}:${key.producerId}`);
    const service = createCommunityService({
      database,
      catalog: async (key) =>
        catalog.get(`${key.country}:${key.producerId}`) ?? null,
    });
    // A favorite predating this feature is already a follow, with its selection opt-in intact.
    await db
      .insert(schema.favorites)
      .values({
        userId: reader.id,
        ...keys,
        showOnPublicProfile: true,
        createdAt: started,
      });
    await setProducerFollow(database, reader.id, keys, true, exists);
    await setProducerFollow(database, reader.id, keys, true, exists);
    assert.equal(
      (await db.select().from(schema.favorites))[0].showOnPublicProfile,
      true,
    );
    assert.equal(
      (await db.select().from(schema.favorites))[0].createdAt.toISOString(),
      started.toISOString(),
    );
    await setProducerFollow(
      database,
      stranger.id,
      { country: "fr", producerId: 1 },
      true,
      exists,
    );
    assert.equal(
      (
        await db
          .select()
          .from(schema.favorites)
          .where(eq(schema.favorites.userId, stranger.id))
      )[0].showOnPublicProfile,
      false,
    );
    await assert.rejects(
      setProducerFollow(
        database,
        reader.id,
        { country: "es", producerId: 999 },
        true,
        exists,
      ),
    );
    const [premium] = await db
      .insert(schema.entitlements)
      .values({
        subjectKind: "producer",
        producerCountry: "es",
        producerId: 1,
        key: "producer.profile.premium",
        source: "test",
        startsAt: started,
      })
      .returning();
    const [claim] = await db
      .insert(schema.producerClaims)
      .values({
        claimantUserId: owner.id,
        ...keys,
        status: "approved",
        submittedAt: started,
        reviewerUserId: reviewer.id,
        reviewedAt: at,
        proof: { private: "PRIVATE CLAIM PROOF" },
        decisionReason: "PRIVATE REVIEW NOTE",
      })
      .returning();
    const [membership] = await db
      .insert(schema.producerMemberships)
      .values({
        userId: owner.id,
        ...keys,
        role: "owner",
        sourceClaimId: claim.id,
        grantedAt: at,
      })
      .returning();
    // A pending claim for another followed producer must never create activity.
    await db
      .insert(schema.producerClaims)
      .values({
        claimantUserId: stranger.id,
        country: "fr",
        producerId: 1,
        status: "pending",
        submittedAt: started,
      });
    const addChange = async (
      patch: Record<string, string>,
      status:
        "draft" | "submitted" | "approved" | "applying" | "applied" = "applied",
      contentChange?: ProducerContentChange,
    ) => {
      const [change] = await db
        .insert(schema.producerChangeRequests)
        .values({
          authorUserId: owner.id,
          ...keys,
          status,
          baseRowHash: "a".repeat(64),
          baseSnapshot: {},
          patch,
          contentChange,
          requiredEntitlementKey: contentChange
            ? "producer.profile.premium"
            : null,
          submittedAt: started,
          reviewerUserId: reviewer.id,
          reviewedAt: started,
          authorNote: "PRIVATE AUTHOR NOTE",
          decisionNote: "PRIVATE DECISION",
          appliedAt: status === "applied" ? at : null,
          appliedCommitSha: status === "applied" ? "a".repeat(40) : null,
        })
        .returning();
      return change;
    };
    const update = await addChange({ historia: fields.historia });
    const message = await addChange({
      "mensaje a la comunidad": fields["mensaje a la comunidad"],
      mensaje_comunidad_locale: "es",
    });
    for (const status of [
      "draft",
      "submitted",
      "approved",
      "applying",
    ] as const) {
      const pending = await addChange({ historia: fields.historia }, status);
      assert.ok(
        !(await service.timeline(reader.id)).items.some(
          (item) => item.id === `u:${pending.id}`,
        ),
      );
      await db
        .update(schema.producerChangeRequests)
        .set({ status: "withdrawn" })
        .where(eq(schema.producerChangeRequests.id, pending.id));
    }
    await addChange({ historia: "Approved but not deployed yet" });
    let page = await service.timeline(reader.id);
    assert.equal(page.items.length, 3);
    assert.equal(page.messages[0].body, fields["mensaje a la comunidad"]);
    assert.ok(
      page.items.some(
        (i) =>
          i.id === `u:${message.id}` &&
          i.body === fields["mensaje a la comunidad"],
      ),
    );
    assert.equal(page.items.filter((i) => i.kind === "claim").length, 1);
    for (const secret of [
      "PRIVATE",
      "baseSnapshot",
      owner.id,
      reviewer.id,
      "authorUserId",
      "contentHash",
      "patch",
    ])
      assert.ok(!JSON.stringify(page).includes(secret), secret);
    assert.equal((await service.timeline(stranger.id)).items.length, 0);
    assert.equal((await service.timeline(stranger.id)).messages.length, 0);
    assert.equal(
      (await service.timeline(reader.id, { filter: "posts" })).items.length,
      2,
    );
    assert.equal(
      (await service.timeline(reader.id, { filter: "activity" })).items.length,
      1,
    );
    assert.equal(
      (await service.timeline(reader.id, { filter: "activity" })).messages
        .length,
      0,
    );
    // Product proposals need the deployed typed-content revision as well.
    const contentChange = proposeProducerProducts(
      emptyProducerContent("es", 1),
      [
        {
          id: "cheese",
          name: "Queso",
          description: "",
          locale: "es",
          media_ids: [],
          link_ids: [],
        },
      ],
    )!;
    const product = await addChange(
      { historia: fields.historia },
      "applied",
      contentChange,
    );
    assert.ok(
      !(await service.timeline(reader.id)).items.some(
        (i) => i.id === `u:${product.id}`,
      ),
    );
    catalog.get("es:1")!.contentHash = contentChange.requestedHash;
    assert.ok(
      (await service.timeline(reader.id)).items.some(
        (i) => i.id === `u:${product.id}`,
      ),
    );
    // Stable cursor order with identical timestamps and superseded rows interspersed.
    for (let i = 0; i < 42; i++) await addChange({ historia: fields.historia });
    const ids: string[] = [];
    let cursor: string | undefined;
    do {
      page = await service.timeline(reader.id, { cursor });
      ids.push(...page.items.map((i) => i.id));
      cursor = page.nextCursor ?? undefined;
    } while (cursor);
    assert.equal(ids.length, 46);
    assert.equal(new Set(ids).size, ids.length);
    catalog.get("es:1")!.href = "/es/new-area/new-slug";
    assert.equal(
      (await service.timeline(reader.id)).items[0].producer.href,
      "/es/new-area/new-slug",
    );
    // Expired premium hides messages/updates while ownership remains available to followers.
    await db
      .update(schema.entitlements)
      .set({ expiresAt: at })
      .where(eq(schema.entitlements.id, premium.id));
    page = await service.timeline(reader.id);
    assert.equal(page.items.length, 1);
    assert.equal(page.items[0].kind, "claim");
    assert.equal(page.messages.length, 0);
    await db
      .update(schema.producerMemberships)
      .set({ status: "revoked", revokedAt: at, revokedByUserId: reviewer.id })
      .where(eq(schema.producerMemberships.id, membership.id));
    assert.equal((await service.timeline(reader.id)).items.length, 0);
    // Retired producers can always be unfollowed; re-following cannot restore sharing.
    catalog.delete("es:1");
    await setProducerFollow(database, reader.id, keys, false, exists);
    await setProducerFollow(database, reader.id, keys, false, exists);
    assert.equal(
      (
        await db
          .select()
          .from(schema.favorites)
          .where(
            and(
              eq(schema.favorites.userId, reader.id),
              eq(schema.favorites.country, "es"),
            ),
          )
      ).length,
      0,
    );
    assert.equal((await service.timeline(reader.id)).followingCount, 0);
    await db
      .update(schema.users)
      .set({ status: "suspended" })
      .where(eq(schema.users.id, reader.id));
    await assert.rejects(service.timeline(reader.id));
    await assert.rejects(
      setProducerFollow(
        database,
        reader.id,
        { country: "fr", producerId: 1 },
        true,
        exists,
      ),
    );
    assert.ok(update.id);
  } finally {
    await pg.close();
  }
});
