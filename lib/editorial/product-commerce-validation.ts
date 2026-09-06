import type { ProducerContent } from "../catalog/content-schema";

/** Publication checks, separate from draft schemas which allow undated edits. */
export function validateProductCommerce(
  content: ProducerContent,
  today = new Date().toISOString().slice(0, 10),
) {
  for (const product of content.products) {
    if ((product.price || product.purchase_url) && !product.updated_on)
      throw new Error(
        `Product ${product.id}: price/purchase link requires updated_on before publication.`,
      );
    if (product.updated_on && product.updated_on > today)
      throw new Error(
        `Product ${product.id}: updated_on cannot be in the future.`,
      );
  }
}
