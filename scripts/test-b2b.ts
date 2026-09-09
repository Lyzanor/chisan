import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import type { Database } from "../lib/db";
import * as schema from "../lib/db/schema";
import { createBusinessService, BusinessError } from "../lib/b2b/service";
import { businessTermsSchema, emptyBusinessTerms } from "../lib/b2b/policy";
test("quantities require meaningful units and delivery radius requires an origin", () => {
  for (const terms of [
    { weeklyCapacity: 20 },
    { capacityUnit: "kg" },
    { minimumOrder: 0, orderUnit: "kg" },
    { deliveryRadiusKm: 30 },
    { deliveryDays: [1, 1] },
  ])
    assert.equal(
      businessTermsSchema.safeParse({ ...emptyBusinessTerms(), ...terms })
        .success,
      false,
    );
  assert.equal(
    businessTermsSchema.safeParse({
      ...emptyBusinessTerms(),
      weeklyCapacity: 20,
      capacityUnit: "kg",
      minimumOrder: 2,
      orderUnit: "caja 5 kg",
      deliveryRadiusKm: 30,
      deliveryOrigin: "Vic",
    }).success,
    true,
  );
});
test("professional enquiries isolate private templates, participants and dated offers", async () => {
  const pg = new PGlite();
  try {
    for (const file of (await readdir("drizzle"))
      .filter((f) => /^\d{4}_.+\.sql$/.test(f))
      .sort())
      await pg.exec(await readFile(`drizzle/${file}`, "utf8"));
    const db = drizzle(pg, { schema });
    const [buyer, owner, stranger, staff] = await db
      .insert(schema.users)
      .values(
        ["Buyer", "Owner", "Stranger", "Staff"].map((displayName) => ({
          displayName,
        })),
      )
      .returning();
    const started = new Date("2026-01-01");
    const [membership] = await db
      .insert(schema.producerMemberships)
      .values({
        userId: owner.id,
        country: "es",
        producerId: 1,
        role: "owner",
        grantedAt: started,
      })
      .returning();
    await db
      .insert(schema.staffGrants)
      .values({ userId: staff.id, role: "admin", grantedAt: started });
    const [premium] = await db
      .insert(schema.entitlements)
      .values({
        subjectKind: "producer",
        producerCountry: "es",
        producerId: 1,
        key: "producer.profile.premium",
        source: "admin_profile_upgrade_gift",
        startsAt: started,
      })
      .returning();
    let products = [{ id: "apple", name: "Manzanas", format: "caja 5 kg" }];
    let enabled = true;
    const service = createBusinessService({
      database: db as unknown as Database,
      enabled: () => enabled,
      catalog: async (key) =>
        key.country === "es" && key.producerId === 1
          ? { name: "Test", href: "/es/test", acceptsEnquiries: true, products }
          : null,
    });
    const profile = {
      businessName: "Restaurante de prueba",
      activity: "restaurante",
      enabled: true,
    };
    const request = () => ({
      id: randomUUID(),
      country: "es",
      producerId: 1,
      products: [{ productId: "apple", quantity: 4, unit: "caja 5 kg" }],
      frequency: "Semanal",
      deliveryLocation: "Vic",
      message: "Consulta de suministro",
    });
    await assert.rejects(service.create(buyer.id, request()), BusinessError);
    await service.saveProfile(buyer.id, profile);
    const terms = {
      ...emptyBusinessTerms(),
      weeklyCapacity: 100,
      capacityUnit: "kg",
      minimumOrder: 2,
      orderUnit: "caja 5 kg",
      deliveryDays: [2, 5],
      deliveryRadiusKm: 30,
      deliveryOrigin: "Vic",
    };
    const key = { country: "es", producerId: 1, productId: "apple" };
    await service.saveTerms(owner.id, { ...key, version: 0, terms });
    await assert.rejects(
      service.saveTerms(owner.id, { ...key, version: 0, terms }),
      /han cambiado/,
    );
    for (const user of [buyer, stranger, staff])
      await assert.rejects(
        service.supplier(user.id, { country: "es", producerId: 1 }),
        BusinessError,
      );
    const input = request();
    const id = await service.create(buyer.id, input);
    assert.equal(await service.create(buyer.id, input), id);
    const first = await service.read(buyer.id, id);
    assert.equal(first.messages.length, 0);
    assert.ok(
      !JSON.stringify(first).includes("weeklyCapacity"),
      "saving private templates does not share them",
    );
    assert.equal((await service.inbox(owner.id)).items.length, 1);
    assert.equal((await service.inbox(stranger.id)).items.length, 0);
    for (const user of [stranger, staff]) {
      await assert.rejects(service.read(user.id, id), BusinessError);
      await assert.rejects(
        service.reply(user.id, {
          id: randomUUID(),
          enquiryId: id,
          body: "intrusion",
        }),
        BusinessError,
      );
      await assert.rejects(service.close(user.id, id), BusinessError);
    }
    await assert.rejects(
      service.reply(buyer.id, {
        id: randomUUID(),
        enquiryId: id,
        body: "fake offer",
        offer: { productId: "apple", terms },
      }),
      BusinessError,
    );
    const reply = {
      id: randomUUID(),
      enquiryId: id,
      body: "Estas son nuestras condiciones",
      offer: { productId: "apple", terms },
    };
    await service.reply(owner.id, reply);
    await service.reply(owner.id, reply);
    await service.saveTerms(owner.id, {
      ...key,
      version: 1,
      terms: { ...terms, weeklyCapacity: 200 },
    });
    await service.saveProfile(buyer.id, {
      ...profile,
      businessName: "Otro nombre",
    });
    const shared = await service.read(buyer.id, id);
    assert.equal(shared.messages.length, 1);
    assert.equal(shared.messages[0].offer?.terms.weeklyCapacity, 100);
    assert.equal(shared.enquiry.business.businessName, profile.businessName);
    products = [];
    await assert.rejects(
      service.create(buyer.id, request()),
      /ya no está publicado/,
    );
    await assert.rejects(
      service.reply(owner.id, { ...reply, id: randomUUID() }),
      /ya no está publicado/,
    );
    await service.reply(owner.id, {
      id: randomUUID(),
      enquiryId: id,
      body: "El producto ya no está disponible",
    });
    products = [{ id: "apple", name: "Nombre cambiado", format: "kg" }];
    assert.equal(
      (await service.read(buyer.id, id)).enquiry.products[0].name,
      "Manzanas",
    );
    await service.saveProfile(owner.id, profile);
    await assert.rejects(service.create(owner.id, request()), /propio equipo/);
    await service.saveProfile(buyer.id, { ...profile, enabled: false });
    assert.equal((await service.read(buyer.id, id)).canReply, false);
    await assert.rejects(service.create(buyer.id, request()), /Activa/);
    await service.saveProfile(buyer.id, profile);
    for (let i = 0; i < 9; i++) await service.create(buyer.id, request());
    await assert.rejects(service.create(buyer.id, request()), /límite/);
    assert.equal((await service.inbox(buyer.id)).items.length, 10);
    await db
      .update(schema.entitlements)
      .set({ expiresAt: new Date("2026-01-02") })
      .where(eq(schema.entitlements.id, premium.id));
    assert.equal((await service.read(owner.id, id)).canReply, false);
    await assert.rejects(
      service.reply(owner.id, {
        id: randomUUID(),
        enquiryId: id,
        body: "Expired",
      }),
      BusinessError,
    );
    await assert.rejects(service.create(buyer.id, request()), BusinessError);
    await db
      .update(schema.producerMemberships)
      .set({
        status: "revoked",
        revokedAt: new Date(),
        revokedByUserId: staff.id,
        revocationReason: "test",
      })
      .where(eq(schema.producerMemberships.id, membership.id));
    await assert.rejects(service.read(owner.id, id), BusinessError);
    assert.equal((await service.inbox(owner.id)).items.length, 0);
    await service.close(buyer.id, id);
    await assert.rejects(
      service.reply(buyer.id, {
        id: randomUUID(),
        enquiryId: id,
        body: "Closed",
      }),
      /cerrada/,
    );
    await db
      .update(schema.users)
      .set({ status: "suspended" })
      .where(eq(schema.users.id, buyer.id));
    await assert.rejects(service.read(buyer.id, id), BusinessError);
    enabled = false;
    await assert.rejects(service.profile(stranger.id), /no está disponible/);
  } finally {
    await pg.close();
  }
});
