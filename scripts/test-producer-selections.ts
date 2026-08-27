import assert from "node:assert/strict";
import test from "node:test";

import type { LocatedProducerCsvRow } from "../lib/csv-catalog";
import { buildProducerSelectionItems } from "../lib/producer-selections.server";
import { PRODUCER_SELECTION_MIN_ZOOM } from "../lib/producer-selections";

function producer(
  producerId: number,
  area: string,
  slug: string,
): LocatedProducerCsvRow {
  return {
    producerId,
    slug,
    name: `Producer ${producerId}`,
    city: area,
    category: "Aceite",
    additionalCategories: [],
    categories: ["Aceite"],
    featuredProducts: "",
    imageSrc: "",
    latitude: 40 + producerId / 100,
    longitude: -3,
    fields: {},
    country: "es",
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
    items.map(({ key, href }) => ({ key, href })),
    [
      { key: "es:41", href: "/es/barcelona/barcelona-producer" },
      { key: "es:42", href: "/es/madrid/madrid-producer" },
    ],
  );
});

test("producer selections can fit producers across countries", () => {
  assert.ok(PRODUCER_SELECTION_MIN_ZOOM <= 2);
});
