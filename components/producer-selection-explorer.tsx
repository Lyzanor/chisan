"use client";

import Link from "next/link";
import type { PublicSelectionShelf } from "@/lib/selection-shelf/policy";
import { ShelfPhoto } from "@/components/selection-shelf/shelf-photo";
import shelfStyles from "@/components/selection-shelf/shelf.module.css";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ProducerSelectionMap,
  type MapMessages,
  type ProducerMapFocusRequest,
} from "@/components/map/producers-map";
import { ProducerMapSelectionCard } from "@/components/map/producer-map-selection-card";
import { useDismissibleProducerMapSelection } from "@/components/map/use-dismissible-producer-map-selection";
import {
  buildProducerSelectionHighlightHref,
  hasProducerSelectionCoordinates,
  resolveProducerSelectionItem,
  type ProducerMapMarker,
  type ProducerSelectionExplorerModel,
} from "@/lib/producer-selections";

const PRODUCER_SELECTION_LIST_ID = "profile-producer-selection-list";

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
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [mapFocusRequest, setMapFocusRequest] =
    useState<ProducerMapFocusRequest>();
  const mapFocusRequestId = useRef(0);
  const previousSelectedKey = useRef("");
  const selectedProducerLinkRef = useRef<HTMLAnchorElement>(null);
  const listToggleRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const combinedRef = useRef<HTMLElement>(null);
  const mapSurfaceRef = useRef<HTMLDivElement>(null);
  const focusSelectedProducerAfterCloseRef = useRef(false);
  const markers = useMemo(
    () =>
      selection.items.flatMap((item): ProducerMapMarker[] => {
        if (!hasProducerSelectionCoordinates(item)) return [];

        return [
          {
            key: item.key,
            href: item.href,
            name: item.name,
            city: item.city,
            icon: item.icon,
            categories: item.categories,
            latitude: item.latitude,
            longitude: item.longitude,
          },
        ];
      }),
    [selection.items],
  );
  const mappedKeys = useMemo(
    () => new Set(markers.map(({ key }) => key)),
    [markers],
  );
  const selectedItem = useMemo(() => {
    const item = resolveProducerSelectionItem(selection.items, selectedKey);
    return item && (mappedKeys.has(item.key) || shelf?.points.some((point) => point.producerKey === item.key)) ? item : undefined;
  }, [mappedKeys, selectedKey, selection.items, shelf]);
  const clearSelectionHref = buildProducerSelectionHighlightHref(
    selection.canonicalPath,
    "",
  );

  const clearProducerSelection = useCallback(() => {
    setMapFocusRequest(undefined);
    replaceSelectionState(clearSelectionHref);
  }, [clearSelectionHref]);

  useDismissibleProducerMapSelection({
    active: Boolean(selectedItem),
    selectedSurfaceRef: selectedProducerLinkRef,
    relatedSurfaceRef: shelf ? combinedRef : viewerRef,
    returnFocusRef: mapSurfaceRef,
    suspendEscape: isMobileListOpen,
    onDismiss: clearProducerSelection,
  });

  function requestProducerFocus(key: string) {
    mapFocusRequestId.current += 1;
    setMapFocusRequest({
      key,
      requestId: mapFocusRequestId.current,
      behavior: "select",
    });
  }

  function selectProducer(key: string, closeMobileList = false) {
    if (!selection.items.some((item) => item.key === key)) return;

    previousSelectedKey.current = key;
    if (mappedKeys.has(key)) requestProducerFocus(key);
    else setMapFocusRequest(undefined);
    pushSelectionState(
      buildProducerSelectionHighlightHref(selection.canonicalPath, key),
    );

    if (closeMobileList && window.matchMedia("(max-width: 980px)").matches) {
      focusSelectedProducerAfterCloseRef.current = true;
      setIsMobileListOpen(false);
    }
  }

  useEffect(() => {
    if (!selectedItem || previousSelectedKey.current === selectedItem.key) {
      previousSelectedKey.current = selectedItem?.key ?? "";
      return;
    }

    previousSelectedKey.current = selectedItem.key;
    if (mappedKeys.has(selectedItem.key)) requestProducerFocus(selectedItem.key);
  }, [mappedKeys, selectedItem]);

  useEffect(() => {
    if (
      !focusSelectedProducerAfterCloseRef.current ||
      isMobileListOpen ||
      !selectedItem
    ) {
      return;
    }

    focusSelectedProducerAfterCloseRef.current = false;
    window.requestAnimationFrame(() =>
      selectedProducerLinkRef.current?.focus({ preventScroll: true }),
    );
  }, [isMobileListOpen, selectedItem]);

  useEffect(() => {
    if (!isMobileListOpen) return;

    function closeListFromOutside(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (viewerRef.current?.contains(target)) return;
      setIsMobileListOpen(false);
    }

    function closeListFromKeyboard(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsMobileListOpen(false);
      listToggleRef.current?.focus();
    }

    // Finish the outside activation before collapsing the roster: otherwise
    // controls below it move away between pointerdown and click.
    document.addEventListener("click", closeListFromOutside);
    document.addEventListener("keydown", closeListFromKeyboard);
    return () => {
      document.removeEventListener("click", closeListFromOutside);
      document.removeEventListener("keydown", closeListFromKeyboard);
    };
  }, [isMobileListOpen]);

  return (
    <section ref={combinedRef} className={`catalog-simple-layout producer-selection-page__layout ${shelf ? shelfStyles.combined : ""}`}>
      <div className="producer-map-stage">
        <div
          ref={mapSurfaceRef}
          className="catalog-simple-map"
          aria-label={messages.map.producerMap}
          tabIndex={-1}
        >
          <ProducerSelectionMap
            points={markers}
            selectedKey={selectedItem?.key}
            focusRequest={mapFocusRequest}
            initialFocusKeys={selection.initialFocusKeys}
            onSelectKey={selectProducer}
            messages={messages.map}
          />
        </div>

        <div
          className="producer-map-selection-surface"
          aria-live="polite"
          aria-atomic="true"
        >
          {selectedItem && shelf ? (
            <Link ref={selectedProducerLinkRef} href={selectedItem.href} className={shelfStyles.selectedProducer}>
              <strong>{selectedItem.name}</strong><span>Ver productor →</span>
            </Link>
          ) : selectedItem ? (
            <ProducerMapSelectionCard
              linkRef={selectedProducerLinkRef}
              producer={selectedItem}
            />
          ) : null}
        </div>
      </div>

      {shelf ? <ShelfPhoto shelf={shelf} selectedKey={selectedItem?.key} onSelectKey={selectProducer} /> : null}

      <aside
        ref={viewerRef}
        className={`catalog-viewer ${isMobileListOpen ? "is-mobile-open" : ""}`}
        aria-label={messages.producers}
      >
        <button
          ref={listToggleRef}
          type="button"
          className="catalog-viewer-toggle"
          aria-expanded={isMobileListOpen}
          aria-controls={PRODUCER_SELECTION_LIST_ID}
          onClick={() => setIsMobileListOpen((isOpen) => !isOpen)}
        >
          {messages.producers}
        </button>

        <div
          id={PRODUCER_SELECTION_LIST_ID}
          className="catalog-viewer-body"
          role="region"
          aria-label={messages.producers}
        >
          <div className="catalog-viewer-head">
            <h2>{messages.producers}</h2>
            <p>{messages.countLabels[String(selection.items.length)]}</p>
          </div>

          <ul className="producer-compact-list">
            {selection.items.map((item) => {
              const isMapped = mappedKeys.has(item.key) || Boolean(shelf?.points.some((point) => point.producerKey === item.key));
              const href = isMapped
                ? buildProducerSelectionHighlightHref(
                    selection.canonicalPath,
                    item.key,
                  )
                : item.href;

              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    prefetch={false}
                    scroll={isMapped ? false : undefined}
                    onNavigate={
                      isMapped
                        ? (event) => {
                            event.preventDefault();
                            selectProducer(item.key, true);
                          }
                        : undefined
                    }
                    className="producer-compact-link"
                    aria-current={
                      selectedItem?.key === item.key ? true : undefined
                    }
                  >
                    <span className="producer-compact-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      {item.city ? (
                        <small className="producer-compact-location">
                          {item.city}
                        </small>
                      ) : null}
                      {item.description ? (
                        <small>{item.description}</small>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
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
