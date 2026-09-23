import { z } from "zod";

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = z.iso.date();
const httpsUrl = z.url().refine((url) => new URL(url).protocol === "https:", "Use an HTTPS URL");
const identity = z.strictObject({ country: z.literal("es"), producerId: z.number().int().positive() });

export const eventSchema = z.strictObject({
  schemaVersion: z.literal(1),
  slug,
  country: z.literal("es"),
  locale: z.literal("es"),
  status: z.enum(["draft", "published"]),
  featuredInDiscover: z.boolean(),
  title: text,
  description: text,
  category: z.enum(["Vinos", "Quesos", "Alimentos", "Bebidas"]),
  startDate: date,
  endDate: date,
  timeZone: z.enum(["Europe/Madrid", "Atlantic/Canary"]),
  venue: z.strictObject({
    name: text,
    municipality: text,
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
  }),
  organizerUrl: httpsUrl,
  organizerName: text,
  editorialNote: text,
  exhibitors: z.array(identity.extend({ stand: text.optional() })).min(1),
  plan: z.strictObject({
    src: text.regex(/^\/editorial\/events\/[a-z0-9-]+\.(?:webp|png|jpg)$/),
    alt: text,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    credit: text,
    sourceUrl: httpsUrl,
    rights: text,
    checkedAt: date,
    points: z.array(z.strictObject({
      id: slug,
      producerKey: text.regex(/^es:[1-9]\d*$/),
      marker: text,
      label: text,
      x: z.number().finite().min(0).max(1),
      y: z.number().finite().min(0).max(1),
    })).max(80),
  }).optional(),
  sources: z.array(z.strictObject({ title: text, url: httpsUrl, checkedAt: date })).min(1),
  publishedAt: date.optional(),
  updatedAt: date,
}).superRefine((event, context) => {
  const issue = (message: string) => context.addIssue({ code: "custom", message });
  if (event.startDate > event.endDate) issue("startDate follows endDate");
  if (event.venue.latitude === 0 && event.venue.longitude === 0) issue("Venue coordinates cannot be 0,0");
  if (event.status === "published" && !event.publishedAt) issue("Published events need publishedAt");
  if (event.publishedAt && event.updatedAt < event.publishedAt) issue("updatedAt precedes publishedAt");
  const keys = event.exhibitors.map(({ country, producerId }) => `${country}:${producerId}`);
  if (new Set(keys).size !== keys.length) issue("Duplicate exhibitor");
  if (event.plan) {
    const ids = event.plan.points.map((point) => point.id);
    if (new Set(ids).size !== ids.length) issue("Duplicate plan point");
    for (const point of event.plan.points) {
      if (!keys.includes(point.producerKey)) issue(`Plan point refers to unlisted exhibitor ${point.producerKey}`);
    }
  }
});

export type EditorialEvent = z.infer<typeof eventSchema>;
