"use client";

import { useEffect, useRef } from "react";

import { getMapTileLayerConfig } from "@/lib/map-provider";

type ProducerMiniMapProps = {
  latitude: number;
  longitude: number;
  label: string;
};

const mapTileConfig = getMapTileLayerConfig();

export default function ProducerMiniMap({ latitude, longitude, label }: ProducerMiniMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    let mounted = true;
    let map: import("leaflet").Map | null = null;
    let marker: import("leaflet").Marker | null = null;

    async function initMap() {
      const L = await import("leaflet");
      if (!mounted || !mapContainerRef.current) {
        return;
      }

      const markerIcon = L.divIcon({
        className: "km0-marker-pin",
        html: "<span></span>",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -8],
      });

      map = L.map(mapContainerRef.current, {
        zoomControl: false,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        attributionControl: true,
      }).setView([latitude, longitude], 15);

      const tileLayerOptions: import("leaflet").TileLayerOptions = {
        maxZoom: mapTileConfig.maxZoom,
        attribution: mapTileConfig.attribution,
      };
      if (mapTileConfig.subdomains) {
        tileLayerOptions.subdomains = mapTileConfig.subdomains;
      }

      L.tileLayer(mapTileConfig.tileUrl, tileLayerOptions).addTo(map);

      marker = L.marker([latitude, longitude], { icon: markerIcon, title: label });
      marker.addTo(map).bindPopup(label);
    }

    void initMap();

    return () => {
      mounted = false;
      marker?.remove();
      map?.remove();
    };
  }, [label, latitude, longitude]);

  return <div ref={mapContainerRef} className="h-48 w-full rounded-xl border border-gray-200 lg:h-56" />;
}
