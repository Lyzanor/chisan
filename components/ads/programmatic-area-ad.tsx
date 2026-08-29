"use client";

import Script from "next/script";
import { useRef } from "react";

import styles from "./programmatic-area-ad.module.css";

type AdSenseQueue = Array<Record<string, never>>;

declare global {
  interface Window {
    adsbygoogle?: AdSenseQueue;
  }
}

type ProgrammaticAreaAdProps = Readonly<{
  accountId: string;
  label: string;
  slotId: string;
}>;

export function ProgrammaticAreaAdPlaceholder({
  label,
}: Readonly<{ label: string }>) {
  return (
    <aside className={styles.placement} aria-label={label}>
      <p className={styles.label}>{label}</p>
      <span className={styles.unit} aria-hidden="true" />
    </aside>
  );
}

export function ProgrammaticAreaAd({
  accountId,
  label,
  slotId,
}: ProgrammaticAreaAdProps) {
  const requested = useRef(false);

  function requestAd() {
    if (requested.current) return;

    requested.current = true;
    window.adsbygoogle = window.adsbygoogle ?? [];
    window.adsbygoogle.push({});
  }

  return (
    <aside className={styles.placement} aria-label={label}>
      <p className={styles.label}>{label}</p>
      <ins
        className={`adsbygoogle ${styles.unit}`}
        data-ad-client={accountId}
        data-ad-slot={slotId}
      />
      <Script
        id="chisan-google-adsense"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(accountId)}`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onReady={requestAd}
      />
    </aside>
  );
}
