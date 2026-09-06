import type { ProducerContent } from "@/lib/catalog/content-schema";
import { publicContentUrl } from "@/lib/catalog/public-content-url";
import {
  productPriceSchema,
  productUpdateDateSchema,
} from "@/lib/catalog/product-commerce";
import type { Locale } from "@/lib/i18n/locales";
import {
  formatProductPrice,
  getProductCommerceLabels,
  productUpdatePresentation,
} from "@/lib/i18n/product-commerce";
import styles from "./producer-content.module.css";

export function ProductPurchaseDetails({
  product,
  locale,
  demo = false,
}: {
  product: ProducerContent["products"][number];
  locale: Locale;
  demo?: boolean;
}) {
  const words = getProductCommerceLabels(locale);
  const price = productPriceSchema.safeParse(product.price);
  const purchase = publicContentUrl.safeParse(product.purchase_url);
  const date = productUpdateDateSchema.safeParse(product.updated_on);
  const updated = date.success
    ? productUpdatePresentation(date.data, locale)
    : null;
  if (!price.success && !purchase.success && !updated) return null;
  return (
    <div className={styles.purchase}>
      {price.success ? (
        <p className={styles.price}>
          <span>{words.recordedPrice}</span>
          <strong>{formatProductPrice(price.data, locale)}</strong>
        </p>
      ) : null}
      {updated ? (
        <time
          dateTime={date.data}
          title={updated.exact}
          aria-label={updated.exact}
        >
          {updated.label}
        </time>
      ) : null}
      {purchase.success ? (
        <a
          className={styles.shop}
          href={purchase.data}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${demo ? words.demoLink : words.shop}: ${product.name}`}
        >
          <span>
            {demo ? words.demoLink : words.shop}{" "}
            <span aria-hidden="true">↗</span>
          </span>
          <small>{new URL(purchase.data).hostname.replace(/^www\./, "")}</small>
        </a>
      ) : null}
      {price.success || purchase.success ? (
        <small className={styles.purchaseHelp}>
          {demo ? words.demo : words.shopHelp}
        </small>
      ) : null}
    </div>
  );
}
