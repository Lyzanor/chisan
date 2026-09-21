import { LOCATION_REQUEST_OPTIONS, resolvePositionToCatalogArea } from "../../../lib/location/location-onboarding";
import type { CatalogPosition } from "../../../lib/location/resolve-catalog-area";
import { fetchJson, type MobileArea } from "./catalog";

export type DeviceLocation = {
  requestPermission(): Promise<boolean>;
  readPosition(): Promise<CatalogPosition>;
};

export async function locateArea(device: DeviceLocation, origin: string, areas: MobileArea[]): Promise<MobileArea | null> {
  if (!(await device.requestPermission())) return null;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const position = await Promise.race([
      device.readPosition(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Location timed out.")), LOCATION_REQUEST_OPTIONS.timeout);
      }),
    ]);
    const result = await resolvePositionToCatalogArea(position, async path => ({
      ok: true, json: () => fetchJson(origin, path),
    }));
    if (result.status !== "resolved") return null;
    return areas.find(area => area.country === result.country && area.area === result.area) ?? null;
  } finally { clearTimeout(timeout); }
}
