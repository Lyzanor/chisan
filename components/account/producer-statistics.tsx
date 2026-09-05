import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import type { Locale } from "@/lib/i18n/locales";
import type { ProducerStatsSummary } from "@/lib/producer-stats/policy";

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
  const formatDay = (day: string) => date.format(new Date(`${day}T00:00:00Z`));
  const max = Math.max(1, ...stats.days.map((day) => day.views));
  return (
    <section className="producer-stats" aria-label={labels.title}>
      <p className="catalog-kicker">{labels.premium}</p>
      <dl className="producer-stats__totals">
        {(
          [
            [labels.total, stats.total],
            [labels.today, stats.today],
            [labels.last7, stats.last7],
            [labels.last30, stats.last30],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{number.format(value)}</dd>
          </div>
        ))}
      </dl>
      {stats.total === 0 ? (
        <p className="account-empty">{labels.empty}</p>
      ) : null}
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
        <p>{labels.period}</p>
      </details>
      <p>{labels.private}</p>
    </section>
  );
}
