import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { LOCATION_REQUEST_OPTIONS } from "../../../lib/location/location-onboarding";
import type { DeviceLocation } from "./location";

const AREA_KEY = "chisan.location.v1";
export const areaStorage = {
  async read() {
    try { return Platform.OS === "web" ? localStorage.getItem(AREA_KEY) : await SecureStore.getItemAsync(AREA_KEY); }
    catch { return null; }
  },
  async write(value: string | null) {
    try {
      if (Platform.OS === "web") {
        if (value === null) localStorage.removeItem(AREA_KEY); else localStorage.setItem(AREA_KEY, value);
      } else if (value === null) await SecureStore.deleteItemAsync(AREA_KEY);
      else await SecureStore.setItemAsync(AREA_KEY, value);
    } catch { /* Device storage is optional; this session remains usable. */ }
  },
};

export const deviceLocation: DeviceLocation = {
  async requestPermission() {
    const current = await Location.getForegroundPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    return (await Location.requestForegroundPermissionsAsync()).granted;
  },
  async readPosition() {
    const cached = await Location.getLastKnownPositionAsync({ maxAge: LOCATION_REQUEST_OPTIONS.maximumAge });
    const point = cached ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: point.coords.latitude, longitude: point.coords.longitude, accuracyMeters: point.coords.accuracy ?? Number.POSITIVE_INFINITY };
  },
};
