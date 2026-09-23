"use client";

import Link from "next/link";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useProducerAccountState } from "@/components/account/producer-account-provider";
import type { Locale } from "@/lib/i18n/locales";

const copy = {
  es: { title: "Cuéntanos qué hay de nuevo", action: "Compartir una novedad" },
  ca: { title: "Explica'ns què hi ha de nou", action: "Compartir una novetat" },
  en: { title: "Tell us what is new", action: "Share an update" },
};

export function ProducerNewsPrompt({ country, producerId, locale, premiumActive }: {
  country: string;
  producerId: number;
  locale: Locale;
  premiumActive: boolean;
}) {
  const state = useProducerAccountState();
  if (!state?.membership || !premiumActive) return null;
  const words = locale === "es" ? copy.es : locale === "ca" ? copy.ca : copy.en;
  return (
    <aside className="detail-news-prompt">
      <span>{words.title}</span>
      <Link href={`/cuenta/productores/${country}/${producerId}/editar`} prefetch={false}>
        <PencilSimpleIcon size={18} aria-hidden="true" />{words.action}
      </Link>
    </aside>
  );
}
