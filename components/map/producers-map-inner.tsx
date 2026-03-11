"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { ProducerMapPoint } from "@/lib/csv-catalog";

// Below this threshold, show all points regardless of viewport (municipality searches).
// Above it, filter by viewport to avoid rendering thousands of markers at once.
const VIEWPORT_THRESHOLD = 200;

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
  highlightedId,
}: {
  points: ProducerMapPoint[];
  highlightedId?: string;
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());

  // Fit map to all points whenever the point set changes
  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 13, { animate: false });
    } else if (points.length <= VIEWPORT_THRESHOLD) {
      // Small result set (e.g. municipality filter): fit to points
      const bounds = L.latLngBounds(
        points.map((p) => [p.latitude, p.longitude] as [number, number]),
      );
      map.fitBounds(bounds.pad(0.2), { animate: false });
    } else {
      // Large result set: centre on Barcelona province
      map.setView([41.42, 2.02], 10, { animate: false });
    }

  }, [map, points]);

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
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={highlightedId && String(point.id) === highlightedId ? producerPinHighlightedIcon : producerPinIcon}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.city} · {point.category}
            <br />
            <Link href={`/p/${point.id}`}>Ver ficha</Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function ProducersMapInner({
  points,
  highlightedId,
}: {
  points: ProducerMapPoint[];
  highlightedId?: string;
}) {
  return (
    <MapContainer
      center={[41.42, 2.02]}
      zoom={10}
      maxBounds={[[40.5, 0.1], [42.9, 3.4]]}
      maxBoundsViscosity={0.9}
      minZoom={8}
      className="producers-map-canvas"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsAwareMarkers points={points} highlightedId={highlightedId} />
    </MapContainer>
  );
}
