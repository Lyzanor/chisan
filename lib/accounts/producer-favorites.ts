import { and, desc, eq, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { favorites, userPresentation, users } from "@/lib/db/schema";
import type { ProducerIdentity } from "@/lib/csv-catalog";

export type FavoriteSupporter = {
  name: string;
  avatarUrl: string | null;
  profileHref: string | null;
};
export type ProducerFavoritesPage = {
  items: FavoriteSupporter[];
  total: number;
  nextOffset: number | null;
};
export const FAVORITE_SUPPORTERS_PAGE_SIZE = 24;

export async function listProducerFavoriteSupporters(
  db: Database,
  identity: ProducerIdentity,
  offset = 0,
): Promise<ProducerFavoritesPage> {
  const safeOffset = Number.isSafeInteger(offset) && offset >= 0 ? offset : 0;
  const condition = and(
    eq(favorites.country, identity.country),
    eq(favorites.producerId, identity.producerId),
    eq(users.status, "active"),
    eq(userPresentation.favoritesAttributionEnabled, true),
  );
  // One statement keeps count and page on the same snapshot. Private accounts
  // explicitly opting in appear by name/photo, never by private/unlisted handle.
  const results = await db
    .select({
      name: users.displayName,
      avatarId: userPresentation.avatarId,
      hasAvatar: sql<boolean>`${userPresentation.avatarBytes} is not null`,
      publicHandle: sql<
        string | null
      >`case when ${users.publicProfileVisibility} = 'public' then ${users.publicHandle} else null end`,
      total: sql<number>`count(*) over()::integer`,
    })
    .from(favorites)
    .innerJoin(users, eq(users.id, favorites.userId))
    .innerJoin(userPresentation, eq(userPresentation.userId, users.id))
    .where(condition)
    .orderBy(desc(favorites.createdAt), users.id)
    .limit(FAVORITE_SUPPORTERS_PAGE_SIZE)
    .offset(safeOffset);
  const total = results[0]?.total ?? 0;
  return {
    items: results.map((row) => ({
      name: row.name || "Usuario de Chisan",
      avatarUrl: row.hasAvatar ? `/api/avatars/${row.avatarId}` : null,
      profileHref: row.publicHandle ? `/u/${row.publicHandle}` : null,
    })),
    total,
    nextOffset:
      safeOffset + results.length < total ? safeOffset + results.length : null,
  };
}
