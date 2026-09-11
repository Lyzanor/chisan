import "server-only";

import { and, eq, isNull, lt, lte, sql } from "drizzle-orm";
import { activeProducerPremiumEntitlementCondition } from "@/lib/accounts/producer-premium-entitlements";
import { findProducerById, findPublishedCountry } from "@/lib/csv-catalog";
import { getDatabase, type Database } from "@/lib/db";
import {
  entitlements,
  favorites,
  producerDailyActions,
  producerDailyStats,
  producerMemberships,
  producerStatsReceipts,
  users,
} from "@/lib/db/schema";
import {
  statsDay,
  statsWindowStart,
  shiftStatsDay,
  summarizeProducerStats,
  type ProducerIntentAction,
} from "./policy";

type ProducerKey = { country: string; producerId: number };
type ProducerEvent = ProducerKey & { eventId: string; viewerId: string | null };
/** The handle Drizzle hands to a transaction callback. */
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export function createProducerStatsService({
  database,
  producerExists,
}: {
  database: Database;
  producerExists: (country: string, producerId: number) => Promise<boolean>;
}) {
  async function cleanup(now = new Date()) {
    // Keep today's and yesterday's random event receipts for transport retries.
    // No visitor identity is collected. Idle receipts are pruned on the next use.
    await database
      .delete(producerStatsReceipts)
      .where(lt(producerStatsReceipts.day, shiftStatsDay(statsDay(now), -1)));
  }

  /** Shared admission for every counter: a published producer, never its own team. */
  async function countable(input: ProducerEvent, now: Date) {
    if (!(await producerExists(input.country, input.producerId))) return false;
    // A producer's signed-in team does not inflate its own measurement.
    if (input.viewerId) {
      const [member] = await database
        .select({ id: producerMemberships.id })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.userId, input.viewerId),
            eq(producerMemberships.country, input.country),
            eq(producerMemberships.producerId, input.producerId),
            eq(producerMemberships.status, "active"),
            isNull(producerMemberships.revokedAt),
            lte(producerMemberships.grantedAt, now),
          ),
        )
        .limit(1);
      if (member) return false;
    }
    await cleanup(now);
    return true;
  }

  /** One transport delivery counts once; the receipt is not a visitor identity. */
  async function claimEvent(
    transaction: Transaction,
    day: string,
    eventId: string,
  ) {
    const [inserted] = await transaction
      .insert(producerStatsReceipts)
      .values({ day, eventId })
      .onConflictDoNothing()
      .returning({ eventId: producerStatsReceipts.eventId });
    return Boolean(inserted);
  }

  return {
    cleanup,
    async record(input: ProducerEvent, now = new Date()) {
      if (!(await countable(input, now))) return false;
      const day = statsDay(now);
      return database.transaction(async (transaction) => {
        if (!(await claimEvent(transaction, day, input.eventId))) return false;
        await transaction
          .insert(producerDailyStats)
          .values({
            day,
            country: input.country,
            producerId: input.producerId,
            views: 1,
          })
          .onConflictDoUpdate({
            target: [
              producerDailyStats.country,
              producerDailyStats.producerId,
              producerDailyStats.day,
            ],
            set: { views: sql`${producerDailyStats.views} + 1` },
          });
        return true;
      });
    },
    async recordAction(
      input: ProducerEvent & { action: ProducerIntentAction },
      now = new Date(),
    ) {
      if (!(await countable(input, now))) return false;
      const day = statsDay(now);
      return database.transaction(async (transaction) => {
        if (!(await claimEvent(transaction, day, input.eventId))) return false;
        await transaction
          .insert(producerDailyActions)
          .values({
            day,
            country: input.country,
            producerId: input.producerId,
            action: input.action,
            clicks: 1,
          })
          .onConflictDoUpdate({
            target: [
              producerDailyActions.country,
              producerDailyActions.producerId,
              producerDailyActions.day,
              producerDailyActions.action,
            ],
            set: { clicks: sql`${producerDailyActions.clicks} + 1` },
          });
        return true;
      });
    },
    async read(input: ProducerKey & { userId: string }, now = new Date()) {
      if (!(await producerExists(input.country, input.producerId))) return null;
      const today = statsDay(now);
      const start = statsWindowStart(today);
      // Permission checks and aggregate selection share one SQL statement.
      // No public endpoint, staff override or account-scoped premium shortcut.
      // Clicks are a correlated aggregate: joining them would fan out the days.
      const [row] = await database
        .select({
          favorites: sql<number>`(select count(*) from ${favorites} inner join ${users} as favorite_user on favorite_user.id = ${favorites.userId} where ${favorites.country} = ${input.country} and ${favorites.producerId} = ${input.producerId} and favorite_user.status = 'active')`.mapWith(Number),
          total:
            sql<number>`coalesce(sum(${producerDailyStats.views}), 0)`.mapWith(
              Number,
            ),
          days: sql<
            { day: string; views: number }[]
          >`coalesce(jsonb_agg(jsonb_build_object('day', ${producerDailyStats.day}, 'views', ${producerDailyStats.views})) filter (where ${producerDailyStats.day} >= ${start}), '[]'::jsonb)`,
          actions: sql<
            { day: string; action: string; clicks: number }[]
          >`(select coalesce(jsonb_agg(jsonb_build_object('day', ${producerDailyActions.day}, 'action', ${producerDailyActions.action}, 'clicks', ${producerDailyActions.clicks})), '[]'::jsonb) from ${producerDailyActions} where ${producerDailyActions.country} = ${input.country} and ${producerDailyActions.producerId} = ${input.producerId} and ${producerDailyActions.day} >= ${start} and ${producerDailyActions.day} <= ${today})`,
        })
        .from(producerMemberships)
        .innerJoin(
          users,
          and(
            eq(users.id, producerMemberships.userId),
            eq(users.status, "active"),
          ),
        )
        .innerJoin(
          entitlements,
          activeProducerPremiumEntitlementCondition(
            input.country,
            input.producerId,
            now,
          ),
        )
        .leftJoin(
          producerDailyStats,
          and(
            eq(producerDailyStats.country, input.country),
            eq(producerDailyStats.producerId, input.producerId),
            lte(producerDailyStats.day, today),
          ),
        )
        .where(
          and(
            eq(producerMemberships.userId, input.userId),
            eq(producerMemberships.country, input.country),
            eq(producerMemberships.producerId, input.producerId),
            eq(producerMemberships.role, "owner"),
            eq(producerMemberships.status, "active"),
            isNull(producerMemberships.revokedAt),
            lte(producerMemberships.grantedAt, now),
          ),
        )
        .groupBy(producerMemberships.id);
      if (!row) return null;
      await cleanup(now);
      return summarizeProducerStats(row.days, today, {
        total: row.total,
        favorites: row.favorites,
        actions: row.actions,
      });
    },
  };
}

export function getProducerStatsService() {
  return createProducerStatsService({
    database: getDatabase(),
    producerExists: async (country, producerId) =>
      Boolean(
        findPublishedCountry(country) &&
        (await findProducerById(country, producerId)),
      ),
  });
}
