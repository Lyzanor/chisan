"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  CompassIcon,
  CircleNotchIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { getAreaHighlightsAction } from "@/app/(application)/actividad/actions";
import type {
  ActivityAreaOption,
  ActivityFeaturedProducer,
} from "@/lib/activity/data";
import {
  createCatalogLocationRequest,
  LOCATION_ONBOARDING_STORAGE_KEY,
  type LocationFetch,
} from "@/lib/location/location-onboarding";
import {
  browserLocationStorage,
  useLocationOnboardingState,
} from "@/lib/location/saved-location-area";
import styles from "./activity.module.css";

type ActivityZoneDiscoveryProps = {
  availableAreas: ActivityAreaOption[];
  initialFeaturedProducers: ActivityFeaturedProducer[];
};

export function ActivityZoneDiscovery({
  availableAreas,
  initialFeaturedProducers,
}: ActivityZoneDiscoveryProps) {
  const stored = useLocationOnboardingState();
  const [producers, setProducers] = useState<ActivityFeaturedProducer[]>(
    initialFeaturedProducers,
  );
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  // Covers a choice made where browser storage is unavailable.
  const [selectedArea, setSelectedArea] = useState<{
    country: string;
    area: string;
  } | null>(null);

  const activeArea =
    (stored?.onboarding === "resolved" ? stored.area : null) ?? selectedArea;
  // The saved state is a fresh object on every render; effects key on its values.
  const activeCountry = activeArea?.country;
  const activeAreaSlug = activeArea?.area;

  const currentAreaOption = availableAreas.find(
    (item) => item.country === activeCountry && item.slug === activeAreaSlug,
  );

  useEffect(() => {
    if (!activeCountry || !activeAreaSlug) return;

    // A plain call, not an async transition: a pending lookup must never hold
    // back a navigation the visitor starts from this page.
    let active = true;
    getAreaHighlightsAction(activeCountry, activeAreaSlug)
      .then((highlights) => {
        if (active && highlights.length > 0) setProducers(highlights);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [activeCountry, activeAreaSlug]);

  async function handleUseLocation() {
    if (locating) return;
    setLocating(true);
    setLocationError(null);

    try {
      const locationLookup = createCatalogLocationRequest({
        geolocation:
          typeof navigator !== "undefined" && navigator.geolocation
            ? navigator.geolocation
            : null,
        fetcher: window.fetch.bind(window) as LocationFetch,
      });

      const result = await locationLookup();
      if (result.status === "resolved") {
        const storage = browserLocationStorage();
        if (storage) {
          storage.setItem(
            LOCATION_ONBOARDING_STORAGE_KEY,
            JSON.stringify({
              onboarding: "resolved",
              area: { country: result.country, area: result.area },
            }),
          );
          window.dispatchEvent(
            new Event("chisan:location-onboarding-storage-change"),
          );
        }
        setSelectedArea({ country: result.country, area: result.area });
      } else {
        setLocationError("No se ha podido determinar tu zona automáticamente. Elige tu zona en la lista.");
      }
    } catch {
      setLocationError("Error al solicitar ubicación. Puedes seleccionarla manualmente.");
    } finally {
      setLocating(false);
    }
  }

  function handleSelectArea(slug: string) {
    if (!slug) return;
    const option = availableAreas.find((item) => item.slug === slug);
    if (!option) return;

    setSelectedArea({ country: option.country, area: option.slug });
    setLocationError(null);

    const storage = browserLocationStorage();
    if (storage) {
      storage.setItem(
        LOCATION_ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          onboarding: "resolved",
          area: { country: option.country, area: option.slug },
        }),
      );
      window.dispatchEvent(
        new Event("chisan:location-onboarding-storage-change"),
      );
    }
  }

  return (
    <section className={styles.section} data-reveal aria-labelledby="zone-discovery-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className="chisan-eyebrow">En tu territorio</p>
          <h2 id="zone-discovery-title">
            {currentAreaOption
              ? `Destacados en ${currentAreaOption.label}`
              : "Destacados editoriales"}
          </h2>
        </div>
        {currentAreaOption ? (
          <Link
            href={`/es/${encodeURIComponent(currentAreaOption.slug)}`}
            className="chisan-link"
          >
            Ver mapa de {currentAreaOption.label} <ArrowUpRightIcon className="chisan-arrow" size={16} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <div className={styles.locationBar}>
        <div className={styles.locationInfo}>
          <MapPinIcon size={20} aria-hidden="true" />
          {currentAreaOption ? (
            <span>
              Zona activa: <strong>{currentAreaOption.label}</strong> ({currentAreaOption.region})
            </span>
          ) : (
            <span>Explora los productores recomendados de tu comarca o provincia</span>
          )}
        </div>

        <div className={styles.locationActions}>
          <button
            type="button"
            className="chisan-button chisan-button--primary"
            onClick={handleUseLocation}
            disabled={locating}
            aria-label="Usar mi ubicación actual"
          >
            {locating ? (
              <>
                <CircleNotchIcon size={18} className="chisan-spin" aria-hidden="true" />
                <span>Ubicando...</span>
              </>
            ) : (
              <>
                <CompassIcon size={18} aria-hidden="true" />
                <span>Usar mi ubicación</span>
              </>
            )}
          </button>

          <label className="visually-hidden" htmlFor="activity-area-select">
            Cambiar zona
          </label>
          <select
            id="activity-area-select"
            className={styles.selectorDropdown}
            value={currentAreaOption?.slug ?? ""}
            onChange={(e) => handleSelectArea(e.target.value)}
          >
            <option value="" disabled>
              Elegir otra zona...
            </option>
            {availableAreas.map((area) => (
              <option key={`${area.country}:${area.slug}`} value={area.slug}>
                {area.label} ({area.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      {locationError ? (
        <p className={styles.producerCity} style={{ color: "var(--chisan-color-stone)" }}>
          {locationError}
        </p>
      ) : null}

      <div className={styles.producersGrid} data-reveal-stagger>
        {producers.map((producer) => (
          <Link
            key={`${producer.country}:${producer.producerId}`}
            href={producer.href}
            className={`chisan-card ${styles.producerCard}`}
          >
            {producer.imageSrc ? (
              <Image
                src={producer.imageSrc}
                alt={producer.name}
                width={360}
                height={200}
                className={styles.producerCardImage}
              />
            ) : (
              <div className={styles.producerCardImage} />
            )}
            <div className={styles.producerCardBody}>
              <span className={styles.producerCategory}>{producer.category}</span>
              <h3 className={styles.producerName}>{producer.name}</h3>
              <span className={styles.producerCity}>{producer.city}</span>
              {producer.featuredProducts ? (
                <p className={styles.producerProducts}>{producer.featuredProducts}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
