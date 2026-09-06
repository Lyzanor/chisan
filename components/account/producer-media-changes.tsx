import Image from "next/image";
import type { ProducerContentChange } from "@/lib/accounts/producer-content-change";
import {
  preparedMediaSrc,
  privateMediaSrc,
} from "@/lib/accounts/producer-media-policy";
import type { Locale } from "@/lib/i18n/locales";
import { getProducerMediaLabels } from "@/lib/i18n/producer-media";
import styles from "./producer-media-editor.module.css";

export function ProducerMediaChanges({
  change,
  locale,
}: {
  change: ProducerContentChange;
  locale: Locale;
}) {
  if (change.version !== 2) return null;
  const words = getProducerMediaLabels(locale);
  return (
    <section aria-label={words.title}>
      <h3>{words.title}</h3>
      <div className="account-diff-list">
        {(["before", "after"] as const).map((side) => (
          <section key={side}>
            <h4>
              {locale === "es"
                ? side === "before"
                  ? "Antes"
                  : "Propuesta"
                : locale === "ca"
                  ? side === "before"
                    ? "Abans"
                    : "Proposta"
                  : side === "before"
                    ? "Before"
                    : "Proposed"}
            </h4>
            <ol className={styles.list}>
              {(side === "before" ? change.base.gallery : change.gallery).map(
                (media, index) => {
                  const upload =
                    side === "after"
                      ? change.uploads.find(
                          (u) =>
                            preparedMediaSrc(
                              change.base.country,
                              change.base.producer_id,
                              u.sha256,
                            ) === media.src,
                        )
                      : null;
                  const assigned = (
                    side === "before" ? change.base.products : change.products
                  ).filter((p) => p.media_ids.includes(media.id));
                  return (
                    <li className={styles.picture} key={media.id}>
                      <strong>
                        {index + 1}. {media.alt}
                      </strong>
                      <Image
                        src={
                          upload ? privateMediaSrc(upload.uploadId) : media.src
                        }
                        alt={media.alt}
                        width={media.width}
                        height={media.height}
                        unoptimized={Boolean(upload)}
                        sizes="(max-width: 600px) 90vw, 320px"
                      />
                      <p lang={media.locale}>
                        {media.caption}{" "}
                        {media.credit ? `· ${media.credit}` : ""}
                      </p>
                      <small>
                        {assigned.length
                          ? `${words.assigned}: ${assigned.map((p) => p.name).join(", ")}`
                          : words.gallery}
                      </small>
                    </li>
                  );
                },
              )}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
