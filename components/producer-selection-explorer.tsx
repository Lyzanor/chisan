"use client";

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProducerCollectionMap } from "@/components/map/producer-collection-map";
import type { MapMessages } from "@/components/map/producers-map";
import type { PublicSelectionShelf } from "@/lib/selection-shelf/policy";
import { ShelfPhoto } from "@/components/selection-shelf/shelf-photo";
import shelfStyles from "@/components/selection-shelf/shelf.module.css";
import {
  buildProducerSelectionHighlightHref,
  hasProducerSelectionCoordinates,
  type ProducerSelectionExplorerModel,
} from "@/lib/producer-selections";

export type ProducerSelectionExplorerMessages = {
  producers: string;
  countLabels: Record<string, string>;
  map: MapMessages & {
    producerMap: string;
  };
};

function pushSelectionState(href: string) {
  const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentHref !== href) {
    window.history.pushState(null, "", href);
  }
}

function replaceSelectionState(href: string) {
  const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentHref !== href) {
    window.history.replaceState(null, "", href);
  }
}

function ProducerSelectionExplorerView({
  selection,
  messages,
  shelf,
  selectedKey,
}: {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
  shelf?: PublicSelectionShelf | null;
  selectedKey: string;
}) {
  const [mobileTab, setMobileTab] = useState<"shelf" | "map">("shelf");
  const combinedRef = useRef<HTMLElement>(null);

  const selectProducer = useCallback(
    (key: string) => {
      if (selection.items.some((item) => item.key === key)) {
        pushSelectionState(
          buildProducerSelectionHighlightHref(selection.canonicalPath, key),
        );
      }
    },
    [selection.items, selection.canonicalPath],
  );

  const clearSelection = useCallback(() => {
    replaceSelectionState(
      buildProducerSelectionHighlightHref(selection.canonicalPath, ""),
    );
  }, [selection.canonicalPath]);

  const selectedProducer = useMemo(() => {
    return selectedKey
      ? selection.items.find((item) => item.key === selectedKey) ?? null
      : null;
  }, [selectedKey, selection.items]);

  const viewMap = useCallback(() => {
    setMobileTab("map");
    window.dispatchEvent(new Event("resize"));
  }, []);

  const viewShelf = useCallback(() => {
    setMobileTab("shelf");
  }, []);

  if (!shelf) {
    return (
      <section ref={combinedRef}>
        <ProducerCollectionMap
          items={selection.items}
          selectedKey={selectedKey}
          onSelect={selectProducer}
          onClear={clearSelection}
          initialFocusKeys={selection.initialFocusKeys}
          messages={messages.map}
          relatedSurfaceRef={combinedRef}
        />
      </section>
    );
  }

  const mappedCount = selection.items.filter(
    hasProducerSelectionCoordinates,
  ).length;
  const producerHasShelfPoints = Boolean(
    selectedKey && shelf.points.some((p) => p.producerKey === selectedKey),
  );

  return (
    <section ref={combinedRef} className={shelfStyles.combined}>
      <div
        className={shelfStyles.mobileTabs}
        role="tablist"
        aria-label="Modo de exploración"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "shelf"}
          className={`${shelfStyles.mobileTab} ${
            mobileTab === "shelf" ? shelfStyles.mobileTabActive : ""
          }`}
          onClick={viewShelf}
        >
          <span>🖼️ Estantería ({shelf.points.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "map"}
          className={`${shelfStyles.mobileTab} ${
            mobileTab === "map" ? shelfStyles.mobileTabActive : ""
          }`}
          onClick={viewMap}
        >
          <span>🗺️ Mapa ({mappedCount})</span>
        </button>
      </div>

      <div
        className={`${shelfStyles.shelfCol} ${
          mobileTab === "shelf"
            ? shelfStyles.colActiveMobile
            : shelfStyles.colHiddenMobile
        }`}
      >
        <ShelfPhoto
          shelf={shelf}
          selectedKey={selectedKey}
          selectedProducer={selectedProducer}
          onSelectKey={selectProducer}
          onViewMap={viewMap}
        />
      </div>

      <div
        className={`${shelfStyles.mapCol} ${
          mobileTab === "map"
            ? shelfStyles.colActiveMobile
            : shelfStyles.colHiddenMobile
        }`}
      >
        {producerHasShelfPoints ? (
          <div className={shelfStyles.shelfReturnBanner}>
            <button
              type="button"
              className={shelfStyles.backToShelfButton}
              onClick={viewShelf}
            >
              <span>← Ver en estantería</span>
            </button>
          </div>
        ) : null}
        <ProducerCollectionMap
          items={selection.items}
          selectedKey={selectedKey}
          onSelect={selectProducer}
          onClear={clearSelection}
          initialFocusKeys={selection.initialFocusKeys}
          messages={messages.map}
          relatedSurfaceRef={combinedRef}
        />
      </div>
    </section>
  );
}

function ProducerSelectionExplorerFromSearchParams({
  selection,
  messages,
  shelf,
}: {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
  shelf?: PublicSelectionShelf | null;
}) {
  const searchParams = useSearchParams();
  const selectedKey = searchParams.get("highlight")?.trim() ?? "";

  return (
    <ProducerSelectionExplorerView
      selection={selection}
      messages={messages}
      shelf={shelf}
      selectedKey={selectedKey}
    />
  );
}

export function ProducerSelectionExplorer({
  selection,
  messages,
  shelf,
}: {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
  shelf?: PublicSelectionShelf | null;
}) {
  return (
    <Suspense
      fallback={
        <ProducerSelectionExplorerView
          selection={selection}
          messages={messages}
          shelf={shelf}
          selectedKey=""
        />
      }
    >
      <ProducerSelectionExplorerFromSearchParams
        shelf={shelf}
        selection={selection}
        messages={messages}
      />
    </Suspense>
  );
}
