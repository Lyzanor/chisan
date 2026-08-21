"use server";

import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
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
  profileKindSchema,
} from "@/lib/accounts/input";
import {
  hashProducerFields,
  readProducerProposalForm,
  safeReturnPath,
  validateProducerProposal,
} from "@/lib/accounts/producer-fields";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  auditEvents,
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
  const url = new URL(safeReturnPath(path), "https://km0.invalid");
  url.searchParams.set(kind, message.slice(0, 300));
  redirect(`${url.pathname}${url.search}`);
}

function producerEditPath(country: string, producerId: number): string {
  return `/cuenta/productores/${encodeURIComponent(country)}/${producerId}/editar`;
}

export async function completeOnboardingAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/bienvenida");
  const profileKind = profileKindSchema.safeParse(formString(formData, "profileKind"));
  const acceptedTerms = formString(formData, "acceptTerms") === "yes";
  const displayName = formString(formData, "displayName").replace(/\s+/g, " ");

  if (!profileKind.success) {
    redirectWithMessage("/cuenta/bienvenida", "error", "Choose a profile type.");
  }
  if (!acceptedTerms) {
    redirectWithMessage(
      "/cuenta/bienvenida",
      "error",
      "You must accept the account and editorial terms.",
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
        profileKind: profileKind.data,
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
      metadata: { profileKind: profileKind.data },
    });
  });

  redirect("/cuenta");
}

export async function updateAccountProfileAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/perfil");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const profileKind = profileKindSchema.safeParse(formString(formData, "profileKind"));
  const displayName = formString(formData, "displayName").replace(/\s+/g, " ");

  if (!profileKind.success) {
    redirectWithMessage("/cuenta/perfil", "error", "Choose a profile type.");
  }
  if (displayName.length > 160) {
    redirectWithMessage("/cuenta/perfil", "error", "The display name is too long.");
  }

  const now = new Date();
  await getDatabase().transaction(async (transaction) => {
    await transaction
      .update(users)
      .set({
        displayName: displayName || null,
        profileKind: profileKind.data,
        updatedAt: now,
      })
      .where(eq(users.id, account.id));
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "account.profile_updated",
      targetType: "user",
      targetId: account.id,
      metadata: { profileKind: profileKind.data },
    });
  });

  revalidatePath("/cuenta");
  revalidatePath("/cuenta/perfil");
  redirectWithMessage("/cuenta/perfil", "notice", "Profile updated.");
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
      sql`select pg_advisory_xact_lock(hashtext(${`account-claim:${account.id}`}))`,
    );

    const [[membership], [openCount], [recentCount]] = await Promise.all([
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

    if (membership) return "already-owner";
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

export async function submitProducerChangeAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount();
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

  const currentHash = hashProducerFields(producer.fields);
  if (formString(formData, "baseRowHash") !== currentHash) {
    redirectWithMessage(
      editPath,
      "error",
      "The catalog row changed while you were editing. Review the latest values and try again.",
    );
  }

  const validation = validateProducerProposal(
    readProducerProposalForm(formData),
    producer.fields,
  );
  if (!validation.ok) {
    redirectWithMessage(
      editPath,
      "error",
      Object.values(validation.errors)[0] ?? "The proposal is invalid.",
    );
  }
  if (Object.keys(validation.patch).length === 0) {
    redirectWithMessage(editPath, "error", "Change at least one field before submitting.");
  }

  const authorNote = formString(formData, "authorNote");
  if (authorNote.length < 20 || authorNote.length > 4_000) {
    redirectWithMessage(
      editPath,
      "error",
      "Explain the change and its public source in 20–4,000 characters.",
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

    const [[membership], [openCount], [recentCount]] = await Promise.all([
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
  if (changeResult === "open-limit" || changeResult === "daily-limit") {
    redirectWithMessage(
      editPath,
      "error",
      changeResult === "open-limit"
        ? "Resolve an existing profile proposal before submitting another."
        : "The daily profile-change limit has been reached. Try again later.",
    );
  }
  if (changeResult === "duplicate") {
    redirectWithMessage(
      editPath,
      "error",
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
