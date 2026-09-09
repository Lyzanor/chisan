import { z } from "zod";

export const B2B_ROOT = "/cuenta/profesional";
export function isB2BEnabled(env = process.env) {
  return env.CHISAN_B2B_ENABLED === "true";
}
const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (value) =>
        !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]|<\/?[a-z][^>]*>/iu.test(
          value,
        ),
      "Utiliza texto sin HTML ni caracteres de control.",
    );
const requiredText = (max: number) =>
  text(max).refine((value) => value.length > 0, "Completa este campo.");
const quantity = z.number().finite().positive().max(1_000_000);
export const productKey = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80);
export const supplierKey = z.strictObject({
  country: z.string().regex(/^[a-z]{2}$/),
  producerId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
});
export const businessProfileSchema = z.strictObject({
  businessName: requiredText(160),
  activity: z.enum([
    "restaurante",
    "hosteleria",
    "tienda",
    "distribucion",
    "otro",
  ]),
  enabled: z.boolean(),
});
export const businessTermsSchema = z
  .strictObject({
    weeklyCapacity: quantity.optional(),
    capacityUnit: text(80).optional(),
    minimumOrder: quantity.optional(),
    orderUnit: text(80).optional(),
    deliveryDays: z
      .array(z.number().int().min(1).max(7))
      .max(7)
      .refine((days) => new Set(days).size === days.length, "No repitas días."),
    deliveryRadiusKm: quantity.max(2000).optional(),
    deliveryOrigin: text(160).optional(),
    deliveryArea: text(240),
    leadTimeHours: z.number().int().min(0).max(8760).optional(),
    notes: text(1000),
  })
  .superRefine((terms, ctx) => {
    for (const [amount, unit] of [
      ["weeklyCapacity", "capacityUnit"],
      ["minimumOrder", "orderUnit"],
      ["deliveryRadiusKm", "deliveryOrigin"],
    ] as const) {
      if ((terms[amount] !== undefined) !== Boolean(terms[unit]))
        ctx.addIssue({
          code: "custom",
          path: [unit],
          message: "Indica la cantidad y su unidad u origen juntos.",
        });
    }
  });
export type BusinessTerms = z.infer<typeof businessTermsSchema>;
export const emptyBusinessTerms = (): BusinessTerms => ({
  deliveryDays: [],
  deliveryArea: "",
  notes: "",
});
export const requestSchema = supplierKey.extend({
  id: z.uuid(),
  products: z
    .array(
      z.strictObject({
        productId: productKey,
        quantity,
        unit: requiredText(80),
      }),
    )
    .min(1)
    .max(10)
    .refine(
      (items) =>
        new Set(items.map((item) => item.productId)).size === items.length,
      "No repitas productos.",
    ),
  frequency: requiredText(120),
  deliveryLocation: requiredText(240),
  message: requiredText(2000),
});
export type BusinessRequest = z.infer<typeof requestSchema>;
export const offerSchema = z.strictObject({
  productId: productKey,
  terms: businessTermsSchema,
});
export type BusinessOffer = z.infer<typeof offerSchema>;
export const replySchema = z.strictObject({
  id: z.uuid(),
  enquiryId: z.uuid(),
  body: requiredText(2000),
  offer: offerSchema.optional(),
});
export type RequestedProduct = {
  productId: string;
  name: string;
  format: string | null;
  quantity: number;
  unit: string;
};
export const B2B_DAILY_REQUEST_LIMIT = 10;
export const B2B_DAILY_MESSAGE_LIMIT = 100;
