"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type Ref } from "react";
import { ProducerMapSelectionCard, type ProducerMapSelectionCardItem } from "./producer-map-selection-card";
import { catalogDescriptionPreview } from "@/lib/catalog-search";

/** Native scroll snapping, with only nearby slides mounted even for a country. */
export function ProducerMapCarousel({
  items, activeKey, onSelect, onInteract, labels, linkRef,
}: {
  items: readonly (ProducerMapSelectionCardItem & { key: string; city: string; areaLabel?: string; categoryLabels?: string[] })[];
  activeKey?: string;
  onSelect: (key: string) => void;
  onInteract: () => void;
  labels: { previousProducer: string; nextProducer: string; carousel: string };
  linkRef?: Ref<HTMLAnchorElement>;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncingRef = useRef(false);
  const [width, setWidth] = useState(0);
  const activeIndex = Math.max(0, items.findIndex((item) => item.key === activeKey));
  const [scrollPosition, setScrollPosition] = useState({ key: activeKey, index: activeIndex });
  const step = Math.max(1, width - 36);
  const cursor = scrollPosition.key === activeKey ? scrollPosition.index : activeIndex;
  const start = width ? Math.max(0, cursor - 3) : activeIndex;
  const end = width ? Math.min(items.length, cursor + 4) : activeIndex + 1;

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const observer = new ResizeObserver(() => setWidth(strip.clientWidth));
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !width || Math.abs(strip.scrollLeft - activeIndex * step) < 2) return;
    syncingRef.current = true;
    strip.scrollTo({ left: activeIndex * step, behavior: "instant" });
    const frame = requestAnimationFrame(() => { syncingRef.current = false; });
    return () => { cancelAnimationFrame(frame); syncingRef.current = false; };
  }, [activeIndex, step, width]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [items]);

  function moveBy(delta: number) {
    const next = items[activeIndex + delta];
    if (!next) return;
    onInteract();
    onSelect(next.key);
  }

  return (
    <section className="catalog-map-carousel" aria-label={labels.carousel} aria-roledescription="carousel">
      <div className="catalog-map-carousel__navigation">
        <button type="button" aria-label={labels.previousProducer} disabled={!activeIndex} onClick={() => moveBy(-1)}>
          <CaretLeftIcon size={18} aria-hidden="true" />
        </button>
        <span aria-live="polite" aria-atomic="true">{items[activeIndex]?.name}</span>
        <button type="button" aria-label={labels.nextProducer} disabled={activeIndex >= items.length - 1} onClick={() => moveBy(1)}>
          <CaretRightIcon size={18} aria-hidden="true" />
        </button>
      </div>
      <div
        className="catalog-map-carousel__strip"
        ref={stripRef}
        onPointerDown={onInteract}
        onWheel={onInteract}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          moveBy(event.key === "ArrowLeft" ? -1 : 1);
        }}
        onScroll={() => {
          if (syncingRef.current || !width) return;
          if (timerRef.current) clearTimeout(timerRef.current);
          const index = Math.min(items.length - 1, Math.max(0,
            Math.round((stripRef.current?.scrollLeft ?? 0) / step),
          ));
          setScrollPosition({ key: activeKey, index });
          timerRef.current = setTimeout(() => {
            if (syncingRef.current) return;
            const item = items[index];
            if (item && item.key !== activeKey) {
              onInteract();
              onSelect(item.key);
            }
          }, 100);
        }}
      >
        <div className="catalog-map-carousel__rail" style={{ width: width ? (items.length - 1) * step + width : "100%" }}>
          {items.slice(start, end).map((item, offset) => {
            const index = start + offset;
            return (
              <div className="catalog-map-carousel__slide" key={item.key}
                style={{ left: width ? 12 + index * step : 12, width: width ? step - 12 : "calc(100% - 48px)" }}
                aria-current={item.key === activeKey ? "true" : undefined}>
                <ProducerMapSelectionCard
                  linkRef={item.key === activeKey ? linkRef : undefined}
                  tabIndex={index === activeIndex ? 0 : -1}
                  producer={{ ...item, description: catalogDescriptionPreview(item.description),
                    location: [item.city, item.areaLabel].filter(Boolean).join(" · "),
                    categoryLabel: item.categoryLabels?.[0] }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
