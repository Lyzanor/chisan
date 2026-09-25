"use client";

import { CheckIcon, ShareNetworkIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n/locales";

export type ProducerShareButtonProps = Readonly<{
  name: string;
  returnTo: string;
  locale?: Locale;
  description?: string;
}>;

const SHARE_WORDS: Record<Locale, { share: string; copied: string }> = {
  es: { share: "Compartir", copied: "Enlace copiado" },
  ca: { share: "Compartir", copied: "Enllaç copiat" },
  en: { share: "Share", copied: "Link copied" },
  de: { share: "Teilen", copied: "Link kopiert" },
  ja: { share: "共有", copied: "リンクをコピーしました" },
  fr: { share: "Partager", copied: "Lien copié" },
  it: { share: "Condividi", copied: "Link copiato" },
  nl: { share: "Delen", copied: "Link gekopieerd" },
  pt: { share: "Partilhar", copied: "Ligação copiada" },
  af: { share: "Deel", copied: "Skakel gekopieer" },
  as: { share: "ভাগ-বতৰা কৰক", copied: "লিংক প্ৰতিলিপি কৰা হ’ল" },
  bn: { share: "শেয়ার করুন", copied: "লিঙ্ক কপি করা হয়েছে" },
  cy: { share: "Rhannu", copied: "Dolen wedi'i chopïo" },
  ga: { share: "Comhroinn", copied: "Nasc cóipeáilte" },
  gd: { share: "Co-roinn", copied: "Ceangal air a chopaigeadh" },
  gu: { share: "શેર કરો", copied: "લિંક કૉપિ થઈ ગઈ" },
  haw: { share: "Kaʻana", copied: "Ua kope ʻia ka loulou" },
  hi: { share: "साझा करें", copied: "लिंक कॉपी किया गया" },
  kn: { share: "ಹಂಚಿಕೊಳ್ಳಿ", copied: "ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ" },
  kok: { share: "वांटून घेयात", copied: "दुवो प्रत केलो" },
  ml: { share: "പങ്കിടുക", copied: "ലിങ്ക് പകർത്തി" },
  mr: { share: "शेअर करा", copied: "लिंक कॉपी केली" },
  ne: { share: "साझा गर्नुहोस्", copied: "लिङ्क प्रतिलिपि गरियो" },
  nso: { share: "Abelana", copied: "Lentsu le kopišitšwe" },
  or: { share: "ସେୟାର କରନ୍ତୁ", copied: "ଲିଙ୍କ୍ କପି ହୋଇଛି" },
  pa: { share: "ਸਾਂਝਾ ਕਰੋ", copied: "ਲਿੰਕ ਕਾਪੀ ਕੀਤਾ ਗਿਆ" },
  ss: { share: "Yabelana", copied: "I-link ikopishiwe" },
  st: { share: "Arolelana", copied: "Khokahano e kopitsitsoe" },
  ta: { share: "பகிர்", copied: "இணைப்பு நகலெடுக்கப்பட்டது" },
  te: { share: "భాగస్వామ్యం చేయండి", copied: "లింక్ కాపీ చేయబడింది" },
  tn: { share: "Abelana", copied: "Kgokagano e kopolotswe" },
  xh: { share: "Yabelana", copied: "Ikhonkco likotshelwe" },
  zu: { share: "Yabelana", copied: "Isixhumanisi sikopishiwe" },
};

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to textarea execCommand fallback
    }
  }

  if (typeof document === "undefined") return false;
  try {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    return copied;
  } catch {
    return false;
  }
}

export function ProducerShareButton({
  name,
  returnTo,
  locale = "es",
  description,
}: ProducerShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const words = SHARE_WORDS[locale] ?? SHARE_WORDS.es;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? returnTo
          ? new URL(returnTo, window.location.origin).href
          : window.location.href
        : returnTo;

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: `${name} · Chisan`,
          text: description || `${name} · Chisan`,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") {
          return;
        }
      }
    }

    const success = await copyText(shareUrl);
    if (success) {
      setCopied(true);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
    }
  };

  const label = copied ? words.copied : `${words.share} · ${name}`;

  return (
    <span className="producer-share-control">
      <button
        type="button"
        className="producer-share-button"
        aria-label={label}
        title={label}
        data-copied={copied ? "true" : undefined}
        onClick={handleShare}
      >
        {copied ? (
          <CheckIcon size={20} aria-hidden="true" />
        ) : (
          <ShareNetworkIcon size={20} aria-hidden="true" />
        )}
      </button>
      {copied ? (
        <span className="producer-share-tooltip" role="status">
          {words.copied}
        </span>
      ) : null}
    </span>
  );
}
