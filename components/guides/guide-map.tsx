"use client";

import { useCallback, useRef, useState } from "react";

import { ProducerMapSelectionCard } from "@/components/map/producer-map-selection-card";
import {
  ProducerSelectionMap,
  type ProducerMapFocusRequest,
} from "@/components/map/producers-map";
import { useDismissibleProducerMapSelection } from "@/components/map/use-dismissible-producer-map-selection";
import {
  hasProducerSelectionCoordinates,
  type ProducerMapMarker,
  type ProducerSelectionItem,
} from "@/lib/producer-selections";
import styles from "./guides.module.css";

export function GuideMap({ items }: { items: ProducerSelectionItem[] }) {
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [focusRequest, setFocusRequest] = useState<ProducerMapFocusRequest>();
  const focusRequestId = useRef(0);
  const selectedLinkRef = useRef<HTMLAnchorElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const selectedItem = items.find(
    (item) => item.key === selectedKey && hasProducerSelectionCoordinates(item),
  );
  const clearSelection = useCallback(() => {
    setSelectedKey("");
    setFocusRequest(undefined);
  }, []);

  useDismissibleProducerMapSelection({
    active: Boolean(selectedItem),
    selectedSurfaceRef: selectedLinkRef,
    returnFocusRef: mapRef,
    onDismiss: clearSelection,
  });

  function selectProducer(key: string) {
    setSelectedKey(key);
    setFocusRequest({
      key,
      requestId: ++focusRequestId.current,
      behavior: "select",
    });
  }

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
          ref={mapRef}
          tabIndex={-1}
          className={styles.map}
          role="region"
          aria-label="Mapa de los productores de esta selección"
        >
          <ProducerSelectionMap
            points={points}
            selectedKey={selectedItem?.key}
            focusRequest={focusRequest}
            onSelectKey={selectProducer}
            markerInteraction="select"
            messages={{
              loading: "Cargando mapa…",
              emptyCoordinates: "Todavía no hay coordenadas publicadas.",
              openProfile: "Ver ficha del productor",
            }}
          />
          <div
            className="producer-map-selection-surface"
            aria-live="polite"
            aria-atomic="true"
          >
            {selectedItem ? (
              <ProducerMapSelectionCard
                producer={selectedItem}
                linkRef={selectedLinkRef}
              />
            ) : null}
          </div>
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
