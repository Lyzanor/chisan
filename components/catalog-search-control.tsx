"use client";

import { CheckIcon, MagnifyingGlassIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

export function CatalogSearchControl({ value, onChange, scope, onScopeChange, areaLabel, countryLabel, searchLabel, placeholder, scopeLabel, filterLabel }: {
  value: string; onChange: (value: string) => void; scope: "area" | "country";
  onScopeChange: (scope: "area" | "country") => void;
  areaLabel: string; countryLabel: string; searchLabel: string; placeholder: string; scopeLabel: string; filterLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return <div ref={root} className="catalog-header-search" role="search"
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => {
      if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
      if (event.key === "Enter" && event.target instanceof HTMLInputElement) { event.preventDefault(); setOpen(false); event.target.blur(); }
    }}>
    <label className="catalog-header-search__input">
      <MagnifyingGlassIcon aria-hidden="true" size={20} />
      <span className="visually-hidden">{searchLabel}</span>
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => setOpen(true)}
        placeholder={placeholder} maxLength={200} autoComplete="off" aria-controls={open ? panelId : undefined} />
    </label>
    <button ref={trigger} type="button" className="catalog-header-search__filter" aria-label={`${filterLabel} · ${scope === "area" ? areaLabel : countryLabel}`}
      aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
      <SlidersHorizontalIcon size={20} aria-hidden="true" />
    </button>
    <div className="catalog-header-search__panel" id={panelId} inert={!open} data-open={open || undefined}>
      <span className="catalog-header-search__heading" id={`${panelId}-label`}>{scopeLabel}</span>
      <div role="group" aria-labelledby={`${panelId}-label`}>
        {(["area", "country"] as const).map((option) => <button type="button" key={option} aria-pressed={scope === option}
          onClick={() => { onScopeChange(option); setOpen(false); trigger.current?.focus(); }}>
          <span>{option === "area" ? areaLabel : countryLabel}</span>
          {scope === option ? <CheckIcon size={18} aria-hidden="true" /> : null}
        </button>)}
      </div>
    </div>
  </div>;
}
