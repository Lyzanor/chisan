"use server";

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

import { hasProducerAccess, requireCurrentAccount } from "@/lib/accounts/auth";
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
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "@/lib/accounts/producer-profile-upgrade-policy";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerChangeRequests,
  producerMemberships,
} from "@/lib/db/schema";

import { producerEditPath, redirectWithMessage } from "./navigation";
const CHANGE_MAX_OPEN_PER_ACCOUNT = 10;
const CHANGE_MAX_SUBMISSIONS_PER_DAY = 25;
const ONE_DAY_MS = 24 * 60 * 60 * 1_000;
export type ProducerChangeFormState = Readonly<{
  fieldErrors: Record<string, string>;
  formError: string | null;
  reloadRequired: boolean;
  revision: number;
  values: Record<string, string>;
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
    fieldErrors,
    formError,
    reloadRequired,
    revision: previousRevision + 1,
    values,
  };
}

export async function submitProducerChangeAction(
  previousState: ProducerChangeFormState,
  formData: FormData,
): Promise<ProducerChangeFormState> {
  const account = await requireCurrentAccount();
  if (!isProducerChangeSubmissionEnabled()) {
    redirectWithMessage(
      "/cuenta/cambios",
      "notice",
      "Profile change submissions are temporarily paused for catalog maintenance.",
    );
  }
  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  if (!parsed.success) {
    redirectWithMessage(
      "/cuenta",
      "error",
      firstValidationMessage(parsed.error),
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
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "An approved producer membership is required for this profile.",
    );
  }
  const producer = await findProducerById(
    parsed.data.country,
    parsed.data.producerId,
  );
  if (!producer) {
    redirectWithMessage(
      editPath,
      "error",
      "That producer is no longer in the catalog.",
    );
  }
  const submittedValues = readSubmittedProducerChangeValues(formData);

  const currentHash = hashProducerFields(producer.fields);
  if (formString(formData, "baseRowHash") !== currentHash) {
    return producerChangeFormError(
      previousState,
      submittedValues,
      "The catalog row changed while you were editing. Review the latest values and try again.",
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
  if (!premiumActive && submittedPremiumFields) {
    return producerChangeFormError(
      previousState,
      submittedValues,
      "The expanded-profile right changed while this form was open. Reload the latest profile before submitting.",
      {},
      true,
    );
  }
  const editableFields = producerEditableFieldsForPremiumAccess(premiumActive);
  const validation = validateProducerProposal(
    readProducerProposalForm(formData, editableFields),
    producer.fields,
    editableFields,
  );
  if (!validation.ok) {
    return producerChangeFormError(
      previousState,
      submittedValues,
      "Review the highlighted fields and submit again.",
      validation.errors,
    );
  }
  if (Object.keys(validation.patch).length === 0) {
    return producerChangeFormError(
      previousState,
      submittedValues,
      "Change at least one field before submitting.",
    );
  }
  const requiredEntitlementKey = isPremiumProducerPatch(validation.patch)
    ? PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY
    : null;

  const authorNote = formString(formData, "authorNote");
  if (authorNote.length < 20 || authorNote.length > 4_000) {
    return producerChangeFormError(
      previousState,
      submittedValues,
      "Explain the change and its public source in 20–4,000 characters.",
      {
        authorNote:
          "Explain the change and its public source in 20–4,000 characters.",
      },
    );
  }

  const database = getDatabase();
  const changeResult = await database.transaction(async (transaction) => {
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
              eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
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
              eq(auditEvents.action, "producer_change.submitted"),
              gte(auditEvents.occurredAt, new Date(Date.now() - ONE_DAY_MS)),
            ),
          ),
      ]);

    if (!membership) return "membership-revoked";
    if (requiredEntitlementKey && !activeEntitlement)
      return "entitlement-revoked";
    if (openCount.value >= CHANGE_MAX_OPEN_PER_ACCOUNT) return "open-limit";
    if (recentCount.value >= CHANGE_MAX_SUBMISSIONS_PER_DAY)
      return "daily-limit";

    const [created] = await transaction
      .insert(producerChangeRequests)
      .values({
        authorUserId: account.id,
        country: parsed.data.country,
        producerId: parsed.data.producerId,
        status: "submitted",
        baseRowHash: currentHash,
        baseSnapshot: producer.fields,
        patch: validation.patch,
        requiredEntitlementKey,
        authorNote,
        submittedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning({ id: producerChangeRequests.id });
    if (!created) return "duplicate";

    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "producer_change.submitted",
      targetType: "producer_change_request",
      targetId: created.id,
      metadata: {
        country: parsed.data.country,
        producerId: parsed.data.producerId,
        fields: Object.keys(validation.patch),
      },
    });
    return created.id;
  });

  if (changeResult === "membership-revoked") {
    redirectWithMessage(
      editPath,
      "error",
      "Your producer access changed before this proposal was saved.",
    );
  }
  if (changeResult === "entitlement-revoked") {
    return producerChangeFormError(
      previousState,
      submittedValues,
      "The expanded-profile right changed before this proposal was saved.",
      {},
      true,
    );
  }
  if (changeResult === "open-limit" || changeResult === "daily-limit") {
    return producerChangeFormError(
      previousState,
      submittedValues,
      changeResult === "open-limit"
        ? "Resolve an existing profile proposal before submitting another."
        : "The daily profile-change limit has been reached. Try again later.",
    );
  }
  if (changeResult === "duplicate") {
    return producerChangeFormError(
      previousState,
      submittedValues,
      "You already have an open change request for this producer.",
    );
  }
  redirectWithMessage(
    "/cuenta/cambios",
    "notice",
    "Changes submitted for editorial review.",
  );
}

export async function withdrawProducerChangeAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/cambios");
  const changeId = formString(formData, "changeId");
  if (!/^[0-9a-f-]{36}$/i.test(changeId)) {
    redirectWithMessage("/cuenta/cambios", "error", "Invalid change request.");
  }

  const withdrawn = await getDatabase().transaction(async (transaction) => {
    const [updated] = await transaction
      .update(producerChangeRequests)
      .set({
        status: "withdrawn",
        lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(producerChangeRequests.id, changeId),
          eq(producerChangeRequests.authorUserId, account.id),
          inArray(producerChangeRequests.status, [
            "draft",
            "submitted",
            "needs_changes",
          ]),
        ),
      )
      .returning({ id: producerChangeRequests.id });
    if (!updated) return false;
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "producer_change.withdrawn",
      targetType: "producer_change_request",
      targetId: updated.id,
      metadata: {},
    });
    return true;
  });

  redirectWithMessage(
    "/cuenta/cambios",
    withdrawn ? "notice" : "error",
    withdrawn
      ? "Change request withdrawn."
      : "This request can no longer be withdrawn.",
  );
}
