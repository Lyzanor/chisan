export const NEARBY_PRODUCER_FOCUS_LIMIT = 12;
export const NEARBY_PRODUCER_FOCUS_MINIMUM = 4;
export const NEARBY_PRODUCER_FOCUS_RADIUS_KM = 15;

type NearbyPosition = {
  latitude: number;
  longitude: number;
};

type NearbyProducerPoint = NearbyPosition & {
  key: string;
};

const EARTH_RADIUS_KM = 6_371;

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function producerDistanceKm(
  position: NearbyPosition,
  point: NearbyPosition,
): number {
  const latitudeDelta = degreesToRadians(point.latitude - position.latitude);
  const longitudeDelta = degreesToRadians(point.longitude - position.longitude);
  const startLatitude = degreesToRadians(position.latitude);
  const endLatitude = degreesToRadians(point.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
}

export function selectNearbyProducerKeys(
  position: NearbyPosition,
  points: readonly NearbyProducerPoint[],
): string[] {
  const ranked = points
    .map((point) => ({
      key: point.key,
      distance: producerDistanceKm(position, point),
    }))
    .sort(
      (left, right) =>
        left.distance - right.distance || left.key.localeCompare(right.key),
    );
  const withinRadius = ranked.filter(
    ({ distance }) => distance <= NEARBY_PRODUCER_FOCUS_RADIUS_KM,
  );
  const selected =
    withinRadius.length >= NEARBY_PRODUCER_FOCUS_MINIMUM
      ? withinRadius
      : ranked.slice(0, NEARBY_PRODUCER_FOCUS_MINIMUM);

  return selected
    .slice(0, NEARBY_PRODUCER_FOCUS_LIMIT)
    .map(({ key }) => key);
}
