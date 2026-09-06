import Image from "next/image";
import { standaloneProducerGallery } from "@/lib/catalog/content-schema";

import type { ProducerContent as Content } from "@/lib/catalog/content-schema";
import type { Locale } from "@/lib/i18n/locales";
import { getProducerContentLabels } from "@/lib/i18n/producer-content";

import styles from "./producer-content.module.css";

export function ProducerContent({
  content,
  locale,
}: {
  content: Content;
  locale: Locale;
}) {
  const labels = getProducerContentLabels(locale);
  const media = new Map(content.gallery.map((item) => [item.id, item]));
  const gallery = standaloneProducerGallery(content);
  const links = new Map(content.links.map((item) => [item.id, item]));
  return (
    <div className={styles.content}>
      {content.products.length ? (
        <section aria-labelledby="producer-content-products">
          <h3 id="producer-content-products">{labels.products}</h3>
          <ul className={styles.products}>
            {content.products.map((product) => (
              <li key={product.id} id={`product-${product.id}`}>
                <h4 lang={product.locale}>{product.name}</h4>
                {product.description ? (
                  <p lang={product.locale}>{product.description}</p>
                ) : null}
                {product.media_ids.length ? (
                  <div className={styles.productImages}>
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
                        {item.caption || item.credit ? <figcaption lang={item.locale}>{item.caption}{item.caption && item.credit ? " · " : ""}{item.credit}</figcaption> : null}
                        </figure>
                      ) : null;
                    })}
                  </div>
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
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {gallery.length ? (
        <section aria-labelledby="producer-content-gallery">
          <h3 id="producer-content-gallery">{labels.gallery}</h3>
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
          <h3 id="producer-content-links">{labels.links}</h3>
          <ul className={styles.links}>
            {content.links.map((item) => (
              <li key={item.id} id={`link-${item.id}`}>
                <a
                  href={item.url}
                  lang={item.locale}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
