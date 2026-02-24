export const BARCELONA_PROVINCE = {
  minLng: 1.1,
  minLat: 41.15,
  maxLng: 2.95,
  maxLat: 42.45,
} as const;

export const BARCELONA_PROVINCE_BBOX = `${BARCELONA_PROVINCE.minLng},${BARCELONA_PROVINCE.minLat},${BARCELONA_PROVINCE.maxLng},${BARCELONA_PROVINCE.maxLat}`;

export const BARCELONA_PROVINCE_LEAFLET_BOUNDS: [[number, number], [number, number]] = [
  [BARCELONA_PROVINCE.minLat, BARCELONA_PROVINCE.minLng],
  [BARCELONA_PROVINCE.maxLat, BARCELONA_PROVINCE.maxLng],
];

export function isWithinBarcelonaProvince(latitude: number, longitude: number): boolean {
  return (
    latitude >= BARCELONA_PROVINCE.minLat &&
    latitude <= BARCELONA_PROVINCE.maxLat &&
    longitude >= BARCELONA_PROVINCE.minLng &&
    longitude <= BARCELONA_PROVINCE.maxLng
  );
}
