"use client";

import Image from "next/image";
import { useState } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { getYoutubePlayerLabels } from "@/lib/i18n/youtube-player";
import {
  youtubePrivacyEmbedUrl,
  youtubeThumbnailUrl,
} from "@/lib/youtube";

export function YoutubePlayer({
  videoUrl,
  label,
  locale,
}: {
  videoUrl: string;
  label: string;
  locale: Locale;
}) {
  const [playing, setPlaying] = useState(false);
  const [posterUrl, setPosterUrl] = useState(
    () => youtubeThumbnailUrl(videoUrl) ?? "",
  );
  const words = getYoutubePlayerLabels(locale);
  const embedUrl = youtubePrivacyEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer">
        {label} · YouTube
      </a>
    );
  }

  return (
    <section className="producer-video" aria-labelledby="producer-video-title">
      <div className="producer-video__heading">
        <h3 id="producer-video-title">{label}</h3>
        <span>YouTube</span>
      </div>
      <div className="producer-video__frame">
        {playing ? (
          <iframe
            src={embedUrl}
            title={`${label} · YouTube`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <>
            <Image
              className="producer-video__poster"
              src={posterUrl}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 960px) 100vw, 880px"
              referrerPolicy="no-referrer"
              onError={() => {
                const fallback = youtubeThumbnailUrl(videoUrl, "hqdefault");
                if (fallback && fallback !== posterUrl) setPosterUrl(fallback);
              }}
            />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`${words.play}: ${label}`}
            >
              <span className="producer-video__play" aria-hidden="true" />
              <span>
                <strong>{words.play}</strong>
                <small>{words.notice}</small>
              </span>
            </button>
          </>
        )}
      </div>
      <a href={videoUrl} target="_blank" rel="noopener noreferrer">
        {words.external} <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
