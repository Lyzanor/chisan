"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import { ChisanMark, ChisanWordmark } from "@/components/brand/chisan-brand";
import chisanWordmark from "@/design/brand/assets/chisan-wordmark-ink.png";
import { getProfileQrLabels } from "@/lib/i18n/profile-qr-labels";
import type { Locale } from "@/lib/i18n/locales";
import {
  buildProfileQrFilename,
  buildProfileQrUrl,
  PROFILE_QR_LABEL_HEIGHT,
  PROFILE_QR_LABEL_WIDTH,
  type ProfileQrKind,
} from "@/lib/profile-qr";

const LABEL_COLORS = {
  background: "#f5f1e8",
  surface: "#fffdf8",
  ink: "#1d201b",
  stone: "#686c66",
  moss: "#52614c",
} as const;
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

function truncateCanvasLine(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
): string {
  if (context.measureText(value).width <= maxWidth) return value;

  const characters = Array.from(value);
  while (characters.length && context.measureText(`${characters.join("")}…`).width > maxWidth) {
    characters.pop();
  }

  return `${characters.join("").trimEnd()}…`;
}

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
): string[] {
  const tokens = value.includes(" ") ? value.split(/\s+/) : Array.from(value);
  const separator = value.includes(" ") ? " " : "";
  const lines: string[] = [];
  let current = "";

  for (const [index, token] of tokens.entries()) {
    const candidate = current ? `${current}${separator}${token}` : token;
    if (!current || context.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = token;
    if (lines.length === 1) {
      const remainder = [current, ...tokens.slice(index + 1)].join(separator);
      lines.push(truncateCanvasLine(context, remainder, maxWidth));
      return lines;
    }
  }

  if (current && lines.length < 2) lines.push(current);
  if (lines.length === 0) lines.push(value);
  lines[lines.length - 1] = truncateCanvasLine(
    context,
    lines[lines.length - 1],
    maxWidth,
  );
  return lines.slice(0, 2);
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
  const qrCanvas = useRef<HTMLCanvasElement>(null);
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
  const labelType = isProducer ? labels.producerLabel : labels.selectionLabel;

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
    const sourceQr = qrCanvas.current;
    if (!sourceQr) {
      setStatus(labels.downloadFailed);
      return;
    }

    try {
      await document.fonts?.ready;
      const wordmark = await loadImage(chisanWordmark.src);
      const canvas = document.createElement("canvas");
      canvas.width = PROFILE_QR_LABEL_WIDTH;
      canvas.height = PROFILE_QR_LABEL_HEIGHT;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable.");

      const accent = isProducer ? LABEL_COLORS.moss : LABEL_COLORS.ink;
      context.fillStyle = LABEL_COLORS.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = accent;
      context.lineWidth = 24;
      context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

      const wordmarkWidth = 420;
      const wordmarkHeight = wordmarkWidth / (wordmark.width / wordmark.height);
      context.drawImage(
        wordmark,
        (canvas.width - wordmarkWidth) / 2,
        88,
        wordmarkWidth,
        wordmarkHeight,
      );

      context.fillStyle = accent;
      context.font = "500 32px 'Noto Sans', sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(labelType.toLocaleUpperCase(locale), canvas.width / 2, 282);

      context.imageSmoothingEnabled = false;
      context.fillStyle = LABEL_COLORS.surface;
      context.fillRect(160, 340, 880, 880);
      context.drawImage(sourceQr, 160, 340, 880, 880);
      context.imageSmoothingEnabled = true;

      context.fillStyle = LABEL_COLORS.ink;
      context.font = "500 56px 'Noto Sans', sans-serif";
      const nameLines = wrapCanvasText(context, name, 960);
      const firstLineY = nameLines.length === 1 ? 1340 : 1308;
      nameLines.forEach((line, index) => {
        context.fillText(line, canvas.width / 2, firstLineY + index * 68);
      });

      context.fillStyle = LABEL_COLORS.stone;
      context.font = "500 32px 'Noto Sans', sans-serif";
      context.fillText("chisan.app", canvas.width / 2, 1500);

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

  return (
    <details className={`profile-qr profile-qr--${kind}`}>
      <summary>
        <ChisanMark alt="" className="profile-qr__mark" />
        <span>
          <strong>{labels.title}</strong>
          <small>{description}</small>
        </span>
        <span className="profile-qr__disclosure" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="profile-qr__body">
        <div className="profile-qr__copy">
          <p className="profile-qr__eyebrow">{labelType}</p>
          <h2>{labels.scan}</h2>
          <p>{description}</p>
          <div className="profile-qr__actions">
            <button type="button" onClick={handleDownload}>
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
                  {labels.copy}
                </span>
                <span className={isCopied ? "is-visible" : undefined}>
                  <CheckIcon size={16} weight="bold" />
                  {labels.copied}
                </span>
              </span>
            </button>
          </div>
          <small>{labels.fileNote}</small>
          <p
            className="profile-qr__status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {isCopied ? <span className="visually-hidden">{status}</span> : status}
          </p>
        </div>

        <figure className="profile-qr__label">
          <ChisanWordmark alt="" className="profile-qr__wordmark" />
          <p>{labelType}</p>
          <div className="profile-qr__code">
            <QRCodeCanvas
              ref={qrCanvas}
              value={profileUrl}
              size={880}
              level="H"
              marginSize={4}
              bgColor={LABEL_COLORS.surface}
              fgColor={LABEL_COLORS.ink}
              title={`${labels.scan}: ${name}`}
              style={{ height: "auto", width: "100%" }}
            />
          </div>
          <figcaption>
            <strong>{name}</strong>
            <span>chisan.app</span>
          </figcaption>
        </figure>
      </div>
    </details>
  );
}
