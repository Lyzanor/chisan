import { CaretLeftIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import styles from "./producer-onboarding.module.css";

export { styles as onboardingStyles };

/** Search, confirm, verify and relationship: the four producer screens. */
export const PRODUCER_ONBOARDING_STEPS = 4;

const GENERIC_PRODUCER_IMAGE = "/productores/generica.webp";

export function OnboardingHeader({
  step,
  back,
  title,
  lead,
}: {
  step: number;
  back?: ReactNode;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        {back}
        <p className={styles.stepCount}>
          Paso {step} de {PRODUCER_ONBOARDING_STEPS}
        </p>
      </div>
      <div
        className={styles.progress}
        style={{ "--steps": PRODUCER_ONBOARDING_STEPS } as CSSProperties}
        aria-hidden="true"
      >
        {Array.from({ length: PRODUCER_ONBOARDING_STEPS }, (_, index) => (
          <span key={index} data-done={index < step} />
        ))}
      </div>
      <h2 className={styles.title}>{title}</h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </header>
  );
}

export function OnboardingBackLink({ href }: { href: string }) {
  return (
    <Link href={href} className={styles.back}>
      <CaretLeftIcon size={18} aria-hidden="true" /> Atrás
    </Link>
  );
}

export function ProducerImage({
  src,
  className,
  width,
  height,
  sizes,
  eager = false,
}: {
  src: string | null;
  className: string;
  width: number;
  height: number;
  sizes: string;
  eager?: boolean;
}) {
  return (
    <Image
      src={src ?? GENERIC_PRODUCER_IMAGE}
      alt=""
      width={width}
      height={height}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={className}
    />
  );
}
