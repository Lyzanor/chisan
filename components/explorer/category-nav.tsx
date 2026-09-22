"use client";

import Link from "next/link";
import { MinusIcon, PlusIcon, SquaresFourIcon } from "@phosphor-icons/react";
import type { CategoryPresentation } from "@/lib/i18n/categories";
import { normalizeCatalogSearch } from "@/lib/catalog-search";

export interface CategoryNavProps {
  category: string;
  normalizedCategory: string;
  allCategoriesHref: string;
  baseCategories: CategoryPresentation[];
  otherCategories: CategoryPresentation[];
  showAllCategories: boolean;
  onToggleExpanded: () => void;
  onSelectCategory: (href: string) => void;
  buildCategoryHref: (categoryToken: string) => string;
  labels: {
    categories: string;
    allCategories: string;
    moreCategories: string;
    fewerCategories: string;
  };
}

export function CategoryNav({
  category,
  normalizedCategory,
  allCategoriesHref,
  baseCategories,
  otherCategories,
  showAllCategories,
  onToggleExpanded,
  onSelectCategory,
  buildCategoryHref,
  labels,
}: CategoryNavProps) {
  return (
    <nav className="catalog-simple-categories" aria-label={labels.categories}>
      <div className="catalog-categories-row">
        <Link
          href={allCategoriesHref}
          prefetch={false}
          scroll={false}
          onNavigate={(event) => {
            event.preventDefault();
            onSelectCategory(allCategoriesHref);
          }}
          className={`catalog-chip ${!category ? "is-active" : ""}`}
          aria-current={!category ? "page" : undefined}
          aria-label={labels.allCategories}
        >
          <SquaresFourIcon size={20} aria-hidden="true" />
          <span className="catalog-chip__label">{labels.allCategories}</span>
        </Link>
        {baseCategories.map((categoryPresentation) => {
          const href = buildCategoryHref(categoryPresentation.token);
          const isActive =
            category === categoryPresentation.token ||
            normalizeCatalogSearch(categoryPresentation.token) === normalizedCategory;

          return (
            <Link
              key={categoryPresentation.token}
              href={href}
              prefetch={false}
              scroll={false}
              onNavigate={(event) => {
                event.preventDefault();
                onSelectCategory(href);
              }}
              className={`catalog-chip ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              aria-label={categoryPresentation.label}
            >
              <span aria-hidden="true">{categoryPresentation.icon}</span>
              <span className="catalog-chip__label">{categoryPresentation.label}</span>
            </Link>
          );
        })}
        {otherCategories.length > 0 ? (
          <button
            type="button"
            className="catalog-chip catalog-chip--toggle"
            onClick={onToggleExpanded}
            aria-expanded={showAllCategories}
            aria-label={
              showAllCategories ? labels.fewerCategories : labels.moreCategories
            }
            title={
              showAllCategories ? labels.fewerCategories : labels.moreCategories
            }
          >
            {showAllCategories ? (
              <MinusIcon aria-hidden="true" size={16} />
            ) : (
              <PlusIcon aria-hidden="true" size={16} />
            )}
          </button>
        ) : null}
      </div>
      {otherCategories.length > 0 ? (
        <div
          className="catalog-categories-row catalog-categories-row--secondary"
          data-expanded={showAllCategories || undefined}
          role="group"
          aria-label={labels.moreCategories}
        >
          {otherCategories.map((categoryPresentation) => {
            const href = buildCategoryHref(categoryPresentation.token);
            const isActive =
              category === categoryPresentation.token ||
              normalizeCatalogSearch(categoryPresentation.token) === normalizedCategory;

            return (
              <Link
                key={categoryPresentation.token}
                href={href}
                prefetch={false}
                scroll={false}
                onNavigate={(event) => {
                  event.preventDefault();
                  onSelectCategory(href);
                }}
                className={`catalog-chip ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                aria-label={categoryPresentation.label}
              >
                <span aria-hidden="true">{categoryPresentation.icon}</span>
                <span className="catalog-chip__label">{categoryPresentation.label}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}
