export const PRODUCER_STATS_WINDOW_DAYS = 30;
export const PRODUCER_STATS_ENDPOINT = "/api/producer-stats/view";

export function isProducerStatsFeatureEnabled(
  environment: Record<string, string | undefined> = process.env,
): boolean {
  return environment.CHISAN_PRODUCER_STATS_ENABLED === "true";
}

export function isProducerStatsEnabled(
  environment: Record<string, string | undefined> = process.env,
): boolean {
  return (
    isProducerStatsFeatureEnabled(environment) &&
    Boolean(environment.DATABASE_URL?.trim())
  );
}

export function statsDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export function shiftStatsDay(day: string, offset: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return statsDay(date);
}

export type ProducerStatsSummary = ReturnType<typeof summarizeProducerStats>;

export function summarizeProducerStats(
  rows: readonly { day: string; views: number }[],
  today: string,
  total = rows.reduce((sum, row) => sum + row.views, 0),
) {
  const counts = new Map(rows.map((row) => [row.day, row.views]));
  const days = Array.from(
    { length: PRODUCER_STATS_WINDOW_DAYS },
    (_, index) => {
      const day = shiftStatsDay(today, index - PRODUCER_STATS_WINDOW_DAYS + 1);
      return { day, views: counts.get(day) ?? 0 };
    },
  );
  return {
    days,
    today: counts.get(today) ?? 0,
    total,
    last7: days.slice(-7).reduce((sum, row) => sum + row.views, 0),
    last30: days.reduce((sum, row) => sum + row.views, 0),
  };
}
