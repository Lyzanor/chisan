import Link from "next/link";
import { eventPath } from "@/lib/events/routes";
import type { EditorialEvent } from "@/lib/events/schema";
import styles from "./events.module.css";

export function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function EventCard({ event }: { event: EditorialEvent }) {
  return <Link href={eventPath(event.slug)} className={styles.eventCard}>
    <span className={styles.cardEyebrow}>{event.category} · {event.venue.municipality}</span>
    <strong className={styles.cardTitle}>{event.title}</strong>
    <span className={styles.cardDates}><time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time> — <time dateTime={event.endDate}>{formatEventDate(event.endDate)}</time></span>
    <span className={styles.cardDescription}>{event.description}</span>
    <span className={styles.cardAction}>Ver evento y expositores <span aria-hidden="true">↗</span></span>
  </Link>;
}
