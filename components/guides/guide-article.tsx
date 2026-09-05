import Link from "next/link";

import { GuideMarkdown } from "./guide-markdown";
import { GuideMap } from "./guide-map";
import { guidePath, type GuideProducer } from "@/lib/guides/catalog";
import { buildGuideStructuredData } from "@/lib/guides/metadata";
import type { Guide } from "@/lib/guides/schema";
import { serializeStructuredData } from "@/lib/site-structured-data";
import styles from "./guides.module.css";

export function formatGuideDate(date: string): string {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function GuideArticle({
  guide,
  producers,
  related,
}: {
  guide: Guide;
  producers: GuideProducer[];
  related: Guide[];
}) {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(buildGuideStructuredData(guide)),
        }}
      />
      <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
        <Link href="/">Chisan</Link>
        <span aria-hidden="true">/</span>
        <Link href="/guias">Guías</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{guide.title}</span>
      </nav>
      <article>
        <header className={styles.articleHeader}>
          <p className={styles.eyebrow}>Guías de origen · {guide.topic}</p>
          <h1>{guide.title}</h1>
          <p className={styles.dek}>{guide.description}</p>
          <p className={styles.byline}>
            Por <Link href="/how-we-work">Chisan</Link>
            <span aria-hidden="true"> · </span>
            Publicada el{" "}
            <time dateTime={guide.publishedAt}>
              {formatGuideDate(guide.publishedAt)}
            </time>
            <br />
            Revisada el{" "}
            <time dateTime={guide.updatedAt}>
              {formatGuideDate(guide.updatedAt)}
            </time>
          </p>
        </header>
        <div className={styles.articleLayout}>
          <aside className={styles.contents}>
            <nav aria-label="En esta guía">
              <p className={styles.eyebrow}>En esta guía</p>
              <ol>
                {guide.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
              <a href="#criterio-editorial">Nuestro criterio editorial</a>
              <a href="#fuentes">Fuentes y revisión</a>
            </nav>
          </aside>
          <div className={styles.reading}>
            <div className={styles.introduction}>
              <GuideMarkdown>{guide.introduction}</GuideMarkdown>
            </div>
            {guide.sections.map((section) => {
              if (section.type === "prose")
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className={styles.section}
                  >
                    <h2>{section.title}</h2>
                    <GuideMarkdown>{section.markdown}</GuideMarkdown>
                  </section>
                );
              const items = section.items.map((reference) =>
                producers.find(
                  (producer) =>
                    producer.key ===
                    `${reference.country}:${reference.producerId}`,
                )!,
              );
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={styles.section}
                >
                  <h2>{section.title}</h2>
                  <GuideMarkdown>{section.introduction}</GuideMarkdown>
                  <div className={styles.producers}>
                    {items.map((producer) => (
                      <div key={producer.key} className={styles.producer}>
                        <div>
                          <p className={styles.eyebrow}>
                            {producer.city} · {producer.areaLabel}
                          </p>
                          <h3>
                            <Link href={producer.href}>{producer.name}</Link>
                          </h3>
                          <GuideMarkdown>{producer.focus}</GuideMarkdown>
                          <Link
                            href={producer.href}
                            className={styles.textLink}
                          >
                            Conocer al productor{" "}
                            <span aria-hidden="true">↗</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  {section.showMap ? <GuideMap items={items} /> : null}
                </section>
              );
            })}
            <section id="criterio-editorial" className={styles.note}>
              <h2>Nuestro criterio editorial</h2>
              <GuideMarkdown>{guide.selectionCriteria}</GuideMarkdown>
              <p>
                Guía elaborada con asistencia de IA a partir del catálogo y las
                fuentes enlazadas. Las fichas permiten consultar los datos de
                cada productor.{" "}
                <Link href="/how-we-work">Cómo trabajamos en Chisan</Link>.
              </p>
            </section>
            <section id="fuentes" className={styles.section}>
              <h2>Fuentes y revisión</h2>
              <ul className={styles.sourceList}>
                {guide.sources.map((source) => (
                  <li key={source.id}>
                    <a href={source.url}>{source.title}</a>
                    <span>
                      Consultada el{" "}
                      <time dateTime={source.checkedAt}>
                        {formatGuideDate(source.checkedAt)}
                      </time>
                    </span>
                  </li>
                ))}
              </ul>
              <p className={styles.caption}>
                La fecha de revisión corresponde a una revisión del texto y sus
                referencias. Esta guía se ampliará a medida que incorporemos
                nuevos detalles documentados.
              </p>
            </section>
          </div>
        </div>
      </article>
      {related.length ? (
        <section id="seguir-leyendo" className={styles.related}>
          <p className={styles.eyebrow}>Seguir el hilo</p>
          <h2>También en la despensa</h2>
          <div>
            {related.map((entry) => (
              <Link key={entry.slug} href={guidePath(entry.slug)}>
                <span className={styles.eyebrow}>{entry.topic}</span>
                <h3>{entry.title}</h3>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
