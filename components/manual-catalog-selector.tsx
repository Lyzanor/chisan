"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ManualCatalogSelectionCountry } from "@/lib/i18n/manual-catalog-selection";

type ManualCatalogSelectorProps = {
  countries: readonly ManualCatalogSelectionCountry[];
  messages: {
    title: string;
    countryLabel: string;
    countryPlaceholder: string;
    areaLabel: string;
    areaPlaceholder: string;
    submit: string;
  };
};

export function ManualCatalogSelector({
  countries,
  messages,
}: ManualCatalogSelectorProps) {
  const router = useRouter();
  const [countrySlug, setCountrySlug] = useState("");
  const [areaSlug, setAreaSlug] = useState("");
  const [isPending, startTransition] = useTransition();
  const country = countries.find(({ slug }) => slug === countrySlug);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!country || !areaSlug) return;
    const destination = country.regions
      .flatMap((region) => region.areas)
      .find(({ slug }) => slug === areaSlug);
    if (!destination) return;

    startTransition(() => {
      router.push(destination.href);
    });
  }

  return (
    <section
      id="manual-area-selection"
      className="manual-catalog-selector"
      aria-labelledby="manual-area-selection-title"
    >
      <h2 id="manual-area-selection-title">{messages.title}</h2>
      <form className="manual-catalog-selector__controls" onSubmit={handleSubmit}>
        <label>
          <span>{messages.countryLabel}</span>
          <select
            value={countrySlug}
            onChange={(event) => {
              setCountrySlug(event.target.value);
              setAreaSlug("");
            }}
            disabled={isPending}
          >
            <option value="">{messages.countryPlaceholder}</option>
            {countries.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{messages.areaLabel}</span>
          <select
            value={areaSlug}
            onChange={(event) => setAreaSlug(event.target.value)}
            disabled={!country || isPending}
          >
            <option value="">{messages.areaPlaceholder}</option>
            {country?.regions.map((region) => (
              <optgroup key={region.slug} label={region.label}>
                {region.areas.map((area) => (
                  <option key={area.slug} value={area.slug}>
                    {area.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="manual-catalog-selector__submit"
          disabled={!country || !areaSlug || isPending}
        >
          {messages.submit}
        </button>
      </form>
      <noscript>
        <div className="manual-catalog-selector__fallback">
          {countries.map((countryOption) => (
            <section key={countryOption.slug}>
              <h3>{countryOption.label}</h3>
              {countryOption.regions.map((region) => (
                <div key={region.slug}>
                  <h4>{region.label}</h4>
                  <ul>
                    {region.areas.map((area) => (
                      <li key={area.slug}>
                        <Link href={area.href}>{area.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      </noscript>
    </section>
  );
}
