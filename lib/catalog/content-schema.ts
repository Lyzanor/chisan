import { createHash } from "node:crypto";
import { z } from "zod";

import { DESCRIPTION_SOURCE_LOCALES } from "../i18n/locale-registry";

// Resource bounds, not editorial quotas. Adjust here when a real use case needs it.
export const PRODUCER_CONTENT_LIMITS = {
  products: 50,
  gallery: 100,
  links: 50,
  bytes: 1_048_576,
} as const;
const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80);
const text = (maximum: number) =>
  z
    .string()
    .max(maximum)
    .refine(
      (value) =>
        !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]|<\/?[a-z][^>]*>/iu.test(
          value,
        ),
      "Use plain public text without HTML or control characters.",
    );
const title = text(160).refine(
  (value) => value.trim().length > 0,
  "A public label is required.",
);
const locale = z.enum(DESCRIPTION_SOURCE_LOCALES);
export const publicContentUrl = z
  .string()
  .max(2048)
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  }, "Use a complete public HTTP(S) URL without credentials.");

export const contentProductSchema = z.strictObject({
  id,
  name: title,
  description: text(2000).default(""),
  locale,
  media_ids: z.array(id).max(20).default([]),
  link_ids: z.array(id).max(20).default([]),
});
export const contentMediaSchema = z.strictObject({
  id,
  src: z
    .string()
    .regex(
      /^\/productores\/[a-z]{2}\/content\/[1-9]\d*\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|jpg|jpeg|png)$/,
    ),
  alt: title,
  caption: text(1000).default(""),
  locale,
  width: z.number().int().min(200).max(10000),
  height: z.number().int().min(200).max(10000),
  credit: text(300).default(""),
});
export const contentLinkSchema = z.strictObject({
  id,
  label: title,
  url: publicContentUrl,
  locale,
});
const translationSchema = z.strictObject({
  collection: z.enum(["products", "gallery", "links"]),
  item_id: id,
  locale,
  source_hash: z.string().regex(/^[a-f0-9]{64}$/),
  values: z.record(z.string(), text(2500)),
});

export const producerContentSchema = z
  .strictObject({
    version: z.literal(1),
    country: z.string().regex(/^[a-z]{2}$/),
    producer_id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    products: z
      .array(contentProductSchema)
      .max(PRODUCER_CONTENT_LIMITS.products),
    gallery: z.array(contentMediaSchema).max(PRODUCER_CONTENT_LIMITS.gallery),
    links: z.array(contentLinkSchema).max(PRODUCER_CONTENT_LIMITS.links),
    translations: z.array(translationSchema).max(2000).default([]),
  })
  .superRefine((content, ctx) => {
    const add = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    for (const collection of ["products", "gallery", "links"] as const) {
      const ids = new Set<string>();
      content[collection].forEach((item, index) => {
        if (ids.has(item.id))
          add(
            [collection, index, "id"],
            "An item ID must be unique within this producer collection.",
          );
        ids.add(item.id);
      });
    }
    const media = new Set(content.gallery.map((item) => item.id));
    const links = new Set(content.links.map((item) => item.id));
    content.products.forEach((product, index) => {
      for (const [field, allowed] of [
        ["media_ids", media],
        ["link_ids", links],
      ] as const) {
        if (new Set(product[field]).size !== product[field].length)
          add(
            ["products", index, field],
            "Repeated references are not allowed.",
          );
        product[field].forEach((key) => {
          if (!allowed.has(key))
            add(["products", index, field], `Unknown related item '${key}'.`);
        });
      }
    });
    const urls = new Set<string>();
    content.links.forEach((link, index) => {
      try {
        const url = new URL(link.url).href;
        if (urls.has(url))
          add(
            ["links", index, "url"],
            "Use one link record for the same destination.",
          );
        urls.add(url);
      } catch {
        /* The URL field reports this error. */
      }
    });
    content.gallery.forEach((item, index) => {
      if (
        !item.src.startsWith(
          `/productores/${content.country}/content/${content.producer_id}/`,
        )
      ) {
        add(
          ["gallery", index, "src"],
          "The asset must belong to this exact producer identity.",
        );
      }
    });
    const variants = new Set<string>();
    content.translations.forEach((variant, index) => {
      const item = content[variant.collection].find(
        (candidate) => candidate.id === variant.item_id,
      );
      if (!item) {
        add(["translations", index], "The translated item no longer exists.");
        return;
      }
      const key = `${variant.collection}/${variant.item_id}/${variant.locale}`;
      if (variants.has(key))
        add(["translations", index], "Duplicate item translation.");
      variants.add(key);
      if (variant.locale === item.locale)
        add(
          ["translations", index],
          "The source already provides this language.",
        );
      const expected = CONTENT_TEXT_FIELDS[variant.collection];
      if (
        Object.keys(variant.values).some(
          (field) => !expected.includes(field),
        ) ||
        expected.some((field) => !(field in variant.values))
      ) {
        add(
          ["translations", index, "values"],
          `Translate exactly: ${expected.join(", ")}.`,
        );
      }
      if (!(variant.values[expected[0]] ?? "").trim())
        add(
          ["translations", index, "values"],
          "The translated label cannot be empty.",
        );
    });
  });

export type ProducerContent = z.infer<typeof producerContentSchema>;
export type ContentCollection = "products" | "gallery" | "links";
export const CONTENT_TEXT_FIELDS: Record<ContentCollection, readonly string[]> =
  {
    products: ["name", "description"],
    gallery: ["alt", "caption"],
    links: ["label"],
  };

export function contentSourceHash(
  collection: ContentCollection,
  item: { locale: string } & object,
): string {
  const source = item as Record<string, unknown>;
  return createHash("sha256")
    .update(
      JSON.stringify([
        source.locale,
        ...CONTENT_TEXT_FIELDS[collection].map((field) =>
          String(source[field] ?? "")
            .replace(/\r\n?/g, "\n")
            .normalize("NFC"),
        ),
      ]),
    )
    .digest("hex");
}

export function emptyProducerContent(
  country: string,
  producerId: number,
): ProducerContent {
  return producerContentSchema.parse({
    version: 1,
    country,
    producer_id: producerId,
    products: [],
    gallery: [],
    links: [],
  });
}

/** Missing/stale reviewed translations preserve explicitly marked source speech. */
export function localizeProducerContent(
  content: ProducerContent,
  requestedLocale: string,
): ProducerContent {
  const localized = { ...content };
  for (const collection of ["products", "gallery", "links"] as const) {
    const items = content[collection].map((item) => {
      if (item.locale === requestedLocale) return item;
      const variant = content.translations.find(
        (entry) =>
          entry.collection === collection &&
          entry.item_id === item.id &&
          entry.locale === requestedLocale &&
          entry.source_hash === contentSourceHash(collection, item),
      );
      return variant
        ? { ...item, ...variant.values, locale: variant.locale }
        : item;
    });
    Object.assign(localized, { [collection]: items });
  }
  return localized;
}

export function hasProducerContent(content: ProducerContent): boolean {
  return Boolean(
    content.products.length || content.gallery.length || content.links.length,
  );
}
