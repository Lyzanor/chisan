import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { once } from "node:events";
import test from "node:test";
import { parse } from "csv-parse/sync";

test("production profiles share their cache across visitors and preserve private boundaries", async () => {
  const manifest = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
  assert.ok(manifest.dynamicRoutes["/[catalog]/[area]/[segment]"], "build must register the producer ISR route");
  const socket = createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], {
    env: { ...process.env, DATABASE_URL: "", CHISAN_ACCOUNTS_ENABLED: "false", CHISAN_PRODUCER_STATS_ENABLED: "true" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  // Subscribe before startup: cleanup must also finish if Next exits early.
  const exited = new Promise((resolve) => {
    child.once("exit", resolve);
    child.once("error", resolve);
  });
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Production server did not start: ${output}`)), 30_000);
      child.once("exit", () => { clearTimeout(timeout); reject(new Error(output)); });
      child.once("error", (error) => { clearTimeout(timeout); reject(error); });
      child.stdout.on("data", () => {
        if (output.includes("Ready")) { clearTimeout(timeout); resolve(); }
      });
    });
    const base = `http://127.0.0.1:${port}`;
    const [producer] = parse(await readFile("data/csv/es/catalunya/barcelona.csv", "utf8"), { columns: true, skip_empty_lines: true });
    const path = `/es/barcelona/${producer.slug}`;
    const first = await fetch(`${base}${path}`);
    assert.equal(first.status, 200);
    const html = await first.text();
    assert.match(html, /<html lang="es"/);
    assert.match(html, /id="producer-structured-data"/);
    assert.doesNotMatch(html, /api\/producer-stats\/view/);
    const hash = (text) => createHash("sha256").update(text).digest("hex");
    const expectedHash = hash(html);
    const responses = await Promise.all(Array.from({ length: 24 }, async (_, index) => {
      const response = await fetch(`${base}${path}?category=Vino&highlight=${index}`, {
        headers: { Cookie: `untrusted_visitor=${index}`, "Accept-Language": index % 2 ? "en" : "ca" },
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("x-nextjs-cache"), "HIT");
      assert.match(response.headers.get("cache-control"), /s-maxage=3600/);
      assert.equal(response.headers.get("set-cookie"), null);
      assert.equal(hash(await response.text()), expectedHash, "shared HTML must not vary by visitor or query");
      return response;
    }));
    console.log(`Producer cache: ${responses.length}/${responses.length} concurrent HITs with identical public HTML.`);
    for (const [path, parent] of [["/zz", "/"], ["/ca-es", "/es"], ["/ca-es/barcelona/not-a-producer", "/es/barcelona"]]) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 404, path);
      const body = await response.text();
      assert.match(body, /<html lang="es"/);
      assert.ok(body.includes(`href="${parent}"`), path);
    }
    const alias = await fetch(`${base}/es/barcelona/%C3%B8lgod-brewpub-barcelona?category=Cerveza&highlight=old&lat=41`, { redirect: "manual" });
    assert.equal(alias.status, 308);
    assert.equal(alias.headers.get("location"), "/es/barcelona/olgod-brewpub?category=Cerveza&highlight=olgod-brewpub");
    const privateResponse = await fetch(`${base}/api/account/producer?country=es&producerId=1`);
    assert.equal(privateResponse.status, 503, "accounts are explicitly disabled in this isolated server");
    assert.equal(privateResponse.headers.get("cache-control"), "private, no-store");
    const stats = await fetch(`${base}/api/producer-stats/view`, { method: "POST", body: "{}" });
    assert.equal(stats.status, 204);
    assert.equal(stats.headers.get("cache-control"), "private, no-store");
  } finally {
    child.kill("SIGTERM");
    await exited;
  }
});
