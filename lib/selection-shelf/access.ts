import { and, eq, gt, inArray, isNull, lte, or } from "drizzle-orm";
import type { Database } from "../db";
import { entitlements, producerMemberships, staffGrants, users } from "../db/schema";
import { USER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "../accounts/profile-qr-entitlements";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "../accounts/producer-profile-upgrade-policy";

export type ShelfReader = Pick<Database, "select">;

// The base/pro account migration can replace this one policy without changing shelves.
export async function canManageSelectionShelf(db: ShelfReader, userId: string) {
  const [account] = await db.select({ id: users.id }).from(users)
    .where(and(eq(users.id, userId), eq(users.status, "active"))).limit(1);
  if (!account) return false;
  const now = new Date();
  const active = and(eq(entitlements.status, "active"), lte(entitlements.startsAt, now),
    isNull(entitlements.revokedAt), or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)));
  const [userPremium] = await db.select({ id: entitlements.id }).from(entitlements)
    .where(and(active, eq(entitlements.subjectKind, "user"), eq(entitlements.userId, userId),
      eq(entitlements.key, USER_PROFILE_PREMIUM_ENTITLEMENT_KEY))).limit(1);
  if (userPremium) return true;
  const [producerPremium] = await db.select({ id: entitlements.id }).from(entitlements)
    .innerJoin(producerMemberships, and(eq(producerMemberships.country, entitlements.producerCountry),
      eq(producerMemberships.producerId, entitlements.producerId)))
    .where(and(active, eq(entitlements.subjectKind, "producer"), eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
      eq(producerMemberships.userId, userId), eq(producerMemberships.status, "active"))).limit(1);
  return Boolean(producerPremium);
}

export async function canReviewSelectionShelf(db: ShelfReader, userId: string) {
  const [grant] = await db.select({ id: staffGrants.id }).from(staffGrants)
    .innerJoin(users, eq(users.id, staffGrants.userId))
    .where(and(eq(users.id, userId), eq(users.status, "active"), inArray(staffGrants.role, ["reviewer", "admin"]),
      isNull(staffGrants.revokedAt), or(isNull(staffGrants.expiresAt), gt(staffGrants.expiresAt, new Date())))).limit(1);
  return Boolean(grant);
}
