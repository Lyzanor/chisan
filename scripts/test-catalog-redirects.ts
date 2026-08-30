import assert from "node:assert/strict";
import test from "node:test";

import { NextRequest } from "next/server";

import { GET as catalogRedirect } from "../app/(internal)/api/catalog-redirect/[country]/[defaultLocale]/[catalog]/[[...path]]/route";
import {
  buildCatalogNormalizationRewrites,
  buildCatalogNormalizationRewritesFromManifests,
  loadCatalogRedirectCountries,
  type CatalogRedirectCountry,
} from "../lib/catalog-build-rewrites";
import { buildCatalogRedirectHref } from "../lib/catalog-redirect-handler";
import nextConfig from "../next.config";

const TEST_COUNTRY: CatalogRedirectCountry = {
  slug: "es",
  defaultLocale: "es",
  aliases: {
    logrono: "la-rioja",
    bcn: "barcelona",
  },
  areas: [
    { slug: "la-rioja", publishedLocales: ["es", "en"] },
    { slug: "barcelona", publishedLocales: ["ca", "es", "en"] },
  ],
};

test("build rewrites group effective scopes per alias before default scopes", () => {
  const rewrites = buildCatalogNormalizationRewrites([TEST_COUNTRY]);
  const bySource = new Map(rewrites.map((rewrite) => [rewrite.source, rewrite]));

  assert.deepEqual(bySource.get("/:catalog(en-es|es-es|es)/logrono/:path*"), {
    source: "/:catalog(en-es|es-es|es)/logrono/:path*",
    destination:
      "/api/catalog-redirect/es/es/:catalog/la-rioja/:path*",
  });
  assert.ok(
    [...bySource.keys()].every(
      (source) =>
        !source.includes("ca-es") || !source.includes("/logrono/"),
    ),
  );
  assert.deepEqual(bySource.get("/:catalog(es-es)/:path*"), {
    source: "/:catalog(es-es)/:path*",
    destination: "/api/catalog-redirect/es/es/:catalog/:path*",
  });
  assert.ok(
    rewrites.findIndex(({ source }) => source.includes("/logrono/")) <
      rewrites.findIndex(({ source }) => source === "/:catalog(es-es)/:path*"),
  );
});

test("repository manifests produce unique static normalization sources", () => {
  const countries = loadCatalogRedirectCountries();
  const rewrites = buildCatalogNormalizationRewritesFromManifests();
  const sources = rewrites.map(({ source }) => source);
  const aliasCount = countries.reduce(
    (count, country) => count + Object.keys(country.aliases).length,
    0,
  );

  assert.equal(rewrites.length, countries.length + aliasCount);
  assert.ok(
    countries.every(({ slug }) => !["ar", "in", "za"].includes(slug)),
    "standby countries must not install public normalization rewrites",
  );
  assert.ok(rewrites.length < 1_024, "catalog rewrites must stay below Vercel's limit");
  assert.equal(new Set(sources).size, sources.length);
  assert.ok(
    rewrites.some(
      (rewrite) =>
        rewrite.source === "/:catalog(es-es|es)/logrono/:path*" &&
        rewrite.destination ===
          "/api/catalog-redirect/es/es/:catalog/la-rioja/:path*",
    ),
  );
  assert.ok(
    rewrites.some(
      (rewrite) =>
        rewrite.source ===
          "/:catalog(en-be|fr-be|nl-be|be)/bruselas/:path*" &&
        rewrite.destination ===
          "/api/catalog-redirect/be/fr/:catalog/bruxelles-capitale/:path*",
    ),
  );
  assert.ok(
    rewrites.every(
      ({ source }) =>
        !source.endsWith("/barcelona/:path*") &&
        !source.endsWith("/la-rioja/:path*"),
    ),
    "canonical area routes must not be captured",
  );
});

test("redirect targets retain only canonical catalog query state", () => {
  const searchParams = new URLSearchParams([
    ["category", "Vino tinto"],
    ["highlight", "producer-one"],
    ["lat", "42.4"],
    ["lon", "-2.4"],
    ["unknown", "discard-me"],
  ]);

  assert.equal(
    buildCatalogRedirectHref({
      country: "es",
      defaultLocale: "es",
      catalog: "es",
      path: ["la-rioja", "producer-one"],
      searchParams,
    }),
    "/es/la-rioja/producer-one?category=Vino+tinto&highlight=producer-one",
  );
  assert.equal(
    buildCatalogRedirectHref({
      country: "es",
      defaultLocale: "es",
      catalog: "ca-es",
      path: ["barcelona"],
      searchParams: new URLSearchParams("lat=41.3&highlight=producer-one"),
    }),
    "/ca-es/barcelona?highlight=producer-one",
  );
  assert.equal(
    buildCatalogRedirectHref({
      country: "es",
      defaultLocale: "es",
      catalog: "not-a-scope",
      path: ["barcelona"],
      searchParams: new URLSearchParams(),
    }),
    null,
  );
  assert.equal(
    buildCatalogRedirectHref({
      country: "es",
      defaultLocale: "es",
      catalog: "es",
      path: ["..", "cuenta"],
      searchParams: new URLSearchParams(),
    }),
    null,
  );
  assert.equal(
    buildCatalogRedirectHref({
      country: "es",
      defaultLocale: "es",
      catalog: "es-es",
      path: ["la-rioja"],
      searchParams: new URLSearchParams("category=Vino"),
    }),
    "/es/la-rioja?category=Vino",
  );
});

test("internal handler emits a filtered permanent redirect", async () => {
  const request = new NextRequest(
    "https://chisan.app/api/catalog-redirect/es/es/es-es/la-rioja/producer-one" +
      "?category=Vino&highlight=producer-one&lat=42.4&lon=-2.4",
  );
  const response = await catalogRedirect(request, {
    params: Promise.resolve({
      country: "es",
      defaultLocale: "es",
      catalog: "es-es",
      path: ["la-rioja", "producer-one"],
    }),
  });

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "/es/la-rioja/producer-one?category=Vino&highlight=producer-one",
  );
});

test("Next config installs build rewrites and disables image transformations", async () => {
  assert.equal(nextConfig.images?.unoptimized, true);
  assert.ok(nextConfig.rewrites);
  const rewrites = await nextConfig.rewrites();
  assert.equal(Array.isArray(rewrites), false);
  if (Array.isArray(rewrites)) assert.fail("Expected phased rewrites");
  assert.ok(rewrites.beforeFiles && rewrites.beforeFiles.length > 15);
  assert.deepEqual(rewrites.afterFiles, []);
  assert.deepEqual(rewrites.fallback, []);
});
