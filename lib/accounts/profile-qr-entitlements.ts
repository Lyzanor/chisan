import "server-only";

import { and, eq, gt, isNull, lte, or, sql } from "drizzle-orm";

import { activeProducerPremiumEntitlementCondition } from "@/lib/accounts/producer-premium-entitlements";
import {
  findProducersByIds,
  findPublishedCountry,
  type ProducerIdentity,
} from "@/lib/csv-catalog";
import { selectionPreviewRevision } from "@/lib/accounts/selection-preview";
import { getDatabase, type Database } from "@/lib/db";
import {
  auditEvents,
  favorites,
  entitlements,
  producerMemberships,
  users,
} from "@/lib/db/schema";
import {
  isProfileQrEnabled,
  PROFILE_QR_ENABLED_METADATA_KEY,
} from "@/lib/profile-qr";

export const USER_PROFILE_PREMIUM_ENTITLEMENT_KEY = "user.profile.premium";

export type ProfileQrPreferenceUpdateResult =
  | "updated"
  | "not_entitled"
  | "not_authorized"
  | "profile_not_public"
  | "selection_empty"
  | "preview_changed";

export function activeUserProfilePremiumEntitlementCondition(
  userId: string,
  now = new Date(),
) {
  return and(
    eq(entitlements.subjectKind, "user"),
    eq(entitlements.userId, userId),
    eq(entitlements.key, USER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
    eq(entitlements.status, "active"),
    lte(entitlements.startsAt, now),
    or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
    isNull(entitlements.revokedAt),
  );
}

export async function getActiveUserProfilePremiumEntitlement(userId: string) {
  const [entitlement] = await getDatabase()
    .select()
    .from(entitlements)
    .where(activeUserProfilePremiumEntitlementCondition(userId))
    .limit(1);
  return entitlement ?? null;
}

export async function isPublicUserProfileQrEnabled(
  userId: string,
): Promise<boolean> {
  const entitlement = await getActiveUserProfilePremiumEntitlement(userId);
  return isProfileQrEnabled(entitlement?.metadata);
}

export async function isProducerProfileQrEnabled(
  country: string,
  producerId: number,
): Promise<boolean> {
  const [entitlement] = await getDatabase()
    .select({ metadata: entitlements.metadata })
    .from(entitlements)
    .where(activeProducerPremiumEntitlementCondition(country, producerId))
    .limit(1);
  return isProfileQrEnabled(entitlement?.metadata);
}

function enabledMetadata(enabled: boolean) {
  const metadataPath = `{${PROFILE_QR_ENABLED_METADATA_KEY}}`;
  return sql`jsonb_set(
    ${entitlements.metadata},
    ${metadataPath}::text[],
    to_jsonb(${enabled}::boolean),
    true
  )`;
}

type UserQrPreferenceInput = {
  enabled: boolean;
  userId: string;
  previewRevision?: string;
};

export function createUserProfileQrPreferenceService({
  database,
  resolvePublishedIdentities,
}: {
  database: Database;
  resolvePublishedIdentities: (
    identities: ProducerIdentity[],
  ) => Promise<ProducerIdentity[]>;
}) {
  return async (
    input: UserQrPreferenceInput,
  ): Promise<ProfileQrPreferenceUpdateResult> =>
    database.transaction(async (transaction) => {
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`profile-qr:user:${input.userId}`}))`,
      );

      const [profile] = await transaction
        .select({
          id: users.id,
          publicHandle: users.publicHandle,
          displayName: users.displayName,
          selectionTitle: users.selectionTitle,
          selectionDescription: users.selectionDescription,
          visibility: users.publicProfileVisibility,
        })
        .from(users)
        .where(
          and(
            eq(users.id, input.userId),
            eq(users.status, "active"),
            sql`${users.publicHandle} IS NOT NULL`,
          ),
        )
        .limit(1)
        .for("update");
      if (
        !profile ||
        (input.enabled &&
          profile.visibility !== "unlisted" &&
          profile.visibility !== "public")
      ) {
        return "profile_not_public";
      }

      if (input.enabled) {
        const shared = await transaction
          .select({
            country: favorites.country,
            producerId: favorites.producerId,
          })
          .from(favorites)
          .where(
            and(
              eq(favorites.userId, input.userId),
              eq(favorites.showOnPublicProfile, true),
            ),
          );
        const published = await resolvePublishedIdentities(shared);
        if (!published.length) return "selection_empty";
        if (
          !input.previewRevision ||
          input.previewRevision !== selectionPreviewRevision(profile, published)
        ) {
          return "preview_changed";
        }
      }

      const now = new Date();
      const [updated] = await transaction
        .update(entitlements)
        .set({
          metadata: enabledMetadata(input.enabled),
          updatedAt: now,
        })
        .where(activeUserProfilePremiumEntitlementCondition(input.userId, now))
        .returning({ id: entitlements.id });
      if (!updated) return "not_entitled";

      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: input.userId,
        action: "profile_qr.preference_updated",
        targetType: "entitlement",
        targetId: updated.id,
        metadata: {
          enabled: input.enabled,
          subjectKind: "user",
        },
      });
      return "updated";
    });
}

export async function updateUserProfileQrPreference(
  input: UserQrPreferenceInput,
) {
  return createUserProfileQrPreferenceService({
    database: getDatabase(),
    resolvePublishedIdentities: async (identities) =>
      (await findProducersByIds(identities)).flatMap((producer) =>
        producer && findPublishedCountry(producer.country)
          ? [{ country: producer.country, producerId: producer.producerId }]
          : [],
      ),
  })(input);
}

export async function updateProducerProfileQrPreference(input: {
  country: string;
  enabled: boolean;
  producerId: number;
  userId: string;
}): Promise<ProfileQrPreferenceUpdateResult> {
  return getDatabase().transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${input.country}:${input.producerId}`}))`,
    );

    const [membership] = await transaction
      .select({ id: producerMemberships.id })
      .from(producerMemberships)
      .where(
        and(
          eq(producerMemberships.userId, input.userId),
          eq(producerMemberships.country, input.country),
          eq(producerMemberships.producerId, input.producerId),
          eq(producerMemberships.role, "owner"),
          eq(producerMemberships.status, "active"),
        ),
      )
      .limit(1);
    if (!membership) return "not_authorized";

    const now = new Date();
    const [updated] = await transaction
      .update(entitlements)
      .set({
        metadata: enabledMetadata(input.enabled),
        updatedAt: now,
      })
      .where(
        activeProducerPremiumEntitlementCondition(
          input.country,
          input.producerId,
          now,
        ),
      )
      .returning({ id: entitlements.id });
    if (!updated) return "not_entitled";

    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: input.userId,
      action: "profile_qr.preference_updated",
      targetType: "entitlement",
      targetId: updated.id,
      metadata: {
        country: input.country,
        enabled: input.enabled,
        producerId: input.producerId,
        subjectKind: "producer",
      },
    });
    return "updated";
  });
}
