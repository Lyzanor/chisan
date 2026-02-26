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

function getCategoryEmoji(category: string): string {
  if (/vino|bodega/i.test(category)) return "🍷";
  if (/ques/i.test(category)) return "🧀";
  if (/pan|boll|horno|pastel/i.test(category)) return "🥖";
  if (/miel/i.test(category)) return "🍯";
  if (/cerve/i.test(category)) return "🍺";
  if (/fruta|verdura|hort|agric/i.test(category)) return "🥕";
  if (/aceite|oliva/i.test(category)) return "🫒";
  if (/charcut|carne|embut/i.test(category)) return "🥩";
  if (/pescado|marisc/i.test(category)) return "🐟";
  if (/cafe|té|te/i.test(category)) return "☕";
  return "🧺";
}

function makeCategoryIcon(category: string): L.DivIcon {
  const emoji = getCategoryEmoji(category);
  return L.divIcon({
    className: "producer-map-pin",
    html: `<span class="producer-map-pin-emoji" aria-hidden="true">${emoji}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function BoundsAwareMarkers({ points }: { points: ProducerMapPoint[] }) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());

  // Cache one icon per category to avoid recreating on every render
  const iconsByCategory = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    for (const point of points) {
      if (!cache.has(point.category)) {
        cache.set(point.category, makeCategoryIcon(point.category));
      }
    }
    return cache;
  }, [points]);

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
          icon={iconsByCategory.get(point.category) ?? makeCategoryIcon(point.category)}
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <BoundsAwareMarkers points={points} />
    </MapContainer>
  );
}
