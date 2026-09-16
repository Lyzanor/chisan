"use client";

import {
  CheckCircleIcon,
  CircleNotchIcon,
  NavigationArrowIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { getRadiusSearchMessages } from "@/lib/i18n/radius-search";
import { getProducerDistanceMessages } from "@/lib/i18n/producer-distance";
import { LOCATION_REQUEST_OPTIONS } from "@/lib/location/location-onboarding";
import {
  DEFAULT_SEARCH_RADIUS_KM,
  isValidCoordinates,
  type RadiusFilter,
} from "@/lib/location/radius-search";

export function CatalogRadiusFilter({
  heading,
  locale,
  area,
  value,
  count,
  onChange,
}: {
  heading: string;
  locale: Locale;
  area: string;
  value: RadiusFilter | null;
  count: number;
  onChange: (value: RadiusFilter | null) => void;
}) {
  const messages = getRadiusSearchMessages(locale);
  const failures = getProducerDistanceMessages(locale);
  const id = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);

  useEffect(() => () => { generation.current += 1; }, []);

  const locate = useCallback(() => {
    const request = ++generation.current;
    setError("");
    if (!navigator.geolocation) {
      setError(failures.unavailable);
      return;
    }
    setPending(true);
    const failed = (message: string) => {
      if (generation.current !== request) return;
      setPending(false);
      setError(message);
    };
    try {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          if (generation.current !== request) return;
          if (!isValidCoordinates(coords)) {
            failed(failures.unavailable);
            return;
          }
          setPending(false);
          onChange({
            latitude: coords.latitude,
            longitude: coords.longitude,
            radiusKm: DEFAULT_SEARCH_RADIUS_KM,
          });
        },
        ({ code }) =>
          failed(
            code === 1
              ? failures.permissionDenied
              : code === 3
                ? failures.timeout
                : failures.unavailable,
          ),
        LOCATION_REQUEST_OPTIONS,
      );
    } catch {
      failed(failures.unavailable);
    }
  }, [failures, onChange, setError, setPending]);

  // Auto-locate when device permission is already granted in the browser.
  useEffect(() => {
    if (value) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    if (!navigator.permissions?.query) return;

    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permission) => {
        if (cancelled) return;
        if (permission.state === "granted") {
          locate();
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [locate, value]);

  if (!value) {
    return (
      <section
        className="location-onboarding catalog-radius-onboarding"
        aria-labelledby={`${id}-title`}
        data-status={pending ? "locating" : error ? "failed" : "idle"}
      >
        <div className="location-onboarding__copy">
          <h2 id={`${id}-title`}>{messages.title}</h2>
          <p id={`${id}-description`}>
            {messages.description.replace("{area}", area)}
          </p>
        </div>
        <div className="location-onboarding__actions">
          <button
            className="location-onboarding__primary"
            type="button"
            disabled={pending}
            aria-busy={pending}
            onClick={locate}
          >
            {pending ? (
              <CircleNotchIcon
                className="location-onboarding__spinner"
                aria-hidden="true"
                size={18}
              />
            ) : (
              <NavigationArrowIcon aria-hidden="true" size={18} />
            )}
            <span>{pending ? messages.locating : messages.useLocation}</span>
          </button>
        </div>
        {error ? (
          <p
            className="location-onboarding__status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {error}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <div className="catalog-viewer-head catalog-radius-heading">
      <h2>{heading}</h2>
      <div className="catalog-radius-active-controls">
        <span
          className="catalog-radius-active-badge"
          title={messages.active.replace("{count}", String(count))}
          aria-label={messages.active.replace("{count}", String(count))}
        >
          <CheckCircleIcon size={16} weight="fill" aria-hidden="true" />
          <span>{messages.within5km || `${value.radiusKm} km`}</span>
        </span>
        <button
          type="button"
          className="catalog-radius-clear-btn"
          onClick={() => {
            generation.current += 1;
            setPending(false);
            setError("");
            onChange(null);
          }}
          title={messages.clear}
          aria-label={messages.clear}
        >
          <XIcon size={14} aria-hidden="true" />
          <span>{messages.clear}</span>
        </button>
      </div>
    </div>
  );
}
