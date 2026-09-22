"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapTrifoldIcon,
  SparkleIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import {
  isMapPathname,
  useMapHref,
  useRememberMapPathname,
} from "@/components/navigation/map-destination";

export function SiteBottomNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const mapTarget = useMapHref(pathname);
  useRememberMapPathname(pathname);

  const isMapActive = isMapPathname(pathname);

  const isActividadActive = pathname.startsWith("/actividad");
  const isAccountActive =
    pathname.startsWith("/cuenta") ||
    pathname.startsWith("/acceso") ||
    pathname.startsWith("/registro");

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
