import { GuideCover } from "@/components/guides/guide-cover";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  GUIDE_TOPICS,
  guidePath,
  listPublishedGuides,
  resolveGuidesScope,
} from "@/lib/guides/catalog";
import { buildGuideMetadata } from "@/lib/guides/metadata";
import { GUIDE_KINDS, type Guide } from "@/lib/guides/schema";
import styles from "@/components/guides/guides.module.css";

export const metadata = buildGuideMetadata();

// The library belongs to one published catalog scope. Every other scope is
// unknown at this depth, so no request invents a translated guide route.
export function generateStaticParams() {
  const scope = resolveGuidesScope();
  return scope ? [{ catalog: scope.pathPrefix.slice(1) }] : [];
}

export const dynamicParams = false;

function GuideCards({ guides }: { guides: Guide[] }) {
  return (
    <div className={styles.cards}>
      {guides.map((guide) => (
        <article key={guide.slug} className={styles.card}>
          <GuideCover guide={guide} compact />
          <p className={styles.eyebrow}>
            {guide.topic} · {GUIDE_KINDS[guide.kind]}
          </p>
          <h3><Link href={guidePath(guide.slug)}>{guide.title}</Link></h3>
          <p>{guide.description}</p>
        </article>
      ))}
    </div>
  );
}

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
            Guías de referencia para volver a consultar, respuestas para la
            compra y lecturas al ritmo de las cosechas. Con productores,
            fuentes y fechas de revisión.
          </p>
          <a href="#referencia" className={styles.textLink}>
            Explorar las guías <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>
      <nav className={styles.topicNav} aria-label="Tipos de lectura">
        <a href="#referencia">Para empezar</a>
        <a href="#biblioteca">Guías prácticas</a>
        <a href="#temporada">De temporada</a>
        <a href="#historias">Historias</a>
      </nav>
      <section id="referencia" className={styles.topicSection} aria-labelledby="reference-title">
        <h2 id="reference-title">Guías de referencia</h2>
        <p>Las claves para entender el origen, elegir alimentos y comprar a sus productores.</p>
        <GuideCards guides={guides.filter((guide) => guide.kind === "reference")} />
      </section>
      <section
        id="biblioteca"
        className={styles.library}
        aria-labelledby="library-title"
      >
        <div className={styles.libraryHeading}>
          <h2 id="library-title">Para ir al detalle</h2>
          <p>Guías prácticas por alimento y territorio</p>
        </div>
        <nav className={styles.topicNav} aria-label="Temas de las guías">
          {GUIDE_TOPICS.map((topic) => (
            <a key={topic} href={`#tema-${topic.toLowerCase()}`}>
              {topic}
            </a>
          ))}
        </nav>
        {GUIDE_TOPICS.map((topic) => (
          <section
            key={topic}
            id={`tema-${topic.toLowerCase()}`}
            className={styles.topicSection}
            aria-labelledby={`titulo-${topic.toLowerCase()}`}
          >
            <h2 id={`titulo-${topic.toLowerCase()}`}>{topic}</h2>
            <GuideCards guides={guides.filter((guide) => guide.kind === "practical" && guide.topic === topic)} />
          </section>
        ))}
      </section>
      <section id="temporada" className={styles.topicSection} aria-labelledby="seasonal-title">
        <h2 id="seasonal-title">De temporada</h2>
        <p>Qué preguntar cuando llega una cosecha y cómo llevarla a la despensa.</p>
        <GuideCards guides={guides.filter((guide) => guide.kind === "seasonal")} />
      </section>
      <section id="historias" className={styles.topicSection} aria-labelledby="stories-title">
        <h2 id="stories-title">Historias del alimento</h2>
        <p>Detalles del oficio y preguntas cotidianas que merecen una explicación.</p>
        <GuideCards guides={guides.filter((guide) => guide.kind === "story")} />
      </section>
      <section className={styles.indexNote}>
        <p className={styles.eyebrow}>Del texto al territorio</p>
        <h2>Leer, situar, conocer.</h2>
        <p>
          Chisan firma estas guías a partir del catálogo y de fuentes públicas,
          con asistencia de IA. Las selecciones explican su alcance y cada
          revisión indica qué ha cambiado. Puedes consultar{" "}
          <Link href="/how-we-work">cómo trabajamos</Link> o{" "}
          <Link href="/contact">proponer una corrección documentada</Link>.
        </p>
        <Link href="/#choose-country" className={styles.textLink}>
          Explorar el catálogo <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
