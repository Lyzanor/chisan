import { z } from "zod";

// The Spain-first price editor currently accepts EUR. Decimal text avoids float
// rounding in persisted proposals and preserves the exact amount in JSON-LD.
export const productPriceSchema = z.strictObject({
  amount: z
    .string()
    .regex(/^(?:0|[1-9]\d{0,5})\.\d{2}$/)
    .describe("Recorded price as decimal text, e.g. 3.50; not a live quote."),
  currency: z
    .literal("EUR")
    .describe("ISO 4217 currency; this version supports EUR."),
});
export const productUpdateDateSchema = z.iso
  .date()
  .describe(
    "UTC day when this product's latest accepted changes were submitted for review (YYYY-MM-DD). Not a stock or price validity guarantee.",
  );

export const PRODUCT_FACT_FIELDS = [
  "name",
  "description",
  "locale",
  "media_ids",
  "link_ids",
  "purchase_url",
  "price",
] as const;
export function isDemoProducer(country: string, producerId: number) {
  return country === "es" && producerId === 12439;
}

/** Accept ordinary keyboard decimal input; invalid input remains visible. */
export function normalizeProductPriceInput(value: string): string {
  const text = value.trim().replace(",", ".");
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(text)) return value;
  const [integer, fraction = ""] = text.split(".");
  return `${Number(integer)}.${fraction.padEnd(2, "0")}`;
}
