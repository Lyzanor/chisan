import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import type { Database } from "../lib/db";
import * as schema from "../lib/db/schema";
import {
  getUserPresentation,
  replaceUserAvatar,
  seedProviderAvatar,
  updateFavoritesAttribution,
} from "../lib/accounts/user-presentation";
import { listProducerFavoriteSupporters } from "../lib/accounts/producer-favorites";
import {
  createAvatarMutationHandler,
  createAvatarReadHandler,
} from "../lib/accounts/avatar-http";
import {
  AVATAR_INPUT_BYTES,
  prepareAvatarImage,
  readAvatarBody,
  trustedProviderAvatarUrl,
} from "../lib/accounts/avatar-image";

const { users, favorites, userPresentation } = schema;

test("avatar decoding strips metadata, rejects active/oversized images and bounds provider URLs", async () => {
  const input = await sharp({
    create: { width: 300, height: 200, channels: 3, background: "red" },
  })
    .withMetadata()
    .jpeg()
    .toBuffer();
  const output = await prepareAvatarImage(input);
  const meta = await sharp(output).metadata();
  assert.equal(meta.width, 256);
  assert.equal(meta.height, 256);
  assert.equal(meta.format, "webp");
  assert.equal(meta.exif, undefined);
  assert.equal(meta.icc, undefined);
  await assert.rejects(
    prepareAvatarImage(Buffer.from('<svg onload="alert(1)"></svg>')),
  );
  await assert.rejects(prepareAvatarImage(Buffer.from([0xff, 0xd8, 0xff])));
  await assert.rejects(
    prepareAvatarImage(Buffer.alloc(AVATAR_INPUT_BYTES + 1)),
  );
  await assert.rejects(
    readAvatarBody(
      new ReadableStream({
        start(c) {
          c.enqueue(new Uint8Array(AVATAR_INPUT_BYTES + 1));
          c.close();
        },
      }),
    ),
  );
  for (const value of [
    "http://img.clerk.com/photo",
    "https://img.clerk.com.evil.test/photo",
    "https://localhost/photo",
    "https://127.0.0.1/photo",
    "https://img.clerk.com:8080/a",
    "https://user@img.clerk.com/a",
    "data:image/png,foo",
  ])
    assert.equal(trustedProviderAvatarUrl(value), null);
  assert.ok(trustedProviderAvatarUrl("https://img.clerk.com/photo"));
  assert.ok(
    trustedProviderAvatarUrl("https://lh3.googleusercontent.com/photo"),
  );
});

test("favorites attribution and avatar endpoints preserve opt-in, isolation, revocation and pagination", async () => {
  const client = new PGlite();
  try {
    for (const file of (await readdir("drizzle"))
      .filter((file) => /^\d{4}_.+\.sql$/.test(file))
      .sort())
      await client.exec(await readFile(`drizzle/${file}`, "utf8"));
    const db = drizzle(client, { schema }) as unknown as Database;
    const makeUser = async (
      name: string,
      visibility: "private" | "unlisted" | "public" = "private",
    ) => {
      const [user] = await db
        .insert(users)
        .values({
          displayName: name,
          publicProfileVisibility: visibility,
          ...(visibility === "private"
            ? {}
            : {
                publicHandle: name.toLowerCase(),
                publicProfileBaseCountry: "es",
                publicProfileBaseArea: "barcelona",
                publicProfileBaseMunicipality: "Barcelona",
              }),
        })
        .returning();
      return user;
    };
    const owner = await makeUser("Owner");
    const publicUser = await makeUser("Public", "public");
    const unlisted = await makeUser("Unlisted", "unlisted");
    const hidden = await makeUser("Hidden");
    for (const user of [owner, publicUser, unlisted, hidden])
      await db
        .insert(favorites)
        .values({ userId: user.id, country: "es", producerId: 42 });
    assert.deepEqual(await getUserPresentation(db, owner.id), {
      avatarUrl: null,
      favoritesAttributionEnabled: false,
    });
    assert.equal(
      (
        await listProducerFavoriteSupporters(db, {
          country: "es",
          producerId: 42,
        })
      ).total,
      0,
    );
    for (const user of [owner, publicUser, unlisted])
      await updateFavoritesAttribution(db, user.id, true);
    const listed = await listProducerFavoriteSupporters(db, {
      country: "es",
      producerId: 42,
    });
    assert.equal(listed.total, 3);
    assert.equal(
      listed.items.find((row) => row.name === "Public")?.profileHref,
      "/u/public",
    );
    assert.equal(
      listed.items.find((row) => row.name === "Unlisted")?.profileHref,
      null,
    );
    assert.equal(
      listed.items.find((row) => row.name === "Owner")?.profileHref,
      null,
    );
    assert.ok(!JSON.stringify(listed).includes(owner.id));
    assert.equal(
      (
        await listProducerFavoriteSupporters(db, {
          country: "ar",
          producerId: 42,
        })
      ).total,
      0,
    );
    assert.equal(
      (
        await listProducerFavoriteSupporters(db, {
          country: "es",
          producerId: 43,
        })
      ).total,
      0,
    );

    const input = await sharp({
      create: { width: 100, height: 100, channels: 3, background: "blue" },
    })
      .png()
      .toBuffer();
    const { avatarUrl } = await replaceUserAvatar(db, owner.id, input);
    assert.ok(avatarUrl);
    const avatarId = avatarUrl!.split("/").at(-1)!;
    let viewer: { id: string } | null = null;
    const deps = {
      getDatabase: () => db,
      getCurrentAccount: async () => viewer,
    };
    const read = createAvatarReadHandler(deps);
    const image = () =>
      read(new Request(`http://localhost${avatarUrl}`), {
        params: Promise.resolve({ avatarId }),
      });
    assert.equal((await image()).status, 200);
    assert.match((await image()).headers.get("cache-control")!, /no-store/);
    await updateFavoritesAttribution(db, owner.id, false);
    assert.equal((await image()).status, 404);
    viewer = { id: hidden.id };
    assert.equal((await image()).status, 404);
    viewer = { id: owner.id };
    assert.equal((await image()).status, 200);
    const mutate = createAvatarMutationHandler(deps);
    const req = (origin: string) =>
      new Request("http://localhost/api/account/avatar", {
        method: "POST",
        headers: { origin, "x-chisan-avatar": "1" },
        body: new Uint8Array(input),
      });
    assert.equal((await mutate(req("http://evil.test"))).status, 403);
    viewer = null;
    assert.equal((await mutate(req("http://localhost"))).status, 401);
    viewer = { id: owner.id };
    assert.equal((await mutate(req("http://localhost"))).status, 200);
    assert.equal(
      (await image()).status,
      404,
      "replacement invalidates old image URL",
    );
    await replaceUserAvatar(db, owner.id, null);
    assert.equal((await getUserPresentation(db, owner.id)).avatarUrl, null);
    let fetched = false;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      fetched = true;
      throw new Error("must not fetch");
    };
    try {
      await seedProviderAvatar(db, owner.id, "https://img.clerk.com/photo");
    } finally {
      globalThis.fetch = originalFetch;
    }
    assert.equal(
      fetched,
      false,
      "provider cannot restore an explicitly removed avatar",
    );
    const [profile] = await db
      .select()
      .from(userPresentation)
      .where(eq(userPresentation.userId, owner.id));
    assert.equal(profile.avatarInitialized, true);
    assert.equal(profile.favoritesAttributionEnabled, false);

    let imports = 0;
    globalThis.fetch = async (_url, options) => {
      imports++;
      assert.equal(options?.redirect, "error");
      assert.equal(options?.cache, "no-store");
      return new Response(new Uint8Array(input));
    };
    try {
      await seedProviderAvatar(db, hidden.id, "https://img.clerk.com/initial");
      const seeded = await getUserPresentation(db, hidden.id);
      assert.ok(seeded.avatarUrl);
      assert.equal(seeded.favoritesAttributionEnabled, false);
      await seedProviderAvatar(db, hidden.id, "https://img.clerk.com/later");
      assert.equal(
        (await getUserPresentation(db, hidden.id)).avatarUrl,
        seeded.avatarUrl,
      );
      assert.equal(
        imports,
        1,
        "a provider update does not overwrite the local image",
      );
      await replaceUserAvatar(db, hidden.id, input);
      await seedProviderAvatar(db, hidden.id, "https://img.clerk.com/later");
      assert.equal(
        imports,
        1,
        "an uploaded photo also blocks provider imports",
      );
    } finally {
      globalThis.fetch = originalFetch;
    }

    const disabledRead = createAvatarReadHandler({
      ...deps,
      isEnabled: () => false,
    });
    assert.equal(
      (
        await disabledRead(new Request("http://localhost"), {
          params: Promise.resolve({ avatarId }),
        })
      ).status,
      404,
    );

    for (let i = 0; i < 28; i++) {
      const user = await makeUser(`Person ${i}`);
      await updateFavoritesAttribution(db, user.id, true);
      await db
        .insert(favorites)
        .values({ userId: user.id, country: "es", producerId: 42 });
    }
    const first = await listProducerFavoriteSupporters(db, {
      country: "es",
      producerId: 42,
    });
    const second = await listProducerFavoriteSupporters(
      db,
      { country: "es", producerId: 42 },
      first.nextOffset!,
    );
    assert.equal(first.total, 30);
    assert.equal(first.items.length, 24);
    assert.equal(second.items.length, 6);
    assert.equal(second.nextOffset, null);
    assert.equal(
      new Set([...first.items, ...second.items].map((row) => row.name)).size,
      30,
    );
    await db
      .update(users)
      .set({ status: "suspended" })
      .where(eq(users.id, publicUser.id));
    assert.equal(
      (
        await listProducerFavoriteSupporters(db, {
          country: "es",
          producerId: 42,
        })
      ).total,
      29,
    );
    await assert.rejects(updateFavoritesAttribution(db, publicUser.id, true));
    await assert.rejects(replaceUserAvatar(db, publicUser.id, input));
    await db.delete(favorites).where(eq(favorites.userId, unlisted.id));
    assert.equal(
      (
        await listProducerFavoriteSupporters(db, {
          country: "es",
          producerId: 42,
        })
      ).total,
      28,
    );
  } finally {
    await client.close();
  }
});
