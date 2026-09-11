# Internal producer statistics

Two counters are recorded: **public profile visits** and **intent clicks**. The
first answers how many times a producer's full profile has been opened, including
repeat openings by the same person; the second answers how many of those openings
led someone to act on a contact, route or shop link. Neither estimates unique
people. Only the exact active owner of that producer with an active
`producer.profile.premium` entitlement may read either. The public profile,
account editor and managed-producer list link to the private statistics page. An
owner without premium sees an explanation, never counts.

## Visit measurement

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

## Intent clicks

An intent click is a reader acting on a public link, never a page opening. The
allowlist is `contact`, `call`, `directions`, `shop` and `website`, defined once
as `PRODUCER_INTENT_ACTIONS` and enforced by the collector, the ingestion
endpoint, the `producer_intent_action` database enum and the private report
alike. An action outside it is discarded, not stored as an unknown value.

- The profile mounts one delegated click collector. The links themselves stay
  server-rendered and keep working without JavaScript; a marked element carries
  only `data-producer-intent` with its action name.
- **An action counts at most once per profile display.** The hero shortcut and
  the link it leads to are one intention, not two, so the figure is comparable to
  visits: how many openings led to that action. A restored back/forward
  navigation is a new display and may count again.
- The collector sends the immutable country and producer ID, the action name and
  a fresh random UUID. The server owns the timestamp, UTC day and increment. It
  never learns the target address, the number dialled, the destination requested,
  the page reached or who clicked.
- `/api/producer-stats/action` is a sibling of the page-view endpoint, not a
  generic event sink: same same-origin JSON allowlist, 224-byte body limit, bot
  and preload filtering, Do Not Track, Global Privacy Control and signed-in team
  exclusion, and the same receipt table for transport de-duplication.
- A click expresses interest. It is not an order, a sale, a delivered message or
  a reachable phone number, and blockers can undercount it exactly as they can
  undercount visits.

The page reports the current calendar month and, once one exists with recorded
activity, the last complete month: openings and intent clicks in one honest
sentence. The breakdown covers the same rolling 30 days as the visits chart.
Months use UTC, and the current one is still in progress.

## Authority and privacy

`producer_daily_stats` holds only `(country, producer_id, day, views)`.
`producer_daily_actions` holds only `(country, producer_id, day, action, clicks)`.
`producer_stats_receipts` holds only `(event_id, day)`. Receipts older than
yesterday are pruned on collection and authorized reads; idle storage is pruned
on next use. Daily totals are retained for the producer's history. No table
stores visitors' account IDs, IPs, user agents, referrers, URLs or locations.
The current account is consulted only to exclude signed-in team activity.

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

`lib/producer-stats/` owns ingestion, aggregation and private reads. Each endpoint
accepts one counter's own bounded payload; neither is a generic client-defined
event sink. A new metric adds its own allowlist entry or counter definition within
this boundary, reusing producer identity, privacy limits and premium
authorization. Never interpret a click as a visit, never merge the counters, and
never add speculative measurement fields to CSV.

Adding an action means one value in `PRODUCER_INTENT_ACTIONS`, the matching enum
value in the database, its labels and one `data-producer-intent` attribute on the
link. `whatsapp` is deliberately absent: the public profile has no WhatsApp link,
and deriving one from the phone number would publish what the evidence does not
support. Add the action when the link exists, not before.

Activation and migration order are in
[Operations](OPERATIONS.md#producer-statistics-activation). The behavior tests
exercise real PostgreSQL-compatible migrations and queries with isolated PGlite,
including that no producer-change SQL role can read either counter.
