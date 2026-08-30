"use client";

import Link from "next/link";

import { MANUAL_AREA_SELECTION_HREF } from "@/lib/catalog-navigation";
import type { Locale } from "@/lib/i18n/locales";
import {
  buildLocationAreaHref,
  findEnabledLocationArea,
  type LocationOnboardingArea,
} from "@/lib/location/location-onboarding";
import {
  forgetSavedLocationArea,
  useLocationOnboardingState,
} from "@/lib/location/saved-location-area";

type SavedCatalogAreaProps = {
  areas: readonly LocationOnboardingArea[];
  explicitLocale: Locale | null;
  browserLocales: readonly Locale[];
};

/**
 * Presents the browser-held catalog area preference. The value never reaches
 * the account database, so this section reads and writes local storage only.
 */
export function SavedCatalogArea({
  areas,
  explicitLocale,
  browserLocales,
}: SavedCatalogAreaProps) {
  const stored = useLocationOnboardingState();
  const savedArea =
    stored?.onboarding === "resolved" && stored.area
      ? findEnabledLocationArea(stored.area, areas)
      : null;

  if (!savedArea) {
    return (
      <div className="account-callout">
        <strong>No saved area in this browser</strong>
        <p>
          The home page asks for a catalog area the first time. Choose one manually,
          or let the browser resolve it from your device location.
        </p>
        <div className="account-inline-actions">
          <Link
            href={MANUAL_AREA_SELECTION_HREF}
            className="account-button account-button--secondary"
          >
            Choose an area
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-callout">
      <strong>Saved area: {savedArea.label}</strong>
      <p>
        The home page now opens {savedArea.label} directly. Forgetting it here does
        not change your language, favorites or claims.
      </p>
      <div className="account-inline-actions">
        <Link
          href={buildLocationAreaHref(savedArea, explicitLocale, browserLocales)}
          className="account-button account-button--secondary"
        >
          Open {savedArea.label}
        </Link>
        <Link
          href={MANUAL_AREA_SELECTION_HREF}
          className="account-button account-button--secondary"
          onClick={forgetSavedLocationArea}
        >
          Choose a different area
        </Link>
        <button
          type="button"
          className="account-button account-button--secondary"
          onClick={forgetSavedLocationArea}
        >
          Forget saved area
        </button>
      </div>
    </div>
  );
}
