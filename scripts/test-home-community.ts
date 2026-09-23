import assert from "node:assert/strict";
import test from "node:test";
import { readdir, readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import type { Database } from "../lib/db";
import { queryHomeCommunity } from "../lib/accounts/home-community";
import { listCountryProducers } from "../lib/csv-catalog";
import { loadHomeCatalogSummary } from "../lib/catalog/home-summary";

test("home community exposes active claims and public profiles, then removes revocations and privacy changes", async () => {
  const pg = new PGlite();
  try {
    for (const file of (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort())
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    const db = drizzle(pg, { schema });
    const [owner, publicUser, privateUser, unlistedUser] = await db
      .insert(schema.users)
      .values([
        { displayName: "Owner" },
        {
          displayName: "Public",
          publicHandle: "public-user",
          publicProfileVisibility: "public",
          publicProfileBaseCountry: "es",
          publicProfileBaseArea: "barcelona",
          publicProfileBaseMunicipality: "Santa Coloma de Gramenet",
        },
        { displayName: "Private" },
        {
          displayName: "Unlisted",
          publicHandle: "unlisted-user",
          publicProfileVisibility: "unlisted",
          publicProfileBaseCountry: "es",
          publicProfileBaseArea: "barcelona",
          publicProfileBaseMunicipality: "Barcelona",
        },
      ])
      .returning();
    await db
      .insert(schema.producerMemberships)
      .values({
        userId: owner.id,
        country: "es",
        producerId: 10555,
        role: "owner",
        status: "active",
      });
    const database = db as unknown as Database;
    const members = await queryHomeCommunity(database);
    assert.equal(
      members.filter((member) => member.kind === "producer").length,
      1,
    );
    assert.deepEqual(
      members
        .filter((member) => member.kind === "user")
        .map((member) => member.href),
      ["/u/public-user"],
    );
    const serialized = JSON.stringify(members);
    for (const secret of [
      owner.id,
      publicUser.id,
      privateUser.id,
      unlistedUser.id,
      "Private",
      "Unlisted",
    ])
      assert.ok(!serialized.includes(secret));
    await db
      .update(schema.users)
      .set({ publicProfileVisibility: "private" })
      .where(eq(schema.users.id, publicUser.id));
    await db
      .update(schema.producerMemberships)
      .set({
        status: "revoked",
        revokedAt: new Date(),
        revokedByUserId: owner.id,
        revocationReason: "QA",
      })
      .where(eq(schema.producerMemberships.userId, owner.id));
    assert.deepEqual(await queryHomeCommunity(database), []);
  } finally {
    await pg.close();
  }
});

test("home producer selection uses bounded pages, skips retired identities and respects account suspension", async () => {
  const pg = new PGlite();
  try {
    for (const file of (await readdir("drizzle")).filter((file) => /^\d{4}_.+\.sql$/.test(file)).sort()) {
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    }
    const queries: { sql: string; params: unknown[] }[] = [];
    const db = drizzle(pg, { schema, logger: { logQuery(sql, params) { queries.push({ sql, params }); } } });
    const catalog = await listCountryProducers("es");
    const present = new Set(catalog.map((p) => p.producerId));
    const missing: number[] = [];
    for (let id = 1; missing.length < 5; id++) if (!present.has(id)) missing.push(id);
    const local = catalog.find((p) => p.city === "Santa Coloma de Gramenet")!;
    assert.ok(local);
    const regular = catalog.filter((p) => p.city !== local.city && p.producerId > missing.at(-1)!)
      .sort((a, b) => a.producerId - b.producerId).slice(0, 12);
    const identities = [local.producerId, ...missing, ...regular.map((p) => p.producerId)];
    for (const producerId of identities) {
      const [owner] = await db.insert(schema.users).values({ displayName: `Owner ${producerId}` }).returning();
      await db.insert(schema.producerMemberships).values({ userId: owner.id, country: "es", producerId, role: "owner" });
    }
    const database = db as unknown as Database;
    const members = await queryHomeCommunity(database);
    assert.deepEqual(members.map((m) => m.key), [local, ...regular.slice(0, 3)].map((p) => `es:${p.producerId}`));
    const reads = queries.filter((q) => q.sql.startsWith("select") && q.sql.includes('from "producer_memberships"'));
    assert.ok(reads.length > 1, "retired identities must not consume the four display positions");
    for (const query of reads) {
      assert.match(query.sql, /limit \$\d+$/);
      assert.equal(query.params.at(-1), 4);
    }
    await db.update(schema.users).set({ status: "suspended" }).where(eq(schema.users.displayName, `Owner ${local.producerId}`));
    assert.deepEqual((await queryHomeCommunity(database)).map((m) => m.key), regular.slice(0, 4).map((p) => `es:${p.producerId}`));
  } finally {
    await pg.close();
  }
});

test("home catalog counts are reused without changing the published totals", async () => {
  const first = loadHomeCatalogSummary();
  assert.equal(loadHomeCatalogSummary(), first, "concurrent renders share one immutable summary");
  const summary = await first;
  const producers = await listCountryProducers("es");
  assert.equal(summary.producerCount, producers.length);
  assert.equal(summary.categoryCounts.length, 12);
  for (const category of summary.categoryCounts) {
    assert.notEqual(category.token, "Otros");
    assert.equal(category.count, producers.filter((p) => p.categories.includes(category.token)).length);
  }
  assert.equal(await loadHomeCatalogSummary(), summary);
});
