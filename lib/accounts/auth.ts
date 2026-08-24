import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

import {
  ACCOUNT_ROUTES,
  getBootstrapAdminEmails,
  isAccountSystemConfigured,
} from "@/lib/accounts/config";
import { buildActiveProducerAccessLookup } from "@/lib/accounts/producer-access";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { getDatabase, type Database } from "@/lib/db";
import {
  auditEvents,
  authIdentities,
  authIdentityTombstones,
  producerMemberships,
  staffGrants,
  users,
  type User,
} from "@/lib/db/schema";

const CLERK_PROVIDER = "clerk";

export type AccountUser = User & {
  email: string | null;
  emailVerified: boolean;
};

export type ClerkIdentityInput = {
  subject: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  providerUpdatedAt?: Date | null;
  providerEventId?: string | null;
};

export class AccountAuthorizationError extends Error {
  constructor(message = "You are not allowed to perform this action.") {
    super(message);
    this.name = "AccountAuthorizationError";
  }
}

function normalizeEmail(value: string | null): string | null {
  const email = value?.trim().toLowerCase() ?? "";
  return email || null;
}

function normalizeDisplayName(value: string | null): string | null {
  const name = value?.replace(/\s+/g, " ").trim() ?? "";
  return name.slice(0, 160) || null;
}

function toAccountUser(
  user: User,
  identity: { email: string | null; emailVerifiedAt: Date | null },
): AccountUser {
  return {
    ...user,
    email: identity.email,
    emailVerified: identity.emailVerifiedAt !== null,
  };
}

async function findAccountBySubject(subject: string): Promise<AccountUser | null> {
  const database = getDatabase();
  const [result] = await database
    .select({ user: users, identity: authIdentities })
    .from(authIdentities)
    .innerJoin(users, eq(authIdentities.userId, users.id))
    .where(
      and(
        eq(authIdentities.provider, CLERK_PROVIDER),
        eq(authIdentities.subject, subject),
        isNull(authIdentities.disabledAt),
      ),
    )
    .limit(1);

  return result ? toAccountUser(result.user, result.identity) : null;
}

async function ensureBootstrapAdmin(
  transaction: Pick<Database, "insert" | "select">,
  account: AccountUser,
): Promise<void> {
  if (
    account.status !== "active" ||
    !account.email ||
    !account.emailVerified ||
    !getBootstrapAdminEmails().has(account.email)
  ) {
    return;
  }

  // Any historical admin grant is authoritative, including revoked or expired
  // grants. The environment allowlist may create the first grant, but it must
  // never undo a deliberate revocation.
  const [historicalGrant] = await transaction
    .select({ id: staffGrants.id })
    .from(staffGrants)
    .where(and(eq(staffGrants.userId, account.id), eq(staffGrants.role, "admin")))
    .limit(1);
  if (historicalGrant) return;

  const [createdGrant] = await transaction
    .insert(staffGrants)
    .values({
      userId: account.id,
      role: "admin",
      reason: "Bootstrapped from Chisan admin email configuration.",
    })
    .onConflictDoNothing()
    .returning({ id: staffGrants.id });

  if (createdGrant) {
    await transaction.insert(auditEvents).values({
      actorKind: "system",
      actorKey: "admin-email-bootstrap",
      action: "staff_grant.created",
      targetType: "staff_grant",
      targetId: createdGrant.id,
      metadata: { userId: account.id, role: "admin" },
    });
  }
}

async function ensureBootstrapAdminForAccount(account: AccountUser): Promise<void> {
  const database = getDatabase();
  await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`admin-bootstrap:${account.id}`}))`,
    );
    await ensureBootstrapAdmin(transaction, account);
  });
}

export async function syncClerkIdentity(
  input: ClerkIdentityInput,
): Promise<AccountUser | null> {
  const database = getDatabase();
  const email = normalizeEmail(input.email);
  const displayName = normalizeDisplayName(input.displayName);

  return database.transaction(async (transaction) => {
    // Serialize first-use races for one external identity without coupling the
    // schema to a provider-specific user ID.
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`${CLERK_PROVIDER}:${input.subject}`}))`,
    );

    const [tombstone] = await transaction
      .select({ id: authIdentityTombstones.id })
      .from(authIdentityTombstones)
      .where(
        and(
          eq(authIdentityTombstones.provider, CLERK_PROVIDER),
          eq(authIdentityTombstones.subject, input.subject),
        ),
      )
      .limit(1);
    if (tombstone) return null;

    const [existing] = await transaction
      .select({ user: users, identity: authIdentities })
      .from(authIdentities)
      .innerJoin(users, eq(authIdentities.userId, users.id))
      .where(
        and(
          eq(authIdentities.provider, CLERK_PROVIDER),
          eq(authIdentities.subject, input.subject),
        ),
      )
      .limit(1);

    let account: AccountUser;
    if (existing) {
      // A deleted local account is terminal even for installations upgraded
      // before tombstones existed. Never repopulate erased PII.
      if (existing.user.status === "deleted") {
        return toAccountUser(existing.user, existing.identity);
      }

      if (
        input.providerUpdatedAt &&
        existing.identity.providerUpdatedAt &&
        input.providerUpdatedAt.getTime() <=
          existing.identity.providerUpdatedAt.getTime()
      ) {
        account = toAccountUser(existing.user, existing.identity);
        await ensureBootstrapAdmin(transaction, account);
        return account;
      }

      const now = new Date();
      const [updatedIdentity] = await transaction
        .update(authIdentities)
        .set({
          email,
          emailVerifiedAt: input.emailVerified
            ? (input.providerUpdatedAt ?? now)
            : null,
          providerUpdatedAt:
            input.providerUpdatedAt ?? existing.identity.providerUpdatedAt,
          providerEventId: input.providerEventId ?? existing.identity.providerEventId,
          lastSeenAt: now,
          updatedAt: now,
        })
        .where(eq(authIdentities.id, existing.identity.id))
        .returning();

      // Provider profile data is only an initial seed. Once the Chisan account
      // exists, its profile is canonical here and must not be overwritten by
      // a later Clerk webhook or provider-side profile edit.
      account = toAccountUser(existing.user, updatedIdentity);
    } else {
      const [createdUser] = await transaction
        .insert(users)
        .values({ displayName })
        .returning();
      const [createdIdentity] = await transaction
        .insert(authIdentities)
        .values({
          userId: createdUser.id,
          provider: CLERK_PROVIDER,
          subject: input.subject,
          email,
          emailVerifiedAt: input.emailVerified
            ? (input.providerUpdatedAt ?? new Date())
            : null,
          providerUpdatedAt: input.providerUpdatedAt ?? null,
          providerEventId: input.providerEventId ?? null,
          lastSeenAt: new Date(),
        })
        .returning();

      account = toAccountUser(createdUser, createdIdentity);
      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: createdUser.id,
        action: "account.created",
        targetType: "user",
        targetId: createdUser.id,
        metadata: { provider: CLERK_PROVIDER },
      });
    }

    await ensureBootstrapAdmin(transaction, account);
    return account;
  });
}

function clerkDisplayName(user: Awaited<ReturnType<typeof currentUser>>): string | null {
  if (!user) return null;
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.primaryEmailAddress?.emailAddress.split("@")[0] ||
    null
  );
}

const getCurrentAccountForRequest = cache(async (): Promise<AccountUser | null> => {
  if (!isAccountSystemConfigured()) return null;

  const session = await auth();
  if (!session.isAuthenticated || !session.userId) return null;

  const existing = await findAccountBySubject(session.userId);
  if (existing) {
    if (existing.status !== "active") {
      throw new AccountAuthorizationError("This account is not active.");
    }
    await ensureBootstrapAdminForAccount(existing);
    return existing;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const primaryEmail = clerkUser.primaryEmailAddress;

  const account = await syncClerkIdentity({
    subject: clerkUser.id,
    email: primaryEmail?.emailAddress ?? null,
    emailVerified: primaryEmail?.verification?.status === "verified",
    displayName: clerkDisplayName(clerkUser),
    providerUpdatedAt: new Date(clerkUser.updatedAt),
  });
  if (account?.status !== "active") return null;
  return account;
});

export const getCurrentAccount = getCurrentAccountForRequest;

export async function requireCurrentAccount(
  returnBackUrl: string = ACCOUNT_ROUTES.dashboard,
): Promise<AccountUser> {
  if (!isAccountSystemConfigured()) {
    redirect(`${ACCOUNT_ROUTES.signUp}?account=unavailable`);
  }

  const account = await getCurrentAccount();
  if (!account) {
    const destination = safeReturnPath(returnBackUrl, ACCOUNT_ROUTES.dashboard);
    redirect(
      `${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(destination)}`,
    );
  }

  return account;
}

export async function hasStaffAccess(
  userId: string,
  roles: readonly ("reviewer" | "admin")[] = ["reviewer", "admin"],
): Promise<boolean> {
  const [grant] = await getDatabase()
    .select({ id: staffGrants.id })
    .from(staffGrants)
    .where(
      and(
        eq(staffGrants.userId, userId),
        inArray(staffGrants.role, [...roles]),
        isNull(staffGrants.revokedAt),
        or(isNull(staffGrants.expiresAt), gt(staffGrants.expiresAt, new Date())),
      ),
    )
    .limit(1);

  return Boolean(grant);
}

export async function requireStaffAccount(): Promise<AccountUser> {
  const account = await requireCurrentAccount("/admin");
  if (!(await hasStaffAccess(account.id))) {
    redirect("/cuenta?error=Staff%20access%20is%20required.");
  }
  return account;
}

export async function hasProducerAccess(
  userId: string,
  country: string,
  producerId: number,
): Promise<boolean> {
  const lookup = buildActiveProducerAccessLookup(userId, { country, producerId });
  const [membership] = await getDatabase()
    .select({ id: producerMemberships.id })
    .from(producerMemberships)
    .where(
      and(
        eq(producerMemberships.userId, lookup.userId),
        eq(producerMemberships.country, lookup.country),
        eq(producerMemberships.producerId, lookup.producerId),
        eq(producerMemberships.status, lookup.status),
      ),
    )
    .limit(1);

  return Boolean(membership);
}

export async function markClerkIdentityDeleted(
  subject: string,
  providerEvent: { eventId: string; occurredAt: Date },
): Promise<void> {
  const database = getDatabase();
  await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`${CLERK_PROVIDER}:${subject}`}))`,
    );

    const [createdTombstone] = await transaction
      .insert(authIdentityTombstones)
      .values({
        provider: CLERK_PROVIDER,
        subject,
        providerDeletedAt: providerEvent.occurredAt,
        providerEventId: providerEvent.eventId,
      })
      .onConflictDoNothing()
      .returning({ id: authIdentityTombstones.id });

    // The tombstone and identity disablement commit atomically. A repeated
    // deletion is therefore a true no-op, including its audit trail.
    if (!createdTombstone) return;

    const [identity] = await transaction
      .select()
      .from(authIdentities)
      .where(
        and(
          eq(authIdentities.provider, CLERK_PROVIDER),
          eq(authIdentities.subject, subject),
        ),
      )
      .limit(1);

    if (!identity) return;
    const now = new Date();
    await transaction
      .update(authIdentities)
      .set({
        email: null,
        emailVerifiedAt: null,
        providerUpdatedAt: providerEvent.occurredAt,
        providerEventId: providerEvent.eventId,
        disabledAt: now,
        lastSeenAt: null,
        updatedAt: now,
      })
      .where(eq(authIdentities.id, identity.id));
    await transaction.insert(auditEvents).values({
      actorKind: "system",
      actorKey: "clerk-webhook",
      action: "auth_identity.disabled",
      targetType: "auth_identity",
      targetId: identity.id,
      metadata: { provider: CLERK_PROVIDER, userId: identity.userId },
    });
  });
}
