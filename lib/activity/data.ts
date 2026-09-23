import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { communityService } from "@/lib/community/runtime";
import type { TimelineItem } from "@/lib/community/service";
import {
  findArea,
  findProducersByIds,
  getLocalizedCatalogLabel,
  listPublishedCountries,
  loadCsvRows,
  type LocatedProducerCsvRow,
  type ProducerCsvRow,
} from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { favorites } from "@/lib/db/schema";
import { listFeaturedGuides } from "@/lib/guides/catalog";
import type { Locale } from "@/lib/i18n/locales";

export type ActivityAreaOption = {
  country: string;
  region: string;
  slug: string;
  label: string;
};

export type ActivityFeaturedProducer = {
  producerId: number;
  country: string;
  area: string;
  slug: string;
  name: string;
  city: string;
  category: string;
  imageSrc: string;
  description?: string;
  href: string;
};

export type ActivityFollowedProducer = {
  key: string;
  country: string;
  producerId: number;
  name: string;
  city: string;
  imageSrc: string;
  href: string;
};

function producerCompletenessScore(producer: ProducerCsvRow): number {
  let score = 0;
  if (producer.imageSrc && !producer.imageSrc.includes("generica")) {
    score += 10;
  }
  if (producer.latitude !== null && producer.longitude !== null) {
    score += 5;
  }
  if (producer.featuredProducts && producer.featuredProducts.trim().length > 0) {
    score += 5;
  }
  if (
    producer.fields.historia ||
    producer.fields.elaboracion ||
    producer.fields.descripcion
  ) {
    score += 3;
  }
  if (producer.fields.web || producer.fields.email || producer.fields.telefono) {
    score += 2;
  }
  return score;
}

export function getAvailableAreas(locale: Locale = "es"): ActivityAreaOption[] {
  const countries = listPublishedCountries();
  const options: ActivityAreaOption[] = [];

  for (const country of countries) {
    for (const region of country.regions) {
      for (const area of region.areas) {
        options.push({
          country: country.slug,
          region: getLocalizedCatalogLabel(region, locale),
          slug: area.slug,
          label: getLocalizedCatalogLabel(area, locale),
        });
      }
    }
  }

  return options.sort((a, b) => a.label.localeCompare(b.label, locale));
}

export async function getEditorialFeaturedProducers(
  country = "es",
  area?: string,
  limit = 4,
): Promise<ActivityFeaturedProducer[]> {
  try {
    if (area) {
      const areaEntry = findArea(country, area);
      if (!areaEntry) return [];
      const rows = await loadCsvRows(country, area);
      const sorted = [...rows].sort(
        (a, b) => producerCompletenessScore(b) - producerCompletenessScore(a),
      );

      return sorted.slice(0, limit).map((row) => {
        const located: LocatedProducerCsvRow = {
          ...row,
          country: areaEntry.countrySlug,
          region: areaEntry.regionSlug,
          area: areaEntry.slug,
        };
        return {
          producerId: row.producerId,
          country: areaEntry.countrySlug,
          area: areaEntry.slug,
          slug: row.slug,
          name: row.name,
          city: row.city,
          category: row.category,
          imageSrc: row.imageSrc,
          description: row.fields.descripcion || undefined,
          href: buildAccountProducerHref(located, null),
        };
      });
    }

    // Default highlights across available areas
    const areas = getAvailableAreas("es").slice(0, 8);
    const candidateProducers: ActivityFeaturedProducer[] = [];

    for (const option of areas) {
      if (candidateProducers.length >= limit) break;
      const areaProducers = await getEditorialFeaturedProducers(
        option.country,
        option.slug,
        1,
      );
      if (areaProducers.length > 0) {
        candidateProducers.push(areaProducers[0]);
      }
    }

    return candidateProducers.slice(0, limit);
  } catch (error) {
    console.error("Error loading featured producers for activity:", error);
    return [];
  }
}

export async function getFollowedProducers(
  userId: string,
): Promise<ActivityFollowedProducer[]> {
  try {
    const database = getDatabase();
    const rows = await database
      .select({
        country: favorites.country,
        producerId: favorites.producerId,
      })
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    if (!rows.length) return [];

    const rawProducers = await findProducersByIds(
      rows.map((r) => ({ country: r.country, producerId: r.producerId })),
    );
    const producers = rawProducers.filter(
      (p): p is LocatedProducerCsvRow => p !== null,
    );

    return producers.map((p) => ({
      key: `${p.country}:${p.producerId}`,
      country: p.country,
      producerId: p.producerId,
      name: p.name,
      city: p.city,
      imageSrc: p.imageSrc,
      href: buildAccountProducerHref(p, null),
    }));
  } catch (error) {
    console.error("Error loading followed producers for activity:", error);
    return [];
  }
}

export async function getPublicActivityTimeline(
  limit = 10,
): Promise<TimelineItem[]> {
  try {
    const database = getDatabase();

    // Query recent approved claims with active owners
    const claimRows = await database.execute(sql`
      select 'c:' || c.id::text as id,
             'claim' as kind,
             date_trunc('milliseconds', c.reviewed_at) as at,
             c.country,
             c.producer_id as "producerId"
      from producer_claims c
      join producer_memberships m on m.source_claim_id = c.id
        and m.country = c.country
        and m.producer_id = c.producer_id
        and m.user_id = c.claimant_user_id
        and m.role = 'owner'
        and m.status = 'active'
        and m.revoked_at is null
      join users owner_account on owner_account.id = m.user_id
        and owner_account.status = 'active'
      where c.status = 'approved'
        and c.revoked_at is null
        and c.reviewed_at <= now()
      order by c.reviewed_at desc
      limit ${limit}
    `);

    const rawRows = (
      Array.isArray(claimRows) ? claimRows : (claimRows as { rows: unknown[] }).rows
    ) as Array<{
      id: string;
      kind: "claim";
      at: Date | string;
      country: string;
      producerId: number;
    }>;

    if (!rawRows.length) return [];

    const rawProducers = await findProducersByIds(
      rawRows.map((r) => ({ country: r.country, producerId: Number(r.producerId) })),
    );
    const producers = rawProducers.filter(
      (p): p is LocatedProducerCsvRow => p !== null,
    );
    const producerMap = new Map(
      producers.map((p) => [`${p.country}:${p.producerId}`, p]),
    );

    const items: TimelineItem[] = [];
    for (const row of rawRows) {
      const p = producerMap.get(`${row.country}:${row.producerId}`);
      if (!p) continue;
      items.push({
        id: row.id,
        kind: "claim",
        at: new Date(row.at).toISOString(),
        title: "Titularidad verificada",
        body: "Chisan ha revisado y aprobado la titularidad oficial de este productor.",
        locale: "es",
        producer: {
          name: p.name,
          city: p.city,
          href: buildAccountProducerHref(p, null),
        },
      });
    }

    return items;
  } catch (error) {
    console.error("Error querying public timeline:", error);
    return [];
  }
}

export async function getActivityFeed(
  userId?: string,
  limit = 20,
): Promise<TimelineItem[]> {
  if (userId) {
    try {
      const personal = await communityService().timeline(userId, {
        filter: "all",
      });
      if (personal.items.length > 0) {
        return personal.items.slice(0, limit);
      }
    } catch {
      // Gracefully continue to public timeline if account service is unavailable
    }
  }

  return getPublicActivityTimeline(limit);
}

export { listFeaturedGuides };
