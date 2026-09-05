import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import type { Database } from "../lib/db";
import * as schema from "../lib/db/schema";
import { createProducerStatsService } from "../lib/producer-stats/service";
import { handleProducerProfileView } from "../lib/producer-stats/ingestion";
import { acceptsProducerViewRequest } from "../lib/producer-stats/request";
import { summarizeProducerStats } from "../lib/producer-stats/policy";

const now = new Date("2026-09-06T12:00:00Z");
const started = new Date("2026-01-01T00:00:00Z");
const pageView = () => ({
  country: "es",
  producerId: 1,
  eventId: randomUUID(),
});
function request(
  body = JSON.stringify(pageView()),
  headers: Record<string, string | undefined> = {},
) {
  return new Request("https://chisan.test/api/producer-stats/view", {
    method: "POST",
    body,
    headers: {
      origin: "https://chisan.test",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 Chrome/145.0",
      "content-type": "application/json",
      ...Object.fromEntries(
        Object.entries(headers).filter(
          (entry): entry is [string, string] => entry[1] !== undefined,
        ),
      ),
    },
  });
}

test("ingestion accepts only a bounded page display and returns no private data", async () => {
  let writes = 0;
  let authReads = 0;
  const input = pageView();
  const dependencies = {
    enabled: true,
    viewerId: async () => {
      authReads++;
      return null;
    },
    record: async (value: unknown) => {
      assert.deepEqual(value, { ...input, viewerId: null });
      writes++;
      return true;
    },
  };
  const response = await handleProducerProfileView(
    request(JSON.stringify(input)),
    dependencies,
  );
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(await response.text(), "");
  assert.equal(writes, 1);
  for (const body of [
    "null",
    "{}",
    "not-json",
    "[]",
    JSON.stringify({ ...input, views: 999 }),
    JSON.stringify({ ...input, country: "ES" }),
    JSON.stringify({ ...input, producerId: -1 }),
    JSON.stringify({ ...input, producerId: "1" }),
    JSON.stringify({ ...input, eventId: "no" }),
    JSON.stringify({ ...input, viewerId: "owner" }),
    " ".repeat(193),
  ]) {
    await handleProducerProfileView(request(body), dependencies);
  }
  for (const headers of [
    { origin: "https://foreign.test" },
    { "sec-fetch-site": "cross-site" },
    { "user-agent": "Googlebot" },
    { "user-agent": "HeadlessChrome" },
    { dnt: "1" },
    { "sec-gpc": "1" },
    { purpose: "prefetch" },
    { "sec-purpose": "prerender" },
    { "next-router-prefetch": "1" },
    { "content-type": "text/plain" },
  ]) {
    await handleProducerProfileView(
      request(JSON.stringify(input), headers),
      dependencies,
    );
  }
  await handleProducerProfileView(request(JSON.stringify(input)), {
    ...dependencies,
    enabled: false,
  });
  assert.equal(writes, 1);
  assert.equal(authReads, 1);
  assert.equal(acceptsProducerViewRequest(request()), true);
  const failure = await handleProducerProfileView(
    request(JSON.stringify(input)),
    {
      ...dependencies,
      record: async () => {
        throw new Error("Database unavailable");
      },
    },
  );
  assert.equal(failure.status, 204);
});

test("page visits are atomic, repeatable, private and independent of premium collection", async () => {
  const pg = new PGlite();
  try {
    for (const file of (await readdir("drizzle"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort()) {
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    }
    const db = drizzle(pg, { schema });
    const published = new Set(["es:1", "es:2", "es:3"]);
    const service = createProducerStatsService({
      database: db as unknown as Database,
      producerExists: async (country, id) => published.has(`${country}:${id}`),
    });
    const [owner, editor, stranger] = await db
      .insert(schema.users)
      .values([
        { displayName: "Owner" },
        { displayName: "Editor" },
        { displayName: "Other owner" },
      ])
      .returning();
    await db.insert(schema.producerMemberships).values([
      {
        userId: owner.id,
        country: "es",
        producerId: 1,
        role: "owner",
        grantedAt: started,
      },
      {
        userId: editor.id,
        country: "es",
        producerId: 1,
        role: "editor",
        grantedAt: started,
      },
      {
        userId: stranger.id,
        country: "es",
        producerId: 2,
        role: "owner",
        grantedAt: started,
      },
      {
        userId: owner.id,
        country: "es",
        producerId: 3,
        role: "owner",
        grantedAt: started,
      },
    ]);
    const read = () =>
      service.read({ country: "es", producerId: 1, userId: owner.id }, now);
    const view = pageView();
    const retryResults = await Promise.all(
      Array.from({ length: 4 }, () =>
        service.record({ ...view, viewerId: null }, now),
      ),
    );
    assert.equal(
      retryResults.filter(Boolean).length,
      1,
      "one transport event counts once",
    );
    assert.equal(
      await read(),
      null,
      "collection works before premium; reads require premium",
    );
    const premium = {
      subjectKind: "producer" as const,
      producerCountry: "es",
      key: "producer.profile.premium",
      source: "admin_profile_upgrade_gift",
      startsAt: started,
    };
    const [entitlement] = await db
      .insert(schema.entitlements)
      .values([
        { ...premium, producerId: 1 },
        { ...premium, producerId: 2 },
        { ...premium, producerId: 3 },
      ])
      .returning();
    assert.equal((await read())?.total, 1);
    await Promise.all(
      Array.from({ length: 8 }, () =>
        service.record({ ...pageView(), viewerId: stranger.id }, now),
      ),
    );
    assert.equal(
      (await read())?.today,
      9,
      "repeat visits by one account count separately without lost updates",
    );
    for (const viewerId of [owner.id, editor.id])
      assert.equal(
        await service.record({ ...pageView(), viewerId }, now),
        false,
      );
    assert.equal((await read())?.total, 9);
    for (const userId of [editor.id, stranger.id, randomUUID()]) {
      assert.equal(
        await service.read({ country: "es", producerId: 1, userId }, now),
        null,
      );
    }
    assert.equal(
      await service.read(
        { country: "es", producerId: 2, userId: owner.id },
        now,
      ),
      null,
    );
    const empty = await service.read(
      { country: "es", producerId: 3, userId: owner.id },
      now,
    );
    assert.equal(empty?.total, 0);
    assert.equal(empty?.days.length, 30);
    assert.ok(empty?.days.every((day) => day.views === 0));
    assert.equal(
      await service.record(
        { ...pageView(), country: "fr", viewerId: null },
        now,
      ),
      false,
    );
    assert.equal(
      await service.record(
        { ...pageView(), producerId: 999, viewerId: null },
        now,
      ),
      false,
    );
    await db.insert(schema.producerDailyStats).values([
      { country: "es", producerId: 1, day: "2026-09-05", views: 3 },
      { country: "es", producerId: 1, day: "2026-08-31", views: 4 },
      { country: "es", producerId: 1, day: "2026-08-30", views: 5 },
      { country: "es", producerId: 1, day: "2026-08-08", views: 6 },
      { country: "es", producerId: 1, day: "2026-08-07", views: 7 },
    ]);
    const summary = await read();
    assert.equal(summary?.total, 34);
    assert.equal(summary?.last7, 16);
    assert.equal(summary?.last30, 27);
    assert.equal(summary?.days[0].day, "2026-08-08");
    // Exact capability lifecycle and active internal account are enforced.
    await db
      .update(schema.entitlements)
      .set({ expiresAt: now })
      .where(eq(schema.entitlements.id, entitlement.id));
    assert.equal(await read(), null);
    await db
      .update(schema.entitlements)
      .set({ expiresAt: null, startsAt: new Date("2026-09-07T00:00:00Z") })
      .where(eq(schema.entitlements.id, entitlement.id));
    assert.equal(await read(), null);
    await db
      .update(schema.entitlements)
      .set({ startsAt: started, status: "revoked", revokedAt: now })
      .where(eq(schema.entitlements.id, entitlement.id));
    assert.equal(await read(), null);
    await db
      .update(schema.entitlements)
      .set({ status: "active", revokedAt: null })
      .where(eq(schema.entitlements.id, entitlement.id));
    await db
      .update(schema.users)
      .set({ status: "suspended" })
      .where(eq(schema.users.id, owner.id));
    assert.equal(await read(), null);
    await db
      .update(schema.users)
      .set({ status: "active" })
      .where(eq(schema.users.id, owner.id));
    published.delete("es:1");
    assert.equal(await read(), null);
    published.add("es:1");
    await db
      .update(schema.producerMemberships)
      .set({ status: "revoked", revokedAt: now, revokedByUserId: stranger.id })
      .where(eq(schema.producerMemberships.userId, owner.id));
    assert.equal(await read(), null);
    // Stats survive a membership change; they belong to the producer identity.
    assert.equal((await db.select().from(schema.producerDailyStats)).length, 6);
    await service.cleanup(new Date("2026-09-08T00:00:00Z"));
    assert.equal(
      (await db.select().from(schema.producerStatsReceipts)).length,
      0,
    );
    const privateColumns = await pg.query<{ column_name: string }>(
      "select column_name from information_schema.columns where table_name in ('producer_daily_stats', 'producer_stats_receipts')",
    );
    assert.deepEqual(
      new Set(privateColumns.rows.map((row) => row.column_name)),
      new Set(["country", "producer_id", "day", "views", "event_id"]),
    );
    for (const role of [
      "chisan_admin_read",
      "chisan_producer_change_operator",
      "chisan_producer_change_recovery",
    ]) {
      const grants = await pg.query<{ allowed: boolean }>(
        `select has_table_privilege($1, 'producer_daily_stats', 'SELECT') as allowed`,
        [role],
      );
      assert.equal(grants.rows[0].allowed, false);
    }
  } finally {
    await pg.close();
  }
});

test("UTC windows remain correct across month and year boundaries", () => {
  const summary = summarizeProducerStats(
    [
      { day: "2025-12-31", views: 2 },
      { day: "2026-01-01", views: 4 },
    ],
    "2026-01-01",
  );
  assert.equal(summary.total, 6);
  assert.equal(summary.last7, 6);
  assert.equal(summary.today, 4);
  assert.equal(summary.days.length, 30);
  assert.equal(summary.days[0].day, "2025-12-03");
});
