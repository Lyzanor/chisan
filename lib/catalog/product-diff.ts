import { PRODUCT_FACT_FIELDS } from "./product-commerce";

import type { ProducerContent } from "./content-schema";

type Product = ProducerContent["products"][number];
export function productChanges(before: Product[], after: Product[]) {
  const ids = [
    ...new Set([
      ...after.map((item) => item.id),
      ...before.map((item) => item.id),
    ]),
  ];
  return ids.flatMap((id) => {
    const oldIndex = before.findIndex((item) => item.id === id);
    const newIndex = after.findIndex((item) => item.id === id);
    const previous = before[oldIndex] ?? null;
    const requested = after[newIndex] ?? null;
    const changed =
      previous &&
      requested &&
      (
        [...PRODUCT_FACT_FIELDS, "updated_on"] as const
      ).some(
        (key) =>
          JSON.stringify(previous[key]) !== JSON.stringify(requested[key]),
      );
    const kind = !previous
      ? "added"
      : !requested
        ? "removed"
        : changed
          ? "updated"
          : oldIndex !== newIndex
            ? "reordered"
            : null;
    return kind
      ? [
          {
            id,
            kind,
            previous,
            requested,
            beforePosition: oldIndex + 1,
            position: newIndex + 1,
          },
        ]
      : [];
  });
}
