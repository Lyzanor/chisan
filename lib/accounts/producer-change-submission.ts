import {
  and,
  count,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";

import { isProducerChangeSubmissionEnabled } from "@/lib/accounts/config";
import {
  firstValidationMessage,
  formString,
  producerKeySchema,
} from "@/lib/accounts/input";
import {
  PRODUCER_EDITABLE_FIELDS,
  PRODUCER_PREMIUM_EDITABLE_FIELDS,
  hashProducerFields,
  isPremiumProducerPatch,
  producerEditableFieldsForPremiumAccess,
  readProducerProposalForm,
  validateProducerProposal,
} from "@/lib/accounts/producer-fields";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "@/lib/accounts/producer-profile-upgrade-policy";
import { findProducerById } from "@/lib/csv-catalog";
import type { Database } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerChangeRequests,
  producerMemberships,
} from "@/lib/db/schema";

import { loadProducerContent } from "@/lib/catalog/content";
import {
  hashProducerContent,
  proposeProducerProducts,
  proposeProducerMedia,
  type ProducerContentChange,
} from "@/lib/accounts/producer-content-change";

import { assertProducerMediaReferences } from "./producer-media";

const CHANGE_MAX_OPEN_PER_ACCOUNT = 10;
const CHANGE_MAX_SUBMISSIONS_PER_DAY = 25;
const ONE_DAY_MS = 24 * 60 * 60 * 1_000;
export type ProducerChangeFormState = Readonly<{
  fieldErrors: Record<string, string>;
  formError: string | null;
  reloadRequired: boolean;
  revision: number;
  values: Record<string, string>;
  draftId?: string;
  draftVersion?: number;
  notice?: string;
}>;

function readSubmittedProducerChangeValues(
  formData: FormData,
): Record<string, string> {
  const values = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.map((field) => {
      // Preserve useful invalid input without reflecting an unbounded hostile
      // payload back through the Server Action response.
      const responseLimit = Math.min(
        10_000,
        Math.max(field.maxLength + 100, field.maxLength * 2),
      );
      const value =
        field.kind === "categories" || field.kind === "sales-channels"
          ? formData
              .getAll(field.key)
              .filter((item): item is string => typeof item === "string")
              .join("|")
          : (() => {
              const item = formData.get(field.key);
              return typeof item === "string" ? item : "";
            })();
      const preservedValue = [
        "descripcion",
        "mensaje a la comunidad",
        "quien hay detras",
        "historia",
      ].includes(field.key)
        ? Array.from(value).slice(0, responseLimit).join("")
        : value.slice(0, responseLimit);
      return [field.key, preservedValue];
    }),
  );
  values.products = formString(formData, "products").slice(0, 250_000);
  values.gallery = formString(formData, "gallery").slice(0, 250_000);
  values.uploads = formString(formData, "uploads").slice(0, 20_000);
  values.authorNote = formString(formData, "authorNote").slice(0, 8_000);
  return values;
}

function producerChangeFormError(
  previousState: ProducerChangeFormState,
  values: Record<string, string>,
  formError: string,
  fieldErrors: Record<string, string> = {},
  reloadRequired = false,
): ProducerChangeFormState {
  const previousRevision = Number.isSafeInteger(previousState?.revision)
    ? previousState.revision
    : 0;
  return {
    draftId: previousState?.draftId,
    draftVersion: previousState?.draftVersion,
    fieldErrors,
    formError,
    reloadRequired,
    revision: previousRevision + 1,
    values,
  };
}

type SubmissionDependencies = {
  getDatabase: () => Database;
  requireCurrentAccount: () => Promise<{ id: string }>;
  hasProducerAccess: (
    userId: string,
    country: string,
    producerId: number,
  ) => Promise<boolean>;
  hasActiveProducerPremiumEntitlement: (
    country: string,
    producerId: number,
  ) => Promise<boolean>;
  redirectWithMessage: (
    path: string,
    kind: "error" | "notice",
    message: string,
  ) => never;
  revalidatePath: (path: string) => void;
};
function producerEditPath(country: string, producerId: number) {
  return `/cuenta/productores/${country}/${producerId}/editar`;
}
export function createProducerChangeSubmissionService(
  dependencies: SubmissionDependencies,
) {
  const {
    getDatabase,
    requireCurrentAccount,
    hasProducerAccess,
    hasActiveProducerPremiumEntitlement,
    redirectWithMessage,
    revalidatePath,
  } = dependencies;
  return async function submitProducerChange(
    previousState: ProducerChangeFormState,
    formData: FormData,
  ): Promise<ProducerChangeFormState> {
    const account = await requireCurrentAccount();
    if (!isProducerChangeSubmissionEnabled()) {
      return redirectWithMessage(
        "/cuenta/cambios",
        "notice",
        "El envío de cambios de perfil está temporalmente pausado por mantenimiento del catálogo.",
      );
    }
    const parsed = producerKeySchema.safeParse({
      country: formString(formData, "country"),
      producerId: formString(formData, "producerId"),
    });
    if (!parsed.success) {
      return redirectWithMessage(
        "/cuenta",
        "error",
        firstValidationMessage(parsed.error, "es"),
      );
    }

    const editPath = producerEditPath(
      parsed.data.country,
      parsed.data.producerId,
    );
    if (
      !(await hasProducerAccess(
        account.id,
        parsed.data.country,
        parsed.data.producerId,
      ))
    ) {
      return redirectWithMessage(
        "/cuenta/reclamaciones",
        "error",
        "Necesitas un acceso aprobado al productor para editar este perfil.",
      );
    }
    const producer = await findProducerById(
      parsed.data.country,
      parsed.data.producerId,
    );
    if (!producer) {
      return redirectWithMessage(
        editPath,
        "error",
        "Ese productor ya no está en el catálogo.",
      );
    }
    const submittedValues = readSubmittedProducerChangeValues(formData);
    const savingDraft = formString(formData, "intent") === "draft";
    const draftId = formString(formData, "draftId");
    const draftVersion = Number(formString(formData, "draftVersion"));
    if (
      draftId &&
      (!/^[0-9a-f-]{36}$/i.test(draftId) ||
        !Number.isSafeInteger(draftVersion) ||
        draftVersion < 1)
    ) {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "Este borrador ha cambiado. Recárgalo antes de guardar.",
        {},
        true,
      );
    }

    const currentHash = hashProducerFields(producer.fields);
    if (formString(formData, "baseRowHash") !== currentHash) {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "La ficha del catálogo ha cambiado mientras editabas. Revisa los valores actuales e inténtalo de nuevo.",
        {},
        true,
      );
    }

    const premiumActive = await hasActiveProducerPremiumEntitlement(
      parsed.data.country,
      parsed.data.producerId,
    );
    const submittedPremiumFields = PRODUCER_PREMIUM_EDITABLE_FIELDS.some(
      ({ key }) => formData.has(key),
    );
    if (
      !premiumActive &&
      (submittedPremiumFields || formData.has("products") || formData.has("gallery") || formData.has("uploads"))
    ) {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "El acceso al perfil ampliado ha cambiado mientras el formulario estaba abierto. Recarga el perfil antes de enviarlo.",
        {},
        true,
      );
    }
    const editableFields =
      producerEditableFieldsForPremiumAccess(premiumActive);
    const validation = validateProducerProposal(
      readProducerProposalForm(formData, editableFields),
      producer.fields,
      editableFields,
      "es",
    );
    if (!validation.ok) {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "Revisa los campos señalados y vuelve a enviarlo.",
        validation.errors,
      );
    }
    let contentChange: ProducerContentChange | null = null;
    if (formData.has("products") || formData.has("gallery")) {
      const content = await loadProducerContent(
        parsed.data.country,
        parsed.data.producerId,
      );
      if (
        formString(formData, "baseContentHash") !== hashProducerContent(content)
      ) {
        return producerChangeFormError(
          previousState,
          submittedValues,
          "Los productos han cambiado mientras editabas. Se conservan tus datos; revisa el perfil actual antes de continuar.",
          {},
          true,
        );
      }
      try {
        const rawProducts = formString(formData, "products");
        if (rawProducts.length > 250_000)
          throw new Error("The product proposal is too large.");
        const rawGallery = formString(formData, "gallery");
        const rawUploads = formString(formData, "uploads");
        if (rawGallery.length > 250_000 || rawUploads.length > 20_000) throw new Error("The image proposal is too large.");
        contentChange = formData.has("gallery")
          ? proposeProducerMedia(content, JSON.parse(rawProducts), JSON.parse(rawGallery), JSON.parse(rawUploads || "[]"))
          : proposeProducerProducts(content, JSON.parse(rawProducts));
      } catch {
        return producerChangeFormError(
          previousState,
          submittedValues,
          "Revisa los productos y las imágenes antes de guardar.",
          {
            products:
              "Cada producto necesita un nombre y un idioma. Puedes añadir hasta 50 productos, con nombres de hasta 160 caracteres y descripciones de hasta 2000 caracteres; las imágenes necesitan un texto alternativo y deben haberse subido desde este perfil; los enlaces deben pertenecer a este perfil.",
          },
        );
      }
    }
    if (
      !savingDraft &&
      Object.keys(validation.patch).length === 0 &&
      !contentChange
    ) {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "Cambia al menos un campo antes de enviar.",
      );
    }
    const requiredEntitlementKey =
      isPremiumProducerPatch(validation.patch) || contentChange !== null
        ? PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY
        : null;

    const authorNote = formString(formData, "authorNote");
    if ((!savingDraft && authorNote.length < 20) || authorNote.length > 4_000) {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "Explica el cambio y su fuente pública en entre 20 y 4000 caracteres.",
        {
          authorNote:
            "Explica el cambio y su fuente pública en entre 20 y 4000 caracteres.",
        },
      );
    }

    const database = getDatabase();
    const changeResult = await database
      .transaction(async (transaction) => {
        await transaction.execute(
          sql`select pg_advisory_xact_lock(hashtext(${`account-change:${account.id}`}))`,
        );
        await transaction.execute(
          sql`select pg_advisory_xact_lock(hashtext(${`producer:${parsed.data.country}:${parsed.data.producerId}`}))`,
        );

        const [[membership], [activeEntitlement], [openCount], [recentCount]] =
          await Promise.all([
            transaction
              .select({ id: producerMemberships.id })
              .from(producerMemberships)
              .where(
                and(
                  eq(producerMemberships.userId, account.id),
                  eq(producerMemberships.country, parsed.data.country),
                  eq(producerMemberships.producerId, parsed.data.producerId),
                  eq(producerMemberships.status, "active"),
                ),
              )
              .for("update")
              .limit(1),
            transaction
              .select({ id: entitlements.id })
              .from(entitlements)
              .where(
                and(
                  eq(entitlements.subjectKind, "producer"),
                  eq(entitlements.producerCountry, parsed.data.country),
                  eq(entitlements.producerId, parsed.data.producerId),
                  eq(
                    entitlements.key,
                    PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
                  ),
                  eq(entitlements.status, "active"),
                  lte(entitlements.startsAt, new Date()),
                  or(
                    isNull(entitlements.expiresAt),
                    gt(entitlements.expiresAt, new Date()),
                  ),
                  isNull(entitlements.revokedAt),
                ),
              )
              .for("update")
              .limit(1),
            transaction
              .select({ value: count() })
              .from(producerChangeRequests)
              .where(
                and(
                  eq(producerChangeRequests.authorUserId, account.id),
                  inArray(producerChangeRequests.status, [
                    "draft",
                    "submitted",
                    "needs_changes",
                    "approved",
                    "applying",
                  ]),
                ),
              ),
            transaction
              .select({ value: count() })
              .from(auditEvents)
              .where(
                and(
                  eq(auditEvents.actorUserId, account.id),
                  eq(
                    auditEvents.action,
                    savingDraft
                      ? "producer_change.draft_saved"
                      : "producer_change.submitted",
                  ),
                  gte(
                    auditEvents.occurredAt,
                    new Date(Date.now() - ONE_DAY_MS),
                  ),
                ),
              ),
          ]);

        if (!membership) return "membership-revoked";
        if (requiredEntitlementKey && !activeEntitlement)
          return "entitlement-revoked";
        if (!draftId && openCount.value >= CHANGE_MAX_OPEN_PER_ACCOUNT)
          return "open-limit";
        if (
          recentCount.value >=
          (savingDraft ? 100 : CHANGE_MAX_SUBMISSIONS_PER_DAY)
        )
          return "daily-limit";

        await assertProducerMediaReferences(transaction, { userId: account.id, ...parsed.data }, contentChange);
        const values = {
          status: savingDraft ? ("draft" as const) : ("submitted" as const),
          baseRowHash: currentHash,
          baseSnapshot: producer.fields,
          patch: validation.patch,
          contentChange,
          requiredEntitlementKey,
          authorNote,
          submittedAt: savingDraft ? null : new Date(),
          updatedAt: new Date(),
        };
        const [created] = draftId
          ? await transaction
              .update(producerChangeRequests)
              .set({
                ...values,
                lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
              })
              .where(
                and(
                  eq(producerChangeRequests.id, draftId),
                  eq(producerChangeRequests.authorUserId, account.id),
                  eq(producerChangeRequests.country, parsed.data.country),
                  eq(producerChangeRequests.producerId, parsed.data.producerId),
                  eq(producerChangeRequests.status, "draft"),
                  eq(producerChangeRequests.lockVersion, draftVersion),
                ),
              )
              .returning({
                id: producerChangeRequests.id,
                lockVersion: producerChangeRequests.lockVersion,
              })
          : await transaction
              .insert(producerChangeRequests)
              .values({
                ...values,
                authorUserId: account.id,
                country: parsed.data.country,
                producerId: parsed.data.producerId,
              })
              .onConflictDoNothing()
              .returning({
                id: producerChangeRequests.id,
                lockVersion: producerChangeRequests.lockVersion,
              });
        if (!created && draftId) return "stale-draft";
        if (!created) return "duplicate";

        await transaction.insert(auditEvents).values({
          actorKind: "user",
          actorUserId: account.id,
          action: savingDraft
            ? "producer_change.draft_saved"
            : "producer_change.submitted",
          targetType: "producer_change_request",
          targetId: created.id,
          metadata: {
            country: parsed.data.country,
            producerId: parsed.data.producerId,
            fields: [
              ...Object.keys(validation.patch),
              ...(contentChange ? ["products", ...(contentChange.version === 2 ? ["gallery"] : [])] : []),
            ],
          },
        });
        return created;
      })
      .catch(() => "save-failed" as const);
    if (changeResult === "save-failed") {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "No hemos podido guardar la propuesta. Se conservan tus datos; inténtalo de nuevo en unos momentos.",
      );
    }

    if (changeResult === "membership-revoked") {
      return redirectWithMessage(
        editPath,
        "error",
        "Tu acceso al productor ha cambiado antes de guardar la propuesta.",
      );
    }
    if (changeResult === "entitlement-revoked") {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "El acceso al perfil ampliado ha cambiado antes de guardar la propuesta.",
        {},
        true,
      );
    }
    if (changeResult === "open-limit" || changeResult === "daily-limit") {
      return producerChangeFormError(
        previousState,
        submittedValues,
        changeResult === "open-limit"
          ? "Resuelve una propuesta de perfil existente antes de enviar otra."
          : "Has alcanzado el límite diario de cambios de perfil. Inténtalo más tarde.",
      );
    }
    if (changeResult === "stale-draft") {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "Este borrador ha cambiado en otra ventana. Se conservan tus datos; recarga el borrador guardado antes de continuar.",
        {},
        true,
      );
    }
    if (changeResult === "duplicate") {
      return producerChangeFormError(
        previousState,
        submittedValues,
        "Ya tienes una solicitud de cambio abierta para este productor.",
      );
    }
    revalidatePath("/cuenta/cambios");
    revalidatePath(editPath);
    if (savingDraft) {
      return {
        fieldErrors: {},
        formError: null,
        reloadRequired: false,
        revision: (previousState?.revision ?? 0) + 1,
        values: submittedValues,
        draftId: changeResult.id,
        draftVersion: changeResult.lockVersion,
        notice:
          "Borrador guardado. Puedes continuar más tarde; todavía no se ha enviado para revisión.",
      };
    }
    return redirectWithMessage(
      "/cuenta/cambios",
      "notice",
      "Cambios enviados para revisión editorial.",
    );
  };
}
