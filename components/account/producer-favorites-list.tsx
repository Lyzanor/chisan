"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProducerFavoritesPage } from "@/lib/accounts/producer-favorites";
import { UserAvatar } from "./user-avatar";
import styles from "./producer-favorites.module.css";

export function ProducerFavoritesList({
  initial,
  country,
  producerId,
}: {
  initial: ProducerFavoritesPage;
  country: string;
  producerId: number;
}) {
  const [page, setPage] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function refresh(offset = 0) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/producer-favorites?country=${country}&producerId=${producerId}&offset=${offset}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error();
      const next: ProducerFavoritesPage = await response.json();
      setPage((current) =>
        offset
          ? {
              ...next,
              total: next.total || current.total,
              items: [...current.items, ...next.items],
            }
          : next,
      );
    } catch {
      setError("No se ha podido cargar la lista. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className={styles.section}
      aria-labelledby="producer-favorites-title"
    >
      <details
        onToggle={(event) => {
          if (event.currentTarget.open) void refresh();
        }}
      >
        <summary className={styles.summary}>
          <span className={styles.copy}>
            <span id="producer-favorites-title" className={styles.title}>
              Guardado en favoritos por
            </span>
            <span>
              {page.total === 1
                ? "1 persona · Ver lista"
                : `${page.total} personas · Ver lista`}
            </span>
          </span>
          <span className={styles.stack} aria-hidden="true">
            {page.items.slice(0, 5).map((person, index) => (
              <span key={index}>
                <UserAvatar name={person.name} src={person.avatarUrl} />
              </span>
            ))}
            {page.total > 5 ? (
              <span className={styles.count}>+{page.total - 5}</span>
            ) : null}
          </span>
          <span className={styles.chevron} aria-hidden="true">
            ⌄
          </span>
        </summary>
        <div className={styles.content}>
          <p className={styles.note}>
            Solo aparecen las personas que han elegido mostrarse aquí.
          </p>
          <ul className={styles.list}>
            {page.items.map((person, index) => (
              <li key={index}>
                {person.profileHref ? (
                  <Link
                    href={person.profileHref}
                    prefetch={false}
                    className={styles.person}
                  >
                    <UserAvatar name={person.name} src={person.avatarUrl} />
                    <span>
                      <strong>{person.name}</strong>
                      <small>Ver perfil y mapa de favoritos</small>
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <div className={styles.person}>
                    <UserAvatar name={person.name} src={person.avatarUrl} />
                    <span>
                      <strong>{person.name}</strong>
                      <small>Sin perfil público</small>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {!page.items.length && !busy && !error ? (
            <p>Aún no hay personas que hayan elegido aparecer.</p>
          ) : null}
          <div role="status" aria-live="polite">
            {busy ? "Cargando…" : error}
          </div>
          {error ? (
            <button
              className="account-button account-button--secondary"
              onClick={() => void refresh()}
              disabled={busy}
            >
              Reintentar
            </button>
          ) : null}
          {page.nextOffset !== null && !error ? (
            <button
              className="account-button account-button--secondary"
              disabled={busy}
              onClick={() => void refresh(page.nextOffset!)}
            >
              Ver más personas
            </button>
          ) : null}
        </div>
      </details>
    </section>
  );
}
