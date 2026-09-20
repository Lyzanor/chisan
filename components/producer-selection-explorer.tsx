"use client";

import { Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ProducerCollectionMap } from "@/components/map/producer-collection-map";
import type { MapMessages } from "@/components/map/producers-map";
import type { PublicSelectionShelf } from "@/lib/selection-shelf/policy";
import { ShelfPhoto } from "@/components/selection-shelf/shelf-photo";
import shelfStyles from "@/components/selection-shelf/shelf.module.css";
import { buildProducerSelectionHighlightHref, type ProducerSelectionExplorerModel } from "@/lib/producer-selections";

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

function ProducerSelectionExplorerView({ selection, messages, shelf, selectedKey }: {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
  shelf?: PublicSelectionShelf | null;
  selectedKey: string;
}) {
  const combinedRef = useRef<HTMLElement>(null);
  const selectProducer = useCallback((key: string) => {
    if (selection.items.some((item) => item.key === key))
      pushSelectionState(buildProducerSelectionHighlightHref(selection.canonicalPath, key));
  }, [selection.items, selection.canonicalPath]);
  const clearSelection = useCallback(() => {
    replaceSelectionState(buildProducerSelectionHighlightHref(selection.canonicalPath, ""));
  }, [selection.canonicalPath]);

  return <section ref={combinedRef} className={shelf ? shelfStyles.combined : undefined}>
    <ProducerCollectionMap items={selection.items} selectedKey={selectedKey} onSelect={selectProducer}
      onClear={clearSelection} initialFocusKeys={selection.initialFocusKeys} messages={messages.map} relatedSurfaceRef={combinedRef} />
    {shelf ? <ShelfPhoto shelf={shelf} selectedKey={selectedKey} onSelectKey={selectProducer} /> : null}
  </section>;
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
