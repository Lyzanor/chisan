import { producerSeasonLabels, seasonMonthLabel } from "@/lib/i18n/producer-season";
import { ProductPurchaseDetails } from "./product-purchase-details";
import { isDemoProducer } from "@/lib/catalog/product-commerce";

import Image from "next/image";
import { standaloneProducerGallery } from "@/lib/catalog/content-schema";
import { ProducerPhotoDetails } from "@/components/producer-photo-details";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";

import type { ProducerContent as Content } from "@/lib/catalog/content-schema";
import type { Locale } from "@/lib/i18n/locales";
import { getProducerContentLabels } from "@/lib/i18n/producer-content";

import styles from "./producer-content.module.css";

export function ProducerContent({
  content,
  locale,
  showGallery = true,
}: {
  content: Content;
  locale: Locale;
  showGallery?: boolean;
}) {
  const season = producerSeasonLabels(locale);
  const labels = getProducerContentLabels(locale);
  const captionLabel = producerProfileLabels(locale).photoCaption;
  const media = new Map(content.gallery.map((item) => [item.id, item]));
  const gallery = standaloneProducerGallery(content);
  const links = new Map(content.links.map((item) => [item.id, item]));
  return (
    <div className={styles.content}>
      {content.products.length ? (
        <section aria-labelledby="producer-content-products">
          <h2 id="producer-content-products">{labels.products}</h2>
          <ul className={styles.products}>
            {content.products.map((product) => (
              <li key={product.id} id={`product-${product.id}`}>
                <h3 lang={product.locale}>{product.name}</h3>
                {product.season_months?.length ? <p>{product.seasonal_special ? <strong>{season.special} · </strong> : null}{season.title}: {product.season_months.map(month => seasonMonthLabel(month, locale)).join(", ")}</p> : null}
                {product.media_ids.length ? (
                  <div className={styles.productImages} role="group" aria-label={`${labels.gallery}: ${product.name}`} tabIndex={0}>
                    {product.media_ids.map((id) => {
                      const item = media.get(id);
                      return item ? (
                        <figure key={id}>
                        <Image
                          src={item.src}
                          alt={item.alt}
                          lang={item.locale}
                          width={item.width}
                          height={item.height}
                          sizes="(max-width: 600px) 80vw, 320px"
                          loading="lazy"
                        />
                        <ProducerPhotoDetails photo={item} label={captionLabel} />
                        </figure>
                      ) : null;
                    })}
                  </div>
                ) : null}
                {product.description ? (
                  <p lang={product.locale}>{product.description}</p>
                ) : null}
                {product.link_ids.length ? (
                  <ul className={styles.links}>
                    {product.link_ids.map((id) => {
                      const item = links.get(id);
                      return item ? (
                        <li key={id}>
                          <a
                            href={item.url}
                            lang={item.locale}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {item.label}
                          </a>
                        </li>
                      ) : null;
                    })}
                  </ul>
                ) : null}
                <ProductPurchaseDetails product={product} locale={locale} demo={isDemoProducer(content.country, content.producer_id)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {showGallery && gallery.length ? (
        <section aria-labelledby="producer-content-gallery">
          <h2 id="producer-content-gallery">{labels.gallery}</h2>
          <div className={styles.gallery}>
            {gallery.map((item) => (
              <figure key={item.id} id={`media-${item.id}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  lang={item.locale}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 600px) 90vw, 400px"
                  loading="lazy"
                />
                {item.caption || item.credit ? (
                  <figcaption lang={item.locale}>
                    {item.caption}
                    {item.caption && item.credit ? " · " : ""}
                    {item.credit}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
      {content.links.length ? (
        <section aria-labelledby="producer-content-links">
          <h2 id="producer-content-links">{labels.links}</h2>
          <ul className={styles.featuredLinks}>
            {content.links.map((item) => (
              <li key={item.id} id={`link-${item.id}`}>
                <a
                  href={item.url}
                  lang={item.locale}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className={styles.linkPreview} aria-hidden="true">{new URL(item.url).hostname.replace(/^www\./, "").slice(0, 1).toUpperCase()}</span>
                  <span className={styles.linkCopy}><strong>{item.label}</strong><small>{new URL(item.url).hostname.replace(/^www\./, "")}</small></span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
