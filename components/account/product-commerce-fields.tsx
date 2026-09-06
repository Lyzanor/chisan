"use client";

import type { ProducerContent } from "@/lib/catalog/content-schema";
import { normalizeProductPriceInput } from "@/lib/catalog/product-commerce";
import type { Locale } from "@/lib/i18n/locales";
import {
  getProductCommerceLabels,
  productUpdatePresentation,
} from "@/lib/i18n/product-commerce";

type Product = ProducerContent["products"][number];
export function ProductCommerceFields({
  product,
  locale,
  onChange,
}: {
  product: Product;
  locale: Locale;
  onChange: (patch: Partial<Product>) => void;
}) {
  const words = getProductCommerceLabels(locale);
  const prefix = `product-${product.id}`;
  return (
    <>
      <label className="account-field" htmlFor={`${prefix}-purchase`}>
        <span id={`${prefix}-purchase-label`}>{words.purchaseUrl}</span>
        <input
          id={`${prefix}-purchase`}
          type="url"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          maxLength={2048}
          value={product.purchase_url ?? ""}
          aria-describedby={`${prefix}-purchase-help`}
          aria-labelledby={`${prefix}-purchase-label`}
          onChange={(event) =>
            onChange({ purchase_url: event.target.value || undefined })
          }
        />
        <small id={`${prefix}-purchase-help`}>{words.purchaseHelp}</small>
      </label>
      <label className="account-field" htmlFor={`${prefix}-price`}>
        <span id={`${prefix}-price-label`}>{words.price}</span>
        <input
          id={`${prefix}-price`}
          inputMode="decimal"
          pattern="[0-9]{1,6}([.,][0-9]{1,2})?"
          maxLength={9}
          value={product.price?.amount ?? ""}
          placeholder="3,50"
          aria-describedby={`${prefix}-price-help`}
          aria-labelledby={`${prefix}-price-label`}
          onChange={(event) =>
            onChange({
              price: event.target.value
                ? { amount: event.target.value, currency: "EUR" }
                : undefined,
            })
          }
          onBlur={() => {
            if (product.price)
              onChange({
                price: {
                  ...product.price,
                  amount: normalizeProductPriceInput(product.price.amount),
                },
              });
          }}
        />
        <small id={`${prefix}-price-help`}>{words.priceHelp}</small>
      </label>
      <div className="account-field">
        <span>{words.date}</span>
        {product.updated_on ? (
          <time dateTime={product.updated_on}>
            {productUpdatePresentation(product.updated_on, locale).exact}
          </time>
        ) : (
          <span>{words.pendingDate}</span>
        )}
        <small>{words.dateHelp}</small>
      </div>
    </>
  );
}
