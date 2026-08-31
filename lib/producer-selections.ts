import type { ProducerIdentity } from "@/lib/csv-catalog";
import {
  normalizeMunicipalityName,
  type PublicProfileBaseLocation,
} from "@/lib/accounts/public-profile-location";

export const PRODUCER_SELECTION_MIN_ZOOM = 2;

export type ProducerSelectionItem = ProducerIdentity & {
  key: string;
  area: string;
  slug: string;
  name: string;
  city: string;
  description: string;
  category: string;
  categories: string[];
  href: string;
  latitude: number | null;
  longitude: number | null;
};

export type ProducerSelectionProximity =
  | "near-me"
  | "in-my-area"
  | "further-away";

export type ProducerSelectionGroups = Record<
  ProducerSelectionProximity,
  ProducerSelectionItem[]
>;

export type ProducerSelectionSection = {
  key: ProducerSelectionProximity;
  title: string;
  summary: string;
  items: ProducerSelectionItem[];
};

export type ProducerSelectionPageModel = {
  kind: string;
  canonicalPath: string;
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  items: ProducerSelectionItem[];
  sections: ProducerSelectionSection[];
  initialFocusKeys: string[];
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

export function groupProducerSelectionItems(
  items: readonly ProducerSelectionItem[],
  baseLocation: PublicProfileBaseLocation,
): ProducerSelectionGroups {
  const groups: ProducerSelectionGroups = {
    "near-me": [],
    "in-my-area": [],
    "further-away": [],
  };
  const baseMunicipality = normalizeMunicipalityName(baseLocation.municipality);

  for (const item of items) {
    const inBaseArea =
      item.country === baseLocation.country && item.area === baseLocation.area;
    if (!inBaseArea) {
      groups["further-away"].push(item);
      continue;
    }

    if (normalizeMunicipalityName(item.city) === baseMunicipality) {
      groups["near-me"].push(item);
    } else {
      groups["in-my-area"].push(item);
    }
  }

  return groups;
}

export function getProducerSelectionInitialFocusKeys(
  groups: ProducerSelectionGroups,
): string[] {
  for (const key of ["near-me", "in-my-area", "further-away"] as const) {
    const mapped = groups[key].filter(
      (item) =>
        item.latitude !== null &&
        item.longitude !== null &&
        !(item.latitude === 0 && item.longitude === 0),
    );
    if (mapped.length) return mapped.map((item) => item.key);
  }

  return [];
}
