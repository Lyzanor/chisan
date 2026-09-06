import { producerDistanceKm } from "../location/nearby-producer-focus";
import { isValidCoordinates } from "../location/radius-search";

export const SIMILAR_PRODUCERS_LIMIT = 3;
export const SIMILAR_PRODUCERS_MAX_DISTANCE_KM = 100;

export type SimilarProducerCandidate = Readonly<{
  producerId: number;
  slug: string;
  name: string;
  city: string;
  area: string;
  categories: readonly string[];
  imageSrc: string;
  latitude: number | null;
  longitude: number | null;
}>;

export type SimilarNearbyProducer = SimilarProducerCandidate &
  Readonly<{
    distanceKm: number;
    sharedCategory: string;
  }>;

export function selectSimilarNearbyProducers(
  producer: SimilarProducerCandidate,
  candidates: readonly SimilarProducerCandidate[],
  limit = SIMILAR_PRODUCERS_LIMIT,
): SimilarNearbyProducer[] {
  if (!isValidCoordinates(producer) || limit <= 0) {
    return [];
  }

  const categories = new Set(producer.categories);
  const matches: SimilarNearbyProducer[] = [];

  for (const candidate of candidates) {
    if (
      candidate.producerId === producer.producerId ||
      !isValidCoordinates(candidate)
    ) {
      continue;
    }

    const sharedCategory = candidate.categories.find((category) =>
      categories.has(category),
    );
    if (!sharedCategory) {
      continue;
    }

    const distanceKm = producerDistanceKm(producer, candidate);
    if (distanceKm > SIMILAR_PRODUCERS_MAX_DISTANCE_KM) {
      continue;
    }

    matches.push({ ...candidate, distanceKm, sharedCategory });
  }

  return matches
    .sort(
      (left, right) =>
        left.distanceKm - right.distanceKm ||
        left.producerId - right.producerId,
    )
    .slice(0, limit);
}
