import assert from "node:assert/strict";
import test from "node:test";
import {
  listPublishedGuides,
  resolveGuideProducers,
  guidePath,
} from "../lib/guides/catalog";

const baseUrl = process.env.BASE_URL;
assert.ok(baseUrl, "BASE_URL is required; run through pnpm test:behavior");

test("guide routes serve Spanish text, canonical metadata and exact producer links before JavaScript", async () => {
  const index = await fetch(`${baseUrl}/guias`, {
    headers: { "Accept-Language": "en" },
  });
  assert.equal(index.status, 200);
  const indexHtml = await index.text();
  assert.match(indexHtml, /<html lang="es"/);
  for (const guide of listPublishedGuides()) {
    const route = guidePath(guide.slug);
    assert.ok(indexHtml.includes(`href="${route}"`));
    const response: Response = await fetch(`${baseUrl}${route}`, {
      headers: { "Accept-Language": "en" },
    });
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<html lang="es"/);
    assert.ok(html.includes(`href="https://chisan.app${route}"`));
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /"@type":"Article"/);
    assert.match(html, /Nuestro criterio editorial/);
    assert.match(html, /Explorar esta selección en el mapa/);
    const producers = await resolveGuideProducers(guide);
    for (const producer of producers)
      assert.ok(html.includes(`href="${producer.href}"`));
    const profile: Response = await fetch(`${baseUrl}${producers[0].href}`);
    assert.equal(profile.status, 200);
    const profileHtml = await profile.text();
    assert.match(profileHtml, /Aparece en estas guías/);
    assert.ok(profileHtml.includes(`href="${route}"`));
  }
  assert.equal((await fetch(`${baseUrl}/guias/unknown-guide`)).status, 404);
  const home = await fetch(`${baseUrl}/`);
  assert.match(await home.text(), /Otra forma de descubrir el origen/);
});
