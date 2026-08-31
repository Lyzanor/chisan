import { z } from "zod";

import { PUBLIC_PROFILE_VISIBILITIES } from "@/lib/accounts/public-profile-policy";
export const claimMethodSchema = z.enum([
  "business_email",
  "website",
  "phone",
  "document",
  "other",
]);

export const producerKeySchema = z.object({
  country: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z]{2}$/, "Invalid country key."),
  producerId: z.coerce
    .number()
    .int()
    .positive()
    .safe("Invalid producer ID."),
});

export const publicProfileUpdateSchema = z.object({
  publicHandle: z.string().trim().max(80),
  visibility: z.enum(PUBLIC_PROFILE_VISIBILITIES),
  baseLocation: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z]{2}\/[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Choose a catalog area for your public profile.",
    ),
  baseMunicipality: z
    .string()
    .trim()
    .min(1, "Choose a municipality for your public profile.")
    .max(160),
});

export const claimSubmissionSchema = producerKeySchema.extend({
  method: claimMethodSchema,
  contactEmail: z.union([z.literal(""), z.email().max(254)]),
  proof: z.string().trim().min(20).max(4_000),
});

export const claimReviewSchema = z.object({
  claimId: z.uuid(),
  decision: z.enum(["approved", "rejected", "needs_info", "revoked"]),
  note: z.string().trim().max(4_000),
});

export const changeReviewSchema = z.object({
  changeId: z.uuid(),
  decision: z.enum(["approved", "rejected"]),
  note: z.string().trim().max(4_000),
});

export const profileUpgradeRetrySchema = z.object({
  requestId: z.uuid(),
});

const profileUpgradeAdminReasonSchema = z
  .string()
  .trim()
  .min(10, "Explain why this administrative premium access is being changed.")
  .max(1_000);

export const profileUpgradeGiftGrantSchema = producerKeySchema.extend({
  reason: profileUpgradeAdminReasonSchema,
});

export const profileUpgradeGiftRevokeSchema = z.object({
  entitlementId: z.uuid(),
  reason: profileUpgradeAdminReasonSchema,
  confirmation: z.literal("revoke"),
});

export const entitlementKeySchema = z
  .string()
  .trim()
  .regex(/^[a-z][a-z0-9_.-]{2,79}$/);

export function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function firstValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "The submitted data is invalid.";
}
