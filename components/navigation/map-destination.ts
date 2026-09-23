"use client";

import { useEffect, useSyncExternalStore } from "react";

import { useLocationOnboardingState } from "@/lib/location/saved-location-area";

const LAST_MAP_STORAGE_KEY = "chisan:last-map-url";
const LAST_MAP_EVENT = "chisan:last-map-changed";
const DEFAULT_MAP_HREF = "/es/madrid";

function getLastMapSnapshot(): string {
  try {
    return sessionStorage.getItem(LAST_MAP_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function getLastMapServerSnapshot(): string {
  return "";
}

function subscribeToLastMap(callback: () => void): () => void {
  window.addEventListener(LAST_MAP_EVENT, callback);
  return () => window.removeEventListener(LAST_MAP_EVENT, callback);
}

/** Only country and area catalog pages render a map. */
export function isMapPathname(pathname: string): boolean {
  return pathname === "/es" || (/^\/es\/[^/]+\/?$/.test(pathname) && !pathname.startsWith("/es/guias"));
}

/** Remembers, for this tab, the map page a navigation link returns to. */
export function useRememberMapPathname(pathname: string): void {
  useEffect(() => {
    if (!isMapPathname(pathname)) return;

    try {
      sessionStorage.setItem(LAST_MAP_STORAGE_KEY, pathname);
      window.dispatchEvent(new Event(LAST_MAP_EVENT));
    } catch {
      // Storage might be unavailable
    }
  }, [pathname]);
}

/** The current map, else the last one visited in this tab, the saved area or Madrid. */
export function useMapHref(pathname: string): string {
  const savedState = useLocationOnboardingState();
  const storedLastMap = useSyncExternalStore(
    subscribeToLastMap,
    getLastMapSnapshot,
    getLastMapServerSnapshot,
  );

  if (isMapPathname(pathname)) return pathname;
  const producerArea = /^\/es\/([^/]+)\/[^/]+\/?$/.exec(pathname);
  if (producerArea) return `/es/${producerArea[1]}`;
  if (isMapPathname(storedLastMap)) return storedLastMap;
  return savedState?.onboarding === "resolved" && savedState.area
    ? `/${savedState.area.country}/${savedState.area.area}`
    : DEFAULT_MAP_HREF;
}
