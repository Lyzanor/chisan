import assert from "node:assert/strict";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

import { inspectProducerReferences } from "../lib/editorial/producer-inspection";

test("retirement inventory counts exact producer references across every domain in read-only mode", async (t) => {
  const database = new PGlite();
  t.after(() => database.close());
  for (const table of [
    "favorites",
    "producer_claims",
    "producer_memberships",
    "producer_change_requests",
    "producer_change_executions",
    "entitlements",
    "producer_profile_upgrade_requests",
  ]) {
    const column = table === "entitlements" ? "producer_country" : "country";
    await database.exec(
      `CREATE TABLE ${table} (${column} text, producer_id bigint); INSERT INTO ${table} VALUES ('es', 1), ('fr', 1), ('es', 2);`,
    );
  }
  await database.exec("BEGIN READ ONLY");
  const counts = await inspectProducerReferences(
    "es",
    1,
    async (statement, values) =>
      (await database.query<{ count: string }>(statement, [...values])).rows,
  );
  assert.equal(Object.keys(counts).length, 7);
  assert.ok(Object.values(counts).every((count) => count === 1));
  await database.exec("ROLLBACK");
  await assert.rejects(
    inspectProducerReferences("../es", 1, async () => []),
    /identity/,
  );
  await assert.rejects(
    inspectProducerReferences("es", 1, async () => []),
    /Incomplete/,
  );
});
