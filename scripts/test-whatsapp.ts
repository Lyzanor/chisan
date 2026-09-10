import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { z } from "zod";
import type { Database } from "../lib/db";
import * as schema from "../lib/db/schema";
import {
  appendCandidate,
  candidateReply,
  candidateHash,
  emptyCandidate,
  normalizeCandidate,
  parseWebhook,
  verifyMetaSignature,
  type InboundMessage,
  type ProductCandidate,
} from "../lib/whatsapp/domain";
import {
  createLink,
  drainInbox,
  processSender,
  unlink,
  type AssistantDependencies,
} from "../lib/whatsapp/service";
import {
  extractProduct,
  extractionProfile,
  openAIProductConfig,
} from "../lib/intake/openai";
import { interpretProductMessage } from "../lib/intake/extractor";
import { candidateSchema } from "../lib/intake/product";
import { contentProductSchema } from "../lib/catalog/content-schema";
import { readProducerChangeIntake } from "../lib/accounts/producer-change-intake";
import {
  queryAdminProducerChangeById,
  serializeProducerChangeDetail,
} from "../lib/admin/producer-change-requests";
import { createProducerChangeReviewService } from "../lib/admin/review-producer-change";
import {
  applyProducerPatchToCsv,
  resolveExpectedProducerChange,
} from "../lib/editorial/producer-csv";
import { assertFinalizationGitState } from "../lib/editorial/git-state";
import { prepareContentPublication } from "../lib/editorial/producer-content-publication";
import { loadProducerContent } from "../lib/catalog/content";
import {
  boundedBytes,
  downloadImage,
  safeMetaMediaUrl,
  sendReply,
} from "../lib/whatsapp/meta";
import { whatsappConfig, whatsappEnabled } from "../lib/whatsapp/config";
import { POST, GET } from "../app/(application)/api/webhooks/whatsapp/route";
import { GET as recover } from "../app/(application)/api/whatsapp/process/route";

const complete = (): ProductCandidate => ({
  ...emptyCandidate(),
  name: "Cerveza del huerto",
  format: "Botella de 75 cl",
  price_amount: "8.00",
});
const config = {
  version: "v99.0",
  phoneId: "123",
  number: "34600000000",
  appSecret: "test-app-secret",
  verifyToken: "test-verify",
  accessToken: "test-token",
  apiKey: "test-key",
  model: "test-model",
  reasoningEffort: undefined,
  maxOutputTokens: 4096,
};

test("model configuration is explicit, bounded and independent of credentials", () => {
  const environment = {
    WHATSAPP_GRAPH_VERSION: config.version,
    WHATSAPP_PHONE_NUMBER_ID: config.phoneId,
    WHATSAPP_BUSINESS_NUMBER: config.number,
    WHATSAPP_APP_SECRET: config.appSecret,
    WHATSAPP_VERIFY_TOKEN: config.verifyToken,
    WHATSAPP_ACCESS_TOKEN: config.accessToken,
    OPENAI_API_KEY: config.apiKey,
    CHISAN_WHATSAPP_MODEL: config.model,
  };
  assert.equal(
    whatsappConfig({
      ...environment,
      OPENAI_API_KEY: undefined,
      CHISAN_WHATSAPP_MODEL: undefined,
    }).phoneId,
    config.phoneId,
  );
  assert.equal(
    openAIProductConfig({
      OPENAI_API_KEY: config.apiKey,
      CHISAN_WHATSAPP_MODEL: config.model,
    }).model,
    config.model,
  );
  assert.equal(openAIProductConfig(environment).reasoningEffort, undefined);
  assert.equal(openAIProductConfig(environment).maxOutputTokens, 4096);
  const upgraded = openAIProductConfig({
    ...environment,
    CHISAN_WHATSAPP_MODEL: "future-compatible-model",
    CHISAN_WHATSAPP_REASONING_EFFORT: "high",
    CHISAN_WHATSAPP_MAX_OUTPUT_TOKENS: "8192",
  });
  assert.equal(upgraded.apiKey, config.apiKey);
  assert.equal(upgraded.model, "future-compatible-model");
  assert.equal(upgraded.reasoningEffort, "high");
  for (const setting of ["auto", "hgh"])
    assert.throws(() =>
      openAIProductConfig({
        ...environment,
        CHISAN_WHATSAPP_REASONING_EFFORT: setting,
      }),
    );
  for (const setting of ["0", "999999", "NaN", "2048.5"])
    assert.throws(() =>
      openAIProductConfig({
        ...environment,
        CHISAN_WHATSAPP_MAX_OUTPUT_TOKENS: setting,
      }),
    );
  assert.equal(
    readProducerChangeIntake([
      {
        action: "producer_change.submitted",
        metadata: { authorNote: "Submitted via WhatsApp" },
      },
    ]),
    null,
  );
});

test("shared intake inherits canonical fields and validates every provider's output", async () => {
  const maxDescription = z.toJSONSchema(
    contentProductSchema.shape.description,
  ).maxLength!;
  for (const length of [maxDescription, maxDescription + 1]) {
    const description = "a".repeat(length);
    assert.equal(
      candidateSchema.safeParse({ ...complete(), description }).success,
      contentProductSchema.shape.description.safeParse(description).success,
    );
  }
  const input = {
    text: "Perdón, son 7 euros",
    previous: complete(),
    at: new Date(),
    timeZone: "Europe/Madrid",
  };
  const profile = {
    ...extractionProfile(config),
    provider: "local-test",
    reasoningEffort: "balanced",
  };
  const extractor = {
    profile,
    extract: async () => ({
      action: "product",
      candidate: { ...complete(), price_amount: "7.00" },
    }),
  };
  assert.equal(
    (await interpretProductMessage(extractor, input)).candidate.price_amount,
    "7.00",
  );
  for (const candidate of [
    { ...complete(), updated_on: "2099-01-01" },
    { ...complete(), name: "<b>Unreviewed HTML</b>" },
    { ...complete(), purchase_url: "javascript:alert(1)" },
  ])
    await assert.rejects(
      interpretProductMessage(
        { profile, extract: async () => ({ action: "product", candidate }) },
        input,
      ),
    );
  const cancel = {
    profile,
    extract: async () => ({ action: "cancel", candidate: complete() }),
  };
  await assert.rejects(
    interpretProductMessage(cancel, {
      ...input,
      text: "",
      image: Buffer.from("photo"),
    }),
    /photo cannot/,
  );
  assert.equal(
    (
      await interpretProductMessage(cancel, {
        ...input,
        text: "Mejor descártalo",
      })
    ).action,
    "cancel",
  );
});

// Run the actual review, file preparation, commit verification and database
// finalization against an isolated database and disposable Git repository.
async function publishReceivedProduct(
  database: Database,
  pg: PGlite,
  change: schema.ProducerChangeRequest,
  reviewerId: string,
) {
  const review = createProducerChangeReviewService({
    getDatabase: () => database,
    requireStaffAccount: async () => ({ id: reviewerId }),
    adminRedirect: (_path, kind, message) => {
      throw new Error(`${kind}:${message}`);
    },
  });
  const form = new FormData();
  form.set("changeId", change.id);
  form.set("decision", "approved");
  form.set(
    "note",
    "Reviewed the automatically submitted fictitious WhatsApp product in an isolated test.",
  );
  await assert.rejects(review(form), /notice:.*approved/);
  const [approved] = await database
    .select()
    .from(schema.producerChangeRequests)
    .where(eq(schema.producerChangeRequests.id, change.id));
  assert.equal(approved.status, "approved");
  assert.deepEqual(approved.contentChange, change.contentChange);
  await assert.rejects(
    pg.query(
      "update producer_change_requests set content_change = null where id = $1",
      [change.id],
    ),
    /immutable/i,
  );
  const expected = resolveExpectedProducerChange(
    approved.baseSnapshot,
    approved.baseRowHash,
    approved.patch,
    approved.reviewedAt,
    true,
  );
  const root = await mkdtemp(
    path.join(tmpdir(), "chisan-whatsapp-publication-"),
  );
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const csvPath = "data/csv/es/catalunya/barcelona.csv";
  const contentPath = "data/content/es/12439.json";
  try {
    const content = await loadProducerContent("es", 12439);
    for (const relative of [
      csvPath,
      contentPath,
      ...content.gallery.map((item) => `public${item.src}`),
    ]) {
      await mkdir(path.dirname(path.join(root, relative)), { recursive: true });
      await cp(relative, path.join(root, relative));
    }
    git("init", "-q");
    git("config", "user.name", "Chisan test");
    git("config", "user.email", "test@chisan.invalid");
    git("add", "--", "data", "public");
    git("-c", "commit.gpgsign=false", "commit", "-qm", "Test baseline");
    const sourceHead = git("rev-parse", "HEAD");
    const prepared = await prepareContentPublication(
      approved.contentChange,
      "es",
      12439,
      null,
      root,
    );
    const patch = applyProducerPatchToCsv(
      await readFile(path.join(root, csvPath), "utf8"),
      12439,
      expected.patch,
    );
    const executionId = "00000000-0000-4000-8000-000000012439";
    await pg.exec(
      "create role whatsapp_test_operator login; grant chisan_producer_change_operator to whatsapp_test_operator; set session authorization whatsapp_test_operator",
    );
    const begin = (hash: string) =>
      pg.query(
        "select * from chisan_begin_producer_change_execution_v2($1::uuid,$2::uuid,repeat('b',64),$3,$4,$5,900,$6)",
        [executionId, change.id, csvPath, sourceHead, expected.hash, hash],
      );
    await assert.rejects(begin("e".repeat(64)), /hash mismatch/);
    await begin(prepared.hash);
    const release = await prepared.lock();
    try {
      await prepared.write();
      await writeFile(path.join(root, csvPath), patch.csv);
      await prepared.assertCurrent();
    } finally {
      await release();
    }
    await pg.query(
      "select chisan_complete_producer_change_execution_v2($1::uuid,$2,array['products'],false,$3)",
      [executionId, expected.hash, prepared.hash],
    );
    git("add", "--", csvPath, contentPath);
    git(
      "-c",
      "commit.gpgsign=false",
      "commit",
      "-qm",
      "Apply reviewed WhatsApp product",
    );
    const commit = git("rev-parse", "HEAD");
    const contentState = {
      relativePath: contentPath,
      hash: prepared.hash,
      baseRowHash: approved.baseRowHash,
    };
    assert.throws(
      () =>
        assertFinalizationGitState(
          commit,
          sourceHead,
          csvPath,
          12439,
          expected.hash,
          root,
          { ...contentState, hash: "e".repeat(64) },
        ),
      /exact approved product/,
    );
    assertFinalizationGitState(
      commit,
      sourceHead,
      csvPath,
      12439,
      expected.hash,
      root,
      contentState,
    );
    const finalize = (hash: string) =>
      pg.query(
        "select chisan_finalize_producer_change_execution_v2($1::uuid,$2,$3,$4,$5)",
        [change.id, commit, csvPath, expected.hash, hash],
      );
    await assert.rejects(finalize("e".repeat(64)), /hash mismatch/);
    await finalize(prepared.hash);
    await pg.exec("set session authorization postgres; reset role");
    const [applied] = await database
      .select()
      .from(schema.producerChangeRequests)
      .where(eq(schema.producerChangeRequests.id, change.id));
    assert.equal(applied.status, "applied");
    assert.equal(applied.appliedCommitSha, commit);
    assert.equal(
      JSON.parse(
        await readFile(path.join(root, contentPath), "utf8"),
      ).products.at(-1).price.amount,
      change.contentChange!.products.at(-1)!.price!.amount,
    );
    assert.equal(git("status", "--porcelain"), "");
  } finally {
    await pg.exec("set session authorization postgres; reset role");
    await rm(root, { recursive: true, force: true });
  }
}

test("Meta signature protects exact bytes and webhook scope ignores status/other business phones", () => {
  const bytes = Buffer.from('{"message":"cerveza"}');
  const signature = `sha256=${createHmac("sha256", "test").update(bytes).digest("hex")}`;
  assert.ok(verifyMetaSignature(bytes, signature, "test"));
  assert.equal(
    verifyMetaSignature(Buffer.from(bytes.toString() + " "), signature, "test"),
    false,
  );
  assert.equal(verifyMetaSignature(bytes, "sha256=x", "test"), false);
  assert.equal(verifyMetaSignature(bytes, signature, ""), false);
  const message = {
    id: "m1",
    from: "34611111111",
    timestamp: "1788850000",
    type: "text",
    text: { body: "Cerveza" },
  };
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: {
              metadata: { phone_number_id: "123" },
              messages: [message],
            },
          },
          {
            field: "messages",
            value: {
              metadata: { phone_number_id: "other" },
              messages: [{ ...message, id: "m2" }],
            },
          },
          {
            field: "messages",
            value: {
              metadata: { phone_number_id: "123" },
              statuses: [{ id: "m3" }],
            },
          },
        ],
      },
    ],
  };
  assert.deepEqual(parseWebhook(payload, "123"), [message]);
});

test("relative dates use the producer timezone, cross month/year/DST and never become product edit dates", () => {
  const input = {
    ...complete(),
    launch_text: "mañana",
    launch_on: "2099-01-01",
  };
  assert.equal(
    normalizeCandidate(input, new Date("2026-12-31T23:30:00Z"), "Europe/Madrid")
      .launch_on,
    "2027-01-02",
  );
  assert.equal(
    normalizeCandidate(
      input,
      new Date("2026-12-31T23:30:00Z"),
      "Atlantic/Canary",
    ).launch_on,
    "2027-01-01",
  );
  assert.equal(
    normalizeCandidate(input, new Date("2026-03-28T12:00:00Z"), "Europe/Madrid")
      .launch_on,
    "2026-03-29",
  );
  assert.throws(() =>
    normalizeCandidate(
      { ...input, launch_text: "31 febrero", launch_on: "2026-02-31" },
      new Date(),
      "Europe/Madrid",
    ),
  );
  const base = {
    version: 1 as const,
    country: "es",
    producer_id: 1,
    products: [],
    gallery: [],
    links: [],
    translations: [],
  };
  const [product] = appendCandidate(base, input, "wa-test");
  assert.equal(product.updated_on, undefined);
  assert.equal("launch_on" in product, false);
  assert.throws(
    () => appendCandidate({ ...base, products: [product] }, input, "wa-other"),
    /ya existe/,
  );
});

test("missing names and units ask natural questions without confirmation commands", () => {
  assert.match(
    candidateReply({ ...emptyCandidate(), price_amount: "8.00" }),
    /Cómo se llama/,
  );
  assert.match(
    candidateReply({ ...emptyCandidate(), price_amount: "8.00" }),
    /formato/,
  );
  assert.doesNotMatch(candidateReply(emptyCandidate()), /CONFIRMAR/);
  assert.doesNotMatch(
    candidateReply(complete()),
    /confirmar|siguiente|sí o no/i,
  );
  assert.notEqual(
    candidateHash(complete()),
    candidateHash({ ...complete(), price_amount: "9.00" }),
  );
});

test("Responses adapter sends strict schema and inline image without remote state and validates output", async () => {
  let seen: Record<string, unknown> = {};
  const fetcher: typeof fetch = async (_url, init) => {
    seen = JSON.parse(String(init?.body));
    return Response.json({
      status: "completed",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: JSON.stringify({
                action: "product",
                candidate: complete(),
              }),
            },
          ],
        },
      ],
    });
  };
  const result = await extractProduct(
    {
      text: "Nueva cerveza",
      previous: emptyCandidate(),
      at: new Date(),
      timeZone: "Europe/Madrid",
      image: Buffer.from("image"),
    },
    config,
    fetcher,
  );
  assert.equal(result.price_amount, "8.00");
  assert.equal(seen.store, false);
  assert.equal(seen.max_output_tokens, 4096);
  assert.equal("reasoning" in seen, false);
  assert.match(JSON.stringify(seen.input), /data:image\/jpeg;base64/);
  await extractProduct(
    {
      text: "Texto",
      previous: emptyCandidate(),
      at: new Date(),
      timeZone: "Europe/Madrid",
    },
    { ...config, reasoningEffort: "high", maxOutputTokens: 8192 },
    fetcher,
  );
  assert.deepEqual(seen.reasoning, { effort: "high" });
  assert.equal(seen.max_output_tokens, 8192);
  assert.equal("tools" in seen, false);
  assert.match(JSON.stringify(seen.text), /json_schema/);
  for (const body of [
    { status: "incomplete", output: [] },
    {
      status: "completed",
      output: [{ type: "message", content: [{ type: "refusal" }] }],
    },
    {
      status: "completed",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: JSON.stringify({
                action: "product",
                candidate: { ...complete(), producerId: 5 },
              }),
            },
          ],
        },
      ],
    },
  ])
    await assert.rejects(() =>
      extractProduct(
        {
          text: "test",
          previous: emptyCandidate(),
          at: new Date(),
          timeZone: "Europe/Madrid",
        },
        config,
        async () => Response.json(body),
      ),
    );
});

test("a follow-up after midnight preserves an already resolved launch day", async () => {
  const previous = {
    ...complete(),
    launch_text: "mañana",
    launch_on: "2026-09-09",
  };
  const fetcher: typeof fetch = async () =>
    Response.json({
      status: "completed",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: JSON.stringify({ action: "product", candidate: previous }),
            },
          ],
        },
      ],
    });
  const result = await extractProduct(
    {
      text: "El formato es botella de 75 cl. Mañana te enviaré otra foto.",
      previous,
      at: new Date("2026-09-09T10:00:00Z"),
      timeZone: "Europe/Madrid",
    },
    config,
    fetcher,
  );
  assert.equal(result.launch_on, "2026-09-09");
});

test("media rejects unsafe URLs, oversized bodies and mismatched checksums; normalizes real bytes", async () => {
  for (const url of [
    "http://lookaside.fbsbx.com/image",
    "https://127.0.0.1/",
    "https://lookaside.fbsbx.com.evil.test/",
    "https://user:secret@lookaside.fbsbx.com/x",
    "https://lookaside.fbsbx.com:444/x",
  ])
    assert.throws(() => safeMetaMediaUrl(url));
  await assert.rejects(() => boundedBytes(new Response("12345"), 4));
  const bytes = await sharp({
    create: { width: 250, height: 250, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  const requests: { url: string; redirect: RequestRedirect | undefined }[] = [];
  const fetcher: typeof fetch = async (url, init) => {
    requests.push({ url: String(url), redirect: init?.redirect });
    return String(url).startsWith("https://graph.facebook.com/")
      ? Response.json({
          url: "https://lookaside.fbsbx.com/whatsapp_business/attachments/x",
          file_size: bytes.length,
          mime_type: "image/png",
        })
      : new Response(new Uint8Array(bytes));
  };
  const normalized = await downloadImage(
    { id: "1", mime_type: "image/png" },
    config,
    fetcher,
  );
  assert.equal((await sharp(normalized).metadata()).format, "jpeg");
  assert.ok(requests.every((request) => request.redirect === "error"));
  await assert.rejects(() =>
    downloadImage(
      { id: "1", mime_type: "image/png", sha256: "wrong" },
      config,
      fetcher,
    ),
  );
});

test("reply adapter is a contextual text message and surfaces delivery failures", async () => {
  let body: Record<string, unknown> = {};
  await sendReply("34611111111", "Resumen", config, async (_url, init) => {
    body = JSON.parse(String(init?.body));
    return Response.json({ messages: [{ id: "response" }] });
  });
  assert.equal(body.to, "34611111111");
  assert.equal(body.type, "text");
  assert.equal("template" in body, false);
  await assert.rejects(() =>
    sendReply(
      "34611111111",
      "test",
      config,
      async () => new Response(null, { status: 503 }),
    ),
  );
});

test("disabled and unsigned endpoints fail closed without database or AI access", async () => {
  const before = { ...process.env };
  try {
    process.env.CHISAN_WHATSAPP_ENABLED = "false";
    delete process.env.WHATSAPP_VERIFY_TOKEN;
    assert.equal(whatsappEnabled(), false);
    assert.throws(() => whatsappConfig({}));
    assert.equal(
      (
        await POST(
          new Request("https://chisan.invalid/api/webhooks/whatsapp", {
            method: "POST",
            body: "{}",
          }),
        )
      ).status,
      503,
    );
    assert.equal(
      (await GET(new Request("https://chisan.invalid/api/webhooks/whatsapp")))
        .status,
      503,
    );
    delete process.env.CRON_SECRET;
    assert.equal(
      (
        await recover(
          new Request("https://chisan.invalid/api/whatsapp/process", {
            headers: { authorization: "Bearer undefined" },
          }),
        )
      ).status,
      401,
    );
  } finally {
    process.env = before;
  }
});

test("staged callback verification needs no accounts, database or AI and keeps intake disabled", async () => {
  const before = { ...process.env };
  try {
    process.env.CHISAN_WHATSAPP_ENABLED = "false";
    process.env.CHISAN_ACCOUNTS_ENABLED = "false";
    process.env.WHATSAPP_VERIFY_TOKEN = "staged-verify";
    delete process.env.DATABASE_URL;
    delete process.env.OPENAI_API_KEY;
    const request = (token: string) => new Request(
      `https://chisan.invalid/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=${token}&hub.challenge=12345`,
    );
    const response = await GET(request("staged-verify"));
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "12345");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal((await GET(request("wrong"))).status, 403);
    assert.equal((await POST(new Request("https://chisan.invalid/api/webhooks/whatsapp", {
      method: "POST", body: "{}",
    }))).status, 503);
  } finally {
    process.env = before;
  }
});

test("configured webhook verifies challenge and signed bytes without processing status events", async () => {
  const before = { ...process.env };
  try {
    Object.assign(process.env, {
      CHISAN_WHATSAPP_ENABLED: "true",
      CHISAN_ACCOUNTS_ENABLED: "true",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: `pk_test_${Buffer.from("fixture.clerk.accounts.dev$").toString("base64")}`,
      CLERK_SECRET_KEY: `sk_test_${"a".repeat(24)}`,
      DATABASE_URL: "postgres://unused.invalid/db",
      WHATSAPP_GRAPH_VERSION: config.version,
      WHATSAPP_PHONE_NUMBER_ID: config.phoneId,
      WHATSAPP_BUSINESS_NUMBER: config.number,
      WHATSAPP_APP_SECRET: config.appSecret,
      WHATSAPP_VERIFY_TOKEN: config.verifyToken,
      WHATSAPP_ACCESS_TOKEN: config.accessToken,
      OPENAI_API_KEY: config.apiKey,
      CHISAN_WHATSAPP_MODEL: config.model,
    });
    assert.equal(whatsappEnabled(), true);
    const challenge = await GET(
      new Request(
        "https://chisan.invalid/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=test-verify&hub.challenge=12345",
      ),
    );
    assert.equal(challenge.status, 200);
    assert.equal(await challenge.text(), "12345");
    assert.equal(
      (
        await GET(
          new Request(
            "https://chisan.invalid/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=12345",
          ),
        )
      ).status,
      403,
    );
    const body = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              field: "messages",
              value: {
                metadata: { phone_number_id: "123" },
                statuses: [{ status: "delivered" }],
              },
            },
          ],
        },
      ],
    });
    const signature = `sha256=${createHmac("sha256", config.appSecret).update(body).digest("hex")}`;
    assert.equal(
      (
        await POST(
          new Request("https://chisan.invalid/api/webhooks/whatsapp", {
            method: "POST",
            body,
            headers: { "x-hub-signature-256": signature },
          }),
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await POST(
          new Request("https://chisan.invalid/api/webhooks/whatsapp", {
            method: "POST",
            body: body + " ",
            headers: { "x-hub-signature-256": signature },
          }),
        )
      ).status,
      403,
    );
  } finally {
    process.env = before;
  }
});

test("isolated workflow: natural intake, automatic submission, corrections, cancellation, review, publication and recovery", async () => {
  const pg = new PGlite();
  const db = drizzle(pg, { schema });
  const database = db as unknown as Database;
  const oldFreeze = process.env.CHISAN_PRODUCER_CHANGES_ENABLED;
  process.env.CHISAN_PRODUCER_CHANGES_ENABLED = "true";
  try {
    for (const file of (await readdir("drizzle"))
      .filter((name) => /^\d{4}_.+\.sql$/.test(name))
      .sort())
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    const [owner, other] = await db
      .insert(schema.users)
      .values([
        { displayName: "WhatsApp test" },
        { displayName: "Other account" },
      ])
      .returning();
    const [membership] = await db
      .insert(schema.producerMemberships)
      .values({
        userId: owner.id,
        country: "es",
        producerId: 12439,
        role: "owner",
      })
      .returning();
    await db.insert(schema.entitlements).values({
      subjectKind: "producer",
      producerCountry: "es",
      producerId: 12439,
      key: "producer.profile.premium",
      source: "manual",
      sourceReference: "whatsapp-test",
      startsAt: new Date(Date.now() - 86_400_000),
    });
    await assert.rejects(() =>
      createLink(database, {
        userId: other.id,
        country: "es",
        producerId: 12439,
        timeZone: "Europe/Madrid",
      }),
    );
    const token = await createLink(database, {
      userId: owner.id,
      country: "es",
      producerId: 12439,
      timeZone: "Europe/Madrid",
    });
    let extractionCalls = 0;
    let imageCalls = 0;
    let nextCandidate = complete();
    let failExtraction = false;
    let nextAction = "product";
    const sent: string[] = [];
    const dependencies: AssistantDependencies = {
      extractor: {
        profile: {
          ...extractionProfile(config),
          provider: "local-test",
          reasoningEffort: "balanced",
        },
        extract: async (input) => {
          extractionCalls++;
          if (failExtraction) throw new Error("provider-secret-do-not-show");
          if (input.image)
            assert.equal(input.image.toString(), "normalized-image");
          return { action: nextAction, candidate: nextCandidate };
        },
      },
      image: async () => {
        imageCalls++;
        return Buffer.from("normalized-image");
      },
      send: async (_sender, reply) => {
        sent.push(reply);
      },
    };
    let sequence = 0;
    const sender = "34611111111";
    async function incoming(
      body: string,
      overrides: Partial<InboundMessage> = {},
    ) {
      const message: InboundMessage = {
        id: `test-${++sequence}`,
        from: sender,
        type: "text",
        timestamp: String(Math.floor(Date.now() / 1000)),
        text: { body },
        ...overrides,
      };
      await db
        .insert(schema.whatsappInbox)
        .values({ id: message.id, sender: message.from, message })
        .onConflictDoNothing();
      await processSender(database, message.from, dependencies);
      const [receipt] = await db
        .select()
        .from(schema.whatsappInbox)
        .where(eq(schema.whatsappInbox.id, message.id));
      return receipt;
    }
    assert.match(
      (await incoming("Una cerveza", { from: "34622222222" })).reply!,
      /Vincula primero/,
    );
    assert.equal(extractionCalls, 0);
    assert.match((await incoming(`VINCULAR ${token}`)).reply!, /vinculado/);
    assert.match(
      (await incoming(`VINCULAR ${token}`, { from: "34622222222" })).reply!,
      /no es válido/,
    );
    const [linked] = await db.select().from(schema.whatsappLinks);
    assert.equal(linked.tokenHash, null);
    nextCandidate = { ...emptyCandidate(), price_amount: "8.00" };
    assert.match(
      (await incoming("Tenemos nueva cerveza, 8 euros")).reply!,
      /Cómo se llama/,
    );
    assert.equal(
      (await db.select().from(schema.producerChangeRequests)).length,
      0,
    );
    nextCandidate = {
      ...complete(),
      launch_on: "2026-09-09",
      launch_text: "9 septiembre 2026",
    };
    const photo = await incoming("", {
      type: "image",
      text: undefined,
      image: { id: "123", mime_type: "image/jpeg" },
    });
    assert.equal(imageCalls, 1);
    assert.match(photo.reply!, /8,00/);
    assert.match(photo.reply!, /revisará/);
    assert.doesNotMatch(photo.reply!, /confirmar|siguiente|sí o no/i);
    let requests = await db.select().from(schema.producerChangeRequests);
    assert.equal(
      requests.length,
      1,
      "a complete photo auto-submits without another message",
    );
    const original = requests[0];
    assert.equal(original.status, "submitted");
    let audit = await db
      .select()
      .from(schema.auditEvents)
      .where(eq(schema.auditEvents.targetId, original.id));
    const intake = readProducerChangeIntake(audit);
    assert.ok(intake?.channel === "whatsapp" && intake.version === 2);
    assert.equal(intake.submittedMessageId, photo.id);
    assert.equal(intake.extractions.at(-1)?.inputKind, "image");
    assert.equal(intake.extractions.at(-1)?.provider, "local-test");
    assert.equal(intake.extractions.at(-1)?.reasoningEffort, "balanced");
    assert.equal(
      intake.extractions.at(-1)?.candidateHash,
      intake.candidateHash,
    );
    assert.equal(JSON.stringify(intake).includes(sender), false);
    const detail = await queryAdminProducerChangeById(database, original.id);
    assert.ok(detail);
    assert.deepEqual(
      serializeProducerChangeDetail(detail).request.intake,
      intake,
    );
    assert.equal(photo.message.image, undefined);
    await db
      .insert(schema.whatsappInbox)
      .values({ id: photo.id, sender, message: photo.message })
      .onConflictDoNothing();
    await processSender(database, sender, dependencies);
    assert.equal(
      (await db.select().from(schema.producerChangeRequests)).length,
      1,
    );
    const [stateBeforeError] = await db.select().from(schema.whatsappLinks);
    failExtraction = true;
    assert.match((await incoming("Otro dato")).reply!, /Conservo los datos/);
    assert.deepEqual(
      (await db.select().from(schema.whatsappLinks))[0].state,
      stateBeforeError.state,
    );
    failExtraction = false;
    // A different provider goes through the same validation boundary.
    nextCandidate = { ...nextCandidate, purchase_url: "javascript:alert(1)" };
    assert.match(
      (await incoming("Este es el enlace")).reply!,
      /Conservo los datos/,
    );
    assert.equal(
      (await db.select().from(schema.producerChangeRequests)).length,
      1,
    );
    nextCandidate = {
      ...stateBeforeError.state!.candidate,
      price_amount: "7.00",
    };
    await db
      .update(schema.whatsappLinks)
      .set({
        state: { ...stateBeforeError.state!, baseRowHash: "0".repeat(64) },
      })
      .where(eq(schema.whatsappLinks.id, linked.id));
    assert.match(
      (await incoming("Perdón, son 7 euros")).reply!,
      /ficha ha cambiado/,
    );
    assert.equal(
      (await db.select().from(schema.producerChangeRequests))[0].status,
      "submitted",
      "failed replacement cannot withdraw the original",
    );
    await db
      .update(schema.whatsappLinks)
      .set({ state: stateBeforeError.state })
      .where(eq(schema.whatsappLinks.id, linked.id));
    const correction = await incoming("Perdón, son 7 euros");
    assert.match(correction.reply!, /actualizado.*7,00/);
    requests = await db.select().from(schema.producerChangeRequests);
    assert.equal(requests.length, 2);
    assert.equal(
      requests.find((r) => r.id === original.id)!.status,
      "withdrawn",
    );
    let revised = requests.find((r) => r.status === "submitted")!;
    assert.equal(revised.contentChange!.products.at(-1)!.price!.amount, "7.00");
    assert.equal(
      original.contentChange!.products.at(-1)!.price!.amount,
      "8.00",
    );
    audit = await db
      .select()
      .from(schema.auditEvents)
      .where(eq(schema.auditEvents.targetId, revised.id));
    const revisedIntake = readProducerChangeIntake(audit);
    assert.ok(
      revisedIntake?.channel === "whatsapp" && revisedIntake.version === 2,
    );
    assert.equal(revisedIntake.replacesRequestId, original.id);
    nextAction = "status";
    assert.match(
      (await incoming("¿Cómo va lo que os pasé?")).reply!,
      /en revisión/,
    );
    nextAction = "product";
    // Ambiguous corrections retract the now-inaccurate pending version promptly.
    nextCandidate = { ...nextCandidate, format: null };
    assert.match(
      (await incoming("Ese formato no es correcto")).reply!,
      /formato/,
    );
    assert.equal(
      (await db.select().from(schema.producerChangeRequests)).filter(
        (r) => r.status === "submitted",
      ).length,
      0,
    );
    nextCandidate = { ...nextCandidate, format: "Botella de 75 cl" };
    assert.match(
      (await incoming("Son botellas de 75 cl")).reply!,
      /actualizado/,
    );
    requests = await db.select().from(schema.producerChangeRequests);
    revised = requests.find((r) => r.status === "submitted")!;
    let revisionCount = requests.length;
    assert.match((await incoming("Sí, botella de 75 cl")).reply!, /Ya tengo/);
    assert.equal(
      (await db.select().from(schema.producerChangeRequests)).length,
      revisionCount,
    );
    await publishReceivedProduct(database, pg, revised, other.id);
    const publishedState = (await incoming("ESTADO")).reply!;
    assert.match(publishedState, /comprobar que se vea/);
    assert.doesNotMatch(publishedState, /publicada/);
    nextCandidate = { ...nextCandidate, price_amount: "6.00" };
    assert.match(
      (await incoming("Ahora son 6 euros")).reply!,
      /ya ha avanzado/,
    );
    nextAction = "cancel";
    assert.match(
      (await incoming("Mejor descarta este producto")).reply!,
      /ya ha avanzado/,
    );
    nextAction = "product";
    nextCandidate = { ...complete(), name: "Queso del huerto" };
    nextAction = "new_product";
    assert.match(
      (
        await incoming(
          "También tenemos un queso nuevo, Queso del huerto, 8 euros la botella de 75 cl",
        )
      ).reply!,
      /preparado/,
    );
    revisionCount++;
    nextAction = "cancel";
    assert.match(
      (await incoming("Mejor descarta ese queso")).reply!,
      /descartado/,
    );
    assert.equal(
      (await db.select().from(schema.producerChangeRequests)).filter(
        (row) => row.status === "submitted",
      ).length,
      0,
    );
    assert.equal((await db.select().from(schema.whatsappLinks))[0].state, null);
    nextAction = "product";
    const confirmed = photo; // Durable receipt retained through disconnection below.
    process.env.CHISAN_PRODUCER_CHANGES_ENABLED = "false";
    const previousCalls = extractionCalls;
    assert.match((await incoming("Nuevo queso")).reply!, /pausados/);
    assert.equal(extractionCalls, previousCalls);
    process.env.CHISAN_PRODUCER_CHANGES_ENABLED = "true";
    await db
      .update(schema.users)
      .set({ status: "suspended" })
      .where(eq(schema.users.id, owner.id));
    assert.match(
      (await incoming("Perdón, son 6 euros")).reply!,
      /ya no tienes acceso/,
    );
    assert.equal((await db.select().from(schema.whatsappLinks)).length, 0);
    await db
      .update(schema.users)
      .set({ status: "active" })
      .where(eq(schema.users.id, owner.id));
    const nextToken = await createLink(database, {
      userId: owner.id,
      country: "es",
      producerId: 12439,
      timeZone: "Atlantic/Canary",
    });
    await incoming(`VINCULAR ${nextToken}`);
    await unlink(database, owner.id);
    assert.equal((await db.select().from(schema.whatsappLinks)).length, 0);
    const [retained] = await db
      .select()
      .from(schema.whatsappInbox)
      .where(eq(schema.whatsappInbox.id, confirmed.id));
    assert.ok(retained.processedAt);
    assert.equal(retained.reply, null);
    await db
      .insert(schema.whatsappInbox)
      .values({
        id: confirmed.id,
        sender,
        message: {
          ...confirmed.message,
          type: "text",
          text: { body: "Perdón, son 6 euros" },
        },
      })
      .onConflictDoNothing();
    assert.equal(await processSender(database, sender, dependencies), false);
    // Failed delivery is recoverable without running inference or submission again.
    let attempted = 0;
    await assert.rejects(() =>
      drainInbox(database, {
        ...dependencies,
        send: async () => {
          attempted++;
          throw new Error("offline");
        },
      }),
    );
    assert.equal(attempted, 1);
    await drainInbox(database, dependencies);
    assert.ok(sent.length > 0);
    assert.equal(
      (await db.select().from(schema.producerChangeRequests)).length,
      revisionCount,
    );
    const revokeToken = await createLink(database, {
      userId: owner.id,
      country: "es",
      producerId: 12439,
      timeZone: "Europe/Madrid",
    });
    await incoming(`VINCULAR ${revokeToken}`);
    await db
      .update(schema.entitlements)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(schema.entitlements.sourceReference, "whatsapp-test"));
    const callsBeforeRevocation = extractionCalls;
    assert.match(
      (await incoming("Nueva cerveza")).reply!,
      /ya no tienes acceso/,
    );
    assert.equal(extractionCalls, callsBeforeRevocation);
    await db
      .update(schema.entitlements)
      .set({ expiresAt: null })
      .where(eq(schema.entitlements.sourceReference, "whatsapp-test"));
    const memberToken = await createLink(database, {
      userId: owner.id,
      country: "es",
      producerId: 12439,
      timeZone: "Europe/Madrid",
    });
    await incoming(`VINCULAR ${memberToken}`);
    await db
      .update(schema.producerMemberships)
      .set({
        status: "revoked",
        revokedAt: new Date(),
        revokedByUserId: other.id,
      })
      .where(eq(schema.producerMemberships.id, membership.id));
    assert.match(
      (await incoming("Nueva cerveza")).reply!,
      /ya no tienes acceso/,
    );
    assert.equal(extractionCalls, callsBeforeRevocation);
  } finally {
    if (oldFreeze === undefined)
      delete process.env.CHISAN_PRODUCER_CHANGES_ENABLED;
    else process.env.CHISAN_PRODUCER_CHANGES_ENABLED = oldFreeze;
    await pg.close();
  }
});
