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
