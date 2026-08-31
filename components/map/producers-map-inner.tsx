"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  PRODUCER_SELECTION_MIN_ZOOM,
  type ProducerMapMarker,
} from "@/lib/producer-selections";
import { NEARBY_PRODUCER_FOCUS_MINIMUM } from "@/lib/location/nearby-producer-focus";

import type { ProducerMapFocusRequest } from "./producers-map";

// Below this threshold, show all points regardless of viewport.
// Above it, filter by viewport to avoid rendering thousands of markers at once.
const VIEWPORT_THRESHOLD = 200;
const DEFAULT_MAP_CENTER: [number, number] = [40.42, -3.7];
const PRODUCER_FOCUS_ZOOM = 13;
const NEARBY_FOCUS_MAX_ZOOM = 14;
const EMPTY_FOCUS_KEYS: string[] = [];

function getPointsBounds(
  points: readonly ProducerMapMarker[],
): L.LatLngBounds | null {
  if (!points.length) {
    return null;
  }

  return L.latLngBounds(
    points.map((p) => [p.latitude, p.longitude] as [number, number]),
  );
}

function getInitialCenter(points: ProducerMapMarker[]): [number, number] {
  const bounds = getPointsBounds(points);
  if (!bounds) {
    return DEFAULT_MAP_CENTER;
  }

  const center = bounds.getCenter();
  return [center.lat, center.lng];
}

function hasSamePointGeometry(
  previous: readonly ProducerMapMarker[],
  current: readonly ProducerMapMarker[],
): boolean {
  if (previous.length !== current.length) {
    return false;
  }

  return previous.every((point, index) => {
    const candidate = current[index];
    return (
      candidate !== undefined &&
      point.key === candidate.key &&
      point.latitude === candidate.latitude &&
      point.longitude === candidate.longitude
    );
  });
}

function motionIsReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getPointsForKeys(
  points: readonly ProducerMapMarker[],
  keys: readonly string[],
): ProducerMapMarker[] {
  if (!keys.length) return [];
  const keySet = new Set(keys);
  return points.filter(({ key }) => keySet.has(key));
}

function fitNearbyProducerView(
  map: L.Map,
  nearbyPoints: readonly ProducerMapMarker[],
): boolean {
  if (nearbyPoints.length < NEARBY_PRODUCER_FOCUS_MINIMUM) return false;

  fitProducerPoints(
    map,
    nearbyPoints,
    PRODUCER_FOCUS_ZOOM,
    NEARBY_FOCUS_MAX_ZOOM,
  );
  return true;
}

function fitProducerPoints(
  map: L.Map,
  points: readonly ProducerMapMarker[],
  singlePointZoom: number,
  maxZoom?: number,
): void {
  if (points.length === 1) {
    map.setView([points[0].latitude, points[0].longitude], singlePointZoom, {
      animate: false,
    });
    return;
  }

  const bounds = getPointsBounds(points);
  if (!bounds) return;
  map.fitBounds(bounds.pad(0.2), {
    animate: false,
    ...(maxZoom === undefined ? {} : { maxZoom }),
  });
}

function BoundsAwareMarkers({
  points,
  highlightedKey,
  focusRequest,
  initialFocusKeys = EMPTY_FOCUS_KEYS,
  nearbyFocusKeys = EMPTY_FOCUS_KEYS,
  onNearbyFocusConsumed,
  onSelect,
  singlePointZoom = 13,
  messages,
}: {
  points: ProducerMapMarker[];
  highlightedKey?: string;
  focusRequest?: ProducerMapFocusRequest;
  initialFocusKeys?: string[];
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelect?: (key: string) => void;
  singlePointZoom?: number;
  messages: {
    openProfile: string;
  };
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() => map.getBounds());
  const fittedViewRef = useRef<{
    points: readonly ProducerMapMarker[];
    singlePointZoom: number;
    initialFocusKey: string;
    nearbyFocusKey: string;
  } | null>(null);
  const viewModeRef = useRef<"area" | "initial" | "nearby">("area");

  // Fit only when the effective geometry changes. Navigation state such as a
  // highlighted producer may rebuild props, but must preserve the user's pan
  // and zoom.
  useEffect(() => {
    if (points.length === 0) return;

    const fittedView = fittedViewRef.current;
    const initialFocusKey = initialFocusKeys.join("\0");
    const nearbyFocusKey = nearbyFocusKeys.join("\0");
    if (
      fittedView &&
      fittedView.singlePointZoom === singlePointZoom &&
      fittedView.initialFocusKey === initialFocusKey &&
      fittedView.nearbyFocusKey === nearbyFocusKey &&
      hasSamePointGeometry(fittedView.points, points)
    ) {
      fittedViewRef.current = {
        points,
        singlePointZoom,
        initialFocusKey,
        nearbyFocusKey,
      };
      return;
    }
    fittedViewRef.current = {
      points,
      singlePointZoom,
      initialFocusKey,
      nearbyFocusKey,
    };

    if (nearbyFocusKeys.length) {
      const nearbyFocusPoints = getPointsForKeys(points, nearbyFocusKeys);
      const didFitNearbyView = fitNearbyProducerView(map, nearbyFocusPoints);
      onNearbyFocusConsumed?.();
      if (didFitNearbyView) {
        viewModeRef.current = "nearby";
        return;
      }
    }

    if (viewModeRef.current === "nearby") {
      return;
    }

    const initialFocusPoints = getPointsForKeys(points, initialFocusKeys);
    if (initialFocusPoints.length) {
      viewModeRef.current = "initial";
      fitProducerPoints(
        map,
        initialFocusPoints,
        singlePointZoom,
        PRODUCER_FOCUS_ZOOM,
      );
      return;
    }

    viewModeRef.current = "area";
    fitProducerPoints(
      map,
      points,
      singlePointZoom,
      points.length > VIEWPORT_THRESHOLD ? 10 : undefined,
    );
  }, [
    initialFocusKeys,
    map,
    nearbyFocusKeys,
    onNearbyFocusConsumed,
    points,
    singlePointZoom,
  ]);

  useEffect(() => {
    if (!focusRequest) return;
    const point = points.find(({ key }) => key === focusRequest.key);
    if (!point) return;

    const zoom = Math.max(map.getZoom(), PRODUCER_FOCUS_ZOOM);
    if (motionIsReduced()) {
      map.setView([point.latitude, point.longitude], zoom, { animate: false });
      return;
    }
    map.flyTo([point.latitude, point.longitude], zoom, {
      animate: true,
      duration: 0.32,
    });
  }, [focusRequest, map, points]);

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
      {visible.map((point) => {
        const highlighted = highlightedKey === point.key;

        return (
          <Fragment key={`${point.key}:${highlighted ? "selected" : "default"}`}>
            <CircleMarker
              center={[point.latitude, point.longitude]}
              radius={highlighted ? 4 : 3}
              interactive={!onSelect}
              pathOptions={{
                className: highlighted
                  ? "producer-map-circle producer-map-circle--highlighted"
                  : "producer-map-circle",
                color: highlighted
                  ? "var(--chisan-color-surface)"
                  : "var(--chisan-color-moss-dark)",
                fillColor: "var(--chisan-color-moss-dark)",
                fillOpacity: 1,
                opacity: highlighted ? 1 : 0,
                weight: highlighted ? 2 : 0,
              }}
            >
              {onSelect ? null : (
                <>
                  <Tooltip direction="top" offset={[0, -8]} opacity={0.96}>
                    {point.name}
                  </Tooltip>
                  <Popup>
                    <strong>{point.name}</strong>
                    <br />
                    {point.city} · {point.categories.join(" · ")}
                    <br />
                    <Link href={point.href} prefetch={false}>
                      {messages.openProfile}
                    </Link>
                  </Popup>
                </>
              )}
            </CircleMarker>
            {onSelect ? (
              <CircleMarker
                center={[point.latitude, point.longitude]}
                radius={14}
                pathOptions={{
                  className: "producer-map-hit-area",
                  color: "transparent",
                  fillColor: "transparent",
                  fillOpacity: 0,
                  opacity: 0,
                  weight: 0,
                }}
                eventHandlers={{ click: () => onSelect(point.key) }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={0.96}>
                  {point.name}
                </Tooltip>
              </CircleMarker>
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
}

export default function ProducersMapInner({
  points,
  highlightedKey,
  focusRequest,
  initialFocusKeys,
  nearbyFocusKeys,
  onNearbyFocusConsumed,
  onSelect,
  singlePointZoom = 13,
  minZoom = PRODUCER_SELECTION_MIN_ZOOM,
  messages,
  onReady,
}: {
  points: ProducerMapMarker[];
  highlightedKey?: string;
  focusRequest?: ProducerMapFocusRequest;
  initialFocusKeys?: string[];
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelect?: (key: string) => void;
  singlePointZoom?: number;
  minZoom?: number;
  messages: {
    openProfile: string;
  };
  onReady: () => void;
}) {
  const initialCenter = getInitialCenter(points);
  const initialZoom = points.length === 1 ? singlePointZoom : 10;

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      minZoom={minZoom}
      className="producers-map-canvas"
      scrollWheelZoom
      whenReady={onReady}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsAwareMarkers
        points={points}
        highlightedKey={highlightedKey}
        focusRequest={focusRequest}
        initialFocusKeys={initialFocusKeys}
        nearbyFocusKeys={nearbyFocusKeys}
        onNearbyFocusConsumed={onNearbyFocusConsumed}
        onSelect={onSelect}
        singlePointZoom={singlePointZoom}
        messages={messages}
      />
    </MapContainer>
  );
}
