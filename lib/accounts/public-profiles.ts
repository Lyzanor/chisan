import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
import { cache } from "react";

import {
  isPublicProfileVisible,
  normalizePublicHandle,
  publicHandleProblem,
  type PublicProfileVisibility,
} from "@/lib/accounts/public-profile-policy";
import type { PublicProfileBaseLocation } from "@/lib/accounts/public-profile-location";
import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import type { ProducerIdentity } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { favorites, users } from "@/lib/db/schema";

export type PublicUserProfile = {
  id: string;
  displayName: string | null;
  publicHandle: string;
  visibility: PublicProfileVisibility;
  baseLocation: PublicProfileBaseLocation;
};

function canReadPublicProfiles(): boolean {
  const configuration = getAccountSystemConfiguration();
  return configuration.featureEnabled && configuration.databaseConfigured;
}

export const findPublicUserProfile = cache(
  async (rawHandle: string): Promise<PublicUserProfile | null> => {
    const publicHandle = normalizePublicHandle(rawHandle);
    if (!canReadPublicProfiles() || publicHandleProblem(publicHandle)) return null;

    const [profile] = await getDatabase()
      .select({
        id: users.id,
        displayName: users.displayName,
        publicHandle: users.publicHandle,
        visibility: users.publicProfileVisibility,
        baseCountry: users.publicProfileBaseCountry,
        baseArea: users.publicProfileBaseArea,
        baseMunicipality: users.publicProfileBaseMunicipality,
      })
      .from(users)
      .where(
        and(
          eq(users.status, "active"),
          eq(users.publicHandle, publicHandle),
          inArray(users.publicProfileVisibility, ["unlisted", "public"]),
        ),
      )
      .limit(1);

    if (
      !profile?.publicHandle ||
      !isPublicProfileVisible(profile.visibility) ||
      !profile.baseCountry ||
      !profile.baseArea ||
      !profile.baseMunicipality
    ) {
      return null;
    }

    return {
      id: profile.id,
      displayName: profile.displayName,
      publicHandle: profile.publicHandle,
      visibility: profile.visibility,
      baseLocation: {
        country: profile.baseCountry,
        area: profile.baseArea,
        municipality: profile.baseMunicipality,
      },
    };
  },
);

export async function listPublicProfileFavoriteIdentities(
  userId: string,
): Promise<ProducerIdentity[]> {
  if (!canReadPublicProfiles()) return [];

  return getDatabase()
    .select({ country: favorites.country, producerId: favorites.producerId })
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.showOnPublicProfile, true),
      ),
    )
    .orderBy(desc(favorites.createdAt));
}
