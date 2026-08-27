"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import {
  buildProducerHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";
import {
  PRODUCER_SELECTION_MIN_ZOOM,
  type ProducerMapMarker,
} from "@/lib/producer-selections";

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
  const markers = points.map((point): ProducerMapMarker => ({
    key: point.slug,
    href: buildProducerHref(point, { scope, area }),
    name: point.name,
    city: point.city,
    categories: point.categories,
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  return (
    <ProducerSelectionMap
      points={markers}
      highlightedKey={highlightedSlug}
      singlePointZoom={singlePointZoom}
      minZoom={5}
      messages={messages}
    />
  );
}

export function ProducerSelectionMap({
  points,
  highlightedKey,
  singlePointZoom,
  minZoom = PRODUCER_SELECTION_MIN_ZOOM,
  messages,
}: {
  points: ProducerMapMarker[];
  highlightedKey?: string;
  singlePointZoom?: number;
  minZoom?: number;
  messages: MapMessages;
}) {
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
        highlightedKey={highlightedKey}
        singlePointZoom={singlePointZoom}
        minZoom={minZoom}
        messages={{
          openProfile: messages.openProfile,
        }}
        onReady={handleReady}
      />
    </div>
  );
}
