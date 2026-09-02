"use client";

import { useRef, useState } from "react";

import type { ProducerDistanceMessages } from "@/lib/i18n/producer-distance";
import type { Locale } from "@/lib/i18n/locales";
import {
  formatProducerDistanceKm,
  requestProducerDistance,
  type ProducerDistanceFailureReason,
} from "@/lib/location/producer-distance";

import styles from "./producer-distance.module.css";

type DistanceState =
  | { status: "idle" | "calculating" }
  | { status: "resolved"; distanceKm: number }
  | { status: "failed"; reason: ProducerDistanceFailureReason };

function getFailureMessage(
  reason: ProducerDistanceFailureReason,
  messages: ProducerDistanceMessages,
): string {
  if (reason === "permission-denied") return messages.permissionDenied;
  if (reason === "timeout") return messages.timeout;
  return messages.unavailable;
}

export function ProducerDistance({
  latitude,
  longitude,
  locale,
  messages,
}: {
  latitude: number;
  longitude: number;
  locale: Locale;
  messages: ProducerDistanceMessages;
}) {
  const [state, setState] = useState<DistanceState>({ status: "idle" });
  const requestIdRef = useRef(0);

  async function handleCalculate() {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setState({ status: "calculating" });

    const result = await requestProducerDistance(
      typeof navigator === "undefined" ? null : navigator.geolocation,
      { latitude, longitude },
    );

    if (requestIdRef.current === requestId) setState(result);
  }

  const statusMessage =
    state.status === "resolved"
      ? messages.result.replace(
          "{distance}",
          formatProducerDistanceKm(state.distanceKm, locale),
        )
      : state.status === "failed"
        ? getFailureMessage(state.reason, messages)
        : "";

  return (
    <section className={styles.card} aria-labelledby="producer-distance-title">
      <div className={styles.copy}>
        <h2 id="producer-distance-title">{messages.title}</h2>
        <p>{messages.description}</p>
      </div>
      <button
        type="button"
        className={styles.action}
        disabled={state.status === "calculating"}
        onClick={handleCalculate}
      >
        {state.status === "calculating" ? messages.calculating : messages.action}
      </button>
      <p className={styles.status} aria-live="polite">
        {statusMessage}
      </p>
    </section>
  );
}
