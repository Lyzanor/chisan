"use client";

import { useSyncExternalStore } from "react";

import {
  LOCATION_ONBOARDING_STORAGE_KEY,
  forgetLocationOnboarding,
  parseLocationOnboardingStorageValue,
  rememberLocationOnboardingDismissal,
  type LocationOnboardingStorageV1,
} from "./location-onboarding";

const LOCATION_STORAGE_CHANGE_EVENT = "chisan:location-onboarding-storage-change";

/**
 * Reads the browser store defensively: a blocked or unavailable local storage
 * must leave catalog navigation usable instead of throwing.
 */
export function browserLocationStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readStorageSnapshot(): string | null {
  try {
    return browserLocationStorage()?.getItem(LOCATION_ONBOARDING_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

function readServerStorageSnapshot(): null {
  return null;
}

function subscribeToStorageChange(onStoreChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LOCATION_ONBOARDING_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCATION_STORAGE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCATION_STORAGE_CHANGE_EVENT, onStoreChange);
  };
}

function notifyStorageChange(): void {
  window.dispatchEvent(new Event(LOCATION_STORAGE_CHANGE_EVENT));
}

/**
 * Shared onboarding state for every surface that presents the stored catalog
 * area preference: the neutral home page and the account profile.
 */
export function useLocationOnboardingState(): LocationOnboardingStorageV1 | null {
  return parseLocationOnboardingStorageValue(
    useSyncExternalStore(
      subscribeToStorageChange,
      readStorageSnapshot,
      readServerStorageSnapshot,
    ),
  );
}

export function dismissLocationOnboarding(): void {
  rememberLocationOnboardingDismissal(browserLocationStorage());
  notifyStorageChange();
}

export function forgetSavedLocationArea(): void {
  forgetLocationOnboarding(browserLocationStorage());
  notifyStorageChange();
}
