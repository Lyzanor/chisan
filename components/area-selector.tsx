"use client";

import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";

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
  const selectId = useId();
  const [isPending, startTransition] = useTransition();

  function navigateToArea(area: string) {
    if (!area) {
      return;
    }
    const destination = country.regions
      .flatMap((region) => region.areas)
      .find((option) => option.slug === area);
    if (!destination) return;

    onNavigate?.();
    startTransition(() => {
      router.push(destination.href);
    });
  }

  return (
    <div className="area-selector" aria-busy={isPending}>
      <label htmlFor={selectId} className="area-selector-label">
        {messages.label}
      </label>
      <select
        key={currentArea}
        id={selectId}
        name="area"
        defaultValue={currentArea}
        required
        disabled={isPending}
        className="area-selector-select"
        onChange={(event) => navigateToArea(event.target.value)}
      >
        <option value="" disabled>
          {messages.placeholder}
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
