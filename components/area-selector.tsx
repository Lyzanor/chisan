"use client";

import { useRouter } from "next/navigation";
import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { normalizeCatalogSearch } from "@/lib/catalog-search";
import styles from "./area-selector.module.css";

export type AreaOption = {
  slug: string;
  label: string;
  href: string;
};

export type AreaSelectorRegion = {
  slug: string;
  label: string;
  areas: AreaOption[];
};

export type AreaSelectorCountry = {
  regions: AreaSelectorRegion[];
};

export type AreaSelectorMessages = {
  label: string;
  placeholder: string;
  submit: string;
  search: string;
  empty: string;
};

type AreaSelectorProps = {
  country: AreaSelectorCountry;
  currentArea: string;
  messages: AreaSelectorMessages;
  onNavigate?: () => void;
};

export function AreaSelector({
  country,
  currentArea,
  messages,
  onNavigate,
}: AreaSelectorProps) {
  const router = useRouter();
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const selected = country.regions.flatMap((region) => region.areas)
    .find((area) => area.slug === currentArea);
  const normalizedQuery = normalizeCatalogSearch(query);
  const regions = country.regions.map((region) => ({
    ...region,
    areas: region.areas.filter((area) =>
      normalizeCatalogSearch(`${area.label} ${region.label}`).includes(normalizedQuery)),
  })).filter((region) => region.areas.length > 0);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function closeFromOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    // The parent account disclosure may close through its own controls.
    const parent = rootRef.current?.closest("details");
    function closeWithParent() { if (!parent?.open) setOpen(false); }
    document.addEventListener("pointerdown", closeFromOutside);
    parent?.addEventListener("toggle", closeWithParent);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      parent?.removeEventListener("toggle", closeWithParent);
    };
  }, [open]);

  function navigateToArea(area: string) {
    if (!area) {
      return;
    }
    const destination = country.regions
      .flatMap((region) => region.areas)
      .find((option) => option.slug === area);
    if (!destination) return;

    setOpen(false);
    triggerRef.current?.focus();
    if (destination.slug === currentArea) return;
    onNavigate?.();
    startTransition(() => {
      router.push(destination.href);
    });
  }

  return (
    <div
      ref={rootRef}
      className={styles.picker}
      aria-busy={isPending}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDownCapture={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <span id={`${id}-label`} className={styles.label}>
        {messages.label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        disabled={isPending}
        onClick={() => { setQuery(""); setOpen((value) => !value); }}
      >
        <span id={`${id}-value`}>{selected?.label ?? messages.placeholder}</span>
        <CaretDownIcon size={16} aria-hidden="true" />
      </button>
      {open ? (
        <div id={`${id}-panel`} className={styles.panel}>
          <label className={styles.search}>
            <MagnifyingGlassIcon size={18} aria-hidden="true" />
            <span className="visually-hidden">{messages.search}</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder={messages.search}
              autoComplete="off"
              aria-controls={`${id}-results`}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className={styles.results} id={`${id}-results`}>
            {regions.map((region) => (
              <section key={region.slug} aria-labelledby={`${id}-${region.slug}`}>
                <h3 id={`${id}-${region.slug}`}>{region.label}</h3>
                {region.areas.map((area) => (
                  <button
                    key={area.slug}
                    type="button"
                    className={styles.option}
                    aria-current={area.slug === currentArea ? "true" : undefined}
                    disabled={isPending}
                    onClick={() => navigateToArea(area.slug)}
                  >
                    <span>{area.label}</span>
                    {area.slug === currentArea ? <CheckIcon size={18} aria-hidden="true" /> : null}
                  </button>
                ))}
              </section>
            ))}
            {regions.length === 0 ? (
              <div className={styles.empty} role="status">
                <p>{messages.empty}</p>
                <button type="button" className={styles.option} onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
                  {messages.placeholder}<XIcon size={16} aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
