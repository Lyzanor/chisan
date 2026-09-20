import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../lib/db/schema";
import type { Database } from "../lib/db";

test("private producer controls use only the current account and fail closed", async () => {
  const client = new PGlite();
  const fixture = {
    account: null as { id: string } | null,
    database: null as Database | null,
    reads: 0,
    configured: true,
    statsReads: 0,
  };
  const fixtureKey = "__chisanProducerViewerTest";
  Object.assign(globalThis, { [fixtureKey]: fixture });
  const environment = process.env.DATABASE_URL;
  const statsEnvironment = process.env.CHISAN_PRODUCER_STATS_ENABLED;
  process.env.DATABASE_URL = "isolated-test";
  process.env.CHISAN_PRODUCER_STATS_ENABLED = "true";
  const source = `const fixture = globalThis.${fixtureKey};`;
  const hooks = registerHooks({
    load(url, context, next) {
      if (url.startsWith("data:text/javascript,")) return {
        format: "module", source: decodeURIComponent(url.slice("data:text/javascript,".length)), shortCircuit: true,
      };
      return next(url, context);
    },
    resolve(specifier, context, next) {
      let stub: string | undefined;
      if (specifier === "server-only") stub = "export {};";
      if (specifier === "./auth" && context.parentURL?.endsWith("producer-viewer-state.server.ts")) {
        stub = `${source} export const getCurrentAccount = async () => fixture.account;`;
      }
      if (specifier === "@/lib/db") {
        stub = `${source} export const getDatabase = () => { fixture.reads++; return fixture.database; };`;
      }
      if (specifier === "@/lib/accounts/config" && context.parentURL?.endsWith("api/account/producer/route.ts")) {
        stub = `${source} export const isAccountSystemConfigured = () => fixture.configured;`;
      }
      if (context.parentURL?.endsWith("api/producer-stats/view/route.ts")) {
        if (specifier === "@/lib/accounts/auth") {
          stub = `${source} export const getCurrentAccount = async () => { fixture.statsReads++; return null; };`;
        }
        if (specifier === "@/lib/producer-stats/service") {
          stub = `${source} export const getProducerStatsService = () => { fixture.statsReads++; throw new Error('Paused'); };`;
        }
      }
      if (stub) return { url: `data:text/javascript,${encodeURIComponent(stub)}`, shortCircuit: true };
      return next(specifier, context);
    },
  });
  try {
    await client.exec("create role chisan_test_migration_owner login createrole; grant create on database postgres to chisan_test_migration_owner; alter schema public owner to chisan_test_migration_owner; set role chisan_test_migration_owner; begin;");
    for (const file of (await readdir("drizzle")).filter((file) => /^\d{4}_.+\.sql$/.test(file)).sort()) {
      await client.exec((await readFile(`drizzle/${file}`, "utf8")).replaceAll("--> statement-breakpoint", ""));
    }
    await client.exec("commit; reset role;");
    fixture.database = drizzle(client, { schema }) as unknown as Database;
    const owner = "00000000-0000-4000-8000-000000000001";
    const visitor = "00000000-0000-4000-8000-000000000002";
    await fixture.database.insert(schema.users).values([
      { id: owner, displayName: "Private owner name" },
      { id: visitor, displayName: "Private visitor name" },
    ]);
    await fixture.database.insert(schema.producerMemberships).values({
      userId: owner, country: "es", producerId: 1, role: "owner", status: "active",
    });
    const { loadProducerViewerState } = await import("../lib/accounts/producer-viewer-state.server");
    const { GET } = await import("../app/(application)/api/account/producer/route");
    const request = () => new Request("https://chisan.test/api/account/producer?country=es&producerId=1");
    const guest = await loadProducerViewerState("es", 1);
    assert.equal(guest.signedIn, false);
    const unauthorized = await GET(request());
    assert.equal(unauthorized.status, 401);
    assert.equal(unauthorized.headers.get("cache-control"), "private, no-store");
    assert.equal(fixture.reads, 0, "anonymous API probes do not query producer/account tables");
    fixture.account = { id: owner };
    const owned = await loadProducerViewerState("es", 1);
    assert.deepEqual(owned.membership, { role: "owner" });
    assert.equal(owned.activeOwner, true);
    assert.equal(owned.canOfferProfileUpgrade, false);
    assert.doesNotMatch(JSON.stringify(owned), /Private owner|00000000|email|claimant/);
    const ownerResponse = await GET(request());
    assert.equal(ownerResponse.status, 200);
    assert.equal(ownerResponse.headers.get("cache-control"), "private, no-store");
    assert.deepEqual(await ownerResponse.json(), owned);
    assert.equal((await loadProducerViewerState("es", 2)).membership, null, "another producer never inherits membership");
    fixture.account = { id: visitor };
    const other = await loadProducerViewerState("es", 1);
    assert.equal(other.membership, null, "another viewer never inherits the owner's controls");
    assert.equal(other.activeOwner, true);
    assert.deepEqual(await (await GET(request())).json(), other);
    fixture.account = null;
    assert.equal((await loadProducerViewerState("es", 1)).membership, null);
    fixture.configured = false;
    const unavailable = await GET(request());
    assert.equal(unavailable.status, 503);
    assert.equal(unavailable.headers.get("cache-control"), "private, no-store");

    const { isProducerStatsEnabled } = await import("../lib/producer-stats/policy");
    const { POST } = await import("../app/(application)/api/producer-stats/view/route");
    assert.equal(isProducerStatsEnabled(), true, "fixture enables the legacy collection environment");
    const paused = await POST(new Request("https://chisan.test/api/producer-stats/view", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://chisan.test", "Sec-Fetch-Site": "same-origin" },
      body: JSON.stringify({ country: "es", producerId: 1, eventId: "00000000-0000-4000-8000-000000000001" }),
    }));
    assert.equal(paused.status, 204);
    assert.equal(paused.headers.get("cache-control"), "private, no-store");
    assert.equal(fixture.statsReads, 0, "pause overrides the old feature flag before auth or recording");
  } finally {
    hooks.deregister();
    if (environment === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = environment;
    if (statsEnvironment === undefined) delete process.env.CHISAN_PRODUCER_STATS_ENABLED;
    else process.env.CHISAN_PRODUCER_STATS_ENABLED = statsEnvironment;
    Reflect.deleteProperty(globalThis, fixtureKey);
    await client.close();
  }
});
