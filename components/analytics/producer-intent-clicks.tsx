"use client";

import { useEffect } from "react";
import {
  isProducerIntentAction,
  PRODUCER_INTENT_ATTRIBUTE,
  PRODUCER_STATS_ACTION_ENDPOINT,
} from "@/lib/producer-stats/policy";

/**
 * Counts intent clicks on the public profile. One delegated listener keeps the
 * links themselves server-rendered and working without JavaScript. An action
 * counts once per profile display, so a hero shortcut and the link it leads to
 * are one intent, not two.
 */
export function ProducerIntentClicks({
  country,
  producerId,
}: {
  country: string;
  producerId: number;
}) {
  useEffect(() => {
    if (
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl
    )
      return;
    let reported = new Set<string>();
    const report = (event: MouseEvent) => {
      const origin =
        event.target instanceof Element
          ? event.target.closest(`[${PRODUCER_INTENT_ATTRIBUTE}]`)
          : null;
      const action = origin?.getAttribute(PRODUCER_INTENT_ATTRIBUTE);
      if (!isProducerIntentAction(action) || reported.has(action)) return;
      reported.add(action);
      void fetch(PRODUCER_STATS_ACTION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          producerId,
          eventId: crypto.randomUUID(),
          action,
        }),
        credentials: "same-origin",
        referrerPolicy: "no-referrer",
        keepalive: true,
      }).catch(() => undefined);
    };
    // A restored navigation starts a fresh display and may act again.
    const restored = (event: PageTransitionEvent) => {
      if (event.persisted) reported = new Set();
    };
    document.addEventListener("click", report, true);
    window.addEventListener("pageshow", restored);
    return () => {
      document.removeEventListener("click", report, true);
      window.removeEventListener("pageshow", restored);
    };
  }, [country, producerId]);
  return null;
}
