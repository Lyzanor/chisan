import {
  ArrowUpRightIcon,
  EnvelopeSimpleIcon,
  GlobeIcon,
  PhoneIcon,
  SealCheckIcon,
  WarningCircleIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ComponentType } from "react";

import { ProducerFollowButton } from "@/components/account/producer-follow-button";
import {
  buildCatalogHref,
  type CatalogNavigationScope,
} from "@/lib/catalog-navigation";
import { getCategoryIcon, getCategoryLabel } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/locales";
import { formatMessage, type Messages } from "@/lib/i18n/messages";

export type ProducerSocialLink = {
  url: string;
  label: string;
  Icon: ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" | "false" }>;
};

export type ProducerHeroProps = {
  actionLabels: {
    call: string;
    contact: string;
    whatsapp: string;
  };
  area: string;
  areaHref: string;
  areaLabel: string;
  categories: string[];
  city: string;
  countryHref: string;
  countryLabel: string;
  countrySlug: string;
  description?: string;
  email?: string;
  identityImageSrc: string;
  locale: Locale;
  messages: Messages;
  municipalityHref: string;
  name: string;
  ownershipVerified: boolean;
  phone?: string;
  premiumActive: boolean;
  producerId: number;
  profileWords: {
    pending: string;
    photoCaption: string;
    verified: string;
    verifiedHelp: string;
  };
  returnTo: string;
  scope: CatalogNavigationScope;
  socialLinks: ProducerSocialLink[];
  verification?: string;
  website?: string;
  whatsAppLink?: string | null;
};

export function ProducerHero({
  actionLabels,
  area,
  areaHref,
  areaLabel,
  categories,
  city,
  countryHref,
  countryLabel,
  countrySlug,
  description,
  email,
  identityImageSrc,
  locale,
  messages,
  municipalityHref,
  name,
  ownershipVerified,
  phone,
  premiumActive,
  producerId,
  profileWords,
  returnTo,
  scope,
  socialLinks,
  verification,
  website,
  whatsAppLink,
}: ProducerHeroProps) {
  const hasHeroLinks = Boolean(email || phone || website || socialLinks.length);

  return (
    <header
      id="detail-hero"
      className={`detail-hero detail-hero--identity${premiumActive ? " detail-hero--premium" : ""}`}
    >
      <div className="detail-hero__tab">
        {identityImageSrc ? (
          <div className="detail-identity">
            <Image
              src={identityImageSrc}
              alt={formatMessage(messages.producer.imageAlt, {
                producer: name,
              })}
              width={320}
              height={240}
              sizes="160px"
              priority
            />
          </div>
        ) : null}
        <div className="detail-profile-heading">
          <div className="detail-title">
            <div className="detail-title__name">
              <h1>{name}</h1>
              {ownershipVerified ? (
                <span
                  className="detail-status detail-status--verified"
                  title={profileWords.verifiedHelp}
                >
                  <SealCheckIcon
                    size={20}
                    weight="fill"
                    aria-hidden="true"
                  />
                  {profileWords.verified}
                </span>
              ) : verification === "pendiente" ? (
                <a
                  href="#detail-info"
                  className="detail-status detail-status--pending"
                  aria-label={profileWords.pending}
                  title={profileWords.pending}
                >
                  <WarningCircleIcon size={20} aria-hidden="true" />
                </a>
              ) : null}
            </div>
            <div className="detail-title__follow">
              <Suspense fallback={null}>
                <ProducerFollowButton
                  country={countrySlug}
                  producerId={producerId}
                  returnTo={returnTo}
                  name={name}
                  locale={locale}
                  compact
                />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="detail-context">
            <nav className="detail-breadcrumb" aria-label={messages.producer.navigation}>
              <ol>
                <li><Link href={countryHref} prefetch={false}>{countryLabel}</Link></li>
                <li><Link href={areaHref} prefetch={false}>{areaLabel}</Link></li>
                <li><Link href={municipalityHref} prefetch={false}>{city}</Link></li>
              </ol>
            </nav>
            <div className="detail-subtitle">
              {categories.map((category) => {
                const label = getCategoryLabel(category, locale);
                return (
                  <Link
                    key={category}
                    href={buildCatalogHref({ scope, area, category })}
                    prefetch={false}
                    aria-label={label}
                    title={label}
                  >
                    <span aria-hidden="true">{getCategoryIcon(category)}</span>
                  </Link>
                );
              })}
            </div>
        </div>
      </div>
      {description || hasHeroLinks ? (
        <div className="detail-hero-summary">
          {description ? (
            <p className="detail-intro">{description}</p>
          ) : null}
          {hasHeroLinks ? (
            <div className="detail-hero-links">
              {email || phone ? (
                <div className="detail-actions">
                  {email ? (
                    <a
                      href="#detail-contact"
                      className="detail-action--primary"
                    >
                      <EnvelopeSimpleIcon size={20} aria-hidden="true" />
                      {actionLabels.contact}
                    </a>
                  ) : null}
                  {whatsAppLink ? (
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsappLogoIcon size={20} aria-hidden="true" />
                      {actionLabels.whatsapp}
                    </a>
                  ) : null}
                  {phone ? (
                    <a href="#detail-contact">
                      <PhoneIcon size={20} aria-hidden="true" />
                      {actionLabels.call}
                    </a>
                  ) : null}
                </div>
              ) : null}
              {website ? (
                <a
                  className="detail-website"
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GlobeIcon size={22} aria-hidden="true" />
                  <span>
                    <small>{messages.producer.website}</small>
                    <strong>
                      {website
                        .split(/[?#]/)[0]
                        .replace(/^https?:\/\//, "")
                        .replace(/\/$/, "")}
                    </strong>
                  </span>
                  <ArrowUpRightIcon size={18} aria-hidden="true" />
                </a>
              ) : null}
              {socialLinks.length ? (
                <ul className="detail-social-links">
                  {socialLinks.map(({ url, label, Icon }) => (
                    <li key={label}>
                      <a href={url} target="_blank" rel="noreferrer">
                        <Icon size={18} aria-hidden="true" />
                        <span>{label}</span>
                        <ArrowUpRightIcon size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
