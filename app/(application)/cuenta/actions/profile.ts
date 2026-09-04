"use server";

import { and, eq, isNull, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  firstValidationMessage,
  formString,
  publicProfileUpdateSchema,
} from "@/lib/accounts/input";
import {
  normalizeMunicipalityName,
  parsePublicProfileBaseLocationKey,
} from "@/lib/accounts/public-profile-location";
import {
  isPublicProfileVisible,
  normalizePublicHandle,
  publicHandleProblem,
} from "@/lib/accounts/public-profile-policy";
import {
  findPublishedCountry,
  listMunicipalitySummaries,
} from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { auditEvents, users } from "@/lib/db/schema";

import { redirectWithMessage } from "./navigation";
export async function completeOnboardingAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/bienvenida");
  const acknowledgedReview =
    formString(formData, "acknowledgeReview") === "yes";
  const displayName = formString(formData, "displayName").replace(/\s+/g, " ");

  if (!acknowledgedReview) {
    redirectWithMessage(
      "/cuenta/bienvenida",
      "error",
      "You must confirm the review and publication notice.",
    );
  }
  if (displayName.length > 160) {
    redirectWithMessage(
      "/cuenta/bienvenida",
      "error",
      "The display name is too long.",
    );
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

export async function updateAccountProfileAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/perfil");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const displayName = formString(formData, "displayName").replace(/\s+/g, " ");

  if (displayName.length > 160) {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      "The display name is too long.",
    );
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

class PublicHandleChangedError extends Error {}

export async function updatePublicProfileAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/perfil");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const parsed = publicProfileUpdateSchema.safeParse({
    publicHandle: formString(formData, "publicHandle"),
    visibility: formString(formData, "visibility"),
    baseLocation: formString(formData, "baseLocation"),
    baseMunicipality: formString(formData, "baseMunicipality"),
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

  const baseLocation = parsePublicProfileBaseLocationKey(
    parsed.data.baseLocation,
  );
  if (!baseLocation) {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      "Choose a catalog area for your public profile.",
    );
  }
  const baseCountry = findPublishedCountry(baseLocation.country);
  const baseArea = baseCountry?.regions
    .flatMap((region) => region.areas)
    .find((area) => area.slug === baseLocation.area);
  if (!baseCountry || !baseArea) {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      "Choose a published catalog area for your public profile.",
    );
  }

  const normalizedMunicipality = normalizeMunicipalityName(
    parsed.data.baseMunicipality,
  );
  const matchingMunicipalities = (
    await listMunicipalitySummaries(
      "",
      Number.MAX_SAFE_INTEGER,
      baseCountry.slug,
      baseArea.slug,
    )
  ).filter(
    ({ name }) => normalizeMunicipalityName(name) === normalizedMunicipality,
  );
  if (matchingMunicipalities.length !== 1) {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      `Choose a municipality that appears in the ${baseArea.label} catalog area.`,
    );
  }
  const baseMunicipality = matchingMunicipalities[0].name;

  const now = new Date();
  try {
    await getDatabase().transaction(async (transaction) => {
      const publicHandleGuard = account.publicHandle
        ? eq(users.publicHandle, account.publicHandle)
        : publicHandle
          ? or(isNull(users.publicHandle), eq(users.publicHandle, publicHandle))
          : isNull(users.publicHandle);
      const updatedUsers = await transaction
        .update(users)
        .set({
          publicHandle,
          publicProfileVisibility: parsed.data.visibility,
          publicProfileBaseCountry: baseCountry.slug,
          publicProfileBaseArea: baseArea.slug,
          publicProfileBaseMunicipality: baseMunicipality,
          updatedAt: now,
        })
        .where(and(eq(users.id, account.id), publicHandleGuard))
        .returning({ id: users.id });
      if (!updatedUsers.length) throw new PublicHandleChangedError();

      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: account.id,
        action: "account.public_profile_updated",
        targetType: "user",
        targetId: account.id,
        metadata: {
          fields: [
            "publicHandle",
            "publicProfileVisibility",
            "publicProfileBaseCountry",
            "publicProfileBaseArea",
            "publicProfileBaseMunicipality",
          ],
          visibility: parsed.data.visibility,
          baseLocation: {
            country: baseCountry.slug,
            area: baseArea.slug,
            municipality: baseMunicipality,
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof PublicHandleChangedError) {
      redirectWithMessage(
        "/cuenta/perfil",
        "error",
        "Your public handle was set in another request. Reload the page to continue.",
      );
    }
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
  redirectWithMessage(
    "/cuenta/perfil",
    "notice",
    "Public profile settings updated.",
  );
}
