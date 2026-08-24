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
import { loadCountries, type AreaOption } from "../lib/csv-catalog";
import {
  formatCategoryList,
  getCategoryIcon,
  getCategoryLabel,
} from "../lib/i18n/categories";
import {
  EXPLICIT_LOCALE_COOKIE,
  buildCatalogScope,
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
  LEGACY_DEFAULT_LOCALE,
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
import {
  normalizeProducerRouteAliasKey,
  normalizeProducerRouteAliasSegment,
  normalizeStoredProducerRouteAliasKey,
} from "../lib/producer-route-aliases";

const FIXTURE_DIR = path.resolve(process.cwd(), "scripts/fixtures/i18n-manifests");

function fixtureRegistry(fixture: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-i18n-"));
  const countryDir = path.join(root, "es");
  const regionDir = path.join(countryDir, "catalunya");
  fs.mkdirSync(regionDir, { recursive: true });
  fs.copyFileSync(path.join(FIXTURE_DIR, fixture), path.join(countryDir, "country.json"));
  fs.writeFileSync(path.join(regionDir, "barcelona.csv"), "");
  return root;
}

test("supported locale tokens expose stable BCP-47 display tags", () => {
  assert.equal(hasLocale("ca"), true);
  assert.equal(hasLocale("CA"), false);
  assert.equal(hasLocale("fr"), false);
  assert.equal(hasDescriptionSourceLocale("fr"), true);
  assert.equal(hasDescriptionSourceLocale("FR"), false);
  assert.deepEqual(LOCALE_DISPLAY_TAGS, {
    en: "en",
    es: "es",
    ca: "ca",
    de: "de",
    ja: "ja",
  });
});

test("catalog scopes build canonical short and alternate prefixes", () => {
  const countries = [
    { slug: "es", defaultLocale: "es" as const },
    { slug: "jp", defaultLocale: "ja" as const },
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
  assert.equal(parseCatalogScope("fr-es", countries), null);
  assert.equal(parseCatalogScope("en-zz", countries), null);
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
  assert.equal(normalizeStoredProducerRouteAliasKey("barcelona/ølgod-brewpub-barcelona"),
    "barcelona/ølgod-brewpub-barcelona");

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

test("explicit and browser preferences parse without becoming catalog identity", () => {
  assert.equal(EXPLICIT_LOCALE_COOKIE, "chisan_locale");
  assert.equal(parseExplicitLocale("ca"), "ca");
  assert.equal(parseExplicitLocale("ca-ES"), null);
  assert.deepEqual(
    parseAcceptLanguage("de-DE;q=0.7, ca-ES;q=0.9, en-US;q=0.8, de;q=0.6, ja;q=0"),
    ["ca", "en", "de"],
  );
});

test("legacy manifests retain their labels and current English locale policy", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chisan-i18n-legacy-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const countryDir = path.join(root, "pt");
  const regionDir = path.join(countryDir, "norte");
  fs.mkdirSync(regionDir, { recursive: true });
  fs.writeFileSync(
    path.join(countryDir, "country.json"),
    JSON.stringify({
      label: "Portugal",
      unit: { one: "district", many: "districts" },
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

  const [country] = loadCountries(root);
  assert.equal(country.defaultLocale, LEGACY_DEFAULT_LOCALE);
  assert.deepEqual(country.publishedLocales, ["en"]);
  assert.equal(country.labels.en, "Portugal");
  assert.equal(country.regions[0].areas[0].labels.en, "Braga");
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
  assert.ok(andalucia.areas.every((area) => area.publishedLocales.length === 1));
  assert.ok(andalucia.areas.every((area) => area.publishedLocales[0] === "es"));
});

test("runtime policies inherit country locales and honor Catalunya overrides", (context) => {
  const inheritedRoot = fixtureRegistry("inherited-locales.json");
  const catalunyaRoot = fixtureRegistry("catalunya-overrides.json");
  context.after(() => fs.rmSync(inheritedRoot, { recursive: true, force: true }));
  context.after(() => fs.rmSync(catalunyaRoot, { recursive: true, force: true }));

  const inherited = loadCountries(inheritedRoot)[0];
  assert.deepEqual(inherited.regions[0].publishedLocales, ["es", "en"]);
  assert.deepEqual(inherited.regions[0].areas[0].publishedLocales, ["es", "en"]);

  const catalunya = loadCountries(catalunyaRoot)[0].regions[0];
  assert.deepEqual(catalunya.publishedLocales, ["ca", "es", "en"]);
  assert.equal(catalunya.preferredLocale, "ca");
  assert.equal(catalunya.areas[0].preferredLocale, "ca");
  assert.equal(catalunya.labels.en, "Catalonia");
});

test("message dictionaries load one locale at a time through a shared schema", async () => {
  const dictionaries = await Promise.all(SUPPORTED_LOCALES.map(loadMessages));
  assert.deepEqual(
    dictionaries.map(({ languageName }) => languageName),
    ["English", "Español", "Català", "Deutsch", "日本語"],
  );

  const englishKeys = Object.keys(dictionaries[0]).sort();
  for (const dictionary of dictionaries.slice(1)) {
    assert.deepEqual(Object.keys(dictionary).sort(), englishKeys);
  }
});

test("message helpers use locale-aware numbers, plurals and word order", async () => {
  const [english, japanese] = await Promise.all([loadMessages("en"), loadMessages("ja")]);

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
    formatUnitCount("ja", 12, { one: "県", many: "県" }, japanese.common.unitCount),
    "12県",
  );
  assert.equal(
    formatMessage(japanese.home.countrySummary, { areas: "47都道府県", regions: "8地方" }),
    "8地方内の47都道府県",
  );
});

test("every category has five labels and a registry-backed icon", () => {
  const registry = categoriesRegistry as {
    categories: string[];
    labels: Record<string, Record<string, string>>;
    icons: Record<string, string>;
  };

  for (const category of registry.categories) {
    assert.ok(registry.icons[category], `${category} is missing an icon`);
    for (const locale of SUPPORTED_LOCALES) {
      assert.ok(registry.labels[category]?.[locale], `${category} is missing ${locale}`);
    }
  }

  assert.equal(getCategoryLabel("Aceite", "en"), "Oil");
  assert.equal(getCategoryLabel("Aceite", "ja"), "食用油");
  assert.equal(getCategoryIcon("Aceite"), "🫒");
  assert.equal(getCategoryIcon("Unknown token"), "🧺");
  assert.equal(formatCategoryList(["Aceite", "Miel"], "en"), "Oil and Honey");
});

test("controlled CSV values retain their tokens but render localized labels", async () => {
  const german = await loadMessages("de");

  assert.equal(formatVerification("verificado", german.controlledValues), "Verifiziert");
  assert.equal(formatOnlineSales("no comprobado", german.controlledValues), "Nicht geprüft");
  assert.equal(
    formatSalesChannels("ecommerce|telefono", "de", german.controlledValues),
    "Onlineshop und Telefon",
  );
  assert.equal(formatVerification("future-token", german.controlledValues), "future-token");
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

test("Japanese layout and map-popup contracts remain objectively testable", async () => {
  const [css, areaCatalog, mapInner, japanese] = await Promise.all([
    fs.promises.readFile(path.resolve(process.cwd(), "app/globals.css"), "utf8"),
    fs.promises.readFile(
      path.resolve(process.cwd(), "components/area-catalog.tsx"),
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
  assert.ok(japaneseControlRule, "Japanese controls and popups need a shared wrap rule");
  for (const selector of ["button", "select", ".catalog-chip", ".leaflet-popup-content"]) {
    assert.ok(
      japaneseControlRule[0].includes(`:lang(ja) ${selector}`),
      `Japanese wrap rule is missing ${selector}`,
    );
  }
  assert.match(japaneseControlRule[1], /overflow-wrap:\s*anywhere;/);

  assert.match(japanese.areaSelector.submit, /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}/u);
  assert.equal(japanese.map.openProfile, "プロフィールを開く");
  assert.match(areaCatalog, /openProfile:\s*messages\.map\.openProfile/);
  assert.match(mapInner, /\{messages\.openProfile\}/);
});
