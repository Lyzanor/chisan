import { randomBytes, randomUUID } from "node:crypto";
import { chmod, lstat, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import postgres, { type Sql, type TransactionSql } from "postgres";

import {
  PRODUCER_CHANGE_OPERATOR_DATABASE_VARIABLE,
  PRODUCER_CHANGE_OPERATOR_ENV_FILE,
  PRODUCER_CHANGE_READ_DATABASE_VARIABLE,
  PRODUCER_CHANGE_READ_ENV_FILE,
  PRODUCER_CHANGE_RECOVERY_DATABASE_VARIABLE,
  PRODUCER_CHANGE_RECOVERY_ENV_FILE,
} from "./producer-change-access";

const USAGE =
  "Usage: pnpm producer:access provision <read|operator|recovery> <principal>\n" +
  "Example: pnpm producer:access provision operator codex_a";

const PRINCIPAL_PATTERN = /^[a-z][a-z0-9_]{1,30}$/;
const READ_GROUP_ROLE = "chisan_admin_read";
const OPERATOR_GROUP_ROLE = "chisan_producer_change_operator";
const RECOVERY_GROUP_ROLE = "chisan_producer_change_recovery";

type AccessProbe = {
  sessionUser: string;
  groupMember: boolean;
  readChanges: boolean;
  directUpdateChanges: boolean;
  directInsertAudit: boolean;
  executeAllOperatorWorkflow: boolean;
  executeAnyOperatorWorkflow: boolean;
  executeRecovery: boolean;
  schemaCreate: boolean;
  directAccountWrites: boolean;
  transactionReadOnly: boolean;
};

export type ProducerChangeAccessProvision = {
  access: "read" | "operator" | "recovery";
  principal: string;
};

export function parseProducerChangeAccessProvision(
  argv: readonly string[],
): ProducerChangeAccessProvision {
  const [command, access, principal, ...extra] = argv;
  if (
    command !== "provision" ||
    (access !== "read" && access !== "operator" && access !== "recovery") ||
    !principal ||
    extra.length > 0
  ) {
    throw new Error(USAGE);
  }
  if (!PRINCIPAL_PATTERN.test(principal)) {
    throw new Error(
      "Principal must contain 2-31 lowercase letters, digits or underscores and start with a letter.",
    );
  }
  return { access, principal };
}

function quoteIdentifier(identifier: string): string {
  if (!/^[a-z][a-z0-9_]{1,62}$/.test(identifier)) {
    throw new Error(`Unsafe PostgreSQL role name '${identifier}'.`);
  }
  return `"${identifier}"`;
}

function quoteLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

export function producerChangeLoginRoleNames(
  principal: string,
): { operator: string; read: string; recovery: string } {
  return {
    read: `chisan_agent_read_${principal}`,
    operator: `chisan_agent_operator_${principal}`,
    recovery: `chisan_agent_recovery_${principal}`,
  };
}

function secret(): string {
  return randomBytes(32).toString("base64url");
}

export function producerChangeRoleConnectionString(
  migrationUrl: URL,
  role: string,
  password: string,
): string {
  const result = new URL(migrationUrl);
  result.username = role;
  result.password = password;
  result.searchParams.set("application_name", "chisan-producer-change-cli");
  return result.toString();
}

async function atomicWriteSecretFile(
  filePath: string,
  variable: string,
  value: string,
): Promise<void> {
  const absolutePath = path.resolve(filePath);
  const temporaryPath = `${absolutePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, `${variable}=${value}\n`, {
      encoding: "utf8",
      flag: "wx",
      mode: 0o600,
    });
    await chmod(temporaryPath, 0o600);
    await rename(temporaryPath, absolutePath);
    await chmod(absolutePath, 0o600);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

export async function assertPrivateCredentialFile(filePath: string): Promise<boolean> {
  let file;
  try {
    file = await lstat(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
  if (file.isSymbolicLink() || !file.isFile()) {
    throw new Error(`${filePath} must be a regular file, not a symlink.`);
  }
  const currentUid = process.getuid?.();
  if (currentUid !== undefined && file.uid !== currentUid) {
    throw new Error(`${filePath} must be owned by the current operating-system user.`);
  }
  if ((file.mode & 0o077) !== 0) {
    throw new Error(`${filePath} contains a privileged credential and must use mode 0600.`);
  }
  return true;
}

async function assertAccessSchema(admin: Sql): Promise<void> {
  const [state] = await admin<
    {
      apiReady: boolean;
      operatorRole: boolean;
      readRole: boolean;
      recoveryRole: boolean;
    }[]
  >`
    select
      to_regrole(${READ_GROUP_ROLE}) is not null as "readRole",
      to_regrole(${OPERATOR_GROUP_ROLE}) is not null as "operatorRole",
      to_regrole(${RECOVERY_GROUP_ROLE}) is not null as "recoveryRole",
      to_regprocedure(
        'public.chisan_begin_producer_change_execution_v2(uuid,uuid,text,text,text,text,integer,text)'
      ) is not null
      and to_regprocedure(
        'public.chisan_complete_producer_change_execution_v2(uuid,text,text[],boolean,text)'
      ) is not null
      and to_regprocedure(
        'public.chisan_fail_producer_change_execution_v1(uuid,text,text)'
      ) is not null
      and to_regprocedure(
        'public.chisan_fail_producer_change_preflight_v1(uuid,text,text)'
      ) is not null
      and to_regprocedure(
        'public.chisan_recover_producer_change_execution_v2(uuid,uuid,text,text,text,text,text)'
      ) is not null
      and to_regprocedure(
        'public.chisan_finalize_producer_change_execution_v2(uuid,text,text,text,text)'
      ) is not null as "apiReady"
  `;
  if (!state?.readRole || !state.operatorRole || !state.recoveryRole || !state.apiReady) {
    throw new Error(
      "Producer-change access migration is not current. Run db:migrate before provisioning logins.",
    );
  }
}

async function provisionLogin(
  admin: Sql | TransactionSql,
  role: string,
  groupRole: string,
  password: string,
  databaseName: string,
  readOnly: boolean,
): Promise<void> {
  const roleIdentifier = quoteIdentifier(role);
  const groupIdentifier = quoteIdentifier(groupRole);
  const [existing] = await admin<
    {
      canLogin: boolean;
      dangerous: boolean;
      exists: boolean;
      memberships: string[];
      ownsObjects: boolean;
      grantedToOthers: boolean;
    }[]
  >`
    select
      target.oid is not null as "exists",
      coalesce(target.rolcanlogin, false) as "canLogin",
      coalesce(
        target.rolsuper or target.rolcreatedb or target.rolcreaterole
          or target.rolreplication or target.rolbypassrls
          or pg_has_role(target.oid, 'neon_superuser', 'member'),
        false
      ) as dangerous,
      coalesce((
        select array_agg(granted.rolname::text order by granted.rolname)
        from pg_catalog.pg_auth_members as membership
        join pg_catalog.pg_roles as granted on granted.oid = membership.roleid
        where membership.member = target.oid
      ), array[]::text[]) as memberships,
      coalesce(
        exists(select 1 from pg_catalog.pg_database where datdba = target.oid)
        or exists(select 1 from pg_catalog.pg_namespace where nspowner = target.oid)
        or exists(select 1 from pg_catalog.pg_class where relowner = target.oid)
        or exists(select 1 from pg_catalog.pg_proc where proowner = target.oid)
        or exists(select 1 from pg_catalog.pg_type where typowner = target.oid),
        false
      ) as "ownsObjects",
      coalesce(exists(
        select 1
        from pg_catalog.pg_auth_members
        where roleid = target.oid
          and member <> to_regrole(current_user)
      ), false) as "grantedToOthers"
    from (select to_regrole(${role})::oid as oid) as resolved
    left join pg_catalog.pg_roles as target on target.oid = resolved.oid
  `;

  if (
    existing?.exists &&
    (!existing.canLogin ||
      existing.dangerous ||
      existing.ownsObjects ||
      existing.grantedToOthers ||
      existing.memberships.length !== 1 ||
      existing.memberships[0] !== groupRole)
  ) {
    throw new Error(
      `Existing role '${role}' is not an exact managed ${groupRole} login; refusing to rotate it.`,
    );
  }

  if (!existing?.exists) {
    await admin.unsafe(
      `CREATE ROLE ${roleIdentifier} LOGIN PASSWORD ${quoteLiteral(password)}`,
    );
  } else {
    await admin.unsafe(
      `ALTER ROLE ${roleIdentifier} LOGIN PASSWORD ${quoteLiteral(password)}`,
    );
  }
  await admin.unsafe(`ALTER ROLE ${roleIdentifier} LOGIN INHERIT NOCREATEROLE`);
  await admin.unsafe(`GRANT ${groupIdentifier} TO ${roleIdentifier}`);
  await admin.unsafe(`REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ${roleIdentifier}`);
  await admin.unsafe(`REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM ${roleIdentifier}`);
  await admin.unsafe(`REVOKE ALL ON SCHEMA public FROM ${roleIdentifier}`);
  await admin.unsafe(
    `REVOKE CREATE, TEMPORARY ON DATABASE "${databaseName.replaceAll('"', '""')}" FROM ${roleIdentifier}`,
  );
  await admin.unsafe(
    `ALTER ROLE ${roleIdentifier} IN DATABASE "${databaseName.replaceAll('"', '""')}" SET default_transaction_read_only = ${readOnly ? "on" : "off"}`,
  );
  await admin.unsafe(
    `ALTER ROLE ${roleIdentifier} IN DATABASE "${databaseName.replaceAll('"', '""')}" SET statement_timeout = '20s'`,
  );
  await admin.unsafe(
    `ALTER ROLE ${roleIdentifier} IN DATABASE "${databaseName.replaceAll('"', '""')}" SET lock_timeout = '15s'`,
  );

  const [dangerous] = await admin<{ dangerous: boolean }[]>`
    select
      rolsuper or rolcreatedb or rolcreaterole or rolreplication or rolbypassrls
      or pg_has_role(${role}, 'neon_superuser', 'member') as dangerous
    from pg_catalog.pg_roles
    where rolname = ${role}
  `;
  if (!dangerous || dangerous.dangerous) {
    throw new Error(`Provisioned role '${role}' has unexpected administrative privileges.`);
  }
  const unexpectedMemberships = await admin<{ role: string }[]>`
    select granted.rolname::text as role
    from pg_catalog.pg_auth_members as membership
    join pg_catalog.pg_roles as member on member.oid = membership.member
    join pg_catalog.pg_roles as granted on granted.oid = membership.roleid
    where member.rolname = ${role} and granted.rolname <> ${groupRole}
  `;
  if (unexpectedMemberships.length > 0) {
    throw new Error(
      `Provisioned role '${role}' retains unexpected memberships: ${unexpectedMemberships
        .map(({ role: membership }) => membership)
        .join(", ")}.`,
    );
  }
}

async function inspectAccess(
  connectionString: string,
  groupRole: string,
): Promise<AccessProbe> {
  const connection = postgres(connectionString, {
    prepare: false,
    max: 1,
    connect_timeout: 10,
    idle_timeout: 10,
  });
  try {
    const [probe] = await connection<AccessProbe[]>`
      select
        session_user::text as "sessionUser",
        pg_has_role(session_user, ${groupRole}, 'member') as "groupMember",
        has_any_column_privilege(
          session_user, 'public.producer_change_requests', 'select'
        ) as "readChanges",
        has_any_column_privilege(
          session_user, 'public.producer_change_requests', 'update'
        ) as "directUpdateChanges",
        has_any_column_privilege(
          session_user, 'public.audit_events', 'insert'
        ) as "directInsertAudit",
        (
          select bool_and(coalesce(has_function_privilege(session_user, signature, 'execute'), false))
          from unnest(array[
            to_regprocedure('public.chisan_begin_producer_change_execution_v2(uuid,uuid,text,text,text,text,integer,text)'),
            to_regprocedure('public.chisan_complete_producer_change_execution_v2(uuid,text,text[],boolean,text)'),
            to_regprocedure('public.chisan_fail_producer_change_execution_v1(uuid,text,text)'),
            to_regprocedure('public.chisan_fail_producer_change_preflight_v1(uuid,text,text)'),
            to_regprocedure('public.chisan_finalize_producer_change_execution_v2(uuid,text,text,text,text)')
          ]) as workflow(signature)
        ) as "executeAllOperatorWorkflow",
        (
          select bool_or(coalesce(has_function_privilege(session_user, signature, 'execute'), false))
          from unnest(array[
            to_regprocedure('public.chisan_begin_producer_change_execution_v2(uuid,uuid,text,text,text,text,integer,text)'),
            to_regprocedure('public.chisan_complete_producer_change_execution_v2(uuid,text,text[],boolean,text)'),
            to_regprocedure('public.chisan_fail_producer_change_execution_v1(uuid,text,text)'),
            to_regprocedure('public.chisan_fail_producer_change_preflight_v1(uuid,text,text)'),
            to_regprocedure('public.chisan_finalize_producer_change_execution_v2(uuid,text,text,text,text)')
          ]) as workflow(signature)
        ) as "executeAnyOperatorWorkflow",
        has_function_privilege(
          session_user,
          'public.chisan_recover_producer_change_execution_v2(uuid,uuid,text,text,text,text,text)',
          'execute'
        ) as "executeRecovery",
        has_schema_privilege(session_user, 'public', 'create') as "schemaCreate",
        has_any_column_privilege(session_user, 'public.users', 'update')
          or has_table_privilege(session_user, 'public.users', 'delete')
          or has_any_column_privilege(session_user, 'public.producer_memberships', 'update')
          or has_table_privilege(session_user, 'public.producer_memberships', 'delete')
          or has_any_column_privilege(session_user, 'public.producer_change_executions', 'insert')
          or has_any_column_privilege(session_user, 'public.producer_change_executions', 'update')
          or has_table_privilege(session_user, 'public.producer_change_requests', 'truncate')
          as "directAccountWrites",
        current_setting('transaction_read_only') = 'on' as "transactionReadOnly"
    `;
    if (!probe) throw new Error("Access probe returned no result.");
    return probe;
  } finally {
    await connection.end();
  }
}

function assertProbe(
  probe: AccessProbe,
  expectedRole: string,
  access: "read" | "operator" | "recovery",
): void {
  if (!probe.groupMember || !probe.readChanges) {
    throw new Error(`Login '${probe.sessionUser}' is missing ${expectedRole} read access.`);
  }
  if (
    probe.directUpdateChanges ||
    probe.directInsertAudit ||
    probe.directAccountWrites ||
    probe.schemaCreate
  ) {
    throw new Error(`Login '${probe.sessionUser}' has unexpected direct write privileges.`);
  }
  if (access === "operator" && !probe.executeAllOperatorWorkflow) {
    throw new Error(`Login '${probe.sessionUser}' is missing the operator workflow API.`);
  }
  if (access !== "operator" && probe.executeAnyOperatorWorkflow) {
    throw new Error(`Login '${probe.sessionUser}' has an invalid workflow EXECUTE boundary.`);
  }
  if (access === "recovery" && !probe.executeRecovery) {
    throw new Error(`Login '${probe.sessionUser}' is missing the recovery workflow API.`);
  }
  if (access !== "recovery" && probe.executeRecovery) {
    throw new Error(`Login '${probe.sessionUser}' unexpectedly has recovery authority.`);
  }
  if (access === "read" && !probe.transactionReadOnly) {
    throw new Error(`Reader login '${probe.sessionUser}' is not read-only by default.`);
  }
}

async function run(): Promise<void> {
  const { access, principal } = parseProducerChangeAccessProvision(process.argv.slice(2));
  if (!process.env.DATABASE_MIGRATION_URL) {
    const migrationFile = ".env.migration.local";
    if (await assertPrivateCredentialFile(migrationFile)) {
      process.loadEnvFile(migrationFile);
    }
  }
  const rawMigrationUrl = process.env.DATABASE_MIGRATION_URL?.trim();
  if (!rawMigrationUrl) {
    throw new Error(
      "DATABASE_MIGRATION_URL is required in the process or .env.migration.local.",
    );
  }
  let migrationUrl: URL;
  try {
    migrationUrl = new URL(rawMigrationUrl);
  } catch {
    throw new Error("DATABASE_MIGRATION_URL is not a valid PostgreSQL connection URL.");
  }
  if (migrationUrl.protocol !== "postgres:" && migrationUrl.protocol !== "postgresql:") {
    throw new Error("DATABASE_MIGRATION_URL must use the PostgreSQL protocol.");
  }
  if (!migrationUrl.hostname.endsWith(".neon.tech")) {
    throw new Error("DATABASE_MIGRATION_URL must target the Chisan Neon project.");
  }

  const roles = producerChangeLoginRoleNames(principal);
  const selected =
    access === "read"
      ? {
          environmentFile: PRODUCER_CHANGE_READ_ENV_FILE,
          groupRole: READ_GROUP_ROLE,
          readOnly: true,
          role: roles.read,
          variable: PRODUCER_CHANGE_READ_DATABASE_VARIABLE,
        }
      : access === "operator"
        ? {
            environmentFile: PRODUCER_CHANGE_OPERATOR_ENV_FILE,
            groupRole: OPERATOR_GROUP_ROLE,
            readOnly: false,
            role: roles.operator,
            variable: PRODUCER_CHANGE_OPERATOR_DATABASE_VARIABLE,
          }
        : {
            environmentFile: PRODUCER_CHANGE_RECOVERY_ENV_FILE,
            groupRole: RECOVERY_GROUP_ROLE,
            readOnly: false,
            role: roles.recovery,
            variable: PRODUCER_CHANGE_RECOVERY_DATABASE_VARIABLE,
          };
  const password = secret();
  const roleUrl = producerChangeRoleConnectionString(
    migrationUrl,
    selected.role,
    password,
  );
  const admin = postgres(rawMigrationUrl, {
    prepare: false,
    max: 1,
    connect_timeout: 10,
    idle_timeout: 10,
  });

  try {
    await assertAccessSchema(admin);
    const [{ databaseName }] = await admin<{ databaseName: string }[]>`
      select current_database()::text as "databaseName"
    `;
    await admin.begin((transaction) =>
      provisionLogin(
        transaction,
        selected.role,
        selected.groupRole,
        password,
        databaseName,
        selected.readOnly,
      ),
    );
  } finally {
    await admin.end();
  }

  assertProbe(
    await inspectAccess(roleUrl, selected.groupRole),
    selected.groupRole,
    access,
  );
  await atomicWriteSecretFile(
    selected.environmentFile,
    selected.variable,
    roleUrl,
  );

  process.stdout.write(
    `Provisioned ${selected.role}.\n` +
      `Validated least privilege and wrote ${selected.environmentFile} with mode 0600.\n`,
  );
}

const entryPoint = process.argv[1];
if (
  entryPoint &&
  import.meta.url === pathToFileURL(path.resolve(entryPoint)).href
) {
  void run().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
