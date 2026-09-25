import { shelfProducerKeySchema, type ShelfPoint } from "./policy";
import { z } from "zod";

// Account proposal, never an independently editable published event.
export const eventRequestSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(600),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  venueName: z.string().trim().min(1).max(160),
  municipality: z.string().trim().min(1).max(160),
  organizerName: z.string().trim().min(1).max(160),
  sourceUrl: z.url().refine((value) => new URL(value).protocol === "https:"),
  category: z.enum(["Vinos", "Quesos", "Alimentos", "Bebidas"]),
  timeZone: z.enum(["Europe/Madrid", "Atlantic/Canary"]),
}).strict().refine((value) => value.startDate <= value.endDate, "Invalid event dates");
export type EventRequest = z.infer<typeof eventRequestSchema>;
export type StoredEventRequest = { details: EventRequest; points: ShelfPoint[]; submittedAt: string; version: number };
export const eventSubmissionSchema = z.object({ id: z.uuid(), version: z.number().int().positive(), details: eventRequestSchema, producerKeys: z.array(shelfProducerKeySchema).min(1).max(80) }).strict();
export const eventExportSchema = z.object({
  id: z.uuid(), version: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}$/),
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
}).strict();
