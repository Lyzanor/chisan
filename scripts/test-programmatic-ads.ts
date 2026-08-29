import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildAdSenseAdsTxt,
  getAdSenseAccountId,
  getProgrammaticAdsConfig,
  PROGRAMMATIC_AREA_AD_MIN_PRODUCERS,
} from "../lib/programmatic-ads";

const accountId = "ca-pub-1234567890123456";

test("AdSense ownership stays independent from live ad serving", () => {
  assert.equal(
    getAdSenseAccountId({ CHISAN_ADSENSE_ACCOUNT_ID: ` ${accountId} ` }),
    accountId,
  );
  assert.equal(
    buildAdSenseAdsTxt({ CHISAN_ADSENSE_ACCOUNT_ID: accountId }),
    "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n",
  );
  assert.equal(buildAdSenseAdsTxt({}), null);
});

test("ad serving fails closed outside Production and while disabled", () => {
  const configured = {
    CHISAN_ADSENSE_ACCOUNT_ID: accountId,
    CHISAN_ADSENSE_AREA_SLOT_ID: "1234567890",
    CHISAN_ADSENSE_CMP_READY: "true",
    CHISAN_PROGRAMMATIC_ADS_ENABLED: "true",
    CHISAN_PUBLIC_DISCOVERY_ENABLED: "true",
  };

  assert.equal(getProgrammaticAdsConfig({ ...configured, VERCEL_ENV: "preview" }), null);
  assert.equal(
    getProgrammaticAdsConfig({
      ...configured,
      VERCEL_ENV: "production",
      CHISAN_PUBLIC_DISCOVERY_ENABLED: "false",
    }),
    null,
  );
  assert.equal(
    getProgrammaticAdsConfig({
      ...configured,
      VERCEL_ENV: "production",
      CHISAN_PROGRAMMATIC_ADS_ENABLED: "false",
    }),
    null,
  );
});

test("enabled Production ads require the exact account and a numeric slot", () => {
  assert.deepEqual(
    getProgrammaticAdsConfig({
      VERCEL_ENV: "production",
      CHISAN_PUBLIC_DISCOVERY_ENABLED: "true",
      CHISAN_ADSENSE_CMP_READY: "true",
      CHISAN_PROGRAMMATIC_ADS_ENABLED: "true",
      CHISAN_ADSENSE_ACCOUNT_ID: accountId,
      CHISAN_ADSENSE_AREA_SLOT_ID: "1234567890",
    }),
    { accountId, areaSlotId: "1234567890" },
  );

  assert.throws(
    () =>
      getProgrammaticAdsConfig({
        VERCEL_ENV: "production",
        CHISAN_PUBLIC_DISCOVERY_ENABLED: "true",
        CHISAN_ADSENSE_CMP_READY: "true",
        CHISAN_PROGRAMMATIC_ADS_ENABLED: "true",
        CHISAN_ADSENSE_ACCOUNT_ID: accountId,
      }),
    /CHISAN_ADSENSE_AREA_SLOT_ID/,
  );
  assert.equal(
    getProgrammaticAdsConfig({
      VERCEL_ENV: "production",
      CHISAN_PUBLIC_DISCOVERY_ENABLED: "true",
      CHISAN_ADSENSE_CMP_READY: "false",
      CHISAN_PROGRAMMATIC_ADS_ENABLED: "true",
      CHISAN_ADSENSE_ACCOUNT_ID: accountId,
      CHISAN_ADSENSE_AREA_SLOT_ID: "1234567890",
    }),
    null,
  );
  assert.throws(
    () => getAdSenseAccountId({ CHISAN_ADSENSE_ACCOUNT_ID: "pub-123" }),
    /CHISAN_ADSENSE_ACCOUNT_ID/,
  );
});

test("area ads require a substantive producer roster", () => {
  assert.equal(PROGRAMMATIC_AREA_AD_MIN_PRODUCERS, 10);
});

test("the Suspense fallback reserves space without initializing a second ad", () => {
  const explorer = readFileSync("components/area-explorer.tsx", "utf8");
  const areaCatalog = readFileSync("components/area-catalog.tsx", "utf8");
  const catalogLayout = readFileSync(
    "app/(catalog)/[catalog]/layout.tsx",
    "utf8",
  );
  const applicationLayout = readFileSync("app/(application)/layout.tsx", "utf8");

  assert.match(explorer, /fallback=\{[\s\S]*adSlot=\{adPlaceholder\}/);
  assert.match(
    explorer,
    /<AreaExplorerFromSearchParams adSlot=\{adSlot\} model=\{model\} \/>/,
  );
  assert.match(areaCatalog, /<ProgrammaticAreaAd/);
  assert.doesNotMatch(catalogLayout, /ProgrammaticAreaAd|googlesyndication/);
  assert.doesNotMatch(applicationLayout, /ProgrammaticAreaAd|googlesyndication/);
});
