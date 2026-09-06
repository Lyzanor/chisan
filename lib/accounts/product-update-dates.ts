import { PRODUCT_FACT_FIELDS } from "../catalog/product-commerce";
import type { ProducerContent } from "../catalog/content-schema";

type Product = ProducerContent["products"][number];
function facts(product: Product, content: ProducerContent) {
  return JSON.stringify([
    ...PRODUCT_FACT_FIELDS.map((key) => product[key]),
    product.media_ids.map((id) =>
      content.gallery.find((item) => item.id === id),
    ),
    product.link_ids.map((id) => content.links.find((item) => item.id === id)),
  ]);
}

/** The client cannot backdate or refresh records. Drafts retain published dates;
 * only sending actual product changes stamps a new UTC day. Order is separate. */
export function dateSubmittedProducts(
  base: ProducerContent,
  requested: ProducerContent,
  submittedOn?: string,
): Product[] {
  return requested.products.map((product) => {
    const previous = base.products.find((item) => item.id === product.id);
    const changed =
      !previous || facts(previous, base) !== facts(product, requested);
    const updatedOn =
      submittedOn && changed ? submittedOn : previous?.updated_on;
    const next = { ...product };
    delete next.updated_on;
    return updatedOn ? { ...next, updated_on: updatedOn } : next;
  });
}
