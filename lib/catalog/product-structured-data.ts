import type { ProducerContent } from "./content-schema";
import { isDemoProducer } from "./product-commerce";

/** Only call with the same visible, localized content rendered in the profile. */
export function buildProductStructuredData(
  content: ProducerContent,
  canonicalUrl: string,
) {
  if (!content.products.length) return null;
  const demo = isDemoProducer(content.country, content.producer_id);
  const products = content.products.map((product) => {
    const id = `${canonicalUrl}#product-${product.id}`;
    const images = product.media_ids.flatMap((mediaId) => {
      const media = content.gallery.find((item) => item.id === mediaId);
      return media ? [new URL(media.src, canonicalUrl).href] : [];
    });
    return {
      "@type": "Product",
      "@id": id,
      url: id,
      identifier: `${content.country}:${content.producer_id}:${product.id}`,
      name: product.name,
      ...(product.description ? { description: product.description } : {}),
      ...(images.length ? { image: images } : {}),
      ...(!demo ? { manufacturer: { "@id": `${canonicalUrl}#producer` } } : {}),
      ...(demo
        ? {
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Demonstration product",
              value: true,
            },
          }
        : {}),
      ...(!demo && product.price && product.purchase_url
        ? {
            offers: {
              "@type": "Offer",
              url: product.purchase_url,
              price: product.price.amount,
              priceCurrency: product.price.currency,
            },
          }
        : {}),
      subjectOf: { "@id": `${canonicalUrl}#product-record-${product.id}` },
    };
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#producer-content-products`,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": product["@id"] },
        })),
      },
      ...products,
      ...content.products.map((product) => ({
        "@type": "WebPageElement",
        "@id": `${canonicalUrl}#product-record-${product.id}`,
        url: `${canonicalUrl}#product-${product.id}`,
        isPartOf: { "@id": `${canonicalUrl}#webpage` },
        about: { "@id": `${canonicalUrl}#product-${product.id}` },
        inLanguage: product.locale,
        ...(product.updated_on ? { dateModified: product.updated_on } : {}),
      })),
    ],
  };
}
