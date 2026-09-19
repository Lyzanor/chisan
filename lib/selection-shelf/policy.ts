import { z } from "zod";

export const SHELF_LIMITS = {
  inputBytes: 5 * 1024 * 1024,
  preparedBytes: 1536 * 1024,
  pixels: 24_000_000,
  edge: 2400,
  hotspots: 80,
  candidates: 200,
  uploadsPerDay: 10,
} as const;

export function selectionShelfEnabled(environment = process.env) {
  return environment.CHISAN_SELECTION_SHELF_ENABLED === "true";
}

export const shelfProducerKeySchema = z.string().regex(/^[a-z]{2}:[1-9]\d{0,14}$/);
export const shelfPointSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/),
  producerKey: shelfProducerKeySchema,
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
    label: z.string().max(120),
    x: z.number().finite().min(0).max(1),
    y: z.number().finite().min(0).max(1),
  }).strict()).max(SHELF_LIMITS.hotspots),
}).strict();
export type ShelfDetection = z.infer<typeof shelfDetectionSchema>;
export type ShelfCandidate = { key: string; name: string; city: string; products: string[] };
export type PublicSelectionShelf = {
  id: string;
  imageSrc: string;
  width: number;
  height: number;
  updatedOn: string;
  points: ShelfPoint[];
};
export const shelfReviewSchema = z.object({
  id: z.uuid(),
  version: z.number().int().positive(),
  action: z.enum(["admit", "save", "publish", "reject", "analyze"]),
  points: shelfPointsSchema,
  note: z.string().trim().max(600),
}).strict();

export class ShelfError extends Error {
  constructor(readonly code: "access" | "missing" | "changed" | "selection" | "quota" | "invalid") {
    super(code);
  }
}

export const shelfStatusLabels: Record<string, string> = {
  received: "Pendiente de admisión por Chisan",
  queued: "Admitida · pendiente de análisis",
  processing: "Identificando productos",
  review: "En revisión por Chisan",
  published: "Publicada",
  rejected: "Necesita otra foto",
  superseded: "Sustituida",
};

export function shelfImageUrl(id: string) { return `/api/selection-shelf/${id}/image`; }

export function shelfSourceMessageKey(channel: string, messageId?: string) {
  if (!/^[a-z][a-z0-9_-]{0,31}$/.test(channel) || (messageId !== undefined && (!messageId.length || messageId.length > 200))) throw new ShelfError("invalid");
  return messageId === undefined ? undefined : `${channel}:${messageId}`;
}
