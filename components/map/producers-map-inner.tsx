"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { buildProducerHref, type CatalogNavigationScope } from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";

// Below this threshold, show all points regardless of viewport.
// Above it, filter by viewport to avoid rendering thousands of markers at once.
const VIEWPORT_THRESHOLD = 200;
const DEFAULT_MAP_CENTER: [number, number] = [40.42, -3.7];

function getPointsBounds(points: ProducerMapPoint[]): L.LatLngBounds | null {
  if (!points.length) {
    return null;
  }

  return L.latLngBounds(
    points.map((p) => [p.latitude, p.longitude] as [number, number]),
  );
}

function getInitialCenter(points: ProducerMapPoint[]): [number, number] {
  const bounds = getPointsBounds(points);
  if (!bounds) {
    return DEFAULT_MAP_CENTER;
  }

  const center = bounds.getCenter();
  return [center.lat, center.lng];
}

const producerPinIcon = L.divIcon({
  className: "producer-map-pin",
  html: '<span class="producer-map-pin-dot"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const producerPinHighlightedIcon = L.divIcon({
  className: "producer-map-pin producer-map-pin--highlighted",
  html: '<span class="producer-map-pin-dot producer-map-pin-dot--highlighted"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function BoundsAwareMarkers({
  points,
  scope,
  area,
  highlightedSlug,
  singlePointZoom = 13,
  messages,
}: {
  points: ProducerMapPoint[];
  scope: CatalogNavigationScope;
  area: string;
  highlightedSlug?: string;
  singlePointZoom?: number;
  messages: {
    openProfile: string;
  };
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());

  // Fit map to all points whenever the point set changes
  useEffect(() => {
    if (points.length === 0) return;

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

      const center = bounds.getCenter();
      map.setView([center.lat, center.lng], 10, { animate: false });
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
          key={point.slug}
          position={[point.latitude, point.longitude]}
          icon={highlightedSlug === point.slug ? producerPinHighlightedIcon : producerPinIcon}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.city} · {point.categories.join(" · ")}
            <br />
            <Link href={buildProducerHref(point, { scope, area })}>
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
  scope,
  area,
  highlightedSlug,
  singlePointZoom = 13,
  messages,
  onReady,
}: {
  points: ProducerMapPoint[];
  scope: CatalogNavigationScope;
  area: string;
  highlightedSlug?: string;
  singlePointZoom?: number;
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
      minZoom={5}
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
        scope={scope}
        area={area}
        highlightedSlug={highlightedSlug}
        singlePointZoom={singlePointZoom}
        messages={messages}
      />
    </MapContainer>
  );
}
