"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  buildProducerHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";
import {
  PRODUCER_SELECTION_MIN_ZOOM,
  type ProducerMapMarker,
} from "@/lib/producer-selections";
import { getCategoryIcon } from "@/lib/get-category-icon";

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
  behavior: "preview" | "select";
}>;

export type ProducerMapMarkerInteraction = "popup" | "select" | "static";

/** Localized copy for dense discovery maps whose points carry a group. */
export type ProducerMapGroupOverview = Readonly<{
  formatCount: (count: number) => string;
  describe: (
    labels: readonly string[],
    count: number,
  ) => Readonly<{ areas: string; producers: string; label: string }>;
}>;

type ProducersMapProps = {
  points: ProducerMapPoint[];
  scope: CatalogNavigationScope;
  area: string;
  selectedSlug?: string;
  selectionContent?: ReactNode;
  focusRequest?: ProducerMapFocusRequest;
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelectProducer?: (slug: string) => void;
  onPreviewProducer?: (slug: string) => void;
  onPreviewProducerEnd?: (slug: string) => void;
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
  selectionContent,
  focusRequest,
  nearbyFocusKeys,
  onNearbyFocusConsumed,
  onSelectProducer,
  onPreviewProducer,
  onPreviewProducerEnd,
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
        icon: getCategoryIcon(point.category),
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
      selectionContent={selectionContent}
      focusRequest={focusRequest}
      nearbyFocusKeys={nearbyFocusKeys}
      onNearbyFocusConsumed={onNearbyFocusConsumed}
      onSelectKey={onSelectProducer}
      onPreviewKey={onPreviewProducer}
      onPreviewEndKey={onPreviewProducerEnd}
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
  selectionContent,
  focusRequest,
  initialFocusKeys,
  nearbyFocusKeys,
  onNearbyFocusConsumed,
  onSelectKey,
  onPreviewKey,
  onPreviewEndKey,
  onVisibleKeysChange,
  markerInteraction,
  singlePointZoom,
  minZoom = PRODUCER_SELECTION_MIN_ZOOM,
  groupOverview,
  messages,
}: {
  points: ProducerMapMarker[];
  selectedKey?: string;
  selectionContent?: ReactNode;
  focusRequest?: ProducerMapFocusRequest;
  initialFocusKeys?: string[];
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelectKey?: (key: string) => void;
  onPreviewKey?: (key: string) => void;
  onPreviewEndKey?: (key: string) => void;
  onVisibleKeysChange?: (keys: string[]) => void;
  markerInteraction?: ProducerMapMarkerInteraction;
  singlePointZoom?: number;
  minZoom?: number;
  groupOverview?: ProducerMapGroupOverview;
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
        selectionContent={selectionContent}
        focusRequest={focusRequest}
        initialFocusKeys={initialFocusKeys}
        nearbyFocusKeys={nearbyFocusKeys}
        onNearbyFocusConsumed={onNearbyFocusConsumed}
        onSelectKey={onSelectKey}
        onPreviewKey={onPreviewKey}
        onPreviewEndKey={onPreviewEndKey}
        onVisibleKeysChange={onVisibleKeysChange}
        markerInteraction={resolvedMarkerInteraction}
        singlePointZoom={singlePointZoom}
        minZoom={minZoom}
        groupOverview={groupOverview}
        messages={messages}
        onReady={handleReady}
      />
    </div>
  );
}
