import { notFound } from "next/navigation";
import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { listPublishedEvents, resolveEventsScope } from "@/lib/events/catalog";
import { buildEventMetadata } from "@/lib/events/metadata";
import styles from "@/components/events/events.module.css";

export const metadata = buildEventMetadata();
export const dynamicParams = false;

export function generateStaticParams() {
  const scope = resolveEventsScope();
  return scope ? [{ catalog: scope.pathPrefix.slice(1) }] : [];
}

export default function EventsPage() {
  const events = listPublishedEvents().sort((a, b) => b.startDate.localeCompare(a.startDate));
  if (!events.length) notFound();
  return <main className={styles.page}>
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación"><Link href="/actividad">Descubrir</Link><span aria-hidden="true">/</span><span aria-current="page">Eventos</span></nav>
    <header className={styles.header}>
      <p className={styles.eyebrow}>Agenda editorial · España</p>
      <h1>Ferias para conocer a quienes producen.</h1>
      <p>Encuentros de alimentos y bebidas con fecha, lugar y productores contrastados en el catálogo de Chisan.</p>
    </header>
    <section className={styles.eventGrid} aria-label="Eventos publicados">
      {events.map((event) => <EventCard key={event.slug} event={event} />)}
    </section>
    <p className={styles.sourceNote}>La presencia de un productor en Chisan no implica que participe en todos los eventos. Consulta cada página y la web de la organización antes de tu visita.</p>
  </main>;
}
