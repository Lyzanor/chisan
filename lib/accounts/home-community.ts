import "server-only";

import { and, asc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { getAccountSystemConfiguration } from "./config";
import { getDatabase, type Database } from "@/lib/db";
import { producerMemberships, users, userPresentation } from "@/lib/db/schema";
import { findProducersByIds, findPublishedCountry, listPublishedCountries, loadCsvRows } from "@/lib/csv-catalog";
import { buildProducerHref } from "@/lib/catalog-navigation";
import { buildCatalogScope } from "@/lib/i18n/catalog-scope";

export type HomeCommunityMember = {
  key: string;
  kind: "producer" | "user";
  name: string;
  href: string;
  image: string | null;
  place: string;
};

const HOME_COMMUNITY_LIMIT = 4;

async function queryHomeProducers(db: Database): Promise<HomeCommunityMember[]> {
  const countries = listPublishedCountries().map((country) => country.slug);
  if (!countries.length) return [];
  const preferred = findPublishedCountry("es")
    ? (await loadCsvRows("es", "barcelona"))
      .filter((producer) => producer.city === "Santa Coloma de Gramenet")
      .map((producer) => producer.producerId)
    : [];
  const priority = sql<number>`case when ${producerMemberships.country} = 'es'
    and ${inArray(producerMemberships.producerId, preferred)} then 0 else 1 end`;
  type Membership = { country: string; producerId: number; priority: number };
  let cursor: Membership | undefined;
  const producers: HomeCommunityMember[] = [];
  // Keyset pages bound transferred rows and catalog lookups. Stale memberships
  // must not crowd out live producers; repeated owners count as one identity.
  while (producers.length < HOME_COMMUNITY_LIMIT) {
    const memberships: Membership[] = await db.selectDistinct({
      country: producerMemberships.country,
      producerId: producerMemberships.producerId,
      priority: priority.as("local_priority"),
    }).from(producerMemberships)
      .innerJoin(users, eq(producerMemberships.userId, users.id))
      .where(and(
        eq(producerMemberships.role, "owner"),
        eq(producerMemberships.status, "active"),
        eq(users.status, "active"),
        inArray(producerMemberships.country, countries),
        cursor ? sql`(${priority}, ${producerMemberships.country}, ${producerMemberships.producerId})
          > (${cursor.priority}, ${cursor.country}, ${cursor.producerId})` : undefined,
      ))
      .orderBy(sql`local_priority`, asc(producerMemberships.country), asc(producerMemberships.producerId))
      .limit(HOME_COMMUNITY_LIMIT);
    if (!memberships.length) break;
    for (const producer of await findProducersByIds(memberships, "es")) {
      if (!producer) continue;
      const country = findPublishedCountry(producer.country);
      if (!country) continue;
      producers.push({
        key: `${producer.country}:${producer.producerId}`, kind: "producer",
        name: producer.name,
        href: buildProducerHref(producer, { scope: buildCatalogScope(country, country.defaultLocale), area: producer.area }),
        image: producer.imageSrc, place: producer.city,
      });
      if (producers.length === HOME_COMMUNITY_LIMIT) break;
    }
    if (memberships.length < HOME_COMMUNITY_LIMIT) break;
    cursor = memberships.at(-1);
  }
  return producers;
}

export async function listHomeCommunity(): Promise<HomeCommunityMember[]> {
  const configuration = getAccountSystemConfiguration();
  if (!configuration.featureEnabled || !configuration.databaseConfigured)
    return [];
  return queryHomeCommunity(getDatabase());
}

export async function queryHomeCommunity(
  db: Database,
): Promise<HomeCommunityMember[]> {
  const [producers, profiles] = await Promise.all([
    queryHomeProducers(db),
    db
      .select({
        name: users.displayName,
        handle: users.publicHandle,
        municipality: users.publicProfileBaseMunicipality,
        avatarId: userPresentation.avatarId,
        hasAvatar: sql<boolean>`${userPresentation.avatarBytes} is not null`,
      })
      .from(users)
      .leftJoin(userPresentation, eq(userPresentation.userId, users.id))
      .where(
        and(
          eq(users.status, "active"),
          eq(users.publicProfileVisibility, "public"),
          isNotNull(users.publicHandle),
          isNotNull(users.displayName),
          isNotNull(users.publicProfileBaseCountry),
          isNotNull(users.publicProfileBaseArea),
          isNotNull(users.publicProfileBaseMunicipality),
        ),
      )
      .orderBy(
        sql`case when ${users.publicProfileBaseMunicipality} in ('santa-coloma-de-gramenet', 'Santa Coloma de Gramenet') then 0 else 1 end`,
        asc(users.createdAt),
        asc(users.id),
      )
      .limit(HOME_COMMUNITY_LIMIT),
  ]);
  return [
    ...producers,
    ...profiles.flatMap((profile): HomeCommunityMember[] =>
      profile.handle && profile.name
        ? [
            {
              key: profile.handle,
              kind: "user",
              name: profile.name,
              href: `/u/${profile.handle}`,
              image:
                profile.hasAvatar && profile.avatarId
                  ? `/api/avatars/${profile.avatarId}`
                  : null,
              place: "Comunidad Chisan",
            },
          ]
        : [],
    ),
  ];
}
