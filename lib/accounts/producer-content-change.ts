import { createHash } from "node:crypto";
import { z } from "zod";
import {
  PRODUCER_MEDIA_LIMITS,
  preparedMediaSrc,
} from "./producer-media-policy";

import {
  producerContentSchema,
  type ProducerContent,
} from "../catalog/content-schema";

export function serializeProducerContent(content: ProducerContent): string {
  return `${JSON.stringify(producerContentSchema.parse(content), null, 2)}\n`;
}

function ordered(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(ordered);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, ordered(item)]),
    );
  }
  return value;
}

// Semantic revision: JSONB may reorder object keys; array order remains meaningful.
export function hashProducerContent(content: ProducerContent): string {
  return createHash("sha256")
    .update(JSON.stringify(ordered(producerContentSchema.parse(content))))
    .digest("hex");
}

const productChangeV1 = z.strictObject({
  version: z.literal(1),
  base: producerContentSchema,
  products: producerContentSchema.shape.products,
  baseHash: z.string().regex(/^[a-f0-9]{64}$/),
  requestedHash: z.string().regex(/^[a-f0-9]{64}$/),
});
export const preparedMediaReferenceSchema = z.strictObject({
  uploadId: z.uuid(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  width: z.number().int().min(200).max(PRODUCER_MEDIA_LIMITS.edge),
  height: z.number().int().min(200).max(PRODUCER_MEDIA_LIMITS.edge),
});
const mediaChangeV2 = productChangeV1.extend({
  version: z.literal(2),
  gallery: producerContentSchema.shape.gallery,
  uploads: z
    .array(preparedMediaReferenceSchema)
    .max(PRODUCER_MEDIA_LIMITS.images),
});
export const producerContentChangeSchema = z.discriminatedUnion("version", [
  productChangeV1,
  mediaChangeV2,
]);
export type ProducerContentChange = z.infer<typeof producerContentChangeSchema>;

export function replaceProducerMedia(
  base: ProducerContent,
  products: unknown,
  gallery: unknown,
): ProducerContent {
  const nextProducts = producerContentSchema.shape.products.parse(products);
  const nextGallery = producerContentSchema.shape.gallery.parse(gallery);
  const ids = {
    products: new Set(nextProducts.map((p) => p.id)),
    gallery: new Set(nextGallery.map((p) => p.id)),
  };
  return producerContentSchema.parse({
    ...base,
    products: nextProducts,
    gallery: nextGallery,
    translations: base.translations.filter(
      (t) => t.collection === "links" || ids[t.collection].has(t.item_id),
    ),
  });
}

export function proposeProducerMedia(
  base: ProducerContent,
  products: unknown,
  gallery: unknown,
  uploads: unknown,
): ProducerContentChange | null {
  const requested = replaceProducerMedia(base, products, gallery);
  if (
    requested.gallery.length >
    Math.max(PRODUCER_MEDIA_LIMITS.images, base.gallery.length)
  )
    throw new Error("Use up to 20 images in this profile.");
  const baseHash = hashProducerContent(base);
  const requestedHash = hashProducerContent(requested);
  if (baseHash === requestedHash) return null;
  const change = mediaChangeV2.parse({
    version: 2,
    base,
    products: requested.products,
    gallery: requested.gallery,
    uploads,
    baseHash,
    requestedHash,
  });
  assertMediaSources(change);
  return change;
}

/** Every new binary must be an immutable private upload; existing paths/dimensions cannot be forged. */
function assertMediaSources(change: z.infer<typeof mediaChangeV2>) {
  const used = new Set<string>();
  for (const media of change.gallery) {
    const previous = change.base.gallery.find((item) => item.id === media.id);
    if (
      previous &&
      previous.src === media.src &&
      previous.width === media.width &&
      previous.height === media.height
    )
      continue;
    const upload = change.uploads.find(
      (item) =>
        media.src ===
          preparedMediaSrc(
            change.base.country,
            change.base.producer_id,
            item.sha256,
          ) &&
        media.width === item.width &&
        media.height === item.height,
    );
    if (!upload)
      throw new Error(
        "Every new image needs a prepared upload belonging to this producer.",
      );
    used.add(upload.uploadId);
  }
  if (
    used.size !== change.uploads.length ||
    new Set(change.uploads.map((item) => item.sha256)).size !==
      change.uploads.length
  )
    throw new Error(
      "Use each prepared upload exactly once in the proposal manifest.",
    );
}

export function replaceProducerProducts(
  base: ProducerContent,
  products: unknown,
): ProducerContent {
  const parsedProducts = producerContentSchema.shape.products.parse(products);
  const ids = new Set(parsedProducts.map((product) => product.id));
  return producerContentSchema.parse({
    ...base,
    products: parsedProducts,
    translations: base.translations.filter(
      (item) => item.collection !== "products" || ids.has(item.item_id),
    ),
  });
}

export function proposeProducerProducts(
  base: ProducerContent,
  products: unknown,
): ProducerContentChange | null {
  const requested = replaceProducerProducts(base, products);
  const baseHash = hashProducerContent(base);
  const requestedHash = hashProducerContent(requested);
  if (baseHash === requestedHash) return null;
  return {
    version: 1,
    base,
    products: requested.products,
    baseHash,
    requestedHash,
  };
}

export function resolveProducerContentChange(
  value: unknown,
  country: string,
  producerId: number,
) {
  const change = producerContentChangeSchema.parse(value);
  if (
    change.base.country !== country ||
    change.base.producer_id !== producerId
  ) {
    throw new Error("Product changes must belong to this exact producer.");
  }
  const requested =
    change.version === 2
      ? replaceProducerMedia(change.base, change.products, change.gallery)
      : replaceProducerProducts(change.base, change.products);
  if (change.version === 2) assertMediaSources(change);
  if (
    hashProducerContent(change.base) !== change.baseHash ||
    hashProducerContent(requested) !== change.requestedHash ||
    change.baseHash === change.requestedHash
  ) {
    throw new Error(
      "The product proposal does not match its reviewed snapshots.",
    );
  }
  return { change, requested };
}
