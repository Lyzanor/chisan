import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { accountLinkBridge, isAccountUrl, mobileOrigin, webNavigation } from "../apps/mobile/src/web-shell";
import { mobilePresentationBridge, mobileViewportBridge } from "../apps/mobile/src/web-presentation";
import { LOCATION_ONBOARDING_STORAGE_KEY } from "../lib/location/location-onboarding";

const origin = "https://chisan.app";

test("the app embeds the same public pages as the mobile website", () => {
  for (const path of ["/", "/actividad", "/es/madrid", "/es/madrid?category=queso", "/es/madrid/productor"]) {
    assert.equal(webNavigation(`${origin}${path}`, origin), "embedded");
  }
});

test("registration and account management use the system browser", () => {
  for (const path of ["/cuenta", "/cuenta/reclamaciones", "/acceso", "/registro?redirect_url=%2Fcuenta"]) {
    assert.equal(webNavigation(`${origin}${path}`, origin), "browser");
  }
  assert.equal(webNavigation("https://instagram.com/chisan", origin), "browser");
});

test("account links in Next.js client navigation reach the native browser bridge", () => {
  let click: ((event: { target: { closest: () => { href: string } }; button: number; defaultPrevented: boolean;
    preventDefault: () => void; stopImmediatePropagation: () => void }) => void) | undefined;
  const messages: string[] = [];
  runInNewContext(accountLinkBridge(origin), {
    location: { origin }, URL, JSON,
    window: { ReactNativeWebView: { postMessage: (value: string) => messages.push(value) } },
    document: { addEventListener: (_type: string, handler: typeof click) => { click = handler; } },
  });
  assert.ok(click);
  let prevented = false;
  click({ target: { closest: () => ({ href: `${origin}/cuenta` }) }, button: 0, defaultPrevented: false,
    preventDefault: () => { prevented = true; }, stopImmediatePropagation: () => {} });
  assert.equal(prevented, true);
  assert.deepEqual(JSON.parse(messages[0]), { type: "open-account", url: `${origin}/cuenta` });
  prevented = false;
  click({ target: { closest: () => ({ href: `${origin}/es/madrid` }) }, button: 0, defaultPrevented: false,
    preventDefault: () => { prevented = true; }, stopImmediatePropagation: () => {} });
  assert.equal(prevented, false);
});

test("only the configured origin may render inside the app", () => {
  assert.equal(mobileOrigin(undefined, false), origin);
  assert.equal(mobileOrigin("http://192.168.1.10:3000", true), "http://192.168.1.10:3000");
  for (const value of ["http://chisan.app", "https://user:secret@chisan.app", "https://chisan.app/path", "https://chisan.app?token=secret"]) {
    assert.throws(() => mobileOrigin(value, false));
  }
  assert.equal(webNavigation("https://evil.test/", origin), "browser");
  assert.equal(isAccountUrl("https://chisan.app.evil.test/cuenta", origin), false);
  assert.equal(webNavigation("https://user:secret@chisan.app/", origin), "blocked");
  assert.equal(webNavigation("javascript:alert(1)", origin), "blocked");
  assert.equal(webNavigation("file:///etc/passwd", origin), "blocked");
});

function presentationPage(pathname = "/", stored: string | null = null) {
  const dataset: Record<string, string> = {};
  const writes: [string, string][] = [];
  let manualClick: (event: unknown) => void = () => {};
  let routeChanged = () => {};
  const location = { origin, pathname };
  const context = {
    location, window: {},
    document: {
      documentElement: { dataset, lang: "es" }, head: { appendChild() {} }, body: {},
      createElement: () => ({}),
      querySelector: () => ({ before() {}, addEventListener: (_: string, action: typeof manualClick) => { manualClick = action; } }),
    },
    localStorage: { getItem: () => stored, setItem: (key: string, value: string) => writes.push([key, value]) },
    MutationObserver: class {
      constructor(callback: () => void) { routeChanged = callback; }
      observe() {}
      disconnect() {}
    },
  };
  runInNewContext(mobilePresentationBridge(origin), context);
  return { dataset, writes, location, manual: () => manualClick({ target: { closest: () => ({}) } }),
    navigate: (path: string) => { location.pathname = path; routeChanged(); } };
}

test("first app entry focuses the existing location choice without requesting position or saving it", () => {
  const page = presentationPage();
  assert.equal(page.dataset.chisanEntry, "location");
  assert.deepEqual(page.writes, []);
  page.navigate("/es/barcelona");
  assert.equal(page.dataset.chisanEntry, undefined);
});

test("manual entry stores only the shared dismissal and explicit map links stay untouched", () => {
  const page = presentationPage();
  page.manual();
  assert.deepEqual(page.writes, [[LOCATION_ONBOARDING_STORAGE_KEY, '{"onboarding":"dismissed","area":null}']]);
  assert.equal(presentationPage("/es/barcelona").dataset.chisanEntry, undefined);
  assert.equal(presentationPage("/", page.writes[0][1]).dataset.chisanEntry, undefined);
  assert.equal(presentationPage("/", "invalid").dataset.chisanEntry, "location");
});

test("the native viewport follows layout changes and asks the map to remeasure", () => {
  const heights: string[] = [];
  let resized = 0;
  const context = { document: { documentElement: { style: { setProperty: (_: string, value: string) => heights.push(value) } } },
    window: { dispatchEvent: () => resized++ }, Event: class {} };
  for (const height of [820, 490, 820, NaN, -1]) runInNewContext(mobileViewportBridge(height), context);
  assert.deepEqual(heights, ["820px", "490px", "820px"]);
  assert.equal(resized, 3);
});
