"use client";

import {
  CaretDownIcon,
  CheckIcon,
  CircleNotchIcon,
  GlobeHemisphereWestIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { normalizeCatalogSearch } from "@/lib/catalog-search";
import type { AreaOption, AreaSelectorCountry } from "@/components/area-selector";

export type CatalogSearchControlMessages = {
  search: string;
  placeholder: string;
  scope: string;
  place: string;
  wholeCountry: string;
  areaHeading: string;
  areaSearch: string;
  areaEmpty: string;
  clearAreaSearch: string;
};

/**
 * Text search and the place it searches, side by side: the place is always
 * visible, and choosing another one answers at once while its catalog loads.
 */
export function CatalogSearchControl({
  value,
  onChange,
  scope,
  onScopeChange,
  areaLabel,
  countryLabel,
  messages,
  countryData,
  currentAreaSlug,
  pendingArea,
  onSelectArea,
}: {
  value: string;
  onChange: (value: string) => void;
  scope: "area" | "country";
  onScopeChange: (scope: "area" | "country") => void;
  areaLabel: string;
  countryLabel: string;
  messages: CatalogSearchControlMessages;
  countryData?: AreaSelectorCountry;
  currentAreaSlug?: string;
  pendingArea?: AreaOption;
  onSelectArea?: (area: AreaOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [areaFilter, setAreaFilter] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const areaInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const placeLabel = pendingArea?.label ?? (scope === "country" ? countryLabel : areaLabel);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Open on the current place instead of the top of a long list.
    listRef.current
      ?.querySelector<HTMLElement>("[data-current]")
      ?.scrollIntoView({ block: "center" });
    const focus = setTimeout(() => areaInputRef.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(focus);
  }, [open]);

  const normalizedQuery = normalizeCatalogSearch(areaFilter);
  const countryRegions = countryData?.regions;
  const filteredRegions = useMemo(() => {
    if (!countryRegions) return [];
    if (!normalizedQuery) return countryRegions;

    return countryRegions
      .map((region) => ({
        ...region,
        areas: region.areas.filter((area) =>
          normalizeCatalogSearch(`${area.label} ${region.label}`).includes(
            normalizedQuery,
          ),
        ),
      }))
      .filter((region) => region.areas.length > 0);
  }, [countryRegions, normalizedQuery]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function chooseArea(area: AreaOption) {
    close();
    if (area.slug === currentAreaSlug) {
      if (scope !== "area") onScopeChange("area");
    } else {
      onSelectArea?.(area);
    }
  }

  return (
    <div
      ref={root}
      className="catalog-header-search"
      role="search"
      aria-busy={pendingArea ? true : undefined}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <label className="catalog-header-search__input">
        <MagnifyingGlassIcon aria-hidden="true" size={20} />
        <span className="visually-hidden">{messages.search}</span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={messages.placeholder}
          maxLength={200}
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>

      <button
        ref={trigger}
        type="button"
        className="catalog-header-search__place"
        aria-label={`${messages.place}: ${placeLabel}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setAreaFilter("");
          setOpen((current) => !current);
        }}
      >
        {pendingArea ? (
          <CircleNotchIcon className="catalog-header-search__spinner" size={16} aria-hidden="true" />
        ) : scope === "country" ? (
          <GlobeHemisphereWestIcon size={16} aria-hidden="true" />
        ) : (
          <MapPinIcon size={16} weight="fill" aria-hidden="true" />
        )}
        <span className="catalog-header-search__place-label">{placeLabel}</span>
        <CaretDownIcon className="catalog-header-search__caret" size={14} aria-hidden="true" />
      </button>

      <div
        className="catalog-header-search__panel"
        id={panelId}
        role="group"
        aria-label={messages.scope}
        inert={!open}
        data-open={open || undefined}
      >
        <span className="catalog-header-search__heading" aria-hidden="true">
          {messages.scope}
        </span>

        <button
          type="button"
          className="catalog-header-search__country-option"
          aria-pressed={scope === "country"}
          onClick={() => {
            close();
            if (scope !== "country") onScopeChange("country");
          }}
        >
          <span className="catalog-header-search__option-title">
            <GlobeHemisphereWestIcon size={20} aria-hidden="true" />
            <span>
              {messages.wholeCountry}
              <small>{countryLabel}</small>
            </span>
          </span>
          {scope === "country" ? <CheckIcon size={18} aria-hidden="true" /> : null}
        </button>

        {countryData?.regions ? (
          <div className="catalog-header-search__areas">
            <span className="catalog-header-search__section-title">
              {messages.areaHeading}
            </span>

            <label className="catalog-header-search__area-search">
              <MagnifyingGlassIcon size={16} aria-hidden="true" />
              <span className="visually-hidden">{messages.areaSearch}</span>
              <input
                ref={areaInputRef}
                type="search"
                value={areaFilter}
                onChange={(event) => setAreaFilter(event.target.value)}
                onKeyDown={(event) => {
                  // Typing a name and pressing Enter goes straight there.
                  const first = filteredRegions[0]?.areas[0];
                  if (event.key === "Enter" && normalizedQuery && first) {
                    event.preventDefault();
                    chooseArea(first);
                  }
                }}
                placeholder={messages.areaSearch}
                autoComplete="off"
                enterKeyHint="go"
              />
              {areaFilter ? (
                <button
                  type="button"
                  className="catalog-header-search__clear-filter"
                  onClick={() => {
                    setAreaFilter("");
                    areaInputRef.current?.focus();
                  }}
                  aria-label={messages.clearAreaSearch}
                >
                  <XIcon size={14} aria-hidden="true" />
                </button>
              ) : null}
            </label>

            <div ref={listRef} className="catalog-header-search__area-list">
              {filteredRegions.map((region) => (
                <section
                  key={region.slug}
                  className="catalog-header-search__region-group"
                  aria-label={region.label}
                >
                  <span className="catalog-header-search__region-label" aria-hidden="true">
                    {region.label}
                  </span>
                  {region.areas.map((area) => {
                    const isCurrentArea = area.slug === currentAreaSlug;
                    const isSelected = pendingArea
                      ? area.slug === pendingArea.slug
                      : isCurrentArea && scope === "area";

                    return (
                      <button
                        key={area.slug}
                        type="button"
                        className="catalog-header-search__area-option"
                        aria-pressed={isSelected}
                        data-current={isCurrentArea || undefined}
                        onClick={() => chooseArea(area)}
                      >
                        <span>{area.label}</span>
                        {isSelected ? <CheckIcon size={16} aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </section>
              ))}

              {filteredRegions.length === 0 ? (
                <p className="catalog-header-search__empty" role="status">
                  {messages.areaEmpty}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
