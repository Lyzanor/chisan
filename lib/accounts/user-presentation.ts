import { randomUUID } from "node:crypto";
import { and, count, eq, gte, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { auditEvents, userPresentation, users } from "@/lib/db/schema";
import {
  prepareAvatarImage,
  readAvatarBody,
  trustedProviderAvatarUrl,
} from "./avatar-image";

export class UserPresentationError extends Error {
  constructor(public code: "access" | "quota") {
    super(code);
  }
}
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
async function lockActiveAccount(tx: Transaction, userId: string) {
  await tx.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`account:${userId}`}))`,
  );
  const [user] = await tx
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.status, "active")))
    .for("update")
    .limit(1);
  if (!user) throw new UserPresentationError("access");
}

export async function getUserPresentation(db: Database, userId: string) {
  const [profile] = await db
    .select({
      avatarId: userPresentation.avatarId,
      hasAvatar: sql<boolean>`${userPresentation.avatarBytes} is not null`,
      favoritesAttributionEnabled: userPresentation.favoritesAttributionEnabled,
    })
    .from(userPresentation)
    .where(eq(userPresentation.userId, userId))
    .limit(1);
  return {
    avatarUrl: profile?.hasAvatar ? `/api/avatars/${profile.avatarId}` : null,
    favoritesAttributionEnabled: profile?.favoritesAttributionEnabled ?? false,
  };
}

export async function updateFavoritesAttribution(
  db: Database,
  userId: string,
  enabled: boolean,
) {
  await db.transaction(async (tx) => {
    await lockActiveAccount(tx, userId);
    await tx
      .insert(userPresentation)
      .values({ userId, favoritesAttributionEnabled: enabled })
      .onConflictDoUpdate({
        target: userPresentation.userId,
        set: { favoritesAttributionEnabled: enabled, updatedAt: new Date() },
      });
    await tx
      .insert(auditEvents)
      .values({
        actorKind: "user",
        actorUserId: userId,
        action: "account.favorites_attribution_updated",
        targetType: "user",
        targetId: userId,
        metadata: { enabled },
      });
  });
}

export async function replaceUserAvatar(
  db: Database,
  userId: string,
  input: Buffer | null,
) {
  // Count attempts before decoding; malformed files consume the same daily allowance.
  await db.transaction(async (tx) => {
    await lockActiveAccount(tx, userId);
    const [recent] = await tx
      .select({ total: count() })
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.actorUserId, userId),
          eq(auditEvents.action, "account.avatar_attempt"),
          gte(auditEvents.occurredAt, new Date(Date.now() - 86_400_000)),
        ),
      );
    if (input && recent.total >= 20) throw new UserPresentationError("quota");
    await tx
      .insert(auditEvents)
      .values({
        actorKind: "user",
        actorUserId: userId,
        action: "account.avatar_attempt",
        targetType: "user",
        targetId: userId,
      });
  });
  const avatarBytes = input ? await prepareAvatarImage(input) : null;
  await db.transaction(async (tx) => {
    await lockActiveAccount(tx, userId);
    const values = {
      avatarId: randomUUID(),
      avatarBytes,
      avatarInitialized: true,
      updatedAt: new Date(),
    };
    await tx
      .insert(userPresentation)
      .values({ userId, ...values })
      .onConflictDoUpdate({
        target: userPresentation.userId,
        set: values,
      });
    await tx
      .insert(auditEvents)
      .values({
        actorKind: "user",
        actorUserId: userId,
        action: avatarBytes
          ? "account.avatar_updated"
          : "account.avatar_removed",
        targetType: "user",
        targetId: userId,
      });
  });
  return getUserPresentation(db, userId);
}

/** Seed once, including existing accounts linking Google; explicit removal is terminal for seeding. */
export async function seedProviderAvatar(
  db: Database,
  userId: string,
  imageUrl: string,
) {
  const url = trustedProviderAvatarUrl(imageUrl);
  if (!url) return;
  const [existing] = await db
    .select({ initialized: userPresentation.avatarInitialized })
    .from(userPresentation)
    .where(eq(userPresentation.userId, userId))
    .limit(1);
  if (existing?.initialized) return;
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  if (!response.ok || !response.body) return;
  const avatarBytes = await prepareAvatarImage(
    await readAvatarBody(response.body),
  );
  await db.transaction(async (tx) => {
    await lockActiveAccount(tx, userId);
    const imported = await tx
      .insert(userPresentation)
      .values({ userId, avatarBytes, avatarInitialized: true })
      .onConflictDoUpdate({
        target: userPresentation.userId,
        set: {
          avatarId: randomUUID(),
          avatarBytes,
          avatarInitialized: true,
          updatedAt: new Date(),
        },
        setWhere: eq(userPresentation.avatarInitialized, false),
      })
      .returning({ userId: userPresentation.userId });
    if (imported.length)
      await tx
        .insert(auditEvents)
        .values({
          actorKind: "system",
          actorKey: "clerk-avatar-import",
          action: "account.avatar_imported",
          targetType: "user",
          targetId: userId,
        });
  });
}
