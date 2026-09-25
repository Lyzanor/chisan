import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ProducerSelectionExplorer } from "@/components/producer-selection-explorer";
import { selectionPageMessages } from "@/lib/accounts/selection-presentation";
import { EVENTS_PATH } from "@/lib/events/routes";
import { buildEventStructuredData } from "@/lib/events/metadata";
import type { EditorialEvent } from "@/lib/events/schema";
import type { ProducerSelectionExplorerModel, ProducerSelectionItem } from "@/lib/producer-selections";
import { serializeStructuredData } from "@/lib/site-structured-data";
import { formatEventDate } from "./event-card";
import styles from "./events.module.css";

type EventPresence = { kind: EditorialEvent["exhibitors"][number]["presence"]; entries: { item: ProducerSelectionItem; note: string | null }[] };

const presenceTitles: Record<EventPresence["kind"], string> = {
  stand: "En los puestos",
  dish: "En los platos",
  activity: "En las actividades",
};

export function EventPage({ event, selection, presence }: { event: EditorialEvent; selection: ProducerSelectionExplorerModel; presence: EventPresence[] }) {
  const dates = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .formatRange(new Date(`${event.startDate}T00:00:00Z`), new Date(`${event.endDate}T00:00:00Z`));
  const locationUrl = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination: `${event.venue.latitude},${event.venue.longitude}` })}`;
  const plan = event.plan ? { imageSrc: event.plan.src, width: event.plan.width, height: event.plan.height, alt: event.plan.alt, points: event.plan.points } : null;

  return <main className={`${styles.page} ${styles.eventPage}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(buildEventStructuredData(event)) }} />
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <Link href="/actividad">Descubrir</Link><span aria-hidden="true">/</span><Link href={EVENTS_PATH}>Eventos</Link>
    </nav>
    <header className={styles.eventHeader}>
      {event.image ? <Image className={styles.compactIdentity} src={event.image.src} alt={event.image.alt} width={event.image.width} height={event.image.height} sizes="(max-width: 700px) 64px, 96px" priority /> : null}
      <div className={styles.eventHeading}>
        <h1>{event.title}</h1>
        <p><time dateTime={event.startDate}>{dates}</time></p>
        <p>{event.venue.name}<br />{event.venue.municipality}</p>
      </div>
      <div className={styles.eventActions}>
        <a className="chisan-button" href={locationUrl} target="_blank" rel="noopener noreferrer">Cómo llegar <ArrowUpRightIcon size={18} aria-hidden="true" /></a>
        <a className="chisan-button" href={event.organizerUrl} target="_blank" rel="noopener noreferrer">Programa <ArrowUpRightIcon size={18} aria-hidden="true" /></a>
      </div>
    </header>
    <section id="plano" className={styles.eventExplorer} aria-label="Expositores en Chisan">
      <ProducerSelectionExplorer selection={selection} plan={plan} messages={{ producers: "Expositores",
        countLabels: { [String(selection.items.length)]: `${selection.items.length} productores en Chisan` },
        map: { ...selectionPageMessages.map, producerMap: "Mapa del origen de los productores" } }} />
    </section>
    {/* Without an organizer plan, the grouped list says how each producer takes part. */}
    {!event.plan ? <section className={`${styles.section} ${styles.presence}`} aria-labelledby="presencia">
      <h2 id="presencia">Cómo encontrarlos en la feria</h2>
      <div className={styles.standGrid}>
        {presence.map((group) => <section key={group.kind} className={styles.standGroup}>
          <h3>{presenceTitles[group.kind]}</h3>
          <ul>{group.entries.map(({ item, note }) => <li key={item.key}>
            <Link href={item.href}>{item.name}</Link>
            {note ? <span>{note}</span> : <span>{item.city}</span>}
          </li>)}</ul>
        </section>)}
      </div>
    </section> : null}
    <details className={`chisan-disclosure ${styles.eventInformation}`}>
      <summary>Información del evento y fuentes</summary>
      <div className={styles.informationBody}>
        <p>{event.description}</p>
        <p>{event.editorialNote}</p>
        <p className={styles.sourceNote}>Coordenadas del recinto: {event.venue.latitude}, {event.venue.longitude}.</p>
        {event.plan ? <p className={styles.sourceNote}>Plano: {event.plan.credit}. <a href={event.plan.sourceUrl} target="_blank" rel="noopener noreferrer">Ver el original ↗</a> · Consultado el <time dateTime={event.plan.checkedAt}>{formatEventDate(event.plan.checkedAt)}</time>. {event.plan.rights}</p> : null}
        <ul className={styles.sources}>{event.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a><span>Consultada el <time dateTime={source.checkedAt}>{formatEventDate(source.checkedAt)}</time></span></li>)}</ul>
        {event.image ? <p className={styles.sourceNote}>Imagen: <a href={event.image.sourceUrl} target="_blank" rel="noopener noreferrer">{event.image.credit}</a>. {event.image.rights}</p> : null}
        <p className={styles.sourceNote}>Selección revisada por Chisan el <time dateTime={event.updatedAt}>{formatEventDate(event.updatedAt)}</time>. La organización puede cambiar expositores y horarios; comprueba su información antes de desplazarte.</p>
      </div>
    </details>
  </main>;
}
