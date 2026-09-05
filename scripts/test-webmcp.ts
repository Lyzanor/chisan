import assert from "node:assert/strict";
import test from "node:test";
import { setImmediate } from "node:timers/promises";
import {
  catalogToolPath,
  findModelContext,
  registerCatalogTools,
  type ModelContext,
} from "../lib/agents/webmcp";

const definitions = [
  {
    name: "chisan_search_producers",
    description: "Search",
    inputSchema: { type: "object" },
  },
];
type Tool = Parameters<ModelContext["registerTool"]>[0];

test("detects the draft API and earlier preview without requiring a polyfill", () => {
  const current = { registerTool() {} };
  const preview = { registerTool() {}, unregisterTool() {} };
  assert.equal(
    findModelContext({ modelContext: current }, { modelContext: preview }),
    current,
  );
  assert.equal(findModelContext({}, { modelContext: preview }), preview);
  assert.equal(findModelContext({}, {}), null);
});

test("tool paths encode data, cannot choose a host and reject malformed identity", () => {
  assert.equal(
    catalogToolPath("chisan_get_producer", {
      country: "es",
      producer_id: 42,
      locale: "ca",
    }),
    "/api/catalog/v1/producers/es/42?locale=ca",
  );
  assert.equal(
    catalogToolPath("chisan_search_producers", { q: "a&country=de" }),
    "/api/catalog/v1/producers?q=a%26country%3Dde",
  );
  assert.throws(() =>
    catalogToolPath("chisan_get_producer", {
      country: "../../admin",
      producer_id: 42,
    }),
  );
  assert.throws(() =>
    catalogToolPath("chisan_get_producer", {
      country: "es",
      producer_id: "42",
    }),
  );
  assert.throws(() => catalogToolPath("https://evil.invalid", {}));
  assert.throws(() => catalogToolPath("chisan_search_producers", { q: ["x"] }));
});

test("modern registration returns actual JSON with no credentials and aborts execution on cleanup", async () => {
  const tools = new Map<string, Tool>();
  const context: ModelContext = {
    async registerTool(tool, options) {
      assert.equal(tools.has(tool.name), false);
      tools.set(tool.name, tool);
      options!.signal.addEventListener("abort", () => tools.delete(tool.name), {
        once: true,
      });
    },
  };
  let request: { input: unknown; options?: RequestInit } | undefined;
  const cleanup = registerCatalogTools(context, definitions, (async (
    input,
    options,
  ) => {
    request = { input, options };
    return Response.json({ total: 1, producers: [{ producer_id: 42 }] });
  }) as typeof fetch);
  await setImmediate();
  const tool = tools.get(definitions[0].name)!;
  assert.equal(tool.annotations.readOnlyHint, true);
  assert.equal(tool.annotations.untrustedContentHint, true);
  assert.equal(tool.annotations.consequentialHint, false);
  assert.deepEqual(await tool.execute({ country: "es" }), {
    total: 1,
    producers: [{ producer_id: 42 }],
  });
  assert.equal(request?.input, "/api/catalog/v1/producers?country=es");
  assert.equal(request?.options?.credentials, "omit");
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(tool.execute({}, { signal: controller.signal }), {
    name: "AbortError",
  });
  cleanup();
  await setImmediate();
  assert.equal(tools.size, 0);
  await assert.rejects(tool.execute({}), { name: "AbortError" });
});

test("preview remounts serialize async cleanup and preserve unrelated tools", async () => {
  const tools = new Map<string, Tool>();
  tools.set("other_app", {} as Tool);
  const context: ModelContext = {
    async registerTool(tool) {
      await setImmediate();
      assert.equal(tools.has(tool.name), false);
      tools.set(tool.name, tool);
    },
    async unregisterTool(name) {
      await setImmediate();
      tools.delete(name);
    },
  };
  const first = registerCatalogTools(context, definitions);
  await setImmediate();
  first();
  const second = registerCatalogTools(context, definitions);
  for (let i = 0; i < 8; i++) await setImmediate();
  assert.deepEqual([...tools.keys()], ["other_app", "chisan_search_producers"]);
  second();
  for (let i = 0; i < 3; i++) await setImmediate();
  assert.deepEqual([...tools.keys()], ["other_app"]);
});

test("API errors become rejected tool calls instead of successful empty results", async () => {
  let tool: Tool | undefined;
  const cleanup = registerCatalogTools(
    {
      registerTool(value) {
        tool = value;
      },
    },
    definitions,
    (async () =>
      Response.json(
        { error: { message: "Catalog revision changed." } },
        { status: 409 },
      )) as typeof fetch,
  );
  await setImmediate();
  await assert.rejects(tool!.execute({}), /Catalog revision changed/);
  cleanup();
});
