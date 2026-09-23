import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { findPublishedCountry } from "../csv-catalog";
import { buildCatalogScope } from "../i18n/catalog-scope";
import { EVENTS_COUNTRY, EVENTS_LOCALE, EVENTS_PATH, EVENTS_SEGMENT } from "./routes";
import { eventSchema, type EditorialEvent } from "./schema";

let productionEvents: EditorialEvent[] | undefined;

export function readEvents(): EditorialEvent[] {
  if (process.env.NODE_ENV === "production" && productionEvents) return productionEvents;
  const directory = path.join(process.cwd(), "data/events/es");
  const events = existsSync(directory) ? readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const event = eventSchema.parse(JSON.parse(readFileSync(path.join(directory, file), "utf8")));
      if (file !== `${event.slug}.json`) throw new Error(`Event filename does not match slug: ${file}`);
      return event;
    }) : [];
  if (process.env.NODE_ENV === "production") productionEvents = events;
  return events;
}

export function resolveEventsScope() {
  const country = findPublishedCountry(EVENTS_COUNTRY);
  if (!country || !country.publishedLocales.includes(EVENTS_LOCALE)) return null;
  const scope = buildCatalogScope(country, EVENTS_LOCALE);
  if (`${scope.pathPrefix}/${EVENTS_SEGMENT}` !== EVENTS_PATH) throw new Error("Event route disagrees with its catalog scope");
  return scope;
}

export function listPublishedEvents(): EditorialEvent[] {
  if (!resolveEventsScope()) return [];
  return readEvents().filter((event) => event.status === "published");
}
