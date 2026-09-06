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
        <strong>No hay ninguna zona guardada en este navegador</strong>
        <p>
          La portada solicita una zona la primera vez. Elígela manualmente o permite que el navegador la determine a partir de tu ubicación.
        </p>
        <div className="account-inline-actions">
          <Link
            href={MANUAL_AREA_SELECTION_HREF}
            className="account-button account-button--secondary"
          >
            Elegir una zona
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-callout">
      <strong>Zona guardada: {savedArea.label}</strong>
      <p>
        La portada ahora abre {savedArea.label} directamente. Olvidarla aquí no cambia tus favoritos ni tus solicitudes de propiedad.
      </p>
      <div className="account-inline-actions">
        <Link
          href={buildLocationAreaHref(savedArea, explicitLocale, browserLocales)}
          className="account-button account-button--secondary"
        >
          Abrir {savedArea.label}
        </Link>
        <Link
          href={MANUAL_AREA_SELECTION_HREF}
          className="account-button account-button--secondary"
          onClick={forgetSavedLocationArea}
        >
          Elegir otra zona
        </Link>
        <button
          type="button"
          className="account-button account-button--secondary"
          onClick={forgetSavedLocationArea}
        >
          Olvidar zona guardada
        </button>
      </div>
    </div>
  );
}
