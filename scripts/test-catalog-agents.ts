import assert from "node:assert/strict";
import test from "node:test";
import {
  catalogToolDefinitions,
  catalogOperations,
  producerOutputSchema,
  searchInputSchema,
  searchOutputSchema,
} from "../lib/agents/catalog-schema";
import { catalogOpenApi } from "../lib/agents/openapi";
import {
  publicProducerBase,
  publicExpanded,
  searchPublicProducers,
} from "../lib/agents/public-catalog";
import {
  findArea,
  findPublishedCountry,
  loadCsvRows,
} from "../lib/csv-catalog";
import { emptyProducerContent } from "../lib/catalog/content-schema";
import { GET as catalog } from "../app/(internal)/api/catalog/v1/route";
import {
  GET as search,
  OPTIONS,
} from "../app/(internal)/api/catalog/v1/producers/route";
import { GET as detail } from "../app/(internal)/api/catalog/v1/producers/[country]/[producerId]/route";
import { needsClerkRequestContext } from "../lib/proxy-scope";
import robots from "../app/robots";

const origin = "https://chisan.app";
const request = (path = "", init?: RequestInit) =>
  new Request(`${origin}/api/catalog/v1${path}`, init);

test("public API and WebMCP use the same operation schemas", () => {
  const api = catalogOpenApi();
  assert.equal(api.openapi, "3.1.0");
  for (const [i, op] of catalogOperations.entries()) {
    assert.equal(
      api.paths[op.path].get.operationId,
      catalogToolDefinitions[i].name,
    );
    assert.equal(
      catalogToolDefinitions[i].inputSchema.additionalProperties,
      false,
    );
  }
});

test("discovery contains exactly public manifest coverage and supports conditional reads", async () => {
  const result = await catalog(request());
  assert.equal(result.status, 200);
  const body = await result.json();
  assert.deepEqual(
    body.countries.map((c: { slug: string }) => c.slug),
    ["es"],
  );
  assert.ok(
    body.countries[0].regions.flatMap((r: { areas: unknown[] }) => r.areas)
      .length > 0,
  );
  assert.ok(body.categories.includes("Lácteos y quesos"));
  assert.equal(result.headers.get("access-control-allow-origin"), "*");
  assert.equal(result.headers.has("set-cookie"), false);
  const cached = await catalog(
    request("", { headers: { "If-None-Match": result.headers.get("etag")! } }),
  );
  assert.equal(cached.status, 304);
  assert.equal(await cached.text(), "");
  assert.equal(OPTIONS().status, 204);
});

test("queries reject ambiguity, unbounded input and private scope", async () => {
  for (const query of [
    "limit=51",
    "limit=-1",
    "offset=1.5",
    "limit=",
    "q=x&q=y",
    "owner_email=x",
    "__proto__=x",
    "locale=xx",
    "area=barcelona",
    "category=not-a-category",
    "q=%21%21",
    `q=${"a".repeat(201)}`,
  ]) {
    assert.equal(
      (await search(request(`/producers?${query}`))).status,
      400,
      query,
    );
  }
  for (const query of [
    "country=de",
    "country=zz",
    "country=es&area=berlin",
    "country=es&area=barcelona&region=madrid",
    "country=es&area=madrid&locale=ca",
  ]) {
    assert.equal(
      (await search(request(`/producers?${query}`))).status,
      404,
      query,
    );
  }
  assert.equal(
    (await search(request(`/producers?q=${"x".repeat(4100)}`))).status,
    414,
  );
});

test("search pages have stable identities, a revision and no overlaps or hidden expanded text", async () => {
  const first = await searchPublicProducers(
    searchInputSchema.parse({ country: "es", area: "barcelona", limit: 2 }),
  );
  searchOutputSchema.parse(first);
  assert.ok(first.total > 2);
  assert.equal(first.producers.length, 2);
  assert.ok(first.next);
  const secondResponse = await search(new Request(first.next!));
  const second = await secondResponse.json();
  assert.equal(second.offset, 2);
  assert.equal(second.revision, first.revision);
  assert.ok(
    first.producers.every(
      (p) =>
        !second.producers.some(
          (other: { producer_id: number }) =>
            other.producer_id === p.producer_id,
        ),
    ),
  );
  assert.equal("expanded" in first.producers[0], false);
  const changed = new URL(first.next!);
  changed.searchParams.set("revision", "0".repeat(64));
  assert.equal((await search(new Request(changed))).status, 409);
  const unknown = await searchPublicProducers(
    searchInputSchema.parse({ q: "unlikely-no-match-938572" }),
  );
  assert.equal(unknown.total, 0);
  assert.equal(unknown.next, null);
});

test("search normalizes accents and matches additional categories", async () => {
  const rows = await loadCsvRows("es", "barcelona");
  const sample = rows.find((row) => row.additionalCategories.length)!;
  const results = await searchPublicProducers(
    searchInputSchema.parse({
      country: "es",
      area: "barcelona",
      municipality: sample.city
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toUpperCase(),
      category: sample.additionalCategories[0],
      limit: 50,
    }),
  );
  assert.ok(results.producers.some((p) => p.producer_id === sample.producerId));
});

test("explicit output projection excludes private, unknown, premium and generic-image fields", async () => {
  const [row] = await loadCsvRows("es", "barcelona");
  const sample = {
    ...row,
    imageSrc: "/productores/generica.webp",
    fields: {
      ...row.fields,
      secret: "PRIVATE",
      historia: "HIDDEN",
      verificacion: "fully-certified",
      descripcion: "</script>source text",
      descripcion_locale: "es",
    },
  };
  const base = publicProducerBase(
    sample,
    findPublishedCountry("es")!,
    findArea("es", "barcelona")!,
    "es",
  );
  assert.equal(base.image_url, null);
  assert.equal(base.description?.text, "</script>source text");
  assert.doesNotMatch(
    JSON.stringify(base),
    /PRIVATE|HIDDEN|fully-certified|"fields"|"verificacion"/,
  );
  assert.equal(publicExpanded(sample.fields, null), null);
  const content = emptyProducerContent("es", row.producerId);
  content.products.push({
    id: "cheese",
    name: "Queso",
    description: "Reviewed product",
    locale: "es",
    media_ids: [],
    link_ids: [],
  });
  const expanded = publicExpanded(sample.fields, content)!;
  assert.equal(expanded.products[0].id, "cheese");
  assert.equal("translations" in expanded, false);
});

test("identity lookup rejects standby, unsafe IDs and URL overrides; live visibility is not cached", async () => {
  for (const [country, producerId, query, status] of [
    ["de", "1", "", 404],
    ["es", "0", "", 400],
    ["es", "1e2", "", 400],
    ["es", "9007199254740993", "", 400],
    ["es", "1", "?producer_id=2", 400],
  ] as const) {
    assert.equal(
      (
        await detail(request(`/producers/${country}/${producerId}${query}`), {
          params: Promise.resolve({ country, producerId }),
        })
      ).status,
      status,
    );
  }
  const [row] = await loadCsvRows("es", "barcelona");
  const result = await detail(request(`/producers/es/${row.producerId}`), {
    params: Promise.resolve({
      country: "es",
      producerId: String(row.producerId),
    }),
  });
  assert.equal(result.status, 200);
  const body = producerOutputSchema.parse(await result.json());
  assert.equal(body.producer.producer_id, row.producerId);
  assert.equal(body.producer.expanded, null); // Test runner has no database credentials.
  assert.equal(body.producer.ownership, "not_asserted");
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.equal(result.headers.has("etag"), false);
  assert.equal(
    needsClerkRequestContext(`/api/catalog/v1/producers/es/${row.producerId}`),
    false,
  );
  assert.equal(needsClerkRequestContext("/api/account/me"), true);
  assert.equal(needsClerkRequestContext("/api/catalog/v10/private"), true);
});

test("discovery policy keeps previews closed and allows only the public API on launch", async () => {
  const previous = {
    vercel: process.env.VERCEL_ENV,
    discovery: process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED,
  };
  try {
    process.env.VERCEL_ENV = "preview";
    process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = "true";
    assert.deepEqual((await robots()).rules, { userAgent: "*", disallow: "/" });
    process.env.VERCEL_ENV = "production";
    const rules = (await robots()).rules;
    assert.ok(!Array.isArray(rules));
    assert.ok(
      (rules as { allow: string[] }).allow.includes("/api/catalog/v1/"),
    );
    assert.ok((rules as { disallow: string[] }).disallow.includes("/api/"));
  } finally {
    if (previous.vercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous.vercel;
    if (previous.discovery === undefined)
      delete process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED;
    else process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = previous.discovery;
  }
});

test("spatial queries validate the complete triple and decimal ranges", async () => {
  for (const query of ["lat=0", "lon=0&radius_km=1", "lat=0&lon=0", "lat=91&lon=0&radius_km=1", "lat=0&lon=-181&radius_km=1", "lat=0&lon=0&radius_km=0", "lat=0&lon=0&radius_km=501", "lat=&lon=0&radius_km=1", "lat=NaN&lon=0&radius_km=1", "lat=0&lat=1&lon=0&radius_km=1"]) {
    assert.equal((await search(request(`/producers?${query}`))).status, 400, query);
  }
  const empty = await search(request("/producers?lat=0&lon=-0.5&radius_km=.1"));
  assert.equal(empty.status, 200);
  assert.equal((await empty.json()).total, 0);
});

test("spatial results combine filters, respect distance and preserve pagination", async () => {
  const { producerDistanceKm } = await import("../lib/location/nearby-producer-focus");
  const query = "/producers?country=es&area=barcelona&lat=41.39&lon=2.17&radius_km=25&limit=1";
  const response = await search(request(query));
  assert.equal(response.status, 200);
  const first = await response.json();
  assert.ok(first.total > 1);
  const secondResponse = await search(new Request(first.next));
  assert.equal(secondResponse.status, 200);
  const second = await secondResponse.json();
  assert.equal(first.total, second.total);
  assert.notEqual(first.producers[0].producer_id, second.producers[0].producer_id);
  assert.equal(new URL(first.next).searchParams.get("radius_km"), "25");
  for (const producer of [...first.producers, ...second.producers]) {
    assert.equal(producer.area.slug, "barcelona");
    assert.ok(producerDistanceKm({ latitude: 41.39, longitude: 2.17 }, producer.coordinates) <= 25);
  }
  const category = first.producers[0].categories[0].token;
  const filtered = await search(request(`${query}&category=${encodeURIComponent(category)}`));
  const filteredBody = await filtered.json();
  assert.ok(filteredBody.total <= first.total);
  assert.ok(filteredBody.producers.every((p: { categories: { token: string }[] }) => p.categories.some((c) => c.token === category)));
});
