"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export type ProducerMapMarkerInteraction = "popup" | "select" | "static";

type ProducersMapProps = {
  points: ProducerMapPoint[];
  scope: CatalogNavigationScope;
  area: string;
  selectedSlug?: string;
  focusRequest?: ProducerMapFocusRequest;
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelectProducer?: (slug: string) => void;
  onVisibleProducerKeysChange?: (keys: string[]) => void;
  markerInteraction?: ProducerMapMarkerInteraction;
  singlePointZoom?: number;
  messages: MapMessages;
};

export function ProducersMap({
  points,
  scope,
  area,
  selectedSlug,
  focusRequest,
  nearbyFocusKeys,
  onNearbyFocusConsumed,
  onSelectProducer,
  onVisibleProducerKeysChange,
  markerInteraction,
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
      key={`${scopeCountry}/${area}`}
      points={markers}
      selectedKey={selectedSlug}
      focusRequest={focusRequest}
      nearbyFocusKeys={nearbyFocusKeys}
      onNearbyFocusConsumed={onNearbyFocusConsumed}
      onSelectKey={onSelectProducer}
      onVisibleKeysChange={onVisibleProducerKeysChange}
      markerInteraction={markerInteraction}
      singlePointZoom={singlePointZoom}
      minZoom={5}
      messages={messages}
    />
  );
}

export function ProducerSelectionMap({
  points,
  selectedKey,
  focusRequest,
  initialFocusKeys,
  nearbyFocusKeys,
  onNearbyFocusConsumed,
  onSelectKey,
  onVisibleKeysChange,
  markerInteraction,
  singlePointZoom,
  minZoom = PRODUCER_SELECTION_MIN_ZOOM,
  messages,
}: {
  points: ProducerMapMarker[];
  selectedKey?: string;
  focusRequest?: ProducerMapFocusRequest;
  initialFocusKeys?: string[];
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelectKey?: (key: string) => void;
  onVisibleKeysChange?: (keys: string[]) => void;
  markerInteraction?: ProducerMapMarkerInteraction;
  singlePointZoom?: number;
  minZoom?: number;
  messages: MapMessages;
}) {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);
  const resolvedMarkerInteraction =
    markerInteraction ?? (onSelectKey ? "select" : "popup");

  useEffect(() => {
    if (!points.length) {
      onVisibleKeysChange?.([]);
    }
  }, [onVisibleKeysChange, points.length]);

  if (!points.length) {
    return <div className="map-placeholder">{messages.emptyCoordinates}</div>;
  }

  return (
    <div className="map-shell">
      {!isReady ? <div className="map-placeholder">{messages.loading}</div> : null}
      <ProducersMapInner
        points={points}
        selectedKey={selectedKey}
        focusRequest={focusRequest}
        initialFocusKeys={initialFocusKeys}
        nearbyFocusKeys={nearbyFocusKeys}
        onNearbyFocusConsumed={onNearbyFocusConsumed}
        onSelectKey={onSelectKey}
        onVisibleKeysChange={onVisibleKeysChange}
        markerInteraction={resolvedMarkerInteraction}
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
