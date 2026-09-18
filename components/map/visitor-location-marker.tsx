"use client";

import { memo, useMemo } from "react";
import L from "leaflet";
import { Circle, Marker, Tooltip } from "react-leaflet";
import type { VisitorPosition } from "@/lib/location/visitor-position";

const visitorLocatorIconCache = new Map<string, L.DivIcon>();

function getVisitorLocatorIcon(label: string): L.DivIcon {
  const cached = visitorLocatorIconCache.get(label);
  if (cached) return cached;

  const icon = L.divIcon({
    className: "chisan-visitor-locator-container",
    html: `
      <div class="chisan-visitor-locator" aria-label="${label}" role="img">
        <div class="chisan-visitor-locator__pulse"></div>
        <div class="chisan-visitor-locator__dot"></div>
      </div>
    `.trim(),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  visitorLocatorIconCache.set(label, icon);
  return icon;
}

export type VisitorLocationMarkerProps = {
  position: VisitorPosition;
  label?: string;
};

export const VisitorLocationMarker = memo(function VisitorLocationMarker({
  position,
  label = "Tu ubicación",
}: VisitorLocationMarkerProps) {
  const icon = useMemo(() => getVisitorLocatorIcon(label), [label]);
  const showAccuracyCircle =
    typeof position.accuracyMeters === "number" &&
    position.accuracyMeters > 0 &&
    position.accuracyMeters <= 1000;

  return (
    <>
      {showAccuracyCircle ? (
        <Circle
          center={[position.latitude, position.longitude]}
          radius={position.accuracyMeters!}
          className="chisan-visitor-accuracy"
          pathOptions={{
            stroke: false,
            fillColor: "var(--chisan-color-sky, #3b82f6)",
            fillOpacity: 0.1,
            interactive: false,
          }}
        />
      ) : null}
      <Marker
        position={[position.latitude, position.longitude]}
        icon={icon}
        zIndexOffset={600}
        interactive
      >
        <Tooltip
          className="producer-map-tooltip"
          direction="top"
          offset={[0, -12]}
          opacity={0.98}
        >
          <span className="producer-map-tooltip__content">
            <strong>{label}</strong>
          </span>
        </Tooltip>
      </Marker>
    </>
  );
});
