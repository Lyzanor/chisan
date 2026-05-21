"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { buildProducerHref } from "@/lib/catalog-navigation";
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

function getInitialCenter(
  points: ProducerMapPoint[],
  userLocation?: { lat: number; lon: number },
): [number, number] {
  if (userLocation) {
    return [userLocation.lat, userLocation.lon];
  }

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

const userPinIcon = L.divIcon({
  className: "producer-map-pin user-map-pin",
  html: '<span class="producer-map-pin-dot user-map-pin-dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function BoundsAwareMarkers({
  points,
  province,
  highlightedSlug,
  userLocation,
}: {
  points: ProducerMapPoint[];
  province: string;
  highlightedSlug?: string;
  userLocation?: { lat: number; lon: number };
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());

  // Fit map to all points whenever the point set changes
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lon], 11, { animate: false });
      return;
    }

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 13, { animate: false });
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

  }, [map, points, userLocation]);

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
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lon]}
          icon={userPinIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <strong>Tu ubicación</strong>
          </Popup>
        </Marker>
      )}
      {visible.map((point) => (
        <Marker
          key={point.slug}
          position={[point.latitude, point.longitude]}
          icon={highlightedSlug === point.slug ? producerPinHighlightedIcon : producerPinIcon}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.city} · {point.category}
            <br />
            <Link href={buildProducerHref(point, { province })}>Ver ficha</Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function ProducersMapInner({
  points,
  province,
  highlightedSlug,
  userLocation,
}: {
  points: ProducerMapPoint[];
  province: string;
  highlightedSlug?: string;
  userLocation?: { lat: number; lon: number };
}) {
  const initialCenter = getInitialCenter(points, userLocation);

  return (
    <MapContainer
      center={initialCenter}
      zoom={10}
      minZoom={5}
      className="producers-map-canvas"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsAwareMarkers
        points={points}
        province={province}
        highlightedSlug={highlightedSlug}
        userLocation={userLocation}
      />
    </MapContainer>
  );
}
