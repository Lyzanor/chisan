import assert from "node:assert/strict";
import test from "node:test";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { catalogOperations, catalogOutputSchema, productSearchOutputSchema, searchOutputSchema } from "../lib/agents/catalog-schema";
import { remoteMcpResponse, MCP_LIMITS } from "../lib/agents/remote-mcp";
import { createCatalogRequestBudget } from "../lib/agents/request-budget";
import { needsClerkRequestContext } from "../lib/proxy-scope";

const endpoint = "https://chisan.app/mcp";
const rpc = (body: unknown, headers: Record<string, string> = {}) => new Request(endpoint, {
  method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...headers }, body: JSON.stringify(body),
});
async function jsonRpc(response: Response) {
  const text = await response.text();
  return JSON.parse(response.headers.get("content-type")?.includes("text/event-stream") ? text.split("\n").find(line => line.startsWith("data: "))!.slice(6) : text);
}

for (const mode of ["legacy", "auto"] as const) {
  test(`official SDK ${mode} client connects, discovers and calls Chisan without sessions or auth`, async () => {
    const responses: Response[] = [];
    const client = new Client({ name: "chisan-test", version: "1.0" }, { versionNegotiation: { mode } });
    const transport = new StreamableHTTPClientTransport(new URL(endpoint), { fetch: async (url, init) => {
      const response = await remoteMcpResponse(new Request(url, init));
      responses.push(response);
      return response;
    } });
    try {
      await client.connect(transport);
      assert.equal(transport.protocolVersion, mode === "legacy" ? "2025-11-25" : "2026-07-28");
      assert.equal(client.getServerCapabilities()?.tools?.listChanged, false);
      const listed = await client.listTools();
      assert.deepEqual(listed.tools.map(tool => tool.name), catalogOperations.map(tool => tool.name));
      for (const tool of listed.tools) {
        assert.equal(tool.annotations?.readOnlyHint, true);
        assert.equal(tool.inputSchema.additionalProperties, false);
        assert.ok(tool.outputSchema);
      }
      const catalog = await client.callTool({ name: "chisan_catalog", arguments: {} });
      catalogOutputSchema.parse(catalog.structuredContent);
      const search = await client.callTool({ name: "chisan_search_producers", arguments: { country: "es", limit: 1 } });
      assert.equal(searchOutputSchema.parse(search.structuredContent).producers.length, 1);
      const products = await client.callTool({ name: "chisan_search_products", arguments: { country: "es", limit: 1 } });
      productSearchOutputSchema.parse(products.structuredContent);
      const invalid = await client.callTool({ name: "chisan_search_producers", arguments: { limit: 51 } });
      assert.equal(invalid.isError, true);
      assert.ok(responses.every(response => !response.headers.has("set-cookie") && !response.headers.has("mcp-session-id")));
      assert.ok(responses.every(response => response.headers.get("cache-control") === "no-store"));
    } finally { await client.close(); }
  });
}

test("MCP rejects hostile origins, oversized and malformed requests, and offers no mutation or session methods", async () => {
  assert.equal(needsClerkRequestContext("/mcp"), false);
  assert.equal((await remoteMcpResponse(new Request(endpoint, { method: "OPTIONS" }))).status, 204);
  assert.equal((await remoteMcpResponse(new Request(endpoint))).status, 405);
  assert.equal((await remoteMcpResponse(new Request(endpoint, { method: "DELETE" }))).status, 405);
  assert.equal((await remoteMcpResponse(rpc({}, { Origin: "https://evil.invalid" }))).status, 403);
  assert.equal((await remoteMcpResponse(rpc({}, { Origin: "null" }))).status, 403);
  assert.equal((await remoteMcpResponse(new Request(endpoint, { method: "POST", body: "{}" }))).status, 415);
  assert.equal((await remoteMcpResponse(rpc({ data: "a".repeat(MCP_LIMITS.requestBytes) }))).status, 413);
  assert.equal((await remoteMcpResponse(new Request(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }))).status, 400);
  const unknown = await jsonRpc(await remoteMcpResponse(rpc({ jsonrpc: "2.0", id: 4, method: "orders/create", params: {} })));
  assert.ok(unknown.error);
  const repeated = await remoteMcpResponse(rpc([{ jsonrpc: "2.0", id: 1, method: "ping" }, { jsonrpc: "2.0", id: 2, method: "ping" }]));
  assert.ok(repeated.status >= 400);
  const privateScope = await jsonRpc(await remoteMcpResponse(rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "chisan_search_producers", arguments: { country: "de" } } })));
  assert.equal(privateScope.result.isError, true);
  assert.match(privateScope.result.content[0].text, /not_found/);
});

test("instance budget limits concurrency and request count without retaining client identity", () => {
  let now = 0;
  const budget = createCatalogRequestBudget({ requestsPerMinute: 3, maxConcurrent: 2, now: () => now });
  const first = budget.acquire()!;
  const second = budget.acquire()!;
  assert.equal(budget.acquire(), null);
  first(); first(); // Releasing twice must not create extra concurrency.
  const third = budget.acquire()!;
  second(); third();
  assert.equal(budget.acquire(), null);
  now = 60_001;
  assert.equal(typeof budget.acquire(), "function");
});
