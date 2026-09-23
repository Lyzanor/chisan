"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { ChisanMascot } from "@/components/brand/chisan-brand";
import { useProducerAccountState } from "@/components/account/producer-account-provider";
import type { Locale } from "@/lib/i18n/locales";

const words = {
  es: {
    title: "Productos",
    text: "Enseña lo que produces con fotos, detalles y enlaces de compra. Amplía tu ficha a Productor Pro para añadirlos.",
    action: "Ampliar y añadir productos",
  },
  ca: {
    title: "Productes",
    text: "Mostra el que produeixes amb fotos, detalls i enllaços de compra. Amplia la fitxa a Productor Pro per afegir-los.",
    action: "Ampliar i afegir productes",
  },
  en: {
    title: "Products",
    text: "Show what you make with photos, details and purchase links. Upgrade to Producer Pro to add them.",
    action: "Upgrade and add products",
  },
};

export function ProducerProductInvitation({ country, producerId, locale }: {
  country: string;
  producerId: number;
  locale: Locale;
}) {
  const state = useProducerAccountState();
  if (!state?.membership || !state.canOfferProfileUpgrade) return null;
  const copy = locale === "es" ? words.es : locale === "ca" ? words.ca : words.en;
  return (
    <aside className="detail-product-invitation" aria-label={copy.title}>
      <ChisanMascot state="catalog" size={84} alt="" />
      <div>
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
      </div>
      <Link href={`/cuenta/productores/${country}/${producerId}/ampliar`} prefetch={false}>
        {copy.action}<ArrowUpRightIcon size={18} aria-hidden="true" />
      </Link>
    </aside>
  );
}
