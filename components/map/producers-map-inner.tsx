"use client";

import { useEffect } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { ProducerMapPoint } from "@/lib/csv-catalog";

type ProducersMapInnerProps = {
  points: ProducerMapPoint[];
};

const producerPinIcon = L.divIcon({
  className: "producer-map-pin",
  html: '<span class="producer-map-pin-dot"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitMapBounds({ points }: ProducersMapInnerProps) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 1) {
      const [point] = points;
      map.setView([point.latitude, point.longitude], 13, { animate: false });
      return;
    }

    const bounds = L.latLngBounds(
      points.map((point) => [point.latitude, point.longitude] as [number, number]),
    );
    map.fitBounds(bounds.pad(0.2), { animate: false });
  }, [map, points]);

  return null;
}

export default function ProducersMapInner({ points }: ProducersMapInnerProps) {
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
      <FitMapBounds points={points} />
      {points.map((point) => (
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
    </MapContainer>
  );
}
