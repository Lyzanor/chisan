import { createOpenAIProvider, openAIConfiguration } from "../lib/ai/openai";
import { aiCallLimit } from "../lib/ai/allowance";
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
import { canManageSelectionShelf } from "../lib/selection-shelf/access";
import { createShelfImageHandler, createShelfMutationHandler } from "../lib/selection-shelf/http";
import { createShelfWhatsAppHandler, createShelfWhatsAppLink } from "../lib/selection-shelf/whatsapp";
import { processSender, createLink, unlink, type AssistantDependencies } from "../lib/whatsapp/service";
import { reserveExtraction, WhatsAppBudgetExhausted } from "../lib/whatsapp/budget";
import type { InboundMessage } from "../lib/whatsapp/domain";

const { users, favorites, entitlements, staffGrants, selectionShelves, auditEvents } = schema;
const catalog: ShelfCatalog = async (identities) => identities.filter((identity) => identity.country === "es" && identity.producerId < 3)
  .map((identity) => ({ key: `es:${identity.producerId}`, name: `Producer ${identity.producerId}`, city: "Vilafranca", products: ["Label A"] }));
const point: ShelfPoint = { id: "bottle-a", producerKey: "es:1", label: "Label A", x: 0.3, y: 0.7 };
const photo = (color = "red") => sharp({ create: { width: 800, height: 600, channels: 3, background: color } }).withMetadata().jpeg().toBuffer();

test("admission migration fences old queued and running analysis without losing reviewed points", async () => {
  const pg = new PGlite();
  try {
    const migrations = (await readdir("drizzle")).filter((file) => /^\d{4}_.+\.sql$/.test(file)).sort();
    for (const name of migrations.filter((name) => name < "0019_")) await pg.exec(await readFile(`drizzle/${name}`, "utf8"));
    const db = drizzle(pg, { schema }) as unknown as Database;
    const image = await prepareImage(await photo(), SHELF_LIMITS);
    const accounts = await db.insert(users).values([{}, {}, {}, {}]).returning();
    for (const [index, status] of ["queued", "processing", "review", "published"].entries()) {
      await db.insert(selectionShelves).values({ ...image, userId: accounts[index].id, channel: "web", status, version: 4,
        points: [point], analysisStartedAt: new Date(), ...(status === "published" ? { reviewedBy: accounts[3].id, reviewedAt: new Date() } : {}) });
    }
    await pg.exec(await readFile("drizzle/0019_selection_shelf_admission.sql", "utf8"));
    const migrated = await db.select().from(selectionShelves);
    assert.equal(migrated.filter((row) => row.status === "received" && row.version === 5 && row.analysisStartedAt === null).length, 3);
    assert.equal(migrated.filter((row) => row.status === "published" && row.version === 4).length, 1);
    assert(migrated.every((row) => row.points[0].label === point.label));
    const [freshAccount] = await db.insert(users).values({}).returning();
    const [fresh] = await db.insert(selectionShelves).values({ ...image, userId: freshAccount.id, channel: "web" }).returning();
    assert.equal(fresh.status, "received", "the database also defaults closed to inference");
  } finally { await pg.close(); }
});

test("both capabilities accept a different AI adapter and common configuration preserves legacy limits", async () => {
  const names: string[] = [];
  const provider: StructuredAIProvider = {
    profile: { provider: "alternative-provider", model: "fixture", reasoningEffort: "custom", maxOutputTokens: 2048 },
    generate: async (request) => { names.push(request.name); return { points: [] }; },
  };
  const shelf = createShelfDetector(provider);
  const product = createProductExtractor(provider);
  await shelf.detect({ image: await photo(), candidates: [] });
  await product.extract({ text: "A label", previous: emptyCandidate(), at: new Date(), timeZone: "Europe/Madrid" });
  assert.deepEqual(names, ["chisan_shelf_detection", "chisan_product_candidate"]);
  assert.equal(shelf.profile.provider, "alternative-provider");
  assert.equal(product.profile.reasoningEffort, "custom");
  const blocked = createShelfDetector(withAIAllowance(provider, async () => { throw new WhatsAppBudgetExhausted(); }));
  await assert.rejects(blocked.detect({ image: await photo(), candidates: [] }), WhatsAppBudgetExhausted);
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
  await db.insert(favorites).values([
    { userId: owner.id, country: "es", producerId: 1, showOnPublicProfile: true },
    { userId: owner.id, country: "es", producerId: 2, showOnPublicProfile: false },
    { userId: owner.id, country: "es", producerId: 999, showOnPublicProfile: true },
  ]);
  const service = createSelectionShelfService({ database: db, catalog, enabled: () => true });
  const row = async (id: string) => (await db.select().from(selectionShelves).where(eq(selectionShelves.id, id)))[0];
  const admit = async (id: string) => service.review(reviewer.id, { id, version: (await row(id)).version, action: "admit", points: (await row(id)).points, note: "Photo admitted by staff" });
  return { pg, db, owner, reviewer, stranger, service, row, admit };
}

test("shelf ownership, explicit sharing, human review, replacement and privacy", async () => {
  const f = await fixture();
  try {
    const { db, owner, stranger, reviewer, service, row } = f;
    assert.deepEqual((await service.candidates(owner.id)).map((item) => item.key), ["es:1"]);
    await assert.rejects(service.submit(stranger.id, await photo(), "web"), ShelfError);
    const id = await service.submit(owner.id, await photo(), "web");
    assert.equal(await service.submit(owner.id, await photo(), "web"), id, "duplicate upload does not create work");
    assert.equal(await service.publicShelf(owner.id), null);
    assert.equal(await service.readImage(id, stranger.id), null);
    const bytes = await service.readImage(id, owner.id);
    assert(bytes);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "webp"); assert.equal(metadata.exif, undefined);
    await assert.rejects(db.update(selectionShelves).set({ width: 700 }).where(eq(selectionShelves.id, id)), "image coordinates cannot drift after upload");
    const review = { id, version: 1, points: [point], note: "Labels checked", action: "publish" };
    await assert.rejects(service.review(owner.id, review), ShelfError);
    await assert.rejects(service.review(reviewer.id, { ...review, points: [{ ...point, producerKey: "es:2" }] }), ShelfError);
    await assert.rejects(service.review(reviewer.id, { ...review, points: [{ ...point, x: 1.1 }] }));
    await assert.rejects(service.review(reviewer.id, review), (error) => error instanceof ShelfError && error.code === "changed", "a received photo cannot bypass admission");
    await f.admit(id);
    await service.review(reviewer.id, { ...review, version: 2 });
    assert.equal((await service.publicShelf(owner.id))?.id, id);
    assert.deepEqual((await service.publicShelf(owner.id))?.points, [point]);
    assert(await service.readImage(id));
    const replacement = await service.submit(owner.id, await photo("blue"), "web");
    assert.equal((await service.publicShelf(owner.id))?.id, id, "previous photo remains visible during replacement review");
    await service.review(reviewer.id, { ...review, id: replacement, action: "save" });
    await assert.rejects(service.review(reviewer.id, { ...review, id: replacement }), (error) => error instanceof ShelfError && error.code === "changed");
    assert.equal((await row(replacement)).status, "received", "saving points does not admit the photo");
    await f.admit(replacement);
    await service.review(reviewer.id, { ...review, id: replacement, version: 3 });
    assert.equal((await row(id)).status, "superseded");
    assert.equal(await service.readImage(id), null, "old image URLs do not keep private copies public");
    await db.update(favorites).set({ showOnPublicProfile: false }).where(and(eq(favorites.userId, owner.id), eq(favorites.producerId, 1)));
    assert.equal(await service.publicShelf(owner.id), null);
    assert.equal(await service.readImage(replacement), null);
    await db.update(favorites).set({ showOnPublicProfile: true }).where(and(eq(favorites.userId, owner.id), eq(favorites.producerId, 1)));
    await db.update(users).set({ publicProfileVisibility: "private" }).where(eq(users.id, owner.id));
    assert.equal(await service.readImage(replacement), null);
    await db.update(users).set({ publicProfileVisibility: "unlisted" }).where(eq(users.id, owner.id));
    await db.update(entitlements).set({ status: "revoked", revokedAt: new Date() }).where(eq(entitlements.userId, owner.id));
    assert.equal(await service.readImage(replacement), null);
    await assert.rejects(service.withdraw(stranger.id, replacement), ShelfError);
    await service.withdraw(owner.id, replacement); // Removal remains possible after premium expires.
    assert.equal((await row(replacement)).status, "superseded");
    await db.update(staffGrants).set({ revokedAt: new Date(), revokedByUserId: reviewer.id }).where(eq(staffGrants.userId, reviewer.id));
    await assert.rejects(service.queue(reviewer.id), ShelfError);
  } finally { await f.pg.close(); }
});

test("AI allowance is shared, failed attempts remain spent and stale results cannot publish", async () => {
  const f = await fixture();
  try {
    const { db, service, owner, reviewer, row } = f;
    let calls = 0;
    let output: unknown = { points: [{ producerKey: "es:1", label: "Label A", x: 0.3, y: 0.7 }, { producerKey: null, label: "Unreadable", x: 0.8, y: 0.2 }] };
    const processor = (limit: number, detect = async () => { calls++; return output; }) => createShelfProcessor({ database: db, service, detector: () => ({ profile: { provider: "test", model: "fake", promptVersion: "1" }, detect: async () => { await reserveExtraction(db, limit); return detect(); } }) });
    const id = await service.submit(owner.id, await photo(), "web");
    assert.equal(await processor(10)(id), false, "unadmitted photos never reach the provider or allowance");
    assert.equal((await db.select().from(auditEvents).where(eq(auditEvents.action, "whatsapp.extraction_reserved"))).length, 0);
    await f.admit(id);
    await processor(0)(id);
    assert.equal(calls, 0); assert.equal((await row(id)).analysisError, "budget");
    await service.review(reviewer.id, { id, version: (await row(id)).version, action: "analyze", points: [], note: "" });
    await reserveExtraction(db, 2); // A prior WhatsApp attempt already used one slot.
    await processor(2)(id);
    assert.equal(calls, 1);
    assert.equal((await row(id)).status, "review"); assert.equal((await row(id)).points.length, 1);
    assert.equal((await row(id)).suggestions.points.length, 2);
    assert.equal(await service.publicShelf(owner.id), null, "AI can never publish");
    await assert.rejects(reserveExtraction(db, 2), WhatsAppBudgetExhausted);
    const next = await service.submit(owner.id, await photo("green"), "web");
    await f.admit(next);
    await processor(3, async () => { calls++; throw new Error("provider credential must never be stored"); })(next);
    await assert.rejects(reserveExtraction(db, 3), WhatsAppBudgetExhausted);
    assert.equal(await processor(4)(next), false, "no automatic repeat of failed paid attempts");
    const bad = await service.submit(owner.id, await photo("blue"), "web");
    await f.admit(bad);
    output = { points: [{ producerKey: "es:2", label: "Private favourite", x: 0.5, y: 0.5 }] };
    await processor(4)(bad);
    assert.equal((await row(bad)).points.length, 0); assert.equal((await row(bad)).analysisError, "validation");
    const stale = await service.submit(owner.id, await photo("orange"), "web");
    await f.admit(stale);
    let replacement = "";
    await processor(5, async () => {
      replacement = await service.submit(owner.id, await photo("purple"), "web");
      return { points: [{ producerKey: "es:1", label: "Old result", x: 0.2, y: 0.2 }] };
    })(stale);
    assert.equal((await row(stale)).status, "superseded");
    assert.equal((await row(replacement)).status, "received", "replacement photos require their own admission");
    await f.admit(replacement);
    await processor(6, async () => {
      await service.review(reviewer.id, { id: replacement, version: (await row(replacement)).version, action: "publish", points: [{ ...point, label: "Verified manually" }], note: "Checked while AI was pending" });
      return { points: [{ producerKey: "es:1", label: "Stale AI label", x: 0.1, y: 0.1 }] };
    })(replacement);
    assert.equal((await row(replacement)).status, "published");
    assert.equal((await row(replacement)).points[0].label, "Verified manually");
    const audits = await db.select().from(auditEvents).where(eq(auditEvents.targetId, next));
    assert(!JSON.stringify(audits).includes("credential"));
  } finally { await f.pg.close(); }
});

test("HTTP checks consent, identity, origin, bounded input and uncached image visibility", async () => {
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
    assert.equal(response.status, 202); assert.equal(scheduled.length, 0, "receiving a photo cannot schedule paid work");
    const { id } = await response.json();
    const read = createShelfImageHandler({ ...deps, account: async () => null });
    assert.equal((await read(request(new Uint8Array()), { params: Promise.resolve({ id }) })).status, 404);
    const ownerImage = await createShelfImageHandler(deps)(request(new Uint8Array()), { params: Promise.resolve({ id }) });
    assert.equal(ownerImage.status, 200); assert.match(ownerImage.headers.get("cache-control")!, /no-store/);
    assert.equal(ownerImage.headers.get("content-type"), "image/webp");
    assert.equal((await read(request(new Uint8Array()), { params: Promise.resolve({ id: "malformed" }) })).status, 404);
    const reviewRequest = (action: string, version = 1) => request(Buffer.from(JSON.stringify({ id, action, version, points: [], note: "Admission checked" })));
    const ownerReview = createShelfMutationHandler(deps, "review");
    assert.equal((await ownerReview(reviewRequest("admit"))).status, 403);
    const staffReview = createShelfMutationHandler({ ...deps, account: async () => f.reviewer }, "review");
    assert.equal((await staffReview(reviewRequest("analyze"))).status, 409, "retry cannot bypass first admission");
    assert.equal((await staffReview(reviewRequest("save"))).status, 200);
    assert.equal((await f.row(id)).status, "received");
    assert.equal(scheduled.length, 0);
    assert.equal((await staffReview(reviewRequest("admit", 2))).status, 200);
    assert.deepEqual(scheduled, [id]);
    assert.equal((await staffReview(reviewRequest("admit", 2))).status, 409);
    assert.equal(scheduled.length, 1, "duplicate admission cannot schedule another request");
    const admissions = await f.db.select().from(auditEvents).where(and(eq(auditEvents.targetId, id), eq(auditEvents.action, "selection_shelf.admit")));
    assert.equal(admissions.length, 1); assert.equal(admissions[0].actorUserId, f.reviewer.id);
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
    assert.equal((await f.row(second)).status, "received", "a replay from another adapter cannot replace current work");
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
    assert.equal((await service.ownerStatus(owner.id))[0].status, "received");
    const processShelf = createShelfProcessor({ database: db, service, detector: () => { throw new Error("Unadmitted WhatsApp photo reached AI"); } });
    assert.equal(await processShelf(), false);
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
  assert.deepEqual(await detector.detect({ image: await photo(), candidates: await catalog([{ country: "es", producerId: 1 }]) }), { points: [] });
  assert.equal(payload?.store, false); assert.equal(payload?.model, "configured-model");
  assert.match(JSON.stringify(payload?.input), /data:image\/webp;base64/);
  assert.match(JSON.stringify(payload?.text), /"strict":true/);
  assert.equal(payload?.tools, undefined);
});
