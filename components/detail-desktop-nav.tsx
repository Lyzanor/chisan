"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { buildCatalogHref, type CatalogNavigationScope } from "@/lib/catalog-navigation";
import type { CategoryPresentation } from "@/lib/i18n/categories";

type DetailDesktopNavProps = {
  categories: CategoryPresentation[];
  scope: CatalogNavigationScope;
  area: string;
  messages: {
    navigation: string;
    map: string;
    categories: string;
    allCategories: string;
    information: string;
  };
};

export function DetailDesktopNav({
  categories,
  scope,
  area,
  messages,
}: DetailDesktopNavProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, close]);

  return (
    <nav ref={rootRef} className="detail-desktop-nav" aria-label={messages.navigation}>
      <Link href={buildCatalogHref({ scope, area })} className="detail-desktop-nav__home">
        {messages.map}
      </Link>
      <div className="nav-dropdown">
        <button
          type="button"
          className="nav-dropdown__trigger"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls="menu-detail-categories"
          id="btn-detail-categories"
          onClick={() => setOpen((v) => !v)}
        >
          {messages.categories}
          <span className="nav-dropdown__chevron" aria-hidden="true">
            ▾
          </span>
        </button>
        {open ? (
          <div
            id="menu-detail-categories"
            role="menu"
            aria-labelledby="btn-detail-categories"
            className="nav-dropdown__panel"
          >
            <Link
              href={buildCatalogHref({ scope, area })}
              role="menuitem"
              className="nav-dropdown__item"
              onClick={close}
            >
              <span className="nav-dropdown__emoji" aria-hidden="true">
                🌍
              </span>
              {messages.allCategories}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.token}
                href={buildCatalogHref({ scope, area, category: category.token })}
                role="menuitem"
                className="nav-dropdown__item"
                onClick={close}
              >
                <span className="nav-dropdown__emoji" aria-hidden="true">
                  {category.icon}
                </span>
                {category.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      <a href="#detail-info" className="detail-desktop-nav__anchor">
        {messages.information}
      </a>
    </nav>
  );
}
