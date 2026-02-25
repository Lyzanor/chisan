"use client";

import dynamic from "next/dynamic";

import type { ProducerMapPoint } from "@/lib/producer-map";

const ProducersMapInner = dynamic(() => import("./producers-map-inner"), {
  ssr: false,
  loading: () => <div className="map-placeholder">Cargando mapa…</div>,
});

type ProducersMapProps = {
  points: ProducerMapPoint[];
};

export function ProducersMap({ points }: ProducersMapProps) {
  if (!points.length) {
    return (
      <div className="map-placeholder">
        No hay coordenadas válidas en esta selección.
      </div>
    );
  }

  return (
    <div className="map-shell">
      <ProducersMapInner points={points} />
    </div>
  );
}
