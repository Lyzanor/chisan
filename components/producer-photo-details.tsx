import { InfoIcon } from "@phosphor-icons/react/ssr";

/** Reviewed photo caption and credit stay available behind a compact disclosure. */
export function ProducerPhotoDetails({ photo, label }: {
  photo: { caption?: string; credit?: string; locale: string };
  label: string;
}) {
  const text = [photo.caption, photo.credit].filter(Boolean).join(" · ");
  return text ? (
    <figcaption className="detail-photo-details">
      <details>
        <summary aria-label={label} title={label}>
          <span><InfoIcon size={18} aria-hidden="true" /></span>
        </summary>
        <p lang={photo.locale}>{text}</p>
      </details>
    </figcaption>
  ) : null;
}
