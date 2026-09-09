import "server-only";
import { z } from "zod";
import {
  and,
  eq,
  isNull,
  lte,
  gte,
  or,
  desc,
  asc,
  sql,
  count,
} from "drizzle-orm";
import type { Database } from "../db";
import {
  users,
  producerMemberships,
  entitlements,
  auditEvents,
  businessProfiles,
  businessProductTerms,
  businessEnquiries,
  businessMessages,
} from "../db/schema";
import { activeProducerPremiumEntitlementCondition } from "../accounts/producer-premium-entitlements";
import {
  businessProfileSchema,
  businessTermsSchema,
  supplierKey,
  productKey,
  requestSchema,
  replySchema,
  B2B_DAILY_REQUEST_LIMIT,
  B2B_DAILY_MESSAGE_LIMIT,
  type RequestedProduct,
} from "./policy";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
type Identity = { country: string; producerId: number };
export type SupplierCatalog = {
  name: string;
  href: string;
  acceptsEnquiries: boolean;
  products: { id: string; name: string; format?: string }[];
};
export class BusinessError extends Error {}
const denied = () =>
  new BusinessError("No tienes acceso a esta consulta o acción profesional.");
export function createBusinessService({
  database,
  catalog,
  enabled = () => true,
}: {
  database: Database;
  catalog: (key: Identity) => Promise<SupplierCatalog | null>;
  enabled?: () => boolean;
}) {
  async function actor(tx: Transaction, id: string, write = false) {
    if (!enabled())
      throw new BusinessError(
        "El canal profesional todavía no está disponible.",
      );
    const [user] = await tx
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, id), eq(users.status, "active")))
      .for(write ? "update" : "share");
    if (!user) throw denied();
  }
  const memberCondition = (id: string, key: Identity) =>
    and(
      eq(producerMemberships.userId, id),
      eq(producerMemberships.country, key.country),
      eq(producerMemberships.producerId, key.producerId),
      eq(producerMemberships.status, "active"),
      isNull(producerMemberships.revokedAt),
      lte(producerMemberships.grantedAt, new Date()),
    );
  async function member(tx: Transaction, id: string, key: Identity) {
    const [row] = await tx
      .select({ id: producerMemberships.id })
      .from(producerMemberships)
      .where(memberCondition(id, key))
      .for("share");
    return Boolean(row);
  }
  async function premium(tx: Transaction, key: Identity) {
    const [row] = await tx
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(
        activeProducerPremiumEntitlementCondition(key.country, key.producerId),
      )
      .for("share");
    if (!row)
      throw new BusinessError(
        "El proveedor necesita un perfil premium activo para recibir solicitudes y compartir condiciones.",
      );
  }
  async function business(tx: Transaction, userId: string) {
    const [profile] = await tx
      .select()
      .from(businessProfiles)
      .where(
        and(
          eq(businessProfiles.userId, userId),
          eq(businessProfiles.enabled, true),
        ),
      )
      .for("share");
    if (!profile)
      throw new BusinessError(
        "Activa tus datos profesionales antes de enviar una consulta.",
      );
    return profile;
  }
  async function access(
    tx: Transaction,
    userId: string,
    id: string,
    write = false,
  ) {
    if (!z.uuid().safeParse(id).success) throw denied();
    const [enquiry] = await tx
      .select()
      .from(businessEnquiries)
      .where(eq(businessEnquiries.id, id))
      .for(write ? "update" : "share");
    if (!enquiry) throw denied();
    const side =
      enquiry.requesterId === userId
        ? "buyer"
        : (await member(tx, userId, enquiry))
          ? "supplier"
          : null;
    if (!side) throw denied();
    return { enquiry, side };
  }
  async function audit(
    tx: Transaction,
    userId: string,
    action: string,
    targetId: string,
  ) {
    await tx.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: userId,
      action,
      targetType: "business_enquiry",
      targetId,
    });
  }
  const startOfDay = () =>
    new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  return {
    async profile(userId: string) {
      return database.transaction(async (tx) => {
        await actor(tx, userId);
        const [row] = await tx
          .select()
          .from(businessProfiles)
          .where(eq(businessProfiles.userId, userId));
        return row ?? null;
      });
    },
    async saveProfile(userId: string, input: unknown) {
      const value = businessProfileSchema.parse(input);
      return database.transaction(async (tx) => {
        await actor(tx, userId, true);
        await tx
          .insert(businessProfiles)
          .values({ userId, ...value })
          .onConflictDoUpdate({
            target: businessProfiles.userId,
            set: { ...value, updatedAt: new Date() },
          });
        await audit(tx, userId, "business.profile_updated", userId);
      });
    },
    async supplier(userId: string, input: Identity) {
      const key = supplierKey.parse(input);
      return database.transaction(async (tx) => {
        await actor(tx, userId);
        if (!(await member(tx, userId, key))) throw denied();
        const producer = await catalog(key);
        if (!producer)
          throw new BusinessError("El productor ya no está publicado.");
        const terms = await tx
          .select()
          .from(businessProductTerms)
          .where(
            and(
              eq(businessProductTerms.country, key.country),
              eq(businessProductTerms.producerId, key.producerId),
            ),
          );
        let canEdit = true;
        try {
          await premium(tx, key);
        } catch (error) {
          if (!(error instanceof BusinessError)) throw error;
          canEdit = false;
        }
        return {
          producer,
          terms: terms.filter((item) =>
            producer.products.some((product) => product.id === item.productId),
          ),
          canEdit,
        };
      });
    },
    async saveTerms(
      userId: string,
      input: Identity & { productId: string; version: number; terms: unknown },
    ) {
      const key = supplierKey.parse({
        country: input.country,
        producerId: input.producerId,
      });
      const productId = productKey.parse(input.productId),
        terms = businessTermsSchema.parse(input.terms);
      if (!Number.isSafeInteger(input.version) || input.version < 0)
        throw new BusinessError("Recarga las condiciones antes de guardar.");
      return database.transaction(async (tx) => {
        await actor(tx, userId, true);
        if (!(await member(tx, userId, key))) throw denied();
        await premium(tx, key);
        const producer = await catalog(key);
        if (!producer?.products.some((product) => product.id === productId))
          throw new BusinessError("El producto ya no está publicado.");
        await tx.execute(
          sql`select pg_advisory_xact_lock(hashtextextended(${`business-terms:${key.country}:${key.producerId}:${productId}`}, 0))`,
        );
        const condition = and(
          eq(businessProductTerms.country, key.country),
          eq(businessProductTerms.producerId, key.producerId),
          eq(businessProductTerms.productId, productId),
        );
        const [previous] = await tx
          .select()
          .from(businessProductTerms)
          .where(condition);
        if ((previous?.version ?? 0) !== input.version)
          throw new BusinessError(
            "Las condiciones han cambiado. Recarga antes de guardar.",
          );
        const values = {
          ...key,
          productId,
          terms,
          version: input.version + 1,
          updatedBy: userId,
          updatedAt: new Date(),
        };
        if (previous)
          await tx.update(businessProductTerms).set(values).where(condition);
        else await tx.insert(businessProductTerms).values(values);
        await audit(
          tx,
          userId,
          "business.terms_updated",
          `${key.country}:${key.producerId}:${productId}`,
        );
      });
    },
    async create(userId: string, raw: unknown) {
      const value = requestSchema.parse(raw);
      return database.transaction(async (tx) => {
        await actor(tx, userId, true);
        const profile = await business(tx, userId);
        const [existing] = await tx
          .select()
          .from(businessEnquiries)
          .where(eq(businessEnquiries.id, value.id));
        if (existing) {
          if (
            existing.requesterId === userId &&
            existing.country === value.country &&
            existing.producerId === value.producerId
          )
            return existing.id;
          throw denied();
        }
        if (await member(tx, userId, value))
          throw new BusinessError(
            "No puedes enviar una consulta a tu propio equipo.",
          );
        await premium(tx, value);
        const producer = await catalog(value);
        if (!producer?.acceptsEnquiries)
          throw new BusinessError(
            "El productor no acepta consultas profesionales actualmente.",
          );
        const products: RequestedProduct[] = value.products.map((item) => {
          const current = producer.products.find(
            (product) => product.id === item.productId,
          );
          if (!current)
            throw new BusinessError(
              "Uno de los productos ya no está publicado. Revisa la selección.",
            );
          return {
            ...item,
            name: current.name,
            format: current.format ?? null,
          };
        });
        const [daily] = await tx
          .select({ count: count() })
          .from(businessEnquiries)
          .where(
            and(
              eq(businessEnquiries.requesterId, userId),
              gte(businessEnquiries.createdAt, startOfDay()),
            ),
          );
        if (daily.count >= B2B_DAILY_REQUEST_LIMIT)
          throw new BusinessError(
            "Has alcanzado el límite de consultas de hoy.",
          );
        await tx.insert(businessEnquiries).values({
          ...value,
          requesterId: userId,
          products,
          business: {
            businessName: profile.businessName,
            activity: profile.activity,
          },
        });
        await audit(tx, userId, "business.enquiry_created", value.id);
        return value.id;
      });
    },
    async inbox(userId: string, offset = 0) {
      return database.transaction(async (tx) => {
        await actor(tx, userId);
        const membership = tx
          .select({ id: producerMemberships.id })
          .from(producerMemberships)
          .where(
            and(
              eq(producerMemberships.userId, userId),
              eq(producerMemberships.country, businessEnquiries.country),
              eq(producerMemberships.producerId, businessEnquiries.producerId),
              eq(producerMemberships.status, "active"),
              isNull(producerMemberships.revokedAt),
              lte(producerMemberships.grantedAt, new Date()),
            ),
          );
        const rows = await tx
          .select()
          .from(businessEnquiries)
          .where(
            or(
              eq(businessEnquiries.requesterId, userId),
              sql`exists (${membership})`,
            ),
          )
          .orderBy(
            desc(businessEnquiries.updatedAt),
            desc(businessEnquiries.id),
          )
          .limit(51)
          .offset(
            Number.isSafeInteger(offset)
              ? Math.max(0, Math.min(10000, offset))
              : 0,
          );
        return { items: rows.slice(0, 50), more: rows.length > 50 };
      });
    },
    async read(userId: string, id: string) {
      return database.transaction(async (tx) => {
        await actor(tx, userId);
        const result = await access(tx, userId, id);
        const messages = await tx
          .select()
          .from(businessMessages)
          .where(eq(businessMessages.enquiryId, id))
          .orderBy(asc(businessMessages.createdAt), asc(businessMessages.id))
          .limit(200);
        let canReply = result.enquiry.status === "open";
        try {
          if (result.side === "supplier") await premium(tx, result.enquiry);
          else await business(tx, userId);
        } catch (error) {
          if (!(error instanceof BusinessError)) throw error;
          canReply = false;
        }
        return {
          ...result,
          messages,
          canReply: canReply && messages.length < 200,
        };
      });
    },
    async reply(userId: string, raw: unknown) {
      const input = replySchema.parse(raw);
      return database.transaction(async (tx) => {
        await actor(tx, userId, true);
        const { enquiry, side } = await access(
          tx,
          userId,
          input.enquiryId,
          true,
        );
        if (side === "buyer") {
          await business(tx, userId);
          if (input.offer) throw denied();
        } else await premium(tx, enquiry);
        const [existing] = await tx
          .select()
          .from(businessMessages)
          .where(eq(businessMessages.id, input.id));
        if (existing) {
          if (existing.authorId === userId && existing.enquiryId === enquiry.id)
            return;
          throw denied();
        }
        if (enquiry.status !== "open")
          throw new BusinessError("Esta consulta está cerrada.");
        if (input.offer) {
          if (
            !enquiry.products.some(
              (product) => product.productId === input.offer!.productId,
            )
          )
            throw new BusinessError(
              "Solo puedes compartir condiciones de los productos solicitados.",
            );
          const current = await catalog(enquiry);
          if (
            !current?.products.some(
              (product) => product.id === input.offer!.productId,
            )
          )
            throw new BusinessError(
              "El producto ya no está publicado; puedes explicarlo mediante un mensaje.",
            );
        }
        const [daily] = await tx
          .select({ count: count() })
          .from(businessMessages)
          .where(
            and(
              eq(businessMessages.authorId, userId),
              gte(businessMessages.createdAt, startOfDay()),
            ),
          );
        const [total] = await tx
          .select({ count: count() })
          .from(businessMessages)
          .where(eq(businessMessages.enquiryId, enquiry.id));
        if (daily.count >= B2B_DAILY_MESSAGE_LIMIT || total.count >= 200)
          throw new BusinessError("Se ha alcanzado el límite de mensajes.");
        await tx
          .insert(businessMessages)
          .values({ ...input, authorId: userId, side });
        await tx
          .update(businessEnquiries)
          .set({ updatedAt: new Date() })
          .where(eq(businessEnquiries.id, enquiry.id));
        await audit(tx, userId, "business.message_sent", enquiry.id);
      });
    },
    async close(userId: string, id: string) {
      return database.transaction(async (tx) => {
        await actor(tx, userId, true);
        await access(tx, userId, id, true);
        await tx
          .update(businessEnquiries)
          .set({ status: "closed", updatedAt: new Date() })
          .where(eq(businessEnquiries.id, id));
        await audit(tx, userId, "business.enquiry_closed", id);
      });
    },
  };
}
