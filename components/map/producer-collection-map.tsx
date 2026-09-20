"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { CatalogResultsSheet } from "@/components/catalog-results-sheet";
import { getCatalogSearchMessages } from "@/lib/i18n/catalog-search";
import type { Locale } from "@/lib/i18n/locales";
import { hasProducerSelectionCoordinates, type ProducerMapMarker, type ProducerSelectionItem } from "@/lib/producer-selections";
import { ProducerMapCarousel } from "./producer-map-carousel";
import { ProducerMapRosterRow } from "./producer-map-roster-row";
import { ProducerSelectionMap, type MapMessages, type ProducerMapFocusRequest } from "./producers-map";
import { useDismissibleProducerMapSelection } from "./use-dismissible-producer-map-selection";

/** The same cards, sheet and roster in guides, profiles and reviewed selections. */
export function ProducerCollectionMap({ items, selectedKey, onSelect, onClear, initialFocusKeys, messages, locale = "es", relatedSurfaceRef }: {
  items: ProducerSelectionItem[]; selectedKey: string; onSelect: (key: string) => void; onClear: () => void;
  initialFocusKeys?: string[]; messages: MapMessages & { producerMap: string }; locale?: Locale;
  relatedSurfaceRef?: RefObject<HTMLElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState<ProducerMapFocusRequest>();
  const focusId = useRef(0);
  const root = useRef<HTMLElement>(null);
  const mapSurface = useRef<HTMLDivElement>(null);
  const selectedLink = useRef<HTMLAnchorElement>(null);
  const selectedRow = useRef<HTMLLIElement>(null);
  const labels = getCatalogSearchMessages(locale);
  const points = useMemo(() => items.flatMap((item): ProducerMapMarker[] => hasProducerSelectionCoordinates(item)
    ? [{ ...item, latitude: item.latitude, longitude: item.longitude }] : []), [items]);
  const selected = items.find((item) => item.key === selectedKey);
  const presented = selected ?? items[0];
  const selectedFocus = useMemo<ProducerMapFocusRequest | undefined>(() => selected
    ? focusRequest?.key === selected.key ? focusRequest : { key: selected.key, requestId: 0, behavior: "select" }
    : undefined, [selected, focusRequest]);

  const clear = useCallback(() => { setFocusRequest(undefined); onClear(); }, [onClear]);
  useDismissibleProducerMapSelection({ active: Boolean(selected), selectedSurfaceRef: selectedLink,
    relatedSurfaceRef: relatedSurfaceRef ?? root, returnFocusRef: mapSurface, suspendEscape: open, onDismiss: clear });

  function requestFocus(key: string) {
    setFocusRequest(points.some((point) => point.key === key)
      ? { key, requestId: ++focusId.current, behavior: "select" } : undefined);
  }
  function choose(key: string) { requestFocus(key); onSelect(key); }

  useEffect(() => {
    const row = selectedRow.current;
    const body = row?.closest<HTMLElement>(".catalog-viewer-body");
    if (!row || !body) return;
    let pending = true;
    const reveal = () => {
      if (!pending || body.clientHeight < row.offsetHeight || !row.offsetHeight) return;
      const bounds = body.getBoundingClientRect(), item = row.getBoundingClientRect();
      if (item.top < bounds.top) body.scrollTop += item.top - bounds.top;
      else if (item.bottom > bounds.bottom) body.scrollTop += item.bottom - bounds.bottom;
      pending = false;
    };
    const observer = new ResizeObserver(() => { pending = true; reveal(); });
    observer.observe(body);
    const frame = requestAnimationFrame(reveal);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [selected, open]);

  return <section ref={root} className={`catalog-simple-layout producer-map-explorer producer-map-explorer--embedded${open ? " is-list-open" : ""}`}>
    <div className="producer-map-stage">
      <div ref={mapSurface} className="catalog-simple-map" tabIndex={-1} aria-label={messages.producerMap}>
        <ProducerSelectionMap points={points} selectedKey={presented?.key} focusRequest={selectedFocus} focusPaddingBottom={180}
          initialFocusKeys={initialFocusKeys} onSelectKey={choose} messages={messages} />
      </div>
      {items.length ? <ProducerMapCarousel items={items} activeKey={presented?.key} onSelect={choose} onInteract={() => {}} labels={labels} linkRef={selectedLink} /> : null}
    </div>
    <CatalogResultsSheet open={open} onOpenChange={setOpen} title={labels.carousel}
      label={labels.viewList.replace("{count}", new Intl.NumberFormat(locale).format(items.length))} closeLabel={labels.backToMap}>
      {items.length ? <ul className="producer-compact-list">
        {items.map((item) => <ProducerMapRosterRow key={item.key} item={item} active={presented?.key === item.key}
          itemRef={selected?.key === item.key ? selectedRow : undefined} locale={locale}>
          <strong>{item.name}</strong>
          {item.city ? <small className="producer-compact-location">{item.city}</small> : null}
          {item.description ? <small>{item.description}</small> : null}
        </ProducerMapRosterRow>)}
      </ul> : <p className="catalog-empty">{messages.emptyCoordinates}</p>}
    </CatalogResultsSheet>
  </section>;
}
