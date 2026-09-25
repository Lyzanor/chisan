import { z } from "zod";
import { contentItemIdSchema } from "../catalog/content-identity";

export const SHELF_LIMITS = {
  inputBytes: 5 * 1024 * 1024,
  preparedBytes: 1536 * 1024,
  pixels: 24_000_000,
  edge: 2400,
  hotspots: 80,
  uploadsPerDay: 10,
} as const;

export function selectionShelfEnabled(environment = process.env) {
  return environment.CHISAN_SELECTION_SHELF_ENABLED === "true";
}

// The same private intake accepts shelves, printed plans and programme pages.
export const shelfInputSchema = z.object({
  kind: z.enum(["auto", "shelf", "plan", "program"]).default("auto"),
  instruction: z.string().trim().max(600).default(""),
  title: z.string().trim().min(1).max(160).default("Mi selección"),
  selectionId: z.uuid().optional(),
}).strict();
export type ShelfInput = z.infer<typeof shelfInputSchema>;
export const shelfInputLabels = { auto: "Reconocer automáticamente", shelf: "Estantería o productos", plan: "Plano de un evento", program: "Cartel, programa o lista" } as const;

export const shelfProducerKeySchema = z.string().regex(/^[a-z]{2}:[1-9]\d{0,14}$/);
export const shelfPointSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),
  producerKey: shelfProducerKeySchema,
  productId: contentItemIdSchema.optional(),
  label: z.string().trim().min(1).max(120),
  x: z.number().finite().min(0).max(1),
  y: z.number().finite().min(0).max(1),
}).strict();
export const shelfPointsSchema = z.array(shelfPointSchema).max(SHELF_LIMITS.hotspots)
  .refine((points) => new Set(points.map((point) => point.id)).size === points.length, "Duplicate points");
export type ShelfPoint = z.infer<typeof shelfPointSchema>;

export const shelfDetectionSchema = z.object({
  points: z.array(z.object({
    producerKey: shelfProducerKeySchema.nullable(),
    productId: contentItemIdSchema.optional(),
    producerName: z.string().max(160).optional(),
    productName: z.string().max(160).optional(),
    candidateKeys: z.array(shelfProducerKeySchema).max(5).optional(),
    label: z.string().max(120),
    x: z.number().finite().min(0).max(1),
    y: z.number().finite().min(0).max(1),
  }).strict()).max(SHELF_LIMITS.hotspots),
}).strict();
export type ShelfDetection = z.infer<typeof shelfDetectionSchema>;
export const shelfObservationSchema = z.object({
  points: z.array(z.object({
    producerName: z.string().max(160).nullable(),
    productName: z.string().max(160).nullable(),
    label: z.string().max(120),
    x: z.number().finite().min(0).max(1),
    y: z.number().finite().min(0).max(1),
  }).strict()).max(SHELF_LIMITS.hotspots),
}).strict();
export type ShelfObservations = z.infer<typeof shelfObservationSchema>;
export type ShelfCandidate = { key: string; name: string; city: string; products: { id: string; name: string }[] };
export type PublicSelectionShelf = {
  id: string;
  imageSrc: string;
  width: number;
  height: number;
  updatedOn: string;
  preview?: boolean;
  points: ShelfPoint[];
};
export const shelfReviewSchema = z.object({
  id: z.uuid(),
  version: z.number().int().positive(),
  action: z.enum(["save", "approve", "reject", "analyze"]),
  points: shelfPointsSchema,
  note: z.string().trim().max(600),
}).strict();
export const shelfPublishSchema = z.object({
  id: z.uuid(), version: z.number().int().positive(),
  producerKeys: z.array(shelfProducerKeySchema).min(1).max(SHELF_LIMITS.hotspots)
    .refine((keys) => new Set(keys).size === keys.length),
  selection: z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().max(600).default("") }).strict().optional(),
  profile: z.object({
    publicHandle: z.string().trim().max(40),
    baseLocation: z.string().trim().max(100),
    baseMunicipality: z.string().trim().min(1).max(160),
  }).strict().optional(),
}).strict();

export class ShelfError extends Error {
  constructor(readonly code: "access" | "missing" | "changed" | "selection" | "quota" | "invalid" | "profile" | "budget") {
    super(code);
  }
}

export const shelfStatusLabels: Record<string, string> = {
  received: "Pendiente de preparar propuesta",
  queued: "Preparando tu propuesta",
  processing: "Identificando productores",
  review: "En revisión por Chisan",
  ready: "Propuesta lista para publicar",
  published: "Publicada",
  rejected: "Necesita otra foto",
  superseded: "Sustituida",
};

export function shelfImageUrl(id: string) { return `/api/selection-shelf/${id}/image`; }

export function shelfSourceMessageKey(channel: string, messageId?: string) {
  if (!/^[a-z][a-z0-9_-]{0,31}$/.test(channel) || (messageId !== undefined && (!messageId.length || messageId.length > 200))) throw new ShelfError("invalid");
  return messageId === undefined ? undefined : `${channel}:${messageId}`;
}
