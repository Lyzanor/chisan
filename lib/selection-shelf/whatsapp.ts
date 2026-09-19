import { randomBytes } from "node:crypto";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import type { Database } from "../db";
import { auditEvents, selectionShelfWhatsAppLinks as links, selectionShelves, whatsappLinks } from "../db/schema";
import type { AccountTransaction } from "../accounts/producer-premium-entitlements";
import { getAppUrl } from "../accounts/config";
import { tokenHash, type InboundMessage } from "../whatsapp/domain";
import { clearSenderData } from "../whatsapp/service";
import { ProducerImageError } from "../accounts/prepare-producer-image";
import { canManageSelectionShelf } from "./access";
import { selectionShelfEnabled, ShelfError, shelfStatusLabels, shelfSourceMessageKey } from "./policy";
import { createSelectionShelfService, type ShelfCatalog } from "./service";

const DAY = 86_400_000;
const help = "Envía una foto de tu estantería. Chisan identificará los productos y preparará una propuesta con sus productores del catálogo. Podrás desmarcar y publicar desde tu cuenta. ESTADO consulta el último envío; CANCELAR retira la foto pendiente; DESCONECTAR desvincula el número.";
export async function createShelfWhatsAppLink(database: Database, userId: string) {
  if (!selectionShelfEnabled()) throw new ShelfError("access");
  return database.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`whatsapp-user:${userId}`}))`);
    if (!(await canManageSelectionShelf(tx, userId))) throw new ShelfError("access");
    const [previous] = await tx.delete(links).where(eq(links.userId, userId)).returning();
    const [producer] = await tx.delete(whatsappLinks).where(eq(whatsappLinks.userId, userId)).returning();
    for (const link of [previous, producer]) if (link?.sender) await clearSenderData(tx, link.sender);
    const token = randomBytes(24).toString("hex");
    await tx.insert(links).values({ userId, tokenHash: tokenHash(token), tokenExpiresAt: new Date(Date.now() + 600_000), expiresAt: new Date(Date.now() + 30 * DAY) });
    await tx.insert(auditEvents).values({ actorKind: "user", actorUserId: userId, action: "selection_shelf.whatsapp_link_requested", targetType: "user", targetId: userId, metadata: { processingAndPublicationConsent: true } });
    return token;
  });
}

/** Runs inside the signed inbox transaction, with the shared sender lock held. */
export function createShelfWhatsAppHandler(deps: { catalog: ShelfCatalog; image: (image: NonNullable<InboundMessage["image"]>) => Promise<Buffer> }) {
  return async function handle(tx: AccountTransaction, message: InboundMessage): Promise<string | null> {
    if (!selectionShelfEnabled()) return null;
    const text = message.type === "text" ? message.text?.body.trim() ?? "" : "";
    const code = /^VINCULAR ([a-f0-9]{48})$/i.exec(text);
    if (code) {
      const hash = tokenHash(code[1].toLowerCase());
      const [pending] = await tx.select().from(links).where(and(eq(links.tokenHash, hash), gt(links.tokenExpiresAt, new Date()), isNull(links.sender))).limit(1);
      if (pending) {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`whatsapp-user:${pending.userId}`}))`);
        if (!(await canManageSelectionShelf(tx, pending.userId))) return "Tu acceso ha cambiado. Revisa tu cuenta de Chisan.";
        const [otherShelf] = await tx.select().from(links).where(eq(links.sender, message.from)).limit(1);
        const [otherProducer] = await tx.select().from(whatsappLinks).where(eq(whatsappLinks.sender, message.from)).limit(1);
        if (otherShelf || otherProducer) return "Este número ya está vinculado. Desconéctalo desde la cuenta anterior antes de volver a vincularlo.";
        const [linked] = await tx.update(links).set({ sender: message.from, tokenHash: null, tokenExpiresAt: null })
          .where(and(eq(links.userId, pending.userId), eq(links.tokenHash, hash), gt(links.tokenExpiresAt, new Date()), isNull(links.sender))).returning();
        if (!linked) return "El código ha caducado o se ha utilizado. Genera otro desde Chisan.";
        await tx.insert(auditEvents).values({ actorKind: "user", actorUserId: linked.userId, action: "selection_shelf.whatsapp_linked", targetType: "user", targetId: linked.userId });
        return `WhatsApp vinculado a tu estantería durante 30 días. ${help}`;
      }
    }
    let [link] = await tx.select().from(links).where(eq(links.sender, message.from)).limit(1);
    if (!link) return null;
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`whatsapp-user:${link.userId}`}))`);
    [link] = await tx.select().from(links).where(and(eq(links.userId, link.userId), eq(links.sender, message.from))).for("update");
    if (!link) return "La vinculación ha cambiado. Conecta de nuevo desde tu cuenta.";
    const command = text.toUpperCase();
    if (command === "DESCONECTAR" || link.expiresAt.getTime() <= Date.now() || !(await canManageSelectionShelf(tx, link.userId))) {
      await clearSenderData(tx, message.from);
      await tx.delete(links).where(eq(links.userId, link.userId));
      await tx.insert(auditEvents).values({ actorKind: "user", actorUserId: link.userId, action: "selection_shelf.whatsapp_unlinked", targetType: "user", targetId: link.userId });
      return "WhatsApp desconectado. Tus fotos enviadas se conservan; puedes retirarlas o volver a vincular el número desde tu cuenta.";
    }
    // Nested service transactions use savepoints on this same connection. The
    // photo and inbox receipt commit together. Inference starts after commit; publication belongs to the owner.
    const service = createSelectionShelfService({ database: tx as unknown as Database, catalog: deps.catalog, enabled: selectionShelfEnabled });
    if (command === "ESTADO") {
      const [latest] = await service.ownerStatus(link.userId);
      return latest ? `Tu última foto: ${shelfStatusLabels[latest.status]}. ${getAppUrl()}/cuenta/estanteria` : help;
    }
    if (command === "CANCELAR") {
      const records = await service.ownerStatus(link.userId);
      const pending = records.find((record) => ["received", "queued", "processing", "review", "ready"].includes(record.status));
      if (pending) await service.withdraw(link.userId, pending.id);
      return pending ? "Foto pendiente retirada. La foto ya publicada sigue visible." : "No hay ninguna foto pendiente. Puedes retirar la publicada desde tu cuenta.";
    }
    if (message.type !== "image" || !message.image) return help;
    const [receipt] = await tx.select({ id: selectionShelves.id }).from(selectionShelves).where(eq(selectionShelves.messageId, shelfSourceMessageKey("whatsapp", message.id)!)).limit(1);
    if (receipt) return "Esta foto ya se ha recibido y no volverá a analizarse.";
    let image: Buffer;
    try { image = await deps.image(message.image); }
    catch {
      // Expired or unreadable Meta media must not block later messages forever.
      return `No hemos podido recibir la foto desde WhatsApp. Vuelve a enviarla o súbela desde ${getAppUrl()}/cuenta/estanteria.`;
    }
    try {
      await service.submit(link.userId, image, "whatsapp", message.id);
      return `Foto recibida. Prepararemos una propuesta con los productores identificados. Revisa, desmarca y publica desde ${getAppUrl()}/cuenta/estanteria. Tu foto publicada seguirá visible hasta que publiques la nueva.`;
    } catch (error) {
      if (error instanceof ShelfError) {
        if (error.code === "quota") return "Has alcanzado el límite de 10 fotos en 24 horas. Prueba mañana.";
        return "Tu acceso ha cambiado. Revísalo desde tu cuenta de Chisan.";
      }
      if (error instanceof ProducerImageError) return "No podemos leer esta foto. Envía un JPEG o PNG nítido, de hasta 5 MB y con las etiquetas de frente.";
      // Transient transport/storage failures must leave the inbox pending.
      throw error;
    }
  };
}
