import Link from "next/link";
import { PlusCircleIcon, InfoIcon } from "@phosphor-icons/react/ssr";
import styles from "./activity.module.css";

export function ActivityCallToAction() {
  return (
    <section className={styles.cta} aria-labelledby="activity-cta-title">
      <div className={styles.ctaContent}>
        <p className={styles.kicker}>Participación y comunidad</p>
        <h2 id="activity-cta-title">
          ¿Conoces a un productor local o quieres aportar datos?
        </h2>
        <p>
          Chisan crece gracias a la comunidad. Si conoces un obrador, bodega, almazara o
          quesería artesanal de tu zona que deba formar parte del catálogo, o si ves datos que podamos
          mejorar, ayúdanos a enriquecer el mapa.
        </p>
      </div>
      <div className={styles.ctaActions}>
        <Link href="/contact" className={styles.buttonPrimary}>
          <PlusCircleIcon size={18} aria-hidden="true" />
          <span>Sugerir productor local</span>
        </Link>
        <Link href="/how-we-work" className={styles.buttonSecondary}>
          <InfoIcon size={18} aria-hidden="true" />
          <span>Cómo colaboramos</span>
        </Link>
      </div>
    </section>
  );
}
