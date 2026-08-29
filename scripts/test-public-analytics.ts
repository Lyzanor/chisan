import assert from "node:assert/strict";
import test from "node:test";

import {
  isPublicAnalyticsPath,
  sanitizePublicAnalyticsUrl,
} from "../lib/public-analytics";

test("public analytics excludes private and operational application routes", () => {
  for (const pathname of [
    "/acceso",
    "/acceso/callback",
    "/admin",
    "/admin/perfiles",
    "/api/webhooks/clerk",
    "/cuenta",
    "/cuenta/favoritos",
    "/registro",
  ]) {
    assert.equal(isPublicAnalyticsPath(pathname), false, pathname);
  }

  for (const pathname of [
    "/",
    "/es/barcelona",
    "/es/barcelona/example-producer",
    "/our-purpose",
    "/privacy",
    "/u/example",
  ]) {
    assert.equal(isPublicAnalyticsPath(pathname), true, pathname);
  }
});

test("public analytics removes query parameters and fragments before sending", () => {
  assert.equal(
    sanitizePublicAnalyticsUrl(
      "https://chisan.app/es/barcelona?category=quesos&highlight=producer#map",
    ),
    "https://chisan.app/es/barcelona",
  );
  assert.equal(
    sanitizePublicAnalyticsUrl("https://chisan.app/cuenta?returnTo=%2Fadmin"),
    null,
  );
  assert.equal(sanitizePublicAnalyticsUrl("not a URL"), null);
});
