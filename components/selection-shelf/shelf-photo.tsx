"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProducerSelectionItem } from "@/lib/producer-selections";
import type { ShelfPoint } from "@/lib/selection-shelf/policy";
import styles from "./shelf.module.css";

export type AnnotatedProducerImage = {
  imageSrc: string;
  width: number;
  height: number;
  points: (ShelfPoint & { marker?: string })[];
  updatedOn?: string;
  preview?: boolean;
  alt?: string;
  note?: string;
};

export function AnnotatedProducerImageView({
  image,
  mode = "shelf",
  selectedKey,
  selectedProducer,
  onSelectKey,
  onViewMap,
}: {
  image: AnnotatedProducerImage;
  mode?: "shelf" | "event-plan";
  selectedKey?: string;
  selectedProducer?: ProducerSelectionItem | null;
  onSelectKey: (key: string) => void;
  onViewMap?: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const selectedPoints = image.points.filter((point) => point.producerKey === selectedKey);
  const selectedPoint = selectedPoints[0];
  const selectedLabels = [...new Set(selectedPoints.map((point) => point.label))];
  const isPlan = mode === "event-plan";
  const [zoomChoice, setZoomChoice] = useState(() => ({ key: selectedKey ?? "", value: isPlan && selectedPoint ? 4 : 1 }));
  const zoom = zoomChoice.key === (selectedKey ?? "") ? zoomChoice.value : isPlan && selectedPoint ? 4 : 1;
  const maxZoom = isPlan ? 8 : 2;

  useEffect(() => {
    const point = isPlan ? selectedPoint : undefined;
    if (!point || zoom === 1) return;
    const frame = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      viewport.scrollTo({
        left: point.x * viewport.scrollWidth - viewport.clientWidth / 2,
        top: point.y * viewport.scrollHeight - viewport.clientHeight / 2,
        behavior: "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [isPlan, selectedPoint, zoom]);

  return (
    <section className={styles.photoSection} aria-label={isPlan ? "Plano de expositores" : "Productos en la estantería"}>
      <div className={styles.photoViewportWrapper}>
        <div
          ref={viewportRef}
          className={`${styles.photoViewport} ${isPlan ? styles.planViewport : ""}`}
          tabIndex={zoom > 1 ? 0 : undefined}
          aria-label={zoom > 1 ? `${isPlan ? "Plano" : "Foto"} ampliado; desplázate para explorar` : undefined}
        >
          <div className={styles.photoCanvas} style={{ width: `${zoom * 100}%` }}>
            <Image
              unoptimized
              src={image.imageSrc}
              width={image.width}
              height={image.height}
              alt={image.alt ?? "Estantería fotografiada por el titular de esta selección"}
              className={styles.image}
            />
          {image.points.filter((point) => !isPlan || point.producerKey === selectedKey).map((point, index) => {
            const isSelected = point.producerKey === selectedKey;
            return (
              <button
                key={point.id}
                type="button"
                className={styles.point}
                style={{
                  left: `clamp(22px, ${point.x * 100}%, calc(100% - 22px))`,
                  top: `clamp(22px, ${point.y * 100}%, calc(100% - 22px))`,
                }}
                aria-label={isPlan ? `${point.label}. Ver dónde produce este expositor` : `${point.label}. Ver su productor en el mapa`}
                aria-pressed={isSelected}
                onClick={() => {
                  if (isSelected && onViewMap) {
                    onViewMap();
                  } else {
                    onSelectKey(point.producerKey);
                  }
                }}
              >
                <span>{point.marker ?? index + 1}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className={styles.zoomButton}
        aria-label={zoom === maxZoom ? `Reducir ${isPlan ? "plano" : "foto"}` : `Ampliar ${isPlan ? "plano" : "foto"}`}
        aria-pressed={zoom > 1}
        onClick={() => setZoomChoice({ key: selectedKey ?? "", value: zoom === maxZoom ? 1 : zoom * 2 })}
      >
        {zoom === maxZoom ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        )}
      </button>
    </div>

      {selectedProducer ? (
        <div className={styles.selectedProducerCard}>
          <div className={styles.selectedProducerInfo}>
            <span className={styles.selectedProducerIcon} aria-hidden="true">
              {selectedProducer.icon}
            </span>
            <div className={styles.selectedProducerDetails}>
              <div className={styles.selectedProducerNameRow}>
                <strong>{selectedProducer.name}</strong>
                {selectedProducer.city ? (
                  <span className={styles.selectedProducerCity}>· {selectedProducer.city}</span>
                ) : null}
              </div>
              <div className={styles.selectedProducerLabels}>
                {selectedLabels.length ? selectedLabels.join(" · ") : isPlan ? "En el plano" : "En la estantería"}
              </div>
            </div>
          </div>
          {onViewMap ? (
            <button
              type="button"
              className="chisan-button chisan-button--primary"
              onClick={onViewMap}
              aria-label={`Ver ${selectedProducer.name} en el mapa`}
            >
              <span>{isPlan ? "Ver origen" : "Ver en mapa"}</span>
              <span aria-hidden="true">📍</span>
            </button>
          ) : null}
        </div>
      ) : (
        <p className={styles.selection} aria-live="polite">
          {selectedKey
            ? isPlan ? "Este productor no tiene un puesto señalado en el plano." : "Este productor no tiene productos señalados en esta foto."
            : isPlan ? "Elige un expositor de la lista para señalar su puesto en el plano." : "Toca una botella señalada para ver su origen."}
        </p>
      )}

      <p className={styles.hint}>{isPlan
        ? image.note
        : <>{image.preview ? "Propuesta pendiente de tu confirmación." : `Foto publicada el ${image.updatedOn}.`} La foto no indica existencias actuales.</>}
      </p>
    </section>
  );
}
