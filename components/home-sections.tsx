import { Suspense } from "react";
import Link from "next/link";
import {
  MapPinIcon,
  QrCodeIcon,
  ArrowUpRightIcon,
  PlantIcon,
} from "@phosphor-icons/react/ssr";
import { GuideHighlights } from "@/components/guides/guide-highlights";
import { SectionReveal } from "@/components/section-reveal";
import { HomeCommunity } from "@/components/home-community";
import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import styles from "./home.module.css";

export function HomeSections({ producerCount }: { producerCount: number }) {
  return (
    <SectionReveal>
      <section
        className={styles.stats}
        data-reveal
        aria-label="Chisan en datos"
      >
        <p>
          <strong>
            {new Intl.NumberFormat("es-ES").format(producerCount)}
          </strong>
          <span>productores en el catálogo</span>
        </p>
        <div>
          <p className="catalog-kicker">Cada ficha, un lugar de origen</p>
          <h2>Hay mucho por descubrir cerca de ti.</h2>
          <p>
            Explora el mapa, conoce su trabajo y encuentra cómo contactar
            directamente.
          </p>
        </div>
      </section>
      <div data-reveal>
        <GuideHighlights />
      </div>
      <section
        className={styles.producer}
        data-reveal
        aria-labelledby="home-producer-title"
      >
        <PlantIcon size={40} aria-hidden="true" />
        <div>
          <p className="catalog-kicker">Tu trabajo merece conocerse</p>
          <h2 id="home-producer-title">¿Eres productor?</h2>
          <p>
            Regístrate, encuentra tu ficha y reclámala. Podrás proponer cambios
            para que quienes te buscan conozcan mejor lo que haces y cómo
            encontrarte.
          </p>
          <Link className={styles.button} href={ACCOUNT_ROUTES.signUp}>
            Regístrate gratis <ArrowUpRightIcon size={18} aria-hidden="true" />
          </Link>
          <Link className={styles.textLink} href="/cuenta/reclamaciones/nueva">
            Ya tengo cuenta
          </Link>
        </div>
      </section>
      <div data-reveal>
        <Suspense
          fallback={
            <div className={styles.communityLoading} aria-hidden="true" />
          }
        >
          <HomeCommunity />
        </Suspense>
      </div>
      <section
        className={styles.section}
        data-reveal
        aria-labelledby="home-plans-title"
      >
        <p className="catalog-kicker">Tu espacio en Chisan</p>
        <h2 id="home-plans-title">Empieza gratis. Haz crecer tu presencia.</h2>
        <div className={styles.plans}>
          <article>
            <p className="catalog-kicker">Para empezar</p>
            <h3>Cuenta gratuita</h3>
            <p className={styles.price}>0 €</p>
            <p>Para descubrir, guardar y participar.</p>
            <ul>
              <li>Sigue a tus productores favoritos.</li>
              <li>Comparte una selección en tu perfil, si quieres.</li>
              <li>Sugiere mejoras en las fichas.</li>
              <li>Reclama tu productor y propón cambios.</li>
            </ul>
            <Link className={styles.button} href={ACCOUNT_ROUTES.signUp}>
              Crear mi cuenta
            </Link>
          </article>
          <article>
            <p className="catalog-kicker">Más posibilidades</p>
            <h3>Premium</h3>
            <p className={styles.availability}>Acceso por consulta</p>
            <p>Para contar más y compartir el origen.</p>
            <ul>
              <li>
                Productores: perfil ampliado con productos, fotos y formas de
                producción.
              </li>
              <li>Productores: estadísticas privadas de visitas.</li>
              <li>Cuentas: QR para compartir tu selección de productores.</li>
            </ul>
            <p className={styles.note}>
              El acceso premium de una cuenta y el de una ficha de productor se
              activan por separado. La contratación online aún no está
              disponible.
            </p>
            <Link className={styles.textLink} href="/contact">
              Consultar premium <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
      </section>
      <section
        className={styles.qr}
        data-reveal
        aria-labelledby="home-qr-title"
      >
        <div className={styles.qrVisual} aria-hidden="true">
          <QrCodeIcon size={112} weight="light" />
          <span>Del QR al origen</span>
          <MapPinIcon size={32} />
        </div>
        <div>
          <p className="catalog-kicker">Chisan también fuera de la pantalla</p>
          <h2 id="home-qr-title">Una etiqueta. Toda una historia detrás.</h2>
          <p>
            Un QR de Chisan abre una ficha de productor o una selección
            compartida. Ponlo en tu puesto, tienda o carta para que otras
            personas descubran de dónde viene lo que ofreces.
          </p>
          <p>
            Con el acceso premium correspondiente puedes activar y descargar tu
            etiqueta desde la cuenta. Quien la escanea puede explorar el destino
            público sin registrarse.
          </p>
          <Link className={styles.textLink} href="/cuenta/seleccion">
            Preparar mi selección <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section
        id="about"
        className={styles.about}
        data-reveal
        aria-labelledby="home-about-title"
      >
        <p className="catalog-kicker">Producir cerca. Consumir cerca.</p>
        <h2 id="home-about-title">
          <Link href="/how-we-work">
            Cómo funciona Chisan <span aria-hidden="true">↗</span>
          </Link>
        </h2>
        <p>
          Nos inspira el <em>chisan-chisho</em>: producir y consumir en el
          propio territorio. Conectamos productores y personas a través de un
          catálogo con fuentes públicas y mejoras revisadas. Tú eliges dónde
          empezar.
        </p>
      </section>
    </SectionReveal>
  );
}
