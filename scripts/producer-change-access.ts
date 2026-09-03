import { existsSync } from "node:fs";

export const PRODUCER_CHANGE_READ_DATABASE_VARIABLE =
  "CHISAN_ADMIN_READ_DATABASE_URL";
export const PRODUCER_CHANGE_OPERATOR_DATABASE_VARIABLE =
  "CHISAN_PRODUCER_CHANGE_OPERATOR_DATABASE_URL";
export const PRODUCER_CHANGE_RECOVERY_DATABASE_VARIABLE =
  "CHISAN_PRODUCER_CHANGE_RECOVERY_DATABASE_URL";

export const PRODUCER_CHANGE_READ_ENV_FILE = ".env.admin-read.local";
export const PRODUCER_CHANGE_OPERATOR_ENV_FILE =
  ".env.producer-change-operator.local";
export const PRODUCER_CHANGE_RECOVERY_ENV_FILE =
  ".env.producer-change-recovery.local";

export type ProducerChangeDatabaseAccess = "read" | "operator" | "recovery";

export type ProducerChangeDatabaseCommand =
  | "list"
  | "show"
  | "materialize"
  | "finalize"
  | "recover";

export type ProducerChangeDatabaseSource = {
  access: ProducerChangeDatabaseAccess;
  environmentFile: string;
  variable: string;
};

const PRODUCER_CHANGE_DATABASE_SOURCES: readonly ProducerChangeDatabaseSource[] = [
  {
    access: "read",
    environmentFile: PRODUCER_CHANGE_READ_ENV_FILE,
    variable: PRODUCER_CHANGE_READ_DATABASE_VARIABLE,
  },
  {
    access: "operator",
    environmentFile: PRODUCER_CHANGE_OPERATOR_ENV_FILE,
    variable: PRODUCER_CHANGE_OPERATOR_DATABASE_VARIABLE,
  },
  {
    access: "recovery",
    environmentFile: PRODUCER_CHANGE_RECOVERY_ENV_FILE,
    variable: PRODUCER_CHANGE_RECOVERY_DATABASE_VARIABLE,
  },
];

export function producerChangeDatabaseSource(
  command: ProducerChangeDatabaseCommand,
): ProducerChangeDatabaseSource {
  if (command === "list" || command === "show") {
    return {
      access: "read",
      environmentFile: PRODUCER_CHANGE_READ_ENV_FILE,
      variable: PRODUCER_CHANGE_READ_DATABASE_VARIABLE,
    };
  }
  if (command === "recover") {
    return {
      access: "recovery",
      environmentFile: PRODUCER_CHANGE_RECOVERY_ENV_FILE,
      variable: PRODUCER_CHANGE_RECOVERY_DATABASE_VARIABLE,
    };
  }
  return {
    access: "operator",
    environmentFile: PRODUCER_CHANGE_OPERATOR_ENV_FILE,
    variable: PRODUCER_CHANGE_OPERATOR_DATABASE_VARIABLE,
  };
}

export function producerChangeDatabaseUrlFromEnvironment(
  command: ProducerChangeDatabaseCommand,
  environment: Readonly<Record<string, string | undefined>>,
): string {
  const source = producerChangeDatabaseSource(command);
  const connectionString = environment[source.variable]?.trim();
  if (!connectionString) {
    throw new Error(
      `${source.variable} is required for '${command}'. Set it in the process or ${source.environmentFile}; DATABASE_URL and DATABASE_MIGRATION_URL are intentionally ignored.`,
    );
  }
  try {
    const parsed = new URL(connectionString);
    if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
      throw new Error("unsupported protocol");
    }
  } catch {
    throw new Error(`${source.variable} is not a valid PostgreSQL connection URL.`);
  }
  return connectionString;
}

export function assertProducerChangeCredentialIsolation(
  command: ProducerChangeDatabaseCommand,
  {
    environment = process.env,
    fileExists = existsSync,
  }: {
    environment?: Readonly<Record<string, string | undefined>>;
    fileExists?: (filePath: string) => boolean;
  } = {},
): void {
  const selected = producerChangeDatabaseSource(command);
  const conflicts = PRODUCER_CHANGE_DATABASE_SOURCES.filter(
    (source) =>
      source.access !== selected.access &&
      (Boolean(environment[source.variable]?.trim()) || fileExists(source.environmentFile)),
  );

  if (conflicts.length === 0) return;

  const descriptions = conflicts.map(
    ({ access, environmentFile, variable }) =>
      `${access} (${environmentFile} or ${variable})`,
  );
  throw new Error(
    `The ${selected.access} producer-change command cannot run beside ${descriptions.join(
      ", ",
    )}. Use one isolated credential context per worktree or process.`,
  );
}

/** Loads only the command-specific local secret file; generic app URLs are never fallbacks. */
export function loadProducerChangeDatabaseUrl(
  command: ProducerChangeDatabaseCommand,
): string {
  assertProducerChangeCredentialIsolation(command);
  const source = producerChangeDatabaseSource(command);
  if (!process.env[source.variable] && existsSync(source.environmentFile)) {
    process.loadEnvFile(source.environmentFile);
  }
  return producerChangeDatabaseUrlFromEnvironment(command, process.env);
}
