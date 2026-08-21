import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";

test("account migration creates constraints and durable producer keys", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort();
    await database.exec("begin");
    for (const migrationFile of migrationFiles) {
      const migration = await readFile(`drizzle/${migrationFile}`, "utf8");
      await database.exec(migration);
    }
    await database.exec("commit");

    const tables = await database.query<{ table_name: string }>(
      `select table_name
         from information_schema.tables
        where table_schema = 'public' and table_type = 'BASE TABLE'
        order by table_name`,
    );
    assert.deepEqual(
      tables.rows.map(({ table_name }) => table_name),
      [
        "audit_events",
        "auth_identities",
        "auth_identity_tombstones",
        "entitlements",
        "favorites",
        "producer_change_requests",
        "producer_claims",
        "producer_memberships",
        "staff_grants",
        "users",
        "webhook_receipts",
      ],
    );

    const providerColumns = await database.query<{
      table_name: string;
      column_name: string;
    }>(
      `select table_name, column_name
         from information_schema.columns
        where table_schema = 'public'
          and (column_name = 'provider' or column_name = 'subject'
               or column_name like 'provider\\_%' escape '\\')
        order by table_name, column_name`,
    );
    assert.deepEqual(providerColumns.rows, [
      { table_name: "auth_identities", column_name: "provider" },
      { table_name: "auth_identities", column_name: "provider_event_id" },
      { table_name: "auth_identities", column_name: "provider_updated_at" },
      { table_name: "auth_identities", column_name: "subject" },
      { table_name: "auth_identity_tombstones", column_name: "provider" },
      { table_name: "auth_identity_tombstones", column_name: "provider_deleted_at" },
      { table_name: "auth_identity_tombstones", column_name: "provider_event_id" },
      { table_name: "auth_identity_tombstones", column_name: "subject" },
      { table_name: "webhook_receipts", column_name: "provider" },
      { table_name: "webhook_receipts", column_name: "subject" },
    ]);

    const internalUserReferences = await database.query<{
      table_name: string;
      column_name: string;
    }>(
      `select tc.table_name, kcu.column_name
         from information_schema.table_constraints tc
         join information_schema.key_column_usage kcu
           on tc.constraint_name = kcu.constraint_name
          and tc.constraint_schema = kcu.constraint_schema
         join information_schema.constraint_column_usage ccu
           on tc.constraint_name = ccu.constraint_name
          and tc.constraint_schema = ccu.constraint_schema
        where tc.table_schema = 'public'
          and tc.constraint_type = 'FOREIGN KEY'
          and ccu.table_name = 'users'
          and ccu.column_name = 'id'
        order by tc.table_name, kcu.column_name`,
    );
    assert.deepEqual(internalUserReferences.rows, [
      { table_name: "audit_events", column_name: "actor_user_id" },
      { table_name: "auth_identities", column_name: "user_id" },
      { table_name: "entitlements", column_name: "user_id" },
      { table_name: "favorites", column_name: "user_id" },
      { table_name: "producer_change_requests", column_name: "author_user_id" },
      { table_name: "producer_change_requests", column_name: "reviewer_user_id" },
      { table_name: "producer_claims", column_name: "claimant_user_id" },
      { table_name: "producer_claims", column_name: "reviewer_user_id" },
      { table_name: "producer_memberships", column_name: "granted_by_user_id" },
      { table_name: "producer_memberships", column_name: "revoked_by_user_id" },
      { table_name: "producer_memberships", column_name: "user_id" },
      { table_name: "staff_grants", column_name: "granted_by_user_id" },
      { table_name: "staff_grants", column_name: "revoked_by_user_id" },
      { table_name: "staff_grants", column_name: "user_id" },
    ]);

    const created = await database.query<{ id: string }>(
      "insert into users (display_name) values ('Test account') returning id",
    );
    const userId = created.rows[0].id;
    const secondUser = await database.query<{ id: string }>(
      "insert into users (display_name) values ('Second account') returning id",
    );
    const secondUserId = secondUser.rows[0].id;
    await database.query(
      "insert into favorites (user_id, country, producer_id) values ($1, 'es', 9007199254740991)",
      [userId],
    );
    await database.query(
      `insert into auth_identities (user_id, provider, subject, email, email_verified_at)
       values ($1, 'clerk', 'user_portable', 'portable@example.test', now())`,
      [userId],
    );
    await database.query(
      `update auth_identities
          set disabled_at = now(), email = null, email_verified_at = null
        where provider = 'clerk' and subject = 'user_portable'`,
    );
    const preservedAccount = await database.query<{
      status: string;
      display_name: string | null;
      favorite_exists: boolean;
    }>(
      `select users.status, users.display_name,
              exists(select 1 from favorites where favorites.user_id = users.id)
                as favorite_exists
         from users
        where users.id = $1`,
      [userId],
    );
    assert.deepEqual(preservedAccount.rows, [
      { status: "active", display_name: "Test account", favorite_exists: true },
    ]);

    await assert.rejects(
      database.query(
        "insert into favorites (user_id, country, producer_id) values ($1, 'es', 9007199254740991)",
        [userId],
      ),
      /duplicate key|unique/i,
    );
    await assert.rejects(
      database.query(
        "insert into favorites (user_id, country, producer_id) values ($1, 'ES', 1)",
        [userId],
      ),
      /favorites_country_check/i,
    );
    await assert.rejects(
      database.query(
        "insert into producer_claims (claimant_user_id, country, producer_id, status) values ($1, 'es', 1, 'pending')",
        [userId],
      ),
      /producer_claims_submission_check/i,
    );

    await database.query(
      "insert into producer_memberships (user_id, country, producer_id, role) values ($1, 'es', 7, 'owner')",
      [userId],
    );
    await assert.rejects(
      database.query(
        "insert into producer_memberships (user_id, country, producer_id, role) values ($1, 'es', 7, 'owner')",
        [secondUserId],
      ),
      /producer_memberships_active_owner_producer_uidx|duplicate key/i,
    );
    await database.query(
      "insert into producer_memberships (user_id, country, producer_id, role) values ($1, 'es', 7, 'editor')",
      [secondUserId],
    );

    await database.query(
      `insert into webhook_receipts (provider, event_id, event_type, payload_hash)
       values ('clerk', 'evt_1', 'user.updated', repeat('a', 64))`,
    );
    await assert.rejects(
      database.query(
        "update webhook_receipts set status = 'processing' where event_id = 'evt_1'",
      ),
      /webhook_receipts_processed_check/i,
    );
    await database.query(
      `update webhook_receipts
          set status = 'processing', processing_started_at = now(),
              processing_token = '00000000-0000-4000-8000-000000000001'
        where event_id = 'evt_1'`,
    );
    await database.query(
      `update webhook_receipts
          set status = 'processed', processing_started_at = null, processing_token = null,
              processed_at = now()
        where event_id = 'evt_1'`,
    );

    await database.query(
      `insert into auth_identity_tombstones
         (provider, subject, provider_deleted_at, provider_event_id)
       values ('clerk', 'user_deleted', now(), 'evt_delete_1')`,
    );
    await assert.rejects(
      database.query(
        `insert into auth_identity_tombstones
           (provider, subject, provider_deleted_at, provider_event_id)
         values ('clerk', 'user_deleted', now(), 'evt_delete_2')`,
      ),
      /auth_identity_tombstones_provider_subject_uidx|duplicate key/i,
    );
  } finally {
    await database.close();
  }
});
