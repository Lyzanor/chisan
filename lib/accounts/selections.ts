import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
import { cache } from "react";

import { isPublicProfileVisible, normalizePublicHandle, publicHandleProblem, type PublicProfileVisibility } from "@/lib/accounts/public-profile-policy";
import type { PublicProfileBaseLocation } from "@/lib/accounts/public-profile-location";
import { isPublicUserProfileQrEnabled } from "@/lib/accounts/profile-qr-entitlements";
import { getUserPresentation } from "@/lib/accounts/user-presentation";
import { getDatabase } from "@/lib/db";
import { accountSelections, users } from "@/lib/db/schema";

export type PublicAccountSelection = {
  id: string;
  userId: string;
  publicHandle: string;
  title: string;
  description: string | null;
  visibility: PublicProfileVisibility;
  baseLocation: PublicProfileBaseLocation | null;
  profileQrEnabled: boolean;
  owner: {
    displayName: string | null;
    publicHandle: string | null;
    avatarUrl: string | null;
  };
};

/** Publishing a curated selection does not consent to personal attribution. */
export function publicSelectionOwner(input: { visibility: PublicProfileVisibility; displayName: string | null; publicHandle: string | null; avatarUrl: string | null }) {
  return input.visibility === "private"
    ? { displayName: null, publicHandle: null, avatarUrl: null }
    : { displayName: input.displayName, publicHandle: input.publicHandle, avatarUrl: input.avatarUrl };
}

export const findPublicAccountSelection = cache(
  async (rawHandle: string): Promise<PublicAccountSelection | null> => {
    const handle = normalizePublicHandle(rawHandle);
    if (publicHandleProblem(handle)) return null;

    const db = getDatabase();
    const [row] = await db
      .select({
        id: accountSelections.id,
        userId: accountSelections.userId,
        publicHandle: accountSelections.publicHandle,
        title: accountSelections.title,
        description: accountSelections.description,
        visibility: accountSelections.visibility,
        baseCountry: accountSelections.baseCountry,
        baseArea: accountSelections.baseArea,
        baseMunicipality: accountSelections.baseMunicipality,
        ownerDisplayName: users.displayName,
        ownerVisibility: users.publicProfileVisibility,
        ownerHandle: users.publicHandle,
        ownerStatus: users.status,
      })
      .from(accountSelections)
      .innerJoin(users, eq(users.id, accountSelections.userId))
      .where(
        and(
          eq(users.status, "active"),
          eq(accountSelections.publicHandle, handle),
          inArray(accountSelections.visibility, ["unlisted", "public"]),
        ),
      )
      .limit(1);

    if (!row || !isPublicProfileVisible(row.visibility)) return null;

    const [qrEnabled, presentation] = await Promise.all([
      isPublicUserProfileQrEnabled(row.userId),
      getUserPresentation(db, row.userId),
    ]);

    const baseLocation: PublicProfileBaseLocation | null =
      row.baseCountry && row.baseArea && row.baseMunicipality
        ? {
            country: row.baseCountry,
            area: row.baseArea,
            municipality: row.baseMunicipality,
          }
        : null;

    return {
      id: row.id,
      userId: row.userId,
      publicHandle: row.publicHandle,
      title: row.title,
      description: row.description,
      visibility: row.visibility,
      baseLocation,
      profileQrEnabled: qrEnabled,
      owner: publicSelectionOwner({ visibility: row.ownerVisibility, displayName: row.ownerDisplayName, publicHandle: row.ownerHandle, avatarUrl: presentation.avatarUrl }),
    };
  },
);

export async function listPublicSelectionsByUserId(
  userId: string,
): Promise<PublicAccountSelection[]> {
  const db = getDatabase();
  const rows = await db
    .select({
      id: accountSelections.id,
      userId: accountSelections.userId,
      publicHandle: accountSelections.publicHandle,
      title: accountSelections.title,
      description: accountSelections.description,
      visibility: accountSelections.visibility,
      baseCountry: accountSelections.baseCountry,
      baseArea: accountSelections.baseArea,
      baseMunicipality: accountSelections.baseMunicipality,
      ownerDisplayName: users.displayName,
        ownerVisibility: users.publicProfileVisibility,
      ownerHandle: users.publicHandle,
    })
    .from(accountSelections)
    .innerJoin(users, eq(users.id, accountSelections.userId))
    .where(
      and(
        eq(accountSelections.userId, userId),
        eq(accountSelections.visibility, "public"),
      ),
    )
    .orderBy(desc(accountSelections.createdAt));

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    publicHandle: row.publicHandle,
    title: row.title,
    description: row.description,
    visibility: row.visibility,
    baseLocation:
      row.baseCountry && row.baseArea && row.baseMunicipality
        ? {
            country: row.baseCountry,
            area: row.baseArea,
            municipality: row.baseMunicipality,
          }
        : null,
    profileQrEnabled: false,
    owner: publicSelectionOwner({ visibility: row.ownerVisibility, displayName: row.ownerDisplayName, publicHandle: row.ownerHandle, avatarUrl: null }),
  }));
}
