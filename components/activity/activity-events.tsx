import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { EVENTS_PATH } from "@/lib/events/routes";
import type { EditorialEvent } from "@/lib/events/schema";
import styles from "./activity.module.css";
import eventStyles from "@/components/events/events.module.css";

export function ActivityEvents({ events }: { events: EditorialEvent[] }) {
  if (!events.length) return null;
  return <section className={styles.section} aria-labelledby="activity-events-title">
    <div className={styles.sectionHeading}>
      <div><p className={styles.kicker}>Agenda seleccionada</p><h2 id="activity-events-title">Ferias y encuentros</h2></div>
      <Link href={EVENTS_PATH} className={styles.sectionLink}>Todos los eventos →</Link>
    </div>
    <div className={eventStyles.eventGrid}>{events.slice(0, 3).map((event) => <EventCard key={event.slug} event={event} />)}</div>
  </section>;
}
