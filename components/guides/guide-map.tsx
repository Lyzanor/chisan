"use client";

import { useCallback, useState } from "react";
import { ProducerCollectionMap } from "@/components/map/producer-collection-map";
import { hasProducerSelectionCoordinates, type ProducerSelectionItem } from "@/lib/producer-selections";
import type { Locale } from "@/lib/i18n/locales";
import styles from "./guides.module.css";

export function GuideMap({ items, locale = "es" }: { items: ProducerSelectionItem[]; locale?: Locale }) {
  const [selectedKey, setSelectedKey] = useState("");
  const clear = useCallback(() => setSelectedKey(""), []);
  const mapped = items.filter(hasProducerSelectionCoordinates).length;
  if (!mapped) return null;
  const english = locale === "en";
  return <div className={styles.mapBlock}>
    <ProducerCollectionMap items={items} selectedKey={selectedKey} onSelect={setSelectedKey} onClear={clear} locale={locale}
      messages={english ? { loading: "Loading map…", emptyCoordinates: "No published coordinates yet.", openProfile: "View producer", producerMap: "Map of the producers in this selection" }
        : { loading: "Cargando mapa…", emptyCoordinates: "Todavía no hay coordenadas publicadas.", openProfile: "Ver ficha del productor", producerMap: "Mapa de los productores de esta selección" }} />
    <p className={styles.caption}>{english ? `${mapped} of ${items.length} producers located on the map.` : `${mapped} de ${items.length} productores con ubicación en el mapa.`}</p>
  </div>;
}
