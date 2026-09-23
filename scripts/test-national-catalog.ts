import assert from "node:assert/strict";
import test from "node:test";
import { encodeExplorerPage, type ExplorerProducer } from "../lib/catalog/explorer";
import { createNationalCatalogLoader } from "../lib/catalog/national-catalog";

const fixture = (id: number, country: string): ExplorerProducer => ({
  country, producerId: id, key: String(id), slug: `producer-${id}`,
  href: `/${country}/area/producer-${id}`, area: "area", areaLabel: "Área",
  name: `Producer ${id}`, city: "City", category: "Vino", categories: ["Vino"],
  categoryLabels: ["Vino"], featuredProducts: "Garnacha", description: "Texto íntegro",
  imageSrc: "/productores/generica.webp", latitude: id === 3 ? null : 41,
  longitude: id === 3 ? null : 2,
});

function source() {
  const calls: URL[] = [];
  let failure: "none" | "http" | "revision" | "duplicate" | "truncated" = "none";
  const fetcher: typeof fetch = async (input) => {
    const url = new URL(String(input), "https://chisan.invalid");
    calls.push(url);
    assert.deepEqual([...url.searchParams.keys()].sort(),
      ["country", "format", "locale", "offset", ...(url.searchParams.has("revision") ? ["revision"] : [])].sort());
    if (failure === "http") return new Response(null, { status: 503 });
    const country = url.searchParams.get("country")!;
    const offset = Number(url.searchParams.get("offset"));
    const producers = [1, 2, 3].map((id) => fixture(id, country));
    if (failure === "duplicate") producers[2] = producers[0];
    if (failure === "truncated") producers.pop();
    return Response.json(encodeExplorerPage({
      revision: failure === "revision" && offset > 0 ? "b".repeat(64) : "a".repeat(64),
      total: 3, limit: 2, offset, producers: producers.slice(offset, offset + 2),
    }, country, `/${country}`));
  };
  return { calls, fetcher, fail: (value: typeof failure) => { failure = value; } };
}

test("national loads are shared across consumers and retain every producer, marker and searchable field", async () => {
  const api = source();
  const load = createNationalCatalogLoader(api.fetcher);
  const first = load("es", "es");
  assert.equal(load("es", "es"), first);
  const catalog = await first;
  assert.deepEqual(catalog.producers, [1, 2, 3].map((id) => fixture(id, "es")));
  assert.equal(await load("es", "es"), catalog);
  assert.equal(api.calls.length, 2, "remount/navigation must reuse the complete country load");
});

test("country and locale caches are distinct, expire, and retain at most four entries", async () => {
  const api = source();
  let time = 0;
  const load = createNationalCatalogLoader(api.fetcher, () => time);
  await load("es", "es");
  await load("es", "ca");
  assert.equal(api.calls.length, 4);
  time = 300_001;
  await load("es", "es");
  assert.equal(api.calls.length, 6);
  for (const country of ["fr", "it", "pt", "de"]) await load(country, "es");
  const before = api.calls.length;
  await load("es", "es");
  assert.equal(api.calls.length, before + 2);
});

for (const failure of ["http", "revision", "duplicate", "truncated"] as const) {
  test(`national ${failure} failure never publishes partial coverage and remains retryable`, async () => {
    const api = source();
    const load = createNationalCatalogLoader(api.fetcher);
    api.fail(failure);
    await assert.rejects(load("es", "es"));
    api.fail("none");
    assert.equal((await load("es", "es")).producers.length, 3);
  });
}
