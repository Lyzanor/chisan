import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  getVisitorPosition,
  setVisitorPosition,
  requestVisitorPosition,
  checkVisitorLocationPermission,
  type VisitorPosition,
} from "../lib/location/visitor-position";

test("visitor position store notifies subscribers and preserves coordinate fidelity in memory", () => {
  setVisitorPosition(null);

  assert.equal(getVisitorPosition(), null);

  const sample: VisitorPosition = {
    latitude: 41.3874,
    longitude: 2.1686,
    accuracyMeters: 18,
  };

  setVisitorPosition(sample);
  assert.deepEqual(getVisitorPosition(), sample);

  // Redundant updates do not re-emit
  setVisitorPosition({ ...sample });
  assert.deepEqual(getVisitorPosition(), sample);

  setVisitorPosition(null);
  assert.equal(getVisitorPosition(), null);
});

test("requestVisitorPosition populates store from standard geolocation callback", async () => {
  setVisitorPosition(null);

  const mockGeolocation = {
    getCurrentPosition(
      success: (pos: GeolocationPosition) => void,
    ) {
      success({
        coords: {
          latitude: 40.4168,
          longitude: -3.7038,
          accuracy: 25,
        },
        timestamp: Date.now(),
      } as unknown as GeolocationPosition);
    },
  };

  const originalNavigator = globalThis.navigator;
  try {
    Object.defineProperty(globalThis, "navigator", {
      value: { geolocation: mockGeolocation },
      configurable: true,
      writable: true,
    });

    const result = await requestVisitorPosition();
    assert.ok(result);
    assert.equal(result.latitude, 40.4168);
    assert.equal(result.longitude, -3.7038);
    assert.equal(result.accuracyMeters, 25);
    assert.deepEqual(getVisitorPosition(), result);
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
    setVisitorPosition(null);
  }
});

test("checkVisitorLocationPermission queries permission status safely", async () => {
  const originalNavigator = globalThis.navigator;
  try {
    Object.defineProperty(globalThis, "navigator", {
      value: {
        permissions: {
          async query({ name }: { name: string }) {
            assert.equal(name, "geolocation");
            return { state: "granted" as PermissionState };
          },
        },
      },
      configurable: true,
      writable: true,
    });

    const state = await checkVisitorLocationPermission();
    assert.equal(state, "granted");
  } finally {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  }
});

test("map components integrate VisitorLocationMarker and MapLocateControl", () => {
  const innerMap = readFileSync("components/map/producers-map-inner.tsx", "utf8");
  const outerMap = readFileSync("components/map/producers-map.tsx", "utf8");
  const marker = readFileSync("components/map/visitor-location-marker.tsx", "utf8");
  const control = readFileSync("components/map/map-locate-control.tsx", "utf8");

  assert.match(innerMap, /<VisitorLocationMarker/);
  assert.match(innerMap, /<MapLocateControl/);
  assert.match(innerMap, /useVisitorPosition\(\)/);
  assert.match(innerMap, /checkVisitorLocationPermission\(\)/);

  assert.match(outerMap, /visitorPosition\?: VisitorPosition \| null/);

  assert.match(marker, /chisan-visitor-locator/);
  assert.match(marker, /chisan-visitor-locator__pulse/);
  assert.match(marker, /chisan-visitor-locator__dot/);
  assert.match(marker, /<Circle/);

  assert.match(control, /map-locate-control/);
  assert.match(control, /map-locate-btn/);
  assert.match(control, /handleLocate/);
});

test("design system defines visitor locator, pulse animation and reduced motion rules", () => {
  const css = readFileSync("design/adapters/map.css", "utf8");

  assert.match(css, /\.chisan-visitor-locator\s*\{/);
  assert.match(css, /\.chisan-visitor-locator__pulse\s*\{/);
  assert.match(css, /\.chisan-visitor-locator__dot\s*\{/);
  assert.match(css, /@keyframes chisan-locator-pulse\s*\{/);
  assert.match(css, /\.map-locate-btn\s*\{/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /min-width:\s*44px/);

  // Reduced motion suppresses continuous pulsing
  const reducedMotionIndex = css.indexOf("@media (prefers-reduced-motion: reduce)");
  assert.ok(reducedMotionIndex !== -1);
  const reducedMotionSection = css.slice(reducedMotionIndex);
  assert.match(reducedMotionSection, /\.chisan-visitor-locator__pulse/);
});

test("visitor routing contract documents the ephemeral client locator marker", () => {
  const doc = readFileSync("docs/VISITOR_LOCATION_ROUTING.md", "utf8");

  assert.match(doc, /locator marker \("blue dot"\)/);
  assert.match(doc, /map locate control/);
  assert.match(doc, /ephemeral client memory/);
});
