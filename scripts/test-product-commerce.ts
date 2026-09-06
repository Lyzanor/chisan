import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import {
  contentProductSchema,
  contentSourceHash,
  emptyProducerContent,
  producerContentSchema,
} from "../lib/catalog/content-schema";
import { normalizeProductPriceInput } from "../lib/catalog/product-commerce";
import {
  hashProducerContent,
  proposeProducerProducts,
} from "../lib/accounts/producer-content-change";
import { dateSubmittedProducts } from "../lib/accounts/product-update-dates";
import { validateProductCommerce } from "../lib/editorial/product-commerce-validation";
import { buildProductStructuredData } from "../lib/catalog/product-structured-data";
import { serializeStructuredData } from "../lib/producer-structured-data";
import { productUpdatePresentation } from "../lib/i18n/product-commerce";

const product = contentProductSchema.parse({
  id: "cheese",
  name: "Queso",
  locale: "es",
});
function fixture() {
  return {
    ...emptyProducerContent("es", 1),
    products: [{ ...product, updated_on: "2026-01-01" }],
  };
}
test("commerce validates decimal amounts, currency, dates and safe external URLs", () => {
  for (const amount of ["0.00", "3.50", "999999.99"])
    assert.ok(
      contentProductSchema.safeParse({
        ...product,
        price: { amount, currency: "EUR" },
      }).success,
    );
  for (const price of [
    { amount: 3.5, currency: "EUR" },
    { amount: "-1.00", currency: "EUR" },
    { amount: "3,50", currency: "EUR" },
    { amount: "3.500", currency: "EUR" },
    { amount: "1e2", currency: "EUR" },
    { amount: "1000000.00", currency: "EUR" },
    { amount: "3.50", currency: "USD" },
  ])
    assert.equal(
      contentProductSchema.safeParse({ ...product, price }).success,
      false,
    );
  for (const purchase_url of [
    "javascript:alert(1)",
    "/shop",
    "https://user:secret@example.org/p",
    "data:text/html,test",
  ])
    assert.equal(
      contentProductSchema.safeParse({ ...product, purchase_url }).success,
      false,
    );
  assert.equal(
    contentProductSchema.safeParse({ ...product, updated_on: "2026-02-30" })
      .success,
    false,
  );
  assert.equal(normalizeProductPriceInput("003,5"), "3.50");
  assert.equal(normalizeProductPriceInput("9"), "9.00");
  assert.equal(normalizeProductPriceInput("1.234"), "1.234");
});
test("optional additions preserve old semantic hashes and prose translation hashes", () => {
  const legacy = { ...emptyProducerContent("es", 1), products: [product] };
  const ordered = (value: unknown): unknown =>
    Array.isArray(value)
      ? value.map(ordered)
      : value && typeof value === "object"
        ? Object.fromEntries(
            Object.entries(value)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, item]) => [key, ordered(item)]),
          )
        : value;
  assert.equal(
    hashProducerContent(legacy),
    createHash("sha256")
      .update(JSON.stringify(ordered(legacy)))
      .digest("hex"),
  );
  assert.deepEqual(producerContentSchema.parse(legacy), legacy);
  assert.equal(
    contentSourceHash("products", product),
    contentSourceHash("products", contentProductSchema.parse({
      ...product,
      price: { amount: "3.50", currency: "EUR" },
      updated_on: "2026-09-06",
    })),
  );
});
test("only real submitted product edits renew server-owned dates", () => {
  const base = fixture();
  const changed = structuredClone(base);
  changed.products[0].name = "Queso curado";
  changed.products[0].updated_on = "2099-01-01";
  assert.equal(
    dateSubmittedProducts(base, changed)[0].updated_on,
    "2026-01-01",
    "draft retains published date",
  );
  assert.equal(
    dateSubmittedProducts(base, changed, "2026-09-06")[0].updated_on,
    "2026-09-06",
  );
  const forged = structuredClone(base);
  forged.products[0].updated_on = "2099-01-01";
  assert.equal(
    proposeProducerProducts(
      base,
      dateSubmittedProducts(base, forged, "2026-09-06"),
    ),
    null,
    "date-only forgery is not a change",
  );
  const added = {
    ...base,
    products: [
      ...base.products,
      { ...product, id: "new", updated_on: "2099-01-01" },
    ],
  };
  assert.equal(dateSubmittedProducts(base, added)[1].updated_on, undefined);
  assert.equal(
    dateSubmittedProducts(base, added, "2026-09-06")[1].updated_on,
    "2026-09-06",
  );
  assert.deepEqual(
    dateSubmittedProducts(
      added,
      { ...added, products: [...added.products].reverse() },
      "2026-09-06",
    ).map((p) => p.updated_on),
    ["2099-01-01", "2026-01-01"],
  );
  const linked = producerContentSchema.parse({
    ...base,
    links: [
      { id: "shop", label: "Shop", url: "https://example.org", locale: "en" },
    ],
  });
  const edits = structuredClone(linked);
  edits.links[0].label = "New shop label";
  assert.equal(
    dateSubmittedProducts(linked, edits, "2026-09-06")[0].updated_on,
    "2026-01-01",
    "unattached changes do not renew dates",
  );
  linked.products[0].link_ids = ["shop"];
  edits.products[0].link_ids = ["shop"];
  assert.equal(
    dateSubmittedProducts(linked, edits, "2026-09-06")[0].updated_on,
    "2026-09-06",
    "referenced content is part of the product record",
  );
});
test("publication rejects future dates and undated commerce, while allowing legacy records", () => {
  const content = fixture();
  validateProductCommerce(content, "2026-09-06");
  content.products[0].updated_on = "2026-09-07";
  assert.throws(() => validateProductCommerce(content, "2026-09-06"), /future/);
  const undated = {
    ...content,
    products: [{ ...product, purchase_url: "https://example.org/shop" }],
  };
  assert.throws(() => validateProductCommerce(undated), /requires updated_on/);
  validateProductCommerce({ ...content, products: [product] });
});
test("relative labels use calendar weeks/months and a one-year interval with exact dates", () => {
  const now = new Date("2026-09-14T12:00:00Z");
  assert.equal(
    productUpdatePresentation("2026-09-14", "es", now).label,
    "Actualizado esta semana",
  );
  assert.equal(
    productUpdatePresentation("2026-09-13", "es", now).label,
    "Actualizado este mes",
  );
  assert.equal(
    productUpdatePresentation("2026-08-31", "es", now).label,
    "Actualizado en el último año",
  );
  assert.equal(
    productUpdatePresentation("2025-09-14", "es", now).label,
    "Actualizado en el último año",
  );
  assert.match(
    productUpdatePresentation("2025-09-13", "es", now).label,
    /13 de septiembre de 2025/,
  );
  assert.match(
    productUpdatePresentation("2026-09-14", "es", now).exact,
    /14 de septiembre de 2026/,
  );
  assert.equal(
    productUpdatePresentation(
      "2026-08-31",
      "es",
      new Date("2026-09-01T00:00:00Z"),
    ).label,
    "Actualizado esta semana",
    "week takes precedence across month boundary",
  );
  assert.equal(
    productUpdatePresentation("2026-09-14", "ca", now).label,
    "Actualitzat aquesta setmana",
  );
  assert.equal(
    productUpdatePresentation("2026-09-14", "en", now).label,
    "Updated this week",
  );
});
test("JSON-LD exposes only supported visible semantics and never fictional offers", () => {
  const content = producerContentSchema.parse({
    ...fixture(),
    products: [
      {
        ...product,
        price: { amount: "3.50", currency: "EUR" },
        purchase_url: "https://shop.example.org/cheese",
        updated_on: "2026-09-06",
      },
    ],
  });
  const url = "https://chisan.app/es/barcelona/example";
  const graph = buildProductStructuredData(content, url)!;
  const node = graph["@graph"].find((n) => n["@type"] === "Product")!;
  assert.ok("offers" in node);
  assert.deepEqual(node.offers, {
    "@type": "Offer",
    url: "https://shop.example.org/cheese",
    price: "3.50",
    priceCurrency: "EUR",
  });
  assert.equal("dateModified" in node, false);
  const record = graph["@graph"].find((n) => n["@type"] === "WebPageElement")!;
  assert.ok("dateModified" in record);
  assert.equal(record.dateModified, "2026-09-06");
  assert.doesNotMatch(
    JSON.stringify(graph),
    /availability|priceValidUntil|BuyAction|AggregateRating/,
  );
  assert.doesNotMatch(
    JSON.stringify(
      buildProductStructuredData({ ...content, producer_id: 12439 }, url),
    ),
    /"offers"/,
  );
  delete content.products[0].purchase_url;
  assert.doesNotMatch(
    JSON.stringify(buildProductStructuredData(content, url)),
    /"offers"/,
  );
  assert.equal(
    buildProductStructuredData(emptyProducerContent("es", 1), url),
    null,
  );
  content.products[0].name = "</script><script>alert(1)</script>";
  assert.doesNotMatch(
    serializeStructuredData(buildProductStructuredData(content, url)),
    /<script|<\/script/,
  );
});
