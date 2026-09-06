import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

export type SimilarProducerCard = Readonly<{
  producerId: number;
  href: string;
  name: string;
  city: string;
  category: string;
  distance: string;
  imageSrc: string;
  accessibleLabel: string;
}>;

export function SimilarProducers({
  title,
  producers,
}: {
  title: string;
  producers: readonly SimilarProducerCard[];
}) {
  if (producers.length === 0) {
    return null;
  }

  return (
    <section className="detail-similar" aria-labelledby="detail-similar-title">
      <h2 id="detail-similar-title">{title}</h2>
      <div className="detail-similar-grid">
        {producers.map((producer) => (
          <article className="detail-similar-card" key={producer.producerId}>
            <Link href={producer.href} aria-label={producer.accessibleLabel}>
              <span className="detail-similar-card__media">
                <Image
                  src={producer.imageSrc}
                  alt=""
                  width={360}
                  height={270}
                  sizes="(max-width: 720px) calc(100vw - 4rem), (max-width: 1080px) 33vw, 360px"
                  loading="lazy"
                />
              </span>
              <span className="detail-similar-card__content">
                <span className="detail-similar-card__category">
                  {producer.category}
                </span>
                <strong>{producer.name}</strong>
                <span>{producer.city}</span>
                <small>
                  {producer.distance}
                  <ArrowRightIcon size={17} aria-hidden="true" />
                </small>
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
