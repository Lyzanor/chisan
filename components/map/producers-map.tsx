"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import type { CatalogNavigationScope } from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";

const ProducersMapInner = dynamic(() => import("./producers-map-inner"), {
  ssr: false,
  loading: () => null,
});

export type MapMessages = {
  loading: string;
  emptyCoordinates: string;
  openProfile: string;
};

type ProducersMapProps = {
  points: ProducerMapPoint[];
  scope: CatalogNavigationScope;
  area: string;
  highlightedSlug?: string;
  singlePointZoom?: number;
  messages: MapMessages;
};

export function ProducersMap({
  points,
  scope,
  area,
  highlightedSlug,
  singlePointZoom,
  messages,
}: ProducersMapProps) {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);

  if (!points.length) {
    return <div className="map-placeholder">{messages.emptyCoordinates}</div>;
  }

  return (
    <div className="map-shell">
      {!isReady ? <div className="map-placeholder">{messages.loading}</div> : null}
      <ProducersMapInner
        points={points}
        scope={scope}
        area={area}
        highlightedSlug={highlightedSlug}
        singlePointZoom={singlePointZoom}
        messages={{
          openProfile: messages.openProfile,
        }}
        onReady={handleReady}
      />
    </div>
  );
}
