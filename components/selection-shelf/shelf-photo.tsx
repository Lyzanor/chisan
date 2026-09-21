"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProducerSelectionItem } from "@/lib/producer-selections";
import type { PublicSelectionShelf } from "@/lib/selection-shelf/policy";
import styles from "./shelf.module.css";

export function ShelfPhoto({
  shelf,
  selectedKey,
  selectedProducer,
  onSelectKey,
  onViewMap,
}: {
  shelf: PublicSelectionShelf;
  selectedKey?: string;
  selectedProducer?: ProducerSelectionItem | null;
  onSelectKey: (key: string) => void;
  onViewMap?: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const selectedPoints = shelf.points.filter((point) => point.producerKey === selectedKey);
  const selectedLabels = [...new Set(selectedPoints.map((point) => point.label))];

  return (
    <section className={styles.photoSection} aria-label="Productos en la estantería">
      <div className={styles.photoHeading}>
        <h2>En la estantería</h2>
        <button
          type="button"
          className="account-button account-button--secondary"
          aria-pressed={zoomed}
          onClick={() => setZoomed(!zoomed)}
        >
          {zoomed ? "Reducir foto" : "Ampliar foto"}
        </button>
      </div>
      <p className={styles.hint}>Toca un punto de la foto o un productor del mapa para conectarlos.</p>
      <div
        className={styles.photoViewport}
        tabIndex={zoomed ? 0 : undefined}
        aria-label={zoomed ? "Foto ampliada; desplázate para explorar" : undefined}
      >
        <div className={styles.photoCanvas} style={{ width: zoomed ? "200%" : "100%" }}>
          <Image
            unoptimized
            src={shelf.imageSrc}
            width={shelf.width}
            height={shelf.height}
            alt="Estantería fotografiada por el titular de esta selección"
            className={styles.image}
          />
          {shelf.points.map((point, index) => {
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
                aria-label={`${point.label}. Ver su productor en el mapa`}
                aria-pressed={isSelected}
                onClick={() => {
                  if (isSelected && onViewMap) {
                    onViewMap();
                  } else {
                    onSelectKey(point.producerKey);
                  }
                }}
              >
                <span>{index + 1}</span>
              </button>
            );
          })}
        </div>
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
                {selectedLabels.length ? selectedLabels.join(" · ") : "En la estantería"}
              </div>
            </div>
          </div>
          {onViewMap ? (
            <button
              type="button"
              className={styles.viewOnMapButton}
              onClick={onViewMap}
              aria-label={`Ver ${selectedProducer.name} en el mapa`}
            >
              <span>Ver en mapa</span>
              <span aria-hidden="true">📍</span>
            </button>
          ) : null}
        </div>
      ) : (
        <p className={styles.selection} aria-live="polite">
          {selectedKey
            ? "Este productor no tiene productos señalados en esta foto."
            : "Toca una botella señalada para ver su origen."}
        </p>
      )}

      <p className={styles.hint}>
        {shelf.preview ? "Propuesta pendiente de tu confirmación." : `Foto publicada el ${shelf.updatedOn}.`}{" "}
        La foto no indica existencias actuales.
      </p>
    </section>
  );
}

