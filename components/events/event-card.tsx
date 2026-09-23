import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { eventPath } from "@/lib/events/routes";
import type { EditorialEvent } from "@/lib/events/schema";
import styles from "./events.module.css";

export function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function EventCard({ event }: { event: EditorialEvent }) {
  return <Link href={eventPath(event.slug)} className={`chisan-card ${styles.eventCard}`}>
    {event.image ? <Image className={styles.cardImage} src={event.image.src} alt={event.image.alt} width={event.image.width} height={event.image.height} sizes="160px" /> : null}
    <span className="chisan-eyebrow">{event.category} · {event.venue.municipality}</span>
    <strong className={styles.cardTitle}>{event.title}</strong>
    <span className={styles.cardDates}><time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time> — <time dateTime={event.endDate}>{formatEventDate(event.endDate)}</time></span>
    <span className={styles.cardDescription}>{event.description}</span>
    <span className={styles.cardAction}>Ver evento y expositores <ArrowUpRightIcon className="chisan-arrow" size={16} aria-hidden="true" /></span>
  </Link>;
}
