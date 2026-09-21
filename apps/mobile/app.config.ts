import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Chisan",
  slug: "chisan",
  version: "0.1.0",
  scheme: "chisan",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "../../design/brand/assets/chisan-icon-apple.png",
  ios: { bundleIdentifier: "app.chisan.mobile", supportsTablet: true },
  android: {
    package: "app.chisan.mobile",
    blockedPermissions: ["android.permission.ACCESS_BACKGROUND_LOCATION"],
  },
  plugins: [
    "expo-secure-store",
    "expo-web-browser",
    "@clerk/expo",
    ["expo-location", {
      locationWhenInUsePermission: "Chisan usa tu ubicación para mostrarte productores de tu zona. También puedes elegirla manualmente.",
      isIosBackgroundLocationEnabled: false,
      isAndroidBackgroundLocationEnabled: false,
      isAndroidForegroundServiceEnabled: false,
    }],
  ],
  web: { bundler: "metro" },
};

export default config;
