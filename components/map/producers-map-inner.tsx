"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { ViewTransitionLink } from "@/components/view-transition-link";
import { buildProducerHref, type CatalogNavigationContext } from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";

const VIEWPORT_THRESHOLD = 600;
const DEFAULT_CENTER: [number, number] = [41.42, 2.02];
const DEFAULT_ZOOM = 10;
const FOCUSED_ZOOM = 13;
const USER_LOCATION_ZOOM = 12;
const NEARBY_FIT_POINT_LIMIT = 12;
const MARKER_GRID_SIZES = [
  { maxZoom: 9, cellSize: 48, maxMarkers: 34 },
  { maxZoom: 10, cellSize: 42, maxMarkers: 46 },
  { maxZoom: 11, cellSize: 36, maxMarkers: 62 },
  { maxZoom: 12, cellSize: 30, maxMarkers: 84 },
  { maxZoom: Infinity, cellSize: 24, maxMarkers: 120 },
] as const;
const PRODUCER_MARKER_STYLE = {
  color: "#ffffff",
  fillColor: "#111111",
  fillOpacity: 0.82,
  opacity: 1,
  weight: 2,
  radius: 6,
};
const HIGHLIGHTED_MARKER_STYLE = {
  color: "#ffffff",
  fillColor: "#b85731",
  fillOpacity: 0.96,
  opacity: 1,
  weight: 3,
  radius: 9,
};
const USER_MARKER_STYLE = {
  color: "#ffffff",
  fillColor: "#2563eb",
  fillOpacity: 0.96,
  opacity: 1,
  weight: 3,
  radius: 8,
};

export type MapVisibilitySummary = {
  totalCount: number;
  visibleCount: number;
  renderedCount: number;
  hiddenCount: number;
  zoom: number;
};

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

function distanceToCenterScore(point: ProducerMapPoint, center: L.LatLng): number {
  const latDelta = point.latitude - center.lat;
  const lonDelta = point.longitude - center.lng;

  return latDelta * latDelta + lonDelta * lonDelta;
}

function getMarkerBudget(zoom: number) {
  return MARKER_GRID_SIZES.find((entry) => zoom <= entry.maxZoom) ?? MARKER_GRID_SIZES.at(-1)!;
}

function distributeVisiblePoints(
  map: L.Map,
  points: readonly ProducerMapPoint[],
  highlightedPoint: ProducerMapPoint | undefined,
  zoom: number,
): ProducerMapPoint[] {
  const center = map.getCenter();
  const { cellSize, maxMarkers } = getMarkerBudget(zoom);
  const buckets = new Map<string, ProducerMapPoint>();

  for (const point of points) {
    if (highlightedPoint && point.id === highlightedPoint.id) {
      continue;
    }

    const containerPoint = map.latLngToContainerPoint([point.latitude, point.longitude]);
    const bucketKey = [
      Math.floor(containerPoint.x / cellSize),
      Math.floor(containerPoint.y / cellSize),
    ].join(":");
    const current = buckets.get(bucketKey);

    if (!current) {
      buckets.set(bucketKey, point);
      continue;
    }

    if (distanceToCenterScore(point, center) < distanceToCenterScore(current, center)) {
      buckets.set(bucketKey, point);
    }
  }

  const candidates = [...buckets.values()].sort(
    (a, b) => distanceToCenterScore(a, center) - distanceToCenterScore(b, center),
  );
  const budget = highlightedPoint ? maxMarkers - 1 : maxMarkers;
  const distributed = candidates.slice(0, Math.max(budget, 1));

  return highlightedPoint ? [highlightedPoint, ...distributed] : distributed;
}

function ProducerPoint({
  point,
  highlighted,
  overlayOffsets,
  detailContext,
}: {
  point: ProducerMapPoint;
  highlighted: boolean;
  overlayOffsets: ReturnType<typeof getMapOverlayOffsets>;
  detailContext?: CatalogNavigationContext;
}) {
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (highlighted) {
      markerRef.current?.openPopup();
      markerRef.current?.bringToFront();
    }
  }, [highlighted]);

  return (
    <CircleMarker
      ref={markerRef}
      center={[point.latitude, point.longitude]}
      pathOptions={highlighted ? HIGHLIGHTED_MARKER_STYLE : PRODUCER_MARKER_STYLE}
      radius={highlighted ? HIGHLIGHTED_MARKER_STYLE.radius : PRODUCER_MARKER_STYLE.radius}
    >
      <Popup
        autoPanPaddingTopLeft={overlayOffsets.paddingTopLeft}
        autoPanPaddingBottomRight={overlayOffsets.paddingBottomRight}
      >
        <div className="map-popup">
          <strong>{point.name}</strong>
          <p>
            {point.city} · {point.category}
          </p>
          <ViewTransitionLink
            href={buildProducerHref(
              { id: point.id, slug: point.slug },
              {
                ...detailContext,
                highlight: point.id,
              },
            )}
            className="producer-inline-link is-primary"
          >
            Ver ficha
          </ViewTransitionLink>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function BoundsAwareMarkers({
  points,
  highlightedId,
  userLocation,
  detailContext,
  onSummaryChange,
}: {
  points: ProducerMapPoint[];
  highlightedId?: string;
  userLocation?: { lat: number; lon: number };
  detailContext?: CatalogNavigationContext;
  onSummaryChange: (summary: MapVisibilitySummary) => void;
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());
  const [zoom, setZoom] = useState(() => map.getZoom());
  const overlayOffsets = getMapOverlayOffsets(map);
  const highlightedPoint = highlightedId
    ? points.find((point) => String(point.id) === highlightedId)
    : undefined;

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
        focusSinglePosition(map, [userLocation.lat, userLocation.lon], USER_LOCATION_ZOOM);
      }
      return;
    }

    if (userLocation) {
      fitPointsInView(map, points.slice(0, NEARBY_FIT_POINT_LIMIT), userLocation);
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

    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: false });
  }, [highlightedPoint, map, points, userLocation]);

  useMapEvents({
    moveend: () => {
      setViewBounds(map.getBounds());
      setZoom(map.getZoom());
    },
  });

  const inView = useMemo(
    () => points.filter((point) => viewBounds.pad(0.08).contains([point.latitude, point.longitude])),
    [points, viewBounds],
  );

  const visiblePoints = useMemo(
    () => distributeVisiblePoints(map, inView, highlightedPoint, zoom),
    [highlightedPoint, inView, map, zoom],
  );

  useEffect(() => {
    onSummaryChange({
      totalCount: points.length,
      visibleCount: inView.length,
      renderedCount: visiblePoints.length,
      hiddenCount: Math.max(inView.length - visiblePoints.length, 0),
      zoom,
    });
  }, [inView.length, onSummaryChange, points.length, visiblePoints.length, zoom]);

  return (
    <>
      {visiblePoints.map((point) => (
        <ProducerPoint
          key={point.id}
          point={point}
          highlighted={Boolean(highlightedPoint && point.id === highlightedPoint.id)}
          overlayOffsets={overlayOffsets}
          detailContext={detailContext}
        />
      ))}
      {userLocation ? (
        <CircleMarker
          center={[userLocation.lat, userLocation.lon]}
          pathOptions={USER_MARKER_STYLE}
          radius={USER_MARKER_STYLE.radius}
        >
          <Popup
            autoPanPaddingTopLeft={overlayOffsets.paddingTopLeft}
            autoPanPaddingBottomRight={overlayOffsets.paddingBottomRight}
          >
            <div className="map-popup">
              <strong>Tu ubicación</strong>
            </div>
          </Popup>
        </CircleMarker>
      ) : null}
    </>
  );
}

export default function ProducersMapInner({
  points,
  highlightedId,
  userLocation,
  detailContext,
  onSummaryChange,
}: {
  points: ProducerMapPoint[];
  highlightedId?: string;
  userLocation?: { lat: number; lon: number };
  detailContext?: CatalogNavigationContext;
  onSummaryChange: (summary: MapVisibilitySummary) => void;
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
      preferCanvas
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
        onSummaryChange={onSummaryChange}
      />
    </MapContainer>
  );
}
