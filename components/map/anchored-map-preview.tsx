"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { positionMapPreview } from "@/lib/map-preview-position";

/** One card follows its point; no per-marker observers or extra map flights. */
export function AnchoredMapPreview({ point, children }: {
  point: { key: string; latitude: number; longitude: number };
  children: ReactNode;
}) {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const container = map.getContainer();
    let frame = 0;
    function updatePosition() {
      if (!card) return;
      const marker = map.latLngToContainerPoint([point.latitude, point.longitude]);
      const rect = container.getBoundingClientRect();
      const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
      const bounds = {
        left: 12,
        top: Math.max(12, headerBottom - rect.top + 12),
        right: rect.width - 12,
        bottom: Math.min(rect.height - 12, window.innerHeight - rect.top - 12),
      };
      // An offscreen marker must not acquire a misleading floating location.
      const visible = marker.x >= 0 && marker.x <= rect.width && marker.y >= bounds.top - 12 && marker.y <= bounds.bottom + 12;
      card.style.visibility = visible ? "visible" : "hidden";
      card.style.maxHeight = `${Math.max(0, bounds.bottom - bounds.top)}px`;
      const position = positionMapPreview(marker, { width: card.offsetWidth, height: card.offsetHeight }, bounds);
      card.style.transform = `translate3d(${position.left}px, ${position.top}px, 0)`;
      card.style.setProperty("--preview-tip-x", `${position.tip}px`);
      card.dataset.side = position.side;
    }
    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    }
    L.DomEvent.disableClickPropagation(card);
    L.DomEvent.disableScrollPropagation(card);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(card);
    observer.observe(container);
    map.on("move zoom resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    updatePosition();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      map.off("move zoom resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [map, point.key, point.latitude, point.longitude]);

  return <div ref={ref} className="producer-map-floating-card" style={{ visibility: "hidden" }}>{children}</div>;
}
