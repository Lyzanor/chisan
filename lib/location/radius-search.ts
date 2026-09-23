import { producerDistanceKm } from "./nearby-producer-focus";

export const MAX_SEARCH_RADIUS_KM = 500;
export type RadiusFilter = { latitude: number; longitude: number; radiusKm: number };
type Point = { latitude: number | null; longitude: number | null };

export function isValidCoordinates(point: Point): point is { latitude: number; longitude: number } {
  return point.latitude !== null && point.longitude !== null &&
    Number.isFinite(point.latitude) && Math.abs(point.latitude) <= 90 &&
    Number.isFinite(point.longitude) && Math.abs(point.longitude) <= 180;
}

export function isWithinRadius(point: Point, filter: RadiusFilter): boolean {
  return isValidCoordinates(point) && isValidCoordinates(filter) &&
    Number.isFinite(filter.radiusKm) && filter.radiusKm > 0 &&
    filter.radiusKm <= MAX_SEARCH_RADIUS_KM &&
    producerDistanceKm(filter, point) <= filter.radiusKm;
}
