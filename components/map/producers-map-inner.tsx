"use client";

import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import Link from "next/link";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
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

import type {
  ProducerMapFocusRequest,
  ProducerMapMarkerInteraction,
} from "./producers-map";

// Below this threshold, show all points regardless of viewport.
// Above it, filter by viewport to avoid rendering thousands of markers at once.
const VIEWPORT_THRESHOLD = 200;
const KEYBOARD_MARKER_LIMIT = 100;
const DEFAULT_MAP_CENTER: [number, number] = [40.42, -3.7];
const PRODUCER_FOCUS_ZOOM = 13;
const CATEGORY_MARKER_MIN_ZOOM = 11;
const NEARBY_FOCUS_MAX_ZOOM = 14;
const EMPTY_FOCUS_KEYS: string[] = [];
const categoryMarkerIconCache = new Map<string, L.DivIcon>();

function producerMarkerLabel(point: ProducerMapMarker): string {
  return [point.name, point.city, point.categories[0]].filter(Boolean).join(", ");
}

function ProducerTooltipContent({ point }: { point: ProducerMapMarker }) {
  const metadata = [point.city, point.categories[0]].filter(Boolean).join(" · ");

  return (
    <span className="producer-map-tooltip__content">
      <strong>{point.name}</strong>
      {metadata ? <span>{metadata}</span> : null}
    </span>
  );
}

function useAccessibleProducerLayer({
  layerRef,
  point,
  onActivate,
  onPreview,
  onPreviewEnd,
  interactive,
  keyboardAccessible,
}: {
  layerRef: RefObject<L.Marker | L.CircleMarker | null>;
  point: ProducerMapMarker;
  onActivate?: () => void;
  onPreview?: (key: string) => void;
  onPreviewEnd?: (key: string) => void;
  interactive: boolean;
  keyboardAccessible: boolean;
}) {
  const label = producerMarkerLabel(point);

  useEffect(() => {
    const layer = layerRef.current;
    const element = layer?.getElement();
    if (!layer || !element) return;

    if (!interactive) {
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
      element.setAttribute("tabindex", "-1");
      return;
    }

    element.setAttribute("role", "button");
    element.setAttribute("tabindex", keyboardAccessible ? "0" : "-1");
    element.setAttribute("aria-label", label);

    function handleFocus() {
      onPreview?.(point.key);
      layer?.openTooltip();
    }

    function handleBlur() {
      onPreviewEnd?.(point.key);
      layer?.closeTooltip();
    }

    function handleKeyDown(event: Event) {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") return;

      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      if (onActivate) {
        onActivate();
      } else {
        layer?.openPopup();
      }
    }

    if (keyboardAccessible) {
      element.addEventListener("focus", handleFocus);
      element.addEventListener("blur", handleBlur);
      element.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    keyboardAccessible,
    interactive,
    label,
    layerRef,
    onActivate,
    onPreview,
    onPreviewEnd,
    point.key,
  ]);
}

function producerMarkerEventHandlers({
  point,
  onSelect,
  onPreview,
  onPreviewEnd,
}: {
  point: ProducerMapMarker;
  onSelect?: (key: string) => void;
  onPreview?: (key: string) => void;
  onPreviewEnd?: (key: string) => void;
}): L.LeafletEventHandlerFnMap | undefined {
  if (!onSelect && !onPreview && !onPreviewEnd) return undefined;

  return {
    ...(onSelect ? { click: () => onSelect(point.key) } : {}),
    ...(onPreview ? { mouseover: () => onPreview(point.key) } : {}),
    ...(onPreviewEnd ? { mouseout: () => onPreviewEnd(point.key) } : {}),
  };
}

function getCategoryMarkerIcon(icon: string, selected: boolean): L.DivIcon {
  const cacheKey = `${icon}:${selected ? "selected" : "default"}`;
  const cached = categoryMarkerIconCache.get(cacheKey);
  if (cached) return cached;

  const markerIcon = L.divIcon({
    className: "producer-map-category-marker",
    html: `<span aria-hidden="true" class="producer-map-category-icon ${
      selected ? "producer-map-category-icon--selected" : ""
    }">${icon}</span>`,
    iconAnchor: [22, 22],
    iconSize: [44, 44],
  });
  categoryMarkerIconCache.set(cacheKey, markerIcon);
  return markerIcon;
}

const CategoryProducerMarker = memo(function CategoryProducerMarker({
  point,
  selected,
  markerInteraction,
  onSelectKey,
  onPreviewKey,
  onPreviewEndKey,
  keyboardAccessible,
  messages,
}: {
  point: ProducerMapMarker;
  selected: boolean;
  markerInteraction: ProducerMapMarkerInteraction;
  onSelectKey?: (key: string) => void;
  onPreviewKey?: (key: string) => void;
  onPreviewEndKey?: (key: string) => void;
  keyboardAccessible: boolean;
  messages: { openProfile: string };
}) {
  const markerRef = useRef<L.Marker>(null);
  const selectable = markerInteraction === "select";
  const interactive = markerInteraction !== "static";
  const select = selectable ? onSelectKey : undefined;
  const preview = selectable ? onPreviewKey : undefined;
  const previewEnd = selectable ? onPreviewEndKey : undefined;

  useAccessibleProducerLayer({
    layerRef: markerRef,
    point,
    onActivate: select ? () => select(point.key) : undefined,
    onPreview: preview,
    onPreviewEnd: previewEnd,
    interactive,
    keyboardAccessible: interactive && keyboardAccessible,
  });

  return (
    <Marker
      ref={markerRef}
      position={[point.latitude, point.longitude]}
      icon={getCategoryMarkerIcon(point.icon, selected)}
      interactive={interactive}
      zIndexOffset={selected ? 1_000 : 0}
      riseOnHover
      eventHandlers={producerMarkerEventHandlers({
        point,
        onSelect: select,
        onPreview: preview,
        onPreviewEnd: previewEnd,
      })}
    >
      {markerInteraction === "popup" ? (
        <Tooltip
          className="producer-map-tooltip"
          direction="top"
          offset={[0, -14]}
          opacity={0.98}
        >
          <ProducerTooltipContent point={point} />
        </Tooltip>
      ) : null}
      {markerInteraction === "popup" ? (
        <Popup>
          <strong>{point.name}</strong>
          <br />
          {point.city} · {point.categories.join(" · ")}
          <br />
          <Link href={point.href} prefetch={false}>
            {messages.openProfile}
          </Link>
        </Popup>
      ) : null}
    </Marker>
  );
});

const OverviewProducerMarker = memo(function OverviewProducerMarker({
  point,
  selected,
  markerInteraction,
  onSelectKey,
  onPreviewKey,
  onPreviewEndKey,
  keyboardAccessible,
  messages,
}: {
  point: ProducerMapMarker;
  selected: boolean;
  markerInteraction: ProducerMapMarkerInteraction;
  onSelectKey?: (key: string) => void;
  onPreviewKey?: (key: string) => void;
  onPreviewEndKey?: (key: string) => void;
  keyboardAccessible: boolean;
  messages: { openProfile: string };
}) {
  const visualMarkerRef = useRef<L.CircleMarker>(null);
  const hitAreaRef = useRef<L.CircleMarker>(null);
  const selectable = markerInteraction === "select";
  const interactive = markerInteraction !== "static";
  const select = selectable ? onSelectKey : undefined;
  const preview = selectable ? onPreviewKey : undefined;
  const previewEnd = selectable ? onPreviewEndKey : undefined;
  const interactiveLayerRef = selectable ? hitAreaRef : visualMarkerRef;

  useAccessibleProducerLayer({
    layerRef: interactiveLayerRef,
    point,
    onActivate: select ? () => select(point.key) : undefined,
    onPreview: preview,
    onPreviewEnd: previewEnd,
    interactive,
    keyboardAccessible: interactive && keyboardAccessible,
  });

  useEffect(() => {
    const visualMarker = visualMarkerRef.current;
    visualMarker
      ?.getElement()
      ?.classList.toggle("producer-map-circle--selected", selected);
    if (selected) {
      visualMarker?.bringToFront();
      hitAreaRef.current?.bringToFront();
    }
  }, [selected]);

  return (
    <Fragment>
      <CircleMarker
        ref={visualMarkerRef}
        center={[point.latitude, point.longitude]}
        radius={selected ? 4 : 3}
        interactive={markerInteraction === "popup"}
        className="producer-map-circle"
        pathOptions={{
          color: selected
            ? "var(--chisan-color-surface)"
            : "var(--chisan-color-moss-dark)",
          fillColor: selected
            ? "var(--chisan-color-moss)"
            : "var(--chisan-color-moss-dark)",
          fillOpacity: 1,
          opacity: selected ? 1 : 0,
          weight: selected ? 2 : 0,
        }}
      >
        {markerInteraction === "popup" ? (
          <>
            <Tooltip
              className="producer-map-tooltip"
              direction="top"
              offset={[0, -8]}
              opacity={0.98}
            >
              <ProducerTooltipContent point={point} />
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
        ) : null}
      </CircleMarker>
      {selectable ? (
        <CircleMarker
          ref={hitAreaRef}
          center={[point.latitude, point.longitude]}
          radius={22}
          className="producer-map-hit-area"
          pathOptions={{
            color: "transparent",
            fillColor: "transparent",
            fillOpacity: 0,
            opacity: 0,
            weight: 0,
          }}
          eventHandlers={producerMarkerEventHandlers({
            point,
            onSelect: select,
            onPreview: preview,
            onPreviewEnd: previewEnd,
          })}
        />
      ) : null}
    </Fragment>
  );
});

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
  selectedKey,
  focusRequest,
  initialFocusKeys = EMPTY_FOCUS_KEYS,
  nearbyFocusKeys = EMPTY_FOCUS_KEYS,
  onNearbyFocusConsumed,
  onSelectKey,
  onPreviewKey,
  onPreviewEndKey,
  onVisibleKeysChange,
  markerInteraction,
  singlePointZoom = 13,
  messages,
}: {
  points: ProducerMapMarker[];
  selectedKey?: string;
  focusRequest?: ProducerMapFocusRequest;
  initialFocusKeys?: string[];
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelectKey?: (key: string) => void;
  onPreviewKey?: (key: string) => void;
  onPreviewEndKey?: (key: string) => void;
  onVisibleKeysChange?: (keys: string[]) => void;
  markerInteraction: ProducerMapMarkerInteraction;
  singlePointZoom?: number;
  messages: {
    openProfile: string;
  };
}) {
  const map = useMap();
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds>(() =>
    map.getBounds(),
  );
  const [zoom, setZoom] = useState(() => map.getZoom());
  const fittedViewRef = useRef<{
    points: readonly ProducerMapMarker[];
    singlePointZoom: number;
    initialFocusKey: string;
    nearbyFocusKey: string;
  } | null>(null);
  const viewModeRef = useRef<"area" | "initial" | "nearby">("area");
  const previewedMapKeyRef = useRef("");
  const handlePreviewKey = useCallback(
    (key: string) => {
      previewedMapKeyRef.current = key;
      onPreviewKey?.(key);
    },
    [onPreviewKey],
  );
  const handlePreviewEndKey = useCallback(
    (key: string) => {
      if (previewedMapKeyRef.current === key) {
        previewedMapKeyRef.current = "";
      }
      onPreviewEndKey?.(key);
    },
    [onPreviewEndKey],
  );
  const clearMapPreview = useCallback(() => {
    const previewedKey = previewedMapKeyRef.current;
    if (!previewedKey) return;

    previewedMapKeyRef.current = "";
    onPreviewEndKey?.(previewedKey);
  }, [onPreviewEndKey]);

  // Register before the fitting effects below. Their non-animated Leaflet
  // moves emit `moveend` synchronously, so a later subscription would miss the
  // initial fitted bounds used by the nearby-first list.
  useMapEvents({
    movestart: clearMapPreview,
    moveend: () => {
      clearMapPreview();
      setViewBounds(map.getBounds());
      setZoom(map.getZoom());
    },
    zoomstart: clearMapPreview,
    zoomend: () => {
      clearMapPreview();
      setViewBounds(map.getBounds());
      setZoom(map.getZoom());
    },
  });

  // Fit only when the effective geometry changes. Navigation state such as a
  // selected producer may rebuild props, but must preserve the user's pan
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

    if (focusRequest.behavior === "preview") {
      map.stop();
      map.panTo([point.latitude, point.longitude], {
        animate: !motionIsReduced(),
        duration: 0.2,
      });
      return;
    }

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

  const visible = useMemo(
    () =>
      points.length > VIEWPORT_THRESHOLD
        ? points.filter((p) => viewBounds.contains([p.latitude, p.longitude]))
        : points,
    [points, viewBounds],
  );
  const visibleKeys = useMemo(() => {
    const center = map.getCenter();

    return points
      .filter((point) => viewBounds.contains([point.latitude, point.longitude]))
      .sort((a, b) => {
        const distance =
          map.distance(center, [a.latitude, a.longitude]) -
          map.distance(center, [b.latitude, b.longitude]);
        return distance || a.key.localeCompare(b.key);
      })
      .map(({ key }) => key);
  }, [map, points, viewBounds]);
  const renderedPoints = useMemo(() => {
    if (!selectedKey) return visible;
    const selectedPoint = visible.find(({ key }) => key === selectedKey);
    if (!selectedPoint) return visible;

    return [...visible.filter(({ key }) => key !== selectedKey), selectedPoint];
  }, [selectedKey, visible]);
  useEffect(() => {
    onVisibleKeysChange?.(visibleKeys);
  }, [onVisibleKeysChange, visibleKeys]);
  const showCategoryMarkers = zoom >= CATEGORY_MARKER_MIN_ZOOM;
  const keyboardAccessible = visible.length <= KEYBOARD_MARKER_LIMIT;

  return (
    <>
      {renderedPoints.map((point) => {
        const selected = selectedKey === point.key;

        return showCategoryMarkers ? (
          <CategoryProducerMarker
            key={point.key}
            point={point}
            selected={selected}
            markerInteraction={markerInteraction}
            onSelectKey={onSelectKey}
            onPreviewKey={handlePreviewKey}
            onPreviewEndKey={handlePreviewEndKey}
            keyboardAccessible={keyboardAccessible}
            messages={messages}
          />
        ) : (
          <OverviewProducerMarker
            key={point.key}
            point={point}
            selected={selected}
            markerInteraction={markerInteraction}
            onSelectKey={onSelectKey}
            onPreviewKey={handlePreviewKey}
            onPreviewEndKey={handlePreviewEndKey}
            keyboardAccessible={keyboardAccessible}
            messages={messages}
          />
        );
      })}
    </>
  );
}

export default function ProducersMapInner({
  points,
  selectedKey,
  focusRequest,
  initialFocusKeys,
  nearbyFocusKeys,
  onNearbyFocusConsumed,
  onSelectKey,
  onPreviewKey,
  onPreviewEndKey,
  onVisibleKeysChange,
  markerInteraction,
  singlePointZoom = 13,
  minZoom = PRODUCER_SELECTION_MIN_ZOOM,
  messages,
  onReady,
}: {
  points: ProducerMapMarker[];
  selectedKey?: string;
  focusRequest?: ProducerMapFocusRequest;
  initialFocusKeys?: string[];
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelectKey?: (key: string) => void;
  onPreviewKey?: (key: string) => void;
  onPreviewEndKey?: (key: string) => void;
  onVisibleKeysChange?: (keys: string[]) => void;
  markerInteraction: ProducerMapMarkerInteraction;
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
        selectedKey={selectedKey}
        focusRequest={focusRequest}
        initialFocusKeys={initialFocusKeys}
        nearbyFocusKeys={nearbyFocusKeys}
        onNearbyFocusConsumed={onNearbyFocusConsumed}
        onSelectKey={onSelectKey}
        onPreviewKey={onPreviewKey}
        onPreviewEndKey={onPreviewEndKey}
        onVisibleKeysChange={onVisibleKeysChange}
        markerInteraction={markerInteraction}
        singlePointZoom={singlePointZoom}
        messages={messages}
      />
    </MapContainer>
  );
}
