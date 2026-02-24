"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

type ProducerMiniMapProps = {
  latitude: number;
  longitude: number;
  label: string;
};

const markerIcon = L.divIcon({
  className: "km0-marker-pin",
  html: "<span></span>",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -8],
});

export default function ProducerMiniMap({ latitude, longitude, label }: ProducerMiniMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      dragging: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      attributionControl: true,
    }).setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker([latitude, longitude], { icon: markerIcon, title: label });
    marker.addTo(map).bindPopup(label);

    return () => {
      marker.remove();
      map.remove();
    };
  }, [label, latitude, longitude]);

  return <div ref={mapContainerRef} className="h-48 w-full rounded-xl border border-gray-200 lg:h-56" />;
}
