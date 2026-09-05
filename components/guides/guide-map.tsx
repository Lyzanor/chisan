"use client";

import { useState } from "react";

import { ProducerSelectionMap } from "@/components/map/producers-map";
import {
  hasProducerSelectionCoordinates,
  type ProducerMapMarker,
  type ProducerSelectionItem,
} from "@/lib/producer-selections";
import styles from "./guides.module.css";

export function GuideMap({ items }: { items: ProducerSelectionItem[] }) {
  const [open, setOpen] = useState(false);
  const points: ProducerMapMarker[] = items
    .filter(hasProducerSelectionCoordinates)
    .map((item) => ({
      key: item.key,
      name: item.name,
      href: item.href,
      city: item.city,
      icon: item.icon,
      categories: item.categories,
      latitude: item.latitude!,
      longitude: item.longitude!,
    }));
  if (!points.length) return null;

  return (
    <div className={styles.mapBlock}>
      {open ? (
        <div
          className={styles.map}
          role="region"
          aria-label="Mapa de los productores de esta selección"
        >
          <ProducerSelectionMap
            points={points}
            markerInteraction="popup"
            messages={{
              loading: "Cargando mapa…",
              emptyCoordinates: "Todavía no hay coordenadas publicadas.",
              openProfile: "Ver ficha del productor",
            }}
          />
        </div>
      ) : (
        <button
          className={styles.mapButton}
          type="button"
          onClick={() => setOpen(true)}
        >
          Explorar esta selección en el mapa <span aria-hidden="true">↗</span>
        </button>
      )}
      <p className={styles.caption}>
        {points.length} de {items.length} productores con ubicación en el mapa.
        Todas las fichas están enlazadas arriba.
      </p>
    </div>
  );
}
