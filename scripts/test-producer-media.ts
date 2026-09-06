import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import { stringify } from "csv-stringify/sync";
import * as schema from "../lib/db/schema";
import { prepareProducerImage } from "../lib/accounts/prepare-producer-image";
import {
  createProducerMediaPreviewHandler,
  createProducerMediaUploadHandler,
} from "../lib/accounts/producer-media-http";
import {
  uploadProducerMedia,
  assertProducerMediaReferences,
} from "../lib/accounts/producer-media";
import { preparedMediaSrc } from "../lib/accounts/producer-media-policy";
import {
  proposeProducerMedia,
  resolveProducerContentChange,
  hashProducerContent,
} from "../lib/accounts/producer-content-change";
import {
  emptyProducerContent,
  standaloneProducerGallery,
} from "../lib/catalog/content-schema";
import {
  hashProducerFields,
  PRODUCER_EDITABLE_FIELDS,
} from "../lib/accounts/producer-fields";
import { prepareContentPublication } from "../lib/editorial/producer-content-publication";
import { assertFinalizationGitState } from "../lib/editorial/git-state";
import { loadProducerContent } from "../lib/catalog/content";
import { findProducerById } from "../lib/csv-catalog";
import {
  createProducerChangeSubmissionService,
  type ProducerChangeFormState,
} from "../lib/accounts/producer-change-submission";

const png = (background = "#946b42") =>
  sharp({ create: { width: 800, height: 600, channels: 3, background } })
    .png()
    .toBuffer();
const metadataFor = (
  image: { sha256: string; width: number; height: number },
  id = "photo",
) => ({
  id,
  src: preparedMediaSrc("es", 12439, image.sha256),
  width: image.width,
  height: image.height,
  alt: "Imagen de prueba",
  caption: "Prueba aislada",
  locale: "es" as const,
  credit: "Pruebas Chisan",
});

test("image preparation decodes pixels, strips metadata, bounds sizes and rejects unsupported files", async () => {
  const source = await sharp(await png())
    .withExif({ IFD0: { Artist: "Private author" } })
    .withMetadata({ orientation: 6 })
    .png()
    .toBuffer();
  const prepared = await prepareProducerImage(source);
  const metadata = await sharp(prepared.bytes).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 600);
  assert.equal(metadata.height, 800);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.xmp, undefined);
  assert.equal(metadata.icc, undefined);
  assert.ok(prepared.bytes.length < 524288);
  for (const file of [
    Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
    Buffer.from("not a photo"),
    Buffer.alloc(3 * 1024 * 1024 + 1),
  ])
    await assert.rejects(prepareProducerImage(file));
  await assert.rejects(
    prepareProducerImage(
      await sharp({
        create: { width: 100, height: 100, channels: 3, background: "red" },
      })
        .png()
        .toBuffer(),
    ),
  );
  await assert.rejects(prepareProducerImage((await png()).subarray(0, 50)));
  assert.equal((await prepareProducerImage(source)).sha256, prepared.sha256);
});

test("media drafts require exact premium access, preserve images on validation errors and freeze submitted attachments", async () => {
  const pg = new PGlite();
  const db = drizzle(pg, { schema });
  const database = db as unknown as import("../lib/db").Database;
  const previous = process.env.CHISAN_PRODUCER_CHANGES_ENABLED;
  process.env.CHISAN_PRODUCER_CHANGES_ENABLED = "true";
  try {
    for (const file of (await readdir("drizzle"))
      .filter((f) => /^\d{4}_.+\.sql$/.test(f))
      .sort())
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    const [owner, other] = await db
      .insert(schema.users)
      .values([{ displayName: "Media owner" }, { displayName: "Other owner" }])
      .returning();
    const identity = { userId: owner.id, country: "es", producerId: 12439 };
    await db
      .insert(schema.producerMemberships)
      .values({ ...identity, role: "owner" });
    await assert.rejects(
      uploadProducerMedia(database, identity, await png()),
      /access/,
    );
    await db
      .insert(schema.entitlements)
      .values({
        subjectKind: "producer",
        producerCountry: "es",
        producerId: 12440,
        key: "producer.profile.premium",
        status: "active",
        source: "test",
      });
    await assert.rejects(
      uploadProducerMedia(database, identity, await png()),
      /access/,
    );
    const [entitlement] = await db
      .insert(schema.entitlements)
      .values({
        subjectKind: "producer",
        producerCountry: "es",
        producerId: 12439,
        key: "producer.profile.premium",
        status: "active",
        source: "test",
      })
      .returning();
    const upload = await uploadProducerMedia(database, identity, await png());
    assert.deepEqual(
      await uploadProducerMedia(database, identity, await png()),
      upload,
      "same image reuses the immutable upload",
    );
    let actor: string | null = owner.id;
    let staff = false;
    const http = {
      getDatabase: () => database,
      getCurrentAccount: async () => (actor ? { id: actor } : null),
      hasProducerAccess: async (id: string) => id === owner.id,
      hasStaffAccess: async () => staff,
      hasActiveProducerPremiumEntitlement: async () => true,
      isProducerChangeSubmissionEnabled: () => true,
      findProducerById: async () => ({}),
    };
    const preview = createProducerMediaPreviewHandler(http);
    const getImage = () =>
      preview(
        new Request(
          `https://chisan.test/api/producer-media/${upload.uploadId}`,
        ),
        { params: Promise.resolve({ uploadId: upload.uploadId }) },
      );
    assert.equal((await getImage()).status, 200);
    assert.equal(
      (await getImage()).headers.get("cache-control"),
      "private, no-store",
    );
    actor = null;
    assert.equal((await getImage()).status, 404);
    actor = other.id;
    assert.equal((await getImage()).status, 404);
    staff = true;
    assert.equal(
      (await getImage()).status,
      404,
      "staff cannot preview unsubmitted private uploads",
    );
    actor = owner.id;
    staff = false;
    const post = createProducerMediaUploadHandler(http);
    assert.equal(
      (
        await post(
          new Request(
            "https://chisan.test/api/producer-media?country=es&producerId=12439",
            {
              method: "POST",
              headers: {
                origin: "https://attacker.invalid",
                "x-chisan-media-rights": "confirmed",
              },
              body: new Uint8Array(await png()),
            },
          ),
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await post(
          new Request(
            "https://chisan.test/api/producer-media?country=es&producerId=12439",
            {
              method: "POST",
              headers: { origin: "https://chisan.test" },
              body: new Uint8Array(await png()),
            },
          ),
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await preview(new Request("https://chisan.test"), {
          params: Promise.resolve({ uploadId: "-".repeat(36) }),
        })
      ).status,
      404,
    );
    actor = owner.id;
    const proxied = await post(
      new Request(
        "http://localhost:3118/api/producer-media?country=es&producerId=12439",
        {
          method: "POST",
          headers: {
            host: "127.0.0.1:3118",
            origin: "http://127.0.0.1:3118",
            "x-forwarded-proto": "http",
            "x-chisan-media-rights": "confirmed",
          },
          body: new Uint8Array(await png()),
        },
      ),
    );
    assert.equal(
      proxied.status,
      201,
      "Next's normalized URL must not reject a same-host upload",
    );
    assert.equal(
      (
        await post(
          new Request(
            "http://localhost:3118/api/producer-media?country=es&producerId=12439",
            {
              method: "POST",
              headers: {
                host: "127.0.0.1:3118",
                origin: "https://attacker.invalid",
                "x-forwarded-host": "attacker.invalid",
                "x-chisan-media-rights": "confirmed",
              },
              body: new Uint8Array(await png()),
            },
          ),
        )
      ).status,
      403,
    );
    const base = await loadProducerContent("es", 12439);
    const media = metadataFor(upload);
    const gallery = [...base.gallery, media];
    const products = base.products.map((p, index) =>
      index === 0 ? { ...p, media_ids: [...p.media_ids, media.id] } : p,
    );
    const change = proposeProducerMedia(base, products, gallery, [upload])!;
    assert.equal(change.version, 2);
    await assertProducerMediaReferences(database, identity, change);
    await assert.rejects(
      assertProducerMediaReferences(
        database,
        { ...identity, userId: other.id },
        change,
      ),
      /missing/,
    );
    await assert.rejects(
      pg.query("update producer_media_uploads set width = 900 where id = $1", [
        upload.uploadId,
      ]),
      /immutable/,
    );
    const producer = (await findProducerById("es", 12439))!;
    const empty: ProducerChangeFormState = {
      fieldErrors: {},
      formError: null,
      reloadRequired: false,
      revision: 0,
      values: {},
    };
    function form(state = empty, submit = false) {
      const data = new FormData();
      for (const field of PRODUCER_EDITABLE_FIELDS) {
        const value = producer.fields[field.key] ?? "";
        if (field.kind === "categories" || field.kind === "sales-channels")
          value
            .split("|")
            .filter(Boolean)
            .forEach((v) => data.append(field.key, v));
        else data.set(field.key, value);
      }
      Object.entries({
        country: "es",
        producerId: "12439",
        baseRowHash: hashProducerFields(producer.fields),
        baseContentHash: hashProducerContent(base),
        products: JSON.stringify(products),
        gallery: JSON.stringify(gallery),
        uploads: JSON.stringify([upload]),
        intent: submit ? "submit" : "draft",
        draftId: state.draftId ?? "",
        draftVersion: String(state.draftVersion ?? ""),
        authorNote: submit
          ? "Imágenes propias de demostración; autorizo su publicación en las pruebas."
          : "",
      }).forEach(([k, v]) => data.set(k, v));
      return data;
    }
    const save = createProducerChangeSubmissionService({
      getDatabase: () => database,
      requireCurrentAccount: async () => ({ id: owner.id }),
      hasProducerAccess: async () => true,
      hasActiveProducerPremiumEntitlement: async () => true,
      revalidatePath() {},
      redirectWithMessage: (location): never => {
        throw new Error(`REDIRECT:${location}`);
      },
    });
    const invalid = form();
    invalid.set(
      "gallery",
      JSON.stringify([...base.gallery, { ...media, alt: "" }]),
    );
    const errors = await save(empty, invalid);
    assert.ok(errors.formError);
    assert.equal(
      JSON.parse(errors.values.uploads)[0].uploadId,
      upload.uploadId,
    );
    const draft = await save(empty, form());
    assert.ok(draft.draftId, draft.formError ?? "draft missing");
    const [stored] = await db
      .select()
      .from(schema.producerChangeRequests)
      .where(eq(schema.producerChangeRequests.id, draft.draftId!));
    assert.deepEqual(
      resolveProducerContentChange(stored.contentChange, "es", 12439).requested
        .gallery,
      gallery,
    );
    await assert.rejects(
      pg.query("delete from producer_media_uploads where id = $1", [
        upload.uploadId,
      ]),
      /retained proposal/,
    );
    const stale = await save(draft, form(empty));
    assert.ok(
      stale.formError,
      "an existing draft cannot be overwritten as a new proposal",
    );
    await assert.rejects(save(draft, form(draft, true)), /REDIRECT/);
    actor = other.id;
    staff = true;
    assert.equal(
      (await getImage()).status,
      200,
      "reviewer can inspect the submitted bytes",
    );
    staff = false;
    assert.equal((await getImage()).status, 404);
    await assert.rejects(
      db
        .update(schema.producerChangeRequests)
        .set({
          contentChange: proposeProducerMedia(base, base.products, gallery, [
            upload,
          ]),
        })
        .where(eq(schema.producerChangeRequests.id, draft.draftId!)),
      /immutable|Failed query/,
    );
    await db
      .update(schema.entitlements)
      .set({ revokedAt: new Date(), status: "revoked" })
      .where(eq(schema.entitlements.id, entitlement.id));
    await assert.rejects(
      uploadProducerMedia(database, identity, await png("red")),
      /access/,
    );
  } finally {
    if (previous === undefined)
      delete process.env.CHISAN_PRODUCER_CHANGES_ENABLED;
    else process.env.CHISAN_PRODUCER_CHANGES_ENABLED = previous;
    await pg.close();
  }
});

test("publication binds JSON and exact image bytes to Git and restores only its own files", async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "chisan-media-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  await mkdir(path.join(root, "public"));
  await mkdir(path.join(root, "data/csv/es/catalunya"), { recursive: true });
  const csvPath = "data/csv/es/catalunya/barcelona.csv";
  const fields = {
    producer_id: "12439",
    country: "es",
    region: "catalunya",
    area: "barcelona",
    slug: "chisan",
    nombre: "Chisan",
    municipio: "Barcelona",
    categoria: "Otros",
    "Venta online": "no comprobado",
    "fecha ultimo cambio": "2026-09-06",
  };
  await writeFile(
    path.join(root, csvPath),
    stringify([fields], { header: true }),
  );
  git("init", "-q");
  git("config", "user.email", "test@example.org");
  git("config", "user.name", "Test");
  git("add", "data");
  git("commit", "-qm", "base");
  const source = git("rev-parse", "HEAD");
  const prepared = await prepareProducerImage(await png());
  const upload = {
    uploadId: randomUUID(),
    sha256: prepared.sha256,
    width: prepared.width,
    height: prepared.height,
  };
  const base = emptyProducerContent("es", 12439);
  const image = metadataFor(upload);
  const change = proposeProducerMedia(base, [], [image], [upload])!;
  assert.throws(() =>
    proposeProducerMedia(
      base,
      [],
      [{ ...image, src: "/productores/es/content/12439/forged.webp" }],
      [upload],
    ),
  );
  assert.throws(() =>
    proposeProducerMedia(base, [], [{ ...image, width: 700 }], [upload]),
  );
  assert.throws(() =>
    resolveProducerContentChange({ ...change, uploads: [] }, "es", 12439),
  );
  const publication = await prepareContentPublication(
    change,
    "es",
    12439,
    null,
    root,
    async () => prepared.bytes,
  );
  let release = await publication.lock();
  await publication.write();
  await publication.assertCurrent();
  await publication.restore();
  await release();
  await assert.rejects(
    readFile(path.join(root, publication.assets[0].relativePath)),
    /ENOENT/,
  );
  const second = await prepareContentPublication(
    change,
    "es",
    12439,
    null,
    root,
    async () => prepared.bytes,
  );
  release = await second.lock();
  await second.write();
  await second.assertCurrent();
  await release();
  git("add", second.relativePath);
  git("commit", "-qm", "json without image");
  const contract = {
    relativePath: second.relativePath,
    hash: change.requestedHash,
    baseRowHash: hashProducerFields(fields),
    assets: second.assets,
  };
  assert.throws(
    () =>
      assertFinalizationGitState(
        git("rev-parse", "HEAD"),
        source,
        csvPath,
        12439,
        hashProducerFields(fields),
        root,
        contract,
      ),
    /tracked|changes|image|pathspec/,
  );
  git("add", second.assets[0].relativePath);
  git("commit", "--amend", "--no-edit", "-q");
  const commit = git("rev-parse", "HEAD");
  assert.equal(
    assertFinalizationGitState(
      commit,
      source,
      csvPath,
      12439,
      hashProducerFields(fields),
      root,
      contract,
    ).commit,
    commit,
  );
  await writeFile(
    path.join(root, second.assets[0].relativePath),
    (await prepareProducerImage(await png("blue"))).bytes,
  );
  git("add", second.assets[0].relativePath);
  git("commit", "-qm", "replace image bytes");
  assert.throws(
    () =>
      assertFinalizationGitState(
        commit,
        source,
        csvPath,
        12439,
        hashProducerFields(fields),
        root,
        contract,
      ),
    /exact reviewed image/,
  );
  const shown = resolveProducerContentChange(change, "es", 12439).requested;
  shown.products = [
    {
      id: "demo",
      name: "Demo",
      description: "",
      locale: "es",
      media_ids: [image.id],
      link_ids: [],
    },
  ];
  assert.equal(standaloneProducerGallery(shown).length, 0);
});
