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

type ProvinceSelectorProps = {
  groups: ProvinceGroup[];
  currentProvince: string;
};

export function ProvinceSelector({ groups, currentProvince }: ProvinceSelectorProps) {
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
        Provincia
      </label>
      <select
        id="province-select"
        value={currentProvince}
        onChange={handleChange}
        disabled={isPending}
        className="province-selector-select"
      >
        <option value="" disabled>
          Selecciona una provincia
        </option>
        {groups.map((group) => (
          <optgroup key={group.slug} label={group.label}>
            {group.provinces.map((province) => (
              <option key={province.slug} value={province.slug}>
                {province.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
