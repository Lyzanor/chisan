import type { ProducerIdentity } from "@/lib/csv-catalog";

export const PRODUCER_SELECTION_MIN_ZOOM = 2;

export type ProducerSelectionItem = ProducerIdentity & {
  key: string;
  area: string;
  slug: string;
  name: string;
  city: string;
  category: string;
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
};

export type ProducerMapMarker = Pick<
  ProducerSelectionItem,
  | "key"
  | "href"
  | "name"
  | "city"
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
