"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { UserPlusIcon, HeartIcon } from "@phosphor-icons/react";
import { getFollowedProducersAction } from "@/app/(application)/actividad/actions";
import { useProducerFollows } from "@/components/account/producer-follows-context";
import type { ActivityFollowedProducer } from "@/lib/activity/data";
import styles from "./activity.module.css";

type ActivityFollowingBubblesViewProps = {
  isLoaded: boolean;
  isSignedIn: boolean;
};

function ActivityFollowingBubblesView({
  isLoaded,
  isSignedIn,
}: ActivityFollowingBubblesViewProps) {
  const followState = useProducerFollows();
  const [producers, setProducers] = useState<ActivityFollowedProducer[]>([]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }
    let active = true;
    getFollowedProducersAction()
      .then((items) => {
        if (active) setProducers(items);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, followState.keys.length]);

  const activeProducers =
    !isSignedIn
      ? []
      : followState.status === "ready"
        ? producers.filter((p) => followState.keys.includes(p.key))
        : producers;

  return (
    <section className={styles.bubblesSection} aria-labelledby="following-bubbles-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.kicker}>Tu red local</p>
          <h2 id="following-bubbles-title">Siguiendo</h2>
        </div>
        {isSignedIn && activeProducers.length > 0 ? (
          <Link href="/cuenta/siguiendo" className={styles.sectionLink}>
            Gestionar seguimientos ({activeProducers.length}) →
          </Link>
        ) : null}
      </div>

      {!isLoaded ? (
        <div className={styles.bubblesGuest}>
          <span>Cargando tus preferencias...</span>
        </div>
      ) : !isSignedIn ? (
        <div className={styles.bubblesGuest}>
          <span>Inicia sesión para guardar a tus productores de referencia y ver sus novedades aquí.</span>
          <Link href="/acceso" className={styles.buttonSecondary}>
            <UserPlusIcon size={18} aria-hidden="true" />
            <span>Iniciar sesión</span>
          </Link>
        </div>
      ) : activeProducers.length === 0 ? (
        <div className={styles.bubblesEmpty}>
          <span>Aún no sigues a ningún productor. Pulsa «Seguir» en sus perfiles para estar al día.</span>
          <Link href="/#choose-country" className={styles.buttonSecondary}>
            <HeartIcon size={18} aria-hidden="true" />
            <span>Descubrir en el mapa</span>
          </Link>
        </div>
      ) : (
        <div className={styles.bubblesScroller} role="list" aria-label="Productores seguidos">
          {activeProducers.map((producer) => {
            const hasCustomImage =
              producer.imageSrc && !producer.imageSrc.includes("generica");

            return (
              <Link
                key={producer.key}
                href={producer.href}
                className={styles.bubbleItem}
                title={`${producer.name} (${producer.city})`}
              >
                {hasCustomImage ? (
                  <Image
                    src={producer.imageSrc}
                    alt=""
                    width={60}
                    height={60}
                    className={styles.bubbleAvatar}
                  />
                ) : (
                  <div className={styles.bubbleAvatar}>
                    {producer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={styles.bubbleName}>{producer.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function AuthenticatedActivityFollowingBubbles() {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <ActivityFollowingBubblesView isLoaded={isLoaded} isSignedIn={isSignedIn === true} />
  );
}

// Clerk hooks need the ClerkProvider that the site shell adds only when account
// auth is configured; without it the section keeps its signed-out state.
export function ActivityFollowingBubbles({ authConfigured }: { authConfigured: boolean }) {
  if (authConfigured) {
    return <AuthenticatedActivityFollowingBubbles />;
  }
  return <ActivityFollowingBubblesView isLoaded isSignedIn={false} />;
}
