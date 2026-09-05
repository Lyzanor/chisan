import assert from "node:assert/strict";
import test from "node:test";

import type { LocatedProducerCsvRow } from "../lib/csv-catalog";
import {
  buildAccountSelectionPage,
  buildProducerSelectionItems,
} from "../lib/producer-selections.server";
import {
  buildProducerSelectionHighlightHref,
  getProducerSelectionInitialFocusKeys,
  hasProducerSelectionCoordinates,
  PRODUCER_SELECTION_MIN_ZOOM,
  resolveProducerSelectionItem,
} from "../lib/producer-selections";

function producer(
  producerId: number,
  area: string,
  slug: string,
  country = "es",
  city = area,
): LocatedProducerCsvRow {
  return {
    producerId,
    slug,
    name: `Producer ${producerId}`,
    city,
    category: "Aceite",
    additionalCategories: [],
    categories: ["Aceite"],
    featuredProducts: "",
    imageSrc: `/productores/${slug}.webp`,
    latitude: 40 + producerId / 100,
    longitude: -3,
    fields: {
      descripcion: `Producer ${producerId} makes local food in ${city}.`,
    },
    country,
    region: area === "barcelona" ? "catalunya" : "madrid",
    area,
  };
}

test("producer selection items retain distinct current links across areas", () => {
  const items = buildProducerSelectionItems(
    [
      producer(41, "barcelona", "barcelona-producer"),
      producer(42, "madrid", "madrid-producer"),
      null,
    ],
    { explicitLocale: null, locale: "en" },
  );

  assert.deepEqual(
    items.map(({ key, href, description, imageSrc, icon }) => ({
      key,
      href,
      description,
      imageSrc,
      icon,
    })),
    [
      {
        key: "es:41",
        href: "/es/barcelona/barcelona-producer",
        description: "Producer 41 makes local food in barcelona.",
        imageSrc: "/productores/barcelona-producer.webp",
        icon: "🫒",
      },
      {
        key: "es:42",
        href: "/es/madrid/madrid-producer",
        description: "Producer 42 makes local food in madrid.",
        imageSrc: "/productores/madrid-producer.webp",
        icon: "🫒",
      },
    ],
  );
});

test("public selections keep the explicit order and frame the entire mapped selection", () => {
  const missing = producer(44, "barcelona", "unmapped");
  missing.latitude = null;
  missing.longitude = null;
  const items = buildProducerSelectionItems(
    [
      producer(43, "madrid", "far", "es", "Madrid"),
      producer(41, "barcelona", "near", "es", "Barcelona"),
      missing,
      producer(42, "barcelona", "same-area", "es", "Santa Coloma de Gramenet"),
    ],
    { explicitLocale: null, locale: "en" },
  );
  const page = buildAccountSelectionPage(
    {
      publicHandle: "our-market",
      displayName: "Market",
      selectionTitle: "Autumn market",
      selectionDescription: "Our chosen producers",
    },
    items,
  );
  assert.deepEqual(
    page.items.map(({ key }) => key),
    ["es:43", "es:41", "es:44", "es:42"],
  );
  assert.deepEqual(page.initialFocusKeys, ["es:43", "es:41", "es:42"]);
  assert.equal(page.title, "Autumn market");
  assert.equal(page.description, "Our chosen producers");
  assert.equal(page.canonicalPath, "/u/our-market");
  assert.deepEqual(getProducerSelectionInitialFocusKeys([]), []);
  for (const [latitude, longitude] of [
    [0, 0],
    [NaN, 2],
    [91, 4],
    [4, 181],
    [Infinity, 4],
    [null, 2],
  ]) {
    assert.equal(
      hasProducerSelectionCoordinates({ latitude, longitude }),
      false,
    );
  }
});

test("producer selections can fit producers across countries", () => {
  assert.ok(PRODUCER_SELECTION_MIN_ZOOM <= 2);
});

test("public map highlights resolve only exact durable producer keys", () => {
  const items = buildProducerSelectionItems(
    [
      producer(42, "barcelona", "shared-slug", "es"),
      producer(43, "madrid", "shared-slug", "es"),
    ],
    { explicitLocale: null, locale: "en" },
  );

  assert.deepEqual(
    items.map(({ key }) => key),
    ["es:42", "es:43"],
  );
  assert.equal(
    buildProducerSelectionHighlightHref("/u/local-food", "es:42"),
    "/u/local-food?highlight=es%3A42",
  );
  assert.equal(
    buildProducerSelectionHighlightHref("/u/local-food", ""),
    "/u/local-food",
  );
  assert.equal(resolveProducerSelectionItem(items, "es:43")?.country, "es");
  assert.equal(resolveProducerSelectionItem(items, "shared-slug"), undefined);
  assert.equal(resolveProducerSelectionItem(items, "es:404"), undefined);
});

test("public producer selections omit standby countries", () => {
  const items = buildProducerSelectionItems(
    [
      producer(43, "barcelona", "published-producer"),
      producer(44, "buenos-aires", "standby-producer", "ar"),
    ],
    { explicitLocale: null, locale: "en" },
  );

  assert.deepEqual(
    items.map(({ key }) => key),
    ["es:43"],
  );
});
