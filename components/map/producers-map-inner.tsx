"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { ProducerMapPoint } from "@/lib/csv-catalog";

const producerPinIcon = L.divIcon({
  className: "producer-map-pin",
  html: '<span class="producer-map-pin-dot"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function BoundsAwareMarkers({ points }: { points: ProducerMapPoint[] }) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());

  // Fit map to all points whenever the point set changes
  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 13, { animate: false });
    } else {
      const bounds = L.latLngBounds(
        points.map((p) => [p.latitude, p.longitude] as [number, number]),
      );
      map.fitBounds(bounds.pad(0.2), { animate: false });
    }

    setViewBounds(map.getBounds());
  }, [map, points]);

  // Update viewport bounds on every pan/zoom
  useMapEvents({
    moveend: () => setViewBounds(map.getBounds()),
    zoomend: () => setViewBounds(map.getBounds()),
  });

  // Only render markers visible in the current viewport
  const visible = useMemo(
    () => points.filter((p) => viewBounds.contains([p.latitude, p.longitude])),
    [points, viewBounds],
  );

  return (
    <>
      {visible.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={producerPinIcon}
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

export default function ProducersMapInner({ points }: { points: ProducerMapPoint[] }) {
  return (
    <MapContainer
      center={[41.3902, 2.154]}
      zoom={10}
      className="producers-map-canvas"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsAwareMarkers points={points} />
    </MapContainer>
  );
}
