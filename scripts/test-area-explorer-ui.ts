import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const explorer = readFileSync("components/area-explorer.tsx", "utf8");
const producerSelection = readFileSync(
  "components/producer-selection-page.tsx",
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
  assert.match(explorer, /className="catalog-viewer-toggle"/);
  assert.match(explorer, /aria-expanded=\{isMobileListOpen\}/);
  assert.match(explorer, /aria-controls=\{PRODUCER_LIST_ID\}/);
  assert.match(explorer, /closeListFromOutside/);
  assert.match(explorer, /event\.key !== "Escape"/);
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

test("list selection focuses the producer on the map without a selected row", () => {
  assert.match(explorer, /focusRequest=\{mapFocusRequest\}/);
  assert.match(explorer, /onSelectProducer=\{selectMapProducer\}/);
  assert.match(explorer, /requestProducerFocus\(slug\)/);
  assert.doesNotMatch(explorer, /className=\{highlightedItem\?\.slug/);
  assert.doesNotMatch(explorer, /is-selected/);
  assert.match(map, /map\.flyTo\(\[point\.latitude, point\.longitude\], zoom/);
  assert.match(explorer, /key: highlightedItem\.slug/);
  assert.doesNotMatch(explorer, /key: highlightedSlug/);
  assert.doesNotMatch(explorer, /key=\{category \|\| "all"\}/);
  assert.match(
    explorer,
    /if \(closeMobileList && window\.matchMedia[\s\S]*?setExpandedCategory\(null\)/,
  );
});

test("selected producer information is one dismissible profile surface", () => {
  assert.match(explorer, /className="catalog-featured-producer__link"/);
  assert.match(explorer, /src=\{highlightedItem\.imageSrc\}/);
  assert.match(explorer, /alt=""/);
  assert.match(explorer, /loading="lazy"/);
  assert.match(explorer, /highlightedItem\.description/);
  assert.match(explorer, /clearFromOutside/);
  assert.match(explorer, /replaceCatalogState\(clearHighlightHref\)/);
  assert.doesNotMatch(explorer, /catalog-featured-producer__clear/);
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
  assert.match(producerSelection, /className="producer-compact-detail"/);
  assert.match(producerSelection, /className="catalog-viewer-head"/);
  assert.match(
    styles,
    /\.producer-compact-detail\s*\{[^}]*color: var\(--accent\)/,
  );
  assert.match(
    styles,
    /\.producer-compact-link \.producer-compact-location\s*\{[^}]*font-weight: 500/,
  );
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
  assert.match(map, /radius=\{highlighted \? 10 : 6\}/);
  assert.match(map, /weight: highlighted \? 3 : 0/);
  assert.match(map, /renderedPoints\.map/);
  assert.match(map, /className: "producer-map-hit-area"/);
  assert.match(map, /radius=\{14\}/);
  assert.match(map, /onNearbyFocusConsumed\?\.\(\)/);
  assert.doesNotMatch(map, /position\.latitude/);
  assert.doesNotMatch(map, /position\.longitude/);
});

test("private device coordinates only choose public producer focus keys", () => {
  assert.match(explorer, /selectNearbyProducerKeys\(/);
  assert.match(explorer, /result\.position/);
  assert.match(explorer, /key: point\.slug/);
  assert.match(explorer, /nearbyFocusKeys=\{nearbyMapFocusKeys\}/);
  assert.doesNotMatch(explorer, /nearbyPosition=/);
});
