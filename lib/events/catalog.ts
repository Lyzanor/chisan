import { findProducersByIds } from "../csv-catalog";
import { buildProducerSelectionItems } from "../producer-selections.server";
import { getProducerSelectionInitialFocusKeys } from "../producer-selections";
import { listPublishedEvents } from "./read-model";
import { eventPath } from "./routes";
import type { EditorialEvent } from "./schema";

export { EVENTS_PATH, EVENTS_SEGMENT, eventPath } from "./routes";
export { readEvents, resolveEventsScope, listPublishedEvents } from "./read-model";

export function eventLocalDate(now: Date, timeZone: EditorialEvent["timeZone"]): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function listDiscoverEvents(now = new Date()): EditorialEvent[] {
  return listPublishedEvents()
    .filter((event) => event.featuredInDiscover && event.endDate >= eventLocalDate(now, event.timeZone))
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.title.localeCompare(b.title, "es"));
}

export async function loadEvent(slug: string) {
  const event = listPublishedEvents().find((entry) => entry.slug === slug);
  if (!event) return null;
  const rows = await findProducersByIds(event.exhibitors, event.locale);
  rows.forEach((row, index) => {
    if (!row) throw new Error(`${event.slug}: unknown exhibitor ${event.exhibitors[index].country}:${event.exhibitors[index].producerId}`);
  });
  const catalogItems = buildProducerSelectionItems(rows, { explicitLocale: null, locale: event.locale });
  const notes = new Map(event.exhibitors.map((exhibitor) => [`${exhibitor.country}:${exhibitor.producerId}`, exhibitor.note]));
  // The event note says how the producer is present; the catalog description follows it.
  const items = catalogItems.map((item) => {
    const note = notes.get(item.key);
    return note ? { ...item, description: `${note}. ${item.description}` } : item;
  });
  const presence = (["stand", "dish", "activity"] as const).map((kind) => ({
    kind,
    entries: event.exhibitors.filter((exhibitor) => exhibitor.presence === kind).flatMap((exhibitor) => {
      const item = items.find(({ key }) => key === `${exhibitor.country}:${exhibitor.producerId}`);
      return item ? [{ item, note: exhibitor.note ?? null }] : [];
    }),
  })).filter((group) => group.entries.length);
  return {
    event,
    presence,
    selection: {
      canonicalPath: eventPath(event.slug),
      items,
      initialFocusKeys: getProducerSelectionInitialFocusKeys(items),
    },
  };
}
