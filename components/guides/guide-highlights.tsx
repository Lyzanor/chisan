import Link from "next/link";
import type { ProducerIdentity } from "@/lib/csv-catalog";
import {
  guidePath,
  listGuidesForProducer,
  listFeaturedGuides,
} from "@/lib/guides/catalog";
import styles from "./guides.module.css";

export function GuideHighlights({ producer }: { producer?: ProducerIdentity }) {
  const guides = producer
    ? listGuidesForProducer(producer)
    : listFeaturedGuides();
  if (!guides.length) return null;
  return (
    <section
      className={styles.highlights}
      lang="es"
      aria-labelledby="guide-highlights-title"
    >
      <p className={styles.eyebrow}>La biblioteca de Chisan · En español</p>
      <div className={styles.highlightsHeading}>
        <h2 id="guide-highlights-title">
          {producer
            ? "Aparece en estas guías"
            : "Otra forma de descubrir el origen"}
        </h2>
        <Link href="/guias" className={styles.textLink}>
          Todas las guías <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {!producer ? (
        <p>
          Quesos, vinos y miel: conoce sus detalles, sitúa a sus productores y
          sigue explorando sus fichas.
        </p>
      ) : null}
      <div className={styles.highlightGrid}>
        {guides.map((guide) => (
          <article key={guide.slug}>
            <p className={styles.eyebrow}>{guide.topic}</p>
            <h3>
              <Link href={guidePath(guide.slug)}>{guide.title}</Link>
            </h3>
            <p>{guide.description}</p>
            <Link href={guidePath(guide.slug)} className={styles.textLink}>
              Leer la guía <span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
