"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode, Ref } from "react";
import { ProducerFollowToggle } from "@/components/account/producer-follow-toggle";
import type { Locale } from "@/lib/i18n/locales";

export function ProducerMapRosterRow({ item, children, active, itemRef, locale = "es", onPointerEnter, onMouseLeave, onFocus, onBlur }: {
  item: { country: string; producerId: number; name: string; href: string; imageSrc: string };
  children?: ReactNode; active?: boolean; itemRef?: Ref<HTMLLIElement>; locale?: Locale;
} & Pick<ComponentProps<typeof Link>, "onPointerEnter" | "onMouseLeave" | "onFocus" | "onBlur">) {
  return <li ref={itemRef} className={`producer-map-roster-row${active ? " is-active" : ""}`}>
    <Link href={item.href} prefetch={false} className="producer-compact-link"
      onPointerEnter={onPointerEnter} onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}>
      <Image className="producer-map-roster-row__image" src={item.imageSrc} alt="" width={80} height={80} sizes="80px" loading="lazy" />
      <span className="producer-map-roster-row__copy">{children}</span>
    </Link>
    <ProducerFollowToggle country={item.country} producerId={item.producerId} name={item.name} returnTo={item.href} locale={locale} compact />
  </li>;
}
