import Image from "next/image";
import Link from "next/link";
import type { Ref } from "react";

export type ProducerMapSelectionCardItem = {
  href: string;
  name: string;
  description: string;
  imageSrc: string;
};

export function ProducerMapSelectionCard({
  producer,
  linkRef,
}: {
  producer: ProducerMapSelectionCardItem;
  linkRef?: Ref<HTMLAnchorElement>;
}) {
  return (
    <article className="producer-map-selection-card">
      <Link
        ref={linkRef}
        className="producer-map-selection-card__link"
        href={producer.href}
        prefetch={false}
      >
        <span className="producer-map-selection-card__media">
          <Image
            src={producer.imageSrc}
            alt=""
            width={160}
            height={120}
            sizes="(max-width: 620px) 104px, 128px"
            loading="lazy"
            className="producer-map-selection-card__image"
          />
        </span>
        <span className="producer-map-selection-card__content">
          <strong>{producer.name}</strong>
          {producer.description ? <span>{producer.description}</span> : null}
        </span>
      </Link>
    </article>
  );
}
