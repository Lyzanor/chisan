import Image from "next/image";
import type { Guide } from "@/lib/guides/schema";
import styles from "./guides.module.css";

export function GuideCover({
  guide,
  compact = false,
}: {
  guide: Guide;
  compact?: boolean;
}) {
  const { cover } = guide;
  return (
    <figure className={compact ? styles.coverCompact : styles.cover}>
      <Image
        src={cover.src}
        alt={compact ? "" : cover.alt}
        width={cover.width}
        height={cover.height}
        sizes={
          compact
            ? "(max-width: 760px) 90vw, 380px"
            : "(max-width: 760px) 100vw, 1200px"
        }
      />
      {!compact ? (
        <figcaption>
          Fotografía de contexto · <a href={cover.sourceUrl}>{cover.credit}</a>.{" "}
          <a href={cover.licenseUrl}>Licencia</a>.
        </figcaption>
      ) : null}
    </figure>
  );
}
