import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import categoriesRegistry from "../data/reference/categories.json";
import {
  buildCatalogHref,
  buildProducerHref,
  readCatalogQueryContext,
} from "../lib/catalog-navigation";
import {
  isCatalogCountryPublished,
  listCountries,
  listPublishedCountries,
  loadCountries,
  parseProducerCsvRows,
  type AreaOption,
} from "../lib/csv-catalog";
import {
  formatCategoryList,
  getCategoryIcon,
  getCategoryLabel,
} from "../lib/i18n/categories";
import {
  EXPLICIT_LOCALE_COOKIE,
  buildCatalogScope,
  isCatalogScopeSegment,
  parseAcceptLanguage,
  parseCatalogScope,
  parseExplicitLocale,
  resolveDestinationLocale,
} from "../lib/i18n/catalog-scope";
import {
  formatOnlineSales,
  formatSalesChannels,
  formatVerification,
} from "../lib/i18n/controlled-values";
import {
  CATALOG_HREFLANG_BY_LOCALE,
  LOCALE_DISPLAY_TAGS,
  SUPPORTED_LOCALES,
  hasDescriptionSourceLocale,
  hasLocale,
} from "../lib/i18n/locales";
import {
  formatMessage,
  formatNumber,
  formatPluralMessage,
  formatUnitCount,
  loadMessages,
} from "../lib/i18n/messages";
import { buildManualCatalogSelection } from "../lib/i18n/manual-catalog-selection";
import { getProducerActionLabels } from "../lib/i18n/producer-action-labels";
import {
  buildProducerStructuredData,
  serializeStructuredData,
} from "../lib/producer-structured-data";
import {
  normalizeProducerRouteAliasKey,
  normalizeProducerRouteAliasSegment,
  normalizeStoredProducerRouteAliasKey,
} from "../lib/producer-route-aliases";

const FIXTURE_DIR = path.resolve(
  process.cwd(),
  "scripts/fixtures/i18n-manifests",
);
const NATIVE_SCRIPT_BY_LOCALE = {
  as: /\p{Script=Bengali}/u,
  bn: /\p{Script=Bengali}/u,
  gu: /\p{Script=Gujarati}/u,
  hi: /\p{Script=Devanagari}/u,
  kn: /\p{Script=Kannada}/u,
  kok: /\p{Script=Devanagari}/u,
  ml: /\p{Script=Malayalam}/u,
  mr: /\p{Script=Devanagari}/u,
  ne: /\p{Script=Devanagari}/u,
  or: /\p{Script=Oriya}/u,
  pa: /\p{Script=Gurmukhi}/u,
  ta: /\p{Script=Tamil}/u,
  te: /\p{Script=Telugu}/u,
} as const;

function fixtureRegistry(fixture: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-i18n-"));
  const countryDir = path.join(root, "es");
  const regionDir = path.join(countryDir, "catalunya");
  fs.mkdirSync(regionDir, { recursive: true });
  fs.copyFileSync(
    path.join(FIXTURE_DIR, fixture),
    path.join(countryDir, "country.json"),
  );
  fs.writeFileSync(path.join(regionDir, "barcelona.csv"), "");
  return root;
}

test("supported locale tokens expose stable BCP-47 display tags", () => {
  assert.equal(hasLocale("ca"), true);
  assert.equal(hasLocale("CA"), false);
  assert.equal(hasLocale("fr"), true);
  assert.equal(hasLocale("haw"), true);
  assert.equal(hasDescriptionSourceLocale("gl"), true);
  assert.equal(hasDescriptionSourceLocale("xh"), true);
  assert.equal(hasDescriptionSourceLocale("GL"), false);
  assert.deepEqual(Object.keys(LOCALE_DISPLAY_TAGS), [...SUPPORTED_LOCALES]);
  assert.deepEqual(Object.keys(CATALOG_HREFLANG_BY_LOCALE), [
    ...SUPPORTED_LOCALES,
  ]);
  assert.equal(LOCALE_DISPLAY_TAGS.pt, "pt-PT");
  assert.equal(LOCALE_DISPLAY_TAGS.haw, "haw-US");
  assert.equal(LOCALE_DISPLAY_TAGS.nso, "nso-ZA");
  assert.equal(CATALOG_HREFLANG_BY_LOCALE.ga, "ga");
  assert.equal(CATALOG_HREFLANG_BY_LOCALE.haw, "haw-US");
});

test("catalog scopes build canonical short and alternate prefixes", () => {
  const countries = [
    { slug: "es", defaultLocale: "es" as const },
    { slug: "jp", defaultLocale: "ja" as const },
    { slug: "us", defaultLocale: "en" as const },
  ];

  assert.deepEqual(parseCatalogScope("es", countries), {
    country: "es",
    locale: "es",
    pathPrefix: "/es",
    isDefault: true,
    htmlLang: "es",
  });
  assert.deepEqual(parseCatalogScope("ca-es", countries), {
    country: "es",
    locale: "ca",
    pathPrefix: "/ca-es",
    isDefault: false,
    htmlLang: "ca",
  });
  assert.deepEqual(parseCatalogScope("es-es", countries), {
    country: "es",
    locale: "es",
    pathPrefix: "/es",
    isDefault: true,
    htmlLang: "es",
  });
  assert.equal(parseCatalogScope("gl-es", countries), null);
  assert.equal(parseCatalogScope("en-zz", countries), null);
  assert.equal(isCatalogScopeSegment("us"), true);
  assert.equal(isCatalogScopeSegment("haw-us"), true);
  assert.equal(isCatalogScopeSegment("nso-za"), true);
  assert.equal(isCatalogScopeSegment("haw"), false);
  assert.equal(isCatalogScopeSegment("haw-usa"), false);
  assert.deepEqual(parseCatalogScope("haw-us", countries), {
    country: "us",
    locale: "haw",
    pathPrefix: "/haw-us",
    isDefault: false,
    htmlLang: "haw-US",
  });
  assert.equal(buildCatalogScope(countries[1]).pathPrefix, "/jp");

  const short = parseCatalogScope("es", countries);
  const alternate = parseCatalogScope("ca-es", countries);
  assert.equal(short?.country, alternate?.country);
  assert.equal(short?.country, "es");
  assert.deepEqual(
    { country: short?.country, producerId: 42 },
    { country: alternate?.country, producerId: 42 },
  );

  const japaneseDefault = parseCatalogScope("jp", countries);
  const japaneseEnglish = parseCatalogScope("en-jp", countries);
  assert.deepEqual(
    { country: japaneseDefault?.country, producerId: 84 },
    { country: japaneseEnglish?.country, producerId: 84 },
  );
});

test("catalog navigation builds every short and composite public path centrally", () => {
  const country = { slug: "es", defaultLocale: "es" as const };
  const catalan = buildCatalogScope(country, "ca");

  assert.equal(
    buildCatalogHref({
      scope: catalan,
      area: "barcelona",
      category: "Aceite",
      highlight: "producer-1",
    }),
    "/ca-es/barcelona?category=Aceite&highlight=producer-1",
  );
  assert.equal(
    buildProducerHref(
      { slug: "producer-1" },
      { scope: catalan, area: "barcelona", category: "Aceite" },
    ),
    "/ca-es/barcelona/producer-1?category=Aceite",
  );
  assert.equal(buildCatalogHref({ country: "jp", area: "tokyo" }), "/jp/tokyo");
  assert.equal(
    buildCatalogHref({
      scope: buildCatalogScope({ slug: "za", defaultLocale: "en" }, "nso"),
      area: "capricorn",
    }),
    "/nso-za/capricorn",
  );
  assert.throws(
    () => buildCatalogHref({ scope: catalan, country: "de", area: "berlin" }),
    /does not match/,
  );
  assert.deepEqual(
    readCatalogQueryContext({
      municipio: "Barcelona",
      municipality: "Barcelona",
      category: ["Miel", "Aceite"],
      highlight: "producer-1",
      lat: "41.3",
      lon: "2.1",
    }),
    {
      category: "Miel",
      highlight: "producer-1",
    },
  );
});

test("historical producer routes preserve decoded NFC Unicode without accepting delimiters", () => {
  assert.equal(
    normalizeProducerRouteAliasKey("barcelona", "%C3%B8lgod-brewpub-barcelona"),
    "barcelona/ølgod-brewpub-barcelona",
  );
  assert.equal(
    normalizeProducerRouteAliasKey("barcelona", "ølgod-brewpub-barcelona"),
    "barcelona/ølgod-brewpub-barcelona",
  );
  assert.equal(normalizeProducerRouteAliasSegment("e\u0301"), "é");
  assert.equal(
    normalizeStoredProducerRouteAliasKey("barcelona/ølgod-brewpub-barcelona"),
    "barcelona/ølgod-brewpub-barcelona",
  );

  for (const unsafe of ["", "%2F", "bad/slug", "bad?slug", "bad#slug", "%00"]) {
    assert.equal(normalizeProducerRouteAliasSegment(unsafe), null);
  }
  assert.equal(normalizeProducerRouteAliasSegment("bad%escape"), null);
});

test("destination locale selection follows explicit, browser, English, default order", () => {
  const multilingual = {
    defaultLocale: "es" as const,
    publishedLocales: ["ca", "es", "en"] as const,
    preferredLocale: "ca" as const,
  };

  assert.equal(
    resolveDestinationLocale(multilingual, {
      explicitLocale: "es",
      browserLocales: ["ca"],
    }),
    "es",
  );
  assert.equal(
    resolveDestinationLocale(multilingual, {
      explicitLocale: "de",
      browserLocales: ["es", "ca", "en"],
    }),
    "ca",
  );
  assert.equal(
    resolveDestinationLocale(multilingual, {
      explicitLocale: "de",
      browserLocales: ["de"],
    }),
    "en",
  );
  assert.equal(
    resolveDestinationLocale(multilingual, {
      browserLocales: ["es", "en"],
    }),
    "es",
  );
  assert.equal(
    resolveDestinationLocale(
      { defaultLocale: "de", publishedLocales: ["de"] },
      { browserLocales: ["ja"] },
    ),
    "de",
  );
  assert.throws(
    () =>
      resolveDestinationLocale(
        { defaultLocale: "de", publishedLocales: ["fr"] },
        { browserLocales: ["ja"] },
      ),
    /must publish its default locale 'de'/,
  );
});

test("neutral manual selection preserves an area-only browser locale", () => {
  const countries = [
    {
      slug: "es",
      label: "Spain",
      labels: { en: "Spain", es: "España" },
      defaultLocale: "es" as const,
      regions: [
        {
          slug: "catalunya",
          label: "Catalonia",
          labels: { en: "Catalonia", es: "Cataluña", ca: "Catalunya" },
          areas: [
            {
              slug: "barcelona",
              label: "Barcelona",
              labels: { en: "Barcelona", es: "Barcelona", ca: "Barcelona" },
              defaultLocale: "es" as const,
              publishedLocales: ["ca", "es", "en"] as const,
            },
          ],
        },
      ],
    },
  ];

  const catalan = buildManualCatalogSelection(countries, "en", {
    browserLocales: ["ca"],
  });
  const spanish = buildManualCatalogSelection(countries, "en", {
    explicitLocale: "es",
    browserLocales: ["ca"],
  });
  const unsupported = buildManualCatalogSelection(countries, "en", {
    browserLocales: ["de"],
  });

  assert.equal(catalan[0].regions[0].areas[0].href, "/ca-es/barcelona");
  assert.equal(spanish[0].regions[0].areas[0].href, "/es/barcelona");
  assert.equal(unsupported[0].regions[0].areas[0].href, "/en-es/barcelona");
});

test("neutral manual selection can render the complete registry in English", () => {
  const selection = buildManualCatalogSelection(listCountries(), "en", {
    browserLocales: ["en"],
  });
  const selectedAreaCount = selection.reduce(
    (total, country) =>
      total +
      country.regions.reduce((count, region) => count + region.areas.length, 0),
    0,
  );
  const registryAreaCount = listCountries().reduce(
    (total, country) =>
      total +
      country.regions.reduce((count, region) => count + region.areas.length, 0),
    0,
  );

  assert.equal(selectedAreaCount, registryAreaCount);
  assert.ok(selection.every((country) => country.label.trim()));
  assert.ok(
    selection.every((country) =>
      country.regions.every(
        (region) =>
          region.label.trim() &&
          region.areas.every((area) => area.label.trim()),
      ),
    ),
  );
});

test("standby countries stay in the registry but leave every public country list", () => {
  const countries = new Map(
    listCountries().map((country) => [country.slug, country]),
  );
  const publishedSlugs = new Set(
    listPublishedCountries().map(({ slug }) => slug),
  );

  for (const countrySlug of ["ar", "in", "za"]) {
    const country = countries.get(countrySlug);
    assert.ok(country, `${countrySlug} must remain in the CSV registry`);
    assert.equal(country.publicationStatus, "standby");
    assert.equal(isCatalogCountryPublished(country), false);
    assert.equal(publishedSlugs.has(countrySlug), false);
  }
  assert.equal(isCatalogCountryPublished(countries.get("es")!), true);
});

test("explicit and browser preferences parse without becoming catalog identity", () => {
  assert.equal(EXPLICIT_LOCALE_COOKIE, "chisan_locale");
  assert.equal(parseExplicitLocale("ca"), "ca");
  assert.equal(parseExplicitLocale("haw"), "haw");
  assert.equal(parseExplicitLocale("ca-ES"), null);
  assert.deepEqual(
    parseAcceptLanguage(
      "de-DE;q=0.7, ca-ES;q=0.9, haw-US;q=0.85, en-US;q=0.8, de;q=0.6, ja;q=0",
    ),
    ["ca", "haw", "en", "de"],
  );
});

test("manifests without an explicit locale policy are rejected", (context) => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "chisan-i18n-missing-policy-"),
  );
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const countryDir = path.join(root, "pt");
  const regionDir = path.join(countryDir, "norte");
  fs.mkdirSync(regionDir, { recursive: true });
  fs.writeFileSync(
    path.join(countryDir, "country.json"),
    JSON.stringify({
      label: "Portugal",
      unit: { one: "district", many: "districts" },
      regionUnit: { one: "region", many: "regions" },
      regions: [
        {
          slug: "norte",
          label: "Norte",
          areas: [{ slug: "braga", label: "Braga" }],
        },
      ],
    }),
  );
  fs.writeFileSync(path.join(regionDir, "braga.csv"), "");

  assert.throws(() => loadCountries(root), /i18n\.defaultLocale is required/);
});

test("country publication status rejects ambiguous visibility tokens", (context) => {
  const root = fixtureRegistry("valid-defaults.json");
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const manifestPath = path.join(root, "es", "country.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Record<
    string,
    unknown
  >;
  manifest.publicationStatus = "hidden";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  assert.throws(
    () => loadCountries(root),
    /publicationStatus must be either 'published' or 'standby'/,
  );
});

test("manifest declarations cannot create regions or areas outside the CSV tree", (context) => {
  const orphanRegionRoot = fixtureRegistry("orphan-region.json");
  const orphanAreaRoot = fixtureRegistry("orphan-area.json");
  context.after(() =>
    fs.rmSync(orphanRegionRoot, { recursive: true, force: true }),
  );
  context.after(() =>
    fs.rmSync(orphanAreaRoot, { recursive: true, force: true }),
  );

  assert.throws(
    () => loadCountries(orphanRegionRoot),
    /declared region 'invented-region' does not exist in the CSV tree/,
  );
  assert.throws(
    () => loadCountries(orphanAreaRoot),
    /declared area 'invented-area' does not exist in the CSV tree/,
  );
});

test("Spain keeps Spanish as default while Catalunya publishes three locales", () => {
  const spain = loadCountries().find(({ slug }) => slug === "es");
  assert.ok(spain);
  assert.equal(spain.defaultLocale, "es");
  assert.deepEqual(spain.publishedLocales, ["es"]);
  assert.deepEqual(spain.labels, {
    en: "Spain",
    es: "España",
    ca: "Espanya",
  });
  assert.equal(spain.labels.es, "España");
  assert.deepEqual(spain.unitLabels, {
    en: { one: "province", many: "provinces" },
    es: { one: "provincia", many: "provincias" },
    ca: { one: "província", many: "províncies" },
  });
  assert.deepEqual(spain.regionUnitLabels, {
    en: { one: "autonomous community", many: "autonomous communities" },
    es: { one: "comunidad autónoma", many: "comunidades autónomas" },
    ca: { one: "comunitat autònoma", many: "comunitats autònomes" },
  });

  const catalunya = spain.regions.find(({ slug }) => slug === "catalunya");
  assert.ok(catalunya);
  assert.deepEqual(catalunya.labels, {
    en: "Catalonia",
    es: "Cataluña",
    ca: "Catalunya",
  });
  assert.deepEqual(catalunya.publishedLocales, ["ca", "es", "en"]);
  for (const areaSlug of ["barcelona", "girona", "lleida", "tarragona"]) {
    const area: AreaOption | undefined = catalunya.areas.find(
      ({ slug }) => slug === areaSlug,
    );
    assert.ok(area);
    assert.deepEqual(area.publishedLocales, ["ca", "es", "en"]);
    assert.deepEqual(area.labels, {
      en: area.label,
      es: area.label,
      ca: area.label,
    });
  }

  const andalucia = spain.regions.find(({ slug }) => slug === "andalucia");
  assert.ok(andalucia);
  assert.deepEqual(andalucia.publishedLocales, ["es"]);
  assert.ok(
    andalucia.areas.every((area) => area.publishedLocales.length === 1),
  );
  assert.ok(andalucia.areas.every((area) => area.publishedLocales[0] === "es"));
});

test("new country policies publish their local language and Belgium narrows Dutch and German", () => {
  const countries = new Map(
    loadCountries().map((country) => [country.slug, country]),
  );

  for (const [countrySlug, defaultLocale] of [
    ["ar", "es"],
    ["it", "it"],
    ["nl", "nl"],
    ["mx", "es"],
    ["pt", "pt"],
  ] as const) {
    const country = countries.get(countrySlug);
    assert.ok(country);
    assert.equal(country.defaultLocale, defaultLocale);
    assert.deepEqual(country.publishedLocales, [defaultLocale, "en"]);
    assert.ok(
      country.regions.every(
        (region) =>
          region.publishedLocales[0] === defaultLocale &&
          region.areas.every(
            (area) =>
              area.publishedLocales[0] === defaultLocale &&
              area.publishedLocales.includes("en"),
          ),
      ),
    );
  }

  const belgium = countries.get("be");
  assert.ok(belgium);
  assert.equal(belgium.defaultLocale, "fr");
  assert.deepEqual(belgium.publishedLocales, ["fr", "en"]);

  const flanders = belgium.regions.find(({ slug }) => slug === "vlaanderen");
  const wallonia = belgium.regions.find(({ slug }) => slug === "wallonie");
  const brussels = belgium.regions.find(
    ({ slug }) => slug === "bruxelles-capitale",
  );
  assert.ok(flanders);
  assert.ok(wallonia);
  assert.ok(brussels);
  assert.equal(flanders.preferredLocale, "nl");
  assert.deepEqual(flanders.publishedLocales, ["nl", "fr", "en"]);
  assert.ok(
    flanders.areas.every((area) => area.publishedLocales.includes("nl")),
  );
  assert.deepEqual(wallonia.publishedLocales, ["fr", "en"]);
  assert.ok(
    wallonia.areas
      .filter(({ slug }) => slug !== "liege")
      .every((area) => !area.publishedLocales.includes("de")),
  );
  const liege = wallonia.areas.find(({ slug }) => slug === "liege");
  assert.ok(liege);
  assert.deepEqual(liege.publishedLocales, ["fr", "de", "en"]);
  assert.deepEqual(brussels.publishedLocales, ["fr", "nl", "en"]);
});

test("later rollout policies stay territorial instead of inferring one language per country", () => {
  const countries = new Map(
    loadCountries().map((country) => [country.slug, country]),
  );

  const france = countries.get("fr");
  assert.ok(france);
  assert.equal(france.defaultLocale, "fr");
  assert.deepEqual(france.publishedLocales, ["fr", "en"]);
  assert.ok(
    france.regions.every(
      (region) =>
        region.publishedLocales.join() === "fr,en" &&
        region.areas.every((area) => area.publishedLocales.join() === "fr,en"),
    ),
  );

  const britain = countries.get("gb");
  assert.ok(britain);
  assert.deepEqual(britain.publishedLocales, ["en"]);
  const wales = britain.regions.find(({ slug }) => slug === "wales");
  const scotland = britain.regions.find(({ slug }) => slug === "scotland");
  const northernIreland = britain.regions.find(
    ({ slug }) => slug === "northern-ireland",
  );
  assert.ok(wales);
  assert.ok(scotland);
  assert.ok(northernIreland);
  assert.deepEqual(wales.publishedLocales, ["cy", "en"]);
  assert.deepEqual(
    wales.areas
      .filter(({ preferredLocale }) => preferredLocale === "cy")
      .map(({ slug }) => slug),
    ["isle-of-anglesey", "gwynedd", "ceredigion", "carmarthenshire"],
  );
  const gaelicScotland = new Map([
    ["highland", "en"],
    ["argyll-and-bute", "en"],
    ["na-h-eileanan-siar", "gd"],
  ]);
  for (const area of scotland.areas) {
    const preferred = gaelicScotland.get(area.slug);
    assert.deepEqual(area.publishedLocales, preferred ? ["gd", "en"] : ["en"]);
    if (preferred) assert.equal(area.preferredLocale, preferred);
  }
  assert.deepEqual(
    northernIreland.areas.map(({ slug, publishedLocales }) => [
      slug,
      publishedLocales,
    ]),
    ["antrim", "armagh", "down", "fermanagh", "londonderry", "tyrone"].map(
      (slug) => [slug, ["ga", "en"]],
    ),
  );

  const ireland = countries.get("ie");
  assert.ok(ireland);
  const irishAreas = new Set([
    "donegal",
    "galway",
    "mayo",
    "kerry",
    "cork",
    "waterford",
    "meath",
  ]);
  for (const area of ireland.regions.flatMap(({ areas }) => areas)) {
    assert.deepEqual(
      area.publishedLocales,
      irishAreas.has(area.slug) ? ["en", "ga"] : ["en"],
    );
    if (irishAreas.has(area.slug)) assert.equal(area.preferredLocale, "ga");
  }

  const india = countries.get("in");
  assert.ok(india);
  const indianAreaLocales = new Map<string, string>([
    ...[
      "chandigarh",
      "delhi",
      "haryana",
      "himachal-pradesh",
      "rajasthan",
      "chhattisgarh",
      "madhya-pradesh",
      "uttar-pradesh",
      "uttarakhand",
      "andaman-nicobar-islands",
      "bihar",
      "jharkhand",
    ].map((slug) => [slug, "hi"] as const),
    ["punjab", "pa"],
    ["odisha", "or"],
    ["west-bengal", "bn"],
    ["tripura", "bn"],
    ["assam", "as"],
    ["sikkim", "ne"],
    ["andhra-pradesh", "te"],
    ["telangana", "te"],
    ["karnataka", "kn"],
    ["kerala", "ml"],
    ["lakshadweep", "ml"],
    ["tamil-nadu", "ta"],
    ["goa", "kok"],
    ["gujarat", "gu"],
    ["dadra-nagar-haveli-daman-diu", "gu"],
    ["maharashtra", "mr"],
  ]);
  for (const area of india.regions.flatMap(({ areas }) => areas)) {
    const local = indianAreaLocales.get(area.slug);
    assert.deepEqual(area.publishedLocales, local ? ["en", local] : ["en"]);
    if (local) assert.equal(area.preferredLocale, local);
  }

  const unitedStates = countries.get("us");
  assert.ok(unitedStates);
  const newMexico = unitedStates.regions
    .flatMap(({ areas }) => areas)
    .find(({ slug }) => slug === "new-mexico");
  const hawaii = unitedStates.regions
    .flatMap(({ areas }) => areas)
    .find(({ slug }) => slug === "hawaii");
  assert.ok(newMexico);
  assert.ok(hawaii);
  assert.deepEqual(newMexico.publishedLocales, ["en", "es"]);
  assert.equal(newMexico.preferredLocale, "es");
  assert.deepEqual(hawaii.publishedLocales, ["haw", "en"]);
  assert.equal(hawaii.preferredLocale, "haw");

  const southAfrica = countries.get("za");
  assert.ok(southAfrica);
  const provinceLocales = new Map([
    ["eastern-cape", "xh"],
    ["free-state", "st"],
    ["gauteng", "zu"],
    ["kwazulu-natal", "zu"],
    ["limpopo", "nso"],
    ["mpumalanga", "ss"],
    ["north-west", "tn"],
    ["northern-cape", "af"],
    ["western-cape", "af"],
  ]);
  for (const region of southAfrica.regions) {
    const local = provinceLocales.get(region.slug);
    assert.ok(local);
    assert.deepEqual(region.publishedLocales, [local, "en"]);
    assert.equal(region.preferredLocale, local);
    assert.ok(
      region.areas.every(
        (area) =>
          area.publishedLocales.join() === `${local},en` &&
          area.preferredLocale === local,
      ),
    );
  }
});

test("Indic manifest labels use their declared native script without cross-script contamination", () => {
  for (const country of loadCountries()) {
    const catalogItems = [
      country,
      ...country.regions,
      ...country.regions.flatMap(({ areas }) => areas),
    ];
    for (const item of catalogItems) {
      for (const [locale, expectedScript] of Object.entries(
        NATIVE_SCRIPT_BY_LOCALE,
      )) {
        const label = item.labels[locale as keyof typeof item.labels];
        if (!label) continue;
        assert.match(
          label,
          expectedScript,
          `${item.slug}/${locale} must use its native script`,
        );
        const unexpectedLetters = [...label].filter(
          (character) =>
            /\p{L}/u.test(character) &&
            !expectedScript.test(character) &&
            !/\p{Script=Latin}/u.test(character),
        );
        assert.deepEqual(
          unexpectedLetters,
          [],
          `${item.slug}/${locale} mixes an unrelated writing system`,
        );
      }
    }
  }
});

test("runtime policies inherit country locales and honor Catalunya overrides", (context) => {
  const inheritedRoot = fixtureRegistry("inherited-locales.json");
  const catalunyaRoot = fixtureRegistry("catalunya-overrides.json");
  context.after(() =>
    fs.rmSync(inheritedRoot, { recursive: true, force: true }),
  );
  context.after(() =>
    fs.rmSync(catalunyaRoot, { recursive: true, force: true }),
  );

  const inherited = loadCountries(inheritedRoot)[0];
  assert.deepEqual(inherited.regions[0].publishedLocales, ["es", "en"]);
  assert.deepEqual(inherited.regions[0].areas[0].publishedLocales, [
    "es",
    "en",
  ]);

  const catalunya = loadCountries(catalunyaRoot)[0].regions[0];
  assert.deepEqual(catalunya.publishedLocales, ["ca", "es", "en"]);
  assert.equal(catalunya.preferredLocale, "ca");
  assert.equal(catalunya.areas[0].preferredLocale, "ca");
  assert.equal(catalunya.labels.en, "Catalonia");
});

test("runtime policies reject explicit preferences that exclude the country default", (context) => {
  const root = fixtureRegistry("excluded-default.json");
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));

  assert.throws(
    () => loadCountries(root),
    /effective locales must retain default locale 'es'/,
  );
});

test("runtime policies reject primitive region and area i18n overrides", (context) => {
  const regionRoot = fixtureRegistry("inherited-locales.json");
  const areaRoot = fixtureRegistry("inherited-locales.json");
  context.after(() => fs.rmSync(regionRoot, { recursive: true, force: true }));
  context.after(() => fs.rmSync(areaRoot, { recursive: true, force: true }));

  const corruptManifest = (
    root: string,
    mutate: (manifest: Record<string, unknown>) => void,
  ) => {
    const manifestPath = path.join(root, "es", "country.json");
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as Record<string, unknown>;
    mutate(manifest);
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  };

  corruptManifest(regionRoot, (manifest) => {
    const regions = manifest.regions as Record<string, unknown>[];
    regions[0].i18n = "ca";
  });
  corruptManifest(areaRoot, (manifest) => {
    const regions = manifest.regions as Record<string, unknown>[];
    const areas = regions[0].areas as Record<string, unknown>[];
    areas[0].i18n = true;
  });

  assert.throws(
    () => loadCountries(regionRoot),
    /region 'catalunya': i18n must be an object/,
  );
  assert.throws(
    () => loadCountries(areaRoot),
    /area 'catalunya\/barcelona': i18n must be an object/,
  );
});

test("runtime CSV loading fails closed for required producer identity fields", () => {
  const fields = [
    "slug",
    "nombre",
    "municipio",
    "categoria",
    "Venta online",
    "producer_id",
  ];
  const validRow: Record<string, string> = {
    slug: "producer-one",
    nombre: "Producer One",
    municipio: "Example Town",
    categoria: "Wine",
    "Venta online": "no comprobado",
    producer_id: "1",
  };
  const csv = (overrides: Partial<Record<string, string>> = {}) =>
    `${fields.join(",")}\n${fields
      .map((field) => ({ ...validRow, ...overrides })[field] ?? "")
      .join(",")}\n`;

  assert.equal(parseProducerCsvRows(csv(), "fixture")[0].slug, "producer-one");
  for (const field of [
    "slug",
    "nombre",
    "municipio",
    "categoria",
    "Venta online",
  ]) {
    assert.throws(
      () => parseProducerCsvRows(csv({ [field]: "" }), "fixture"),
      new RegExp(`${field}.*required|slug must be non-empty`),
    );
  }
  assert.throws(
    () => parseProducerCsvRows(csv({ slug: "Producer One" }), "fixture"),
    /slug must be non-empty lowercase ASCII kebab-case/,
  );
  assert.throws(
    () => parseProducerCsvRows(csv({ slug: "vino" }), "fixture"),
    /slug 'vino' is reserved for a category route/,
  );
  assert.throws(
    () => parseProducerCsvRows(csv({ "Venta online": "unknown" }), "fixture"),
    /Venta online.*must be one of: sí, no, no comprobado/,
  );
});

test("runtime CSV loading preserves community-message spaces and LF line breaks", () => {
  const message = "Primera línea.  Dos espacios.\nSegunda línea.";
  const csv = [
    "slug,nombre,municipio,categoria,Venta online,producer_id,mensaje a la comunidad,mensaje_comunidad_locale",
    `producer-one,Producer One,Example Town,Wine,no comprobado,1,"${message}",es`,
  ].join("\n");

  assert.equal(
    parseProducerCsvRows(csv, "community-message fixture")[0].fields[
      "mensaje a la comunidad"
    ],
    message,
  );
});

test("message dictionaries load one locale at a time through a shared schema", async () => {
  const dictionaries = await Promise.all(SUPPORTED_LOCALES.map(loadMessages));
  assert.deepEqual(
    dictionaries.slice(0, 9).map(({ languageName }) => languageName),
    [
      "English",
      "Español",
      "Català",
      "Deutsch",
      "日本語",
      "Français",
      "Italiano",
      "Nederlands",
      "Português",
    ],
  );
  const languageNames = dictionaries.map(({ languageName }) =>
    languageName.trim(),
  );
  assert.ok(languageNames.every(Boolean));
  assert.equal(new Set(languageNames).size, SUPPORTED_LOCALES.length);

  const englishKeys = Object.keys(dictionaries[0]).sort();
  for (const dictionary of dictionaries.slice(1)) {
    assert.deepEqual(Object.keys(dictionary).sort(), englishKeys);
  }

  const flattenStrings = (
    value: unknown,
    prefix = "",
    output = new Map<string, string>(),
  ): Map<string, string> => {
    if (typeof value === "string") {
      output.set(prefix, value);
      return output;
    }
    if (!value || typeof value !== "object" || Array.isArray(value))
      return output;
    for (const [key, nested] of Object.entries(value)) {
      flattenStrings(nested, prefix ? `${prefix}.${key}` : key, output);
    }
    return output;
  };
  const placeholders = (value: string) =>
    [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)]
      .map((match) => match[1])
      .sort();
  const englishStrings = flattenStrings(dictionaries[0]);

  for (const [index, dictionary] of dictionaries.entries()) {
    const locale = SUPPORTED_LOCALES[index];
    const localizedStrings = flattenStrings(dictionary);
    assert.deepEqual(
      [...localizedStrings.keys()].sort(),
      [...englishStrings.keys()].sort(),
      `${locale} message paths differ from English`,
    );
    for (const [messagePath, english] of englishStrings) {
      assert.deepEqual(
        placeholders(localizedStrings.get(messagePath) ?? ""),
        placeholders(english),
        `${locale}.${messagePath} changed its placeholders`,
      );
    }
    if (locale !== "en") {
      const changedLeaves = [...englishStrings].filter(
        ([messagePath, english]) =>
          localizedStrings.get(messagePath) !== english,
      ).length;
      assert.ok(
        changedLeaves >= Math.floor(englishStrings.size * 0.6),
        `${locale} leaves too much English interface copy unchanged`,
      );
    }

    const expectedScript =
      NATIVE_SCRIPT_BY_LOCALE[locale as keyof typeof NATIVE_SCRIPT_BY_LOCALE];
    if (expectedScript) {
      const letters =
        [...localizedStrings.values()]
          .join(" ")
          .replace(/\{[a-zA-Z][a-zA-Z0-9]*\}/g, "")
          .match(/\p{L}/gu) ?? [];
      const nativeLetters = letters.filter((letter) =>
        expectedScript.test(letter),
      );
      assert.ok(
        nativeLetters.length / letters.length >= 0.55,
        `${locale} dictionary has suspicious native-script coverage`,
      );
    }
  }
});

test("producer conversion actions stay localized for every public locale", () => {
  for (const locale of SUPPORTED_LOCALES) {
    assert.ok(Object.values(getProducerActionLabels(locale)).every(Boolean));
  }
  assert.deepEqual(getProducerActionLabels("es"), {
    buyOnline: "Comprar online",
    directions: "Cómo llegar",
    call: "Llamar",
  });
  assert.deepEqual(getProducerActionLabels("ca"), {
    buyOnline: "Comprar en línia",
    directions: "Com arribar-hi",
    call: "Trucar",
  });
});

test("message helpers use locale-aware numbers, plurals and word order", async () => {
  const [english, japanese] = await Promise.all([
    loadMessages("en"),
    loadMessages("ja"),
  ]);

  assert.equal(formatNumber("en", 12_345), "12,345");
  assert.equal(formatNumber("de", 12_345), "12.345");
  assert.equal(
    formatPluralMessage("en", 1, english.catalog.producersFound),
    "1 producer found",
  );
  assert.equal(
    formatPluralMessage("en", 2, english.catalog.producersFound),
    "2 producers found",
  );
  assert.equal(
    formatUnitCount(
      "ja",
      12,
      { one: "県", many: "県" },
      japanese.common.unitCount,
    ),
    "12県",
  );
  assert.equal(
    formatMessage(japanese.home.countrySummary, {
      areas: "47都道府県",
      regions: "8地方",
    }),
    "8地方内の47都道府県",
  );
});

test("every category has every presentation-locale label and a registry-backed icon", () => {
  const registry = categoriesRegistry as {
    categories: string[];
    labels: Record<string, Record<string, string>>;
    icons: Record<string, string>;
  };

  for (const category of registry.categories) {
    assert.ok(registry.icons[category], `${category} is missing an icon`);
    for (const locale of SUPPORTED_LOCALES) {
      assert.ok(
        registry.labels[category]?.[locale],
        `${category} is missing ${locale}`,
      );
    }
  }

  for (const category of registry.categories) {
    for (const [locale, expectedScript] of Object.entries(
      NATIVE_SCRIPT_BY_LOCALE,
    )) {
      assert.match(
        registry.labels[category][locale],
        expectedScript,
        `${category}/${locale} must use its native script`,
      );
    }
  }

  assert.equal(getCategoryLabel("Aceite", "en"), "Oil");
  assert.equal(getCategoryLabel("Aceite", "ja"), "食用油");
  assert.throws(
    () => getCategoryLabel("Unknown token", "en"),
    /Unknown category token/,
  );
  assert.equal(getCategoryIcon("Aceite"), "🫒");
  assert.equal(getCategoryIcon("Unknown token"), "🧺");
  assert.equal(formatCategoryList(["Aceite", "Miel"], "en"), "Oil and Honey");
});

test("controlled CSV values retain their tokens but render localized labels", async () => {
  const german = await loadMessages("de");

  assert.equal(
    formatVerification("pendiente", german.controlledValues),
    "Ausstehend",
  );
  assert.equal(
    formatOnlineSales("no comprobado", german.controlledValues),
    "Nicht geprüft",
  );
  assert.equal(
    formatSalesChannels("ecommerce|telefono", "de", german.controlledValues),
    "Onlineshop und Telefon",
  );
  assert.equal(
    formatVerification("future-token", german.controlledValues),
    "future-token",
  );
});

test("public producer social links use localized field labels", () => {
  const producerPage = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "app/(catalog)/[catalog]/[area]/[segment]/page.tsx",
    ),
    "utf8",
  );

  assert.match(producerPage, /messages\.fieldLabels\.instagram/);
  assert.match(producerPage, /messages\.fieldLabels\.facebook/);
  assert.doesNotMatch(producerPage, />\s*Instagram\s*</);
  assert.doesNotMatch(producerPage, />\s*Facebook\s*</);
});

test("producer structured data mirrors complete visible profile facts", () => {
  const data = buildProducerStructuredData({
    producerName: "Formatgeria La Cleda",
    canonicalUrl: "https://chisan.app/es/barcelona/formatgeria-la-cleda-canovelles",
    countryName: "España",
    countryCode: "es",
    countryUrl: "https://chisan.app/es",
    areaName: "Barcelona",
    areaUrl: "https://chisan.app/es/barcelona",
    city: "Canovelles",
    locale: "es",
    description: "Quesería artesana con leche de su propio rebaño.",
    address: "Carrer de la Serra, 4",
    telephone: "+34930000000",
    email: "hola@example.com",
    website: "https://example.com/",
    facebook: "https://www.facebook.com/example",
    instagram: "https://www.instagram.com/example",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=La+Cleda",
    imageUrl: "https://chisan.app/productores/es/catalunya/barcelona/la-cleda.webp",
    latitude: 41.61678,
    longitude: 2.28391,
    categories: ["Lácteos y quesos"],
    featuredProducts: ["Queso de oveja", "Yogur artesanal"],
  }) as { "@graph": Record<string, unknown>[] };

  const producer = data["@graph"].find(
    (node) => node["@id"] ===
      "https://chisan.app/es/barcelona/formatgeria-la-cleda-canovelles#producer",
  );
  const webpage = data["@graph"].find((node) => node["@type"] === "WebPage");
  const website = data["@graph"].find((node) => node["@type"] === "WebSite");
  const breadcrumb = data["@graph"].find(
    (node) => node["@type"] === "BreadcrumbList",
  );

  assert.equal(producer?.["@type"], "LocalBusiness");
  assert.equal(producer?.image, "https://chisan.app/productores/es/catalunya/barcelona/la-cleda.webp");
  assert.deepEqual(producer?.sameAs, [
    "https://example.com/",
    "https://www.facebook.com/example",
    "https://www.instagram.com/example",
  ]);
  assert.deepEqual(producer?.address, {
    "@type": "PostalAddress",
    streetAddress: "Carrer de la Serra, 4",
    addressLocality: "Canovelles",
    addressRegion: "Barcelona",
    addressCountry: "ES",
  });
  assert.deepEqual(producer?.geo, {
    "@type": "GeoCoordinates",
    latitude: 41.61678,
    longitude: 2.28391,
  });
  assert.deepEqual(webpage?.about, [
    { "@type": "Thing", name: "Lácteos y quesos" },
    { "@type": "Thing", name: "Queso de oveja" },
    { "@type": "Thing", name: "Yogur artesanal" },
  ]);
  assert.deepEqual(website?.sameAs, [
    "https://www.instagram.com/chisanapp/",
    "https://x.com/chisanapp",
  ]);
  assert.equal(
    (breadcrumb?.itemListElement as unknown[]).length,
    3,
  );
});

test("sparse producer structured data avoids speculative rich-result claims", () => {
  const data = buildProducerStructuredData({
    producerName: "Productor sin ficha ampliada </script>",
    canonicalUrl: "https://chisan.app/es/asturias/productor-sin-ficha",
    countryName: "España",
    countryCode: "es",
    countryUrl: "https://chisan.app/es",
    areaName: "Asturias",
    areaUrl: "https://chisan.app/es/asturias",
    city: "Oviedo",
    locale: "es",
    latitude: 43.3614,
    longitude: -5.8494,
  }) as { "@graph": Record<string, unknown>[] };
  const producer = data["@graph"].find(
    (node) => node["@id"] ===
      "https://chisan.app/es/asturias/productor-sin-ficha#producer",
  );
  const serialized = serializeStructuredData(data);

  assert.equal(producer?.["@type"], "Organization");
  assert.ok(producer?.location);
  for (const unsupportedProperty of [
    "address",
    "geo",
    "hasMap",
    "image",
    "description",
    "sameAs",
    "openingHoursSpecification",
    "aggregateRating",
    "review",
    "offers",
  ]) {
    assert.equal(producer?.[unsupportedProperty], undefined);
  }
  assert.doesNotMatch(serialized, /<\/script>/i);
  assert.match(serialized, /\\u003c\/script>/i);
  assert.doesNotMatch(serialized, /"@type":"(?:Product|Offer|AggregateRating)"/);
});

test("producer profiles expose server-rendered JSON-LD and matching breadcrumbs", () => {
  const producerPage = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "app/(catalog)/[catalog]/[area]/[segment]/page.tsx",
    ),
    "utf8",
  );

  assert.match(producerPage, /type="application\/ld\+json"/);
  assert.match(producerPage, /serializeStructuredData\(structuredData\)/);
  assert.match(producerPage, /<article className="detail-shell">/);
  assert.match(producerPage, /className="detail-breadcrumb"/);
  assert.match(producerPage, /producer\.imageSrc === DEFAULT_PRODUCER_IMAGE_SRC/);
});

test("producer profiles promote canonical editorial facts without widening CSV", () => {
  const producerPage = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "app/(catalog)/[catalog]/[area]/[segment]/page.tsx",
    ),
    "utf8",
  );

  assert.match(
    producerPage,
    /getFieldValue\(producer\.fields, "descripcion"\) \|\|[\s\S]*?messages\.metadata\.producerDescription/,
  );
  assert.match(
    producerPage,
    /onlineSales === "sí" && salesChannels\.includes\("ecommerce"\) && Boolean\(website\)/,
  );
  assert.match(producerPage, /getFieldValue\(producer\.fields, "productos estrella"\)/);
  assert.match(producerPage, /className="detail-intro"/);
  assert.match(producerPage, /className="detail-product-list"/);
  assert.equal(producerPage.match(/prefetch=\{false\}/g)?.length, 4);
});

test("producer profile contracts keep premium access separate from public semantics", () => {
  const csvContract = fs.readFileSync(
    path.resolve(process.cwd(), "docs/CSV_CONTRACT.md"),
    "utf8",
  );
  const accountContract = fs.readFileSync(
    path.resolve(process.cwd(), "docs/ACCOUNT_SYSTEM.md"),
    "utf8",
  );

  assert.match(
    csvContract,
    /## Public producer-profile rendering and structured data/,
  );
  assert.match(csvContract, /one public profile for one canonical CSV row/);
  assert.match(csvContract, /Premium extension boundary/);
  for (const requiredBoundary of [
    "LocalBusiness",
    "Organization",
    "Product",
    "Offer",
    "AggregateRating",
    "openingHoursSpecification",
    "ProfilePage",
    "inLanguage",
  ]) {
    assert.ok(
      csvContract.includes(requiredBoundary),
      `producer-profile contract is missing ${requiredBoundary}`,
    );
  }
  assert.match(
    accountContract,
    /CSV_CONTRACT\.md` section \*\*Public producer-profile rendering and[\s\S]*?structured data\*\* owns the public HTML/,
  );
  assert.match(
    accountContract,
    /never creates a second[\s\S]*?structured-data verification signal/,
  );
});

test("Japanese layout and map-popup contracts remain objectively testable", async () => {
  const [css, areaCatalog, areaExplorer, mapInner, japanese] = await Promise.all([
    fs.promises.readFile(
      path.resolve(process.cwd(), "app/globals.css"),
      "utf8",
    ),
    fs.promises.readFile(
      path.resolve(process.cwd(), "components/area-catalog.tsx"),
      "utf8",
    ),
    fs.promises.readFile(
      path.resolve(process.cwd(), "components/area-explorer.tsx"),
      "utf8",
    ),
    fs.promises.readFile(
      path.resolve(process.cwd(), "components/map/producers-map-inner.tsx"),
      "utf8",
    ),
    loadMessages("ja"),
  ]);

  assert.match(
    css,
    /\nbody\s*\{[^}]*font-family:[^}]*"Hiragino Kaku Gothic ProN"[^}]*"Yu Gothic"[^}]*Meiryo[^}]*\}/,
  );
  assert.match(css, /:lang\(ja\) body\s*\{[^}]*line-break:\s*strict;[^}]*\}/);

  const japaneseControlRule = css.match(
    /:lang\(ja\) button,[\s\S]*?:lang\(ja\) \.leaflet-popup-content\s*\{([^}]*)\}/,
  );
  assert.ok(
    japaneseControlRule,
    "Japanese controls and popups need a shared wrap rule",
  );
  for (const selector of [
    "button",
    "select",
    ".catalog-chip",
    ".leaflet-popup-content",
  ]) {
    assert.ok(
      japaneseControlRule[0].includes(`:lang(ja) ${selector}`),
      `Japanese wrap rule is missing ${selector}`,
    );
  }
  assert.match(japaneseControlRule[1], /overflow-wrap:\s*anywhere;/);

  assert.match(
    japanese.areaSelector.submit,
    /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}/u,
  );
  assert.equal(japanese.map.openProfile, "プロフィールを開く");
  assert.match(areaCatalog, /mapMessages:\s*messages\.map/);
  assert.match(areaExplorer, /messages=\{model\.mapMessages\}/);
  assert.match(mapInner, /\{messages\.openProfile\}/);
});
