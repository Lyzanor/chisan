"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCategoryIcon } from "@/lib/get-category-icon";

/* Material-style outline icons (24x24) para app bar y botón cerrar */
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="md-icon">
      <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="md-icon">
      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
}

function buildSearchHref(
  municipality: string,
  category: string,
  lat?: string,
  lon?: string,
): string {
  const params = new URLSearchParams();
  if (municipality) params.set("municipio", municipality);
  if (category) params.set("categoria", category);
  if (lat) params.set("lat", lat);
  if (lon) params.set("lon", lon);
  const q = params.toString();
  return q ? `/?${q}` : "/";
}

type MobileAppBarProps = {
  categories: string[];
  currentCategory: string;
  municipality: string;
  lat?: string;
  lon?: string;
};

export function MobileAppBar({
  categories,
  currentCategory,
  municipality,
  lat,
  lon,
}: MobileAppBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="md-app-bar" role="banner">
        <h1 className="md-app-bar__title">Productors Locals</h1>
        <button
          type="button"
          className="md-app-bar__menu-btn"
          aria-label="Obrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </button>
      </header>
      {menuOpen && (
        <>
          <div
            className="md-drawer-backdrop"
            role="presentation"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className="md-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de categories"
          >
            <div className="md-drawer__header">
              <div className="md-drawer__title-row">
                <span className="md-drawer__title-emoji" aria-hidden="true">
                  🧺
                </span>
                <h2 className="md-drawer__title">Categories</h2>
              </div>
              <button
                type="button"
                className="md-drawer__close"
                aria-label="Tancar menú"
                onClick={() => setMenuOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="md-drawer__section" aria-label="Filtrar per categoria">
              <p className="md-drawer__section-title">Filtrar per categoria</p>
              <Link
                href={buildSearchHref(municipality, "", lat, lon)}
                className={`md-drawer__item ${!currentCategory ? "is-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="md-drawer__item-emoji" aria-hidden="true">
                  🌍
                </span>
                Tots
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={buildSearchHref(municipality, cat, lat, lon)}
                  className={`md-drawer__item ${currentCategory === cat ? "is-active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="md-drawer__item-emoji" aria-hidden="true">
                    {getCategoryIcon(cat)}
                  </span>
                  {cat}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
