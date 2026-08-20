"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { buildCatalogHref } from "@/lib/catalog-navigation";
import { getCategoryIcon } from "@/lib/get-category-icon";

type DetailDesktopNavProps = {
  categories: string[];
  country: string;
  area: string;
};

export function DetailDesktopNav({ categories, country, area }: DetailDesktopNavProps) {
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
    <nav ref={rootRef} className="detail-desktop-nav" aria-label="Navigation">
      <Link href={buildCatalogHref({ country, area })} className="detail-desktop-nav__home">
        Map
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
          Categories
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
              href={buildCatalogHref({ country, area })}
              role="menuitem"
              className="nav-dropdown__item"
              onClick={close}
            >
              <span className="nav-dropdown__emoji" aria-hidden="true">
                🌍
              </span>
              Tots
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={buildCatalogHref({ country, area, category: cat })}
                role="menuitem"
                className="nav-dropdown__item"
                onClick={close}
              >
                <span className="nav-dropdown__emoji" aria-hidden="true">
                  {getCategoryIcon(cat)}
                </span>
                {cat}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      <a href="#detail-info" className="detail-desktop-nav__anchor">
        Información
      </a>
    </nav>
  );
}
