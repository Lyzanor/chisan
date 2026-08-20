"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { buildCatalogHref } from "@/lib/catalog-navigation";

type AreaOption = {
  slug: string;
  label: string;
};

type Region = {
  slug: string;
  label: string;
  areas: AreaOption[];
};

type Country = {
  slug: string;
  label: string;
  unit: { one: string; many: string };
  regions: Region[];
};

type AreaSelectorProps = {
  country: Country;
  currentArea: string;
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function AreaSelector({ country, currentArea }: AreaSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const area = e.target.value;
    if (!area) {
      return;
    }

    startTransition(() => {
      router.push(
        buildCatalogHref({
          country: country.slug,
          area,
          category: searchParams.get("category") ?? "",
        }),
      );
    });
  }

  return (
    <div className="area-selector">
      <label htmlFor="area-select" className="area-selector-label">
        {capitalize(country.unit.one)}
      </label>
      <select
        id="area-select"
        value={currentArea}
        onChange={handleChange}
        disabled={isPending}
        className="area-selector-select"
      >
        <option value="" disabled>
          Select a {country.unit.one}
        </option>
        {country.regions.map((region) => (
          <optgroup key={region.slug} label={region.label}>
            {region.areas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
