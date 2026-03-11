"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* Material-style outline icons (24x24) */
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

function CategoryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="md-icon md-icon--item">
      <path fill="currentColor" d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" />
    </svg>
  );
}

function TotsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="md-icon md-icon--item">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function buildSearchHref(municipality: string, category: string): string {
  const params = new URLSearchParams();
  if (municipality) params.set("municipio", municipality);
  if (category) params.set("categoria", category);
  const q = params.toString();
  return q ? `/?${q}` : "/";
}

type MobileAppBarProps = {
  categories: string[];
  currentCategory: string;
  municipality: string;
};

export function MobileAppBar({ categories, currentCategory, municipality }: MobileAppBarProps) {
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
                <CategoryIcon />
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
                href={buildSearchHref(municipality, "")}
                className={`md-drawer__item ${!currentCategory ? "is-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="md-drawer__item-icon">
                  <TotsIcon />
                </span>
                Tots
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={buildSearchHref(municipality, cat)}
                  className={`md-drawer__item ${currentCategory === cat ? "is-active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="md-drawer__item-icon">
                    <CategoryIcon />
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
