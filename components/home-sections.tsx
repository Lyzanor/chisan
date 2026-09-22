import { Suspense } from "react";
import Link from "next/link";
import { MapPinIcon, QrCodeIcon, ArrowUpRightIcon, PlantIcon } from "@phosphor-icons/react/ssr";
import { ChisanMascot, ChisanMark } from "@/components/brand/chisan-brand";
import { GuideHighlights } from "@/components/guides/guide-highlights";
import { SectionReveal } from "@/components/section-reveal";
import { HomeCommunity } from "@/components/home-community";
import { ResponsiveDisclosure } from "@/components/responsive-disclosure";
import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import type { CategoryPresentation } from "@/lib/i18n/categories";
import styles from "./home.module.css";

/** A category as the registry presents it, with how many producers match it. */
export type HomeCategoryCount = CategoryPresentation & { count: number; href?: string };

export function HomeSections({
  producerCount,
  categoryCounts,
  countryCatalog,
}: {
  producerCount: number;
  categoryCounts: readonly HomeCategoryCount[];
  countryCatalog: { label: string; href: string } | null;
}) {
  const numberFormat = new Intl.NumberFormat("es-ES");
  const shelfAvailable = selectionShelfEnabled();

  return (
    <SectionReveal>
      <section className={styles.stats} data-reveal aria-label="Chisan en datos">
        <div className={styles.statsHeading}>
          <p className="catalog-kicker">Un mapa que crece con cada productor</p>
          <h2>La mayor base de datos de productores locales de España</h2>
          <p>Explora el mapa, conoce dónde están y acércate directamente.</p>
          {countryCatalog ? (
            <Link className={styles.button} href={countryCatalog.href}>
              Explorar el catálogo <ArrowUpRightIcon size={18} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
        <div className={styles.statsTotal}>
          <MapPinIcon size={28} aria-hidden="true" />
          <strong>{numberFormat.format(producerCount)}</strong>
          <span>productores en el catálogo</span>
        </div>
        {categoryCounts.length > 0 ? (
          <ul className={styles.categories} aria-label="Categorías con más productores">
            {categoryCounts.map((category) => (
              <li key={category.token}>
                {category.href ? (
                  <Link href={category.href} aria-label={`${category.label}: ${numberFormat.format(category.count)} productores. Explorar en el mapa`}>
                    <span className={styles.categoryIcon} aria-hidden="true">{category.icon}</span>
                    <span>{category.label}</span>
                    <b>{numberFormat.format(category.count)}</b>
                    <ArrowUpRightIcon size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <span className={styles.categoryStatic}>
                    <span className={styles.categoryIcon} aria-hidden="true">{category.icon}</span>
                    <span>{category.label}</span>
                    <b>{numberFormat.format(category.count)}</b>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className={styles.qr} data-reveal aria-labelledby="home-qr-title">
        <div className={styles.qrVisual} aria-hidden="true">
          <div className={styles.qrCard}>
            <span className={styles.qrCardTop}>CHISAN / ORIGEN</span>
            <QrCodeIcon size={100} weight="light" />
            <ChisanMark alt="" />
            <span>Escanea y conoce su historia</span>
          </div>
          <ChisanMascot state="catalog" size={108} alt="" className={styles.qrMascot} />
        </div>
        <div className={styles.qrCopy}>
          <p className="catalog-kicker">El origen, a un escaneo</p>
          <h2 id="home-qr-title">Del puesto o la carta a la persona que produce.</h2>
          <p>El QR de Chisan abre la ficha de un productor o una selección compartida. Descubre el origen y contacta sin registrarte.</p>
          <p>Las etiquetas descargables forman parte del acceso Pro correspondiente.</p>
          <Link className={styles.textLink} href="/cuenta/seleccion">Conoce tu selección <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className={styles.agent} data-reveal aria-labelledby="home-agent-title">
        <div className={styles.agentCopy}>
          <p className="catalog-kicker">Agente Chisan</p>
          <h2 id="home-agent-title">Una foto puede abrir la puerta a todo un mapa.</h2>
          <p>
            {shelfAvailable
              ? "Envía una foto de tu estantería. Chisan propone productores; tú revisas, corriges y decides qué publicar."
              : "Organiza tus favoritos en una selección. Estamos preparando la lectura de fotos de estantería para conectarla con el mapa."}
          </p>
          <p>Para productores, el asistente de WhatsApp prepara novedades y productos para revisión cuando el canal esté disponible.</p>
          <div className={styles.agentActions}>
            <Link className={styles.button} href={shelfAvailable ? "/cuenta/estanteria" : "/cuenta/seleccion"}>
              Probar ahora <ArrowUpRightIcon size={18} aria-hidden="true" />
            </Link>
            <Link className={styles.textLink} href="/cuenta/whatsapp">Conoce el asistente de WhatsApp <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={styles.agentVisual} aria-hidden="true">
          <div className={styles.agentPhoto}>
            <span className={styles.agentPhotoTop}>01 / FOTO</span>
            <div className={styles.agentShelves}><i /><i /><i /><i /><i /><i /></div>
            <span className={styles.agentPhotoPin}><MapPinIcon size={20} weight="fill" /></span>
          </div>
          <div className={styles.agentResult}>
            <ChisanMascot state="search" size={56} alt="" />
            <span>02 / REVISIÓN</span>
            <strong>De la imagen a tus productores</strong>
            <small>Tú decides qué se publica</small>
          </div>
        </div>
      </section>

      <div data-reveal><GuideHighlights compactHome /></div>

      <div data-reveal>
        <Suspense fallback={<div className={styles.communityLoading} aria-hidden="true" />}>
          <HomeCommunity />
        </Suspense>
      </div>

      <section className={`${styles.section} ${styles.discover}`} data-reveal aria-labelledby="home-discover-title">
        <div>
          <p className="catalog-kicker">Comunidad y territorio</p>
          <h2 id="home-discover-title">Descubrir lo que ocurre cerca.</h2>
          <p>Conoce a productores destacados de tu provincia, eventos en los que participan, novedades de temporada y la actividad reciente de la comunidad.</p>
          <Link className={styles.button} href="/actividad">Ir a Descubrir <ArrowUpRightIcon size={18} aria-hidden="true" /></Link>
        </div>
        <div className={styles.discoverMark} aria-hidden="true"><ChisanMascot state="following" size={132} alt="" /></div>
      </section>

      <section className={styles.producer} data-reveal aria-labelledby="home-producer-title">
        <PlantIcon size={40} aria-hidden="true" />
        <div>
          <p className="catalog-kicker">Tu trabajo merece conocerse</p>
          <h2 id="home-producer-title">¿Eres productor?</h2>
          <p>Encuentra tu ficha, verifica que es tuya y propón mejoras para mostrar lo que haces y cómo encontrarte.</p>
          <Link className={styles.button} href={ACCOUNT_ROUTES.signUp}>Regístrate gratis <ArrowUpRightIcon size={18} aria-hidden="true" /></Link>
          <Link className={styles.textLink} href="/cuenta/reclamaciones/nueva">Ya tengo cuenta</Link>
        </div>
      </section>

      <section className={styles.section} data-reveal aria-labelledby="home-plans-title">
        <p className="catalog-kicker">Un espacio para cada relación con el origen</p>
        <h2 id="home-plans-title">Empieza gratis. Crece a tu ritmo.</h2>
        <p>Una cuenta para descubrir y compartir. Una ficha para quienes producen. Cada acceso Pro se activa por separado.</p>
        <div className={styles.plans}>
          <ResponsiveDisclosure
            className={styles.planCard}
            summary={<><span className={styles.planAudience}>01 / Para personas y negocios</span><strong className={styles.planName}>Usuario</strong><span className={styles.planPreview}>Free 0 € · Pro por consulta</span></>}
          >
            <div className={styles.planTier}><strong>Free</strong><span>0 €</span></div>
            <p>Sigue productores, comparte tu selección y ayuda a mejorar las fichas.</p>
            <div className={styles.planTier}><strong>Pro</strong><span>Por consulta</span></div>
            <p>QR descargable para tu selección. Perfil de negocio y consultas B2B en preparación.</p>
            <Link className={styles.button} href={ACCOUNT_ROUTES.signUp}>Crear mi cuenta</Link>
          </ResponsiveDisclosure>
          <ResponsiveDisclosure
            className={styles.planCard}
            summary={<><span className={styles.planAudience}>02 / Para productores</span><strong className={styles.planName}>Productor</strong><span className={styles.planPreview}>Free 0 € · Pro por consulta</span></>}
          >
            <div className={styles.planTier}><strong>Free</strong><span>0 €</span></div>
            <p>Ficha revisada, contacto, fotos y verificación de titularidad sin coste.</p>
            <div className={styles.planTier}><strong>Pro</strong><span>Por consulta</span></div>
            <p>Productos y enlaces de compra revisados, perfil ampliado, estadísticas y QR. Asistente por WhatsApp según disponibilidad.</p>
            <Link className={styles.button} href="/contact">Consultar Pro</Link>
          </ResponsiveDisclosure>
        </div>
        <p className={styles.note}>La contratación online todavía no está disponible. Las funciones en preparación se activarán cuando estén listas.</p>
      </section>

      <section id="about" className={styles.about} data-reveal aria-labelledby="home-about-title">
        <div>
          <p className="catalog-kicker">La idea detrás de Chisan</p>
          <h2 id="home-about-title"><Link href="/how-we-work">Cómo funciona Chisan <span aria-hidden="true">↗</span></Link></h2>
        </div>
        <p><em>Chisan-chisho</em> habla de producir y consumir en el propio territorio. Del obrador de barrio a la huerta cercana, en Chisan esa idea se convierte en algo cotidiano: saber quién hay detrás de lo que comes, encontrarlo en el mapa y poder elegir con conocimiento. Cada ficha nace de fuentes y mejoras revisadas.</p>
      </section>
    </SectionReveal>
  );
}
