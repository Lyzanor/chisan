import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";

test("account migrations run as a non-superuser CREATEROLE schema owner", async () => {
  const database = new PGlite();
  try {
    await database.exec(`
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
        await database.exec(statement);
      }
    }
    await database.exec("commit");

    const migrationOwner = await database.query<{
      rolcreaterole: boolean;
      rolsuper: boolean;
    }>(
      `select rolcreaterole, rolsuper
         from pg_catalog.pg_roles
        where rolname = current_user`,
    );
    assert.deepEqual(migrationOwner.rows, [{ rolcreaterole: true, rolsuper: false }]);

    const capabilityRoles = await database.query<{
      rolbypassrls: boolean;
      rolcanlogin: boolean;
      rolcreatedb: boolean;
      rolcreaterole: boolean;
      rolname: string;
      rolreplication: boolean;
      rolsuper: boolean;
    }>(
      `select rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole,
              rolreplication, rolbypassrls
         from pg_catalog.pg_roles
        where rolname in (
          'chisan_admin_read',
          'chisan_producer_change_operator',
          'chisan_producer_change_recovery',
          'chisan_producer_change_api_owner'
        )
        order by rolname`,
    );
    assert.equal(capabilityRoles.rows.length, 4);
    for (const role of capabilityRoles.rows) {
      assert.deepEqual(
        {
          rolcanlogin: role.rolcanlogin,
          rolsuper: role.rolsuper,
          rolcreatedb: role.rolcreatedb,
          rolcreaterole: role.rolcreaterole,
          rolreplication: role.rolreplication,
          rolbypassrls: role.rolbypassrls,
        },
        {
          rolcanlogin: false,
          rolsuper: false,
          rolcreatedb: false,
          rolcreaterole: false,
          rolreplication: false,
          rolbypassrls: false,
        },
        `${role.rolname} must retain safe SQL-created role defaults`,
      );
    }

    const [ownership] = (
      await database.query<{
        api_owner_can_create: boolean;
        function_owner_count: number;
        view_owner: string;
      }>(
        `select
          has_schema_privilege(
            'chisan_producer_change_api_owner', 'public', 'create'
          ) as api_owner_can_create,
          (
            select count(*)::integer
            from pg_catalog.pg_proc
            where pronamespace = 'public'::regnamespace
              and proname like 'chisan_%_producer_change_%_v1'
              and proowner = 'chisan_producer_change_api_owner'::regrole
          ) as function_owner_count,
          (
            select relowner::regrole::text
            from pg_catalog.pg_class
            where oid = 'public.producer_change_request_audit_events'::regclass
          ) as view_owner`,
      )
    ).rows;
    assert.deepEqual(ownership, {
      api_owner_can_create: false,
      function_owner_count: 7,
      view_owner: "chisan_producer_change_api_owner",
    });

    const commercialPrivileges = await database.query<{
      can_delete: boolean;
      can_insert: boolean;
      can_references: boolean;
      can_select: boolean;
      can_trigger: boolean;
      can_truncate: boolean;
      can_update: boolean;
      role_name: string;
    }>(
      `select role_name,
              has_table_privilege(role_name, 'public.producer_profile_upgrade_requests', 'select') as can_select,
              has_table_privilege(role_name, 'public.producer_profile_upgrade_requests', 'insert') as can_insert,
              has_table_privilege(role_name, 'public.producer_profile_upgrade_requests', 'update') as can_update,
              has_table_privilege(role_name, 'public.producer_profile_upgrade_requests', 'delete') as can_delete,
              has_table_privilege(role_name, 'public.producer_profile_upgrade_requests', 'truncate') as can_truncate,
              has_table_privilege(role_name, 'public.producer_profile_upgrade_requests', 'references') as can_references,
              has_table_privilege(role_name, 'public.producer_profile_upgrade_requests', 'trigger') as can_trigger
         from (values
           ('chisan_admin_read'),
           ('chisan_producer_change_operator'),
           ('chisan_producer_change_recovery'),
           ('chisan_producer_change_api_owner')
         ) as roles(role_name)
        order by role_name`,
    );
    assert.deepEqual(
      commercialPrivileges.rows,
      [
        "chisan_admin_read",
        "chisan_producer_change_api_owner",
        "chisan_producer_change_operator",
        "chisan_producer_change_recovery",
      ].map((role_name) => ({
        role_name,
        can_select: false,
        can_insert: false,
        can_update: false,
        can_delete: false,
        can_truncate: false,
        can_references: false,
        can_trigger: false,
      })),
      "producer-change agent roles must not read or mutate commercial payment state",
    );

    const publicCommercialPrivileges = await database.query<{ public_acl: string }>(
      `select coalesce(array_to_string(relacl, ','), '') as public_acl
         from pg_catalog.pg_class
        where oid = 'public.producer_profile_upgrade_requests'::regclass`,
    );
    assert.doesNotMatch(
      publicCommercialPrivileges.rows[0]?.public_acl ?? "",
      /(^|,)=.*[arwdDxt]/,
      "PUBLIC must not receive commercial table privileges",
    );
  } finally {
    await database.close();
  }
});

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
        "producer_change_executions",
        "producer_change_requests",
        "producer_claims",
        "producer_memberships",
        "producer_profile_upgrade_requests",
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
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "provider_charge_id",
      },
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "provider_checkout_id",
      },
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "provider_customer_id",
      },
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "provider_dispute_id",
      },
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "provider_dispute_status",
      },
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "provider_offer_id",
      },
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "provider_payment_id",
      },
      { table_name: "webhook_receipts", column_name: "provider" },
      { table_name: "webhook_receipts", column_name: "subject" },
    ]);

    const stripeCoupledPurchaseColumns = await database.query<{ column_name: string }>(
      `select column_name
         from information_schema.columns
        where table_schema = 'public'
          and table_name = 'producer_profile_upgrade_requests'
          and column_name like 'stripe\_%' escape '\\'
        order by column_name`,
    );
    assert.deepEqual(
      stripeCoupledPurchaseColumns.rows,
      [],
      "commercial requests must identify their provider without provider-specific columns",
    );

    const forbiddenPresentationColumns = await database.query<{
      column_name: string;
      table_name: string;
    }>(
      `select table_name, column_name
         from information_schema.columns
        where table_schema = 'public'
          and column_name in (
            'locale', 'catalog', 'catalog_scope', 'catalog_path',
            'public_path', 'path', 'area', 'slug'
          )
          and not (
            table_name = 'users'
            and column_name = 'public_profile_base_area'
          )
        order by table_name, column_name`,
    );
    assert.deepEqual(
      forbiddenPresentationColumns.rows,
      [],
      "routing state must stay outside account tables; the user profile may retain its explicit base area as presentation data",
    );

    const forbiddenPresentationIndexes = await database.query<{
      index_definition: string;
      index_name: string;
    }>(
      `select indexname as index_name, indexdef as index_definition
         from pg_catalog.pg_indexes
        where schemaname = 'public'
          and lower(indexdef) ~
            '(^|[^a-z0-9_])(locale|catalog|catalog_scope|catalog_path|public_path|path|area|slug)([^a-z0-9_]|$)'
        order by indexname`,
    );
    assert.deepEqual(
      forbiddenPresentationIndexes.rows,
      [],
      "account indexes must use durable account and producer keys only",
    );

    const forbiddenAuthorizationFunctionState = await database.query<{
      routine_name: string;
    }>(
      `select proc.proname as routine_name
         from pg_catalog.pg_proc as proc
         join pg_catalog.pg_namespace as namespace
           on namespace.oid = proc.pronamespace
        where namespace.nspname = 'public'
          and proc.prosecdef
          and lower(proc.prosrc) ~
            '(^|[^a-z0-9_])(locale|catalog|catalog_scope|catalog_path|public_path|area|slug)([^a-z0-9_]|$)'
        order by proc.proname`,
    );
    assert.deepEqual(
      forbiddenAuthorizationFunctionState.rows,
      [],
      "security-definer authorization must not depend on presentation routing state",
    );

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
      {
        table_name: "producer_profile_upgrade_requests",
        column_name: "requester_user_id",
      },
      { table_name: "staff_grants", column_name: "granted_by_user_id" },
      { table_name: "staff_grants", column_name: "revoked_by_user_id" },
      { table_name: "staff_grants", column_name: "user_id" },
    ]);

    const created = await database.query<{ id: string; profile_kind: string }>(
      "insert into users (display_name) values ('Test account') returning id, profile_kind",
    );
    const userId = created.rows[0].id;
    assert.equal(created.rows[0].profile_kind, "user");
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

    const insertPendingProviderCheckout = (
      producerId: number,
      paymentProvider: string,
      providerCheckoutId: string,
    ) =>
      database.query(
        `insert into producer_profile_upgrade_requests (
           requester_user_id, country, producer_id, status, amount_minor,
           currency, terms_version, terms_url, terms_accepted_at,
           payment_provider, provider_offer_id, provider_checkout_id,
           checkout_expires_at
         ) values (
           $1, 'es', $2, 'pending', 4900, 'eur',
           'producer-profile-upgrade-v1', '/terms/profile-v1', now(),
           $3, 'offer_profile49', $4, now() + interval '30 minutes'
         )`,
        [userId, producerId, paymentProvider, providerCheckoutId],
      );

    await insertPendingProviderCheckout(60, "stripe", "checkout_shared_60");
    await assert.rejects(
      insertPendingProviderCheckout(61, "stripe", "checkout_shared_60"),
      /producer_profile_upgrade_requests_checkout_uidx|duplicate key/i,
    );
    await assert.doesNotReject(
      insertPendingProviderCheckout(62, "adyen", "checkout_shared_60"),
      "the same external reference may exist under a different provider",
    );
    await assert.rejects(
      insertPendingProviderCheckout(63, "Stripe", "checkout_invalid_provider"),
      /producer_profile_upgrade_requests_provider_check/i,
    );

    const [pendingUpgrade] = (
      await database.query<{ id: string }>(
        `insert into producer_profile_upgrade_requests (
           requester_user_id, country, producer_id, status, amount_minor,
           currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id
         ) values (
           $1, 'es', 49, 'pending', 4900, 'eur',
           'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49'
         ) returning id`,
        [userId],
      )
    ).rows;
    assert.ok(pendingUpgrade.id);
    await assert.rejects(
      database.query(
        `insert into producer_profile_upgrade_requests (
           requester_user_id, country, producer_id, status, amount_minor,
           currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id
         ) values (
           $1, 'es', 49, 'pending', 4900, 'eur',
           'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49'
         )`,
        [secondUserId],
      ),
      /producer_profile_upgrade_requests_active_producer_uidx|duplicate key/i,
    );
    await assert.rejects(
      database.query(
        `insert into producer_profile_upgrade_requests (
           requester_user_id, country, producer_id, status, amount_minor,
           currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id
         ) values (
           $1, 'es', 50, 'pending', 4899, 'eur',
           'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49'
         )`,
        [userId],
      ),
      /producer_profile_upgrade_requests_amount_check/i,
    );
    await assert.rejects(
      database.query(
        `insert into producer_profile_upgrade_requests (
           requester_user_id, country, producer_id, status, amount_minor,
           currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id,
           amount_refunded_minor, refunded_at
         ) values (
           $1, 'es', 54, 'pending', 4900, 'eur',
           'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49',
           1, now()
         )`,
        [userId],
      ),
      /producer_profile_upgrade_requests_refund_check/i,
    );
    await database.query(
      `update producer_profile_upgrade_requests
          set status = 'expired'
        where id = $1`,
      [pendingUpgrade.id],
    );
    await database.query(
      `insert into producer_profile_upgrade_requests (
         requester_user_id, country, producer_id, status, amount_minor,
         currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id,
         paid_at, failure_code
       ) values (
         $1, 'es', 49, 'paid_unfulfilled', 4900, 'eur',
         'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49',
         now(), 'missing_charge'
       )`,
      [userId],
    );
    await assert.rejects(
      database.query(
        `insert into producer_profile_upgrade_requests (
           requester_user_id, country, producer_id, status, amount_minor,
           currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id,
           failure_code
         ) values (
           $1, 'es', 51, 'paid_unfulfilled', 4900, 'eur',
           'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49',
           'missing_charge'
         )`,
        [userId],
      ),
      /producer_profile_upgrade_requests_payment_check/i,
    );

    await database.query(
      `insert into producer_profile_upgrade_requests (
         requester_user_id, country, producer_id, status, amount_minor,
         currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id,
         provider_payment_id, amount_captured_minor, captured_currency, paid_at
       ) values (
         $1, 'es', 52, 'dispute_lost', 4900, 'eur',
         'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49',
         'pi_lost_profile52', 4900, 'eur', now()
       )`,
      [userId],
    );

    await database.query(
      `insert into producer_profile_upgrade_requests (
         requester_user_id, country, producer_id, status, amount_minor,
         currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id,
         provider_payment_id, amount_captured_minor, captured_currency,
         amount_refunded_minor, paid_at, refunded_at
       ) values (
         $1, 'es', 53, 'refunded', 4900, 'eur',
         'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49',
         'pi_refunded_mismatch_profile53', 4899, 'usd', 4899, now(), now()
       )`,
      [userId],
    );
    await database.query(
      `insert into producer_profile_upgrade_requests (
         requester_user_id, country, producer_id, status, amount_minor,
         currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id
       ) values (
         $1, 'es', 53, 'pending', 4900, 'eur',
         'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49'
       )`,
      [userId],
    );
    await database.query(
      `insert into producer_profile_upgrade_requests (
         requester_user_id, country, producer_id, status, amount_minor,
         currency, terms_version, terms_url, terms_accepted_at, payment_provider, provider_offer_id
       ) values (
         $1, 'es', 52, 'pending', 4900, 'eur',
         'producer-profile-upgrade-v1', '/terms/profile-v1', now(), 'stripe', 'price_test_profile49'
       )`,
      [userId],
    );

    await database.query(
      `insert into producer_claims
         (claimant_user_id, country, producer_id, status, submitted_at,
          reviewer_user_id, reviewed_at)
       values ($1, 'es', 8, 'approved', now(), $1, now())`,
      [userId],
    );
    await assert.rejects(
      database.query(
        `insert into producer_claims
           (claimant_user_id, country, producer_id, status, submitted_at,
            reviewer_user_id, reviewed_at)
         values ($1, 'es', 8, 'approved', now(), $1, now())`,
        [secondUserId],
      ),
      /producer_claims_approved_producer_uidx|duplicate key/i,
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

test("locale removal preserves existing account-domain records", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort();
    let localeRemovalMigration: string | undefined;
    for (const migrationFile of migrationFiles) {
      const migration = await readFile(`drizzle/${migrationFile}`, "utf8");
      if (/drop column "locale"/i.test(migration)) {
        localeRemovalMigration = migrationFile;
        break;
      }
    }
    assert.ok(localeRemovalMigration, "locale removal migration is missing");

    for (const migrationFile of migrationFiles) {
      if (migrationFile === localeRemovalMigration) break;
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }

    const [account] = (
      await database.query<{ id: string }>(
        `insert into users (display_name, locale)
         values ('Legacy locale account', 'ja-JP')
         returning id`,
      )
    ).rows;
    await database.query(
      `insert into favorites (user_id, country, producer_id)
       values ($1, 'jp', 42)`,
      [account.id],
    );
    await database.query(
      `insert into producer_claims (
         claimant_user_id, country, producer_id, proof_method,
         proof, claimant_message, status, submitted_at
       )
       values ($1, 'jp', 42, 'website',
               '{"url":"https://owner.example.test"}'::jsonb,
               'Legacy ownership evidence', 'pending', now())`,
      [account.id],
    );
    await database.query(
      `insert into producer_memberships (user_id, country, producer_id, role)
       values ($1, 'jp', 42, 'owner')`,
      [account.id],
    );
    const [changeRequest] = (
      await database.query<{ id: string }>(
        `insert into producer_change_requests (
           author_user_id, country, producer_id, status, base_row_hash,
           base_snapshot, patch, submitted_at
         )
         values ($1, 'jp', 42, 'submitted', repeat('a', 64),
                 '{"nombre":"Legacy producer"}'::jsonb,
                 '{"nombre":"Updated producer"}'::jsonb, now())
         returning id`,
        [account.id],
      )
    ).rows;
    await database.query(
      `insert into audit_events (
         actor_kind, actor_user_id, action, target_type, target_id, metadata
       )
       values ('user', $1, 'producer_change.submitted',
               'producer_change_request', $2,
               '{"country":"jp","producerId":42}'::jsonb)`,
      [account.id, changeRequest.id],
    );

    await database.exec(await readFile(`drizzle/${localeRemovalMigration}`, "utf8"));

    const localeColumns = await database.query<{ column_name: string }>(
      `select column_name
         from information_schema.columns
        where table_schema = 'public'
          and table_name = 'users'
          and column_name = 'locale'`,
    );
    assert.deepEqual(localeColumns.rows, []);

    const preserved = await database.query<{
      audit_count: number;
      change_request_count: number;
      claim_count: number;
      display_name: string;
      favorite_count: number;
      membership_count: number;
    }>(
      `select users.display_name,
              count(distinct favorites.producer_id)::integer as favorite_count,
              count(distinct producer_claims.id)::integer as claim_count,
              count(distinct producer_memberships.id)::integer as membership_count,
              count(distinct producer_change_requests.id)::integer
                as change_request_count,
              count(distinct audit_events.id)::integer as audit_count
         from users
         left join favorites on favorites.user_id = users.id
         left join producer_claims
           on producer_claims.claimant_user_id = users.id
         left join producer_memberships on producer_memberships.user_id = users.id
         left join producer_change_requests
           on producer_change_requests.author_user_id = users.id
         left join audit_events on audit_events.actor_user_id = users.id
        where users.id = $1
        group by users.id`,
      [account.id],
    );
    assert.deepEqual(preserved.rows, [
      {
        display_name: "Legacy locale account",
        favorite_count: 1,
        claim_count: 1,
        membership_count: 1,
        change_request_count: 1,
        audit_count: 1,
      },
    ]);
  } finally {
    await database.close();
  }
});

test("premium producer changes require an active entitlement throughout execution", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort();
    for (const migrationFile of migrationFiles) {
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }

    const [account] = (
      await database.query<{ id: string }>(
        "insert into users (display_name) values ('Premium change test') returning id",
      )
    ).rows;
    const [change] = (
      await database.query<{ id: string }>(
        `insert into producer_change_requests (
           author_user_id, country, producer_id, status, base_row_hash,
           base_snapshot, patch, required_entitlement_key, reviewer_user_id,
           submitted_at, reviewed_at
         ) values (
           $1, 'es', 4900, 'approved', repeat('a', 64),
           '{"nombre":"Base","producer_id":"4900"}'::jsonb,
           '{"visitas guiadas":"sí"}'::jsonb,
           'producer.profile.premium', $1, now(), now()
         ) returning id`,
        [account.id],
      )
    ).rows;

    const executionId = "00000000-0000-4000-8000-000000004900";
    const insertExecution = () =>
      database.query(
        `insert into producer_change_executions (
           id, change_request_id, country, producer_id, status, operator_key,
           worktree_key, source_head_sha, expected_row_hash, lease_expires_at,
           csv_path
         ) values (
           $1, $2, 'es', 4900, 'leased', 'operator:test', repeat('b', 64),
           repeat('c', 40), repeat('d', 64), now() + interval '15 minutes',
           'data/csv/es/test/premium.csv'
         )`,
        [executionId, change.id],
      );
    await assert.rejects(insertExecution(), /required by this change is no longer active/i);

    const [entitlement] = (
      await database.query<{ id: string }>(
        `insert into entitlements (
           subject_kind, producer_country, producer_id, key, status, source
         ) values (
           'producer', 'es', 4900, 'producer.profile.premium', 'active', 'test'
         ) returning id`,
      )
    ).rows;
    await insertExecution();

    await database.query(
      `update entitlements
          set status = 'revoked', revoked_at = now()
        where id = $1`,
      [entitlement.id],
    );
    await assert.rejects(
      database.query(
        `update producer_change_executions
            set status = 'materialized', materialized_at = now()
          where id = $1`,
        [executionId],
      ),
      /required by this change is no longer active/i,
    );
  } finally {
    await database.close();
  }
});

test("profile migration derives profile kind from submitted claims", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort();
    const profileMigration = migrationFiles.find((file) => file.startsWith("0003_"));
    assert.ok(profileMigration, "profile migration is missing");

    for (const migrationFile of migrationFiles) {
      if (migrationFile === profileMigration) break;
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }

    const accounts = await database.query<{ id: string; display_name: string }>(
      `insert into users (display_name, profile_kind)
       values ('Claimant', 'user'), ('Manual producer', 'producer')
       returning id, display_name`,
    );
    const claimantId = accounts.rows.find(
      ({ display_name }) => display_name === "Claimant",
    )?.id;
    assert.ok(claimantId);
    await database.query(
      `insert into producer_claims
         (claimant_user_id, country, producer_id, status, submitted_at)
       values ($1, 'es', 9, 'pending', now())`,
      [claimantId],
    );

    await database.exec(await readFile(`drizzle/${profileMigration}`, "utf8"));

    const reconciled = await database.query<{
      display_name: string;
      profile_kind: string;
    }>(
      `select display_name, profile_kind
       from users
       order by display_name`,
    );
    assert.deepEqual(reconciled.rows, [
      { display_name: "Claimant", profile_kind: "producer" },
      { display_name: "Manual producer", profile_kind: "user" },
    ]);
  } finally {
    await database.close();
  }
});

test("producer-change operator roles expose reads and only the versioned workflow API", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort();
    for (const migrationFile of migrationFiles) {
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }

    const accounts = await database.query<{ id: string; display_name: string }>(
      `insert into users (display_name)
       values ('Operator test author'), ('Operator test reviewer')
       returning id, display_name`,
    );
    const authorId = accounts.rows.find(
      ({ display_name }) => display_name === "Operator test author",
    )?.id;
    const reviewerId = accounts.rows.find(
      ({ display_name }) => display_name === "Operator test reviewer",
    )?.id;
    assert.ok(authorId);
    assert.ok(reviewerId);
    await database.query(
      `insert into producer_memberships (user_id, country, producer_id, role)
       values ($1, 'es', 91, 'owner')`,
      [authorId],
    );
    const [change] = (
      await database.query<{ id: string }>(
        `insert into producer_change_requests (
           author_user_id, country, producer_id, status, base_row_hash,
           base_snapshot, patch, reviewer_user_id, submitted_at, reviewed_at
         ) values (
           $1, 'es', 91, 'approved', repeat('a', 64),
           '{"nombre":"Base","producer_id":"91"}'::jsonb,
           '{"nombre":"Updated"}'::jsonb, $2, now(), now()
         ) returning id`,
        [authorId, reviewerId],
      )
    ).rows;
    await database.query(
      `insert into audit_events
         (actor_kind, actor_key, action, target_type, target_id, metadata)
       values
         ('system', 'test', 'producer_change.created', 'producer_change_request', $1, '{}'::jsonb),
         ('system', 'test', 'webhook.received', 'webhook_receipt', 'private-receipt', '{}'::jsonb)`,
      [change.id],
    );

    await database.exec("set role chisan_admin_read");
    const readable = await database.query<{ id: string }>(
      "select id from producer_change_requests where id = $1",
      [change.id],
    );
    assert.equal(readable.rows[0]?.id, change.id);
    const visibleAudit = await database.query<{ target_id: string }>(
      "select target_id from producer_change_request_audit_events",
    );
    assert.deepEqual(visibleAudit.rows, [{ target_id: change.id }]);
    await assert.rejects(
      database.query("select id from audit_events"),
      /permission denied/i,
    );
    await assert.rejects(
      database.query("select id from producer_memberships"),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        "update producer_change_requests set failure_reason = 'forged' where id = $1",
        [change.id],
      ),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        "update producer_change_executions set status = 'cancelled' where change_request_id = $1",
        [change.id],
      ),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        `select * from public.chisan_begin_producer_change_execution_v1(
           '00000000-0000-4000-8000-000000000091', $1,
           repeat('b', 64), 'data/csv/es/test/area.csv', repeat('c', 40),
           repeat('d', 64), 900
         )`,
        [change.id],
      ),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        `select public.chisan_recover_producer_change_execution_v1(
           $1, '00000000-0000-4000-8000-000000000091', repeat('b', 64),
           repeat('c', 40), repeat('a', 64), 'Documented recovery reason for test.'
         )`,
        [change.id],
      ),
      /permission denied/i,
    );
    await database.exec("reset role");

    await database.exec("set role chisan_producer_change_operator");
    await database.query("select id from producer_change_requests where id = $1", [
      change.id,
    ]);
    await assert.rejects(
      database.query("select id from producer_memberships"),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        "update producer_change_requests set status = 'failed' where id = $1",
        [change.id],
      ),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        "update producer_change_executions set status = 'cancelled' where change_request_id = $1",
        [change.id],
      ),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        `insert into audit_events
           (actor_kind, actor_key, action, target_type, target_id)
         values ('service', 'forged', 'forged', 'producer_change_request', $1)`,
        [change.id],
      ),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        `select public.chisan_recover_producer_change_execution_v1(
           $1, '00000000-0000-4000-8000-000000000091', repeat('b', 64),
           repeat('c', 40), repeat('a', 64), 'Documented recovery reason for test.'
         )`,
        [change.id],
      ),
      /permission denied/i,
    );

    const executionId = "00000000-0000-4000-8000-000000000091";
    const expectedHash = "d".repeat(64);
    await database.query(
      `select * from public.chisan_begin_producer_change_execution_v1(
         $1, $2, repeat('b', 64), 'data/csv/es/test/area.csv', repeat('c', 40),
         $3, 900
       )`,
      [executionId, change.id, expectedHash],
    );
    const leased = await database.query<{ request_status: string; execution_status: string }>(
      `select request.status::text as request_status,
              execution.status::text as execution_status
       from producer_change_requests as request
       join producer_change_executions as execution
         on execution.change_request_id = request.id
       where request.id = $1`,
      [change.id],
    );
    assert.deepEqual(leased.rows, [
      { request_status: "approved", execution_status: "leased" },
    ]);
    await assert.rejects(
      database.query(
        `select * from public.chisan_begin_producer_change_execution_v1(
           '00000000-0000-4000-8000-000000000092', $1,
           repeat('e', 64), 'data/csv/es/test/area.csv', repeat('c', 40),
           $2, 900
         )`,
        [change.id, expectedHash],
      ),
      /active producer-change execution/i,
    );
    await assert.rejects(
      database.query(
        `select public.chisan_complete_producer_change_execution_v1(
           $1, null, array['nombre']::text[], false
         )`,
        [executionId],
      ),
      /completion inputs are invalid/i,
    );
    await assert.rejects(
      database.query(
        `select public.chisan_fail_producer_change_preflight_v1(
           $1, 'failed', 'must preserve live execution'
         )`,
        [change.id],
      ),
      /active execution already owns/i,
    );
    await database.query(
      `select public.chisan_complete_producer_change_execution_v1(
         $1, $2, array['nombre']::text[], false
       )`,
      [executionId, expectedHash],
    );
    await database.query(
      `select public.chisan_complete_producer_change_execution_v1(
         $1, $2, array['nombre']::text[], false
       )`,
      [executionId, expectedHash],
    );
    const materialized = await database.query<{
      request_status: string;
      execution_status: string;
    }>(
      `select request.status::text as request_status,
              execution.status::text as execution_status
       from producer_change_requests as request
       join producer_change_executions as execution
         on execution.change_request_id = request.id
       where request.id = $1`,
      [change.id],
    );
    assert.deepEqual(materialized.rows, [
      { request_status: "applying", execution_status: "materialized" },
    ]);
    await assert.rejects(
      database.query(
        `select public.chisan_finalize_producer_change_execution_v1(
           $1, repeat('f', 40), null, null
         )`,
        [change.id],
      ),
      /expected producer hash is invalid|CSV path is required/i,
    );
    await database.query(
      `select public.chisan_finalize_producer_change_execution_v1(
         $1, repeat('f', 40), 'data/csv/es/test/area.csv', $2
       )`,
      [change.id, expectedHash],
    );
    await database.exec("reset role");

    const finalized = await database.query<{
      request_status: string;
      execution_status: string;
      actor_key: string;
    }>(
      `select request.status::text as request_status,
              execution.status::text as execution_status,
              applied.actor_key
       from producer_change_requests as request
       join producer_change_executions as execution
         on execution.change_request_id = request.id
       join audit_events as applied
         on applied.target_id = request.id::text
        and applied.action = 'producer_change.applied'
       where request.id = $1`,
      [change.id],
    );
    assert.deepEqual(finalized.rows, [
      {
        request_status: "applied",
        execution_status: "finalized",
        actor_key: "postgres",
      },
    ]);
  } finally {
    await database.close();
  }
});

test("staff recovery is quarantined, reset-only and isolated from operator authority", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort();
    for (const migrationFile of migrationFiles) {
      await database.exec(await readFile(`drizzle/${migrationFile}`, "utf8"));
    }

    const accounts = await database.query<{ id: string; display_name: string }>(
      `insert into users (display_name)
       values ('Recovery author'), ('Recovery reviewer')
       returning id, display_name`,
    );
    const authorId = accounts.rows.find(({ display_name }) => display_name === "Recovery author")
      ?.id;
    const reviewerId = accounts.rows.find(
      ({ display_name }) => display_name === "Recovery reviewer",
    )?.id;
    assert.ok(authorId);
    assert.ok(reviewerId);
    await database.query(
      `insert into producer_memberships (user_id, country, producer_id, role)
       values ($1, 'es', 205, 'owner')`,
      [authorId],
    );
    const change = await database.query<{ id: string }>(
      `insert into producer_change_requests (
         author_user_id, country, producer_id, status, base_row_hash,
         base_snapshot, patch, reviewer_user_id, submitted_at, reviewed_at
       ) values (
         $1, 'es', 205, 'approved', repeat('a', 64),
         '{"nombre":"Base","producer_id":"205"}'::jsonb,
         '{"nombre":"Updated"}'::jsonb, $2, now(), now()
       ) returning id`,
      [authorId, reviewerId],
    );
    const changeId = change.rows[0].id;
    const executionId = "00000000-0000-4000-8000-000000000205";

    await database.exec("set role chisan_producer_change_operator");
    await database.query(
      `select * from public.chisan_begin_producer_change_execution_v1(
         $1, $2, repeat('b', 64), 'data/csv/es/test/recovery.csv',
         repeat('c', 40), repeat('d', 64), 900
       )`,
      [executionId, changeId],
    );
    await database.query(
      `select public.chisan_complete_producer_change_execution_v1(
         $1, repeat('d', 64), array['nombre']::text[], false
       )`,
      [executionId],
    );
    await assert.rejects(
      database.query(
        `select public.chisan_recover_producer_change_execution_v1(
           $1, $2, repeat('e', 64), repeat('f', 40), repeat('a', 64),
           'The original controlled worktree is abandoned.'
         )`,
        [changeId, executionId],
      ),
      /permission denied/i,
    );
    await database.exec("reset role");

    await database.exec("set role chisan_producer_change_recovery");
    await database.query("select id from producer_change_requests where id = $1", [changeId]);
    await assert.rejects(
      database.query(
        `select * from public.chisan_begin_producer_change_execution_v1(
           '00000000-0000-4000-8000-000000000206', $1, repeat('e', 64),
           'data/csv/es/test/recovery.csv', repeat('f', 40), repeat('d', 64), 900
         )`,
        [changeId],
      ),
      /permission denied/i,
    );
    await assert.rejects(
      database.query(
        `select public.chisan_recover_producer_change_execution_v1(
           $1, $2, repeat('e', 64), repeat('f', 40), repeat('a', 64),
           'The original controlled worktree is abandoned.'
         )`,
        [changeId, executionId],
      ),
      /quarantine remains active/i,
    );
    await database.exec("reset role");

    const stillFenced = await database.query<{ execution_status: string; request_status: string }>(
      `select request.status::text as request_status,
              execution.status::text as execution_status
       from producer_change_requests as request
       join producer_change_executions as execution
         on execution.change_request_id = request.id
       where request.id = $1`,
      [changeId],
    );
    assert.deepEqual(stillFenced.rows, [
      { request_status: "applying", execution_status: "materialized" },
    ]);

    await database.query(
      `update producer_change_executions
       set materialized_at = now() - interval '25 hours'
       where id = $1`,
      [executionId],
    );
    await database.exec("set role chisan_producer_change_recovery");
    await assert.rejects(
      database.query(
        `select public.chisan_recover_producer_change_execution_v1(
           $1, $2, repeat('e', 64), repeat('f', 40), repeat('9', 64),
           'The original controlled worktree is abandoned.'
         )`,
        [changeId, executionId],
      ),
      /reviewed base or approved producer hash/i,
    );
    const recovered = await database.query<{ execution_id: string }>(
      `select public.chisan_recover_producer_change_execution_v1(
         $1, $2, repeat('e', 64), repeat('f', 40), repeat('a', 64),
         'The original controlled worktree is abandoned.'
       ) as execution_id`,
      [changeId, executionId],
    );
    assert.equal(recovered.rows[0]?.execution_id, executionId);
    const repeated = await database.query<{ execution_id: string }>(
      `select public.chisan_recover_producer_change_execution_v1(
         $1, $2, repeat('e', 64), repeat('f', 40), repeat('a', 64),
         'The original controlled worktree is abandoned.'
       ) as execution_id`,
      [changeId, executionId],
    );
    assert.equal(repeated.rows[0]?.execution_id, executionId);
    await assert.rejects(
      database.query(
        `update producer_change_executions set error_message = 'forged' where id = $1`,
        [executionId],
      ),
      /permission denied/i,
    );
    await database.exec("reset role");

    const released = await database.query<{
      audit_count: number;
      execution_status: string;
      request_status: string;
    }>(
      `select request.status::text as request_status,
              execution.status::text as execution_status,
              count(audit.id)::integer as audit_count
       from producer_change_requests as request
       join producer_change_executions as execution
         on execution.change_request_id = request.id
       left join audit_events as audit
         on audit.target_id = request.id::text
        and audit.action = 'producer_change.execution_recovered'
       where request.id = $1
       group by request.status, execution.status`,
      [changeId],
    );
    assert.deepEqual(released.rows, [
      { request_status: "approved", execution_status: "cancelled", audit_count: 1 },
    ]);

    await database.exec("set role chisan_producer_change_operator");
    await database.query(
      `select * from public.chisan_begin_producer_change_execution_v1(
         '00000000-0000-4000-8000-000000000206', $1, repeat('1', 64),
         'data/csv/es/test/recovery.csv', repeat('2', 40), repeat('d', 64), 900
       )`,
      [changeId],
    );
    await database.exec("reset role");

    await database.query(
      `insert into producer_memberships (user_id, country, producer_id, role)
       values ($1, 'es', 207, 'owner')`,
      [authorId],
    );
    const inactiveChange = await database.query<{ id: string }>(
      `insert into producer_change_requests (
         author_user_id, country, producer_id, status, base_row_hash,
         base_snapshot, patch, reviewer_user_id, submitted_at, reviewed_at
       ) values (
         $1, 'es', 207, 'approved', repeat('a', 64),
         '{"nombre":"Base","producer_id":"207"}'::jsonb,
         '{"nombre":"Updated"}'::jsonb, $2, now(), now()
       ) returning id`,
      [authorId, reviewerId],
    );
    const inactiveExecutionId = "00000000-0000-4000-8000-000000000207";
    await database.exec("set role chisan_producer_change_operator");
    await database.query(
      `select * from public.chisan_begin_producer_change_execution_v1(
         $1, $2, repeat('3', 64), 'data/csv/es/test/recovery-inactive.csv',
         repeat('4', 40), repeat('d', 64), 900
       )`,
      [inactiveExecutionId, inactiveChange.rows[0].id],
    );
    await database.query(
      `select public.chisan_complete_producer_change_execution_v1(
         $1, repeat('d', 64), array['nombre']::text[], false
       )`,
      [inactiveExecutionId],
    );
    await database.exec("reset role");
    await database.query(
      `update producer_change_executions
       set materialized_at = now() - interval '25 hours'
       where id = $1`,
      [inactiveExecutionId],
    );
    await database.query("update users set status = 'suspended' where id = $1", [authorId]);

    await database.exec("set role chisan_producer_change_recovery");
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const cancelled = await database.query<{ execution_id: string }>(
        `select public.chisan_recover_producer_change_execution_v1(
           $1, $2, repeat('5', 64), repeat('6', 40), repeat('a', 64),
           'Producer access was suspended during incident review.'
         ) as execution_id`,
        [inactiveChange.rows[0].id, inactiveExecutionId],
      );
      assert.equal(cancelled.rows[0]?.execution_id, inactiveExecutionId);
    }
    await database.exec("reset role");

    const inactiveState = await database.query<{
      audit_count: number;
      execution_status: string;
      request_status: string;
    }>(
      `select request.status::text as request_status,
              execution.status::text as execution_status,
              count(audit.id)::integer as audit_count
       from producer_change_requests as request
       join producer_change_executions as execution
         on execution.change_request_id = request.id
       left join audit_events as audit
         on audit.target_id = request.id::text
        and audit.action = 'producer_change.execution_cancelled'
       where request.id = $1
       group by request.status, execution.status`,
      [inactiveChange.rows[0].id],
    );
    assert.deepEqual(inactiveState.rows, [
      { request_status: "conflict", execution_status: "cancelled", audit_count: 1 },
    ]);
  } finally {
    await database.close();
  }
});

test("producer-change preflight closes revoked and expired execution fences", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort();
    for (const migrationFile of migrationFiles) {
      const migration = await readFile(`drizzle/${migrationFile}`, "utf8");
      assert.doesNotMatch(
        migration,
        /hashtextextended\('producer:/,
        `${migrationFile} must share the application's hashtext advisory-lock key`,
      );
      await database.exec(migration);
    }

    const accounts = await database.query<{ id: string; display_name: string }>(
      `insert into users (display_name)
       values ('Lease author'), ('Lease reviewer')
       returning id, display_name`,
    );
    const authorId = accounts.rows.find(({ display_name }) => display_name === "Lease author")
      ?.id;
    const reviewerId = accounts.rows.find(
      ({ display_name }) => display_name === "Lease reviewer",
    )?.id;
    assert.ok(authorId);
    assert.ok(reviewerId);

    async function createApprovedChange(producerId: number): Promise<string> {
      await database.query(
        `insert into producer_memberships (user_id, country, producer_id, role)
         values ($1, 'es', $2, 'owner')`,
        [authorId, producerId],
      );
      const result = await database.query<{ id: string }>(
        `insert into producer_change_requests (
           author_user_id, country, producer_id, status, base_row_hash,
           base_snapshot, patch, reviewer_user_id, submitted_at, reviewed_at
         ) values (
           $1, 'es', $2::bigint, 'approved', repeat('a', 64),
           jsonb_build_object('nombre', 'Base', 'producer_id', ($2::bigint)::text),
           '{"nombre":"Updated"}'::jsonb, $3, now(), now()
         ) returning id`,
        [authorId, producerId, reviewerId],
      );
      return result.rows[0].id;
    }

    async function beginExecution(
      changeId: string,
      producerId: number,
      suffix: number,
    ): Promise<string> {
      const executionId = `00000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;
      await database.exec("set role chisan_producer_change_operator");
      await database.query(
        `select * from public.chisan_begin_producer_change_execution_v1(
           $1, $2, repeat('b', 64), $3, repeat('c', 40), repeat('d', 64), 900
         )`,
        [executionId, changeId, `data/csv/es/test/area-${producerId}.csv`],
      );
      await database.exec("reset role");
      return executionId;
    }

    const expiredChangeId = await createApprovedChange(201);
    const expiredExecutionId = await beginExecution(expiredChangeId, 201, 201);
    await database.query(
      `update producer_change_executions
       set created_at = now() - interval '2 hours',
           lease_expires_at = now() - interval '1 hour'
       where id = $1`,
      [expiredExecutionId],
    );
    await database.query(
      `update producer_memberships
       set status = 'revoked', revoked_at = now(), revoked_by_user_id = $2,
           revocation_reason = 'test revocation'
       where user_id = $1 and producer_id = 201`,
      [authorId, reviewerId],
    );
    await database.exec("set role chisan_producer_change_operator");
    await database.query(
      `select public.chisan_fail_producer_change_preflight_v1(
         $1, 'conflict', 'Producer access was revoked before publication.'
       )`,
      [expiredChangeId],
    );
    await database.exec("reset role");

    const leasedChangeId = await createApprovedChange(202);
    await beginExecution(leasedChangeId, 202, 202);
    await database.query(
      `update producer_memberships
       set status = 'revoked', revoked_at = now(), revoked_by_user_id = $2,
           revocation_reason = 'test revocation'
       where user_id = $1 and producer_id = 202`,
      [authorId, reviewerId],
    );
    await database.exec("set role chisan_producer_change_operator");
    await database.query(
      `select public.chisan_fail_producer_change_preflight_v1(
         $1, 'conflict', 'Producer access was revoked before publication.'
       )`,
      [leasedChangeId],
    );
    await database.exec("reset role");

    const materializedChangeId = await createApprovedChange(203);
    const materializedExecutionId = await beginExecution(
      materializedChangeId,
      203,
      203,
    );
    await database.exec("set role chisan_producer_change_operator");
    await database.query(
      `select public.chisan_complete_producer_change_execution_v1(
         $1, repeat('d', 64), array['nombre']::text[], false
       )`,
      [materializedExecutionId],
    );
    await database.exec("reset role");
    await database.query(
      `update producer_memberships
       set status = 'revoked', revoked_at = now(), revoked_by_user_id = $2,
           revocation_reason = 'test revocation'
       where user_id = $1 and producer_id = 203`,
      [authorId, reviewerId],
    );
    await database.exec("set role chisan_producer_change_operator");
    await database.query(
      `select public.chisan_fail_producer_change_preflight_v1(
         $1, 'conflict', 'Producer access was revoked before publication.'
       )`,
      [materializedChangeId],
    );
    await database.exec("reset role");

    const terminalStates = await database.query<{
      execution_status: string;
      producer_id: number;
      request_status: string;
    }>(
      `select request.producer_id::integer as producer_id,
              request.status::text as request_status,
              execution.status::text as execution_status
       from producer_change_requests as request
       join producer_change_executions as execution
         on execution.change_request_id = request.id
       where request.producer_id in (201, 202, 203)
       order by request.producer_id`,
    );
    assert.deepEqual(terminalStates.rows, [
      { producer_id: 201, request_status: "conflict", execution_status: "expired" },
      { producer_id: 202, request_status: "conflict", execution_status: "cancelled" },
      { producer_id: 203, request_status: "conflict", execution_status: "cancelled" },
    ]);

    const draft = await database.query<{ id: string }>(
      `insert into producer_change_requests (
         author_user_id, country, producer_id, status, base_row_hash, base_snapshot
       ) values ($1, 'es', 204, 'draft', repeat('a', 64), '{}'::jsonb)
       returning id`,
      [authorId],
    );
    await database.query(
      `update producer_change_requests set status = 'conflict', failure_reason = 'revoked'
       where id = $1`,
      [draft.rows[0].id],
    );
    const closedDraft = await database.query<{ status: string }>(
      "select status::text as status from producer_change_requests where id = $1",
      [draft.rows[0].id],
    );
    assert.equal(closedDraft.rows[0]?.status, "conflict");
  } finally {
    await database.close();
  }
});
