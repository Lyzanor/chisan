"use client";

import { memo, type ReactNode, type Ref } from "react";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { CatalogResultsSheet } from "@/components/catalog-results-sheet";
import { ProducerMapRosterRow } from "@/components/map/producer-map-roster-row";
import {
  catalogDescriptionPreview,
  findCatalogSearchMatch,
} from "@/lib/catalog-search";
import type { ExplorerProducer } from "@/lib/catalog/explorer";
import type { CategoryPresentation } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";

export const PRODUCER_RESULTS_ID = "catalog-producer-results";

export function SearchMatch({ text, query }: { text: string; query: string }) {
  const match = findCatalogSearchMatch(text, query);
  if (!match) return <>{text}</>;

  return (
    <>
      {text.slice(0, match.start)}
      <mark className="catalog-search-match">
        {text.slice(match.start, match.end)}
      </mark>
      {text.slice(match.end)}
    </>
  );
}

export const ProducerRosterRowItem = memo(function ProducerRosterRowItem({
  item,
  href,
  query,
  categories,
  active,
  itemRef,
  onPreview,
  onPreviewEnd,
  locale,
}: {
  item: ExplorerProducer;
  locale: Locale;
  href: string;
  query: string;
  categories: ReadonlyMap<string, CategoryPresentation>;
  active: boolean;
  itemRef?: Ref<HTMLLIElement>;
  onPreview: (slug: string, immediate?: boolean) => void;
  onPreviewEnd: (slug: string) => void;
}) {
  const matchingCategories = query
    ? item.categories
        .map((token) => categories.get(token)?.label ?? token)
        .filter((label) => findCatalogSearchMatch(label, query))
        .join(" · ")
    : "";

  return (
    <ProducerMapRosterRow
      item={{ ...item, href }}
      itemRef={itemRef}
      active={active}
      locale={locale}
      onPointerEnter={(event) => {
        const sheetHandle = event.currentTarget
          .closest(".catalog-results-sheet")
          ?.querySelector(".catalog-results-sheet__handle");
        if (
          event.pointerType === "mouse" &&
          !event.buttons &&
          window.matchMedia("(hover: hover)").matches &&
          sheetHandle &&
          !sheetHandle.getClientRects().length
        ) {
          onPreview(item.key);
        }
      }}
      onMouseLeave={() => onPreviewEnd(item.key)}
      onFocus={() => onPreview(item.key, true)}
      onBlur={() => onPreviewEnd(item.key)}
    >
      <strong>
        <SearchMatch text={item.name} query={query} />
      </strong>
      {item.city ? (
        <small className="producer-compact-location">
          <SearchMatch
            text={`${item.city} · ${item.areaLabel}`}
            query={query}
          />
        </small>
      ) : null}
      {matchingCategories ? (
        <small>
          <SearchMatch text={matchingCategories} query={query} />
        </small>
      ) : null}
      {item.description || item.featuredProducts ? (
        <small>
          <SearchMatch
            text={catalogDescriptionPreview(
              query &&
                query
                  .split(/\s+/u)
                  .some((term) =>
                    findCatalogSearchMatch(item.featuredProducts, term),
                  )
                ? item.featuredProducts
                : item.description,
              query,
            )}
            query={query}
          />
        </small>
      ) : null}
    </ProducerMapRosterRow>
  );
});

export interface RosterSheetProps {
  viewerRef: Ref<HTMLElement>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  sheetLabel: string;
  closeLabel: string;
  producersHeading: string;
  summaryText: string;
  relevanceLabel?: string;
  screenReaderSummary: string;
  adSlot?: ReactNode;
  loading: boolean;
  hasError: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  items: readonly ExplorerProducer[];
  visibleItems: readonly ExplorerProducer[];
  visibleLimit: number;
  totalCount: number;
  emptyMessage: string;
  emptyMapViewMessage: string;
  moreLabel: string;
  onLoadMore: () => void;
  searchQuery: string;
  deferredSearchQuery: string;
  locale: Locale;
  categoryPresentations: ReadonlyMap<string, CategoryPresentation>;
  presentedKey?: string;
  selectedKey?: string;
  selectedListItemRef: Ref<HTMLLIElement>;
  onPreview: (key: string, immediate?: boolean) => void;
  onPreviewEnd: (key: string) => void;
  onSuggestProducer: () => void;
}

export function RosterSheet({
  viewerRef,
  open,
  onOpenChange,
  title,
  sheetLabel,
  closeLabel,
  producersHeading,
  summaryText,
  relevanceLabel,
  screenReaderSummary,
  adSlot,
  loading,
  hasError,
  onRetry,
  retryLabel = "Reintentar",
  items,
  visibleItems,
  visibleLimit,
  totalCount,
  emptyMessage,
  emptyMapViewMessage,
  moreLabel,
  onLoadMore,
  searchQuery,
  deferredSearchQuery,
  locale,
  categoryPresentations,
  presentedKey,
  selectedKey,
  selectedListItemRef,
  onPreview,
  onPreviewEnd,
  onSuggestProducer,
}: RosterSheetProps) {
  return (
    <CatalogResultsSheet
      viewerRef={viewerRef}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      label={sheetLabel}
      closeLabel={closeLabel}
    >
      <div className="catalog-viewer-head">
        <h2>{producersHeading}</h2>
      </div>
      <p className="catalog-search-summary" role="status">
        {summaryText}
        {relevanceLabel ? ` · ${relevanceLabel}` : ""}
      </p>
      {adSlot}
      {hasError && onRetry ? (
        <button
          type="button"
          className="catalog-search-action"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      ) : null}
      <p className="visually-hidden" aria-live="polite">
        {screenReaderSummary}
        {visibleItems[0] ? `: ${visibleItems[0].name}` : ""}
      </p>

      {loading || hasError ? null : items.length === 0 ? (
        <p className="catalog-empty">{emptyMessage}</p>
      ) : visibleItems.length > 0 ? (
        <ul
          id={PRODUCER_RESULTS_ID}
          className="producer-compact-list"
          aria-busy={searchQuery !== deferredSearchQuery || loading}
        >
          {visibleItems.map((item) => (
            <ProducerRosterRowItem
              key={item.producerId}
              locale={locale}
              item={item}
              href={item.href}
              query={deferredSearchQuery}
              categories={categoryPresentations}
              active={presentedKey === item.key}
              itemRef={selectedKey === item.key ? selectedListItemRef : undefined}
              onPreview={onPreview}
              onPreviewEnd={onPreviewEnd}
            />
          ))}
        </ul>
      ) : (
        <p id={PRODUCER_RESULTS_ID} className="catalog-empty">
          {emptyMapViewMessage}
        </p>
      )}

      {totalCount > visibleLimit ? (
        <button
          type="button"
          className="catalog-search-action"
          onClick={onLoadMore}
        >
          {moreLabel}
        </button>
      ) : null}

      <div className="catalog-roster-suggest">
        <div className="catalog-roster-suggest__content">
          <strong>¿Falta algún productor?</strong>
          <p>
            Ayúdanos a completar el catálogo sugiriendo productores locales que
            conozcas.
          </p>
        </div>
        <button
          type="button"
          className="catalog-roster-suggest__btn"
          onClick={onSuggestProducer}
        >
          <PlusCircleIcon size={18} aria-hidden="true" />
          <span>Añadir productor</span>
        </button>
      </div>
    </CatalogResultsSheet>
  );
}
