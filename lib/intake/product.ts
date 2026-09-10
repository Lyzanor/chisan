import { createHash } from "node:crypto";
import { z } from "zod";
import {
  contentProductSchema,
  type ProducerContent,
} from "../catalog/content-schema";
import { productPriceSchema } from "../catalog/product-commerce";

const tokenHash = (value: string) =>
  createHash("sha256").update(value).digest("hex");

// Every canonical product field needs an explicit intake decision. A new or
// renamed field fails type checking here until its channel scope is reviewed.
export const PRODUCT_INTAKE_FIELD_POLICY = {
  id: "server",
  name: "candidate",
  description: "candidate",
  locale: "server",
  media_ids: "editor",
  link_ids: "editor",
  purchase_url: "candidate",
  price: "candidate",
  updated_on: "server",
  format: "candidate",
  season_months: "editor",
  seasonal_special: "editor",
} as const satisfies Record<
  keyof z.output<typeof contentProductSchema>,
  "candidate" | "server" | "editor"
>;

export const candidateSchema = z.strictObject({
  name: contentProductSchema.shape.name.trim().nullable(),
  description: contentProductSchema.shape.description
    .unwrap()
    .trim()
    .nullable(),
  format: contentProductSchema.shape.format.unwrap().trim().nullable(),
  price_amount: productPriceSchema.shape.amount.nullable(),
  purchase_url: contentProductSchema.shape.purchase_url.unwrap().nullable(),
  launch_text: z.string().max(160).nullable(),
  launch_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  questions: z.array(z.string().min(1).max(250)).max(3),
});
export type ProductCandidate = z.infer<typeof candidateSchema>;
export const emptyCandidate = (): ProductCandidate => ({
  name: null,
  description: null,
  format: null,
  price_amount: null,
  purchase_url: null,
  launch_text: null,
  launch_on: null,
  questions: [],
});
export function localDay(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
function calendarDate(value: string): boolean {
  const parsed = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}
export function normalizeCandidate(
  input: ProductCandidate,
  at: Date,
  timeZone: string,
): ProductCandidate {
  const candidate = candidateSchema.parse(input);
  const relative = candidate.launch_text?.trim().toLowerCase();
  const offsets: Record<string, number> = {
    hoy: 0,
    mañana: 1,
    "pasado mañana": 2,
  };
  if (relative && relative in offsets) {
    const date = new Date(`${localDay(at, timeZone)}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + offsets[relative]);
    candidate.launch_on = date.toISOString().slice(0, 10);
  }
  if (candidate.launch_on && !calendarDate(candidate.launch_on))
    throw new Error("Invalid launch date");
  if (candidate.purchase_url)
    contentProductSchema.shape.purchase_url.parse(candidate.purchase_url);
  if (candidate.name) contentProductSchema.shape.name.parse(candidate.name);
  if (candidate.description)
    contentProductSchema.shape.description.parse(candidate.description);
  if (candidate.format)
    contentProductSchema.shape.format.parse(candidate.format);
  return candidate;
}
export function missingQuestions(candidate: ProductCandidate) {
  return [
    ...new Set([
      ...(!candidate.name ? ["¿Cómo se llama el producto?"] : []),
      ...(candidate.price_amount && !candidate.format
        ? ["¿A qué formato o cantidad corresponde ese precio?"]
        : []),
      ...(candidate.launch_text && !candidate.launch_on
        ? [
            "¿Qué día exacto está previsto el lanzamiento? Indica día, mes y año.",
          ]
        : []),
      ...candidate.questions,
    ]),
  ];
}
export function candidateSummary(candidate: ProductCandidate): string {
  return [
    `Producto: ${candidate.name || "pendiente de nombre"}`,
    candidate.description && `Descripción: ${candidate.description}`,
    candidate.format && `Formato: ${candidate.format}`,
    candidate.price_amount &&
      `Precio: ${candidate.price_amount.replace(".", ",")} €`,
    candidate.purchase_url && `Compra: ${candidate.purchase_url}`,
    candidate.launch_on &&
      `Lanzamiento previsto: ${candidate.launch_on} (se enviará como nota para revisión; no programa la publicación).`,
  ]
    .filter(Boolean)
    .join("\n");
}
export function candidateReply(candidate: ProductCandidate): string {
  const questions = missingQuestions(candidate);
  return questions.length
    ? questions.slice(0, 2).join(" ")
    : candidateSummary(candidate);
}
export const candidateHash = (candidate: ProductCandidate) =>
  tokenHash(JSON.stringify(candidateSchema.parse(candidate)));
export function appendCandidate(
  content: ProducerContent,
  candidate: ProductCandidate,
  id: string,
) {
  if (missingQuestions(candidate).length)
    throw new Error("Complete the product first");
  const normalizedName = candidate.name!.trim().toLocaleLowerCase("es");
  if (
    content.products.some(
      (product) =>
        product.name.trim().toLocaleLowerCase("es") === normalizedName,
    )
  )
    throw new Error(
      "Ese producto ya existe. Modifícalo desde el editor de Chisan.",
    );
  return [
    ...content.products,
    contentProductSchema.parse({
      id,
      name: candidate.name,
      description: candidate.description || "",
      locale: "es",
      ...(candidate.format ? { format: candidate.format } : {}),
      ...(candidate.price_amount
        ? { price: { amount: candidate.price_amount, currency: "EUR" } }
        : {}),
      ...(candidate.purchase_url
        ? { purchase_url: candidate.purchase_url }
        : {}),
    }),
  ];
}
