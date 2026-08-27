"use server";

import { and, count, eq, gt, gte, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  hasProducerAccess,
  requireCurrentAccount,
} from "@/lib/accounts/auth";
import {
  claimSubmissionSchema,
  firstValidationMessage,
  formString,
  producerKeySchema,
  publicProfileUpdateSchema,
} from "@/lib/accounts/input";
import {
  isPublicProfileVisible,
  normalizePublicHandle,
  publicHandleProblem,
} from "@/lib/accounts/public-profile-policy";
import {
  PRODUCER_EDITABLE_FIELDS,
  PRODUCER_PREMIUM_EDITABLE_FIELDS,
  hashProducerFields,
  isPremiumProducerPatch,
  producerEditableFieldsForPremiumAccess,
  readProducerProposalForm,
  safeReturnPath,
  validateProducerProposal,
} from "@/lib/accounts/producer-fields";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "@/lib/accounts/producer-profile-upgrade-policy";
import { isProducerChangeSubmissionEnabled } from "@/lib/accounts/config";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  favorites,
  producerChangeRequests,
  producerClaims,
  producerMemberships,
  users,
} from "@/lib/db/schema";

const CLAIM_MAX_OPEN_PER_ACCOUNT = 5;
const CLAIM_MAX_SUBMISSIONS_PER_DAY = 10;
const CHANGE_MAX_OPEN_PER_ACCOUNT = 10;
const CHANGE_MAX_SUBMISSIONS_PER_DAY = 25;
const ONE_DAY_MS = 24 * 60 * 60 * 1_000;

function redirectWithMessage(
  path: string,
  kind: "error" | "notice",
  message: string,
): never {
  const url = new URL(safeReturnPath(path), "https://chisan.invalid");
  url.searchParams.set(kind, message.slice(0, 300));
  redirect(`${url.pathname}${url.search}`);
}

function producerEditPath(country: string, producerId: number): string {
  return `/cuenta/productores/${encodeURIComponent(country)}/${producerId}/editar`;
}

export type ProducerChangeFormState = Readonly<{
  fieldErrors: Record<string, string>;
  formError: string | null;
  reloadRequired: boolean;
  revision: number;
  values: Record<string, string>;
}>;

function readSubmittedProducerChangeValues(formData: FormData): Record<string, string> {
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
      const preservedValue =
        field.key === "descripcion" || field.key === "mensaje a la comunidad"
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

export async function completeOnboardingAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/bienvenida");
  const acknowledgedReview = formString(formData, "acknowledgeReview") === "yes";
  const displayName = formString(formData, "displayName").replace(/\s+/g, " ");

  if (!acknowledgedReview) {
    redirectWithMessage(
      "/cuenta/bienvenida",
      "error",
      "You must confirm the review and publication notice.",
    );
  }
  if (displayName.length > 160) {
    redirectWithMessage("/cuenta/bienvenida", "error", "The display name is too long.");
  }

  const database = getDatabase();
  await database.transaction(async (transaction) => {
    await transaction
      .update(users)
      .set({
        displayName: displayName || account.displayName,
        termsAcceptedAt: account.termsAcceptedAt ?? new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, account.id));
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "account.onboarding_completed",
      targetType: "user",
      targetId: account.id,
      metadata: { fields: ["displayName", "reviewAcknowledgement"] },
    });
  });

  redirect("/cuenta");
}

export async function updateAccountProfileAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/perfil");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const displayName = formString(formData, "displayName").replace(/\s+/g, " ");

  if (displayName.length > 160) {
    redirectWithMessage("/cuenta/perfil", "error", "The display name is too long.");
  }

  const now = new Date();
  await getDatabase().transaction(async (transaction) => {
    await transaction
      .update(users)
      .set({
        displayName: displayName || null,
        updatedAt: now,
      })
      .where(eq(users.id, account.id));
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "account.profile_updated",
      targetType: "user",
      targetId: account.id,
      metadata: { fields: ["displayName"] },
    });
  });

  revalidatePath("/cuenta");
  revalidatePath("/cuenta/perfil");
  redirectWithMessage("/cuenta/perfil", "notice", "Profile updated.");
}

function isPublicHandleConflict(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505" &&
      "constraint_name" in error &&
      error.constraint_name === "users_public_handle_uidx",
  );
}

export async function updatePublicProfileAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/perfil");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const parsed = publicProfileUpdateSchema.safeParse({
    publicHandle: formString(formData, "publicHandle"),
    visibility: formString(formData, "visibility"),
  });
  if (!parsed.success) {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      firstValidationMessage(parsed.error),
    );
  }

  const submittedHandle = normalizePublicHandle(parsed.data.publicHandle);
  if (
    account.publicHandle &&
    submittedHandle &&
    submittedHandle !== account.publicHandle
  ) {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      "A published handle is stable and cannot be changed from the profile form.",
    );
  }

  const publicHandle = account.publicHandle ?? (submittedHandle || null);
  if (publicHandle) {
    const problem = publicHandleProblem(publicHandle);
    if (problem) redirectWithMessage("/cuenta/perfil", "error", problem);
  }
  if (isPublicProfileVisible(parsed.data.visibility) && !publicHandle) {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      "Choose a public handle before making the profile visible.",
    );
  }

  const now = new Date();
  try {
    await getDatabase().transaction(async (transaction) => {
      await transaction
        .update(users)
        .set({
          publicHandle,
          publicProfileVisibility: parsed.data.visibility,
          updatedAt: now,
        })
        .where(eq(users.id, account.id));
      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: account.id,
        action: "account.public_profile_updated",
        targetType: "user",
        targetId: account.id,
        metadata: {
          fields: ["publicHandle", "publicProfileVisibility"],
          visibility: parsed.data.visibility,
        },
      });
    });
  } catch (error) {
    if (isPublicHandleConflict(error)) {
      redirectWithMessage(
        "/cuenta/perfil",
        "error",
        "That public handle is already in use.",
      );
    }
    throw error;
  }

  revalidatePath("/cuenta/perfil");
  if (publicHandle) revalidatePath(`/u/${publicHandle}`);
  redirectWithMessage("/cuenta/perfil", "notice", "Public profile settings updated.");
}

export async function setFavoritePublicVisibilityAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/favoritos");
  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  const returnTo = safeReturnPath(
    formString(formData, "returnTo"),
    "/cuenta/favoritos",
  );
  if (!parsed.success) {
    redirectWithMessage(returnTo, "error", firstValidationMessage(parsed.error));
  }

  const showOnPublicProfile = formString(formData, "show") === "yes";
  if (
    showOnPublicProfile &&
    !(await findProducerById(parsed.data.country, parsed.data.producerId))
  ) {
    redirectWithMessage(
      returnTo,
      "error",
      "That producer is no longer in the catalog.",
    );
  }

  const updated = await getDatabase().transaction(async (transaction) => {
    const rows = await transaction
      .update(favorites)
      .set({ showOnPublicProfile })
      .where(
        and(
          eq(favorites.userId, account.id),
          eq(favorites.country, parsed.data.country),
          eq(favorites.producerId, parsed.data.producerId),
        ),
      )
      .returning({ producerId: favorites.producerId });
    if (rows.length) {
      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: account.id,
        action: "favorite.public_visibility_updated",
        targetType: "favorite",
        targetId: `${account.id}:${parsed.data.country}:${parsed.data.producerId}`,
        metadata: { showOnPublicProfile },
      });
    }
    return rows;
  });
  if (!updated.length) {
    redirectWithMessage(returnTo, "error", "Save the producer before sharing it.");
  }

  revalidatePath(returnTo.split("?")[0] || "/cuenta/favoritos");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    returnTo,
    "notice",
    showOnPublicProfile
      ? isPublicProfileVisible(account.publicProfileVisibility)
        ? "Producer added to your public profile."
        : "Producer selected for your profile; the profile remains private."
      : "Producer hidden from your public profile.",
  );
}

export async function toggleFavoriteAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount();
  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  const returnTo = safeReturnPath(formString(formData, "returnTo"), "/cuenta/favoritos");

  if (!parsed.success) {
    redirectWithMessage(returnTo, "error", firstValidationMessage(parsed.error));
  }

  const producer = await findProducerById(parsed.data.country, parsed.data.producerId);
  if (!producer) {
    redirectWithMessage(returnTo, "error", "That producer is no longer in the catalog.");
  }

  const database = getDatabase();
  const [existing] = await database
    .select({ userId: favorites.userId })
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, account.id),
        eq(favorites.country, parsed.data.country),
        eq(favorites.producerId, parsed.data.producerId),
      ),
    )
    .limit(1);

  if (existing) {
    await database
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, account.id),
          eq(favorites.country, parsed.data.country),
          eq(favorites.producerId, parsed.data.producerId),
        ),
      );
  } else {
    await database
      .insert(favorites)
      .values({
        userId: account.id,
        country: parsed.data.country,
        producerId: parsed.data.producerId,
      })
      .onConflictDoNothing();
  }

  revalidatePath(returnTo.split("?")[0] || "/");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    returnTo,
    "notice",
    existing ? "Removed from favorites." : "Added to favorites.",
  );
}

export async function submitProducerClaimAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/reclamaciones/nueva");
  if (!account.emailVerified) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "Verify your sign-in email before claiming a producer.",
    );
  }
  if (!account.termsAcceptedAt) {
    redirect("/cuenta/bienvenida");
  }

  const parsed = claimSubmissionSchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
    method: formString(formData, "method"),
    contactEmail: formString(formData, "contactEmail"),
    proof: formString(formData, "proof"),
  });
  if (!parsed.success) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      firstValidationMessage(parsed.error),
    );
  }

  const producer = await findProducerById(parsed.data.country, parsed.data.producerId);
  if (!producer) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "That producer is no longer in the catalog.",
    );
  }
  const database = getDatabase();
  const claimResult = await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`producer:${parsed.data.country}:${parsed.data.producerId}`}))`,
    );
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`account-claim:${account.id}`}))`,
    );

    const [[activeOwner], [openCount], [recentCount]] = await Promise.all([
      transaction
        .select({ userId: producerMemberships.userId })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.country, parsed.data.country),
            eq(producerMemberships.producerId, parsed.data.producerId),
            eq(producerMemberships.role, "owner"),
            eq(producerMemberships.status, "active"),
          ),
        )
        .for("update")
        .limit(1),
      transaction
        .select({ value: count() })
        .from(producerClaims)
        .where(
          and(
            eq(producerClaims.claimantUserId, account.id),
            inArray(producerClaims.status, ["draft", "pending", "needs_info"]),
          ),
        ),
      transaction
        .select({ value: count() })
        .from(auditEvents)
        .where(
          and(
            eq(auditEvents.actorUserId, account.id),
            eq(auditEvents.action, "producer_claim.submitted"),
            gte(auditEvents.occurredAt, new Date(Date.now() - ONE_DAY_MS)),
          ),
      ),
    ]);

    if (activeOwner) {
      return activeOwner.userId === account.id ? "already-owner" : "already-claimed";
    }
    if (openCount.value >= CLAIM_MAX_OPEN_PER_ACCOUNT) return "open-limit";
    if (recentCount.value >= CLAIM_MAX_SUBMISSIONS_PER_DAY) return "daily-limit";

    const [created] = await transaction
      .insert(producerClaims)
      .values({
        claimantUserId: account.id,
        country: parsed.data.country,
        producerId: parsed.data.producerId,
        status: "pending",
        proofMethod: parsed.data.method,
        proof: {
          contactEmail: parsed.data.contactEmail || null,
          producerName: producer.name,
          producerSlug: producer.slug,
          area: producer.area,
          baseRowHash: hashProducerFields(producer.fields),
        },
        claimantMessage: parsed.data.proof,
        submittedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning({ id: producerClaims.id });

    if (!created) return "duplicate";
    await transaction
      .update(users)
      .set({ profileKind: "producer", updatedAt: new Date() })
      .where(eq(users.id, account.id));
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "producer_claim.submitted",
      targetType: "producer_claim",
      targetId: created.id,
      metadata: {
        country: parsed.data.country,
        producerId: parsed.data.producerId,
        method: parsed.data.method,
      },
    });
    return created.id;
  });

  if (claimResult === "already-owner") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "notice",
      "You already have access to this producer.",
    );
  }
  if (claimResult === "already-claimed") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "This producer already has a verified owner and cannot be claimed again.",
    );
  }
  if (claimResult === "open-limit" || claimResult === "daily-limit") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      claimResult === "open-limit"
        ? "Resolve an existing ownership claim before submitting another."
        : "The daily ownership-claim limit has been reached. Try again later.",
    );
  }
  if (claimResult === "duplicate") {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "notice",
      "You already have an open claim for this producer.",
    );
  }
  redirectWithMessage(
    "/cuenta/reclamaciones",
    "notice",
    "Claim submitted for manual verification.",
  );
}

export async function withdrawProducerClaimAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/reclamaciones");
  const claimId = formString(formData, "claimId");
  if (!/^[0-9a-f-]{36}$/i.test(claimId)) {
    redirectWithMessage("/cuenta/reclamaciones", "error", "Invalid claim.");
  }

  const withdrawn = await getDatabase().transaction(async (transaction) => {
    const [updated] = await transaction
      .update(producerClaims)
      .set({
        status: "withdrawn",
        lockVersion: sql`${producerClaims.lockVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(producerClaims.id, claimId),
          eq(producerClaims.claimantUserId, account.id),
          inArray(producerClaims.status, ["draft", "pending", "needs_info"]),
        ),
      )
      .returning({ id: producerClaims.id });
    if (!updated) return false;
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "producer_claim.withdrawn",
      targetType: "producer_claim",
      targetId: updated.id,
      metadata: {},
    });
    return true;
  });

  redirectWithMessage(
    "/cuenta/reclamaciones",
    withdrawn ? "notice" : "error",
    withdrawn ? "Claim withdrawn." : "This claim can no longer be withdrawn.",
  );
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
    redirectWithMessage("/cuenta", "error", firstValidationMessage(parsed.error));
  }

  const editPath = producerEditPath(parsed.data.country, parsed.data.producerId);
  if (!(await hasProducerAccess(account.id, parsed.data.country, parsed.data.producerId))) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      "An approved producer membership is required for this profile.",
    );
  }
  const producer = await findProducerById(parsed.data.country, parsed.data.producerId);
  if (!producer) {
    redirectWithMessage(editPath, "error", "That producer is no longer in the catalog.");
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
  const submittedPremiumFields = PRODUCER_PREMIUM_EDITABLE_FIELDS.some(({ key }) =>
    formData.has(key),
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
        authorNote: "Explain the change and its public source in 20–4,000 characters.",
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

    const [[membership], [activeEntitlement], [openCount], [recentCount]] = await Promise.all([
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
            or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, new Date())),
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
    if (requiredEntitlementKey && !activeEntitlement) return "entitlement-revoked";
    if (openCount.value >= CHANGE_MAX_OPEN_PER_ACCOUNT) return "open-limit";
    if (recentCount.value >= CHANGE_MAX_SUBMISSIONS_PER_DAY) return "daily-limit";

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

export async function withdrawProducerChangeAction(formData: FormData): Promise<void> {
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
          inArray(producerChangeRequests.status, ["draft", "submitted", "needs_changes"]),
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
    withdrawn ? "Change request withdrawn." : "This request can no longer be withdrawn.",
  );
}
