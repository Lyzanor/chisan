import { createHash } from "node:crypto";
import { z } from "zod";

import {
  producerContentSchema,
  type ProducerContent,
} from "../catalog/content-schema";

// Only products are owner-editable. Media, links and translations are copied from
// the reviewed package on the server, never accepted as an owner-supplied overlay.
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

export const producerContentChangeSchema = z.strictObject({
  version: z.literal(1),
  base: producerContentSchema,
  products: producerContentSchema.shape.products,
  baseHash: z.string().regex(/^[a-f0-9]{64}$/),
  requestedHash: z.string().regex(/^[a-f0-9]{64}$/),
});
export type ProducerContentChange = z.infer<typeof producerContentChangeSchema>;

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
  const requested = replaceProducerProducts(change.base, change.products);
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
