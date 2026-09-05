import Link from "next/link";
import { notFound } from "next/navigation";

import {
  GUIDE_TOPICS,
  guidePath,
  listPublishedGuides,
} from "@/lib/guides/catalog";
import { buildGuideMetadata } from "@/lib/guides/metadata";
import styles from "@/components/guides/guides.module.css";

export const metadata = buildGuideMetadata();

export default async function GuidesPage() {
  const guides = listPublishedGuides();
  if (!guides.length) notFound();
  return (
    <main className={styles.page}>
      <header className={styles.indexHeader}>
        <div>
          <p className={styles.eyebrow}>La biblioteca de Chisan · España</p>
          <h1>
            Guías para conocer
            <br />
            lo que comemos.
          </h1>
        </div>
        <div>
          <p>
            Detrás de cada alimento hay un lugar y una forma de hacer. Te
            ayudamos a leer esos detalles y a encontrar a quienes los hacen
            posibles.
          </p>
          <a href="#biblioteca" className={styles.textLink}>
            Explorar las guías <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>
      <section
        id="biblioteca"
        className={styles.library}
        aria-labelledby="library-title"
      >
        <div className={styles.libraryHeading}>
          <h2 id="library-title">Un alimento, muchas historias</h2>
          <p>{guides.length} guías para explorar</p>
        </div>
        <nav className={styles.topicNav} aria-label="Temas de las guías">
          {GUIDE_TOPICS.map((topic) => (
            <a key={topic} href={`#tema-${topic.toLowerCase()}`}>{topic}</a>
          ))}
        </nav>
        {GUIDE_TOPICS.map((topic) => (
          <section key={topic} id={`tema-${topic.toLowerCase()}`} className={styles.topicSection} aria-labelledby={`titulo-${topic.toLowerCase()}`}>
            <h2 id={`titulo-${topic.toLowerCase()}`}>{topic}</h2>
            <div className={styles.cards}>
          {guides.filter((guide) => guide.topic === topic).map((guide) => (
            <article key={guide.slug} className={styles.card}>
              <p className={styles.eyebrow}>{guide.topic} · Guía de origen</p>
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
        ))}
      </section>
      <section className={styles.indexNote}>
        <p className={styles.eyebrow}>Del texto al territorio</p>
        <h2>Leer, situar, conocer.</h2>
        <p>
          Cada guía conecta contexto, productores y sus fichas. Encontrarás una
          selección comentada, un mapa para orientarte y las fuentes para seguir
          investigando. Volvemos a los artículos para ampliar lo que sabemos.
        </p>
        <Link href="/#choose-country" className={styles.textLink}>
          Explorar el catálogo <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
