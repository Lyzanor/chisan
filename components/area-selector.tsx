"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type AreaOption = {
  slug: string;
  label: string;
  href: string;
};

type Region = {
  slug: string;
  label: string;
  areas: AreaOption[];
};

type Country = {
  regions: Region[];
};

type AreaSelectorProps = {
  country: Country;
  currentArea: string;
  messages: {
    label: string;
    placeholder: string;
    submit: string;
  };
};

export function AreaSelector({ country, currentArea, messages }: AreaSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const area = String(new FormData(event.currentTarget).get("area") ?? "");
    if (!area) {
      return;
    }
    const destination = country.regions
      .flatMap((region) => region.areas)
      .find((option) => option.slug === area);
    if (!destination) return;

    startTransition(() => {
      router.push(destination.href);
    });
  }

  return (
    <form className="area-selector" onSubmit={handleSubmit}>
      <label htmlFor="area-select" className="area-selector-label">
        {messages.label}
      </label>
      <select
        id="area-select"
        name="area"
        defaultValue={currentArea}
        required
        disabled={isPending}
        className="area-selector-select"
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
      <button type="submit" className="area-selector-submit" disabled={isPending}>
        {messages.submit}
      </button>
    </form>
  );
}
