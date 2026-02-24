"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

import {
  BARCELONA_PROVINCE,
  BARCELONA_PROVINCE_LEAFLET_BOUNDS,
} from "@/lib/barcelona";
import { getMapTileLayerConfig } from "@/lib/map-provider";
import type { ProducerListItem } from "@/lib/types";

type ProducersMapProps = {
  producers: ProducerListItem[];
  selectedProducerId: number | null;
  onSelectProducer: (id: number) => void;
  onBoundsChange: (bbox: string) => void;
  className?: string;
};

const markerIcon = L.divIcon({
  className: "km0-marker-pin",
  html: "<span></span>",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -8],
});
const mapTileConfig = getMapTileLayerConfig();
const PROVINCE_CENTER: [number, number] = [
  (BARCELONA_PROVINCE.minLat + BARCELONA_PROVINCE.maxLat) / 2,
  (BARCELONA_PROVINCE.minLng + BARCELONA_PROVINCE.maxLng) / 2,
];
const INITIAL_ZOOM = 9;

function safeClearLayerGroup(layerGroup: L.LayerGroup | null | undefined): void {
  if (!layerGroup) {
    return;
  }

  try {
    layerGroup.clearLayers();
  } catch {
    // Ignore cleanup race conditions during fast re-renders.
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function popupHtml(producer: ProducerListItem): string {
  const name = escapeHtml(producer.name);
  const city = producer.city ? escapeHtml(producer.city) : "Sin ciudad";
  const category = [producer.category, producer.subcategory]
    .filter(Boolean)
    .map((item) => escapeHtml(item as string))
    .join(" · ");

  return `
    <div class="km0-popup">
      <strong>${name}</strong>
      <p>${city}</p>
      ${category ? `<p>${category}</p>` : ""}
      <a href="/p/${producer.slug}">Ver ficha</a>
    </div>
  `;
}

function boundsToBbox(bounds: L.LatLngBounds): string {
  const west = Math.max(bounds.getWest(), BARCELONA_PROVINCE.minLng);
  const south = Math.max(bounds.getSouth(), BARCELONA_PROVINCE.minLat);
  const east = Math.min(bounds.getEast(), BARCELONA_PROVINCE.maxLng);
  const north = Math.min(bounds.getNorth(), BARCELONA_PROVINCE.maxLat);

  return [west, south, east, north]
    .map((value) => value.toFixed(6))
    .join(",");
}

export default function ProducersMap({
  producers,
  selectedProducerId,
  onSelectProducer,
  onBoundsChange,
  className,
}: ProducersMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  const onBoundsChangeRef = useRef(onBoundsChange);
  const onSelectProducerRef = useRef(onSelectProducer);

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  useEffect(() => {
    onSelectProducerRef.current = onSelectProducer;
  }, [onSelectProducer]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) {
      return;
    }

    let disposed = false;
    const provinceBounds = L.latLngBounds(BARCELONA_PROVINCE_LEAFLET_BOUNDS);

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      minZoom: INITIAL_ZOOM,
      maxZoom: mapTileConfig.maxZoom,
      maxBounds: provinceBounds,
      maxBoundsViscosity: 1,
      zoomSnap: 0.25,
    }).setView(PROVINCE_CENTER, INITIAL_ZOOM);

    mapRef.current = map;

    const tileLayerOptions: L.TileLayerOptions = {
      maxZoom: mapTileConfig.maxZoom,
      attribution: mapTileConfig.attribution,
    };
    if (mapTileConfig.subdomains) {
      tileLayerOptions.subdomains = mapTileConfig.subdomains;
    }

    L.tileLayer(mapTileConfig.tileUrl, tileLayerOptions).addTo(map);

    const invalidateMapSize = () => {
      if (disposed || mapRef.current !== map) {
        return;
      }

      try {
        map.invalidateSize({ animate: false });
      } catch {
        // Ignore map resize races during teardown.
      }
    };

    const resizeObserver =
      typeof window !== "undefined" && "ResizeObserver" in window
        ? new ResizeObserver(() => invalidateMapSize())
        : null;

    if (resizeObserver) {
      resizeObserver.observe(mapContainerRef.current);
    }

    map.whenReady(() => {
      invalidateMapSize();
    });

    const emitBounds = () => {
      if (disposed || mapRef.current !== map) {
        return;
      }

      try {
        onBoundsChangeRef.current(boundsToBbox(map.getBounds()));
      } catch {
        // Ignore bounds reads while map is tearing down.
      }
    };

    map.on("moveend zoomend", emitBounds);
    emitBounds();

    const layerGroup = L.layerGroup();
    markersLayerRef.current = layerGroup;
    map.addLayer(layerGroup);

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      safeClearLayerGroup(markersLayerRef.current);
      map.off("moveend zoomend", emitBounds);
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const layerGroup = markersLayerRef.current;
    if (!layerGroup) {
      return;
    }

    safeClearLayerGroup(layerGroup);

    const markers = new Map<number, L.Marker>();

    for (const producer of producers) {
      if (producer.latitude === null || producer.longitude === null) {
        continue;
      }

      const marker = L.marker([producer.latitude, producer.longitude], {
        icon: markerIcon,
        title: producer.name,
      });

      marker.bindPopup(popupHtml(producer));
      marker.on("click", () => {
        onSelectProducerRef.current(producer.id);
      });

      markers.set(producer.id, marker);
      layerGroup.addLayer(marker);
    }

    markersRef.current = markers;
  }, [producers]);

  useEffect(() => {
    if (!selectedProducerId) {
      return;
    }

    const marker = markersRef.current.get(selectedProducerId);
    const map = mapRef.current;
    const layerGroup = markersLayerRef.current;

    if (!marker || !map || !layerGroup) {
      return;
    }

    if (!layerGroup.hasLayer(marker)) {
      return;
    }

    try {
      marker.openPopup();
      map.panTo(marker.getLatLng(), { animate: false });
    } catch {
      // Ignore stale marker operations when data updates mid-animation.
    }
  }, [selectedProducerId]);

  return <div ref={mapContainerRef} className={className ?? "h-full w-full"} />;
}
