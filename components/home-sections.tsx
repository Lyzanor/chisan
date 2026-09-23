import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChisanQrCode } from "@/components/brand/chisan-qr-code";
import { buildProfileQrUrl } from "@/lib/profile-qr";
import { USER_PRO_PATH } from "@/lib/accounts/pro-paths";
import { listDiscoverEvents } from "@/lib/events/catalog";
import { eventPath } from "@/lib/events/routes";
import { MapPinIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ChisanMascot, ChisanMark } from "@/components/brand/chisan-brand";
import { GuideHighlights } from "@/components/guides/guide-highlights";
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
  const event = listDiscoverEvents().find((item) => item.plan);
  const wine = categoryCounts.find((item) => item.token === "Vino");
  const cheese = categoryCounts.find((item) => item.token === "Lácteos y quesos");

  return (
    <div className={`home-story ${styles.sections}`}>
      <section className={`chisan-panel chisan-panel--tint ${styles.stats}`} data-reveal aria-label="Chisan en datos">
        <div className={styles.statsHeading}>
          <p className="chisan-eyebrow">Un mapa que crece con cada productor</p>
          <h2>La mayor base de datos de productores locales de España</h2>
          <p>Explora el mapa, conoce dónde están y acércate directamente.</p>
          {countryCatalog ? (
            <div className={styles.actions}>
              <Link className="chisan-button chisan-button--primary chisan-button--lg" href={countryCatalog.href}>
                Explorar el catálogo <ArrowUpRightIcon className="chisan-arrow" size={18} aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>
        <div className={styles.statsTotal}>
          <MapPinIcon size={28} aria-hidden="true" />
          <strong>{numberFormat.format(producerCount)}</strong>
          <span>productores en el catálogo</span>
        </div>
        {categoryCounts.length > 0 ? (
          <ul className={styles.categories} data-reveal-stagger aria-label="Categorías con más productores">
            {categoryCounts.map((category) => (
              <li key={category.token}>
                {category.href ? (
                  <Link className="chisan-card" href={category.href} aria-label={`${category.label}: ${numberFormat.format(category.count)} productores. Explorar en el mapa`}>
                    <span className={styles.categoryIcon} aria-hidden="true">{category.icon}</span>
                    <span>{category.label}</span>
                    <b>{numberFormat.format(category.count)}</b>
                    <ArrowUpRightIcon className="chisan-arrow" size={16} aria-hidden="true" />
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
            <ChisanQrCode value={buildProfileQrUrl("/es")} title="Abrir el mapa de Chisan" />
            <span>Escanea y descubre productores</span>
          </div>
          <ChisanMascot state="catalog" size={96} alt="" className={styles.qrMascot} />
        </div>
        <div className={styles.qrCopy}>
          <p className="chisan-eyebrow">El origen, a un escaneo</p>
          <h2 id="home-qr-title">Del puesto o la carta a la persona que produce.</h2>
          <p>El QR de Chisan abre la ficha de un productor o una selección compartida. Descubre el origen y contacta sin registrarte.</p>
          <p>Las etiquetas descargables forman parte del acceso Pro correspondiente.</p>
          <Link className="chisan-link" href="/cuenta/seleccion">
            Conoce tu selección <ArrowUpRightIcon className="chisan-arrow" size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={`chisan-panel chisan-panel--inverse ${styles.agent}`} data-reveal aria-labelledby="home-agent-title">
        <div>
          <p className="chisan-eyebrow">Agente Chisan</p>
          <h2 id="home-agent-title">Una foto puede abrir la puerta a todo un mapa.</h2>
          <p>
            {shelfAvailable
              ? "Envía una foto de tu estantería. Chisan propone productores; tú revisas, corriges y decides qué publicar."
              : "Organiza tus favoritos en una selección. Estamos preparando la lectura de fotos de estantería para conectarla con el mapa."}
          </p>
          <p>Para productores, el asistente de WhatsApp prepara novedades y productos para revisión cuando el canal esté disponible.</p>
          <div className={styles.actions}>
            <Link className="chisan-button chisan-button--inverse" href={shelfAvailable ? "/cuenta/estanteria" : "/cuenta/seleccion"}>
              Probar ahora <ArrowUpRightIcon className="chisan-arrow" size={18} aria-hidden="true" />
            </Link>
            <Link className="chisan-link chisan-link--inverse" href="/cuenta/whatsapp">
              Conoce el asistente de WhatsApp <ArrowUpRightIcon className="chisan-arrow" size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className={styles.agentVisual}>
          <div className={styles.agentPhoto}>
            <Image src="/editorial/guides/cava-maduracion-quesos.webp" alt="Quesos sobre una estantería de madera" width={1600} height={2400} sizes="(min-width: 761px) 40vw, 85vw" />
          </div>
          <div className={styles.agentResult} aria-hidden="true">
            <ChisanMascot state="search" size={56} alt="" />
            <span>02 / REVISIÓN</span>
            <strong>De la imagen a tus productores</strong>
            <small>Tú decides qué se publica</small>
          </div>
        </div>
      </section>

      <section data-reveal aria-labelledby="home-visual-title">
        <p className="chisan-eyebrow">Sigue el origen</p>
        <h2 id="home-visual-title">De lo que ves a quien lo produce</h2>
        <div className={styles.imageEntrances}>
          {[{ href: wine?.href ?? "/es/guias/vinos-de-espana-denominaciones-origen", src: "/editorial/guides/vino.webp", title: "El mapa del vino", alt: "Copa de vino tinto" }, { href: cheese?.href ?? "/es/guias/quesos-de-espana", src: "/editorial/guides/queso.webp", title: "Encuentra tu próxima quesería", alt: "Queso de corteza blanca con aceitunas sobre papel" }, ...(event?.plan ? [{ href: `${eventPath(event.slug)}#plano`, src: event.plan.src, title: `Dentro de ${event.title}`, alt: event.plan.alt }] : [])].map((item) => <Link key={item.href} className="chisan-card" href={item.href}>
            <div className="chisan-card__media"><Image src={item.src} alt={item.alt} width={640} height={420} sizes="(min-width: 761px) 30vw, 90vw" /></div>
            <span>{item.title}<ArrowUpRightIcon className="chisan-arrow" size={18} aria-hidden="true" /></span>
          </Link>)}
        </div>
        <p className={styles.note}>Fotografía de estantería: <a href="https://unsplash.com/photos/8TRKdGhW8TE" target="_blank" rel="noreferrer">Sandie Clarke / Unsplash</a>. Imágenes de vino y queso: créditos en nuestras <Link href="/es/guias">guías</Link>.</p>
      </section>

      <div data-reveal><GuideHighlights compactHome /></div>

      <div data-reveal>
        <Suspense fallback={<div className={`chisan-skeleton ${styles.communityLoading}`} aria-hidden="true" />}>
          <HomeCommunity />
        </Suspense>
      </div>

      <div className={styles.ctaPair} data-reveal-stagger>
        <section className={`chisan-panel chisan-panel--tint ${styles.cta}`} aria-labelledby="home-discover-title">
          <span className={styles.ctaMark} aria-hidden="true"><ChisanMascot state="following" size={56} alt="" /></span>
          <div>
            <p className="chisan-eyebrow">Comunidad y territorio</p>
            <h2 id="home-discover-title">Descubrir lo que ocurre cerca.</h2>
            <p>Conoce a productores destacados de tu provincia, eventos en los que participan, novedades de temporada y la actividad reciente de la comunidad.</p>
            <div className={styles.actions}>
              <Link className="chisan-button chisan-button--primary" href="/actividad">
                Ir a Descubrir <ArrowUpRightIcon className="chisan-arrow" size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className={`chisan-panel chisan-panel--tint ${styles.cta}`} aria-labelledby="home-producer-title">
          <span className={styles.ctaMark} aria-hidden="true"><ChisanMark alt="" /></span>
          <div>
            <p className="chisan-eyebrow">Tu trabajo merece conocerse</p>
            <h2 id="home-producer-title">¿Eres productor?</h2>
            <p>Encuentra tu ficha, verifica que es tuya y propón mejoras para mostrar lo que haces y cómo encontrarte.</p>
            <div className={styles.actions}>
              <Link className="chisan-button chisan-button--primary" href={`${ACCOUNT_ROUTES.signUp}?redirect_url=${encodeURIComponent("/cuenta/bienvenida?perfil=productor")}`}>
                Regístrate gratis <ArrowUpRightIcon className="chisan-arrow" size={18} aria-hidden="true" />
              </Link>
              <Link className="chisan-link" href="/cuenta/reclamaciones/nueva">Ya tengo cuenta</Link>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.plansSection} data-reveal aria-labelledby="home-plans-title">
        <p className="chisan-eyebrow">Un espacio para cada relación con el origen</p>
        <h2 id="home-plans-title">Empieza gratis. Crece a tu ritmo.</h2>
        <p className={styles.plansIntro}>Una cuenta para descubrir y compartir. Una ficha para quienes producen. Cada acceso Pro se activa por separado.</p>
        <div className={styles.plans}>
          <ResponsiveDisclosure
            className={styles.planCard}
            summary={<><span className={styles.planAudience}>01 / Para personas y negocios</span><strong className={styles.planName}>Usuario</strong><span className={styles.planPreview}>Free 0 € · Pro por consulta</span></>}
          >
            <div className={styles.planTier}><strong>Free</strong><span>0 €</span></div>
            <p>Sigue productores, comparte tu selección y ayuda a mejorar las fichas.</p>
            <div className={styles.planTier}><strong>Pro</strong><span>Por consulta</span></div>
            <p>QR descargable para tu selección. Perfil de negocio y consultas B2B en preparación.</p>
            <Link className="chisan-button chisan-button--primary" href={USER_PRO_PATH}>Conocer Usuario Pro</Link>
          </ResponsiveDisclosure>
          <ResponsiveDisclosure
            className={styles.planCard}
            summary={<><span className={styles.planAudience}>02 / Para productores</span><strong className={styles.planName}>Productor</strong><span className={styles.planPreview}>Free 0 € · Pro por consulta</span></>}
          >
            <div className={styles.planTier}><strong>Free</strong><span>0 €</span></div>
            <p>Ficha revisada, contacto, fotos y verificación de titularidad sin coste.</p>
            <div className={styles.planTier}><strong>Pro</strong><span>Por consulta</span></div>
            <p>Productos y enlaces de compra revisados, perfil ampliado, estadísticas y QR. Asistente por WhatsApp según disponibilidad.</p>
            <Link className="chisan-button chisan-button--primary" href="/pro?perfil=productor">Conocer Productor Pro</Link>
          </ResponsiveDisclosure>
        </div>
        <p className={styles.note}>La contratación online todavía no está disponible. Las funciones en preparación se activarán cuando estén listas.</p>
      </section>

      <section id="about" className={styles.about} data-reveal aria-labelledby="home-about-title">
        <div>
          <p className="chisan-eyebrow">La idea detrás de Chisan</p>
          <h2 id="home-about-title"><Link href="/how-we-work">Cómo funciona Chisan <span aria-hidden="true">↗</span></Link></h2>
        </div>
        <p><em>Chisan-chisho</em> habla de producir y consumir en el propio territorio. Del obrador de barrio a la huerta cercana, en Chisan esa idea se convierte en algo cotidiano: saber quién hay detrás de lo que comes, encontrarlo en el mapa y poder elegir con conocimiento. Cada ficha nace de fuentes y mejoras revisadas.</p>
      </section>
    </div>
  );
}
