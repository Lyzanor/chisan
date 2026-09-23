import assert from "node:assert/strict";
import test from "node:test";
import { findArea, findPublishedCountry, loadCsvRows } from "../lib/csv-catalog";
import { emptyProducerContent } from "../lib/catalog/content-schema";
import { productSearchInputSchema, productSearchOutputSchema } from "../lib/agents/catalog-schema";
import { publicExpanded, publicProducerBase } from "../lib/agents/public-catalog";
import { createPublicProductSearch, productIndexEntry } from "../lib/agents/public-products";
import { producerHandoff } from "../lib/agents/producer-handoff";
import { GET as products } from "../app/(internal)/api/catalog/v1/products/route";
import { catalogToolPath } from "../lib/agents/webmcp";

async function fixture() {
  const [row] = await loadCsvRows("es", "barcelona");
  return { ...publicProducerBase(row, findPublishedCountry("es")!, findArea("es", "barcelona")!, "es"),
    producer_id: 42, name: "Granja de prueba", municipality: "Vic", coordinates: { latitude: 41.9, longitude: 2.25 },
    contact: { website: "https://producer.example/", email: "hola@producer.example", phone: "+33612345678", facebook: null, instagram: null, maps: null },
  };
}
const product = (id: string, name: string) => ({ id, name, description: "Elaboración de oveja", locale: "es" as const, media_ids: [], link_ids: [], format: "pieza 400 g" });

test("product search matches varieties, composes geography, excludes base-only text and demo products", async () => {
  const base = await fixture();
  const entries = [
    productIndexEntry(base, product("curado", "Queso curado")),
    productIndexEntry(base, product("fresco", "Queso fresco")),
    productIndexEntry({ ...base, producer_id: 12439 }, product("demo", "Queso curado ficticio")),
    productIndexEntry({ ...base, producer_id: 43, coordinates: null }, product("unmapped", "Queso curado")),
  ];
  const search = createPublicProductSearch({ index: async () => entries, visibility: async () => new Set(["es:42", "es:43", "es:12439"]) });
  const result = await search(productSearchInputSchema.parse({ country: "es", q: "QUESO curádo", municipality: "Víc", lat: 41.9, lon: 2.25, radius_km: 5 }));
  productSearchOutputSchema.parse(result);
  assert.deepEqual(result.products.map(p => [p.country, p.producer_id, p.product_id]), [["es", 42, "curado"]]);
  assert.equal((await search(productSearchInputSchema.parse({ q: "Granja" }))).total, 0);
  const exact = await search(productSearchInputSchema.parse({ country: "es", producer_id: 42, product_id: "fresco" }));
  assert.equal(exact.products[0].product.name, "Queso fresco");
  assert.equal(exact.products[0].url, base.url);
  assert.equal("price" in exact.products[0].product, false);
});

test("product pagination rechecks visibility, invalidates stale pages and never hashes hidden content", async () => {
  const base = await fixture();
  const entries = [productIndexEntry(base, product("a", "Queso A")), productIndexEntry(base, product("b", "Queso B")), productIndexEntry({ ...base, producer_id: 43 }, product("secret", "Hidden"))];
  let visible: ReadonlySet<string> | null = new Set(["es:42"]);
  let calls = 0;
  const search = createPublicProductSearch({ index: async () => entries, visibility: async (identities) => { calls++; assert.equal(identities.length, 2); return visible; } });
  const input = productSearchInputSchema.parse({ limit: 1 });
  const first = await search(input);
  assert.equal(first.total, 2);
  assert.ok(first.next);
  assert.equal(new URL(first.next).searchParams.get("limit"), "1");
  const second = await search({ ...input, offset: 1, revision: first.revision });
  assert.equal(second.products[0].product_id, "b");
  entries[2].result.product.name = "Changed hidden content";
  assert.equal((await search(input)).revision, first.revision);
  visible = new Set();
  await assert.rejects(search({ ...input, offset: 1, revision: first.revision }), { code: "catalog_changed" });
  assert.equal((await search(input)).total, 0);
  visible = null;
  const unavailable = await search(input);
  assert.equal(unavailable.visibility, "unavailable");
  assert.deepEqual(unavailable.products, []);
  assert.doesNotMatch(JSON.stringify(unavailable), /Changed hidden|secret/);
  assert.equal(calls, 6);
  const unknownQuery = await search({ ...input, q: "never-recorded" });
  const hiddenQuery = await search({ ...input, q: "Hidden" });
  assert.equal(unknownQuery.visibility, "unavailable");
  assert.deepEqual(unknownQuery, hiddenQuery, "unavailable responses cannot reveal whether hidden text matched");
});

test("product HTTP and WebMCP enforce bounded inputs and do not cache visibility", async () => {
  const endpoint = "https://chisan.app/api/catalog/v1/products";
  for (const query of ["producer_id=42", "product_id=cheese", "limit=51", "lat=41", "limit=1&limit=2", "country=es&stock=yes", "q=!!!"]) {
    assert.equal((await products(new Request(`${endpoint}?${query}`))).status, 400, query);
  }
  assert.equal((await products(new Request(`${endpoint}?country=de`))).status, 404);
  const response = await products(new Request(`${endpoint}?country=es&limit=2`));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = productSearchOutputSchema.parse(await response.json());
  assert.ok(body.products.every(p => p.producer_id !== 12439));
  assert.equal(catalogToolPath("chisan_search_products", { q: "queso & pan" }), "/api/catalog/v1/products?q=queso+%26+pan");
});

test("handoff preserves international phones, requires recorded WhatsApp and never invents visits or a store", async () => {
  const base = await fixture();
  const ordinary = producerHandoff({ ...base, store_url: null, sales_channels: [] }, null);
  assert.equal(ordinary.whatsapp_url, null);
  assert.equal(ordinary.store_url, null);
  assert.equal(ordinary.phone_url, "tel:+33612345678");
  assert.equal(ordinary.visits.status, "unknown");
  assert.match(ordinary.message, /Granja de prueba/);
  assert.equal(ordinary.message_locale, "es");
  assert.equal(decodeURIComponent(ordinary.email_url!.split("body=")[1]), ordinary.message);
  const expanded = publicExpanded({ "visitas guiadas": "sí", visita_cita_previa: "cita previa obligatoria" }, emptyProducerContent("es", 42));
  const recorded = producerHandoff({ ...base, sales_channels: ["whatsapp"] }, expanded);
  assert.equal(new URL(recorded.whatsapp_url!).pathname, "/33612345678");
  assert.equal(new URL(recorded.whatsapp_url!).searchParams.get("text"), recorded.message);
  assert.deepEqual(recorded.visits, { status: "recorded_yes", booking: "cita previa obligatoria", inquiry_url: "tel:+33612345678" });
  const noVisits = publicExpanded({ "visitas guiadas": "no" }, emptyProducerContent("es", 42));
  assert.equal(producerHandoff(base, noVisits).visits.inquiry_url, null);
  const malformed = producerHandoff({ ...base, sales_channels: ["whatsapp"], contact: { ...base.contact, phone: "600112233", email: "a@b.com?bcc=private" } }, null);
  assert.equal(malformed.phone_url, null);
  assert.equal(malformed.whatsapp_url, null);
  assert.equal(malformed.email_url, null);
});
