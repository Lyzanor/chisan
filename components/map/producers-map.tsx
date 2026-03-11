"use client";

import dynamic from "next/dynamic";

import type { ProducerMapPoint } from "@/lib/csv-catalog";

const ProducersMapInner = dynamic(() => import("./producers-map-inner"), {
  ssr: false,
  loading: () => <div className="map-placeholder">Cargando mapa…</div>,
});

type ProducersMapProps = {
  points: ProducerMapPoint[];
  highlightedId?: string;
  userLocation?: { lat: number; lon: number };
};

export function ProducersMap({ points, highlightedId, userLocation }: ProducersMapProps) {
  if (!points.length) {
    return (
      <div className="map-placeholder">
        No hay coordenadas válidas en esta selección.
      </div>
    );
  }

  return (
    <div className="map-shell">
      <ProducersMapInner points={points} highlightedId={highlightedId} userLocation={userLocation} />
    </div>
  );
}
