import "server-only";
import { and, eq, count, sql } from "drizzle-orm";
import type { Database } from "../db";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "../accounts/producer-profile-upgrade-policy";
import { favorites, producerMemberships, users } from "../db/schema";
import {
  decodeTimelineCursor,
  encodeTimelineCursor,
  isPublishedChange,
  TIMELINE_PAGE_SIZE,
  type TimelineFilter,
} from "./policy";

type Identity = { country: string; producerId: number };
export type CommunityProducer = { name: string; href: string; city: string };
export type PublishedProducer = CommunityProducer & {
  fields: Record<string, string>;
  contentHash: string;
};
export type TimelineItem = {
  id: string;
  kind: "message" | "update" | "claim";
  at: string;
  title: string;
  body: string;
  locale: string;
  producer: CommunityProducer;
};
export type CurrentMessage = {
  key: string;
  body: string;
  locale: string;
  producer: CommunityProducer;
};
export type TimelinePage = {
  items: TimelineItem[];
  nextCursor: string | null;
  followingCount: number;
  messages: CurrentMessage[];
  nextMessagePage: number | null;
};
type FeedRow = {
  id: string;
  kind: "update" | "claim";
  at: Date | string;
  country: string;
  producerId: number;
  patch: Record<string, string> | null;
  contentHash: string | null;
};

// Premium gates producer communications, while ownership activity is available for every producer.
const premiumExists = sql`exists (select 1 from entitlements e where e.subject_kind = 'producer'
  and e.producer_country = f.country and e.producer_id = f.producer_id and e.key = ${PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY}
  and e.status = 'active' and e.revoked_at is null and e.starts_at <= now() and (e.expires_at is null or e.expires_at > now()))`;
const displayProducer = (p: CommunityProducer): CommunityProducer => ({
  name: p.name,
  href: p.href,
  city: p.city,
});
function rowsOf<T>(result: unknown): T[] {
  return (
    Array.isArray(result) ? result : (result as { rows: T[] }).rows
  ) as T[];
}

export function createCommunityService({
  database,
  catalog,
}: {
  database: Database;
  catalog: (identity: Identity) => Promise<PublishedProducer | null>;
}) {
  async function active(userId: string) {
    const [user] = await database
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, userId), eq(users.status, "active")));
    if (!user) throw new Error("An active account is required.");
  }
  // A service instance belongs to one request; never cache a personalized result globally.
  const resolved = new Map<string, Promise<PublishedProducer | null>>();
  function producerFor(row: Identity) {
    const key = `${row.country}:${row.producerId}`;
    if (!resolved.has(key))
      resolved.set(
        key,
        catalog({ country: row.country, producerId: Number(row.producerId) }),
      );
    return resolved.get(key)!;
  }
  return {
    async workspace(userId: string) {
      await active(userId);
      const memberships = await database
        .select({
          country: producerMemberships.country,
          producerId: producerMemberships.producerId,
        })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.userId, userId),
            eq(producerMemberships.status, "active"),
          ),
        );
      const resolved = await Promise.all(
        memberships.map(async (key) => {
          const producer = await producerFor(key);
          return producer ? { ...key, ...displayProducer(producer) } : null;
        }),
      );
      return resolved.filter((p) => p !== null);
    },
    async timeline(
      userId: string,
      options: {
        cursor?: string;
        filter?: TimelineFilter;
        messagePage?: number;
      } = {},
    ): Promise<TimelinePage> {
      await active(userId);
      const [following] = await database
        .select({ value: count() })
        .from(favorites)
        .where(eq(favorites.userId, userId));
      const filter = options.filter ?? "all";
      let cursor = decodeTimelineCursor(options.cursor);
      const items: TimelineItem[] = [];
      let hasMore = false;
      // Bound work per request; cursors advance over unpublished, retired and superseded changes too.
      for (
        let batch = 0;
        batch < 5 && items.length < TIMELINE_PAGE_SIZE;
        batch++
      ) {
        const result = await database.execute(sql`
          with feed as (
            select 'u:' || r.id::text as id, 'update' as kind, date_trunc('milliseconds', r.applied_at) as at,
              r.country, r.producer_id as "producerId", r.patch, r.content_change->>'requestedHash' as "contentHash"
            from producer_change_requests r
            join favorites f on f.country = r.country and f.producer_id = r.producer_id and f.user_id = ${userId}
            where r.status = 'applied' and r.applied_commit_sha is not null and r.applied_at <= now()
              and ${filter} <> 'activity' and ${premiumExists}
            union all
            select 'c:' || c.id::text as id, 'claim' as kind, date_trunc('milliseconds', c.reviewed_at) as at,
              c.country, c.producer_id as "producerId", null::jsonb as patch, null::text as "contentHash"
            from producer_claims c
            join producer_memberships m on m.source_claim_id = c.id and m.country = c.country and m.producer_id = c.producer_id
              and m.user_id = c.claimant_user_id and m.role = 'owner' and m.status = 'active' and m.revoked_at is null and m.granted_at <= now()
            join users owner_account on owner_account.id = m.user_id and owner_account.status = 'active'
            join favorites f on f.country = c.country and f.producer_id = c.producer_id and f.user_id = ${userId}
            where c.status = 'approved' and c.revoked_at is null and c.reviewed_at <= now() and ${filter} <> 'posts'
          ) select * from feed
          where ${cursor ? sql`(at, id) < (${cursor.at}::timestamptz, ${cursor.id})` : sql`true`}
          order by at desc, id desc limit ${TIMELINE_PAGE_SIZE + 1}
        `);
        const rows = rowsOf<FeedRow>(result);
        hasMore = rows.length > TIMELINE_PAGE_SIZE;
        for (const [index, row] of rows
          .slice(0, TIMELINE_PAGE_SIZE)
          .entries()) {
          cursor = { id: row.id, at: new Date(row.at).toISOString() };
          const producer = await producerFor(row);
          if (!producer) continue;
          if (
            row.kind === "update" &&
            !isPublishedChange(
              row.patch ?? {},
              producer.fields,
              row.contentHash,
              producer.contentHash,
            )
          )
            continue;
          const message =
            row.kind === "update" &&
            Object.hasOwn(row.patch ?? {}, "mensaje a la comunidad")
              ? producer.fields["mensaje a la comunidad"]
              : "";
          items.push({
            id: row.id,
            at: cursor.at,
            kind:
              row.kind === "claim" ? "claim" : message ? "message" : "update",
            title:
              row.kind === "claim"
                ? "Este productor ha reclamado su perfil"
                : message
                  ? "Un mensaje para su comunidad"
                  : row.contentHash
                    ? "Novedades en sus productos y su perfil"
                    : "Su perfil tiene novedades",
            body:
              row.kind === "claim"
                ? "Chisan ha aprobado su solicitud de titularidad. Su equipo ya puede gestionar el perfil."
                : message ||
                  "Ya puedes consultar los cambios revisados y publicados en el perfil del productor.",
            locale: message ? producer.fields.mensaje_comunidad_locale : "es",
            producer: displayProducer(producer),
          });
          if (items.length === TIMELINE_PAGE_SIZE) {
            hasMore = hasMore || index < rows.length - 1;
            break;
          }
        }
        if (!hasMore) break;
      }
      const messages: CurrentMessage[] = [];
      const messagePage = Math.max(
        0,
        Math.min(100000, Math.floor(options.messagePage || 0)),
      );
      // Existing CSV messages have no publication date; never invent their place in chronology.
      const messageRows =
        filter === "activity"
          ? []
          : rowsOf<Identity>(
              await database.execute(sql`
        select f.country, f.producer_id as "producerId" from favorites f
        where f.user_id = ${userId} and ${premiumExists}
        order by f.created_at desc, f.country, f.producer_id limit 21 offset ${messagePage * 20}
      `),
            );
      for (const row of messageRows.slice(0, 20)) {
        const producer = await producerFor(row);
        if (
          producer?.fields["mensaje a la comunidad"] &&
          producer.fields.mensaje_comunidad_locale
        )
          messages.push({
            key: `${row.country}:${row.producerId}`,
            body: producer.fields["mensaje a la comunidad"],
            locale: producer.fields.mensaje_comunidad_locale,
            producer: displayProducer(producer),
          });
      }
      return {
        items,
        followingCount: following.value,
        nextCursor: hasMore && cursor ? encodeTimelineCursor(cursor) : null,
        messages,
        nextMessagePage: messageRows.length > 20 ? messagePage + 1 : null,
      };
    },
  };
}
