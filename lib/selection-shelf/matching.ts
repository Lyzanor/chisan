import type { ShelfCandidate, ShelfDetection, ShelfObservations } from "./policy";

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}
function producerName(value: string) {
  return normalize(value).replace(/^(?:celler|bodegas?|formatgeria|queseria|granja)\s+/, "");
}

/** Only unambiguous names in the current approved catalog become selectable.
 * No nearest-name guess, invented identity, stock or new catalog product. */
export function matchShelfObservations(observations: ShelfObservations, catalog: ShelfCandidate[]): ShelfDetection {
  return { points: observations.points.map((point) => {
    const name = point.producerName ? normalize(point.producerName) : "";
    const product = point.productName ? normalize(point.productName) : "";
    let matches = name ? catalog.filter((item) => normalize(item.name) === name) : [];
    if (name && !matches.length && producerName(name).length >= 4) {
      matches = catalog.filter((item) => producerName(item.name) === producerName(name));
    }
    if (product && (!name || matches.length > 1)) {
      matches = (name ? matches : catalog).filter((item) => item.products.some((entry) => normalize(entry.name) === product));
    }
    const candidate = matches.length === 1 && point.label.trim() ? matches[0] : undefined;
    const products = candidate?.products.filter((entry) => normalize(entry.name) === product) ?? [];
    return {
      producerKey: candidate?.key ?? null,
      ...(products.length === 1 ? { productId: products[0].id } : {}),
      producerName: point.producerName ?? "", productName: point.productName ?? "",
      candidateKeys: matches.slice(0, 5).map((item) => item.key),
      label: point.label, x: point.x, y: point.y,
    };
  }) };
}
