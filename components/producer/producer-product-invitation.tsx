"use client";

import Link from "next/link";
import { PlusIcon } from "@phosphor-icons/react";
import { useProducerAccountState } from "@/components/account/producer-account-provider";
import { producerProPath } from "@/lib/accounts/pro-paths";
import type { Locale } from "@/lib/i18n/locales";

export function ProducerProductInvitation({ country, producerId, locale, premiumActive }: {
  country: string; producerId: number; locale: Locale; premiumActive: boolean;
}) {
  const state = useProducerAccountState();
  const label = locale === "es" ? "Añadir productos con Productor Pro" : locale === "ca" ? "Afegir productes amb Productor Pro" : "Add products with Producer Pro";
  const href = state?.membership && premiumActive
    ? `/cuenta/productores/${country}/${producerId}/editar#producer-change-products`
    : producerProPath(country, producerId);
  return <Link className="chisan-button chisan-button--quiet chisan-button--icon" href={href} prefetch={false} aria-label={label} title={label}>
    <PlusIcon size={22} aria-hidden="true" />
  </Link>;
}
