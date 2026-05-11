"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { buildCatalogHref } from "@/lib/catalog-navigation";

type ProvinceOption = {
  slug: string;
  label: string;
};

type ProvinceSelectorProps = {
  provinces: ProvinceOption[];
  currentProvince: string;
};

export function ProvinceSelector({ provinces, currentProvince }: ProvinceSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const province = e.target.value;

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
        {provinces.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
