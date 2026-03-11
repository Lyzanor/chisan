"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { ViewTransitionLink } from "@/components/view-transition-link";
import { buildProducerHref, type CatalogNavigationContext } from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";

// Below this threshold, show all points regardless of viewport (municipality searches).
// Above it, filter by viewport to avoid rendering thousands of markers at once.
const VIEWPORT_THRESHOLD = 600;
const USER_FOCUS_LIMIT = 60;
const DEFAULT_CENTER: [number, number] = [41.42, 2.02];
const DEFAULT_ZOOM = 10;
const FOCUSED_ZOOM = 13;

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

function getMapOverlayOffsets(map: L.Map): {
  paddingTopLeft: L.Point;
  paddingBottomRight: L.Point;
  singlePointPanY: number;
} {
  const size = map.getSize();
  const isMobile = size.x <= 768;

  if (isMobile) {
    return {
      paddingTopLeft: L.point(20, Math.max(104, Math.round(size.y * 0.14))),
      paddingBottomRight: L.point(20, Math.max(220, Math.round(size.y * 0.34))),
      singlePointPanY: -Math.round(size.y * 0.16),
    };
  }

  return {
    paddingTopLeft: L.point(28, 28),
    paddingBottomRight: L.point(28, 28),
    singlePointPanY: 0,
  };
}

function getBoundsForPoints(
  points: readonly ProducerMapPoint[],
  userLocation?: { lat: number; lon: number },
): L.LatLngBounds {
  const coordinates = points.map((point) => [point.latitude, point.longitude] as [number, number]);

  if (userLocation) {
    coordinates.unshift([userLocation.lat, userLocation.lon]);
  }

  return L.latLngBounds(coordinates);
}

function focusSinglePosition(map: L.Map, position: [number, number], zoom: number) {
  const { singlePointPanY } = getMapOverlayOffsets(map);

  map.setView(position, zoom, { animate: false });

  if (singlePointPanY !== 0) {
    map.panBy([0, singlePointPanY], { animate: false });
  }
}

function fitPointsInView(
  map: L.Map,
  points: readonly ProducerMapPoint[],
  userLocation?: { lat: number; lon: number },
) {
  const bounds = getBoundsForPoints(points, userLocation);
  const { paddingTopLeft, paddingBottomRight } = getMapOverlayOffsets(map);

  map.fitBounds(bounds.pad(0.12), {
    animate: false,
    maxZoom: FOCUSED_ZOOM,
    paddingTopLeft,
    paddingBottomRight,
  });
}

function BoundsAwareMarkers({
  points,
  highlightedId,
  userLocation,
  detailContext,
}: {
  points: ProducerMapPoint[];
  highlightedId?: string;
  userLocation?: { lat: number; lon: number };
  detailContext?: CatalogNavigationContext;
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());
  const overlayOffsets = getMapOverlayOffsets(map);
  const highlightedPoint = highlightedId
    ? points.find((point) => String(point.id) === highlightedId)
    : undefined;

  // Fit map to a sensible context whenever point selection or location changes.
  useEffect(() => {
    if (highlightedPoint) {
      if (userLocation) {
        fitPointsInView(map, [highlightedPoint], userLocation);
        return;
      }

      focusSinglePosition(map, [highlightedPoint.latitude, highlightedPoint.longitude], FOCUSED_ZOOM);
      return;
    }

    if (points.length === 0) {
      if (userLocation) {
        focusSinglePosition(map, [userLocation.lat, userLocation.lon], 11);
      }
      return;
    }

    if (userLocation) {
      const focusPoints = points.length > VIEWPORT_THRESHOLD
        ? points.slice(0, USER_FOCUS_LIMIT)
        : points;

      fitPointsInView(map, focusPoints, userLocation);
      return;
    }

    if (points.length === 1) {
      focusSinglePosition(map, [points[0].latitude, points[0].longitude], FOCUSED_ZOOM);
      return;
    }

    if (points.length <= VIEWPORT_THRESHOLD) {
      fitPointsInView(map, points);
      return;
    }

    // Full catalog or very broad filters: keep a stable regional frame and let viewport filtering do the rest.
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: false });
  }, [highlightedPoint, map, points, userLocation]);

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
          <Popup
            autoPanPaddingTopLeft={overlayOffsets.paddingTopLeft}
            autoPanPaddingBottomRight={overlayOffsets.paddingBottomRight}
          >
            <strong>Tu ubicación</strong>
          </Popup>
        </Marker>
      )}
      {visible.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={highlightedId && String(point.id) === highlightedId ? producerPinHighlightedIcon : producerPinIcon}
          zIndexOffset={highlightedId && String(point.id) === highlightedId ? 800 : 0}
        >
          <Popup
            autoPanPaddingTopLeft={overlayOffsets.paddingTopLeft}
            autoPanPaddingBottomRight={overlayOffsets.paddingBottomRight}
          >
            <strong>{point.name}</strong>
            <br />
            {point.city} · {point.category}
            <br />
            <ViewTransitionLink
              href={buildProducerHref(point.id, {
                ...detailContext,
                highlight: point.id,
              })}
            >
              Ver ficha
            </ViewTransitionLink>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function ProducersMapInner({
  points,
  highlightedId,
  userLocation,
  detailContext,
}: {
  points: ProducerMapPoint[];
  highlightedId?: string;
  userLocation?: { lat: number; lon: number };
  detailContext?: CatalogNavigationContext;
}) {
  return (
    <MapContainer
      center={userLocation ? [userLocation.lat, userLocation.lon] : DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
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
      <BoundsAwareMarkers
        points={points}
        highlightedId={highlightedId}
        userLocation={userLocation}
        detailContext={detailContext}
      />
    </MapContainer>
  );
}
