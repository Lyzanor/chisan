"use client";

import { ArrowRightIcon, CheckIcon, CopyIcon, DownloadSimpleIcon, QrCodeIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

import { ChisanMark } from "@/components/brand/chisan-brand";
import { CHISAN_QR_COLORS } from "@/components/brand/chisan-qr-code";
import { ProfileQrSticker } from "@/components/profile-qr-sticker";
import {
  CHISAN_MARK_INK_SRC,
  CHISAN_MARK_SRC,
  CHISAN_WORDMARK_INK_SRC,
  CHISAN_WORDMARK_SRC,
} from "@/lib/brand";
import { getProfileQrLabels } from "@/lib/i18n/profile-qr-labels";
import type { Locale } from "@/lib/i18n/locales";
import {
  buildProfileQrFilename,
  buildProfileQrUrl,
  type ProfileQrKind,
} from "@/lib/profile-qr";
import { drawProfileQrSticker } from "@/lib/profile-qr-canvas";

const COPY_FEEDBACK_DURATION_MS = 1_500;

export type ProfileQrLabelProps = Readonly<{
  kind: ProfileQrKind;
  locale: Locale;
  name: string;
  path: string;
}>;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject(new Error("Image failed to load.")), {
      once: true,
    });
    image.src = src;
  });
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Copy failed.");
}

export function ProfileQrLabel({ kind, locale, name, path }: ProfileQrLabelProps) {
  const figure = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  const copyResetTimerRef = useRef<number | null>(null);
  const copyFeedbackGenerationRef = useRef(0);
  const [status, setStatus] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const labels = getProfileQrLabels(locale);
  const profileUrl = buildProfileQrUrl(path);
  const isProducer = kind === "producer";
  const description = isProducer
    ? labels.producerDescription
    : labels.selectionDescription;
  const scanLabel = isProducer ? labels.scan : labels.selectionDescription;
  const labelType = isProducer ? labels.producerLabel : labels.selectionLabel;
  const bandLabel = labelType.toLocaleUpperCase(locale);

  useEffect(
    () => () => {
      copyFeedbackGenerationRef.current += 1;
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    },
    [],
  );

  function clearCopyFeedback() {
    copyFeedbackGenerationRef.current += 1;
    if (copyResetTimerRef.current !== null) {
      window.clearTimeout(copyResetTimerRef.current);
      copyResetTimerRef.current = null;
    }
    setIsCopied(false);
    setStatus("");
  }

  async function handleCopy() {
    clearCopyFeedback();
    const copyFeedbackGeneration = copyFeedbackGenerationRef.current;
    try {
      await copyText(profileUrl);
      if (copyFeedbackGenerationRef.current !== copyFeedbackGeneration) return;
      setIsCopied(true);
      setStatus(labels.copied);
      copyResetTimerRef.current = window.setTimeout(() => {
        if (copyFeedbackGenerationRef.current !== copyFeedbackGeneration) return;
        setIsCopied(false);
        setStatus("");
        copyResetTimerRef.current = null;
      }, COPY_FEEDBACK_DURATION_MS);
    } catch {
      if (copyFeedbackGenerationRef.current !== copyFeedbackGeneration) return;
      setStatus(labels.copyFailed);
    }
  }

  async function handleDownload() {
    clearCopyFeedback();
    const downloadFeedbackGeneration = copyFeedbackGenerationRef.current;
    const source = figure.current;
    if (!source) {
      setStatus(labels.downloadFailed);
      return;
    }

    try {
      await document.fonts?.ready;
      const [wordmark, mark] = await Promise.all([
        loadImage(isProducer ? CHISAN_WORDMARK_SRC : CHISAN_WORDMARK_INK_SRC),
        loadImage(isProducer ? CHISAN_MARK_SRC : CHISAN_MARK_INK_SRC),
      ]);
      const canvas = drawProfileQrSticker({
        accent: isProducer ? CHISAN_QR_COLORS.moss : CHISAN_QR_COLORS.ink,
        fontFamily: getComputedStyle(source).fontFamily,
        label: bandLabel,
        mark,
        value: profileUrl,
        wordmark,
      });

      const link = document.createElement("a");
      link.download = buildProfileQrFilename(kind, name);
      link.href = canvas.toDataURL("image/png");
      document.body.append(link);
      link.click();
      link.remove();
      if (
        copyFeedbackGenerationRef.current === downloadFeedbackGeneration
      ) {
        setStatus("");
      }
    } catch {
      if (
        copyFeedbackGenerationRef.current === downloadFeedbackGeneration
      ) {
        setStatus(labels.downloadFailed);
      }
    }
  }

  const labelFigure = (
    <figure ref={figure} className="profile-qr__label">
      <ProfileQrSticker
        kind={kind}
        label={bandLabel}
        title={`${scanLabel}: ${name}`}
        value={profileUrl}
      />
    </figure>
  );

  const actions = (
    <>
      <div className="profile-qr__actions">
        <button type="button" onClick={handleDownload}>
          <DownloadSimpleIcon size={18} aria-hidden="true" />
          {labels.download}
        </button>
        <button
          type="button"
          className="profile-qr__action--secondary profile-qr__copy-button"
          aria-label={labels.copy}
          onClick={handleCopy}
        >
          <span className="profile-qr__copy-label" aria-hidden="true">
            <span className={isCopied ? undefined : "is-visible"}>
              <CopyIcon size={18} />
              {labels.copy}
            </span>
            <span className={isCopied ? "is-visible" : undefined}>
              <CheckIcon size={16} weight="bold" />
              {labels.copied}
            </span>
          </span>
        </button>
      </div>
      <small className="profile-qr__note">{labels.fileNote}</small>
      <p
        className="profile-qr__status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isCopied ? <span className="visually-hidden">{status}</span> : status}
      </p>
    </>
  );

  // Producer stickers are downloaded from the owner's account, never from the
  // public profile, so they render in place without a dialog.
  if (isProducer) return (
    <section className="profile-qr profile-qr--producer profile-qr--inline" aria-label={scanLabel}>
      {labelFigure}
      <div className="profile-qr__copy">{actions}</div>
    </section>
  );

  return (
    <div className={`profile-qr profile-qr--${kind}`}>
      <button
        ref={trigger}
        type="button"
        className="profile-qr__trigger"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={() => dialog.current?.showModal()}
      >
        <span className="profile-qr__identity" aria-hidden="true">
          <ChisanMark alt="" className="profile-qr__mark" ink={!isProducer} />
          <QrCodeIcon size={32} />
        </span>
        <span>
          <strong>{labels.selectionTitle}</strong>
          <small>{description}</small>
        </span>
        <ArrowRightIcon className="profile-qr__arrow" size={24} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        id={dialogId}
        className="profile-qr__dialog"
        aria-labelledby={`${dialogId}-title`}
        onClose={() => {
          clearCopyFeedback();
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="profile-qr__body">
          <button
            type="button"
            className="profile-qr__close"
            aria-label={labels.close}
            onClick={() => dialog.current?.close()}
          >
            <XIcon size={24} aria-hidden="true" />
          </button>
          <div className="profile-qr__copy">
            <p className="profile-qr__eyebrow">{labelType}</p>
            <h2 id={`${dialogId}-title`}>{scanLabel}</h2>
            <p>{description}</p>
            {actions}
          </div>

          {labelFigure}
        </div>
      </dialog>
    </div>
  );
}
