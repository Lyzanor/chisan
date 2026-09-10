import { randomBytes } from "node:crypto";
import { producerChangeIntakeSchema } from "../accounts/producer-change-intake";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  isNull,
  lt,
  notInArray,
  sql,
} from "drizzle-orm";
import type { Database } from "../db";
import {
  auditEvents,
  entitlements,
  producerChangeRequests,
  producerMemberships,
  users,
  whatsappInbox,
  whatsappLinks,
} from "../db/schema";
import {
  activeProducerPremiumEntitlementCondition,
  type AccountTransaction,
} from "../accounts/producer-premium-entitlements";
import {
  getAppUrl,
  isProducerChangeSubmissionEnabled,
} from "../accounts/config";
import { findProducerById } from "../csv-catalog";
import { loadProducerContent } from "../catalog/content";
import {
  hashProducerFields,
  PRODUCER_EDITABLE_FIELDS,
} from "../accounts/producer-fields";
import { hashProducerContent } from "../accounts/producer-content-change";
import {
  createProducerChangeSubmissionService,
  type ProducerChangeFormState,
} from "../accounts/producer-change-submission";
import {
  appendCandidate,
  candidateReply,
  candidateHash,
  candidateSummary,
  emptyCandidate,
  missingQuestions,
  tokenHash,
  type AssistantState,
  type InboundMessage,
} from "./domain";
import {
  interpretProductMessage,
  type ProductExtractor,
} from "../intake/extractor";

type Link = typeof whatsappLinks.$inferSelect;
type DbReader = Pick<Database, "select">;
const DAY = 86_400_000;
async function clearSenderData(tx: AccountTransaction, sender: string) {
  // Keep message IDs until normal retention expires so a Meta replay cannot
  // resurrect a disconnected conversation or reapply it to another producer.
  await tx
    .update(whatsappInbox)
    .set({
      message: sql`${whatsappInbox.message} - 'text' - 'image'`,
      reply: null,
      processedAt: new Date(),
      deliveredAt: new Date(),
    })
    .where(eq(whatsappInbox.sender, sender));
}
export async function channelAccess(
  database: DbReader,
  link: Pick<Link, "userId" | "country" | "producerId">,
) {
  const [membership] = await database
    .select({ id: producerMemberships.id })
    .from(producerMemberships)
    .innerJoin(users, eq(users.id, producerMemberships.userId))
    .where(
      and(
        eq(users.id, link.userId),
        eq(users.status, "active"),
        eq(producerMemberships.country, link.country),
        eq(producerMemberships.producerId, link.producerId),
        eq(producerMemberships.status, "active"),
      ),
    )
    .for("update")
    .limit(1);
  const [entitlement] = await database
    .select({ id: entitlements.id })
    .from(entitlements)
    .where(
      activeProducerPremiumEntitlementCondition(link.country, link.producerId),
    )
    .for("update")
    .limit(1);
  return !!membership && !!entitlement;
}

export async function createLink(
  database: Database,
  input: {
    userId: string;
    country: "es";
    producerId: number;
    timeZone: "Europe/Madrid" | "Atlantic/Canary";
  },
) {
  if (!(await findProducerById(input.country, input.producerId)))
    throw new Error("Productor no encontrado.");
  return database.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`whatsapp-user:${input.userId}`}))`,
    );
    if (!(await channelAccess(tx, input)))
      throw new Error(
        "Necesitas acceso activo al productor y al perfil ampliado.",
      );
    const token = randomBytes(24).toString("hex");
    const [previous] = await tx
      .delete(whatsappLinks)
      .where(eq(whatsappLinks.userId, input.userId))
      .returning();
    if (previous?.sender) await clearSenderData(tx, previous.sender);
    await tx.insert(whatsappLinks).values({
      ...input,
      tokenHash: tokenHash(token),
      tokenExpiresAt: new Date(Date.now() + 10 * 60_000),
      expiresAt: new Date(Date.now() + 30 * DAY),
    });
    await tx.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: input.userId,
      action: "whatsapp.link_requested",
      targetType: "user",
      targetId: input.userId,
      metadata: { country: input.country, producerId: input.producerId },
    });
    return token;
  });
}
export async function unlink(database: Database, userId: string) {
  await database.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`whatsapp-user:${userId}`}))`,
    );
    const [link] = await tx
      .delete(whatsappLinks)
      .where(eq(whatsappLinks.userId, userId))
      .returning();
    if (link?.sender) await clearSenderData(tx, link.sender);
    await tx.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: userId,
      action: "whatsapp.unlinked",
      targetType: "user",
      targetId: userId,
    });
  });
}

class SubmissionRedirect extends Error {
  constructor(
    readonly kind: string,
    message: string,
  ) {
    super(message);
  }
}
async function submitCandidate(
  tx: AccountTransaction,
  link: Link,
  state: AssistantState,
  messageId: string,
) {
  const producer = await findProducerById(link.country, link.producerId);
  if (!producer) throw new Error("Ese productor ya no está en el catálogo.");
  const content = await loadProducerContent(link.country, link.producerId);
  if (
    state.baseRowHash !== hashProducerFields(producer.fields) ||
    state.baseContentHash !== hashProducerContent(content)
  )
    throw new Error(
      "La ficha ha cambiado mientras hablábamos. No he enviado estos datos; puedes empezar de nuevo con la ficha actual.",
    );
  const products = appendCandidate(content, state.candidate, state.productId);
  const form = new FormData();
  for (const field of PRODUCER_EDITABLE_FIELDS) {
    const value = producer.fields[field.key] ?? "";
    if (["categories", "sales-channels", "tokens"].includes(field.kind))
      value
        .split("|")
        .filter(Boolean)
        .forEach((item) => form.append(field.key, item));
    else form.set(field.key, value);
  }
  Object.entries({
    country: link.country,
    producerId: String(link.producerId),
    baseRowHash: state.baseRowHash,
    baseContentHash: state.baseContentHash,
    products: JSON.stringify(products),
    intent: "submit",
    authorNote:
      `WhatsApp producer message, automatically interpreted and submitted for editorial review. No explicit producer confirmation was requested. AI extraction requires editorial verification; no public source or image rights are inferred. Message reference: ${messageId}.\n${candidateSummary(state.candidate)}`.slice(
        0,
        4000,
      ),
  }).forEach(([key, value]) => form.set(key, value));
  const intake = producerChangeIntakeSchema.safeParse({
    version: 2,
    channel: "whatsapp",
    submittedMessageId: messageId,
    receivedAt: state.lastMessageAt,
    replacesRequestId: state.lastProposalId ?? null,
    candidateHash: candidateHash(state.candidate),
    launchOn: state.candidate.launch_on,
    extractions: state.extractions,
  });
  if (!intake.success)
    throw new Error(
      "No he podido registrar estos datos. Puedes enviarlos de nuevo; la propuesta anterior se conserva.",
    );
  const service = createProducerChangeSubmissionService({
    submissionResponse: "state",
    intake: intake.data,
    getDatabase: () => tx as unknown as Database,
    requireCurrentAccount: async () => {
      if (!(await channelAccess(tx, link)))
        throw new Error("Tu acceso al productor ha cambiado.");
      return { id: link.userId };
    },
    hasProducerAccess: async () => channelAccess(tx, link),
    hasActiveProducerPremiumEntitlement: async () => channelAccess(tx, link),
    redirectWithMessage: (_path, kind, message) => {
      throw new SubmissionRedirect(kind, message);
    },
    revalidatePath: () => {},
  });
  const initial: ProducerChangeFormState = {
    fieldErrors: {},
    formError: null,
    reloadRequired: false,
    revision: 0,
    values: {},
  };
  const result = await service(initial, form);
  if (result.formError || !result.submittedId)
    throw new Error(result.formError || "No se ha podido enviar la propuesta.");
  return result.submittedId;
}

export type AssistantDependencies = {
  extractor: ProductExtractor;
  image: (image: NonNullable<InboundMessage["image"]>) => Promise<Buffer>;
  send: (sender: string, reply: string) => Promise<void>;
};
const help =
  "Cuéntame qué producto habéis creado o envíame una foto de la etiqueta. Yo preparo los datos para que el equipo de Chisan los revise. También puedes corregir lo que me has contado o preguntarme cómo va.";

// Same lock order as the shared submission service and editorial review.
async function retirePendingProposal(
  tx: AccountTransaction,
  link: Link,
  requestId: string,
  messageId: string,
) {
  await tx.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`account-change:${link.userId}`}))`,
  );
  await tx.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`producer:${link.country}:${link.producerId}`}))`,
  );
  const [request] = await tx
    .select()
    .from(producerChangeRequests)
    .where(
      and(
        eq(producerChangeRequests.id, requestId),
        eq(producerChangeRequests.authorUserId, link.userId),
        eq(producerChangeRequests.country, link.country),
        eq(producerChangeRequests.producerId, link.producerId),
      ),
    )
    .for("update")
    .limit(1);
  if (
    !request ||
    !["submitted", "withdrawn", "rejected"].includes(request.status)
  )
    throw new Error(
      "La propuesta ya ha avanzado en la revisión y no he podido modificarla. Puedes consultar el estado o continuar desde tu cuenta de Chisan.",
    );
  if (request.status !== "submitted") return;
  await tx
    .update(producerChangeRequests)
    .set({
      status: "withdrawn",
      lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(producerChangeRequests.id, requestId));
  await tx.insert(auditEvents).values({
    actorKind: "user",
    actorUserId: link.userId,
    action: "producer_change.withdrawn",
    targetType: "producer_change_request",
    targetId: requestId,
    metadata: {
      channel: "whatsapp",
      messageId,
      reason: "Producer corrected or cancelled the pending intake",
    },
  });
}

async function cancelConversation(
  tx: AccountTransaction,
  link: Link,
  messageId: string,
) {
  try {
    await tx.transaction(async (nested) => {
      if (link.state?.lastProposalId)
        await retirePendingProposal(
          nested,
          link,
          link.state.lastProposalId,
          messageId,
        );
      await nested
        .update(whatsappLinks)
        .set({ state: null })
        .where(eq(whatsappLinks.id, link.id));
    });
    return "He descartado este producto y retirado su propuesta pendiente, si la había. Cuéntame cuando tengas otra novedad.";
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "No he podido descartar la propuesta.";
  }
}

async function conversationStatus(tx: AccountTransaction, link: Link) {
  if (link.state && !link.state.lastProposalId)
    return candidateReply(link.state.candidate);
  const [proposal] = await tx
    .select({ status: producerChangeRequests.status })
    .from(producerChangeRequests)
    .where(
      and(
        eq(producerChangeRequests.authorUserId, link.userId),
        eq(producerChangeRequests.country, link.country),
        eq(producerChangeRequests.producerId, link.producerId),
      ),
    )
    .orderBy(desc(producerChangeRequests.createdAt))
    .limit(1);
  const labels: Record<string, string> = {
    draft: "borrador",
    submitted: "en revisión",
    needs_changes: "necesita cambios",
    approved: "aprobada, pendiente de publicación",
    applying: "en publicación",
    applied:
      "incorporada al catálogo; todavía falta comprobar que se vea en la web",
    rejected: "rechazada",
    withdrawn: "retirada",
    conflict: "necesita resolver un conflicto",
    failed: "publicación fallida",
  };
  return proposal
    ? `Tu última propuesta: ${labels[proposal.status] ?? "consulta tu cuenta"}. ${getAppUrl()}/cuenta/cambios`
    : help;
}

async function handleMessage(
  tx: AccountTransaction,
  message: InboundMessage,
  dependencies: AssistantDependencies,
): Promise<string> {
  const at = new Date(Number(message.timestamp) * 1000);
  if (
    !Number.isFinite(at.getTime()) ||
    at.getTime() > Date.now() + 5 * 60_000 ||
    Date.now() - at.getTime() >= DAY
  )
    return "Este mensaje ha caducado. Envíalo de nuevo para continuar.";
  const text = message.text?.body ?? message.image?.caption ?? "";
  const command = message.type === "text" ? text.trim().toUpperCase() : "";
  const code = /^VINCULAR ([a-f0-9]{48})$/i.exec(text.trim());
  if (code && message.type === "text") {
    const [pending] = await tx
      .select()
      .from(whatsappLinks)
      .where(
        and(
          eq(whatsappLinks.tokenHash, tokenHash(code[1].toLowerCase())),
          gt(whatsappLinks.tokenExpiresAt, new Date()),
          isNull(whatsappLinks.sender),
        ),
      )
      .limit(1);
    if (!pending)
      return "El código no es válido o ha caducado. Genera otro desde tu cuenta de Chisan.";
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`whatsapp-user:${pending.userId}`}))`,
    );
    if (!(await channelAccess(tx, pending)))
      return "Tu acceso al productor ha cambiado. Revísalo desde tu cuenta de Chisan.";
    const [other] = await tx
      .select()
      .from(whatsappLinks)
      .where(eq(whatsappLinks.sender, message.from))
      .limit(1);
    if (other)
      return "Este WhatsApp ya está vinculado. Puedes desconectarlo desde tu cuenta antes de vincularlo de nuevo.";
    const [linked] = await tx
      .update(whatsappLinks)
      .set({ sender: message.from, tokenHash: null, tokenExpiresAt: null })
      .where(
        and(
          eq(whatsappLinks.id, pending.id),
          eq(whatsappLinks.tokenHash, tokenHash(code[1].toLowerCase())),
          gt(whatsappLinks.tokenExpiresAt, new Date()),
        ),
      )
      .returning();
    if (!linked)
      return "El código ha caducado o se ha utilizado. Genera otro desde Chisan.";
    await tx.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: linked.userId,
      action: "whatsapp.linked",
      targetType: "user",
      targetId: linked.userId,
      metadata: { country: linked.country, producerId: linked.producerId },
    });
    return `WhatsApp vinculado a tu productor en Chisan durante 30 días. ${help}`;
  }
  let [link] = await tx
    .select()
    .from(whatsappLinks)
    .where(eq(whatsappLinks.sender, message.from))
    .limit(1);
  if (!link)
    return `Vincula primero tu WhatsApp desde ${getAppUrl()}/cuenta/whatsapp. ${help}`;
  await tx.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`whatsapp-user:${link.userId}`}))`,
  );
  [link] = await tx
    .select()
    .from(whatsappLinks)
    .where(eq(whatsappLinks.id, link.id))
    .for("update");
  if (!link)
    return "La vinculación ha cambiado. Vuelve a conectar desde Chisan.";
  if (command === "DESCONECTAR") {
    await clearSenderData(tx, message.from);
    await tx.delete(whatsappLinks).where(eq(whatsappLinks.id, link.id));
    await tx.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: link.userId,
      action: "whatsapp.unlinked",
      targetType: "user",
      targetId: link.userId,
    });
    return "WhatsApp desconectado. Puedes volver a vincularlo desde tu cuenta. Las propuestas ya enviadas siguen en revisión.";
  }
  if (
    link.expiresAt.getTime() <= Date.now() ||
    !(await channelAccess(tx, link))
  ) {
    await clearSenderData(tx, message.from);
    await tx.delete(whatsappLinks).where(eq(whatsappLinks.id, link.id));
    return "La vinculación ha caducado o ya no tienes acceso activo. Conecta de nuevo desde tu cuenta de Chisan.";
  }
  if (command === "CANCELAR") return cancelConversation(tx, link, message.id);
  if (command === "ESTADO") return conversationStatus(tx, link);
  if (!isProducerChangeSubmissionEnabled())
    return "La preparación y el envío de cambios están temporalmente pausados.";
  if (link.state && at < new Date(link.state.lastMessageAt))
    return "Este mensaje llegó después de uno más reciente. He conservado los últimos datos para no deshacer tu corrección.";
  if (["AYUDA", "HOLA", "MENU", "MENÚ"].includes(command)) return help;
  if (
    !["text", "image"].includes(message.type) ||
    (message.type === "image" && !message.image)
  )
    return "En este piloto puedo leer texto y fotos JPEG o PNG. Envía el audio o documento como texto o una foto legible.";
  const [daily] = await tx
    .select({ value: count() })
    .from(whatsappInbox)
    .where(
      and(
        eq(whatsappInbox.sender, message.from),
        gte(whatsappInbox.receivedAt, new Date(Date.now() - DAY)),
      ),
    );
  if (daily.value > 50 || (link.state?.turns ?? 0) >= 12)
    return "Has alcanzado el límite de esta conversación o del día. Puedes continuar desde el editor de Chisan.";
  const producer = await findProducerById(link.country, link.producerId);
  if (!producer) return "Ese productor ya no está disponible en el catálogo.";
  const content = await loadProducerContent(link.country, link.producerId);
  const current =
    link.state &&
    Date.now() - new Date(link.state.lastMessageAt).getTime() < DAY
      ? link.state
      : null;
  let interpretation: Awaited<ReturnType<typeof interpretProductMessage>>;
  try {
    interpretation = await interpretProductMessage(dependencies.extractor, {
      text,
      previous: current?.candidate ?? emptyCandidate(),
      at,
      timeZone: link.timeZone,
      ...(message.image
        ? { image: await dependencies.image(message.image) }
        : {}),
    });
  } catch {
    return "No he podido leer bien este mensaje o foto. Conservo los datos anteriores. Prueba con texto o una foto más clara.";
  }
  if (interpretation.action === "status") return conversationStatus(tx, link);
  if (interpretation.action === "cancel")
    return cancelConversation(tx, link, message.id);
  if (interpretation.action === "help") return help;
  const previous = interpretation.action === "new_product" ? null : current;
  const candidate = interpretation.candidate;
  const hash = candidateHash(candidate);
  const changed = previous?.submittedCandidateHash !== hash;
  const complete = missingQuestions(candidate).length === 0;
  const state: AssistantState = {
    candidate,
    productId: previous?.productId ?? `wa-${randomBytes(8).toString("hex")}`,
    baseRowHash: previous?.baseRowHash ?? hashProducerFields(producer.fields),
    baseContentHash: previous?.baseContentHash ?? hashProducerContent(content),
    turns: (previous?.turns ?? 0) + 1,
    lastMessageAt: at.toISOString(),
    lastProposalId: previous?.lastProposalId,
    submittedCandidateHash: previous?.submittedCandidateHash,
    extractions: [
      ...(previous?.extractions ?? []),
      {
        ...dependencies.extractor.profile,
        messageId: message.id,
        inputKind: message.image ? "image" : "text",
        at: at.toISOString(),
        candidateHash: hash,
      },
    ],
  };
  try {
    return await tx.transaction(async (nested) => {
      // Retract a now-inaccurate pending version even while clarifying a correction.
      if (previous?.lastProposalId && changed) {
        await retirePendingProposal(
          nested,
          link,
          previous.lastProposalId,
          message.id,
        );
        if (!complete) state.submittedCandidateHash = undefined;
      }
      if (complete && changed) {
        state.lastProposalId = await submitCandidate(
          nested,
          link,
          state,
          message.id,
        );
        state.submittedCandidateHash = hash;
      }
      await nested
        .update(whatsappLinks)
        .set({ state })
        .where(eq(whatsappLinks.id, link.id));
      if (!complete) return candidateReply(candidate);
      if (!changed)
        return `Ya tengo esos datos. ${await conversationStatus(nested, { ...link, state })}`;
      const price = candidate.price_amount
        ? `, ${candidate.price_amount.replace(".", ",")} €${candidate.format ? ` (${candidate.format})` : ""}`
        : "";
      return `${previous?.lastProposalId ? "He actualizado" : "He preparado"} ${candidate.name}${price}. El equipo de Chisan lo revisará antes de publicarlo.`;
    });
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "No he podido guardar el cambio. Se conservan los datos anteriores.";
  }
}

/** Serialize one sender and commit the proposal, conversation and receipt together. */
export async function processSender(
  database: Database,
  sender: string,
  dependencies: AssistantDependencies,
) {
  return database.transaction(async (tx) => {
    const lock = await tx.execute(
      sql`select pg_try_advisory_xact_lock(hashtext(${`whatsapp-sender:${sender}`})) as locked`,
    );
    const rows = Array.isArray(lock)
      ? lock
      : (lock as unknown as { rows: { locked: boolean }[] }).rows;
    if (!(rows[0] as { locked: boolean })?.locked) return false;
    const [item] = await tx
      .select()
      .from(whatsappInbox)
      .where(
        and(
          eq(whatsappInbox.sender, sender),
          isNull(whatsappInbox.processedAt),
        ),
      )
      .orderBy(asc(whatsappInbox.receivedAt), asc(whatsappInbox.id))
      .for("update")
      .limit(1);
    if (!item) return false;
    const reply = await handleMessage(tx, item.message, dependencies);
    await tx
      .update(whatsappInbox)
      .set({
        reply,
        processedAt: new Date(),
        deliveredAt: null,
        message: { ...item.message, text: undefined, image: undefined },
      })
      .where(eq(whatsappInbox.id, item.id));
    return true;
  });
}
export async function drainInbox(
  database: Database,
  dependencies: AssistantDependencies,
) {
  // Expired work is never sent outside the 24-hour inbound response window.
  await database
    .delete(whatsappInbox)
    .where(lt(whatsappInbox.receivedAt, new Date(Date.now() - 7 * DAY)));
  await database.transaction(async (tx) => {
    const expired = await tx
      .select()
      .from(whatsappLinks)
      .where(lt(whatsappLinks.expiresAt, new Date()))
      .for("update", { skipLocked: true });
    for (const link of expired) {
      if (link.sender) await clearSenderData(tx, link.sender);
      await tx.delete(whatsappLinks).where(eq(whatsappLinks.id, link.id));
    }
  });
  for (let i = 0; i < 4; i++) {
    const [item] = await database
      .select({ sender: whatsappInbox.sender })
      .from(whatsappInbox)
      .where(isNull(whatsappInbox.processedAt))
      .orderBy(asc(whatsappInbox.receivedAt))
      .limit(1);
    if (!item || !(await processSender(database, item.sender, dependencies)))
      break;
  }
  const failedSenders: string[] = [];
  for (let i = 0; i < 8; i++) {
    let recipient: string | null = null;
    let sent: boolean;
    try {
      sent = await database.transaction(async (tx) => {
        // A small pilot needs ordered replies, including across concurrent workers.
        const lock = await tx.execute(
          sql`select pg_try_advisory_xact_lock(hashtext('whatsapp-delivery')) as locked`,
        );
        const rows = Array.isArray(lock)
          ? lock
          : (lock as unknown as { rows: { locked: boolean }[] }).rows;
        if (!(rows[0] as { locked: boolean })?.locked) return false;
        const [item] = await tx
          .select()
          .from(whatsappInbox)
          .where(
            and(
              isNull(whatsappInbox.deliveredAt),
              sql`${whatsappInbox.processedAt} IS NOT NULL`,
              failedSenders.length
                ? notInArray(whatsappInbox.sender, failedSenders)
                : undefined,
            ),
          )
          .orderBy(asc(whatsappInbox.receivedAt))
          .for("update", { skipLocked: true })
          .limit(1);
        if (!item) return false;
        recipient = item.sender;
        if (
          item.reply &&
          Date.now() - Number(item.message.timestamp) * 1000 < DAY
        )
          await dependencies.send(item.sender, item.reply);
        await tx
          .update(whatsappInbox)
          .set({ deliveredAt: new Date(), reply: null })
          .where(eq(whatsappInbox.id, item.id));
        return true;
      });
    } catch {
      if (!recipient) throw new Error("WhatsApp delivery storage unavailable");
      failedSenders.push(recipient);
      continue;
    }
    if (!sent) break;
  }
  if (failedSenders.length)
    throw new Error("Some WhatsApp replies remain pending");
}
