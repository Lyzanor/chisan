"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  MapTrifoldIcon,
  SparkleIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useLocationOnboardingState } from "@/lib/location/saved-location-area";

const LAST_MAP_STORAGE_KEY = "chisan:last-map-url";
const LAST_MAP_EVENT = "chisan:last-map-changed";

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

export function SiteBottomNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const savedState = useLocationOnboardingState();
  const storedLastMap = useSyncExternalStore(
    subscribeToLastMap,
    getLastMapSnapshot,
    getLastMapServerSnapshot,
  );

  const isMapActive =
    (pathname.startsWith("/es/") || pathname === "/es") &&
    !pathname.startsWith("/es/guias");

  const isActividadActive = pathname.startsWith("/actividad");
  const isAccountActive =
    pathname.startsWith("/cuenta") ||
    pathname.startsWith("/acceso") ||
    pathname.startsWith("/registro");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (pathname.startsWith("/es/") || pathname === "/es") {
      try {
        sessionStorage.setItem(LAST_MAP_STORAGE_KEY, pathname);
        window.dispatchEvent(new Event(LAST_MAP_EVENT));
      } catch {
        // Storage might be unavailable
      }
    }
  }, [pathname]);

  const mapTarget = isMapActive
    ? pathname
    : storedLastMap ||
      (savedState?.onboarding === "resolved" && savedState.area
        ? `/${savedState.area.country}/${savedState.area.area}`
        : "/es/madrid");

  return (
    <nav className="site-bottom-nav" aria-label="Navegación principal">
      <Link
        href="/actividad"
        className={`site-bottom-nav__item ${isActividadActive ? "is-active" : ""}`}
        aria-current={isActividadActive ? "page" : undefined}
      >
        <SparkleIcon
          size={22}
          weight={isActividadActive ? "fill" : "regular"}
          aria-hidden="true"
        />
        <span>Actividad</span>
      </Link>

      <Link
        href={mapTarget}
        className={`site-bottom-nav__item ${isMapActive ? "is-active" : ""}`}
        aria-current={isMapActive ? "page" : undefined}
      >
        <MapTrifoldIcon
          size={22}
          weight={isMapActive ? "fill" : "regular"}
          aria-hidden="true"
        />
        <span>Mapa</span>
      </Link>

      <Link
        href="/cuenta"
        className={`site-bottom-nav__item ${isAccountActive ? "is-active" : ""}`}
        aria-current={isAccountActive ? "page" : undefined}
      >
        <UserCircleIcon
          size={22}
          weight={isAccountActive ? "fill" : "regular"}
          aria-hidden="true"
        />
        <span>Mi Cuenta</span>
      </Link>
    </nav>
  );
}
