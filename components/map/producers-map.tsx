"use client";

import dynamic from "next/dynamic";

import type { ProducerMapPoint } from "@/lib/csv-catalog";

const ProducersMapInner = dynamic(() => import("./producers-map-inner"), {
  ssr: false,
  loading: () => <div className="map-placeholder">Loading map…</div>,
});

type ProducersMapProps = {
  points: ProducerMapPoint[];
  country: string;
  area: string;
  highlightedSlug?: string;
  userLocation?: { lat: number; lon: number };
};

export function ProducersMap({
  points,
  country,
  area,
  highlightedSlug,
  userLocation,
}: ProducersMapProps) {
  if (!points.length) {
    return (
      <div className="map-placeholder">
        No hay coordenadas válidas en esta selección.
      </div>
    );
  }

  return (
    <div className="map-shell">
      <ProducersMapInner
        points={points}
        country={country}
        area={area}
        highlightedSlug={highlightedSlug}
        userLocation={userLocation}
      />
    </div>
  );
}
