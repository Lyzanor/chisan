"use client";

import Image from "next/image";
import { useRef, useState, type TouchEvent } from "react";
import type { ProducerContent } from "@/lib/catalog/content-schema";
import type { Locale } from "@/lib/i18n/locales";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import styles from "./producer-gallery.module.css";

type Photo = Pick<
  ProducerContent["gallery"][number],
  "src" | "alt" | "width" | "height"
> &
  Partial<
    Pick<ProducerContent["gallery"][number], "caption" | "credit" | "locale">
  >;
export function ProducerGallery({
  featured,
  gallery,
  locale,
}: {
  featured: Photo;
  gallery: Photo[];
  locale: Locale;
}) {
  const photos = [
    featured,
    ...gallery.filter((photo) => photo.src !== featured.src),
  ];
  const [index, setIndex] = useState(0);
  const activeIndex = Math.min(index, photos.length - 1);
  const photo = photos[activeIndex];
  const touch = useRef<{ x: number; y: number } | null>(null);
  const words = producerProfileLabels(locale);
  const step = (by: number) =>
    setIndex(
      (current) =>
        (Math.min(current, photos.length - 1) + by + photos.length) %
        photos.length,
    );
  function startSwipe(event: TouchEvent) {
    touch.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }
  function swipe(event: TouchEvent) {
    if (touch.current !== null) {
      const delta = event.changedTouches[0].clientX - touch.current.x;
      const vertical = event.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(delta) > 50 && Math.abs(delta) > Math.abs(vertical)) {
        event.preventDefault();
        step(delta > 0 ? -1 : 1);
      }
    }
    touch.current = null;
  }
  const caption = (
    <>
      {photo.caption}
      {photo.caption && photo.credit ? " · " : ""}
      {photo.credit}
    </>
  );
  return (
    <div className={styles.gallery} aria-label={words.gallery}>
      <figure className={styles.featured}>
        <div
          className={styles.frame}
          onTouchStart={photos.length > 1 ? startSwipe : undefined}
          onTouchEnd={photos.length > 1 ? swipe : undefined}
        >
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            lang={photo.locale}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 760px) calc(100vw - 64px), (max-width: 980px) 45vw, 560px"
            priority={activeIndex === 0}
            loading="eager"
            className={styles.image}
          />
        </div>
        {photo.caption || photo.credit ? (
          <figcaption lang={photo.locale}>{caption}</figcaption>
        ) : null}
      </figure>
      {photos.length > 1 ? (
        <div className={styles.thumbnails}>
          {photos.map((item, position) => (
            <button
              type="button"
              key={item.src}
              aria-label={`${position + 1}. ${item.alt}`}
              aria-pressed={position === activeIndex}
              onClick={() => setIndex(position)}
            >
              <Image
                src={item.src}
                alt=""
                width={96}
                height={72}
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
