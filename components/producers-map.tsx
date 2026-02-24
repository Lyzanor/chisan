"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";

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

function safeClearCluster(cluster: L.MarkerClusterGroup | null | undefined): void {
  if (!cluster) {
    return;
  }

  try {
    cluster.clearLayers();
  } catch {
    // Ignore cleanup race conditions during fast re-renders.
  }
}

function safeRemoveLayer(map: L.Map | null, layer: L.Layer | null | undefined): void {
  if (!map || !layer) {
    return;
  }

  try {
    map.removeLayer(layer);
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
      <a href="/p/${producer.id}">Ver ficha</a>
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
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
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

    const provinceBounds = L.latLngBounds(BARCELONA_PROVINCE_LEAFLET_BOUNDS);

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      minZoom: 8,
      maxZoom: mapTileConfig.maxZoom,
      maxBounds: provinceBounds,
      maxBoundsViscosity: 1,
      zoomSnap: 0.25,
    });

    const fitToProvince = () => {
      map.invalidateSize({ pan: false, animate: false });
      const lockedMinZoom = map.getBoundsZoom(provinceBounds, true);
      map.setMinZoom(lockedMinZoom);
      map.fitBounds(provinceBounds, {
        padding: [18, 18],
        animate: false,
      });
    };

    fitToProvince();

    const tileLayerOptions: L.TileLayerOptions = {
      maxZoom: mapTileConfig.maxZoom,
      attribution: mapTileConfig.attribution,
    };
    if (mapTileConfig.subdomains) {
      tileLayerOptions.subdomains = mapTileConfig.subdomains;
    }

    L.tileLayer(mapTileConfig.tileUrl, tileLayerOptions).addTo(map);

    const emitBounds = () => {
      onBoundsChangeRef.current(boundsToBbox(map.getBounds()));
    };

    map.on("resize", fitToProvince);
    map.on("moveend zoomend", emitBounds);

    requestAnimationFrame(() => {
      fitToProvince();
      emitBounds();
    });

    mapRef.current = map;

    return () => {
      safeClearCluster(clusterRef.current);
      safeRemoveLayer(map, clusterRef.current);
      map.off("resize", fitToProvince);
      map.off("moveend zoomend", emitBounds);
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (clusterRef.current) {
      safeClearCluster(clusterRef.current);
      safeRemoveLayer(map, clusterRef.current);
      clusterRef.current = null;
    }

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      chunkedLoading: true,
      maxClusterRadius: 46,
    });

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
      cluster.addLayer(marker);
    }

    markersRef.current = markers;
    clusterRef.current = cluster;
    map.addLayer(cluster);

    return () => {
      safeClearCluster(cluster);
      safeRemoveLayer(map, cluster);
      if (clusterRef.current === cluster) {
        clusterRef.current = null;
      }
    };
  }, [producers]);

  useEffect(() => {
    if (!selectedProducerId) {
      return;
    }

    const marker = markersRef.current.get(selectedProducerId);
    const map = mapRef.current;
    const cluster = clusterRef.current;

    if (!marker || !map || !cluster) {
      return;
    }

    cluster.zoomToShowLayer(marker, () => {
      marker.openPopup();
      map.panTo(marker.getLatLng(), { animate: true, duration: 0.4 });
    });
  }, [selectedProducerId]);

  return <div ref={mapContainerRef} className={className ?? "h-full w-full"} />;
}
