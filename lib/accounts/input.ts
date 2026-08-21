import { z } from "zod";

export const profileKindSchema = z.enum(["user", "producer"]);
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
