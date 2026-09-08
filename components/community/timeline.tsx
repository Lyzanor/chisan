import Link from "next/link";
import type { TimelinePage } from "@/lib/community/service";
import {
  FOLLOWING_PATH,
  TIMELINE_PATH,
  type TimelineFilter,
} from "@/lib/community/policy";
import styles from "./timeline.module.css";

export function Timeline({
  page,
  filter,
}: {
  page: TimelinePage;
  filter: TimelineFilter;
}) {
  return (
    <section className={styles.timeline} aria-labelledby="timeline-title">
      <header className="account-section-heading">
        <div>
          <p className="catalog-kicker">Tu comunidad</p>
          <h2 id="timeline-title">Cerca de quienes producen</h2>
          <p>
            Novedades publicadas de los productores que sigues y avisos de
            titularidad, de más reciente a más antiguo.
          </p>
        </div>
        <Link
          href={FOLLOWING_PATH}
          className={`account-button account-button--secondary ${styles.followingLink}`}
        >
          Siguiendo · {page.followingCount}
        </Link>
      </header>
      <nav className={styles.filters} aria-label="Filtrar novedades">
        {(
          [
            ["all", "Todo"],
            ["posts", "Novedades"],
            ["activity", "Actividad"],
          ] as const
        ).map(([value, label]) => (
          <Link
            key={value}
            href={`${TIMELINE_PATH}?filter=${value}`}
            aria-current={filter === value ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      {!page.items.length ? (
        <div className={styles.empty}>
          <h3>
            {page.followingCount
              ? "Todavía no hay novedades aquí"
              : "Empieza por un productor cercano"}
          </h3>
          <p>
            {page.followingCount
              ? "Cuando se publique un cambio de un productor premium que sigues o se apruebe su titularidad, podrás leerlo aquí."
              : "Pulsa «Seguir productor» en sus perfiles para reunir aquí sus novedades. Tus favoritos anteriores ya son seguimientos."}
          </p>
          <Link href="/" className="account-button">
            Descubrir productores
          </Link>
        </div>
      ) : (
        <ol className={styles.entries}>
          {page.items.map((item) => (
            <li key={item.id}>
              <article
                className={styles.entry}
                aria-labelledby={`entry-${item.id}`}
              >
                <div className={styles.byline}>
                  <span>
                    <Link href={item.producer.href}>{item.producer.name}</Link>
                    <small>{item.producer.city}</small>
                  </span>
                  <time dateTime={item.at}>
                    {new Intl.DateTimeFormat("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Europe/Madrid",
                    }).format(new Date(item.at))}
                  </time>
                </div>
                <p className={styles.kind}>
                  {item.kind === "claim"
                    ? "Titularidad aprobada · Chisan"
                    : item.kind === "message"
                      ? "Mensaje del productor · Revisado"
                      : "Cambio publicado · Revisado"}
                </p>
                <div lang={item.locale}>
                  <h3 id={`entry-${item.id}`}>{item.title}</h3>
                  <p className={styles.body}>{item.body}</p>
                </div>
                {item.producer ? (
                  <Link
                    className={styles.profileLink}
                    href={item.producer.href}
                  >
                    Conocer al productor <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      )}
      {page.nextCursor ? (
        <Link
          className="account-button account-button--secondary"
          href={`${TIMELINE_PATH}?filter=${filter}&cursor=${encodeURIComponent(page.nextCursor)}`}
        >
          Ver anteriores
        </Link>
      ) : null}
      {filter !== "activity" &&
      (page.messages.length > 0 || page.nextMessagePage !== null) ? (
        <section aria-labelledby="current-messages-title">
          <h3 id="current-messages-title">Mensajes de tu comunidad</h3>
          <p>Los mensajes que tus productores mantienen en sus perfiles.</p>
          {page.messages.map((message) => (
            <details key={message.key} className={styles.currentMessage}>
              <summary>
                {message.producer.name}
                <small>Mensaje actual del productor</small>
              </summary>
              <p className={styles.body} lang={message.locale}>
                {message.body}
              </p>
              <Link className={styles.profileLink} href={message.producer.href}>
                Ver perfil
              </Link>
            </details>
          ))}
          {page.nextMessagePage !== null ? (
            <Link
              className="account-button account-button--secondary"
              href={`${TIMELINE_PATH}?filter=${filter}&messagePage=${page.nextMessagePage}#current-messages-title`}
            >
              Más mensajes de productores
            </Link>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
