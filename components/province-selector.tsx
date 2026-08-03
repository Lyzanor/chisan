"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { buildCatalogHref } from "@/lib/catalog-navigation";

type ProvinceOption = {
  slug: string;
  label: string;
};

type ProvinceGroup = {
  slug: string;
  label: string;
  provinces: ProvinceOption[];
};

type ProvinceCountry = {
  slug: string;
  label: string;
  groups: ProvinceGroup[];
};

type ProvinceSelectorProps = {
  countries: ProvinceCountry[];
  currentProvince: string;
};

export function ProvinceSelector({ countries, currentProvince }: ProvinceSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const province = e.target.value;
    if (!province) {
      return;
    }

    startTransition(() => {
      router.push(
        buildCatalogHref({
          province,
          category: searchParams.get("categoria") ?? "",
        }),
      );
    });
  }

  return (
    <div className="province-selector">
      <label htmlFor="province-select" className="province-selector-label">
        Provincia o prefectura
      </label>
      <select
        id="province-select"
        value={currentProvince}
        onChange={handleChange}
        disabled={isPending}
        className="province-selector-select"
      >
        <option value="" disabled>
          Selecciona provincia o prefectura
        </option>
        {/* `optgroup` cannot nest, so the country prefixes each group label. */}
        {countries.flatMap((country) =>
          country.groups.map((group) => (
            <optgroup key={group.slug} label={`${country.label} · ${group.label}`}>
              {group.provinces.map((province) => (
                <option key={province.slug} value={province.slug}>
                  {province.label}
                </option>
              ))}
            </optgroup>
          )),
        )}
      </select>
    </div>
  );
}
