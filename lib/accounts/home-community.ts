import "server-only";

import { and, asc, eq, isNotNull, sql } from "drizzle-orm";
import { getAccountSystemConfiguration } from "./config";
import { getDatabase, type Database } from "@/lib/db";
import { producerMemberships, users, userPresentation } from "@/lib/db/schema";
import { findProducersByIds, findPublishedCountry } from "@/lib/csv-catalog";
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

export async function listHomeCommunity(): Promise<HomeCommunityMember[]> {
  const configuration = getAccountSystemConfiguration();
  if (!configuration.featureEnabled || !configuration.databaseConfigured)
    return [];
  return queryHomeCommunity(getDatabase());
}

export async function queryHomeCommunity(
  db: Database,
): Promise<HomeCommunityMember[]> {
  const [memberships, profiles] = await Promise.all([
    db
      .selectDistinct({
        country: producerMemberships.country,
        producerId: producerMemberships.producerId,
      })
      .from(producerMemberships)
      .innerJoin(users, eq(producerMemberships.userId, users.id))
      .where(
        and(
          eq(producerMemberships.role, "owner"),
          eq(producerMemberships.status, "active"),
          eq(users.status, "active"),
        ),
      ),
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
      .limit(4),
  ]);
  const producers = (await findProducersByIds(memberships, "es"))
    .flatMap((producer): HomeCommunityMember[] => {
      if (!producer) return [];
      const country = findPublishedCountry(producer.country);
      if (!country) return [];
      return [
        {
          key: `${producer.country}:${producer.producerId}`,
          kind: "producer",
          name: producer.name,
          href: buildProducerHref(producer, {
            scope: buildCatalogScope(country, country.defaultLocale),
            area: producer.area,
          }),
          image: producer.imageSrc,
          place: producer.city,
        },
      ];
    })
    .sort(
      (a, b) =>
        Number(b.place === "Santa Coloma de Gramenet") -
          Number(a.place === "Santa Coloma de Gramenet") ||
        a.name.localeCompare(b.name, "es"),
    )
    .slice(0, 4);
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
