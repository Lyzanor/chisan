import { z } from "zod";

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = z.iso.date();
const identity = z.strictObject({
  country: z.literal("es"),
  producerId: z.number().int().positive(),
});

const prose = z.strictObject({
  type: z.literal("prose"),
  id: slug,
  title: text,
  markdown: text,
});

const selection = z.strictObject({
  type: z.literal("producers"),
  id: slug,
  title: text,
  introduction: text,
  showMap: z.boolean().default(false),
  items: z.array(identity.extend({ focus: text })).min(1),
});

export const guideSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    slug,
    locale: z.literal("es"),
    country: z.literal("es"),
    status: z.enum(["draft", "published"]),
    topic: z.enum([
      "Quesos",
      "Vinos",
      "Miel",
      "Aceite",
      "Despensa",
      "Territorios",
    ]),
    title: text,
    description: text,
    introduction: text,
    publishedAt: date,
    updatedAt: date,
    selectionCriteria: text,
    sections: z.array(z.discriminatedUnion("type", [prose, selection])).min(1),
    sources: z
      .array(
        z.strictObject({
          id: slug,
          title: text,
          url: z
            .url()
            .refine(
              (url) => new URL(url).protocol === "https:",
              "Use an HTTPS source",
            ),
          checkedAt: date,
        }),
      )
      .min(1),
    related: z.array(slug).default([]),
  })
  .superRefine((guide, context) => {
    const issue = (message: string) =>
      context.addIssue({ code: "custom", message });
    if (guide.updatedAt < guide.publishedAt)
      issue("updatedAt precedes publishedAt");
    const ids = new Set(["criterio-editorial", "fuentes", "seguir-leyendo"]);
    const sources = new Set<string>();
    for (const source of guide.sources) {
      if (sources.has(source.id)) issue(`Duplicate source: ${source.id}`);
      sources.add(source.id);
    }
    const producers = new Set<string>();
    for (const section of guide.sections) {
      if (ids.has(section.id))
        issue(`Duplicate or reserved section: ${section.id}`);
      ids.add(section.id);
      if (section.type === "producers") {
        for (const item of section.items) {
          const key = `${item.country}:${item.producerId}`;
          if (producers.has(key)) issue(`Repeated producer: ${key}`);
          producers.add(key);
        }
      }
    }
    if (
      new Set(guide.related).size !== guide.related.length ||
      guide.related.includes(guide.slug)
    ) {
      issue("Related guides must be unique and cannot reference themselves");
    }
  });

export type Guide = z.infer<typeof guideSchema>;
export type GuideSection = Guide["sections"][number];
export type GuideSelection = Extract<GuideSection, { type: "producers" }>;
