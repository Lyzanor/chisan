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
  type ReactNode,
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
import { AnchoredMapPreview } from "./anchored-map-preview";
import { VisitorLocationMarker } from "./visitor-location-marker";
import { MapLocateControl } from "./map-locate-control";
import {
  checkVisitorLocationPermission,
  requestVisitorPosition,
  useVisitorPosition,
  type VisitorPosition,
} from "@/lib/location/visitor-position";

import {
  PRODUCER_SELECTION_MIN_ZOOM,
  type ProducerMapMarker,
} from "@/lib/producer-selections";
import { NEARBY_PRODUCER_FOCUS_MINIMUM } from "@/lib/location/nearby-producer-focus";
import {
  PRODUCER_GROUP_DETAIL_ZOOM,
  PRODUCER_GROUP_MIN_POINTS,
  mergeOverlappingProducerGroups,
  selectOpeningProducerPoints,
  shouldGroupProducerMap,
  summarizeProducerMapGroups,
  type ProducerMapGroup,
} from "@/lib/producer-map-groups";

import type {
  ProducerMapFocusRequest,
  ProducerMapGroupOverview,
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
// A ratio margin would cost a whole zoom level at country scale.
const OPENING_VIEW_PADDING = 24;
const EMPTY_FOCUS_KEYS: string[] = [];
const GROUP_MARKER_HEIGHT = 32;
const GROUP_MARKER_TARGET = 44;
const categoryMarkerIconCache = new Map<string, L.DivIcon>();
const groupMarkerIconCache = new Map<string, L.DivIcon>();

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

// 14px tabular figures, 12px side padding and a 1px edge; never below the target.
function measureGroupMarker(text: string): { width: number; height: number } {
  return {
    width: Math.max(GROUP_MARKER_TARGET, Math.ceil(26 + text.length * 8.5)),
    height: GROUP_MARKER_HEIGHT,
  };
}

function getGroupMarkerIcon(text: string): L.DivIcon {
  const cached = groupMarkerIconCache.get(text);
  if (cached) return cached;

  const { width } = measureGroupMarker(text);
  // `text` is a locale-formatted integer, never catalog prose.
  const markerIcon = L.divIcon({
    className: "producer-map-group-marker",
    html: `<span aria-hidden="true" class="producer-map-group-count">${text}</span>`,
    iconAnchor: [width / 2, GROUP_MARKER_TARGET / 2],
    iconSize: [width, GROUP_MARKER_TARGET],
  });
  groupMarkerIconCache.set(text, markerIcon);
  return markerIcon;
}

const ProducerGroupMarker = memo(function ProducerGroupMarker({
  group,
  overview,
  onActivate,
}: {
  group: ProducerMapGroup;
  overview: ProducerMapGroupOverview;
  onActivate: (group: ProducerMapGroup) => void;
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);
  const description = overview.describe(
    group.members.map(({ label }) => label),
    group.count,
  );

  useEffect(() => {
    const layer = markerRef.current;
    const element = layer?.getElement();
    if (!layer || !element) return;

    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("aria-label", description.label);

    function handleFocus() {
      layer?.openTooltip();
    }

    function handleBlur() {
      layer?.closeTooltip();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      event.stopPropagation();
      onActivate(group);
      // The count disappears as its points open; keep keyboard focus on the map.
      map.getContainer().focus({ preventScroll: true });
    }

    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);
    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [description.label, group, map, onActivate]);

  return (
    <Marker
      ref={markerRef}
      position={[group.latitude, group.longitude]}
      icon={getGroupMarkerIcon(overview.formatCount(group.count))}
      riseOnHover
      eventHandlers={{ click: () => onActivate(group) }}
    >
      <Tooltip
        className="producer-map-tooltip"
        direction="top"
        offset={[0, -16]}
        opacity={0.98}
      >
        <span className="producer-map-tooltip__content">
          <strong>{description.areas}</strong>
          <span>{description.producers}</span>
        </span>
      </Tooltip>
    </Marker>
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
  padding?: number,
): void {
  if (points.length === 1) {
    map.setView([points[0].latitude, points[0].longitude], singlePointZoom, {
      animate: false,
    });
    return;
  }

  const bounds = getPointsBounds(points);
  if (!bounds) return;
  map.fitBounds(padding === undefined ? bounds.pad(0.2) : bounds, {
    animate: false,
    ...(padding === undefined ? {} : { padding: [padding, padding] }),
    ...(maxZoom === undefined ? {} : { maxZoom }),
  });
}

function BoundsAwareMarkers({
  points,
  selectedKey,
  selectionContent,
  focusRequest,
  focusPaddingBottom = 0,
  initialFocusKeys = EMPTY_FOCUS_KEYS,
  nearbyFocusKeys = EMPTY_FOCUS_KEYS,
  onNearbyFocusConsumed,
  onSelectKey,
  onPreviewKey,
  onPreviewEndKey,
  onVisibleKeysChange,
  markerInteraction,
  singlePointZoom = 13,
  groupOverview,
  openOnMainCluster = false,
  messages,
}: {
  points: ProducerMapMarker[];
  selectedKey?: string;
  selectionContent?: ReactNode;
  focusRequest?: ProducerMapFocusRequest;
  focusPaddingBottom?: number;
  initialFocusKeys?: string[];
  nearbyFocusKeys?: string[];
  onNearbyFocusConsumed?: () => void;
  onSelectKey?: (key: string) => void;
  onPreviewKey?: (key: string) => void;
  onPreviewEndKey?: (key: string) => void;
  onVisibleKeysChange?: (keys: string[]) => void;
  markerInteraction: ProducerMapMarkerInteraction;
  singlePointZoom?: number;
  groupOverview?: ProducerMapGroupOverview;
  openOnMainCluster?: boolean;
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

  // The shelf layout and responsive panels can resize a map without a window
  // resize. Keep Leaflet's pixel origin in sync while preserving pan and zoom.
  useEffect(() => {
    const resize = () => map.invalidateSize({ animate: false });
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

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
    if (openOnMainCluster && points.length > PRODUCER_GROUP_MIN_POINTS) {
      fitProducerPoints(
        map,
        selectOpeningProducerPoints(points),
        singlePointZoom,
        10,
        OPENING_VIEW_PADDING,
      );
      return;
    }
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
    openOnMainCluster,
    points,
    singlePointZoom,
  ]);

  useEffect(() => {
    if (!focusRequest) return;
    const point = points.find(({ key }) => key === focusRequest.key);
    if (!point) return;

    // A paired image/map view can keep the map hidden on phones. Leaflet cannot
    // project a focus point until that surface has measurable dimensions.
    const size = map.getSize();
    if (size.x <= 0 || size.y <= 0 || !Number.isFinite(map.getZoom())) return;

    const zoom = focusRequest.behavior === "preview" ? map.getZoom() : Math.max(map.getZoom(), PRODUCER_FOCUS_ZOOM);
    // Centre the point in the geography left visible above discovery cards.
    const target = map.unproject(map.project([point.latitude, point.longitude], zoom)
      .add([0, Math.min(focusPaddingBottom, map.getSize().y / 2) / 2]), zoom);
    if (!Number.isFinite(target.lat) || !Number.isFinite(target.lng)) return;
    map.stop();
    if (focusRequest.behavior === "preview") {
      map.panTo(target, {
        animate: !motionIsReduced(),
        duration: 0.2,
      });
      return;
    }

    if (motionIsReduced()) {
      map.setView(target, zoom, { animate: false });
      return;
    }
    map.flyTo(target, zoom, {
      animate: true,
      duration: 0.32,
    });
  }, [focusRequest, focusPaddingBottom, map, points]);

  const groups = useMemo(
    () => (groupOverview ? summarizeProducerMapGroups(points) : []),
    [groupOverview, points],
  );
  const grouped = shouldGroupProducerMap({
    zoom,
    pointCount: points.length,
    groupCount: groups.length,
  });
  const placedGroups = useMemo(() => {
    if (!grouped || !groupOverview) return [];

    return mergeOverlappingProducerGroups(groups, (group) => {
      const { x, y } = map.project([group.latitude, group.longitude], zoom);
      return { x, y, ...measureGroupMarker(groupOverview.formatCount(group.count)) };
    });
  }, [groupOverview, grouped, groups, map, zoom]);
  const zoomToGroup = useCallback(
    (group: ProducerMapGroup) => {
      const bounds = L.latLngBounds(
        [group.south, group.west],
        [group.north, group.east],
      );
      // One area opens its exact points; a combined count first separates its areas.
      const minimumZoom =
        group.members.length === 1 ? PRODUCER_GROUP_DETAIL_ZOOM : map.getZoom() + 1;
      const targetZoom = Math.min(
        Math.max(map.getBoundsZoom(bounds.pad(0.2)), minimumZoom),
        PRODUCER_FOCUS_ZOOM,
      );
      map.stop();
      if (motionIsReduced()) {
        map.setView(bounds.getCenter(), targetZoom, { animate: false });
        return;
      }
      map.flyTo(bounds.getCenter(), targetZoom, { animate: true, duration: 0.32 });
    },
    [map],
  );
  const visible = useMemo(
    () =>
      grouped
        ? []
        : points.length > VIEWPORT_THRESHOLD
          ? points.filter((p) => viewBounds.contains([p.latitude, p.longitude]))
          : points,
    [grouped, points, viewBounds],
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
  const presentedPoint = points.find(({ key }) => key === selectedKey);

  return (
    <>
      {selectionContent && presentedPoint ? (
        <AnchoredMapPreview point={presentedPoint}>
          {selectionContent}
        </AnchoredMapPreview>
      ) : null}
      {grouped && groupOverview
        ? placedGroups.map((group) => (
            <ProducerGroupMarker
              key={group.members.map(({ key }) => key).join("\0")}
              group={group}
              overview={groupOverview}
              onActivate={zoomToGroup}
            />
          ))
        : null}
      {grouped && presentedPoint ? (
        // Keeps the previewed card anchored while its neighbours are counted.
        <OverviewProducerMarker
          point={presentedPoint}
          selected
          markerInteraction="static"
          keyboardAccessible={false}
          messages={messages}
        />
      ) : null}
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
  selectionContent,
  focusRequest,
  focusPaddingBottom = 0,
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
  groupOverview,
  openOnMainCluster,
  visitorPosition: propVisitorPosition,
  messages,
  onReady,
}: {
  points: ProducerMapMarker[];
  selectedKey?: string;
  selectionContent?: ReactNode;
  focusRequest?: ProducerMapFocusRequest;
  focusPaddingBottom?: number;
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
  groupOverview?: ProducerMapGroupOverview;
  openOnMainCluster?: boolean;
  visitorPosition?: VisitorPosition | null;
  messages: {
    openProfile: string;
  };
  onReady: () => void;
}) {
  const initialCenter = getInitialCenter(points);
  const initialZoom = points.length === 1 ? singlePointZoom : 10;
  const detectedPosition = useVisitorPosition();
  const effectiveVisitorPosition = propVisitorPosition ?? detectedPosition;

  useEffect(() => {
    if (effectiveVisitorPosition) return;
    let cancelled = false;

    checkVisitorLocationPermission().then((permissionState) => {
      if (cancelled || permissionState !== "granted") return;
      void requestVisitorPosition();
    });

    return () => {
      cancelled = true;
    };
  }, [effectiveVisitorPosition]);

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
        selectionContent={selectionContent}
        focusRequest={focusRequest}
        focusPaddingBottom={focusPaddingBottom}
        initialFocusKeys={initialFocusKeys}
        nearbyFocusKeys={nearbyFocusKeys}
        onNearbyFocusConsumed={onNearbyFocusConsumed}
        onSelectKey={onSelectKey}
        onPreviewKey={onPreviewKey}
        onPreviewEndKey={onPreviewEndKey}
        onVisibleKeysChange={onVisibleKeysChange}
        markerInteraction={markerInteraction}
        singlePointZoom={singlePointZoom}
        groupOverview={groupOverview}
        openOnMainCluster={openOnMainCluster}
        messages={messages}
      />
      {effectiveVisitorPosition ? (
        <VisitorLocationMarker position={effectiveVisitorPosition} />
      ) : null}
      <MapLocateControl />
    </MapContainer>
  );
}
