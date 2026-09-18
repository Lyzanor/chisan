"use client";

import { useSyncExternalStore } from "react";
import { LOCATION_REQUEST_OPTIONS } from "./location-onboarding";

export type VisitorPosition = Readonly<{
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}>;

let currentVisitorPosition: VisitorPosition | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getVisitorPosition(): VisitorPosition | null {
  return currentVisitorPosition;
}

export function setVisitorPosition(
  position: VisitorPosition | null,
): void {
  if (
    currentVisitorPosition?.latitude === position?.latitude &&
    currentVisitorPosition?.longitude === position?.longitude &&
    currentVisitorPosition?.accuracyMeters === position?.accuracyMeters
  ) {
    return;
  }

  currentVisitorPosition = position;
  notify();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot(): VisitorPosition | null {
  return currentVisitorPosition;
}

function getServerSnapshot(): null {
  return null;
}

/**
 * Reactive hook for components rendering maps or nearby distances.
 * Coords remain exclusively in volatile RAM and are never persisted to disk or URL.
 */
export function useVisitorPosition(): VisitorPosition | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Checks if the browser's Permissions API currently reports geolocation as 'granted'.
 */
export async function checkVisitorLocationPermission(): Promise<PermissionState | null> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return null;
  }

  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state;
  } catch {
    return null;
  }
}

/**
 * Requests the visitor's current coordinates using the standard normal-accuracy options,
 * updating the shared in-memory position store on success.
 */
export async function requestVisitorPosition(
  options: PositionOptions = LOCATION_REQUEST_OPTIONS,
): Promise<VisitorPosition | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    try {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          if (
            Number.isFinite(coords.latitude) &&
            coords.latitude >= -90 &&
            coords.latitude <= 90 &&
            Number.isFinite(coords.longitude) &&
            coords.longitude >= -180 &&
            coords.longitude <= 180
          ) {
            const position: VisitorPosition = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              accuracyMeters:
                Number.isFinite(coords.accuracy) && coords.accuracy > 0
                  ? coords.accuracy
                  : undefined,
            };
            setVisitorPosition(position);
            resolve(position);
            return;
          }
          resolve(null);
        },
        () => {
          resolve(null);
        },
        options,
      );
    } catch {
      resolve(null);
    }
  });
}
