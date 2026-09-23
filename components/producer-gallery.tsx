import Image from "next/image";
import type { CSSProperties } from "react";
import type { ProducerContent } from "@/lib/catalog/content-schema";
import styles from "./producer-gallery.module.css";
import { ProducerPhotoDetails } from "./producer-photo-details";

type Photo = ProducerContent["gallery"][number];

// A panoramic crop needs a landscape photo with enough pixels to stay sharp.
const COVER_MIN_WIDTH = 1200;
const COVER_MIN_RATIO = 1.3;

/** The first reviewed landscape photo becomes the cover; the rest form the strip. */
export function splitProducerPhotos(gallery: readonly Photo[]) {
  const cover =
    gallery.find(
      (photo) =>
        photo.width >= COVER_MIN_WIDTH &&
        photo.width / photo.height >= COVER_MIN_RATIO,
    ) ?? null;
  return { cover, photos: gallery.filter((photo) => photo !== cover) };
}

export function ProducerCover({
  photo,
  captionLabel,
}: {
  photo: Photo;
  captionLabel: string;
}) {
  return (
    <figure className="detail-cover">
      <div className="detail-cover__frame">
        <Image
          src={photo.src}
          alt={photo.alt}
          lang={photo.locale}
          width={photo.width}
          height={photo.height}
          sizes="100vw"
          priority
        />
      </div>
      <ProducerPhotoDetails photo={photo} label={captionLabel} />
    </figure>
  );
}

/** One row of photos at their honest aspect ratios. Every photo shares the row
 * height; narrow screens and long galleries scroll sideways instead of cropping. */
export function ProducerGallery({
  photos,
  title,
  captionLabel,
}: {
  photos: readonly Photo[];
  title: string;
  captionLabel: string;
}) {
  if (!photos.length) return null;
  const ratios = photos.map((photo) => photo.width / photo.height);
  const strip = {
    gridTemplateColumns: ratios
      .map(
        (ratio) =>
          `minmax(calc(${ratio.toFixed(4)} * var(--gallery-min-height)), ${ratio.toFixed(4)}fr)`,
      )
      .join(" "),
    width: `min(100%, calc(${ratios.reduce((sum, ratio) => sum + ratio, 0).toFixed(4)} * var(--gallery-max-height) + ${photos.length - 1} * var(--gallery-gap)))`,
  } satisfies CSSProperties;
  return (
    <section
      id="detail-gallery"
      className="detail-gallery"
      aria-labelledby="detail-gallery-title"
    >
      <h2 id="detail-gallery-title">{title}</h2>
      <div
        className={styles.strip}
        style={strip}
        role="group"
        aria-labelledby="detail-gallery-title"
        tabIndex={0}
      >
        {photos.map((photo) => (
          <figure key={photo.id} className={styles.photo}>
            <div className={styles.frame}>
              <Image
                src={photo.src}
                alt={photo.alt}
                lang={photo.locale}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 760px) 80vw, 36rem"
                loading="lazy"
                className={styles.image}
              />
            </div>
            <ProducerPhotoDetails photo={photo} label={captionLabel} />
          </figure>
        ))}
      </div>
    </section>
  );
}
