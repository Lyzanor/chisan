"use client";

import { ArrowUpRightIcon, ClockIcon, PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChisanMascot } from "@/components/brand/chisan-brand";
import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import { newProducerSuggestionPath } from "@/lib/accounts/producer-suggestion-workflow";
import type { Locale } from "@/lib/i18n/locales";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import type { Messages } from "@/lib/i18n/messages";
import { SITE_CONTACT_EMAIL } from "@/lib/site";
import { useProducerAccountState } from "./producer-account-provider";

type ProducerSuggestionActionProps = {
  country: string;
  producerId: number;
  messages: Messages["accountActions"];
};

type ProducerAccountActionsProps = ProducerSuggestionActionProps & {
  locale: Locale;
};

type ProducerClaimActionProps = ProducerAccountActionsProps & {
  accountsEnabled: boolean;
  ownershipVerified: boolean;
  producerName: string;
  profileUrl: string;
};

/** Community corrections, shown beside the profile details and their notice. */
export function ProducerSuggestionAction({
  country,
  producerId,
  messages,
}: ProducerSuggestionActionProps) {
  const state = useProducerAccountState();
  if (!state) return null;
  const { signedIn, activeOwner, membership, claim, openSuggestion } =
    state;

  // Only an unclaimed producer accepts community corrections: once ownership is
  // verified, its holder maintains the profile through the producer editor.
  if (membership) return <Link prefetch={false} className="chisan-button chisan-button--quiet chisan-button--icon" href={`/cuenta/productores/${country}/${producerId}/editar`} aria-label={messages.editMyProfile} title={messages.editMyProfile}><PlusIcon size={20} aria-hidden="true" /></Link>;
  if (activeOwner || claim) return null;

  const suggestionPath = newProducerSuggestionPath(country, producerId);
  const href = !signedIn
    ? `${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(suggestionPath)}`
    : openSuggestion
      ? "/cuenta/sugerencias"
      : suggestionPath;

  return (
    <Link prefetch={false} className="chisan-button chisan-button--quiet chisan-button--icon" href={href} aria-label={openSuggestion ? messages.viewMySuggestions : messages.suggestChanges} title={openSuggestion ? messages.viewMySuggestions : messages.suggestChanges}>
      <PlusIcon size={18} aria-hidden="true" />
    </Link>
  );
}

/**
 * The closing section only addresses the producer: an invitation to claim an
 * unverified profile, or the management links of its active members.
 */
export function ProducerAccountActions({
  accountsEnabled,
  country,
  producerId,
  producerName,
  profileUrl,
  ownershipVerified,
  messages,
  locale,
}: ProducerClaimActionProps) {
  const state = useProducerAccountState();
  const words = producerProfileLabels(locale);
  if (!accountsEnabled) {
    if (ownershipVerified) return null;
    const subject = encodeURIComponent(`${words.participateEmailSubject}: ${producerName}`);
    const body = encodeURIComponent(`${words.participateEmailBody}\n\n${profileUrl}\n${country.toUpperCase()} #${producerId}`);
    return (
      <ProducerClosingSection title={words.participate} help={words.participateOfflineHelp} mascot>
        <a className="chisan-button chisan-button--primary" href={`mailto:${SITE_CONTACT_EMAIL}?subject=${subject}&body=${body}`}>
          {words.participateEmailAction}
        </a>
      </ProducerClosingSection>
    );
  }
  if (!state) return null;
  const {
    signedIn,
    activeOwner,
    membership,
    claim,
    canClaimProducer,
    canOfferProfileUpgrade,
  } = state;
  if (membership) {

    return (
      <ProducerClosingSection title={words.contribute} help={words.contributeHelp}>
        <Link className="chisan-button chisan-button--primary" prefetch={false} href={`/cuenta/productores/${country}/${producerId}/editar`}>
          {messages.editMyProfile}
        </Link>
        {membership.role === "owner" ? (
          <Link className="chisan-button" prefetch={false} href={`/cuenta/productores/${country}/${producerId}/estadisticas`}>
            {getProducerStatsLabels(locale).link}
          </Link>
        ) : null}
        {canOfferProfileUpgrade ? (
          <Link className="chisan-button" prefetch={false} href={`/cuenta/productores/${country}/${producerId}/ampliar`}>
            {messages.expandProfile}
          </Link>
        ) : null}
      </ProducerClosingSection>
    );
  }

  if (activeOwner) return null;

  const claimPath = `/cuenta/reclamaciones/nueva?country=${encodeURIComponent(country)}&producerId=${producerId}`;
  if (claim) {
    return (
      <ProducerClosingSection title={words.participate} help={words.participateHelp}>
        <Link className="chisan-button chisan-button--primary" prefetch={false} href="/cuenta/reclamaciones">
          {messages.viewOwnershipClaim}
        </Link>
      </ProducerClosingSection>
    );
  }
  if (!canClaimProducer) return null;

  return (
    <ProducerClosingSection title={words.participate} help={words.participateHelp} mascot>
      {!signedIn ? (
        <Link className="chisan-button chisan-button--primary" prefetch={false} href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(claimPath)}`}>
          {messages.claimProducer}
        </Link>
      ) : (
        <Link className="chisan-button chisan-button--primary" prefetch={false} href={claimPath}>{messages.claimProducer}</Link>
      )}
      <Link className="chisan-link" prefetch={false} href="/soy-productor">
        {locale === "es" ? "Más información para productores" : locale === "ca" ? "Més informació per a productors" : "More information for producers"}
      </Link>
    </ProducerClosingSection>
  );
}

/**
 * Gallery invitation, with a direct editing link for the producer’s members.
 */
export function ProducerGalleryAction({
  country,
  producerId,
  locale,
}: ProducerAccountActionsProps) {
  const state = useProducerAccountState();
  if (!state) return null;
  const { activeOwner, membership, claim } = state;

  const words = producerProfileLabels(locale);
  if (membership) {
    return (
      <aside className="detail-gallery-action" aria-label={words.galleryManageTitle}>
        <div className="detail-gallery-action__content">
          <ChisanMascot state="gallery" size={64} alt="" />
          <div className="detail-gallery-action__copy">
            <strong>{words.galleryManageTitle}</strong>
            <span className="detail-gallery-action__help">{words.freeGalleryHelp}</span>
          </div>
        </div>
        <Link prefetch={false} href={`/cuenta/productores/${country}/${producerId}/editar#producer-change-gallery`} className="chisan-button detail-gallery-action__action">
          <span>{words.galleryManageAction}</span>
          <ArrowUpRightIcon size={14} aria-hidden="true" />
        </Link>
      </aside>
    );
  }
  if (activeOwner) return null;

  if (claim) {
    return (
      <aside className="detail-gallery-action detail-gallery-action--pending" aria-label={words.galleryClaimPendingTitle}>
        <div className="detail-gallery-action__content">
          <ClockIcon size={20} aria-hidden="true" className="detail-gallery-action__icon" />
          <div className="detail-gallery-action__copy">
            <strong>{words.galleryClaimPendingTitle}</strong>
            <span className="detail-gallery-action__help">{words.galleryClaimPendingHelp}</span>
          </div>
        </div>
        <Link prefetch={false} href="/cuenta/reclamaciones" className="chisan-button detail-gallery-action__action">
          <span>{words.galleryClaimPendingAction}</span>
          <ArrowUpRightIcon size={14} aria-hidden="true" />
        </Link>
      </aside>
    );
  }
  return null;
}

function ProducerClosingSection({
  title,
  help,
  children,
  mascot = false,
}: {
  title: string;
  help: string;
  children: ReactNode;
  mascot?: boolean;
}) {
  return (
    <section
      className={`detail-participate${mascot ? " detail-participate--claim" : ""}`}
      aria-labelledby="detail-participate-title"
    >
      {mascot ? <span className="detail-participate__mascot"><ChisanMascot state="gallery" size={64} alt="" /></span> : null}
      <div>
        <h2 id="detail-participate-title">{title}</h2>
        <p>{help}</p>
      </div>
      <div className="producer-account-actions">{children}</div>
    </section>
  );
}
