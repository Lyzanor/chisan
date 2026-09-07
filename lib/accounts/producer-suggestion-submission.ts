import { and, count, eq, gte, inArray, sql } from "drizzle-orm";

import { isProducerSuggestionEnabled } from "@/lib/accounts/config";
import {
  firstValidationMessage,
  formString,
  producerKeySchema,
} from "@/lib/accounts/input";
import {
  hashProducerFields,
  readProducerProposalForm,
  validateProducerProposal,
} from "@/lib/accounts/producer-fields";
import {
  getProducerSuggestionSection,
  isProducerSuggestionPatchInSection,
  isProducerSuggestionSection,
  producerSuggestionSectionFields,
  type ProducerSuggestionSection,
} from "@/lib/accounts/producer-suggestion-sections";
import {
  OPEN_PRODUCER_SUGGESTION_STATUSES,
  SUGGESTION_ROUTE,
} from "@/lib/accounts/producer-suggestion-workflow";
import { findProducerById } from "@/lib/csv-catalog";
import type { Database } from "@/lib/db";
import {
  auditEvents,
  producerMemberships,
  producerSuggestions,
} from "@/lib/db/schema";

export const SUGGESTION_MAX_OPEN_PER_ACCOUNT = 10;
export const SUGGESTION_MAX_SUBMISSIONS_PER_DAY = 20;
export const SUGGESTION_NOTE_MIN_CHARACTERS = 20;
export const SUGGESTION_NOTE_MAX_CHARACTERS = 2_000;
const ONE_DAY_MS = 24 * 60 * 60 * 1_000;

export type ProducerSuggestionFormState = Readonly<{
  fieldErrors: Record<string, string>;
  formError: string | null;
  reloadRequired: boolean;
  revision: number;
  values: Record<string, string>;
}>;

function readSubmittedSuggestionValues(
  formData: FormData,
  section: ProducerSuggestionSection,
): Record<string, string> {
  const values = Object.fromEntries(
    producerSuggestionSectionFields(section).map((field) => {
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
      return [
        field.key,
        field.key === "descripcion"
          ? Array.from(value).slice(0, responseLimit).join("")
          : value.slice(0, responseLimit),
      ];
    }),
  );
  values.authorNote = formString(formData, "authorNote").slice(0, 8_000);
  return values;
}

function suggestionFormError(
  previousState: ProducerSuggestionFormState,
  values: Record<string, string>,
  formError: string,
  fieldErrors: Record<string, string> = {},
  reloadRequired = false,
): ProducerSuggestionFormState {
  const previousRevision = Number.isSafeInteger(previousState?.revision)
    ? previousState.revision
    : 0;
  return {
    fieldErrors,
    formError,
    reloadRequired,
    revision: previousRevision + 1,
    values,
  };
}

type SuggestionAccount = {
  id: string;
  emailVerified: boolean;
  termsAcceptedAt: Date | null;
};

type SuggestionSubmissionDependencies = {
  getDatabase: () => Database;
  requireCurrentAccount: () => Promise<SuggestionAccount>;
  redirectWithMessage: (
    path: string,
    kind: "error" | "notice",
    message: string,
  ) => never;
  redirect: (path: string) => never;
};

/**
 * A community suggestion is an editorial input, not an authorization. It is
 * accepted only for a producer with no active verified owner, it can never
 * write the catalog, and its author never gains producer access from it.
 */
export function createProducerSuggestionSubmissionService(
  dependencies: SuggestionSubmissionDependencies,
) {
  const { getDatabase, requireCurrentAccount, redirectWithMessage, redirect } =
    dependencies;

  return async function submitProducerSuggestion(
    previousState: ProducerSuggestionFormState,
    formData: FormData,
  ): Promise<ProducerSuggestionFormState> {
    const account = await requireCurrentAccount();
    if (!account.termsAcceptedAt) return redirect("/cuenta/bienvenida");
    if (!isProducerSuggestionEnabled()) {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "notice",
        "Las sugerencias están pausadas temporalmente por mantenimiento del catálogo.",
      );
    }
    if (!account.emailVerified) {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "error",
        "Verifica tu correo de acceso antes de enviar una sugerencia.",
      );
    }

    const parsed = producerKeySchema.safeParse({
      country: formString(formData, "country"),
      producerId: formString(formData, "producerId"),
    });
    if (!parsed.success) {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "error",
        firstValidationMessage(parsed.error, "es"),
      );
    }
    const rawSection = formString(formData, "section");
    if (!isProducerSuggestionSection(rawSection)) {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "error",
        "Elige un apartado válido de la ficha.",
      );
    }
    const section: ProducerSuggestionSection = rawSection;
    const { country, producerId } = parsed.data;
    const submittedValues = readSubmittedSuggestionValues(formData, section);

    const producer = await findProducerById(country, producerId).catch(
      () => null,
    );
    if (!producer) {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "error",
        "Ese productor ya no está en el catálogo.",
      );
    }

    const currentHash = hashProducerFields(producer.fields);
    if (formString(formData, "baseRowHash") !== currentHash) {
      return suggestionFormError(
        previousState,
        submittedValues,
        "La ficha ha cambiado mientras escribías. Revisa los valores actuales e inténtalo de nuevo.",
        {},
        true,
      );
    }

    const sectionFields = producerSuggestionSectionFields(section);
    const validation = validateProducerProposal(
      readProducerProposalForm(formData, sectionFields),
      producer.fields,
      sectionFields,
      "es",
    );
    if (!validation.ok) {
      return suggestionFormError(
        previousState,
        submittedValues,
        "Revisa los campos marcados.",
        validation.errors,
      );
    }
    if (Object.keys(validation.patch).length === 0) {
      return suggestionFormError(
        previousState,
        submittedValues,
        "Cambia al menos un dato de este apartado antes de enviar la sugerencia.",
      );
    }
    // The stored section has to describe the stored patch: the review queue
    // filters and reads by section, so it must not drift from the fields.
    if (!isProducerSuggestionPatchInSection(section, validation.patch)) {
      return suggestionFormError(
        previousState,
        submittedValues,
        "La sugerencia incluye campos que no pertenecen a este apartado.",
      );
    }

    const authorNote = submittedValues.authorNote.trim();
    if (
      authorNote.length < SUGGESTION_NOTE_MIN_CHARACTERS ||
      authorNote.length > SUGGESTION_NOTE_MAX_CHARACTERS
    ) {
      return suggestionFormError(
        previousState,
        submittedValues,
        "Revisa los campos marcados.",
        {
          authorNote:
            authorNote.length < SUGGESTION_NOTE_MIN_CHARACTERS
              ? `Explica de dónde sale la corrección con al menos ${SUGGESTION_NOTE_MIN_CHARACTERS} caracteres.`
              : `Este campo admite como máximo ${SUGGESTION_NOTE_MAX_CHARACTERS} caracteres.`,
        },
      );
    }

    const database = getDatabase();
    const result = await database.transaction(async (transaction) => {
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`producer:${country}:${producerId}`}))`,
      );
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`account-suggestion:${account.id}`}))`,
      );

      const [memberships, [openCount], [recentCount]] = await Promise.all([
        transaction
          .select({
            userId: producerMemberships.userId,
            role: producerMemberships.role,
          })
          .from(producerMemberships)
          .where(
            and(
              eq(producerMemberships.country, country),
              eq(producerMemberships.producerId, producerId),
              eq(producerMemberships.status, "active"),
            ),
          )
          .for("update"),
        transaction
          .select({ value: count() })
          .from(producerSuggestions)
          .where(
            and(
              eq(producerSuggestions.authorUserId, account.id),
              inArray(producerSuggestions.status, [
                ...OPEN_PRODUCER_SUGGESTION_STATUSES,
              ]),
            ),
          ),
        transaction
          .select({ value: count() })
          .from(auditEvents)
          .where(
            and(
              eq(auditEvents.actorUserId, account.id),
              eq(auditEvents.action, "producer_suggestion.submitted"),
              gte(auditEvents.occurredAt, new Date(Date.now() - ONE_DAY_MS)),
            ),
          ),
      ]);

      if (memberships.some(({ userId }) => userId === account.id)) {
        return "already-member" as const;
      }
      if (memberships.some(({ role }) => role === "owner")) {
        return "already-claimed" as const;
      }
      if (openCount.value >= SUGGESTION_MAX_OPEN_PER_ACCOUNT) {
        return "open-limit" as const;
      }
      if (recentCount.value >= SUGGESTION_MAX_SUBMISSIONS_PER_DAY) {
        return "daily-limit" as const;
      }

      const [created] = await transaction
        .insert(producerSuggestions)
        .values({
          authorUserId: account.id,
          country,
          producerId,
          status: "pending",
          section,
          baseRowHash: currentHash,
          baseSnapshot: producer.fields,
          patch: validation.patch,
          authorNote,
        })
        .onConflictDoNothing()
        .returning({ id: producerSuggestions.id });
      if (!created) return "duplicate" as const;

      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: account.id,
        action: "producer_suggestion.submitted",
        targetType: "producer_suggestion",
        targetId: created.id,
        metadata: {
          country,
          producerId,
          section,
          fields: Object.keys(validation.patch),
        },
      });
      return created.id;
    });

    if (result === "already-member") {
      return redirectWithMessage(
        `/cuenta/productores/${country}/${producerId}/editar`,
        "notice",
        "Gestionas este productor: propón los cambios desde tu editor.",
      );
    }
    if (result === "already-claimed") {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "notice",
        "Este productor ya tiene un titular verificado y mantiene su ficha directamente.",
      );
    }
    if (result === "open-limit" || result === "daily-limit") {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "error",
        result === "open-limit"
          ? "Tienes demasiadas sugerencias abiertas. Espera a que se publiquen o se cierren."
          : "Has alcanzado el límite diario de sugerencias. Inténtalo mañana.",
      );
    }
    if (result === "duplicate") {
      return redirectWithMessage(
        SUGGESTION_ROUTE,
        "notice",
        `Ya tienes una sugerencia abierta para «${getProducerSuggestionSection(section).label}» en esta ficha.`,
      );
    }

    return redirectWithMessage(
      SUGGESTION_ROUTE,
      "notice",
      "Sugerencia enviada. El equipo editorial la revisará con fuentes públicas.",
    );
  };
}

type SuggestionWithdrawalDependencies = {
  getDatabase: () => Database;
  requireCurrentAccount: () => Promise<{ id: string }>;
  redirectWithMessage: (
    path: string,
    kind: "error" | "notice",
    message: string,
  ) => never;
};

export function createProducerSuggestionWithdrawalService(
  dependencies: SuggestionWithdrawalDependencies,
) {
  const { getDatabase, requireCurrentAccount, redirectWithMessage } =
    dependencies;

  return async function withdrawProducerSuggestion(
    formData: FormData,
  ): Promise<void> {
    const account = await requireCurrentAccount();
    const suggestionId = formString(formData, "suggestionId");
    if (!/^[0-9a-f-]{36}$/i.test(suggestionId)) {
      redirectWithMessage(SUGGESTION_ROUTE, "error", "Sugerencia no válida.");
    }

    const withdrawn = await getDatabase().transaction(async (transaction) => {
      const [updated] = await transaction
        .update(producerSuggestions)
        .set({
          status: "withdrawn",
          lockVersion: sql`${producerSuggestions.lockVersion} + 1`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(producerSuggestions.id, suggestionId),
            eq(producerSuggestions.authorUserId, account.id),
            eq(producerSuggestions.status, "pending"),
          ),
        )
        .returning({ id: producerSuggestions.id });
      if (!updated) return false;

      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: account.id,
        action: "producer_suggestion.withdrawn",
        targetType: "producer_suggestion",
        targetId: updated.id,
        metadata: {},
      });
      return true;
    });

    redirectWithMessage(
      SUGGESTION_ROUTE,
      withdrawn ? "notice" : "error",
      withdrawn
        ? "Sugerencia retirada."
        : "Esta sugerencia ya no se puede retirar.",
    );
  };
}
