"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import type { CatalogNavigationContext } from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";
import type { MapVisibilitySummary } from "./producers-map-inner";

const ProducersMapInner = dynamic(() => import("./producers-map-inner"), {
  ssr: false,
  loading: () => <div className="map-placeholder">Cargando mapa…</div>,
});

type ProducersMapProps = {
  points: ProducerMapPoint[];
  highlightedId?: string;
  userLocation?: { lat: number; lon: number };
  detailContext?: CatalogNavigationContext;
};

export function ProducersMap({
  points,
  highlightedId,
  userLocation,
  detailContext,
}: ProducersMapProps) {
  const [summary, setSummary] = useState<MapVisibilitySummary | null>(null);
  const renderedLabel =
    summary?.renderedCount === 1 ? "punto visible" : "puntos visibles";
  const totalLabel =
    summary?.visibleCount === 1 ? "productor en pantalla" : "productores en pantalla";
  const zoneLabel =
    summary?.visibleCount === 1 ? "productor en esta zona" : "productores en esta zona";
  const searchLabel =
    summary?.totalCount === 1 ? "productor en la búsqueda" : "productores en la búsqueda";

  if (!points.length && !userLocation) {
    return (
      <div className="map-placeholder">
        No hay coordenadas válidas en esta selección.
      </div>
    );
  }

  return (
    <div className="map-shell">
      {summary && points.length > 0 ? (
        <div className="map-summary" aria-live="polite">
          <strong>
            {summary.renderedCount}
            {` ${renderedLabel}`}
          </strong>
          <span>
            {summary.hiddenCount > 0
              ? `de ${summary.visibleCount} ${totalLabel} · acerca o desplázate para ver más`
              : summary.totalCount !== summary.visibleCount
                ? `${summary.visibleCount} ${zoneLabel}`
                : `${summary.totalCount} ${searchLabel}`}
          </span>
        </div>
      ) : null}
      <ProducersMapInner
        points={points}
        highlightedId={highlightedId}
        userLocation={userLocation}
        detailContext={detailContext}
        onSummaryChange={setSummary}
      />
    </div>
  );
}
