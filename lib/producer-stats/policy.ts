export const PRODUCER_STATS_WINDOW_DAYS = 30;
export const PRODUCER_STATS_ENDPOINT = "/api/producer-stats/view";
export const PRODUCER_STATS_ACTION_ENDPOINT = "/api/producer-stats/action";

/**
 * Intent clicks the public profile may report. A click is never a visit: this
 * allowlist is a separate counter definition, enforced by the collector, the
 * ingestion endpoint, the database enum and the private report alike.
 */
export const PRODUCER_INTENT_ACTIONS = [
  "contact",
  "call",
  "directions",
  "shop",
  "website",
] as const;

export type ProducerIntentAction = (typeof PRODUCER_INTENT_ACTIONS)[number];

export function isProducerIntentAction(
  value: unknown,
): value is ProducerIntentAction {
  return (
    typeof value === "string" &&
    (PRODUCER_INTENT_ACTIONS as readonly string[]).includes(value)
  );
}

export const PRODUCER_INTENT_ATTRIBUTE = "data-producer-intent";

/** Marks a public link as an intent target for the delegated click collector. */
export function producerIntent(action: ProducerIntentAction) {
  return { [PRODUCER_INTENT_ATTRIBUTE]: action };
}

export type ProducerIntentTotals = Record<ProducerIntentAction, number>;

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

function statsMonth(day: string): string {
  return day.slice(0, 7);
}

function monthStart(day: string): string {
  return `${statsMonth(day)}-01`;
}

function previousMonthStart(day: string): string {
  const date = new Date(`${monthStart(day)}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() - 1);
  return statsDay(date);
}

/** Earliest day a report needs so both rolling windows and both months are whole. */
export function statsWindowStart(today: string): string {
  const rolling = shiftStatsDay(today, 1 - PRODUCER_STATS_WINDOW_DAYS);
  const month = previousMonthStart(today);
  return rolling < month ? rolling : month;
}

type DailyViews = { day: string; views: number };
type DailyAction = { day: string; action: string; clicks: number };

function emptyIntentTotals(): ProducerIntentTotals {
  return Object.fromEntries(
    PRODUCER_INTENT_ACTIONS.map((action) => [action, 0]),
  ) as ProducerIntentTotals;
}

function totalIntentClicks(totals: ProducerIntentTotals): number {
  return PRODUCER_INTENT_ACTIONS.reduce(
    (sum, action) => sum + totals[action],
    0,
  );
}

/** Clicks between two inclusive UTC days, ignoring any action outside the allowlist. */
function collectIntentTotals(
  rows: readonly DailyAction[],
  from: string,
  to: string,
): ProducerIntentTotals {
  const totals = emptyIntentTotals();
  for (const row of rows) {
    if (row.day < from || row.day > to) continue;
    if (!isProducerIntentAction(row.action)) continue;
    totals[row.action] += row.clicks;
  }
  return totals;
}

function sumViews(
  rows: readonly DailyViews[],
  from: string,
  to: string,
): number {
  return rows.reduce(
    (sum, row) => (row.day < from || row.day > to ? sum : sum + row.views),
    0,
  );
}

/** One calendar month: what the producer reads as "this month" or "last month". */
function summarizeMonth(
  views: readonly DailyViews[],
  actions: readonly DailyAction[],
  from: string,
  to: string,
) {
  return {
    key: statsMonth(from),
    views: sumViews(views, from, to),
    clicks: totalIntentClicks(collectIntentTotals(actions, from, to)),
  };
}

export type ProducerStatsSummary = ReturnType<typeof summarizeProducerStats>;

export function summarizeProducerStats(
  rows: readonly DailyViews[],
  today: string,
  {
    total = rows.reduce((sum, row) => sum + row.views, 0),
    favorites = 0,
    actions = [],
  }: {
    total?: number;
    favorites?: number;
    actions?: readonly DailyAction[];
  } = {},
) {
  const counts = new Map(rows.map((row) => [row.day, row.views]));
  const days = Array.from(
    { length: PRODUCER_STATS_WINDOW_DAYS },
    (_, index) => {
      const day = shiftStatsDay(today, index - PRODUCER_STATS_WINDOW_DAYS + 1);
      return { day, views: counts.get(day) ?? 0 };
    },
  );
  const windowActions = collectIntentTotals(actions, days[0].day, today);
  const previous = summarizeMonth(
    rows,
    actions,
    previousMonthStart(today),
    shiftStatsDay(monthStart(today), -1),
  );
  return {
    days,
    favorites,
    today: counts.get(today) ?? 0,
    total,
    last7: days.slice(-7).reduce((sum, row) => sum + row.views, 0),
    last30: days.reduce((sum, row) => sum + row.views, 0),
    actions: windowActions,
    clicks: totalIntentClicks(windowActions),
    month: summarizeMonth(rows, actions, monthStart(today), today),
    // A month with nothing recorded is absent, never presented as no interest.
    previousMonth: previous.views || previous.clicks ? previous : null,
  };
}
