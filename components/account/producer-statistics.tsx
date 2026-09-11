import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import { formatMessage } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locales";
import {
  PRODUCER_INTENT_ACTIONS,
  type ProducerStatsSummary,
} from "@/lib/producer-stats/policy";

export function ProducerStatistics({
  stats,
  locale,
}: {
  stats: ProducerStatsSummary;
  locale: Locale;
}) {
  const labels = getProducerStatsLabels(locale);
  const number = new Intl.NumberFormat(locale);
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const month = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const formatDay = (day: string) => date.format(new Date(`${day}T00:00:00Z`));
  const max = Math.max(1, ...stats.days.map((day) => day.views));
  const previous = stats.previousMonth;
  return (
    <section className="producer-stats" aria-label={labels.title}>
      <p className="catalog-kicker">{labels.premium}</p>
      <p className="producer-stats__headline">
        {formatMessage(labels.monthSummary, {
          visits: number.format(stats.month.views),
          clicks: number.format(stats.month.clicks),
        })}
      </p>
      {previous ? (
        <p className="producer-stats__previous">
          {formatMessage(labels.previousMonthSummary, {
            month: month.format(new Date(`${previous.key}-01T00:00:00Z`)),
            visits: number.format(previous.views),
            clicks: number.format(previous.clicks),
          })}
        </p>
      ) : null}
      <dl className="producer-stats__totals">
        {(
          [
            [labels.favorites, stats.favorites],
            [labels.total, stats.total],
            [labels.today, stats.today],
            [labels.last7, stats.last7],
            [labels.last30, stats.last30],
            [labels.intentTotal, stats.clicks],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{number.format(value)}</dd>
          </div>
        ))}
      </dl>
      <p>{labels.interest}</p>
      {stats.total === 0 ? (
        <p className="account-empty">{labels.empty}</p>
      ) : null}
      <h3>{labels.intentTitle}</h3>
      {stats.clicks === 0 ? (
        <p className="account-empty">{labels.intentEmpty}</p>
      ) : (
        <dl className="producer-stats__intent">
          {PRODUCER_INTENT_ACTIONS.map((action) => (
            <div key={action}>
              <dt>{labels.intentLabels[action]}</dt>
              <dd>{number.format(stats.actions[action])}</dd>
            </div>
          ))}
        </dl>
      )}
      <h3>{labels.evolution}</h3>
      <div className="producer-stats__chart" aria-hidden="true">
        {stats.days.map((day) => (
          <div
            key={day.day}
            className="producer-stats__column"
            title={`${formatDay(day.day)}: ${number.format(day.views)}`}
          >
            <span style={{ height: `${(100 * day.views) / max}%` }} />
          </div>
        ))}
      </div>
      <div className="producer-stats__axis" aria-hidden="true">
        <span>{formatDay(stats.days[0].day)}</span>
        <span>{formatDay(stats.days.at(-1)!.day)}</span>
      </div>
      <details className="producer-stats__daily">
        <summary>{labels.daily}</summary>
        <table>
          <caption>{labels.evolution}</caption>
          <thead>
            <tr>
              <th scope="col">{labels.date}</th>
              <th scope="col">{labels.visits}</th>
            </tr>
          </thead>
          <tbody>
            {stats.days.toReversed().map((day) => (
              <tr key={day.day}>
                <th scope="row">
                  <time dateTime={day.day}>{formatDay(day.day)}</time>
                </th>
                <td>{number.format(day.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <details className="producer-stats__daily">
        <summary>{labels.about}</summary>
        <p>{labels.method}</p>
        <p>{labels.intentMethod}</p>
        <p>{labels.period}</p>
      </details>
      <p>{labels.private}</p>
    </section>
  );
}
