import assert from "node:assert/strict";
import test from "node:test";
import { emptyProducerContent } from "../lib/catalog/content-schema";
import { createPublicExpandedContentReader } from "../lib/catalog/public-expanded";

test("HTML and agent content loader gates exact producer visibility and fails closed", async () => {
  const state = {
    configured: false,
    active: false,
    fail: false,
    brokenContent: false,
    reads: 0,
    identities: [] as unknown[],
    content: emptyProducerContent("es", 42),
  };
  const read = createPublicExpandedContentReader({
    databaseConfigured: () => state.configured,
    hasEntitlement: async (country, id) => {
      state.identities.push([country, id]);
      if (state.fail) throw new Error("private database details");
      return state.active;
    },
    loadContent: async () => {
      state.reads++;
      if (state.brokenContent) throw new Error("private file path");
      return state.content;
    },
  });
  state.content.people = [{ id: "ana", name: "Ana", role: "Panadera", description: "", locale: "es" }];
  assert.equal(await read("es", 42, "es"), null);
  assert.equal(state.identities.length, 0);
  state.configured = true;
  assert.equal(await read("es", 42, "es"), null);
  assert.equal(state.reads, 0);
  state.active = true;
  assert.equal(await read("es", 42, "es"), state.content);
  assert.deepEqual(state.identities.at(-1), ["es", 42]);
  state.active = false;
  assert.equal(await read("es", 42, "es"), null);
  assert.equal(state.reads, 1);
  state.fail = true;
  assert.equal(await read("es", 42, "es"), null);
  state.fail = false;
  state.active = true;
  state.brokenContent = true;
  assert.deepEqual(await read("es", 42, "es"), emptyProducerContent("es", 42));
});

test("the reviewed standalone gallery is public for every producer and fails closed", async () => {
  const { createPublicProducerGalleryReader } = await import("../lib/catalog/public-expanded");
  let fail = false;
  const content = emptyProducerContent("es", 42);
  content.gallery = Array.from({ length: 7 }, (_, index) => ({ id: `photo-${index}`, src: `/productores/es/content/42/photo-${index}.webp`, alt: "Reviewed image", caption: "", credit: "", locale: "es", width: 800, height: 600 }));
  content.products = [{ id: "product", name: "Product", description: "", locale: "es", media_ids: ["photo-0"], link_ids: [] }];
  const read = createPublicProducerGalleryReader({ loadContent: async () => { if (fail) throw new Error("private file path"); return content; } });
  assert.deepEqual((await read("es", 42, "es")).map(image => image.id), ["photo-1", "photo-2", "photo-3", "photo-4", "photo-5", "photo-6"], "no ownership, premium or five-photo gate; product images stay with products");
  assert.equal(content.gallery.length, 7, "reading never changes retained content");
  fail = true;
  assert.deepEqual(await read("es", 42, "es"), []);
});
