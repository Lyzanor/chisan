"use client";

import {
  CheckIcon,
  GlobeHemisphereWestIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { normalizeCatalogSearch } from "@/lib/catalog-search";
import type { AreaSelectorCountry } from "@/components/area-selector";

export function CatalogSearchControl({
  value,
  onChange,
  scope,
  onScopeChange,
  areaLabel,
  countryLabel,
  searchLabel,
  placeholder,
  scopeLabel,
  filterLabel,
  countryData,
  currentAreaSlug,
  onSelectArea,
}: {
  value: string;
  onChange: (value: string) => void;
  scope: "area" | "country";
  onScopeChange: (scope: "area" | "country") => void;
  areaLabel: string;
  countryLabel: string;
  searchLabel: string;
  placeholder: string;
  scopeLabel: string;
  filterLabel: string;
  countryData?: AreaSelectorCountry;
  currentAreaSlug?: string;
  onSelectArea?: (area: { slug: string; href: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [provinceFilter, setProvinceFilter] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const provinceInputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const normalizedQuery = normalizeCatalogSearch(provinceFilter);

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

  return (
    <div
      ref={root}
      className="catalog-header-search"
      role="search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <label className="catalog-header-search__input">
        <MagnifyingGlassIcon aria-hidden="true" size={20} />
        <span className="visually-hidden">{searchLabel}</span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={200}
          autoComplete="off"
          aria-controls={open ? panelId : undefined}
        />
      </label>

      <button
        ref={trigger}
        type="button"
        className="catalog-header-search__filter"
        aria-label={`${filterLabel} · ${scope === "area" ? areaLabel : countryLabel}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (next) {
              setProvinceFilter("");
              setTimeout(() => provinceInputRef.current?.focus(), 60);
            }
            return next;
          });
        }}
      >
        {scope === "country" ? (
          <GlobeHemisphereWestIcon size={18} aria-hidden="true" />
        ) : (
          <MapPinIcon size={18} aria-hidden="true" />
        )}
        <span className="catalog-header-search__filter-badge">
          {scope === "country" ? countryLabel : areaLabel}
        </span>
        <SlidersHorizontalIcon size={16} aria-hidden="true" />
      </button>

      <div
        className="catalog-header-search__panel"
        id={panelId}
        inert={!open}
        data-open={open || undefined}
      >
        <div className="catalog-header-search__panel-header">
          <span className="catalog-header-search__heading" id={`${panelId}-label`}>
            {scopeLabel}
          </span>
        </div>

        {/* 1. Opción Toda España */}
        <div className="catalog-header-search__scope-options">
          <button
            type="button"
            className="catalog-header-search__country-option"
            aria-pressed={scope === "country"}
            onClick={() => {
              onScopeChange("country");
              setOpen(false);
              trigger.current?.focus();
            }}
          >
            <div className="catalog-header-search__option-title">
              <GlobeHemisphereWestIcon size={20} aria-hidden="true" />
              <span>Toda {countryLabel}</span>
            </div>
            {scope === "country" ? (
              <CheckIcon size={18} aria-hidden="true" />
            ) : null}
          </button>
        </div>

        {/* 2. Selector integrado de provincias */}
        {countryData?.regions ? (
          <div className="catalog-header-search__provinces-section">
            <span className="catalog-header-search__section-title">
              Provincias
            </span>

            <label className="catalog-header-search__province-search">
              <MagnifyingGlassIcon size={16} aria-hidden="true" />
              <input
                ref={provinceInputRef}
                type="search"
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                placeholder="Buscar provincia..."
                autoComplete="off"
                className="catalog-header-search__province-input"
              />
              {provinceFilter ? (
                <button
                  type="button"
                  className="catalog-header-search__clear-filter"
                  onClick={() => {
                    setProvinceFilter("");
                    provinceInputRef.current?.focus();
                  }}
                  aria-label="Borrar filtro"
                >
                  <XIcon size={14} aria-hidden="true" />
                </button>
              ) : null}
            </label>

            <div className="catalog-header-search__provinces-list" role="list">
              {filteredRegions.map((region) => (
                <div
                  key={region.slug}
                  className="catalog-header-search__region-group"
                >
                  <span className="catalog-header-search__region-label">
                    {region.label}
                  </span>
                  <div className="catalog-header-search__area-grid">
                    {region.areas.map((area) => {
                      const isCurrentArea = area.slug === currentAreaSlug;
                      const isSelected = isCurrentArea && scope === "area";

                      return (
                        <button
                          key={area.slug}
                          type="button"
                          className="catalog-header-search__area-option"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setOpen(false);
                            if (isCurrentArea) {
                              if (scope !== "area") onScopeChange("area");
                            } else if (onSelectArea) {
                              onSelectArea(area);
                            }
                          }}
                        >
                          <span>{area.label}</span>
                          {isSelected ? (
                            <CheckIcon size={16} aria-hidden="true" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredRegions.length === 0 ? (
                <div className="catalog-header-search__empty" role="status">
                  <p>No se encontraron provincias para «{provinceFilter}»</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
