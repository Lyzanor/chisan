import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Chisan",
  slug: "chisan",
  version: "0.1.1",
  scheme: "chisan",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "../../design/brand/assets/chisan-icon-apple.png",
  ios: { bundleIdentifier: "app.chisan.mobile", buildNumber: "2", supportsTablet: true },
  android: {
    package: "app.chisan.mobile",
    versionCode: 2,
    blockedPermissions: ["android.permission.ACCESS_BACKGROUND_LOCATION"],
  },
  plugins: [
    ["expo-location", {
      locationWhenInUsePermission: "Chisan usa tu ubicación para mostrarte productores de tu zona. También puedes elegirla manualmente.",
      isIosBackgroundLocationEnabled: false,
      isAndroidBackgroundLocationEnabled: false,
      isAndroidForegroundServiceEnabled: false,
    }],
  ],
};

export default config;
