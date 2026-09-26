"use client";

import Image from "next/image";
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { imageTouchTargets, type AnnotatedProducerImage, type ImagePlacement } from "@/lib/annotated-producer-image";
import styles from "./producer-selection-explorer.module.css";

export function AnnotatedProducerImageView({ image, placements, selectedIds, focusId, isPlan, onChoose }: {
  image: AnnotatedProducerImage;
  placements: ImagePlacement[];
  selectedIds: string[];
  focusId: string;
  isPlan: boolean;
  onChoose: (placements: ImagePlacement[]) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(isPlan ? 3 : 1);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const position = useRef({ x: 0.5, y: 0.5 });
  const hasMeasured = useRef(false);
  const selected = placements.filter((group) => selectedIds.includes(group.id));
  const selectedId = selected.length === 1 ? selected[0].id : "";
  const ratio = image.height / image.width;
  const baseWidth = size.width ? Math.min(size.width, Math.max(size.height, 160) / ratio) : image.width;
  const spanX = selected.length > 1 ? Math.max(...selected.map((p) => p.x)) - Math.min(...selected.map((p) => p.x)) + 0.15 : 1;
  const spanY = selected.length > 1 ? Math.max(...selected.map((p) => p.y)) - Math.min(...selected.map((p) => p.y)) + 0.15 : 1;
  const visibleZoom = selected.length > 1 && size.width ? Math.max(1, Math.min(zoom, size.width / (baseWidth * spanX), size.height / (baseWidth * ratio * spanY))) : zoom;
  const canvasWidth = baseWidth * visibleZoom;
  const canvasHeight = canvasWidth * ratio;
  const targets = (() => {
    const groups = imageTouchTargets(placements, canvasWidth, canvasHeight);
    const active = placements.find((group) => group.id === selectedId);
    if (!active) return groups;
    // The selected pin stays on its exact position, never on a cluster centroid.
    return [...groups.filter((target) => !target.groups.includes(active)
      && !(Math.abs(target.x - active.x) * canvasWidth < 44 && Math.abs(target.y - active.y) * canvasHeight < 44)),
      { id: active.id, x: active.x, y: active.y, groups: [active] }];
  })();
  const focus = selected.length ? selected : isPlan ? placements : [];
  const focusX = focus.length ? (Math.min(...focus.map((p) => p.x)) + Math.max(...focus.map((p) => p.x))) / 2 : 0.5;
  const focusY = focus.length ? (Math.min(...focus.map((p) => p.y)) + Math.max(...focus.map((p) => p.y))) / 2 : 0.5;

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setSize({ width: element.clientWidth, height: element.clientHeight }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element || !size.width) return;
    if (!hasMeasured.current) {
      position.current = { x: focusX, y: focusY };
      hasMeasured.current = true;
    }
    element.scrollTo({ left: position.current.x * canvasWidth - element.clientWidth / 2,
      top: position.current.y * canvasHeight - element.clientHeight / 2, behavior: "instant" });
  }, [canvasWidth, canvasHeight, focusX, focusY, size.width]);

  useEffect(() => {
    const element = viewport.current;
    const drawing = element?.firstElementChild as HTMLElement | null;
    if (!element || !drawing) return;
    position.current = { x: focusX, y: focusY };
    element.scrollTo({ left: focusX * drawing.clientWidth - element.clientWidth / 2,
      top: focusY * drawing.clientHeight - element.clientHeight / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [focusId, focusX, focusY]);

  return <div className={styles.imageSurface}>
    <div ref={viewport} className={styles.imageViewport} onScroll={(event) => {
      const element = event.currentTarget;
      position.current = { x: (element.scrollLeft + element.clientWidth / 2 - Math.max(0, (element.clientWidth - canvasWidth) / 2)) / canvasWidth,
        y: (element.scrollTop + element.clientHeight / 2) / canvasHeight };
    }} tabIndex={0} aria-label={isPlan ? "Plano; amplía y desplázate para explorar" : "Imagen; amplía y desplázate para explorar"}>
      <div className={styles.imageCanvas} style={{ width: size.width ? `${canvasWidth}px` : "100%" }}>
        <Image unoptimized src={image.imageSrc} alt={image.alt ?? "Productos fotografiados para esta selección"} width={image.width} height={image.height} className={styles.image} />
        {size.width > 0 ? targets.map((target) => {
          const single = target.groups.length === 1 ? target.groups[0] : undefined;
          const label = single ? isPlan ? `Puesto ${single.marker}` : single.points.map((point) => point.label).join(" · ") : `${target.groups.length} posiciones próximas; elegir`;
          return <button key={target.id} type="button" className={styles.point}
            style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
            aria-label={label} aria-pressed={target.groups.some((group) => selectedIds.includes(group.id))}
            onClick={() => onChoose(target.groups)}>
            <span>{single?.marker ?? `${target.groups.length}×`}</span>
          </button>;
        }) : null}
      </div>
    </div>
    <div className={styles.zoomControls}>
      <button type="button" className="chisan-button" disabled={zoom <= 1} aria-label={isPlan ? "Alejar plano" : "Alejar imagen"} onClick={() => setZoom((value) => Math.max(1, value / 2))}><MagnifyingGlassMinusIcon size={20} aria-hidden="true" /></button>
      <button type="button" className="chisan-button" disabled={zoom >= 12} aria-label={isPlan ? "Acercar plano" : "Acercar imagen"} onClick={() => setZoom((value) => Math.min(12, value * 2))}><MagnifyingGlassPlusIcon size={20} aria-hidden="true" /></button>
    </div>
  </div>;
}
