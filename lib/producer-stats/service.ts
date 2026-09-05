import "server-only";

import { and, eq, isNull, lt, lte, sql } from "drizzle-orm";
import { activeProducerPremiumEntitlementCondition } from "@/lib/accounts/producer-premium-entitlements";
import { findProducerById, findPublishedCountry } from "@/lib/csv-catalog";
import { getDatabase, type Database } from "@/lib/db";
import {
  entitlements,
  producerDailyStats,
  producerMemberships,
  producerStatsReceipts,
  users,
} from "@/lib/db/schema";
import {
  PRODUCER_STATS_WINDOW_DAYS,
  shiftStatsDay,
  statsDay,
  summarizeProducerStats,
} from "./policy";

type ProducerKey = { country: string; producerId: number };

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

  return {
    cleanup,
    async record(
      input: ProducerKey & { eventId: string; viewerId: string | null },
      now = new Date(),
    ) {
      if (!(await producerExists(input.country, input.producerId)))
        return false;
      // A producer's signed-in team views do not inflate its measurement.
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
      const day = statsDay(now);
      return database.transaction(async (transaction) => {
        const [inserted] = await transaction
          .insert(producerStatsReceipts)
          .values({ day, eventId: input.eventId })
          .onConflictDoNothing()
          .returning({ eventId: producerStatsReceipts.eventId });
        if (!inserted) return false;
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
    async read(input: ProducerKey & { userId: string }, now = new Date()) {
      if (!(await producerExists(input.country, input.producerId))) return null;
      const today = statsDay(now);
      const start = shiftStatsDay(today, 1 - PRODUCER_STATS_WINDOW_DAYS);
      // Permission checks and aggregate selection share one SQL statement.
      // No public endpoint, staff override or account-scoped premium shortcut.
      const [row] = await database
        .select({
          total:
            sql<number>`coalesce(sum(${producerDailyStats.views}), 0)`.mapWith(
              Number,
            ),
          days: sql<
            { day: string; views: number }[]
          >`coalesce(jsonb_agg(jsonb_build_object('day', ${producerDailyStats.day}, 'views', ${producerDailyStats.views})) filter (where ${producerDailyStats.day} >= ${start}), '[]'::jsonb)`,
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
      return summarizeProducerStats(row.days, today, row.total);
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
