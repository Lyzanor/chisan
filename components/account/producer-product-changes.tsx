import { formatProductPrice, getProductCommerceLabels } from "@/lib/i18n/product-commerce";

import { ProducerMediaChanges } from "./producer-media-changes";
import type { ProducerContentChange } from "@/lib/accounts/producer-content-change";
import { productChanges } from "@/lib/catalog/product-diff";
import type { Locale } from "@/lib/i18n/locales";
import { getProducerEditorLabels } from "@/lib/i18n/producer-editor";

export function ProducerProductChanges({
  change,
  locale = "en",
}: {
  change: ProducerContentChange;
  locale?: Locale;
}) {
  const labels = getProducerEditorLabels(locale);
  const commerce = getProductCommerceLabels(locale);
  const words =
    locale === "es"
      ? {
          added: "Añadido",
          removed: "Retirado",
          updated: "Modificado",
          reordered: "Reordenado",
          before: "Antes",
          after: "Propuesta",
          position: "Posición",
        }
      : locale === "ca"
        ? {
            added: "Afegit",
            removed: "Retirat",
            updated: "Modificat",
            reordered: "Reordenat",
            before: "Abans",
            after: "Proposta",
            position: "Posició",
          }
        : {
            added: "Added",
            removed: "Removed",
            updated: "Updated",
            reordered: "Reordered",
            before: "Before",
            after: "Proposed",
            position: "Position",
          };
  return (
    <section aria-label={labels.products}>
      <h3>{labels.products}</h3>
      <ul className="account-record-list">
        {productChanges(change.base.products, change.products).map((item) => (
          <li key={item.id} className="account-record-list__stacked">
            <strong>
              {item.requested?.name ?? item.previous?.name} ·{" "}
              {words[item.kind as keyof typeof words]}
            </strong>
            <dl className="account-diff-list">
              {(["previous", "requested"] as const).map((side) => {
                const product = item[side];
                return (
                  <div key={side}>
                    <dt>{side === "previous" ? words.before : words.after}</dt>
                    <dd>
                      {product ? (
                        <>
                          <strong lang={product.locale}>{product.name}</strong>
                          <p lang={product.locale}>{product.description}</p>
                          <p>{commerce.price}: {product.price ? formatProductPrice(product.price, locale) : commerce.empty}</p>
                          <p>{commerce.purchaseUrl}: {product.purchase_url ? <a href={product.purchase_url} target="_blank" rel="noopener noreferrer">{product.purchase_url}</a> : commerce.empty}</p>
                          <p>{commerce.date}: {product.updated_on ? <time dateTime={product.updated_on}>{product.updated_on}</time> : commerce.pendingDate}</p>
                          <small>
                            {labels.language}: {product.locale} ·{" "}
                            {words.position}:{" "}
                            {side === "previous"
                              ? item.beforePosition
                              : item.position}
                          </small>
                          {product.media_ids.length ? (
                            <p>
                              {labels.media}:{" "}
                              {product.media_ids
                                .map(
                                  (id) =>
                                    (side === "requested" && change.version === 2 ? change.gallery : change.base.gallery).find(
                                      (media) => media.id === id,
                                    )?.alt ?? id,
                                )
                                .join(" · ")}
                            </p>
                          ) : null}
                          {product.link_ids.length ? (
                            <p>
                              {labels.links}:{" "}
                              {product.link_ids
                                .map(
                                  (id) =>
                                    change.base.links.find(
                                      (link) => link.id === id,
                                    )?.label ?? id,
                                )
                                .join(" · ")}
                            </p>
                          ) : null}
                        </>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>
      <ProducerMediaChanges change={change} locale={locale} />
    </section>
  );
}
