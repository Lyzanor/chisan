import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ProducerSelectionExplorer } from "@/components/producer-selection-explorer";
import { selectionPageMessages } from "@/lib/accounts/selection-presentation";
import { EVENTS_PATH, eventPath } from "@/lib/events/routes";
import { buildEventStructuredData } from "@/lib/events/metadata";
import type { EditorialEvent } from "@/lib/events/schema";
import type { ProducerSelectionExplorerModel } from "@/lib/producer-selections";
import { serializeStructuredData } from "@/lib/site-structured-data";
import { formatEventDate } from "./event-card";
import styles from "./events.module.css";

export function EventPage({ event, selection }: { event: EditorialEvent; selection: ProducerSelectionExplorerModel }) {
  const path = eventPath(event.slug);
  const exhibitorsByStand = new Map<string, typeof selection.items>();
  event.exhibitors.forEach((exhibitor, index) => {
    const stand = exhibitor.stand ?? "Sin puesto indicado";
    const group = exhibitorsByStand.get(stand) ?? [];
    group.push(selection.items[index]);
    exhibitorsByStand.set(stand, group);
  });
  const locationUrl = `https://www.openstreetmap.org/?mlat=${event.venue.latitude}&mlon=${event.venue.longitude}#map=16/${event.venue.latitude}/${event.venue.longitude}`;
  const plan = event.plan ? {
    imageSrc: event.plan.src,
    width: event.plan.width,
    height: event.plan.height,
    alt: event.plan.alt,
    points: event.plan.points,
    note: "Elige un expositor de la lista para señalar su puesto. El mapa muestra dónde produce, no la posición de la feria.",
  } : null;

  return <main className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(buildEventStructuredData(event)) }} />
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <Link href="/actividad">Descubrir</Link><span aria-hidden="true">/</span>
      <Link href={EVENTS_PATH}>Eventos</Link><span aria-hidden="true">/</span>
      <span aria-current="page">{event.title}</span>
    </nav>
    <header className={styles.header}>
      {event.image ? <Image className={styles.eventIdentity} src={event.image.src} alt={event.image.alt} width={event.image.width} height={event.image.height} sizes="160px" priority /> : null}
      <p className="chisan-eyebrow">Evento seleccionado · {event.category}</p>
      <h1 className="chisan-enter">{event.title}</h1>
      <p>{event.description}</p>
      <div className={styles.facts}>
        <div><span>Cuándo</span><strong><time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time> — <time dateTime={event.endDate}>{formatEventDate(event.endDate)}</time></strong></div>
        <div><span>Dónde</span><strong>{event.venue.name}, {event.venue.municipality}</strong></div>
      </div>
      <div className={styles.actions}>
        <a className="chisan-button chisan-button--primary" href={event.organizerUrl} target="_blank" rel="noopener noreferrer">Programa oficial <ArrowUpRightIcon className="chisan-arrow" size={18} aria-hidden="true" /></a>
        <a className="chisan-button" href={locationUrl} target="_blank" rel="noopener noreferrer">Abrir ubicación <ArrowUpRightIcon className="chisan-arrow" size={18} aria-hidden="true" /></a>
      </div>
    </header>
    <section className={styles.section} data-reveal aria-labelledby="venue-title">
      <h2 id="venue-title">Lugar de la feria</h2>
      <p>{event.venue.name} está en {event.venue.municipality}. Coordenadas del evento: {event.venue.latitude}, {event.venue.longitude}. El mapa de productores de abajo indica sus lugares de producción.</p>
    </section>
    <section className={styles.section} data-reveal aria-labelledby="exhibitors-title">
      <h2 id="exhibitors-title">Expositores en Chisan</h2>
      <p>{event.editorialNote}</p>
      <details className={`chisan-disclosure ${styles.exhibitorDetails}`}>
        <summary>Elegir expositor ({selection.items.length})</summary>
        <div className={styles.standGrid}>
          {[...exhibitorsByStand].map(([stand, items]) => <div key={stand} className={styles.standGroup}>
            <h3>Puesto {stand}</h3>
            <ul>{items.map((item) => <li key={item.key}><Link href={`${path}?highlight=${encodeURIComponent(item.key)}#plano`}>{item.name}</Link></li>)}</ul>
          </div>)}
        </div>
      </details>
    </section>
    <section id="plano" className={styles.section} aria-labelledby="plan-title">
      <h2 id="plan-title">{plan ? "Plano de expositores y origen" : "Origen de los expositores"}</h2>
      <p>{plan ? "Selecciona un expositor de la lista para localizar su puesto en el plano. Cambia a Origen para explorar los lugares donde se produce." : "Explora los lugares de producción de los expositores publicados en Chisan."}</p>
      <ProducerSelectionExplorer
        selection={selection}
        plan={plan}
        messages={{
          producers: "Expositores",
          countLabels: { [String(selection.items.length)]: `${selection.items.length} productores` },
          map: { ...selectionPageMessages.map, producerMap: "Mapa del origen de los expositores" },
        }}
      />
      {event.plan ? <p className={styles.sourceNote}>Plano: {event.plan.credit}. <a href={event.plan.sourceUrl} target="_blank" rel="noopener noreferrer">Ver el original ↗</a> · Consultado el <time dateTime={event.plan.checkedAt}>{formatEventDate(event.plan.checkedAt)}</time>. {event.plan.rights}</p> : null}
    </section>
    <section className={styles.section} data-reveal aria-labelledby="sources-title">
      <h2 id="sources-title">Fuentes y revisión</h2>
      <ul className={styles.sources}>{event.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a><span>Consultada el <time dateTime={source.checkedAt}>{formatEventDate(source.checkedAt)}</time></span></li>)}</ul>
      {event.image ? <p className={styles.sourceNote}>Imagen: <a href={event.image.sourceUrl} target="_blank" rel="noopener noreferrer">{event.image.credit}</a>. {event.image.rights}</p> : null}
      <p className={styles.sourceNote}>Selección revisada por Chisan el <time dateTime={event.updatedAt}>{formatEventDate(event.updatedAt)}</time>. La organización puede cambiar expositores y horarios; comprueba su información antes de desplazarte.</p>
    </section>
  </main>;
}
