import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { catalogAreas, fetchJson, fetchProducers, mobileOrigin, producerSearchPath, savedArea, serializeArea, webUrl, CatalogChangedError } from "../apps/mobile/src/catalog";
import { locateArea } from "../apps/mobile/src/location";

const origin = "https://chisan.app";
const area = { country: "es", area: "barcelona", label: "Barcelona", countryLabel: "España" };

test("mobile reads only published discovery and revalidates the device preference", () => {
  const areas = catalogAreas({ schema_version: "1.0", countries: [{ slug: "es", name: "España", default_locale: "es", regions: [{ slug: "catalunya", name: "Catalunya", areas: [{ slug: "barcelona", name: "Barcelona", locales: ["es", "ca"] }] }] }] });
  assert.deepEqual(areas, [area]);
  assert.deepEqual(savedArea(serializeArea(area), areas), area);
  assert.equal(savedArea(serializeArea(area), []), null);
  assert.equal(savedArea("invalid", areas), null);
  assert.equal(savedArea('{"onboarding":"resolved","area":{"country":"es","area":"barcelona","latitude":42}}', areas), null);
  assert.deepEqual(JSON.parse(serializeArea(area)), { onboarding: "resolved", area: { country: "es", area: "barcelona" } });
});

test("mobile refuses untrusted origins and never navigates a credential-bearing catalog URL", () => {
  assert.equal(mobileOrigin(undefined, false), origin);
  assert.equal(mobileOrigin("http://192.168.1.10:3000", true), "http://192.168.1.10:3000");
  for (const value of ["http://chisan.app", "https://user:secret@chisan.app", "https://chisan.app/path", "https://chisan.app?token=secret"]) assert.throws(() => mobileOrigin(value, false));
  assert.equal(webUrl("https://chisan.app/es/barcelona/example", "http://localhost:3000"), "http://localhost:3000/es/barcelona/example");
  for (const value of ["https://evil.test/foo", "//evil.test", "https://user:secret@chisan.app/"]) assert.throws(() => webUrl(value, origin));
  const url = new URL(producerSearchPath(area), origin);
  assert.deepEqual([...url.searchParams.keys()].sort(), ["area", "country", "limit"]);
});

test("denied location never reads a point or contacts a service", async () => {
  let reads = 0;
  assert.equal(await locateArea({ requestPermission: async () => false, readPosition: async () => { reads++; throw new Error(); } }, origin, [area]), null);
  assert.equal(reads, 0);
});

test("native location reuses the reviewed boundaries without sending coordinates and discards its point", async (t) => {
  const paths: string[] = [];
  t.mock.method(globalThis, "fetch", async (input: string) => {
    const url = new URL(input);
    paths.push(url.pathname);
    assert.equal(url.search, "");
    return new Response(readFileSync(`public${url.pathname}`, "utf8"), { status: 200 });
  });
  const device = { requestPermission: async () => true, readPosition: async () => ({ latitude: 41.3874, longitude: 2.1686, accuracyMeters: 30 }) };
  assert.deepEqual(await locateArea(device, origin, [area]), area);
  assert.deepEqual(paths, ["/generated/catalog-geography/index.json", "/generated/catalog-geography/es.json"]);
  assert.equal(await locateArea(device, origin, []), null, "prepared geometry cannot enable a standby area");
});

test("invalid position and missing geometry fall back to manual selection", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 503 }));
  assert.equal(await locateArea({ requestPermission: async () => true, readPosition: async () => ({ latitude: NaN, longitude: 0, accuracyMeters: 1 }) }, origin, [area]), null);
});

test("catalog requests are anonymous, native account checks use Bearer, and revision errors remain recoverable", async (t) => {
  const calls: RequestInit[] = [];
  t.mock.method(globalThis, "fetch", async (_url: string, init: RequestInit) => {
    calls.push(init);
    return new Response(JSON.stringify({ status: "active" }), { status: 200 });
  });
  await fetchJson(origin, "/api/catalog/v1");
  await fetchJson(origin, "/api/mobile/account", "test-session");
  assert.equal(calls[0].credentials, "omit");
  assert.equal(calls[0].headers, undefined);
  assert.deepEqual(calls[1].headers, { Authorization: "Bearer test-session" });
  assert.equal(calls[1].redirect, "error");
  await assert.rejects(fetchProducers(origin, "https://evil.test/api/catalog/v1/producers"));
  await assert.rejects(fetchProducers(origin, "/api/mobile/account"));
  t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 409 }));
  await assert.rejects(fetchProducers(origin, producerSearchPath(area)), CatalogChangedError);
});
