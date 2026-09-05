import type { ProducerIdentity } from "@/lib/csv-catalog";
export const PRODUCER_SELECTION_MIN_ZOOM = 2;

export type ProducerSelectionItem = ProducerIdentity & {
  key: string;
  area: string;
  slug: string;
  name: string;
  city: string;
  description: string;
  imageSrc: string;
  icon: string;
  categories: string[];
  href: string;
  latitude: number | null;
  longitude: number | null;
};

export type ProducerSelectionPageModel = {
  kind: string;
  canonicalPath: string;
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  items: ProducerSelectionItem[];
  initialFocusKeys: string[];
};

export type ProducerSelectionExplorerModel = Pick<
  ProducerSelectionPageModel,
  "canonicalPath" | "items" | "initialFocusKeys"
>;

export type ProducerMapMarker = Pick<
  ProducerSelectionItem,
  | "key"
  | "href"
  | "name"
  | "city"
  | "icon"
  | "categories"
  | "latitude"
  | "longitude"
> & {
  latitude: number;
  longitude: number;
};

export function producerSelectionItemKey(identity: ProducerIdentity): string {
  return `${identity.country}:${identity.producerId}`;
}

export function buildProducerSelectionHighlightHref(
  canonicalPath: string,
  selectedKey: string,
): string {
  if (!selectedKey) return canonicalPath;

  const params = new URLSearchParams({ highlight: selectedKey });
  return `${canonicalPath}?${params.toString()}`;
}

export function resolveProducerSelectionItem(
  items: readonly ProducerSelectionItem[],
  selectedKey: string,
): ProducerSelectionItem | undefined {
  if (!selectedKey) return undefined;
  return items.find(({ key }) => key === selectedKey);
}

export function hasProducerSelectionCoordinates(
  item: Pick<ProducerSelectionItem, "latitude" | "longitude">,
): item is typeof item & { latitude: number; longitude: number } {
  return (
    item.latitude !== null &&
    item.longitude !== null &&
    Number.isFinite(item.latitude) &&
    Number.isFinite(item.longitude) &&
    Math.abs(item.latitude) <= 90 &&
    Math.abs(item.longitude) <= 180 &&
    !(item.latitude === 0 && item.longitude === 0)
  );
}

export function getProducerSelectionInitialFocusKeys(
  items: readonly ProducerSelectionItem[],
): string[] {
  return items.filter(hasProducerSelectionCoordinates).map(({ key }) => key);
}
