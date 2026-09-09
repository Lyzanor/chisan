import assert from "node:assert/strict";
import test from "node:test";
import { readdir, readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import type { Database } from "../lib/db";
import { queryHomeCommunity } from "../lib/accounts/home-community";

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
