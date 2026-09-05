"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProducerContent } from "@/lib/catalog/content-schema";
import type { Locale } from "@/lib/i18n/locales";
import { getProducerEditorLabels } from "@/lib/i18n/producer-editor";
import styles from "./producer-products-editor.module.css";

type Product = ProducerContent["products"][number];
export type ProductEditorData = Pick<
  ProducerContent,
  "products" | "gallery" | "links"
> & { baseHash: string; limit: number };

export function ProducerProductsEditor({
  content,
  initialProducts,
  locale,
  languageOptions,
  onChange,
}: {
  content: ProductEditorData;
  initialProducts: Product[];
  locale: Locale;
  languageOptions: readonly { value: string; label: string }[];
  onChange: () => void;
}) {
  const labels = getProducerEditorLabels(locale);
  const [products, setProducts] = useState(initialProducts);
  const [removed, setRemoved] = useState<{
    product: Product;
    index: number;
  } | null>(null);
  const root = useRef<HTMLFieldSetElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  function update(next: Product[]) {
    setProducts(next);
    onChange();
  }
  function change(id: string, patch: Partial<Product>) {
    update(
      products.map((product) =>
        product.id === id ? { ...product, ...patch } : product,
      ),
    );
  }
  function move(index: number, step: number) {
    const next = [...products];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    update(next);
  }
  return (
    <fieldset
      id="producer-change-products"
      ref={root}
      className={`account-form-section ${styles.editor}`}
    >
      <legend>{labels.products}</legend>
      <p>{labels.productsHelp}</p>
      <input type="hidden" name="baseContentHash" value={content.baseHash} />
      <input type="hidden" name="products" value={JSON.stringify(products)} />
      <div className={styles.heading}>
        <span>
          {products.length} / {content.limit} {labels.count}
        </span>
        <small>{labels.orderHelp}</small>
      </div>
      {!products.length ? (
        <p className="account-empty">{labels.empty}</p>
      ) : null}
      <ol className={styles.list}>
        {products.map((product, index) => (
          <li key={product.id} className={styles.product}>
            <div className={styles.heading}>
              <strong>
                {index + 1}. {product.name || labels.newProduct}
              </strong>
              <div className={styles.tools}>
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label={`${labels.up}: ${product.name || labels.newProduct}`}
                  onClick={() => move(index, -1)}
                >
                  {labels.up}
                </button>
                <button
                  type="button"
                  disabled={index === products.length - 1}
                  aria-label={`${labels.down}: ${product.name || labels.newProduct}`}
                  onClick={() => move(index, 1)}
                >
                  {labels.down}
                </button>
                <button
                  type="button"
                  aria-label={`${labels.remove}: ${product.name || labels.newProduct}`}
                  onClick={() => {
                    setRemoved({ product, index });
                    update(products.filter((item) => item.id !== product.id));
                    addButton.current?.focus();
                  }}
                >
                  {labels.remove}
                </button>
              </div>
            </div>
            <label
              className="account-field"
              htmlFor={`product-name-${product.id}`}
            >
              <span>{labels.name}</span>
              <input
                id={`product-name-${product.id}`}
                value={product.name}
                required
                maxLength={160}
                onChange={(event) =>
                  change(product.id, { name: event.target.value })
                }
              />
            </label>
            <label
              className="account-field"
              htmlFor={`product-description-${product.id}`}
            >
              <span>
                {labels.description} <small>· {labels.optional}</small>
              </span>
              <textarea
                id={`product-description-${product.id}`}
                value={product.description}
                maxLength={2000}
                rows={3}
                onChange={(event) =>
                  change(product.id, { description: event.target.value })
                }
              />
              <small>{product.description.length} / 2.000</small>
            </label>
            <label
              className="account-field"
              htmlFor={`product-locale-${product.id}`}
            >
              <span>{labels.language}</span>
              <select
                id={`product-locale-${product.id}`}
                value={product.locale}
                onChange={(event) =>
                  change(product.id, {
                    locale: event.target.value as Product["locale"],
                  })
                }
              >
                {languageOptions
                  .filter((option) => option.value)
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </label>
            {content.gallery.length || content.links.length ? (
              <details className={styles.attachments}>
                <summary>{labels.assets}</summary>
                {content.gallery.length ? (
                  <fieldset>
                    <legend>{labels.media}</legend>
                    {content.gallery.map((item) => (
                      <label key={item.id} className={styles.attachment}>
                        <input
                          type="checkbox"
                          checked={product.media_ids.includes(item.id)}
                          onChange={(event) =>
                            change(product.id, {
                              media_ids: event.target.checked
                                ? [...product.media_ids, item.id]
                                : product.media_ids.filter(
                                    (id) => id !== item.id,
                                  ),
                            })
                          }
                        />
                        <Image src={item.src} alt="" width={64} height={64} />
                        <span lang={item.locale}>{item.alt}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : null}
                {content.links.length ? (
                  <fieldset>
                    <legend>{labels.links}</legend>
                    {content.links.map((item) => (
                      <label key={item.id} className={styles.attachment}>
                        <input
                          type="checkbox"
                          checked={product.link_ids.includes(item.id)}
                          onChange={(event) =>
                            change(product.id, {
                              link_ids: event.target.checked
                                ? [...product.link_ids, item.id]
                                : product.link_ids.filter(
                                    (id) => id !== item.id,
                                  ),
                            })
                          }
                        />
                        <span lang={item.locale}>{item.label}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : null}
              </details>
            ) : null}
          </li>
        ))}
      </ol>
      {removed ? (
        <div className={styles.heading} role="status">
          <span>{labels.removed}</span>
          <button
            type="button"
            className="account-link-button"
            disabled={products.length >= content.limit}
            onClick={() => {
              const next = [...products];
              next.splice(
                Math.min(removed.index, next.length),
                0,
                removed.product,
              );
              update(next);
              setRemoved(null);
            }}
          >
            {labels.undo}
          </button>
        </div>
      ) : null}
      <button
        ref={addButton}
        type="button"
        className="account-button account-button--secondary"
        disabled={products.length >= content.limit}
        onClick={() => {
          const id = `product-${crypto.randomUUID()}`;
          update([
            ...products,
            {
              id,
              name: "",
              description: "",
              locale,
              media_ids: [],
              link_ids: [],
            },
          ]);
          requestAnimationFrame(() =>
            root.current
              ?.querySelector<HTMLInputElement>(`#product-name-${id}`)
              ?.focus(),
          );
        }}
      >
        {products.length >= content.limit ? labels.limit : labels.add}
      </button>
      {products.length ? (
        <details className={styles.preview}>
          <summary>{labels.preview}</summary>
          <ul>
            {products.map((product) => (
              <li key={product.id} lang={product.locale}>
                <strong>{product.name || labels.newProduct}</strong>
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </fieldset>
  );
}
