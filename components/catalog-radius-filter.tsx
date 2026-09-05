"use client";

import { SlidersHorizontalIcon, CaretDownIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { getRadiusSearchMessages } from "@/lib/i18n/radius-search";
import { getProducerDistanceMessages } from "@/lib/i18n/producer-distance";
import { LOCATION_REQUEST_OPTIONS } from "@/lib/location/location-onboarding";
import { isValidCoordinates, type RadiusFilter } from "@/lib/location/radius-search";

export function CatalogRadiusFilter({ heading, locale, area, value, count, onChange }: {
  heading: string; locale: Locale; area: string; value: RadiusFilter | null; count: number;
  onChange: (value: RadiusFilter | null) => void;
}) {
  const messages = getRadiusSearchMessages(locale);
  const failures = getProducerDistanceMessages(locale);
  const id = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [radius, setRadius] = useState(25);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const radiusRef = useRef(radius);
  useEffect(() => () => { generation.current += 1; }, []);

  function locate() {
    const request = ++generation.current;
    setError("");
    if (!navigator.geolocation) { setError(failures.unavailable); return; }
    setPending(true);
    const failed = (message: string) => {
      if (generation.current !== request) return;
      setPending(false);
      setError(message);
    };
    try {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        if (generation.current !== request) return;
        if (!isValidCoordinates(coords)) { failed(failures.unavailable); return; }
        setPending(false);
        onChange({ latitude: coords.latitude, longitude: coords.longitude, radiusKm: radiusRef.current });
      }, ({ code }) => failed(code === 1 ? failures.permissionDenied : code === 3 ? failures.timeout : failures.unavailable), LOCATION_REQUEST_OPTIONS);
    } catch { failed(failures.unavailable); }
  }

  return (
    <div className="catalog-radius-filter" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }}>
      <div className="catalog-viewer-head catalog-radius-heading">
        <h2>{heading}</h2>
        <button ref={triggerRef} type="button" className="catalog-radius-trigger"
          aria-label={value ? `${messages.title}: ${value.radiusKm} km` : messages.title}
          title={messages.title} aria-expanded={open} aria-controls={`${id}-panel`}
          data-active={Boolean(value)} onClick={() => setOpen((current) => !current)}>
          <SlidersHorizontalIcon size={18} aria-hidden="true" />
          {value ? <span>{value.radiusKm} km</span> : null}
          <CaretDownIcon size={12} aria-hidden="true" />
        </button>
      </div>
      <div id={`${id}-panel`} className="catalog-radius-content" hidden={!open}>
        <p id={`${id}-description`}>{messages.description.replace("{area}", area)}</p>
        <div className="catalog-radius-actions">
          <label>{messages.radius}
            <select value={radius} onChange={(event) => {
              const next = Number(event.target.value);
              setRadius(next);
              radiusRef.current = next;
              if (value) onChange({ ...value, radiusKm: next });
            }}>
              {[5, 10, 25, 50, 100, 250, 500].map((km) => <option key={km} value={km}>{km} km</option>)}
            </select>
          </label>
          <button type="button" onClick={locate} disabled={pending} aria-describedby={`${id}-description`}>
            {pending ? messages.locating : messages.useLocation}
          </button>
        </div>
        <form onSubmit={(event) => {
          event.preventDefault();
          const point = { latitude: latitude.trim() ? Number(latitude.replace(",", ".")) : NaN, longitude: longitude.trim() ? Number(longitude.replace(",", ".")) : NaN };
          if (!isValidCoordinates(point)) { setError(messages.invalid); return; }
          generation.current += 1;
          setPending(false);
          setError("");
          onChange({ ...point, radiusKm: radius });
        }}>
          <fieldset>
            <legend>{messages.manual}</legend>
            <div className="catalog-radius-actions">
              <label>{messages.latitude}<input inputMode="decimal" value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="41.39" autoComplete="off" required /></label>
              <label>{messages.longitude}<input inputMode="decimal" value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="2.17" autoComplete="off" required /></label>
              <button type="submit">{messages.apply}</button>
            </div>
          </fieldset>
        </form>
        <p role="status">{error || (value ? messages.active.replace("{radius}", String(value.radiusKm)).replace("{count}", String(count)) : "")}</p>
        {value || pending ? <button type="button" onClick={() => {
          generation.current += 1;
          setPending(false);
          setError("");
          setLatitude("");
          setLongitude("");
          onChange(null);
        }}>{messages.clear}</button> : null}
      </div>
    </div>
  );
}
