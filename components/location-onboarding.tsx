"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  NavigationArrowIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { MANUAL_AREA_SELECTION_HASH } from "@/lib/catalog-navigation";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import {
  buildLocationAreaHref,
  createCatalogLocationRequest,
  createLocationOnboardingActivation,
  resolveSavedLocationAreaHref,
  type CatalogLocationFailureReason,
  type LocationFetch,
  type LocationOnboardingArea,
} from "@/lib/location/location-onboarding";
import {
  browserLocationStorage,
  dismissLocationOnboarding,
  useLocationOnboardingState,
} from "@/lib/location/saved-location-area";

export type LocationOnboardingProps = {
  areas: readonly LocationOnboardingArea[];
  messages: Messages["locationOnboarding"];
  explicitLocale: Locale | null;
  browserLocales: readonly Locale[];
};

type RequestState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "resolved"; areaLabel: string }
  | { status: "failed"; reason: CatalogLocationFailureReason };

function subscribeToManualSelectionRequest(onStoreChange: () => void): () => void {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
}

function readManualSelectionRequest(): boolean {
  return window.location.hash === MANUAL_AREA_SELECTION_HASH;
}

function readServerManualSelectionRequest(): false {
  return false;
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
}: LocationOnboardingProps) {
  const router = useRouter();
  const [request, setRequest] = useState<RequestState>({ status: "idle" });
  const requestGenerationRef = useRef(0);
  const stored = useLocationOnboardingState();
  const manualSelectionRequested = useSyncExternalStore(
    subscribeToManualSelectionRequest,
    readManualSelectionRequest,
    readServerManualSelectionRequest,
  );

  // A saved area resumes on its own; only an explicit manual request keeps the
  // neutral country listing on screen. Forgetting it belongs to the profile.
  const resumeHref = resolveSavedLocationAreaHref({
    stored,
    areas,
    explicitLocale,
    browserLocales,
    manualSelectionRequested,
  });
  const isLocating = request.status === "locating";
  const isPending = isLocating || request.status === "resolved";

  useEffect(() => {
    if (resumeHref) router.replace(resumeHref);
  }, [resumeHref, router]);

  useEffect(
    () => () => {
      requestGenerationRef.current += 1;
    },
    [],
  );

  async function handleUseLocation() {
    if (isPending) return;
    const requestGeneration = requestGenerationRef.current + 1;
    requestGenerationRef.current = requestGeneration;
    setRequest({ status: "locating" });

    const locationLookup = createCatalogLocationRequest({
      geolocation:
        typeof navigator !== "undefined" && navigator.geolocation
          ? navigator.geolocation
          : null,
      fetcher: window.fetch.bind(window) as LocationFetch,
    });
    const activate = createLocationOnboardingActivation({
      lookup: async () => {
        const result = await locationLookup();
        return requestGenerationRef.current === requestGeneration
          ? result
          : { status: "failed", reason: "unavailable" };
      },
      storage: browserLocationStorage(),
      areas,
      explicitLocale,
      browserLocales,
      navigate: (href) => {
        if (requestGenerationRef.current !== requestGeneration) return;
        const destination = areas.find(
          (area) =>
            buildLocationAreaHref(area, explicitLocale, browserLocales) === href,
        );
        setRequest({
          status: "resolved",
          areaLabel: destination?.label ?? "",
        });
        router.push(href);
      },
    });
    const result = await activate();
    if (requestGenerationRef.current !== requestGeneration) return;
    if (result.status === "failed") {
      setRequest({ status: "failed", reason: result.reason });
    }
  }

  function handleChooseManually() {
    requestGenerationRef.current += 1;
    // The manual home entry never discards a resolved preference. Replacing or
    // forgetting that preference is an explicit profile action.
    if (
      stored?.onboarding !== "resolved" &&
      request.status !== "resolved"
    ) {
      dismissLocationOnboarding();
    }
    setRequest({ status: "idle" });
  }

  if (resumeHref) return null;

  const wasDismissed = stored?.onboarding === "dismissed";
  return (
    <section
      className="location-onboarding"
      aria-labelledby="location-onboarding-title"
      data-status={request.status}
    >
      <div className="location-onboarding__copy">
        <h2 id="location-onboarding-title">{messages.title}</h2>
        <p>{wasDismissed ? messages.dismissed : messages.description}</p>
      </div>
      <div className="location-onboarding__actions">
        <button
          className="location-onboarding__primary"
          type="button"
          disabled={isPending}
          aria-busy={isLocating}
          onClick={handleUseLocation}
        >
          {request.status === "locating" ? (
            <CircleNotchIcon
              className="location-onboarding__spinner"
              aria-hidden="true"
              size={18}
            />
          ) : request.status === "resolved" ? (
            <CheckCircleIcon aria-hidden="true" size={18} weight="fill" />
          ) : (
            <NavigationArrowIcon aria-hidden="true" size={18} />
          )}
          <span>
            {request.status === "locating"
              ? messages.locating
              : request.status === "resolved"
                ? request.areaLabel
                : messages.useLocation}
          </span>
        </button>
        <a
          className="location-onboarding__secondary"
          href={MANUAL_AREA_SELECTION_HASH}
          onClick={handleChooseManually}
        >
          {messages.chooseManually}
        </a>
      </div>
      <p
        className="location-onboarding__status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {request.status === "failed"
          ? failureMessage(request.reason, messages.errors)
          : request.status === "locating"
            ? messages.locating
            : request.status === "resolved"
              ? `${messages.title}: ${request.areaLabel}`
            : ""}
      </p>
    </section>
  );
}
