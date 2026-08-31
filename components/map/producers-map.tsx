"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

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

export type ProducerMapFocusRequest = Readonly<{
  key: string;
  requestId: number;
}>;

export type ProducerMapNearbyPosition = Readonly<{
  latitude: number;
  longitude: number;
}>;

type ProducersMapProps = {
  points: ProducerMapPoint[];
  scope: CatalogNavigationScope;
  area: string;
  highlightedSlug?: string;
  focusRequest?: ProducerMapFocusRequest;
  nearbyPosition?: ProducerMapNearbyPosition;
  onSelectProducer?: (slug: string) => void;
  singlePointZoom?: number;
  messages: MapMessages;
};

export function ProducersMap({
  points,
  scope,
  area,
  highlightedSlug,
  focusRequest,
  nearbyPosition,
  onSelectProducer,
  singlePointZoom,
  messages,
}: ProducersMapProps) {
  const scopeCountry = scope.country;
  const scopePathPrefix = scope.pathPrefix;
  const markers = useMemo(
    () =>
      points.map((point): ProducerMapMarker => ({
        key: point.slug,
        href: buildProducerHref(point, {
          scope: { country: scopeCountry, pathPrefix: scopePathPrefix },
          area,
        }),
        name: point.name,
        city: point.city,
        categories: point.categories,
        latitude: point.latitude,
        longitude: point.longitude,
      })),
    [area, points, scopeCountry, scopePathPrefix],
  );

  return (
    <ProducerSelectionMap
      points={markers}
      highlightedKey={highlightedSlug}
      focusRequest={focusRequest}
      nearbyPosition={nearbyPosition}
      onSelect={onSelectProducer}
      singlePointZoom={singlePointZoom}
      minZoom={5}
      messages={messages}
    />
  );
}

export function ProducerSelectionMap({
  points,
  highlightedKey,
  focusRequest,
  initialFocusKeys,
  nearbyPosition,
  onSelect,
  singlePointZoom,
  minZoom = PRODUCER_SELECTION_MIN_ZOOM,
  messages,
}: {
  points: ProducerMapMarker[];
  highlightedKey?: string;
  focusRequest?: ProducerMapFocusRequest;
  initialFocusKeys?: string[];
  nearbyPosition?: ProducerMapNearbyPosition;
  onSelect?: (key: string) => void;
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
        focusRequest={focusRequest}
        initialFocusKeys={initialFocusKeys}
        nearbyPosition={nearbyPosition}
        onSelect={onSelect}
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
