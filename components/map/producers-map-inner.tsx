"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import chisanMapMarker from "@/design/brand/assets/chisan-map-marker.svg";
import {
  PRODUCER_SELECTION_MIN_ZOOM,
  type ProducerMapMarker,
} from "@/lib/producer-selections";

// Below this threshold, show all points regardless of viewport.
// Above it, filter by viewport to avoid rendering thousands of markers at once.
const VIEWPORT_THRESHOLD = 200;
const DEFAULT_MAP_CENTER: [number, number] = [40.42, -3.7];
const chisanMapMarkerSrc =
  typeof chisanMapMarker === "string" ? chisanMapMarker : chisanMapMarker.src;

function getPointsBounds(points: ProducerMapMarker[]): L.LatLngBounds | null {
  if (!points.length) {
    return null;
  }

  return L.latLngBounds(
    points.map((p) => [p.latitude, p.longitude] as [number, number]),
  );
}

function getInitialCenter(points: ProducerMapMarker[]): [number, number] {
  const bounds = getPointsBounds(points);
  if (!bounds) {
    return DEFAULT_MAP_CENTER;
  }

  const center = bounds.getCenter();
  return [center.lat, center.lng];
}

const producerPinIcon = L.divIcon({
  className: "producer-map-pin",
  html: `<span class="producer-map-pin-mark"><img src="${chisanMapMarkerSrc}" alt="" aria-hidden="true" /></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const producerPinHighlightedIcon = L.divIcon({
  className: "producer-map-pin producer-map-pin--highlighted",
  html: `<span class="producer-map-pin-mark"><img src="${chisanMapMarkerSrc}" alt="" aria-hidden="true" /></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function hasSamePointGeometry(
  previous: readonly ProducerMapMarker[],
  current: readonly ProducerMapMarker[],
): boolean {
  if (previous.length !== current.length) {
    return false;
  }

  return previous.every((point, index) => {
    const candidate = current[index];
    return (
      candidate !== undefined &&
      point.key === candidate.key &&
      point.latitude === candidate.latitude &&
      point.longitude === candidate.longitude
    );
  });
}

function BoundsAwareMarkers({
  points,
  highlightedKey,
  singlePointZoom = 13,
  messages,
}: {
  points: ProducerMapMarker[];
  highlightedKey?: string;
  singlePointZoom?: number;
  messages: {
    openProfile: string;
  };
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());
  const fittedViewRef = useRef<{
    points: readonly ProducerMapMarker[];
    singlePointZoom: number;
  } | null>(null);

  // Fit only when the effective geometry changes. Navigation state such as a
  // highlighted producer may rebuild props, but must preserve the user's pan
  // and zoom.
  useEffect(() => {
    if (points.length === 0) return;

    const fittedView = fittedViewRef.current;
    if (
      fittedView &&
      fittedView.singlePointZoom === singlePointZoom &&
      hasSamePointGeometry(fittedView.points, points)
    ) {
      fittedViewRef.current = { points, singlePointZoom };
      return;
    }
    fittedViewRef.current = { points, singlePointZoom };

    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], singlePointZoom, {
        animate: false,
      });
    } else if (points.length <= VIEWPORT_THRESHOLD) {
      const bounds = getPointsBounds(points);
      if (!bounds) return;

      map.fitBounds(bounds.pad(0.2), { animate: false });
    } else {
      const bounds = getPointsBounds(points);
      if (!bounds) return;

      map.fitBounds(bounds.pad(0.2), { animate: false, maxZoom: 10 });
    }
  }, [map, points, singlePointZoom]);

  // moveend fires after every pan and after every zoom (Leaflet always fires
  // moveend at the end of a zoom sequence), so zoomend is redundant here.
  useMapEvents({
    moveend: () => setViewBounds(map.getBounds()),
  });

  const visible = useMemo(
    () =>
      points.length > VIEWPORT_THRESHOLD
        ? points.filter((p) => viewBounds.contains([p.latitude, p.longitude]))
        : points,
    [points, viewBounds],
  );

  return (
    <>
      {visible.map((point) => (
        <Marker
          key={`${point.key}:${highlightedKey === point.key ? "selected" : "default"}`}
          position={[point.latitude, point.longitude]}
          icon={highlightedKey === point.key ? producerPinHighlightedIcon : producerPinIcon}
          title={point.name}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.city} · {point.categories.join(" · ")}
            <br />
            <Link href={point.href} prefetch={false}>
              {messages.openProfile}
            </Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function ProducersMapInner({
  points,
  highlightedKey,
  singlePointZoom = 13,
  minZoom = PRODUCER_SELECTION_MIN_ZOOM,
  messages,
  onReady,
}: {
  points: ProducerMapMarker[];
  highlightedKey?: string;
  singlePointZoom?: number;
  minZoom?: number;
  messages: {
    openProfile: string;
  };
  onReady: () => void;
}) {
  const initialCenter = getInitialCenter(points);
  const initialZoom = points.length === 1 ? singlePointZoom : 10;

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      minZoom={minZoom}
      className="producers-map-canvas"
      scrollWheelZoom
      whenReady={onReady}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsAwareMarkers
        points={points}
        highlightedKey={highlightedKey}
        singlePointZoom={singlePointZoom}
        messages={messages}
      />
    </MapContainer>
  );
}
