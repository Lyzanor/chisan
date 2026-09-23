import type { Metadata, MetadataRoute } from "next";

import { SITE_NAME, SITE_ORIGIN, isPublicDiscoveryEnabled } from "../site";
import { SITE_ORGANIZATION_ID } from "../site-structured-data";
import { listPublishedEvents } from "./read-model";
import { EVENTS_PATH, eventPath } from "./routes";
import type { EditorialEvent } from "./schema";

export function buildEventMetadata(event?: EditorialEvent): Metadata {
  const title = event?.title ?? "Ferias y eventos de productores";
  const description = event?.description ?? "Ferias de alimentos y bebidas seleccionadas por Chisan, con sus fechas, ubicación y productores participantes.";
  const url = new URL(event ? eventPath(event.slug) : EVENTS_PATH, SITE_ORIGIN).href;
  return {
    title,
    description,
    alternates: { canonical: url, languages: { es: url } },
    robots: { index: isPublicDiscoveryEnabled(), follow: true },
    openGraph: {
      type: "website", title, description, url, siteName: SITE_NAME, locale: "es_ES",
      ...(event?.image ? { images: [{ url: event.image.src, alt: event.image.alt, width: event.image.width, height: event.image.height }] } : {}),
    },
  };
}

export function listEventSitemapEntries(): MetadataRoute.Sitemap {
  const events = listPublishedEvents();
  if (!events.length) return [];
  return [
    { path: EVENTS_PATH, updatedAt: events.map((event) => event.updatedAt).sort().at(-1)! },
    ...events.map((event) => ({ path: eventPath(event.slug), updatedAt: event.updatedAt })),
  ].map(({ path, updatedAt }) => {
    const url = new URL(path, SITE_ORIGIN).href;
    return { url, lastModified: updatedAt, alternates: { languages: { es: url } } };
  });
}

export function buildEventStructuredData(event: EditorialEvent) {
  const url = new URL(eventPath(event.slug), SITE_ORIGIN).href;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    name: event.title,
    description: event.description,
    url,
    startDate: event.startDate,
    endDate: event.endDate,
    inLanguage: event.locale,
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: { "@type": "PostalAddress", addressLocality: event.venue.municipality, addressCountry: "ES" },
      geo: { "@type": "GeoCoordinates", latitude: event.venue.latitude, longitude: event.venue.longitude },
    },
    organizer: { "@type": "Organization", name: event.organizerName, url: event.organizerUrl },
    publisher: { "@type": "Organization", "@id": SITE_ORGANIZATION_ID, name: SITE_NAME, url: SITE_ORIGIN },
    image: event.image ? new URL(event.image.src, SITE_ORIGIN).href : undefined,
  };
}
