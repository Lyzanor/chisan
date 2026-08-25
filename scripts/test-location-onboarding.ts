import assert from "node:assert/strict";
import test from "node:test";

import actualBarcelonaGeography from "../public/generated/catalog-geography/es.json";
import actualGeographyIndex from "../public/generated/catalog-geography/index.json";
import { listCountries } from "../lib/csv-catalog";
import { SUPPORTED_LOCALES } from "../lib/i18n/locales";
import { loadMessages } from "../lib/i18n/messages";
import { listEnabledLocationAreas } from "../lib/location/enabled-location-areas";
import {
  CATALOG_GEOGRAPHY_INDEX_HREF,
  LOCATION_ONBOARDING_STORAGE_KEY,
  LOCATION_REQUEST_OPTIONS,
  buildLocationAreaHref,
  countriesForPosition,
  createCatalogLocationRequest,
  createLocationOnboardingActivation,
  forgetLocationOnboarding,
  readLocationOnboardingStorage,
  rememberLocationOnboardingDismissal,
  type CatalogGeographyIndex,
  type LocationFetch,
  type LocationOnboardingArea,
  type LocationStorage,
} from "../lib/location/location-onboarding";

const BARCELONA_AREA = {
  country: "es",
  area: "barcelona",
  label: "Barcelona",
  defaultLocale: "es",
  publishedLocales: ["ca", "es", "en"],
  preferredLocale: "ca",
} as const satisfies LocationOnboardingArea;

type MemoryStorage = LocationStorage & {
  values: Map<string, string>;
};

function memoryStorage(): MemoryStorage {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

function successfulGeolocation(
  position: { longitude: number; latitude: number; accuracy: number },
  calls: { count: number; options: PositionOptions | undefined },
): Pick<Geolocation, "getCurrentPosition"> {
  return {
    getCurrentPosition(success, _error, options) {
      calls.count += 1;
      calls.options = options;
      success({
        coords: {
          longitude: position.longitude,
          latitude: position.latitude,
          accuracy: position.accuracy,
        },
      } as GeolocationPosition);
    },
  };
}

function failedGeolocation(code: number): Pick<Geolocation, "getCurrentPosition"> {
  return {
    getCurrentPosition(_success, error) {
      error?.({ code } as GeolocationPositionError);
    },
  };
}

function geographyFetcher(requests: { href: string; init: RequestInit }[]): LocationFetch {
  return async (href, init) => {
    requests.push({ href, init });
    return {
      ok: true,
      async json() {
        return href === CATALOG_GEOGRAPHY_INDEX_HREF
          ? actualGeographyIndex
          : actualBarcelonaGeography;
      },
    };
  };
}

test("the neutral home offers only registry areas declared by generated geometry", () => {
  const countries = listCountries();
  const enabled = listEnabledLocationAreas({ countries, locale: "en" });
  assert.deepEqual(
    enabled.map(({ country, area }) => ({ country, area })),
    [{ country: "es", area: "barcelona" }],
  );

  const spain = countries.find(({ slug }) => slug === "es");
  const registryBarcelona = spain?.regions
    .flatMap(({ areas }) => areas)
    .find(({ slug }) => slug === "barcelona");
  assert.ok(registryBarcelona);
  assert.deepEqual(enabled[0], {
    country: "es",
    area: "barcelona",
    label: registryBarcelona.labels.en ?? registryBarcelona.label,
    defaultLocale: registryBarcelona.defaultLocale,
    publishedLocales: registryBarcelona.publishedLocales,
    preferredLocale: registryBarcelona.preferredLocale,
  });
  const serialized = JSON.stringify(enabled);
  for (const forbidden of ["latitude", "longitude", "accuracy", "geolocation"]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});

test("construction performs zero geolocation, fetch, storage or navigation before activation", async () => {
  const rawPosition = {
    longitude: 2.168612345,
    latitude: 41.387412345,
    accuracy: 17.25,
  };
  const geolocationCalls = { count: 0, options: undefined as PositionOptions | undefined };
  const requests: { href: string; init: RequestInit }[] = [];
  const storage = memoryStorage();
  const navigations: string[] = [];
  const lookup = createCatalogLocationRequest({
    geolocation: successfulGeolocation(rawPosition, geolocationCalls),
    fetcher: geographyFetcher(requests),
  });
  const activate = createLocationOnboardingActivation({
    lookup,
    storage,
    areas: [BARCELONA_AREA],
    explicitLocale: "ca",
    browserLocales: ["es"],
    navigate: (href) => navigations.push(href),
  });

  assert.equal(geolocationCalls.count, 0);
  assert.equal(requests.length, 0);
  assert.equal(storage.values.size, 0);
  assert.equal(navigations.length, 0);

  const result = await activate();
  assert.deepEqual(result, {
    status: "navigated",
    area: { country: "es", area: "barcelona" },
    href: "/ca-es/barcelona",
  });
  assert.equal(geolocationCalls.count, 1);
  assert.deepEqual(geolocationCalls.options, LOCATION_REQUEST_OPTIONS);
  assert.deepEqual(
    requests.map(({ href }) => href),
    [
      "/generated/catalog-geography/index.json",
      "/generated/catalog-geography/es.json",
    ],
  );
  assert.deepEqual(navigations, ["/ca-es/barcelona"]);

  const stored = storage.values.get(LOCATION_ONBOARDING_STORAGE_KEY);
  assert.ok(stored);
  assert.deepEqual(JSON.parse(stored), {
    onboarding: "resolved",
    area: { country: "es", area: "barcelona" },
  });
  for (const secret of [
    String(rawPosition.longitude),
    String(rawPosition.latitude),
    String(rawPosition.accuracy),
    "longitude",
    "latitude",
    "accuracy",
  ]) {
    assert.equal(requests.some(({ href }) => href.includes(secret)), false);
    assert.equal(navigations.some((href) => href.includes(secret)), false);
    assert.equal(stored.includes(secret), false);
  }
  assert.equal(requests.every(({ init }) => init.method === "GET"), true);
});

test("country bbox lookup stays local and is not accepted as an area result", async () => {
  const index = actualGeographyIndex as unknown as CatalogGeographyIndex;
  assert.deepEqual(
    countriesForPosition(
      { longitude: -3.7038, latitude: 40.4168, accuracyMeters: 20 },
      index,
    ).map(({ country }) => country),
    ["es"],
  );

  const requests: { href: string; init: RequestInit }[] = [];
  const lookup = createCatalogLocationRequest({
    geolocation: successfulGeolocation(
      { longitude: -3.7038, latitude: 40.4168, accuracy: 20 },
      { count: 0, options: undefined },
    ),
    fetcher: geographyFetcher(requests),
  });
  assert.deepEqual(await lookup(), { status: "failed", reason: "outside" });
  assert.equal(requests.length, 2);
});

test("overlapping coarse country boxes stop without guessing a country asset", async () => {
  const requests: { href: string; init: RequestInit }[] = [];
  const overlappingIndex = structuredClone(actualGeographyIndex) as CatalogGeographyIndex;
  overlappingIndex.countries.push({
    country: "pt",
    bbox: [-10, 35, 4, 44],
    href: "/generated/catalog-geography/pt.json",
    sha256: "0".repeat(64),
  });
  const fetcher: LocationFetch = async (href, init) => {
    requests.push({ href, init });
    return { ok: true, json: async () => overlappingIndex };
  };
  const lookup = createCatalogLocationRequest({
    geolocation: successfulGeolocation(
      { longitude: 2.1686, latitude: 41.3874, accuracy: 20 },
      { count: 0, options: undefined },
    ),
    fetcher,
  });

  assert.deepEqual(await lookup(), { status: "failed", reason: "ambiguous" });
  assert.deepEqual(requests.map(({ href }) => href), [CATALOG_GEOGRAPHY_INDEX_HREF]);
});

test("denial, timeout and unavailable geolocation fail before every fetch", async () => {
  for (const [geolocation, reason] of [
    [failedGeolocation(1), "permission-denied"],
    [failedGeolocation(3), "timeout"],
    [null, "unavailable"],
  ] as const) {
    let fetchCalls = 0;
    const lookup = createCatalogLocationRequest({
      geolocation,
      fetcher: async () => {
        fetchCalls += 1;
        throw new Error("must not fetch");
      },
    });
    assert.deepEqual(await lookup(), { status: "failed", reason });
    assert.equal(fetchCalls, 0);
  }
});

test("failed and unknown-area resolutions preserve manual fallback", async () => {
  for (const lookup of [
    ...(
      [
        "permission-denied",
        "timeout",
        "unavailable",
        "outside",
        "ambiguous",
        "load-failed",
      ] as const
    ).map(
      (reason) => async () => ({ status: "failed", reason } as const),
    ),
    async () => ({ status: "resolved", country: "es", area: "madrid" } as const),
  ]) {
    const storage = memoryStorage();
    const navigations: string[] = [];
    const activate = createLocationOnboardingActivation({
      lookup,
      storage,
      areas: [BARCELONA_AREA],
      explicitLocale: null,
      browserLocales: ["en"],
      navigate: (href) => navigations.push(href),
    });
    assert.equal((await activate()).status, "failed");
    assert.equal(storage.values.size, 0);
    assert.deepEqual(navigations, []);
  }
});

test("explicit locale, browser locale and location storage remain separate", () => {
  assert.equal(buildLocationAreaHref(BARCELONA_AREA, "es", ["ca"]), "/es/barcelona");
  assert.equal(buildLocationAreaHref(BARCELONA_AREA, null, ["ca"]), "/ca-es/barcelona");
  assert.equal(
    buildLocationAreaHref(BARCELONA_AREA, null, ["es", "ca"]),
    "/ca-es/barcelona",
  );
  assert.equal(buildLocationAreaHref(BARCELONA_AREA, null, ["de"]), "/en-es/barcelona");

  const storage = memoryStorage();
  const dismissed = rememberLocationOnboardingDismissal(storage);
  assert.deepEqual(dismissed, { onboarding: "dismissed", area: null });
  assert.deepEqual(readLocationOnboardingStorage(storage), dismissed);
  const raw = storage.values.get(LOCATION_ONBOARDING_STORAGE_KEY) ?? "";
  assert.equal(raw.includes("locale"), false);
  assert.equal(raw.includes("cookie"), false);
  assert.equal(raw.includes("language"), false);
});

test("storage v1 rejects extra position fields and forget removes only its own key", () => {
  const storage = memoryStorage();
  storage.values.set(
    LOCATION_ONBOARDING_STORAGE_KEY,
    JSON.stringify({
      onboarding: "resolved",
      area: { country: "es", area: "barcelona" },
      latitude: 41.3874,
    }),
  );
  storage.values.set("chisan_locale", "ca");
  assert.equal(readLocationOnboardingStorage(storage), null);

  forgetLocationOnboarding(storage);
  assert.equal(storage.values.has(LOCATION_ONBOARDING_STORAGE_KEY), false);
  assert.equal(storage.values.get("chisan_locale"), "ca");
});

test("every presentation dictionary provides the complete typed onboarding message set", async () => {
  const dictionaries = await Promise.all(SUPPORTED_LOCALES.map(loadMessages));
  const expectedErrors = [
    "ambiguous",
    "loadFailed",
    "outside",
    "permissionDenied",
    "timeout",
    "unavailable",
  ];
  for (const dictionary of dictionaries) {
    assert.deepEqual(
      Object.keys(dictionary.locationOnboarding.errors).sort(),
      expectedErrors,
    );
    assert.ok(dictionary.locationOnboarding.description);
    assert.ok(dictionary.locationOnboarding.continueInArea.includes("{area}"));
  }
});
