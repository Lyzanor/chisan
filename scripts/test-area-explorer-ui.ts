import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { findCatalogSearchMatch } from "../lib/catalog-search";

const explorer = readFileSync("components/area-explorer.tsx", "utf8");
const producerSelection = readFileSync(
  "components/producer-selection-page.tsx",
  "utf8",
);
const producerSelectionExplorer = readFileSync(
  "components/producer-selection-explorer.tsx",
  "utf8",
);
const selectionCard = readFileSync(
  "components/map/producer-map-selection-card.tsx",
  "utf8",
);
const selectionDismissal = readFileSync(
  "components/map/use-dismissible-producer-map-selection.ts",
  "utf8",
);
const producerDetail = readFileSync(
  "app/(catalog)/[catalog]/[area]/[segment]/page.tsx",
  "utf8",
);
const styles = readFileSync("app/globals.css", "utf8");
const map = readFileSync("components/map/producers-map-inner.tsx", "utf8");
const mapBoundary = readFileSync("components/map/producers-map.tsx", "utf8");
const webStyles = readFileSync("design/adapters/web.css", "utf8");

test("the compact discovery header delegates area controls and names the area", () => {
  assert.match(explorer, /<SiteCatalogControlsRegistration/);
  assert.match(explorer, /currentArea=\{model\.area\}/);
  assert.doesNotMatch(explorer, /<AreaSelector\b/);
  assert.doesNotMatch(explorer, /catalogMessages\.summary/);
  assert.match(explorer, /· <span>\{model\.areaLabel\}<\/span>/);
  assert.match(
    styles,
    /\.catalog-simple-categories::\-webkit-scrollbar\s*{[^}]*display: none/,
  );
  assert.match(styles, /scrollbar-width: none/);
});

test("the mobile area roster is visible while profile rosters remain disclosures", () => {
  assert.match(
    explorer,
    /className="catalog-viewer catalog-viewer--persistent"/,
  );
  assert.doesNotMatch(explorer, /className="catalog-viewer-toggle"/);
  assert.doesNotMatch(explorer, /isMobileListOpen/);
  assert.doesNotMatch(explorer, /closeListFromOutside/);
  assert.match(producerSelectionExplorer, /className="catalog-viewer-toggle"/);
  assert.match(producerSelectionExplorer, /aria-expanded=\{isMobileListOpen\}/);
  assert.match(producerSelectionExplorer, /closeListFromOutside/);
  assert.match(producerSelectionExplorer, /event\.key !== "Escape"/);
  assert.match(
    producerSelectionExplorer,
    /aria-controls=\{PRODUCER_SELECTION_LIST_ID\}/,
  );
  assert.equal(explorer.match(/className="producer-compact-list"/g)?.length, 1);
  assert.match(styles, /\.catalog-viewer\s*{[^}]*position: relative/);
  assert.match(styles, /\.catalog-viewer-toggle\s*{[^}]*width: 100%/);
  assert.match(
    styles,
    /\.catalog-viewer--persistent \.catalog-viewer-body\s*{[^}]*display: flex/,
  );
  assert.match(
    styles,
    /\.catalog-viewer\.is-mobile-open \.catalog-viewer-toggle\s*{[^}]*background: var\(--chisan-color-moss-pale\)/,
  );
  assert.doesNotMatch(styles, /\.catalog-viewer\.is-mobile-open\s*{[^}]*gap:/);
});

test("search and producer preview keep the list and map in sync", () => {
  assert.match(explorer, /type="search"/);
  assert.match(explorer, /catalogMessages\.searchPlaceholder/);
  assert.match(explorer, /\.includes\(normalizedSearchQuery\)/);
  assert.match(explorer, /focusRequest=\{mapFocusRequest\}/);
  assert.match(explorer, /onSelectProducer=\{selectMapProducer\}/);
  assert.match(explorer, /requestProducerFocus\(slug, "preview"\)/);
  assert.match(explorer, /requestProducerFocus\(slug, "select"\)/);
  assert.match(
    explorer,
    /onMouseEnter=\{\(\) => previewProducer\(item\.slug\)\}/,
  );
  assert.match(explorer, /onFocus=\{\(\) => previewProducer\(item\.slug\)\}/);
  assert.match(explorer, /onPreviewProducer=\{previewMapProducer\}/);
  assert.match(explorer, /onPreviewProducerEnd=\{clearProducerPreview\}/);
  assert.match(explorer, /presentedItem\?\.slug === item\.slug/);
  assert.match(explorer, /\? "is-active"/);
  assert.match(explorer, /router\.push\(href, \{ scroll: false \}\)/);
  assert.match(explorer, /return \[\.\.\.baseVisibleItems, selectedItem\]/);
  assert.match(
    explorer,
    /selectedListItem\.scrollIntoView\(\{ block: "nearest" \}\)/,
  );
  assert.match(
    explorer,
    /scrollSelectedListItemAfterMapSelectionRef\.current = true/,
  );
  assert.doesNotMatch(explorer, /is-selected/);
  assert.match(map, /map\.flyTo\(\[point\.latitude, point\.longitude\], zoom/);
  assert.match(map, /focusRequest\.behavior === "preview"/);
  assert.match(map, /map\.panInside\(\[point\.latitude, point\.longitude\]/);
  assert.match(explorer, /key: selectedItem\.slug/);
  assert.doesNotMatch(explorer, /key: selectedSlug/);
  assert.doesNotMatch(explorer, /key=\{category \|\| "all"\}/);
  assert.doesNotMatch(explorer, /closeMobileList|setIsMobileListOpen/);
  assert.doesNotMatch(explorer, /setExpandedCategory/);

  assert.match(
    producerSelectionExplorer,
    /selectedKey=\{selectedItem\?\.key\}/,
  );
  assert.match(producerSelectionExplorer, /focusRequest=\{mapFocusRequest\}/);
  assert.match(producerSelectionExplorer, /onSelectKey=\{selectProducer\}/);
  assert.match(producerSelectionExplorer, /requestProducerFocus\(key\)/);
  assert.match(
    producerSelectionExplorer,
    /buildProducerSelectionHighlightHref\(selection\.canonicalPath, key\)/,
  );
  assert.match(
    producerSelectionExplorer,
    /item && mappedKeys\.has\(item\.key\) \? item : undefined/,
  );
  assert.match(
    producerSelectionExplorer,
    /const href = isMapped[\s\S]*?: item\.href/,
  );
  assert.match(
    producerSelectionExplorer,
    /scroll=\{isMapped \? false : undefined\}/,
  );
  assert.doesNotMatch(producerSelectionExplorer, /is-selected/);
  assert.doesNotMatch(producerSelectionExplorer, /producer-compact-detail/);
});

test("search highlights preserve original spelling and Unicode ranges", () => {
  assert.deepEqual(findCatalogSearchMatch("Aranjuez", "aran"), {
    start: 0,
    end: 4,
  });
  assert.deepEqual(findCatalogSearchMatch("Penedès", "penedes"), {
    start: 0,
    end: 7,
  });
  assert.deepEqual(findCatalogSearchMatch("Cafe\u0301", "café"), {
    start: 0,
    end: 5,
  });
  assert.equal(findCatalogSearchMatch("Aranjuez", "vino"), null);
  assert.equal(findCatalogSearchMatch("Aranjuez", ""), null);
  assert.match(explorer, /<mark className="catalog-search-match">/);
  assert.match(explorer, /const matchingCategoryText = normalizedSearchQuery/);
  assert.match(explorer, /text=\{matchingCategoryText\}/);
  assert.match(styles, /\.catalog-search-match[\s\S]*moss-pale/);
});

test("selected producer information is one dismissible profile surface", () => {
  assert.match(explorer, /<ProducerMapSelectionCard/);
  assert.match(producerSelectionExplorer, /<ProducerMapSelectionCard/);
  assert.match(selectionCard, /className="producer-map-selection-card__link"/);
  assert.match(selectionCard, /src=\{producer\.imageSrc\}/);
  assert.match(selectionCard, /alt=""/);
  assert.match(selectionCard, /loading="lazy"/);
  assert.match(selectionCard, /producer\.description/);
  assert.match(explorer, /useDismissibleProducerMapSelection\(/);
  assert.match(
    producerSelectionExplorer,
    /useDismissibleProducerMapSelection\(/,
  );
  assert.match(selectionDismissal, /dismissFromOutside/);
  assert.match(selectionDismissal, /relatedSurfaceRef\?\.current\?\.contains/);
  assert.match(selectionDismissal, /\.producer-map-category-marker/);
  assert.match(selectionDismissal, /\.producer-map-hit-area/);
  assert.match(selectionDismissal, /event\.key === "Escape"/);
  assert.match(selectionDismissal, /returnFocusRef\?\.current\?\.focus\(\)/);
  for (const surface of [explorer, producerSelectionExplorer]) {
    assert.match(surface, /relatedSurfaceRef: viewerRef/);
    assert.match(surface, /returnFocusRef: mapSurfaceRef/);
    assert.match(surface, /tabIndex=\{-1\}/);
  }
  assert.match(
    explorer,
    /router\.replace\(clearSelectionHref, \{ scroll: false \}\)/,
  );
  assert.match(
    producerSelectionExplorer,
    /replaceSelectionState\(clearSelectionHref\)/,
  );
  assert.doesNotMatch(explorer, /catalogMessages\.selected/);
  assert.doesNotMatch(
    explorer,
    />\s*\{model\.catalogMessages\.openProfile\}\s*</,
  );
});

test("the producer list keeps nearby priority without a map-only scope", () => {
  assert.match(explorer, /prioritizedProducerKeys/);
  assert.match(
    explorer,
    /onVisibleProducerKeysChange=\{handleVisibleProducerKeysChange\}/,
  );
  assert.match(explorer, /prioritizedProducerKeys\.flatMap/);
  assert.match(explorer, /const mappedItems = useMemo/);
  assert.match(explorer, /const orderedItems = useMemo/);
  assert.match(explorer, /orderedItems\.slice\(0, VISIBLE_PRODUCER_LIMIT\)/);
  assert.match(
    explorer,
    /const listOrderLockedCategoryRef = useRef<string \| null>\(null\)/,
  );
  assert.match(
    explorer,
    /if \(listOrderLockedCategoryRef\.current === category\) return/,
  );
  assert.match(
    explorer,
    /function previewProducer[\s\S]*?listOrderLockedCategoryRef\.current = category/,
  );
  assert.match(explorer, /model\.catalogMessages\.emptyMapView/);
  assert.match(explorer, /aria-live="polite"/);
  assert.doesNotMatch(explorer, /catalogMessages\.showMore/);
  assert.doesNotMatch(explorer, /catalogMessages\.showMapOnly/);
  assert.doesNotMatch(explorer, /toggleProducerScope/);
  assert.doesNotMatch(explorer, /catalog-viewer-scope/);
  assert.match(
    mapBoundary,
    /onVisibleProducerKeysChange\?: \(keys: string\[\]\) => void/,
  );
  assert.match(
    mapBoundary,
    /onVisibleKeysChange=\{onVisibleProducerKeysChange\}/,
  );
  assert.match(
    map,
    /viewBounds\.contains\(\[point\.latitude, point\.longitude\]\)/,
  );
  assert.match(map, /map\.distance\(center, \[a\.latitude, a\.longitude\]\)/);
  assert.match(map, /onVisibleKeysChange\?\.\(visibleKeys\)/);
  assert.match(map, /setViewBounds\(map\.getBounds\(\)\)/);
});

test("producer rows use the plain locality name", () => {
  assert.match(
    explorer,
    /className="producer-compact-location"[^>]*>[\s\S]*?<SearchMatch text=\{item\.city\}/,
  );
  assert.doesNotMatch(explorer, /municipalityLabel/);
});

test("area-list styles do not change shared producer selection surfaces", () => {
  assert.match(producerSelection, /<ProducerSelectionExplorer/);
  assert.match(producerSelection, /countLabels/);
  assert.match(
    producerSelection,
    /itemKeys: items\.map\(\(item\) => item\.key\)/,
  );
  assert.doesNotMatch(producerSelection, /ProducerSelectionMap/);
  assert.doesNotMatch(producerSelectionExplorer, /getCategoryIcon/);
  assert.match(producerSelectionExplorer, /\{item\.icon\}/);
  assert.doesNotMatch(styles, /\.producer-compact-list li\.is-selected/);
  assert.match(
    styles,
    /\.producer-compact-link \.producer-compact-location\s*\{[^}]*font-weight: 500/,
  );
  assert.match(styles, /\.producer-compact-link\s*\{[^}]*min-height: 44px/);
  assert.match(
    styles,
    /\.catalog-page \.producer-compact-link \.producer-compact-location\s*\{[^}]*font-weight: 400/,
  );
  assert.match(
    styles,
    /\.catalog-page \.catalog-viewer-head h2\s*\{[^}]*display: none/,
  );
  assert.doesNotMatch(
    styles,
    /(?:^|\n)\s*\.catalog-viewer-head h2\s*\{[^}]*display: none/,
  );
});

test("shared maps keep all points while supporting nearby and interactive focus", () => {
  assert.match(mapBoundary, /initialFocusKeys\?: string\[\]/);
  assert.match(mapBoundary, /nearbyFocusKeys\?: string\[\]/);
  assert.doesNotMatch(mapBoundary, /ProducerMapNearbyPosition/);
  assert.doesNotMatch(mapBoundary, /nearbyPosition/);
  assert.match(map, /getPointsForKeys\(points, initialFocusKeys\)/);
  assert.match(map, /getPointsForKeys\(points, nearbyFocusKeys\)/);
  assert.match(map, /getCategoryMarkerIcon\(point\.icon, selected\)/);
  assert.match(map, /renderedPoints\.map/);
  assert.match(map, /<Marker/);
  assert.match(map, /const interactive = markerInteraction !== "static"/);
  assert.match(map, /CATEGORY_MARKER_MIN_ZOOM = 11/);
  assert.match(map, /<CircleMarker/);
  assert.match(map, /className="producer-map-circle"/);
  assert.match(map, /className="producer-map-hit-area"/);
  assert.doesNotMatch(map, /pathOptions=\{\{\s*className:/);
  assert.match(map, /radius=\{22\}/);
  assert.match(map, /zIndexOffset=\{selected \? 1_000 : 0\}/);
  assert.match(map, /element\.setAttribute\("aria-label", label\)/);
  assert.match(map, /const previewedMapKeyRef = useRef\(""\)/);
  assert.match(map, /movestart: clearMapPreview/);
  assert.match(map, /moveend: \(\) => \{\s*clearMapPreview\(\)/);
  assert.doesNotMatch(map, /key=\{`\$\{point\.key\}:\$\{selected/);
  assert.match(map, /onNearbyFocusConsumed\?\.\(\)/);
  assert.doesNotMatch(map, /position\.latitude/);
  assert.doesNotMatch(map, /position\.longitude/);
  assert.match(mapBoundary, /selectedKey\?: string/);
  assert.match(mapBoundary, /onSelectKey\?: \(key: string\) => void/);
  assert.match(
    mapBoundary,
    /markerInteraction \?\? \(onSelectKey \? "select" : "popup"\)/,
  );
  assert.match(map, /const selectable = markerInteraction === "select"/);
  assert.match(producerDetail, /selectedSlug=\{producer\.slug\}/);
  assert.match(producerDetail, /markerInteraction="static"/);
  assert.match(producerDetail, /singlePointZoom=\{16\}/);
  assert.match(producerDetail, /getCategoryIcon\(primaryCategory\)/);
  assert.doesNotMatch(producerDetail, /DetailDesktopNav/);
  assert.doesNotMatch(producerDetail, /detail-secondary-links/);
  assert.doesNotMatch(producerDetail, /backToMap/);
  assert.doesNotMatch(producerDetail, /detail-back-link/);
  assert.doesNotMatch(producerDetail, /detail-mobile-bar/);
});

test("map tooltips and category pills use restrained contextual motion", () => {
  assert.match(map, /className="producer-map-tooltip"/);
  assert.match(map, /point\.city, point\.categories\[0\]/);
  assert.match(webStyles, /\.catalog-chip:active[\s\S]*translateY/);
  assert.match(webStyles, /@keyframes chisan-map-marker-emphasis/);
  assert.match(webStyles, /@keyframes chisan-map-tooltip-in/);
  assert.match(
    webStyles,
    /prefers-reduced-motion[\s\S]*\.catalog-chip[\s\S]*animation: none/,
  );
});

test("producer profile actions and ownership placement stay coherent", () => {
  assert.match(
    producerDetail,
    /href=\{`mailto:\$\{email\}`\}>\{actionLabels\.contact\}<\/a>/,
  );
  assert.match(
    producerDetail,
    /href=\{facebook\}[\s\S]*?\{messages\.fieldLabels\.facebook\}/,
  );
  assert.match(
    producerDetail,
    /<\/section>\s*<Suspense fallback=\{null\}>\s*<ProducerAccountActions[\s\S]*?<section className="detail-related"/,
  );
  assert.doesNotMatch(styles, /\.detail-desktop-nav/);
  assert.doesNotMatch(styles, /\.detail-secondary-links/);
});

test("private device coordinates only choose public producer focus keys", () => {
  assert.match(explorer, /selectNearbyProducerKeys\(/);
  assert.match(explorer, /result\.position/);
  assert.match(explorer, /key: point\.slug/);
  assert.match(explorer, /nearbyFocusKeys=\{nearbyMapFocusKeys\}/);
  assert.doesNotMatch(explorer, /nearbyPosition=/);
});
