"use client";

import { useCallback, useState } from "react";
import { useMap } from "react-leaflet";
import { CircleNotchIcon, NavigationArrowIcon } from "@phosphor-icons/react";
import {
  requestVisitorPosition,
  useVisitorPosition,
  type VisitorPosition,
} from "@/lib/location/visitor-position";

function motionIsReduced(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type MapLocateControlProps = {
  label?: string;
  locatingLabel?: string;
  onLocateSuccess?: (position: VisitorPosition) => void;
};

export function MapLocateControl({
  label = "Centrar en mi ubicación",
  locatingLabel = "Localizando…",
  onLocateSuccess,
}: MapLocateControlProps) {
  const map = useMap();
  const currentPosition = useVisitorPosition();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = useCallback(async () => {
    if (isLocating) return;

    if (currentPosition) {
      const targetZoom = Math.max(map.getZoom(), 13);
      if (motionIsReduced()) {
        map.setView([currentPosition.latitude, currentPosition.longitude], targetZoom, {
          animate: false,
        });
      } else {
        map.flyTo([currentPosition.latitude, currentPosition.longitude], targetZoom, {
          animate: true,
          duration: 0.35,
        });
      }
      onLocateSuccess?.(currentPosition);
      return;
    }

    setIsLocating(true);
    try {
      const position = await requestVisitorPosition();
      if (position) {
        const targetZoom = Math.max(map.getZoom(), 13);
        if (motionIsReduced()) {
          map.setView([position.latitude, position.longitude], targetZoom, {
            animate: false,
          });
        } else {
          map.flyTo([position.latitude, position.longitude], targetZoom, {
            animate: true,
            duration: 0.35,
          });
        }
        onLocateSuccess?.(position);
      }
    } finally {
      setIsLocating(false);
    }
  }, [currentPosition, isLocating, map, onLocateSuccess]);

  return (
    <div className="leaflet-top leaflet-right map-locate-container">
      <div className="leaflet-control map-locate-control">
        <button
          type="button"
          className={`map-locate-btn ${currentPosition ? "map-locate-btn--active" : ""} ${isLocating ? "map-locate-btn--locating" : ""}`}
          onClick={handleLocate}
          disabled={isLocating}
          aria-label={isLocating ? locatingLabel : label}
          title={isLocating ? locatingLabel : label}
        >
          {isLocating ? (
            <CircleNotchIcon
              className="map-locate-spinner"
              size={20}
              aria-hidden="true"
            />
          ) : (
            <NavigationArrowIcon
              className="map-locate-icon"
              size={20}
              weight={currentPosition ? "fill" : "regular"}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </div>
  );
}
