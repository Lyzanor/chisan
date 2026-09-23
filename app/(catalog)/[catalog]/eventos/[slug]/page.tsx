import { notFound } from "next/navigation";
import { EventPage } from "@/components/events/event-page";
import { listPublishedEvents, loadEvent, resolveEventsScope } from "@/lib/events/catalog";
import { buildEventMetadata } from "@/lib/events/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  const scope = resolveEventsScope();
  if (!scope) return [];
  const catalog = scope.pathPrefix.slice(1);
  return listPublishedEvents().map(({ slug }) => ({ catalog, slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = listPublishedEvents().find((entry) => entry.slug === slug);
  if (!event) notFound();
  return buildEventMetadata(event);
}

export default async function EventRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await loadEvent(slug);
  if (!page) notFound();
  return <EventPage {...page} />;
}
