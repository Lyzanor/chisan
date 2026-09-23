import assert from "node:assert/strict";
import test from "node:test";
import { catalogPathSegments, needsClerkRequestContext } from "../lib/proxy-scope";
import { isMapPathname } from "../components/navigation/map-destination";
import { eventLocalDate, eventPath, listDiscoverEvents, listPublishedEvents, loadEvent, readEvents } from "../lib/events/catalog";
import { buildEventMetadata, buildEventStructuredData, listEventSitemapEntries } from "../lib/events/metadata";
import { eventSchema } from "../lib/events/schema";
import { serializeStructuredData } from "../lib/site-structured-data";

test("event dates, venue and plan relationships are validated", () => {
  const event = readEvents().find((entry) => entry.slug === "escumostra-2026");
  assert.ok(event);
  assert.equal(eventSchema.safeParse({ ...event, image: undefined }).success, false);
  assert.equal(eventSchema.safeParse({ ...event, startDate: "2026-10-05" }).success, false);
  assert.equal(eventSchema.safeParse({ ...event, venue: { ...event.venue, latitude: 0, longitude: 0 } }).success, false);
  assert.equal(eventSchema.safeParse({ ...event, publishedAt: undefined }).success, false);
  assert.equal(eventSchema.safeParse({ ...event, plan: { ...event.plan!, points: [{ ...event.plan!.points[0], producerKey: "es:99999999" }] } }).success, false);
  assert.equal(eventSchema.safeParse({ ...event, exhibitors: [...event.exhibitors, event.exhibitors[0]] }).success, false);
});

test("only current editor-selected events appear in Descubrir; archived pages stay published", () => {
  assert.ok(listDiscoverEvents(new Date("2026-09-23T12:00:00Z")).some((event) => event.slug === "escumostra-2026"));
  assert.ok(listDiscoverEvents(new Date("2026-10-05T12:00:00Z")).every((event) => event.slug !== "escumostra-2026"));
  assert.ok(listPublishedEvents().some((event) => event.slug === "escumostra-2026"));
  assert.equal(eventLocalDate(new Date("2026-10-04T22:30:00Z"), "Europe/Madrid"), "2026-10-05");
  assert.equal(eventLocalDate(new Date("2026-10-04T22:30:00Z"), "Atlantic/Canary"), "2026-10-04");
});

test("Escumostra resolves every reviewed exhibitor to a current catalog profile", async () => {
  const page = await loadEvent("escumostra-2026");
  assert.ok(page);
  assert.equal(page.selection.items.length, page.event.exhibitors.length);
  assert.deepEqual(page.selection.items.map((item) => item.key), page.event.exhibitors.map((exhibitor) => `${exhibitor.country}:${exhibitor.producerId}`));
  assert.equal(new Set(page.selection.items.map((item) => item.key)).size, page.selection.items.length);
  assert.ok(page.selection.items.every((item) => item.href.startsWith("/es/")));
  assert.ok(page.event.plan?.points.every((point) => page.selection.items.some((item) => item.key === point.producerKey)));
  assert.notDeepEqual([page.event.venue.latitude, page.event.venue.longitude], [page.selection.items[0].latitude, page.selection.items[0].longitude]);
  assert.equal(await loadEvent("unknown-event"), null);
});

test("event route, metadata, sitemap and safe structured data agree", () => {
  const event = listPublishedEvents().find((entry) => entry.slug === "escumostra-2026");
  assert.ok(event);
  const url = `https://chisan.app${eventPath(event.slug)}`;
  assert.equal(catalogPathSegments(eventPath(event.slug)), null);
  assert.equal(needsClerkRequestContext(eventPath(event.slug)), false);
  assert.equal(isMapPathname("/es/eventos"), false);
  assert.equal(isMapPathname(eventPath(event.slug)), false);
  assert.equal(isMapPathname("/es/barcelona"), true);
  assert.equal(buildEventMetadata(event).alternates?.canonical, url);
  assert.ok(listEventSitemapEntries().some((entry) => entry.url === url));
  const data = buildEventStructuredData(event);
  assert.equal(data.startDate, event.startDate);
  assert.equal(data.endDate, event.endDate);
  assert.equal(data.location.geo.latitude, event.venue.latitude);
  const serialized = serializeStructuredData({ ...data, name: "</script><script>alert(1)</script>" });
  assert.ok(!serialized.includes("</script>"));
});
