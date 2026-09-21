"use client";

import { useState } from "react";
import Link from "next/link";
import type { TimelineItem } from "@/lib/community/service";
import styles from "./activity.module.css";

type ActivityFeedProps = {
  items: TimelineItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  const [filter, setFilter] = useState<"all" | "update" | "claim" | "message">(
    "all",
  );

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.kind === filter;
  });

  return (
    <section className={styles.section} aria-labelledby="activity-feed-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.kicker}>Actualidad</p>
          <h2 id="activity-feed-title">Feed cronológico</h2>
        </div>

        <div className={styles.locationActions} role="tablist" aria-label="Filtro de actividad">
          <button
            type="button"
            className={filter === "all" ? styles.buttonPrimary : styles.buttonSecondary}
            onClick={() => setFilter("all")}
          >
            Todo
          </button>
          <button
            type="button"
            className={filter === "update" ? styles.buttonPrimary : styles.buttonSecondary}
            onClick={() => setFilter("update")}
          >
            Novedades
          </button>
          <button
            type="button"
            className={filter === "claim" ? styles.buttonPrimary : styles.buttonSecondary}
            onClick={() => setFilter("claim")}
          >
            Titularidad
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className={styles.feedEmpty}>
          <p>No hay actividad reciente para mostrar con este filtro.</p>
        </div>
      ) : (
        <div className={styles.feedList}>
          {filteredItems.map((item) => (
            <article key={item.id} className={styles.feedItem}>
              <div className={styles.feedHeader}>
                <div className={styles.feedProducer}>
                  <Link href={item.producer.href}>{item.producer.name}</Link>
                  <small>({item.producer.city})</small>
                </div>
                <time className={styles.feedTime} dateTime={item.at}>
                  {new Intl.DateTimeFormat("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(item.at))}
                </time>
              </div>

              <span className={styles.feedBadge}>
                {item.kind === "claim"
                  ? "Titularidad verificada"
                  : item.kind === "message"
                    ? "Mensaje del productor"
                    : "Novedad en catálogo"}
              </span>

              <h3 className={styles.feedTitle}>{item.title}</h3>
              <p className={styles.feedBody}>{item.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
