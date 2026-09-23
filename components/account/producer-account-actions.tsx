"use client";

import { ArrowUpRightIcon, ClockIcon, PencilSimpleIcon, CameraIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChisanMascot } from "@/components/brand/chisan-brand";
import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import { newProducerSuggestionPath } from "@/lib/accounts/producer-suggestion-workflow";
import type { Locale } from "@/lib/i18n/locales";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import type { Messages } from "@/lib/i18n/messages";
import { useProducerAccountState } from "./producer-account-provider";

type ProducerSuggestionActionProps = {
  country: string;
  producerId: number;
  messages: Messages["accountActions"];
};

type ProducerAccountActionsProps = ProducerSuggestionActionProps & {
  locale: Locale;
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
  if (activeOwner || membership || claim) return null;

  const suggestionPath = newProducerSuggestionPath(country, producerId);
  const href = !signedIn
    ? `${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(suggestionPath)}`
    : openSuggestion
      ? "/cuenta/sugerencias"
      : suggestionPath;

  return (
    <Link prefetch={false} className="detail-suggest" href={href}>
      <PencilSimpleIcon size={18} aria-hidden="true" />
      {openSuggestion ? messages.viewMySuggestions : messages.suggestChanges}
    </Link>
  );
}

/**
 * The closing section only addresses the producer: an invitation to claim an
 * unverified profile, or the management links of its active members.
 */
export function ProducerAccountActions({
  country,
  producerId,
  messages,
  locale,
}: ProducerAccountActionsProps) {
  const state = useProducerAccountState();
  if (!state) return null;
  const {
    signedIn,
    activeOwner,
    membership,
    claim,
    canClaimProducer,
    canOfferProfileUpgrade,
  } = state;
  const words = producerProfileLabels(locale);

  if (membership) {

    return (
      <ProducerClosingSection title={words.contribute} help={words.contributeHelp}>
        <Link prefetch={false} href={`/cuenta/productores/${country}/${producerId}/editar`}>
          {messages.editMyProfile}
        </Link>
        {membership.role === "owner" ? (
          <Link prefetch={false} href={`/cuenta/productores/${country}/${producerId}/estadisticas`}>
            {getProducerStatsLabels(locale).link}
          </Link>
        ) : null}
        {canOfferProfileUpgrade ? (
          <Link prefetch={false} href={`/cuenta/productores/${country}/${producerId}/ampliar`}>
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
        <Link prefetch={false} href="/cuenta/reclamaciones">
          {messages.viewOwnershipClaim}
        </Link>
      </ProducerClosingSection>
    );
  }
  if (!canClaimProducer) return null;

  return (
    <ProducerClosingSection title={words.participate} help={words.participateHelp}>
      {!signedIn ? (
        <Link prefetch={false} href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(claimPath)}`}>
          {messages.claimProducer}
        </Link>
      ) : (
        <Link prefetch={false} href={claimPath}>{messages.claimProducer}</Link>
      )}
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
  const { signedIn, activeOwner, membership, claim, canClaimProducer } = state;

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
        <Link prefetch={false} href={`/cuenta/productores/${country}/${producerId}/editar#producer-change-gallery`} className="detail-gallery-action__action">
          <span>{words.galleryManageAction}</span>
          <ArrowUpRightIcon size={14} aria-hidden="true" />
        </Link>
      </aside>
    );
  }
  if (activeOwner) return null;

  const claimPath = `/cuenta/reclamaciones/nueva?country=${encodeURIComponent(country)}&producerId=${producerId}`;

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
        <Link prefetch={false} href="/cuenta/reclamaciones" className="detail-gallery-action__action">
          <span>{words.galleryClaimPendingAction}</span>
          <ArrowUpRightIcon size={14} aria-hidden="true" />
        </Link>
      </aside>
    );
  }
  if (!canClaimProducer) return null;

  const href = !signedIn
    ? `${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(claimPath)}`
    : claimPath;

  return (
    <aside className="detail-gallery-action" aria-label={words.galleryClaimTitle}>
      <div className="detail-gallery-action__content">
        <CameraIcon size={20} aria-hidden="true" className="detail-gallery-action__icon" />
        <div className="detail-gallery-action__copy">
          <strong>{words.galleryClaimTitle}</strong>
          <span className="detail-gallery-action__help">{words.galleryClaimHelp}</span>
        </div>
      </div>
      <Link prefetch={false} href={href} className="detail-gallery-action__action">
        <span>{words.galleryClaimAction}</span>
        <ArrowUpRightIcon size={14} aria-hidden="true" />
      </Link>
    </aside>
  );
}

function ProducerClosingSection({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <section
      className="detail-participate"
      aria-labelledby="detail-participate-title"
    >
      <div>
        <h2 id="detail-participate-title">{title}</h2>
        <p>{help}</p>
      </div>
      <div className="producer-account-actions">{children}</div>
    </section>
  );
}
