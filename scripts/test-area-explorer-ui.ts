import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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

test("mobile producers use one attached accessible disclosure", () => {
  for (const surface of [explorer, producerSelectionExplorer]) {
    assert.match(surface, /className="catalog-viewer-toggle"/);
    assert.match(surface, /aria-expanded=\{isMobileListOpen\}/);
    assert.match(surface, /closeListFromOutside/);
    assert.match(surface, /event\.key !== "Escape"/);
  }
  assert.match(explorer, /aria-controls=\{PRODUCER_LIST_ID\}/);
  assert.match(
    producerSelectionExplorer,
    /aria-controls=\{PRODUCER_SELECTION_LIST_ID\}/,
  );
  assert.equal(explorer.match(/className="producer-compact-list"/g)?.length, 1);
  assert.match(styles, /\.catalog-viewer\s*{[^}]*position: relative/);
  assert.match(styles, /\.catalog-viewer-toggle\s*{[^}]*width: 100%/);
  assert.match(
    styles,
    /\.catalog-viewer\.is-mobile-open\s*{[^}]*border-color: var\(--chisan-color-moss\)/,
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
  assert.match(explorer, /requestProducerFocus\(slug\)/);
  assert.match(explorer, /onMouseEnter=\{\(\) => previewProducer\(item\.slug\)\}/);
  assert.match(explorer, /onFocus=\{\(\) => previewProducer\(item\.slug\)\}/);
  assert.match(explorer, /presentedItem\?\.slug === item\.slug \? "is-active"/);
  assert.doesNotMatch(explorer, /is-selected/);
  assert.match(map, /map\.flyTo\(\[point\.latitude, point\.longitude\], zoom/);
  assert.match(explorer, /key: selectedItem\.slug/);
  assert.doesNotMatch(explorer, /key: selectedSlug/);
  assert.doesNotMatch(explorer, /key=\{category \|\| "all"\}/);
  assert.match(
    explorer,
    /if \(closeMobileList && window\.matchMedia[\s\S]*?setExpandedCategory\(null\)/,
  );

  assert.match(producerSelectionExplorer, /selectedKey=\{selectedItem\?\.key\}/);
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
  assert.match(
    selectionDismissal,
    /\.producer-map-hit-area, \.producer-map-circle/,
  );
  assert.match(selectionDismissal, /event\.key === "Escape"/);
  assert.match(selectionDismissal, /returnFocusRef\?\.current\?\.focus\(\)/);
  for (const surface of [explorer, producerSelectionExplorer]) {
    assert.match(surface, /relatedSurfaceRef: viewerRef/);
    assert.match(surface, /returnFocusRef: mapSurfaceRef/);
    assert.match(surface, /tabIndex=\{-1\}/);
  }
  assert.match(explorer, /replaceCatalogState\(clearSelectionHref\)/);
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

test("the producer list follows the visible map and can expand deliberately", () => {
  assert.match(explorer, /mapVisibleProducerKeys/);
  assert.match(
    explorer,
    /onVisibleProducerKeysChange=\{handleVisibleProducerKeysChange\}/,
  );
  assert.match(explorer, /mapVisibleProducerKeys\.flatMap/);
  assert.match(explorer, /const mappedItems = useMemo/);
  assert.match(explorer, /const expandedItems = useMemo/);
  assert.match(explorer, /isFullProducerListVisible \? expandedItems/);
  assert.match(explorer, /model\.catalogMessages\.emptyMapView/);
  assert.match(explorer, /aria-live="polite"/);
  assert.match(explorer, /model\.catalogMessages\.showMore/);
  assert.match(explorer, /model\.catalogMessages\.showMapOnly/);
  assert.match(explorer, /aria-pressed=\{isFullProducerListVisible\}/);
  assert.match(explorer, /aria-controls=\{PRODUCER_RESULTS_ID\}/);
  assert.match(explorer, /onClick=\{toggleProducerScope\}/);
  assert.match(explorer, /\.item\(firstAdditionalResult\)[\s\S]*?\.focus\(\)/);
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
  assert.match(
    map,
    /map\.distance\(center, \[a\.latitude, a\.longitude\]\)/,
  );
  assert.match(map, /onVisibleKeysChange\?\.\(visibleKeys\)/);
  assert.match(map, /setViewBounds\(map\.getBounds\(\)\)/);
});

test("producer rows use the plain locality name", () => {
  assert.match(
    explorer,
    /className="producer-compact-location"[^>]*>[\s\S]*?\{item\.city\}/,
  );
  assert.doesNotMatch(explorer, /municipalityLabel/);
});

test("area-list styles do not change shared producer selection surfaces", () => {
  assert.match(producerSelection, /<ProducerSelectionExplorer/);
  assert.match(producerSelection, /countLabels/);
  assert.match(producerSelection, /itemKeys: items\.map\(\(item\) => item\.key\)/);
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
  assert.match(map, /CATEGORY_MARKER_MIN_ZOOM = 12/);
  assert.match(map, /getCategoryMarkerIcon\(point\.icon, selected\)/);
  assert.match(map, /radius=\{selected \? 10 : 6\}/);
  assert.match(map, /weight: selected \? 3 : 0/);
  assert.match(map, /renderedPoints\.map/);
  assert.match(map, /producer-map-circle--selected/);
  assert.match(map, /className: "producer-map-hit-area"/);
  assert.match(map, /radius=\{14\}/);
  assert.match(map, /onNearbyFocusConsumed\?\.\(\)/);
  assert.doesNotMatch(map, /position\.latitude/);
  assert.doesNotMatch(map, /position\.longitude/);
  assert.match(mapBoundary, /selectedKey\?: string/);
  assert.match(mapBoundary, /onSelectKey\?: \(key: string\) => void/);
  assert.match(
    mapBoundary,
    /markerInteraction \?\? \(onSelectKey \? "select" : "popup"\)/,
  );
  assert.match(map, /interactive=\{markerInteraction === "popup"\}/);
  assert.match(map, /markerInteraction === "select" && onSelectKey/);
  assert.match(producerDetail, /selectedSlug=\{producer\.slug\}/);
  assert.match(producerDetail, /markerInteraction="static"/);
  assert.match(producerDetail, /singlePointZoom=\{16\}/);
  assert.match(producerDetail, /getCategoryIcon\(primaryCategory\)/);
});

test("private device coordinates only choose public producer focus keys", () => {
  assert.match(explorer, /selectNearbyProducerKeys\(/);
  assert.match(explorer, /result\.position/);
  assert.match(explorer, /key: point\.slug/);
  assert.match(explorer, /nearbyFocusKeys=\{nearbyMapFocusKeys\}/);
  assert.doesNotMatch(explorer, /nearbyPosition=/);
});
