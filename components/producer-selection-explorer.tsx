"use client";

import Link from "next/link";
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
  resolveProducerSelectionItem,
  type ProducerMapMarker,
  type ProducerSelectionExplorerModel,
} from "@/lib/producer-selections";

const PRODUCER_SELECTION_LIST_ID = "profile-producer-selection-list";

export type ProducerSelectionExplorerMessages = {
  producers: string;
  emptyGroup: string;
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
  selectedKey,
}: {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
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
  const mapSurfaceRef = useRef<HTMLDivElement>(null);
  const focusSelectedProducerAfterCloseRef = useRef(false);
  const markers = useMemo(
    () =>
      selection.items.flatMap((item): ProducerMapMarker[] => {
        if (item.latitude === null || item.longitude === null) return [];
        if (item.latitude === 0 && item.longitude === 0) return [];

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
  const itemsByKey = useMemo(
    () => new Map(selection.items.map((item) => [item.key, item])),
    [selection.items],
  );
  const selectedItem = useMemo(() => {
    const item = resolveProducerSelectionItem(selection.items, selectedKey);
    return item && mappedKeys.has(item.key) ? item : undefined;
  }, [mappedKeys, selectedKey, selection.items]);
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
    relatedSurfaceRef: viewerRef,
    returnFocusRef: mapSurfaceRef,
    suspendEscape: isMobileListOpen,
    onDismiss: clearProducerSelection,
  });

  function requestProducerFocus(key: string) {
    mapFocusRequestId.current += 1;
    setMapFocusRequest({ key, requestId: mapFocusRequestId.current });
  }

  function selectProducer(key: string, closeMobileList = false) {
    if (!mappedKeys.has(key)) return;

    previousSelectedKey.current = key;
    requestProducerFocus(key);
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
    requestProducerFocus(selectedItem.key);
  }, [selectedItem]);

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

    function closeListFromOutside(event: PointerEvent) {
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

    document.addEventListener("pointerdown", closeListFromOutside);
    document.addEventListener("keydown", closeListFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeListFromOutside);
      document.removeEventListener("keydown", closeListFromKeyboard);
    };
  }, [isMobileListOpen]);

  return (
    <section className="catalog-simple-layout producer-selection-page__layout">
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
          {selectedItem ? (
            <ProducerMapSelectionCard
              linkRef={selectedProducerLinkRef}
              producer={selectedItem}
            />
          ) : null}
        </div>
      </div>

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

          <div className="producer-selection-groups">
            {selection.sections.map((section) => {
              const sectionItems = section.itemKeys.flatMap((key) => {
                const item = itemsByKey.get(key);
                return item ? [item] : [];
              });

              return (
                <section
                  key={section.key}
                  className="producer-selection-group"
                  aria-labelledby={`producer-selection-${section.key}`}
                >
                  <header className="producer-selection-group__heading">
                    <div>
                      <h3 id={`producer-selection-${section.key}`}>
                        {section.title}
                      </h3>
                      <p>{section.summary}</p>
                    </div>
                    <span>
                      {messages.countLabels[String(sectionItems.length)]}
                    </span>
                  </header>
                  {sectionItems.length ? (
                    <ul className="producer-compact-list">
                      {sectionItems.map((item) => {
                        const isMapped = mappedKeys.has(item.key);
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
                                selectedItem?.key === item.key
                                  ? true
                                  : undefined
                              }
                            >
                              <span
                                className="producer-compact-icon"
                                aria-hidden="true"
                              >
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
                  ) : (
                    <p className="producer-selection-group__empty">
                      {messages.emptyGroup}
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </aside>
    </section>
  );
}

function ProducerSelectionExplorerFromSearchParams({
  selection,
  messages,
}: {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
}) {
  const searchParams = useSearchParams();
  const selectedKey = searchParams.get("highlight")?.trim() ?? "";

  return (
    <ProducerSelectionExplorerView
      selection={selection}
      messages={messages}
      selectedKey={selectedKey}
    />
  );
}

export function ProducerSelectionExplorer({
  selection,
  messages,
}: {
  selection: ProducerSelectionExplorerModel;
  messages: ProducerSelectionExplorerMessages;
}) {
  return (
    <Suspense
      fallback={
        <ProducerSelectionExplorerView
          selection={selection}
          messages={messages}
          selectedKey=""
        />
      }
    >
      <ProducerSelectionExplorerFromSearchParams
        selection={selection}
        messages={messages}
      />
    </Suspense>
  );
}
