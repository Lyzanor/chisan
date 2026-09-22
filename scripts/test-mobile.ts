import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { accountLinkBridge, isAccountUrl, mobileOrigin, webNavigation } from "../apps/mobile/src/web-shell";

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
