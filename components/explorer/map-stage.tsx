"use client";

import type { Ref } from "react";
import {
  ProducerSelectionMap,
  type ProducerMapFocusRequest,
  type ProducerMapGroupOverview,
} from "@/components/map/producers-map";
import { ProducerMapCarousel } from "@/components/map/producer-map-carousel";
import type { ProducerMapMarker } from "@/lib/producer-selections";
import type { ExplorerProducer } from "@/lib/catalog/explorer";
import type { Messages } from "@/lib/i18n/messages";

export interface MapStageProps {
  mapSurfaceRef: Ref<HTMLDivElement>;
  mapLabel: string;
  loading: boolean;
  hasError: boolean;
  hasItems: boolean;
  statusMessage: string;
  retryAction?: () => void;
  retryLabel?: string;
  searchScope: "area" | "country";
  points: ProducerMapMarker[];
  selectedKey?: string;
  focusRequest?: ProducerMapFocusRequest;
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed: () => void;
  onSelectKey: (slug: string) => void;
  onPreviewKey: (slug: string) => void;
  onPreviewEndKey: () => void;
  onVisibleKeysChange: (keys: string[]) => void;
  groupOverview: ProducerMapGroupOverview;
  messages: Messages["map"];
  carouselKey: string;
  orderedItems: readonly ExplorerProducer[];
  onCarouselInteract: () => void;
  carouselLabels: Parameters<typeof ProducerMapCarousel>[0]["labels"];
  selectedProducerLinkRef: Ref<HTMLAnchorElement>;
}

export function MapStage({
  mapSurfaceRef,
  mapLabel,
  loading,
  hasError,
  hasItems,
  statusMessage,
  retryAction,
  retryLabel = "Reintentar",
  searchScope,
  points,
  selectedKey,
  focusRequest,
  nearbyFocusKeys,
  onNearbyFocusConsumed,
  onSelectKey,
  onPreviewKey,
  onPreviewEndKey,
  onVisibleKeysChange,
  groupOverview,
  messages,
  carouselKey,
  orderedItems,
  onCarouselInteract,
  carouselLabels,
  selectedProducerLinkRef,
}: MapStageProps) {
  const showPlaceholder = loading || hasError || !hasItems;

  return (
    <div className="producer-map-stage">
      <div
        ref={mapSurfaceRef}
        className="catalog-simple-map"
        aria-label={mapLabel}
        tabIndex={-1}
      >
        {showPlaceholder ? (
          <div className="map-placeholder" />
        ) : (
          <ProducerSelectionMap
            key={searchScope}
            points={points}
            minZoom={4}
            selectedKey={selectedKey}
            focusPaddingBottom={180}
            focusRequest={focusRequest}
            nearbyFocusKeys={nearbyFocusKeys}
            onNearbyFocusConsumed={onNearbyFocusConsumed}
            onSelectKey={onSelectKey}
            onPreviewKey={onPreviewKey}
            onPreviewEndKey={onPreviewEndKey}
            onVisibleKeysChange={onVisibleKeysChange}
            groupOverview={groupOverview}
            openOnMainCluster={searchScope === "country"}
            messages={messages}
          />
        )}
      </div>

      {showPlaceholder ? (
        <div className="catalog-map-status" role="status">
          <p>{statusMessage}</p>
          {hasError && retryAction ? (
            <button
              type="button"
              className="catalog-search-action"
              onClick={retryAction}
            >
              {retryLabel}
            </button>
          ) : null}
        </div>
      ) : (
        <ProducerMapCarousel
          key={carouselKey}
          items={orderedItems}
          activeKey={selectedKey}
          onSelect={onSelectKey}
          onInteract={onCarouselInteract}
          labels={carouselLabels}
          linkRef={selectedProducerLinkRef}
        />
      )}
    </div>
  );
}
