import { createOpenAIProvider, openAIConfiguration } from "../lib/ai/openai";
import { aiCallLimit, readAIAllowance } from "../lib/ai/allowance";
import { createAIProvider } from "../lib/ai/runtime";
import { ExtractionFailure } from "../lib/ai/failure";
import { createProductExtractor } from "../lib/intake/extractor";
import { emptyCandidate } from "../lib/intake/product";
import { withAIAllowance, type StructuredAIProvider } from "../lib/ai/structured";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { and, eq } from "drizzle-orm";
import sharp from "sharp";
import { prepareImage } from "../lib/accounts/prepare-producer-image";
import type { Database } from "../lib/db";
import * as schema from "../lib/db/schema";
import { createSelectionShelfService, type ShelfCatalog } from "../lib/selection-shelf/service";
import { createShelfProcessor, createShelfDetector } from "../lib/selection-shelf/detector";
import { SHELF_LIMITS, ShelfError, type ShelfPoint } from "../lib/selection-shelf/policy";
import { matchShelfObservations } from "../lib/selection-shelf/matching";
import { canManageSelectionShelf } from "../lib/selection-shelf/access";
import { createShelfImageHandler, createShelfMutationHandler } from "../lib/selection-shelf/http";
import { createShelfWhatsAppHandler, createShelfWhatsAppLink } from "../lib/selection-shelf/whatsapp";
import { processSender, createLink, unlink, type AssistantDependencies } from "../lib/whatsapp/service";
import { reserveExtraction, WhatsAppBudgetExhausted } from "../lib/whatsapp/budget";
import type { InboundMessage } from "../lib/whatsapp/domain";

const { users, favorites, entitlements, staffGrants, selectionShelves, auditEvents } = schema;
const catalog: ShelfCatalog = async (identities = [{ country: "es", producerId: 1 }, { country: "es", producerId: 2 }]) => identities.filter((identity) => identity.country === "es" && identity.producerId < 3)
  .map((identity) => ({ key: `es:${identity.producerId}`, name: `Producer ${identity.producerId}`, city: "Vilafranca", products: [{ id: "label-a", name: "Label A" }] }));
const point: ShelfPoint = { id: "bottle-a", producerKey: "es:1", label: "Label A", x: 0.3, y: 0.7 };
const photo = (color = "red") => sharp({ create: { width: 800, height: 600, channels: 3, background: color } }).withMetadata().jpeg().toBuffer();

test("migration makes legacy follows public without changing identity, timestamps or profile visibility", async () => {
  const pg = new PGlite();
  try {
    for (const name of (await readdir("drizzle")).filter((name) => /^\d{4}_.+\.sql$/.test(name) && name < "0020_").sort()) await pg.exec(await readFile(`drizzle/${name}`, "utf8"));
    const db = drizzle(pg, { schema }) as unknown as Database;
    const [owner, publishedOwner] = await db.insert(users).values([{}, {}]).returning();
    await pg.query("insert into favorites (user_id, country, producer_id, show_on_public_profile, created_at) values ($1, 'es', 1, false, '2026-01-01T00:00:00Z'), ($1, 'es', 2, true, '2026-01-02T00:00:00Z')", [owner.id]);
    await pg.query("insert into user_presentation (user_id, favorites_attribution_enabled) values ($1, false)", [owner.id]);
    const image = await prepareImage(await photo(), SHELF_LIMITS);
    await db.insert(selectionShelves).values([{ ...image, userId: owner.id, channel: "web", status: "processing", version: 4, points: [point], analysisStartedAt: new Date() },
      { ...image, userId: publishedOwner.id, channel: "web", status: "published", points: [point], reviewedBy: publishedOwner.id, reviewedAt: new Date() }]);
    await pg.exec(await readFile("drizzle/0020_public_follows_shelf_proposals.sql", "utf8"));
    const saved = await db.select().from(favorites);
    assert.deepEqual(saved.map((row) => [row.producerId, row.createdAt.toISOString().slice(0, 10)]), [[1, "2026-01-01"], [2, "2026-01-02"]]);
    assert.equal((await db.select().from(users).where(eq(users.id, owner.id)))[0].publicProfileVisibility, "private");
    const rows = await db.select().from(selectionShelves);
    const draft = rows.find((row) => row.userId === owner.id)!;
    assert.equal(draft.status, "review"); assert.equal(draft.version, 5); assert.equal(draft.analysisStartedAt, null);
    assert.deepEqual(draft.points, [point]); assert.equal(rows.find((row) => row.userId === publishedOwner.id)!.status, "published");
    assert.equal((await db.select().from(schema.userPresentation)).length, 1);
    const columns = await pg.query<{ column_name: string }>("select column_name from information_schema.columns where table_name in ('favorites','user_presentation')");
    assert(!columns.rows.some((row) => ["show_on_public_profile", "favorites_attribution_enabled"].includes(row.column_name)));
  } finally { await pg.close(); }
});

test("catalog resolution keeps ambiguous and unknown labels out and only links reviewed products", async () => {
  const choices = [{ key: "es:1", name: "Celler Mas Candí", city: "Test", products: [{ id: "les-forques", name: "Les Forques" }] },
    { key: "es:2", name: "Example", city: "Test", products: [] }, { key: "fr:2", name: "Example", city: "Test", products: [] }];
  const observation = (producerName: string | null, productName: string | null) => ({ producerName, productName, label: "Visible label", x: 0.3, y: 0.7 });
  const matched = matchShelfObservations({ points: [observation("Mas Candi", "Les Forques"), observation(null, "Les Forques"), observation("Example", null), observation("Unknown", "Les Forques"), observation("Mas Candi", "Unregistered product")] }, choices).points;
  assert.deepEqual(matched.map((point) => point.producerKey), ["es:1", "es:1", null, null, "es:1"]);
  assert.equal(matched[0].productId, "les-forques"); assert.equal(matched[4].productId, undefined);
  assert.deepEqual(matched[2].candidateKeys, ["es:2", "fr:2"]);
});

test("both capabilities accept a different AI adapter and common configuration preserves legacy limits", async () => {
  const names: string[] = [];
  const provider: StructuredAIProvider = {
    profile: { provider: "alternative-provider", model: "fixture", reasoningEffort: "custom", maxOutputTokens: 2048 },
    generate: async (request) => { names.push(request.name); return { value: { points: [] }, usage: null }; },
  };
  const shelf = createShelfDetector(provider);
  const product = createProductExtractor(provider);
  await shelf.detect({ image: await photo() });
  await product.extract({ text: "A label", previous: emptyCandidate(), at: new Date(), timeZone: "Europe/Madrid" });
  assert.deepEqual(names, ["chisan_shelf_detection", "chisan_product_candidate"]);
  assert.equal(shelf.profile.provider, "alternative-provider");
  assert.equal(product.profile.reasoningEffort, "custom");
  const blocked = createShelfDetector(withAIAllowance(provider, async () => { throw new WhatsAppBudgetExhausted(); }));
  await assert.rejects(blocked.detect({ image: await photo() }), WhatsAppBudgetExhausted);
  assert.equal(names.length, 2, "the common runtime wrapper blocks every capability before reaching its provider");
  assert.equal(aiCallLimit({ CHISAN_WHATSAPP_MAX_TOTAL_CALLS: "3" }), 3);
  assert.equal(aiCallLimit({ CHISAN_AI_MAX_TOTAL_CALLS: "0", CHISAN_WHATSAPP_MAX_TOTAL_CALLS: "3" }), 0);
  const configured = openAIConfiguration({ OPENAI_API_KEY: "fake", CHISAN_AI_MODEL: "shared", CHISAN_WHATSAPP_MODEL: "legacy", CHISAN_AI_MAX_OUTPUT_TOKENS: "2048" });
  assert.equal(configured.model, "shared"); assert.equal(configured.maxOutputTokens, 2048);
});
async function fixture() {
  const pg = new PGlite();
  for (const name of (await readdir("drizzle")).filter((file) => /^\d{4}_.+\.sql$/.test(file)).sort()) await pg.exec(await readFile(`drizzle/${name}`, "utf8"));
  const db = drizzle(pg, { schema }) as unknown as Database;
  const [owner, reviewer, stranger] = await db.insert(users).values([
    { displayName: "Shop", termsAcceptedAt: new Date(), publicHandle: "shelf-shop", publicProfileVisibility: "unlisted", publicProfileBaseCountry: "es", publicProfileBaseArea: "barcelona", publicProfileBaseMunicipality: "Barcelona" },
    { displayName: "Reviewer", termsAcceptedAt: new Date() }, { displayName: "Other", termsAcceptedAt: new Date() },
  ]).returning();
  await db.insert(entitlements).values({ subjectKind: "user", userId: owner.id, key: "user.profile.premium", source: "test", startsAt: new Date(Date.now() - 1000) });
  await db.insert(staffGrants).values({ userId: reviewer.id, role: "reviewer" });
  const service = createSelectionShelfService({ database: db, catalog, enabled: () => true,
    location: async (key, municipality) => key === "es/barcelona" && municipality === "Barcelona" ? { country: "es", area: "barcelona", municipality } : null });
  const row = async (id: string) => (await db.select().from(selectionShelves).where(eq(selectionShelves.id, id)))[0];
  const approve = async (id: string, points = [point]) => service.review(reviewer.id, { id, version: (await row(id)).version, action: "approve", points, note: "Labels checked" });
  const publish = async (id: string, producerKeys = ["es:1"]) => service.publish(owner.id, { id, version: (await row(id)).version, producerKeys, profile: { publicHandle: "shelf-shop", baseLocation: "es/barcelona", baseMunicipality: "Barcelona" } });
  return { pg, db, owner, reviewer, stranger, service, row, approve, publish };
}

test("owner publishes a catalog proposal from zero favorites; staff cannot publish and replacements remain private", async () => {
  const f = await fixture();
  try {
    const { db, owner, stranger, reviewer, service, row } = f;
    assert.deepEqual((await service.candidates()).map((item) => item.key), ["es:1", "es:2"]);
    assert.equal((await db.select().from(favorites)).length, 0);
    await assert.rejects(service.submit(stranger.id, await photo(), "web"), ShelfError);
    const id = await service.submit(owner.id, await photo(), "web");
    assert.equal((await row(id)).status, "queued");
    assert.equal(await service.submit(owner.id, await photo(), "web"), id);
    assert.equal(await service.publicShelf(owner.id), null);
    assert.equal(await service.readImage(id, stranger.id), null);
    const bytes = await service.readImage(id, owner.id);
    assert(bytes); const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "webp"); assert.equal(metadata.exif, undefined);
    await assert.rejects(db.update(selectionShelves).set({ width: 700 }).where(eq(selectionShelves.id, id)));
    await assert.rejects(f.publish(id), ShelfError);
    await assert.rejects(service.review(owner.id, { id, version: 1, points: [point], note: "", action: "approve" }), ShelfError);
    await assert.rejects(service.review(reviewer.id, { id, version: 1, points: [point], note: "", action: "publish" }));
    await assert.rejects(f.approve(id, [{ ...point, x: 1.1 }]));
    await assert.rejects(f.approve(id, [{ ...point, productId: "unapproved" }]), ShelfError);
    await f.approve(id, [point, { ...point, id: "bottle-b", producerKey: "es:2" }]);
    assert.equal((await db.select().from(favorites)).length, 0, "even staff approval leaves favorites untouched");
    assert.equal(await service.readImage(id), null);
    const proposal = await service.ownerProposal(owner.id);
    assert.equal(proposal?.producers.length, 2); assert.equal(await service.ownerProposal(stranger.id), null);
    const payload = { id, version: 2, producerKeys: ["es:1"], profile: { publicHandle: "shelf-shop", baseLocation: "es/barcelona", baseMunicipality: "Barcelona" } };
    await assert.rejects(service.publish(owner.id, { ...payload, producerKeys: ["es:999"] }), ShelfError);
    await assert.rejects(service.publish(owner.id, { ...payload, profile: { ...payload.profile, publicHandle: "changed-shop" } }), ShelfError);
    await assert.rejects(service.publish(owner.id, { ...payload, profile: { ...payload.profile, baseMunicipality: "Unknown" } }), ShelfError);
    await db.insert(entitlements).values({ subjectKind: "user", userId: stranger.id, key: "user.profile.premium", source: "test" });
    await assert.rejects(service.publish(stranger.id, payload), (error) => error instanceof ShelfError && error.code === "missing");
    await db.update(users).set({ publicProfileVisibility: "private" }).where(eq(users.id, owner.id));
    await db.insert(favorites).values([{ userId: owner.id, country: "es", producerId: 2 }, { userId: owner.id, country: "es", producerId: 99 }]);
    await f.publish(id);
    assert.deepEqual((await db.select().from(favorites)).map((row) => row.producerId).sort((a, b) => a - b), [1, 99], "deselected proposal favorite removed; unrelated favorite retained");
    assert.equal((await db.select().from(users).where(eq(users.id, owner.id)))[0].publicProfileVisibility, "public");
    await assert.rejects(service.publish(owner.id, payload), (error) => error instanceof ShelfError && error.code === "changed");
    assert.deepEqual((await service.publicShelf(owner.id))?.points, [point]);
    assert(await service.readImage(id));
    const replacement = await service.submit(owner.id, await photo("blue"), "web");
    assert.equal((await service.publicShelf(owner.id))?.id, id);
    await f.approve(replacement); await f.publish(replacement);
    assert.equal((await row(id)).status, "superseded"); assert.equal(await service.readImage(id), null);
    await db.delete(favorites).where(and(eq(favorites.userId, owner.id), eq(favorites.producerId, 1)));
    assert.equal(await service.readImage(replacement), null);
    await db.insert(favorites).values({ userId: owner.id, country: "es", producerId: 1 });
    await db.update(users).set({ publicProfileVisibility: "private" }).where(eq(users.id, owner.id));
    assert.equal(await service.readImage(replacement), null);
    await db.update(users).set({ publicProfileVisibility: "unlisted" }).where(eq(users.id, owner.id));
    await db.update(entitlements).set({ status: "revoked", revokedAt: new Date() }).where(eq(entitlements.userId, owner.id));
    assert.equal(await service.readImage(replacement), null);
    await assert.rejects(service.withdraw(stranger.id, replacement), ShelfError);
    await service.withdraw(owner.id, replacement);
    await db.update(staffGrants).set({ revokedAt: new Date(), revokedByUserId: reviewer.id }).where(eq(staffGrants.userId, reviewer.id));
    await assert.rejects(service.queue(reviewer.id), ShelfError);
  } finally { await f.pg.close(); }
});

test("fresh profiles publish atomically and catalog retirement or conflicting handles fail closed", async () => {
  const f = await fixture();
  try {
    const { db, service, owner, row } = f;
    await db.update(users).set({ publicHandle: null, publicProfileVisibility: "private", publicProfileBaseCountry: null, publicProfileBaseArea: null, publicProfileBaseMunicipality: null }).where(eq(users.id, owner.id));
    const id = await service.submit(owner.id, await photo(), "web");
    await f.approve(id, [{ ...point, productId: "label-a" }]);
    const payload = { id, version: (await row(id)).version, producerKeys: ["es:1"], profile: { publicHandle: "new-shop", baseLocation: "es/barcelona", baseMunicipality: "Barcelona" } };
    const retired = createSelectionShelfService({ database: db, catalog: async () => [], enabled: () => true });
    await assert.rejects(retired.publish(owner.id, payload), (error) => error instanceof ShelfError && error.code === "selection");
    assert.equal((await db.select().from(favorites)).length, 0); assert.equal((await row(id)).status, "ready");
    const [conflict] = await db.insert(users).values({ publicHandle: "new-shop", publicProfileBaseCountry: "es", publicProfileBaseArea: "barcelona", publicProfileBaseMunicipality: "Barcelona" }).returning();
    await assert.rejects(service.publish(owner.id, payload), (error) => error instanceof ShelfError && error.code === "profile");
    assert.equal((await db.select().from(users).where(eq(users.id, owner.id)))[0].publicHandle, null);
    await db.delete(users).where(eq(users.id, conflict.id));
    await service.publish(owner.id, payload);
    const [published] = await db.select().from(users).where(eq(users.id, owner.id));
    assert.equal(published.publicHandle, "new-shop"); assert.equal(published.publicProfileVisibility, "public");
    assert.equal(published.publicProfileBaseMunicipality, "Barcelona"); assert.equal((await service.publicShelf(owner.id))?.points[0].productId, "label-a");
    const productRetired = createSelectionShelfService({ database: db, catalog: async (ids) => (await catalog(ids)).map((item) => ({ ...item, products: [] })), enabled: () => true });
    assert.equal((await productRetired.publicShelf(owner.id))?.points[0].productId, undefined);
    assert.equal(await retired.publicShelf(owner.id), null);
  } finally { await f.pg.close(); }
});

test("automatic discovery spends one shared attempt, never adds favorites, and rejects stale or invalid results", async () => {
  const f = await fixture();
  try {
    const { db, service, owner, reviewer, row } = f;
    let calls = 0;
    let output: unknown = { points: [{ producerName: "Producer 2", productName: "Label A", label: "Label A", x: 0.3, y: 0.7 }, { producerName: null, productName: null, label: "Unreadable", x: 0.8, y: 0.2 }] };
    const processor = (limit: number, detect = async () => { calls++; return output; }) => createShelfProcessor({ database: db, service, detector: () => ({ profile: { provider: "test", model: "fake", promptVersion: "1" }, detect: async () => { await reserveExtraction(db, limit); return detect(); } }) });
    const id = await service.submit(owner.id, await photo(), "web");
    await processor(0)(id);
    assert.equal(calls, 0); assert.equal((await row(id)).analysisError, "budget");
    await service.review(reviewer.id, { id, version: (await row(id)).version, action: "analyze", points: [], note: "" });
    await reserveExtraction(db, 2); // One earlier WhatsApp attempt shares this allowance.
    await Promise.all([processor(2)(id), processor(2)(id)]);
    assert.equal(calls, 1); assert.equal((await row(id)).status, "ready");
    assert.equal((await row(id)).points[0].producerKey, "es:2"); assert.equal((await row(id)).points[0].productId, "label-a");
    assert.equal((await row(id)).suggestions.points.length, 2);
    assert.equal((await db.select().from(favorites)).length, 0); assert.equal(await service.publicShelf(owner.id), null);
    assert.equal(await processor(10)(id), false, "duplicate processing cannot spend another call");
    await assert.rejects(reserveExtraction(db, 2), WhatsAppBudgetExhausted);
    const next = await service.submit(owner.id, await photo("green"), "web");
    await processor(3, async () => { throw new Error("provider credential must never be stored"); })(next);
    await assert.rejects(reserveExtraction(db, 3), WhatsAppBudgetExhausted);
    assert.equal(await processor(4)(next), false, "failed attempts require an explicit retry");
    const bad = await service.submit(owner.id, await photo("blue"), "web");
    output = { points: [{ producerKey: "es:1", label: "Invented ID", x: 0.5, y: 0.5 }] };
    await processor(4)(bad);
    assert.equal((await row(bad)).points.length, 0); assert.equal((await row(bad)).analysisError, "validation");
    const stale = await service.submit(owner.id, await photo("orange"), "web");
    let replacement = "";
    await processor(5, async () => { replacement = await service.submit(owner.id, await photo("purple"), "web"); return { points: [] }; })(stale);
    assert.equal((await row(stale)).status, "superseded"); assert.equal((await row(replacement)).status, "queued");
    await processor(6, async () => { await f.approve(replacement, [{ ...point, label: "Verified manually" }]); return output; })(replacement);
    assert.equal((await row(replacement)).status, "ready"); assert.equal((await row(replacement)).points[0].label, "Verified manually");
    assert(!JSON.stringify(await db.select().from(auditEvents)).includes("credential"));
  } finally { await f.pg.close(); }
});

test("HTTP schedules uploads and enforces consent, origin, ownership and owner-only publication", async () => {
  const f = await fixture();
  try {
    const { owner, service } = f;
    const scheduled: string[] = [];
    const deps = { enabled: () => true, account: async () => owner, service: () => service, schedule: (id: string) => { scheduled.push(id); } };
    const upload = createShelfMutationHandler(deps, "upload");
    const request = (bytes: Uint8Array, extra: Record<string, string> = {}) => new Request("https://chisan.test/api/selection-shelf", { method: "POST", headers: { origin: "https://chisan.test", "x-chisan-shelf": "1", "x-chisan-shelf-consent": "1", ...extra }, body: bytes as BodyInit });
    assert.equal((await upload(request(await photo(), { origin: "https://evil.test" }))).status, 403);
    assert.equal((await upload(request(await photo(), { "x-chisan-shelf-consent": "0" }))).status, 422);
    assert.equal((await createShelfMutationHandler({ ...deps, account: async () => null }, "upload")(request(await photo()))).status, 401);
    assert.equal((await upload(request(Buffer.alloc(SHELF_LIMITS.inputBytes + 1)))).status, 413);
    assert.equal((await upload(request(Buffer.from("<svg></svg>")))).status, 422);
    const response = await upload(request(await photo()));
    assert.equal(response.status, 202); assert.equal(scheduled.length, 1);
    const { id } = await response.json();
    const read = createShelfImageHandler({ ...deps, account: async () => null });
    assert.equal((await read(request(new Uint8Array()), { params: Promise.resolve({ id }) })).status, 404);
    const ownerImage = await createShelfImageHandler(deps)(request(new Uint8Array()), { params: Promise.resolve({ id }) });
    assert.equal(ownerImage.status, 200); assert.match(ownerImage.headers.get("cache-control")!, /no-store/);
    assert.equal((await read(request(new Uint8Array()), { params: Promise.resolve({ id: "malformed" }) })).status, 404);
    const reviewRequest = (action: string, version = 1) => request(Buffer.from(JSON.stringify({ id, action, version, points: [point], note: "Labels checked" })));
    assert.equal((await createShelfMutationHandler(deps, "review")(reviewRequest("approve"))).status, 403);
    const staffReview = createShelfMutationHandler({ ...deps, account: async () => f.reviewer }, "review");
    assert.equal((await staffReview(reviewRequest("analyze"))).status, 409);
    assert.equal((await staffReview(reviewRequest("approve"))).status, 200);
    assert.equal(scheduled.length, 1, "manual approval does not spend another call");
    const publish = createShelfMutationHandler(deps, "publish");
    const payload = { id, version: 2, producerKeys: ["es:1"], profile: { publicHandle: "shelf-shop", baseLocation: "es/barcelona", baseMunicipality: "Barcelona" } };
    assert.equal((await publish(request(Buffer.from(JSON.stringify(payload))))).status, 200);
    assert.equal((await publish(request(Buffer.from(JSON.stringify(payload))))).status, 409);
    assert.equal((await read(request(new Uint8Array()), { params: Promise.resolve({ id }) })).status, 200);
  } finally { await f.pg.close(); }
});

test("premium producer membership enables shelves without changing account kinds", async () => {
  const f = await fixture();
  try {
    const { db, stranger } = f;
    assert.equal(await canManageSelectionShelf(db, stranger.id), false);
    await db.insert(entitlements).values({ subjectKind: "producer", producerCountry: "es", producerId: 12439, key: "producer.profile.premium", source: "test", startsAt: new Date(Date.now() - 1000) });
    assert.equal(await canManageSelectionShelf(db, stranger.id), false);
    await db.insert(schema.producerMemberships).values({ userId: stranger.id, country: "es", producerId: 12439, role: "owner" });
    assert.equal(await canManageSelectionShelf(db, stranger.id), true);
    await db.update(schema.producerMemberships).set({ status: "revoked", revokedAt: new Date(), revokedByUserId: f.reviewer.id }).where(eq(schema.producerMemberships.userId, stranger.id));
    assert.equal(await canManageSelectionShelf(db, stranger.id), false);
    assert.equal((await db.select().from(users).where(eq(users.id, stranger.id)))[0].profileKind, "user");
  } finally { await f.pg.close(); }
});

test("another messaging adapter can submit photos with independent, idempotent receipt keys", async () => {
  const f = await fixture();
  try {
    const first = await f.service.submit(f.owner.id, await photo(), "other-chat", "42");
    const second = await f.service.submit(f.owner.id, await photo("blue"), "whatsapp", "42");
    assert.notEqual(first, second);
    assert.equal((await f.row(first)).messageId, "other-chat:42");
    assert.equal((await f.row(second)).messageId, "whatsapp:42");
    assert.equal(await f.service.submit(f.owner.id, await photo(), "other-chat", "42"), first);
    assert.equal((await f.row(second)).status, "queued", "a replay from another adapter cannot replace current work");
    await assert.rejects(f.service.submit(f.owner.id, await photo(), "untrusted channel", "42"), ShelfError);
  } finally { await f.pg.close(); }
});

test("WhatsApp binding routes shelf photos once, preserves other accounts and never calls the product extractor", async () => {
  process.env.CHISAN_SELECTION_SHELF_ENABLED = "true";
  const f = await fixture();
  try {
    const { db, owner, stranger, service } = f;
    const token = await createShelfWhatsAppLink(db, owner.id);
    let images = 0;
    let failImage = false;
    const dependencies: AssistantDependencies = {
      extractor: { profile: { provider: "test", model: "fake", promptVersion: "1", reasoningEffort: null, maxOutputTokens: 1000 }, extract: async () => { throw new Error("Shelf message reached product extractor"); } },
      image: async () => { throw new Error("Wrong image adapter"); }, send: async () => {},
      shelf: createShelfWhatsAppHandler({ catalog, image: async () => { images++; if (failImage) throw new Error("Expired Meta media"); return photo(); } }),
    };
    let sequence = 0;
    async function receive(text?: string, photoMessage = false, sender = "34600000001") {
      const id = `shelf-test-${++sequence}`;
      const message: InboundMessage = { id, from: sender, timestamp: String(Math.floor(Date.now() / 1000)), type: photoMessage ? "image" : "text", ...(photoMessage ? { image: { id: "image-1", mime_type: "image/jpeg" } } : { text: { body: text! } }) };
      await db.insert(schema.whatsappInbox).values({ id, sender, message });
      await processSender(db, sender, dependencies);
      return (await db.select().from(schema.whatsappInbox).where(eq(schema.whatsappInbox.id, id)))[0];
    }
    assert.match((await receive(`VINCULAR ${token}`)).reply!, /estantería/);
    const imageReceipt = await receive(undefined, true);
    assert.match(imageReceipt.reply!, /Foto recibida/); assert.equal(images, 1);
    assert.equal(imageReceipt.message.image, undefined, "raw inbox content is removed after receipt");
    await processSender(db, imageReceipt.sender, dependencies);
    assert.equal(images, 1, "a repeated signed event cannot create another photo or paid attempt");
    assert.equal((await service.ownerStatus(owner.id))[0].status, "queued");
    let analyses = 0;
    const processShelf = createShelfProcessor({ database: db, service, detector: () => ({ profile: { provider: "fake", model: "test", promptVersion: "1" }, detect: async () => { analyses++; return { points: [{ producerName: "Producer 2", productName: null, label: "Visible", x: 0.5, y: 0.5 }] }; } }) });
    assert.equal(await processShelf(), true); assert.equal(await processShelf(), false); assert.equal(analyses, 1);
    assert.equal((await service.ownerStatus(owner.id))[0].status, "ready");
    assert.equal((await db.select().from(favorites)).length, 0);
    assert.equal((await db.select().from(auditEvents).where(eq(auditEvents.action, "whatsapp.extraction_reserved"))).length, 0);
    failImage = true;
    const failedPhoto = await receive(undefined, true);
    assert.match(failedPhoto.reply!, /No hemos podido recibir/);
    assert(failedPhoto.processedAt, "a bad image cannot block the sender's subsequent messages");
    failImage = false;
    await db.insert(entitlements).values({ subjectKind: "user", userId: stranger.id, key: "user.profile.premium", source: "test", startsAt: new Date(Date.now() - 1000) });
    const otherToken = await createShelfWhatsAppLink(db, stranger.id);
    assert.match((await receive(`VINCULAR ${otherToken}`)).reply!, /ya está vinculado/);
    await db.insert(entitlements).values({ subjectKind: "producer", producerCountry: "es", producerId: 12439, key: "producer.profile.premium", source: "test", startsAt: new Date(Date.now() - 1000) });
    await db.insert(schema.producerMemberships).values({ userId: stranger.id, country: "es", producerId: 12439, role: "owner" });
    process.env.CHISAN_SELECTION_SHELF_ENABLED = "false";
    const producerToken = await createLink(db, { userId: stranger.id, country: "es", producerId: 12439, timeZone: "Europe/Madrid" });
    assert.match((await receive(`VINCULAR ${producerToken}`)).reply!, /estantería/, "disabled feature still protects existing phone ownership");
    process.env.CHISAN_SELECTION_SHELF_ENABLED = "true";
    assert.match((await receive("CANCELAR")).reply!, /retirada/);
    await unlink(db, owner.id);
    assert.equal((await db.select().from(schema.selectionShelfWhatsAppLinks).where(eq(schema.selectionShelfWhatsAppLinks.userId, owner.id))).length, 0);
  } finally { delete process.env.CHISAN_SELECTION_SHELF_ENABLED; await f.pg.close(); }
});

test("shelf provider uses existing Responses configuration, strict output and no provider storage", async () => {
  let payload: Record<string, unknown> | undefined;
  const detector = createShelfDetector(createOpenAIProvider({ apiKey: "fake", model: "configured-model", maxOutputTokens: 4096 }, async (_url, init) => {
    payload = JSON.parse(String(init?.body));
    return Response.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ points: [] }) }] }] });
  }));
  const original = await photo();
  const untouched = Buffer.from(original);
  assert.deepEqual(await detector.detect({ image: original, width: 800, height: 600 }), { points: [] });
  assert.equal(payload?.store, false); assert.equal(payload?.model, "configured-model");
  assert.match(JSON.stringify(payload?.input), /data:image\/webp;base64/);
  const content = (payload?.input as { content: { type: string; text?: string; image_url?: string }[] }[])[0].content;
  const dimensions = JSON.parse(content.find((part) => part.type === "input_text")!.text!);
  assert.equal(dimensions.imageWidth, 800);
  assert.equal(dimensions.imageHeight, 600);
  const guide = await sharp(Buffer.from(content.find((part) => part.type === "input_image")!.image_url!.split(",")[1], "base64")).metadata();
  assert.deepEqual([guide.width, guide.height, guide.format], [800, 600, "webp"], "the guide preserves the original coordinate frame");
  assert.deepEqual(original, untouched, "the owner's photo is never replaced with the inference guide");
  assert.match(JSON.stringify(payload?.text), /"strict":true/);
  assert.equal(payload?.tools, undefined);
});

test("API diagnostics retain usage, failure reasons and automatic points without exposing private inputs", async (t) => {
  const f = await fixture();
  try {
    const { db, owner, reviewer, row } = f;
    const service = createSelectionShelfService({ database: db, catalog, enabled: () => true,
      allowance: (reader) => readAIAllowance(reader, 2) });
    const environment = { OPENAI_API_KEY: "private-credential", CHISAN_AI_MODEL: "gpt-5-nano", CHISAN_AI_MAX_TOTAL_CALLS: "2" };
    let fail = false;
    let calls = 0;
    t.mock.method(globalThis, "fetch", async () => {
      calls++;
      return fail ? Response.json({ error: { code: "invalid_api_key", message: "private-credential and private-image" } }, { status: 401, headers: { "x-request-id": "req_1234567890abcdef" } })
        : Response.json({ status: "completed", usage: { input_tokens: 2000, output_tokens: 300, total_tokens: 2300,
          input_tokens_details: { cached_tokens: 1000 }, output_tokens_details: { reasoning_tokens: 50 } },
          output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ points: [
            { producerName: "Producer 2", productName: "Label A", label: "Label A", x: 0.32, y: 0.64 },
          ] }) }] }] }, { headers: { "x-request-id": "req_1234567890abcdef" } });
    });
    const process = createShelfProcessor({ database: db, service,
      detector: (id) => createShelfDetector(createAIProvider(db, "shelf-identification", environment, { type: "selection_shelf", id })) });
    const id = await service.submit(owner.id, await photo(), "web");
    await process(id);
    assert.equal((await row(id)).status, "ready");
    assert.equal((await row(id)).points[0].x, 0.32);
    assert.equal((await row(id)).points[0].y, 0.64);
    assert.equal((await db.select().from(favorites)).length, 0);
    const detail = await service.reviewDetail(reviewer.id, id);
    assert.deepEqual(detail.analysisAttempts[0].usage, { inputTokens: 2000, outputTokens: 300, totalTokens: 2300, cachedInputTokens: 1000, reasoningTokens: 50 });
    assert.equal(detail.analysisAttempts[0].requestId, "req_1234567890abcdef");
    assert.equal(detail.allowance?.remaining, 1);
    assert.equal(await process(id), false);
    fail = true;
    const failedId = await service.submit(owner.id, await photo("green"), "web");
    await process(failedId);
    const failed = await service.reviewDetail(reviewer.id, failedId);
    assert.equal(failed.analysisAttempts[0].failure?.code, "invalid_api_key");
    assert.equal(failed.analysisAttempts[0].failure?.status, 401);
    assert.equal(failed.analysisAttempts[0].usage, null, "missing usage must never be recorded as zero");
    assert.equal(failed.allowance?.remaining, 0);
    await assert.rejects(service.review(reviewer.id, { id: failedId, version: failed.version, action: "analyze", points: [], note: "" }),
      (error) => error instanceof ShelfError && error.code === "budget");
    assert.equal((await row(failedId)).version, failed.version, "blocked retries leave the saved failure intact");
    assert.equal(calls, 2);
    await assert.rejects(service.reviewDetail(f.stranger.id, id), (error) => error instanceof ShelfError && error.code === "access");
    assert.doesNotMatch(JSON.stringify(await db.select().from(auditEvents)), /private-credential|private-image|image_url/);
  } finally { await f.pg.close(); }
});

test("incomplete API output still records reported token usage and never retries", async () => {
  let calls = 0;
  const reports: unknown[] = [];
  const provider = withAIAllowance(createOpenAIProvider({ apiKey: "fake", model: "gpt-5-nano", maxOutputTokens: 1024 }, async () => {
    calls++;
    return Response.json({ status: "incomplete", incomplete_details: { reason: "max_output_tokens" },
      usage: { input_tokens: 1500, output_tokens: 1024, total_tokens: 2524, output_tokens_details: { reasoning_tokens: 800 } }, output: [] });
  }), async () => {}, async (report) => { reports.push(report); });
  await assert.rejects(createShelfDetector(provider).detect({ image: await photo() }), (error) => {
    assert(error instanceof ExtractionFailure);
    assert.equal(error.code, "max_output_tokens");
    assert.equal(error.usage?.outputTokens, 1024);
    assert.equal(error.usage?.cachedInputTokens, null);
    return true;
  });
  assert.equal(calls, 1);
  assert.equal(reports.length, 1);
  assert.match(JSON.stringify(reports), /"outputTokens":1024/);
});
