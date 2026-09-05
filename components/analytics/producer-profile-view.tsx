"use client";

import { useEffect } from "react";
import { PRODUCER_STATS_ENDPOINT } from "@/lib/producer-stats/policy";

export function ProducerProfileView({
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
    let sent = false;
    let eventId = crypto.randomUUID();
    const report = () => {
      if (
        sent ||
        document.visibilityState !== "visible" ||
        (document as Document & { prerendering?: boolean }).prerendering
      )
        return;
      sent = true;
      void fetch(PRODUCER_STATS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, producerId, eventId }),
        credentials: "same-origin",
        referrerPolicy: "no-referrer",
        keepalive: true,
      }).catch(() => undefined);
    };
    // Deferral lets Strict Mode cancel its first setup; a later route activation
    // starts a fresh display and counts again, including restored navigation.
    const timer = window.setTimeout(report, 0);
    const restored = (event: PageTransitionEvent) => {
      if (event.persisted) {
        sent = false;
        eventId = crypto.randomUUID();
        report();
      }
    };
    window.addEventListener("pageshow", restored);
    document.addEventListener("visibilitychange", report);
    document.addEventListener("prerenderingchange", report);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", restored);
      document.removeEventListener("visibilitychange", report);
      document.removeEventListener("prerenderingchange", report);
    };
  }, [country, producerId]);
  return null;
}
