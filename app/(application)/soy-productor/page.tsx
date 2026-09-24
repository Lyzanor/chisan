import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CameraIcon,
  CheckCircleIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  SealCheckIcon,
  StorefrontIcon,
  XCircleIcon,
} from "@phosphor-icons/react/ssr";

import { searchClaimableProducers, type ClaimableProducer } from "@/lib/accounts/producer-claim-search";
import { PRODUCER_ONBOARDING_PATH } from "@/lib/accounts/producer-claim-options";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import {
  buildPublicPageStructuredData,
  serializeStructuredData,
} from "@/lib/site-structured-data";

import styles from "./soy-productor.module.css";

const canonicalUrl = new URL("/soy-productor", SITE_ORIGIN).toString();

export const metadata: Metadata = {
  title: `Soy productor | ${SITE_NAME}`,
  description:
    "Conecta tu obrador, bodega o finca con comensales y restaurantes de cercanía. Reclama tu ficha gratis, añade tus fotos y gestiona tu información sin intermediarios ni comisiones.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `Soy productor | ${SITE_NAME}`,
    description:
      "Tu producto merece ser encontrado sin intermediarios ni comisiones. Reclama y verifica tu ficha en Chisan de forma 100% gratuita.",
    url: canonicalUrl,
    type: "website",
    locale: "es_ES",
  },
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function claimHref(producer: Pick<ClaimableProducer, "country" | "producerId">): string {
  return `${PRODUCER_ONBOARDING_PATH}?country=${encodeURIComponent(producer.country)}&producerId=${producer.producerId}`;
}

const FAQS = [
  {
    q: "¿Cobráis comisión por lo que venda a través de Chisan?",
    a: "No, cero. Ni a ti ni al comprador. Los tratos que cierres con particulares o con restaurantes son 100% tuyos. Chisan es una red de descubrimiento y contacto directo, nunca una central de compras ni un intermediario comisionista.",
  },
  {
    q: "¿Cuánto tiempo se tarda en verificar mi ficha?",
    a: "Puedes iniciar la solicitud desde el móvil y elegir una vía de verificación vinculada a los contactos publicados en tu ficha. El equipo revisa la prueba de vinculación antes de conceder acceso; la verificación no es inmediata.",
  },
  {
    q: "¿Tengo que hacer envíos a toda España para estar en Chisan?",
    a: "En absoluto. Tú defines tu propio alcance: puedes indicar que solo atiendes visitas en tu obrador o finca, que repartes semanalmente en tu comarca, o añadir tu tienda online para pedidos a distancia.",
  },
  {
    q: "¿Y si busco mi proyecto y no aparece en el buscador?",
    a: "Puedes solicitar el alta gratuita desde nuestro formulario de sugerencias. Revisamos que cumpla con los criterios editoriales de Chisan (elaboración propia, trazabilidad y arraigo local) y, si cumple los criterios, publicamos la ficha sin coste.",
  },
  {
    q: "¿Qué pasa si cambian mis horarios, teléfono o productos?",
    a: "Una vez verificada la titularidad, puedes entrar en tu cuenta de Chisan desde cualquier móvil u ordenador y proponer actualizaciones al momento. Cada cambio se revisa antes de publicarse para mantener la máxima fiabilidad.",
  },
];

export default async function SoyProductorPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = firstParam(params.q).trim().slice(0, 160);
  const hasQuery = rawQuery.length >= 2;
  const results = hasQuery ? await searchClaimableProducers(rawQuery) : [];

  const structuredData = buildPublicPageStructuredData({
    type: "WebPage",
    url: canonicalUrl,
    name: `Soy productor | ${SITE_NAME}`,
    description:
      "Conecta tu obrador, bodega o finca con comensales y restaurantes de cercanía. Reclama tu ficha gratis sin intermediarios ni comisiones.",
    locale: "es",
  });

  return (
    <main className={styles.page} lang="es">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(structuredData),
        }}
      />

      {/* Hero with embedded search */}
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Canal corto · Producto de origen · 100% independiente</p>
        <h1 className={styles.heroTitle}>Tu producto merece ser encontrado sin intermediarios ni comisiones.</h1>
        <p className={styles.heroLead}>
          {SITE_NAME} ayuda a comensales y restaurantes a descubrir productores locales de alimentos y bebidas. Más de 13.000 obradores, queserías, almazaras y bodegas ya forman parte del mapa.
        </p>

        <div className={styles.searchWrapper} id="buscador">
          <div className={styles.searchBox}>
            <form method="get" action="/soy-productor#buscador" role="search" className={styles.searchForm}>
              <input
                type="search"
                name="q"
                defaultValue={rawQuery}
                placeholder="Escribe el nombre de tu quesería, bodega o municipio..."
                aria-label="Buscar tu proyecto en el catálogo"
                autoComplete="off"
                enterKeyHint="search"
                minLength={2}
                maxLength={160}
                required
                className={styles.searchInput}
              />
              <button type="submit" className={`chisan-button chisan-button--primary ${styles.searchButton}`}>
                <MagnifyingGlassIcon size={18} aria-hidden="true" />
                Buscar mi ficha
              </button>
            </form>
          </div>

          {/* Search feedback / results */}
          {hasQuery ? (
            <div className={styles.searchResults}>
              {results.length > 0 ? (
                <>
                  <div className={styles.resultsHeader}>
                    <p className={styles.resultsCount}>
                      Fichas encontradas para «<strong>{rawQuery}</strong>» ({results.length})
                    </p>
                    <small>Elige tu proyecto para verificarlo gratis:</small>
                  </div>
                  <ul className={styles.resultsList}>
                    {results.map((producer) => (
                      <li key={`${producer.country}:${producer.producerId}`} className={styles.resultCard}>
                        <div className={styles.resultCardInfo}>
                          {producer.imageSrc ? (
                            <Image
                              src={producer.imageSrc}
                              alt=""
                              width={52}
                              height={52}
                              sizes="52px"
                              className={styles.resultThumb}
                              unoptimized
                            />
                          ) : (
                            <span className={styles.resultThumbFallback} aria-hidden="true">
                              <StorefrontIcon size={24} />
                            </span>
                          )}
                          <div className={styles.resultCardText}>
                            <strong>{producer.name}</strong>
                            <span>
                              {producer.municipality} · {producer.area}
                            </span>
                          </div>
                        </div>
                        <div className={styles.resultCardActions}>
                          <Link
                            href={claimHref(producer)}
                            className="chisan-button chisan-button--primary"
                          >
                            Reclamar gratis
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className={styles.emptyResults}>
                  <p>
                    No hemos encontrado ninguna ficha con «<strong>{rawQuery}</strong>». Es posible que tu proyecto aún no esté indexado o figure con otra denominación.
                  </p>
                  <Link href="/cuenta/sugerencias/nueva" className="chisan-button chisan-button--primary">
                    <PlusCircleIcon size={18} aria-hidden="true" />
                    Dar de alta mi proyecto gratis
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </header>

      {/* Radical Transparency Section */}
      <section className={styles.section} aria-labelledby="why-here-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Transparencia radical</p>
          <h2 id="why-here-title">¿Por qué tu proyecto probablemente ya está aquí?</h2>
          <p>
            En Chisan contrastamos fuentes públicas y la información de los propios productores. Los registros de denominaciones de origen (DOP, IGP), asociaciones y directorios ayudan a encontrarlos; revisamos su actividad y elaboración propia antes de incluirlos.
          </p>
        </div>
        <div className={styles.benefitCard}>
          <p>
            <strong>Nadie te cobrará nunca por estar en el mapa.</strong> Pero la información pública suele estar incompleta, sin fotos o desactualizada. Puedes verificar gratis tu vinculación con la ficha y proponer fotos, horarios y actualizaciones. Revisamos los cambios antes de publicarlos para que quienes buscan comida de origen encuentren información fiable.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.section} aria-labelledby="benefits-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Ventajas de la verificación</p>
          <h2 id="benefits-title">Qué ganas al verificar tu vinculación</h2>
          <p>Herramientas prácticas pensadas para el día a día de quien elabora, cría o cultiva.</p>
        </div>

        <div className={styles.grid2x2}>
          <article className={styles.benefitCard}>
            <div className={styles.benefitIcon} aria-hidden="true">
              <StorefrontIcon size={24} />
            </div>
            <h3>Venta directa y visitas en finca</h3>
            <p>
              Informa de tus días y horarios de apertura, si admites visitas con cita previa y enlaza directamente a tu tienda online si ya tienes una. El 100% de la venta es tuya, sin comisiones de intermediación.
            </p>
          </article>

          <article className={styles.benefitCard}>
            <div className={styles.benefitIcon} aria-hidden="true">
              <HandshakeIcon size={24} />
            </div>
            <h3>Canal profesional para hostelería</h3>
            <p>
              Recibe consultas directas de restaurantes y tiendas especializadas que buscan producto Km0. Tú decides tus mínimos de entrega, días de reparto y precios profesionales.
            </p>
          </article>

          <article className={styles.benefitCard}>
            <div className={styles.benefitIcon} aria-hidden="true">
              <SealCheckIcon size={24} />
            </div>
            <h3>Distintivo «Productor verificado»</h3>
            <p>
              El distintivo indica que hemos verificado tu vinculación con la ficha. No es una certificación de calidad ni sustituye la revisión de la información publicada.
            </p>
          </article>

          <article className={styles.benefitCard}>
            <div className={styles.benefitIcon} aria-hidden="true">
              <CameraIcon size={24} />
            </div>
            <h3>Galería gratuita de tu proyecto</h3>
            <p>
              Muestra hasta 5 fotos reales de tu obrador, tus campos o tus animales para que quienes te descubran conozcan tu trabajo. Las imágenes se revisan antes de publicarse.
            </p>
          </article>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`${styles.section} ${styles.tableSection}`} aria-labelledby="transparency-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Nuestro compromiso</p>
          <h2 id="transparency-title">Claridad desde el primer día</h2>
          <p>Sin letra pequeña ni sorpresas.</p>
        </div>

        <div className={styles.comparisonGrid}>
          <div className={`${styles.comparisonColumn} ${styles.columnPositive}`}>
            <h3>
              <CheckCircleIcon size={24} aria-hidden="true" />
              Lo que siempre es gratis
            </h3>
            <ul className={styles.checkList}>
              <li className={styles.checkItem}>
                <CheckCircleIcon size={18} color="var(--chisan-color-moss)" aria-hidden="true" />
                <span>Estar en el mapa y en el catálogo público de Chisan.</span>
              </li>
              <li className={styles.checkItem}>
                <CheckCircleIcon size={18} color="var(--chisan-color-moss)" aria-hidden="true" />
                <span>Reclamar y verificar la titularidad de tu negocio.</span>
              </li>
              <li className={styles.checkItem}>
                <CheckCircleIcon size={18} color="var(--chisan-color-moss)" aria-hidden="true" />
                <span>Recibir contactos de particulares y profesionales.</span>
              </li>
              <li className={styles.checkItem}>
                <CheckCircleIcon size={18} color="var(--chisan-color-moss)" aria-hidden="true" />
                <span>Actualizar la descripción de tu actividad y los enlaces a tu propia web.</span>
              </li>
              <li className={styles.checkItem}>
                <CheckCircleIcon size={18} color="var(--chisan-color-moss)" aria-hidden="true" />
                <span>Galería de hasta 5 fotos revisadas de tu proyecto.</span>
              </li>
            </ul>
          </div>

          <div className={`${styles.comparisonColumn} ${styles.columnNegative}`}>
            <h3>
              <XCircleIcon size={24} aria-hidden="true" />
              Lo que nunca haremos
            </h3>
            <ul className={styles.checkList}>
              <li className={styles.checkItem}>
                <XCircleIcon size={18} color="var(--chisan-color-stone)" aria-hidden="true" />
                <span>Cobrar comisiones por lo que vendas a través de tu ficha.</span>
              </li>
              <li className={styles.checkItem}>
                <XCircleIcon size={18} color="var(--chisan-color-stone)" aria-hidden="true" />
                <span>Intermediar en tus cobros o retener tu dinero.</span>
              </li>
              <li className={styles.checkItem}>
                <XCircleIcon size={18} color="var(--chisan-color-stone)" aria-hidden="true" />
                <span>Obligarte a utilizar un servicio de transporte específico.</span>
              </li>
              <li className={styles.checkItem}>
                <XCircleIcon size={18} color="var(--chisan-color-stone)" aria-hidden="true" />
                <span>Vender o ceder tus datos a intermediarios comerciales.</span>
              </li>
              <li className={styles.checkItem}>
                <XCircleIcon size={18} color="var(--chisan-color-stone)" aria-hidden="true" />
                <span>Dar por verificada la titularidad sin revisar la prueba de vinculación.</span>
              </li>
            </ul>
          </div>
        </div>

        <p className={styles.tableNote}>
          Puedes consultar las opciones Pro para ampliar tu presencia y tus herramientas profesionales. La presencia básica, la verificación y el contacto directo son gratuitos.
        </p>
      </section>

      {/* FAQ Section */}
      <section className={styles.section} aria-labelledby="faq-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Dudas frecuentes</p>
          <h2 id="faq-title">Preguntas habituales</h2>
          <p>Respuestas claras a las dudas más comunes de los productores.</p>
        </div>

        <div className={styles.faqList}>
          {FAQS.map((faq, index) => (
            <article key={index} className={styles.faqItem}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <footer className={styles.closing}>
        <h2>Pon tu trabajo en el mapa del producto local auténtico</h2>
        <p>Busca tu proyecto e inicia la solicitud de verificación desde tu teléfono.</p>
        <div className="account-inline-actions">
          <a href="#buscador" className="chisan-button chisan-button--primary">
            <MagnifyingGlassIcon size={18} aria-hidden="true" />
            Buscar y reclamar mi ficha
          </a>
          <Link href="/cuenta/sugerencias/nueva" className="chisan-button">
            Dar de alta un nuevo productor
          </Link>
        </div>
      </footer>
    </main>
  );
}
