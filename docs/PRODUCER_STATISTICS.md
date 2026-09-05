# Internal producer statistics

The first metric is **public profile visits**. It answers how many times a
producer's full profile has been opened, including repeat openings by the same
person. It does not estimate unique people. Only the exact active owner of that
producer with an active `producer.profile.premium` entitlement may read totals.
The public profile, account editor and managed-producer list link to the private
statistics page. An owner without premium sees an explanation, never counts.

## Measurement

- The public profile mounts a small client collector. It sends a POST only when
  the page is visible, after hydration. Server rendering, link prefetch, map
  previews, API reads, category pages and private account pages do not count.
- Every new profile opening, reload or return navigation counts. React effect
  replay and re-rendering of the same mounted profile do not add visits.
- The collector sends the immutable country and producer ID plus a fresh random
  UUID for this one display. The server owns the timestamp, UTC day and increment.
  Locale, area, slug and query parameters never partition the figures.
- An atomic receipt insertion and daily increment prevent duplicate transport
  delivery and lost concurrent updates. The receipt is not a visitor ID and is
  not reused across openings. No cookie or persistent browser storage is added.
- Same-origin JSON POSTs have a strict payload allowlist and 192-byte body limit.
  Recognized bots, headless clients, background preloads, Do Not Track and Global
  Privacy Control are ignored. Active producer team members' visits are excluded
  when signed in; an anonymous owner cannot be recognized and may count.
- Browser blockers, disabled JavaScript, privacy choices and collection failures
  can undercount. Bot filtering is heuristic and cannot establish human identity;
  the public collector is not an abuse-proof billing or ranking counter.

The page displays all recorded visits, today, the last seven days and the last
30 days, plus a 30-day chart and an accessible daily table. Both rolling windows
include the current, incomplete UTC day. Missing daily rows contribute zero.
Totals begin at activation with no retroactive history. An unavailable database
or disabled feature is shown explicitly rather than presented as zero traffic.

## Authority and privacy

`producer_daily_stats` holds only `(country, producer_id, day, views)`.
`producer_stats_receipts` holds only `(event_id, day)`. Receipts older than
yesterday are pruned on collection and authorized reads; idle storage is pruned
on next use. Daily totals are retained for the producer's history. Neither table
stores visitors' account IDs, IPs, user agents, referrers, URLs or locations.
The current account is consulted only to exclude signed-in team visits.

Collection includes all published producers, independently of premium access;
upgrading unlocks the recorded history. Revoking premium or changing ownership
does not change the producer's identity or delete counts. The read query checks
active internal account, exact owner membership and exact active producer
entitlement together with the aggregate selection. There is no public read API,
export of visitor records, staff bypass or catalog overlay. A retired or standby
producer cannot record new visits or expose statistics. Any true producer merge
requires an explicit decision about its aggregates; never infer identity from a
new slug or owner.

The collector responds with an empty, uncached 204 regardless of inclusion. A
measurement or authentication outage does not break the public catalog. Existing
public Vercel Web Analytics remains independent and keeps excluding account and
administrative paths. [Privacy](../app/(application)/privacy/page.tsx) describes
both mechanisms.

## Boundaries for later metrics

`lib/producer-stats/` owns ingestion, aggregation and private reads. The page-view
endpoint accepts only profile openings; it is not a generic client-defined event
sink. Future section clicks should add an explicit event/section allowlist and a
separate documented counter definition within this boundary, reusing producer
identity, privacy limits and premium authorization. Do not interpret a click as
a visit or add speculative click fields to CSV or this first migration.

Activation and migration order are in
[Operations](OPERATIONS.md#producer-statistics-activation). The behavior tests
exercise real PostgreSQL-compatible migrations and queries with isolated PGlite.
