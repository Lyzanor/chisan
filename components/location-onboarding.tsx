"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { formatMessage, type Messages } from "@/lib/i18n/messages";
import {
  buildLocationAreaHref,
  LOCATION_ONBOARDING_STORAGE_KEY,
  createCatalogLocationRequest,
  createLocationOnboardingActivation,
  findEnabledLocationArea,
  forgetLocationOnboarding,
  parseLocationOnboardingStorageValue,
  rememberLocationOnboardingDismissal,
  type CatalogLocationFailureReason,
  type LocationFetch,
  type LocationOnboardingArea,
} from "@/lib/location/location-onboarding";

export type LocationOnboardingProps = {
  areas: readonly LocationOnboardingArea[];
  messages: Messages["locationOnboarding"];
  explicitLocale: Locale | null;
  browserLocales: readonly Locale[];
  manualSelectionHref: `#${string}`;
};

type RequestState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "failed"; reason: CatalogLocationFailureReason };

const LOCATION_STORAGE_CHANGE_EVENT = "chisan:location-onboarding-storage-change";

function browserStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readStorageSnapshot(): string | null {
  try {
    return browserStorage()?.getItem(LOCATION_ONBOARDING_STORAGE_KEY) ?? null;
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

function notifyStorageChange() {
  window.dispatchEvent(new Event(LOCATION_STORAGE_CHANGE_EVENT));
}

function failureMessage(
  reason: CatalogLocationFailureReason,
  messages: Messages["locationOnboarding"]["errors"],
): string {
  switch (reason) {
    case "permission-denied":
      return messages.permissionDenied;
    case "timeout":
      return messages.timeout;
    case "unavailable":
      return messages.unavailable;
    case "outside":
      return messages.outside;
    case "ambiguous":
      return messages.ambiguous;
    case "load-failed":
      return messages.loadFailed;
  }
}

export function LocationOnboarding({
  areas,
  messages,
  explicitLocale,
  browserLocales,
  manualSelectionHref,
}: LocationOnboardingProps) {
  const router = useRouter();
  const [request, setRequest] = useState<RequestState>({ status: "idle" });
  const stored = parseLocationOnboardingStorageValue(
    useSyncExternalStore(
      subscribeToStorageChange,
      readStorageSnapshot,
      readServerStorageSnapshot,
    ),
  );

  const savedArea =
    stored?.onboarding === "resolved" && stored.area
      ? findEnabledLocationArea(stored.area, areas)
      : null;
  const isLocating = request.status === "locating";

  async function handleUseLocation() {
    if (isLocating) return;
    setRequest({ status: "locating" });

    const lookup = createCatalogLocationRequest({
      geolocation:
        typeof navigator !== "undefined" && navigator.geolocation
          ? navigator.geolocation
          : null,
      fetcher: window.fetch.bind(window) as LocationFetch,
    });
    const activate = createLocationOnboardingActivation({
      lookup,
      storage: browserStorage(),
      areas,
      explicitLocale,
      browserLocales,
      navigate: (href) => router.push(href),
    });
    const result = await activate();
    if (result.status === "failed") {
      setRequest({ status: "failed", reason: result.reason });
    }
  }

  function handleChooseManually() {
    rememberLocationOnboardingDismissal(browserStorage());
    notifyStorageChange();
    setRequest({ status: "idle" });
  }

  function handleForget() {
    forgetLocationOnboarding(browserStorage());
    notifyStorageChange();
    setRequest({ status: "idle" });
  }

  if (savedArea) {
    const href = buildLocationAreaHref(savedArea, explicitLocale, browserLocales);
    return (
      <section className="location-onboarding" aria-labelledby="saved-location-title">
        <div className="location-onboarding__copy">
          <h2 id="saved-location-title">{messages.savedTitle}</h2>
          <p>{formatMessage(messages.savedDescription, { area: savedArea.label })}</p>
        </div>
        <div className="location-onboarding__actions">
          <Link className="location-onboarding__primary" href={href}>
            {formatMessage(messages.continueInArea, { area: savedArea.label })}
          </Link>
          <a
            className="location-onboarding__secondary"
            href={manualSelectionHref}
            onClick={handleChooseManually}
          >
            {messages.changeArea}
          </a>
          <button
            className="location-onboarding__text-button"
            type="button"
            onClick={handleForget}
          >
            {messages.forgetArea}
          </button>
        </div>
      </section>
    );
  }

  const wasDismissed = stored?.onboarding === "dismissed";
  return (
    <section className="location-onboarding" aria-labelledby="location-onboarding-title">
      <div className="location-onboarding__copy">
        <h2 id="location-onboarding-title">{messages.title}</h2>
        <p>{wasDismissed ? messages.dismissed : messages.description}</p>
      </div>
      <div className="location-onboarding__actions">
        <button
          className="location-onboarding__primary"
          type="button"
          disabled={isLocating}
          onClick={handleUseLocation}
        >
          {isLocating ? messages.locating : messages.useLocation}
        </button>
        <a
          className="location-onboarding__secondary"
          href={manualSelectionHref}
          onClick={handleChooseManually}
        >
          {messages.chooseManually}
        </a>
      </div>
      <p className="location-onboarding__status" aria-live="polite">
        {request.status === "failed"
          ? failureMessage(request.reason, messages.errors)
          : request.status === "locating"
            ? messages.locating
            : ""}
      </p>
    </section>
  );
}
