import type { Metadata } from "next";
import { getCurrentAccount } from "@/lib/accounts/auth";
import {
  getActivityFeed,
  getAvailableAreas,
  getEditorialFeaturedProducers,
  getFollowedProducers,
  listFeaturedGuides,
} from "@/lib/activity/data";
import { ActivityCallToAction } from "@/components/activity/activity-cta";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ActivityFollowingBubbles } from "@/components/activity/activity-following-bubbles";
import { ActivityGuides } from "@/components/activity/activity-guides";
import { ActivityZoneDiscovery } from "@/components/activity/activity-zone-discovery";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import styles from "@/components/activity/activity.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = `Actividad en tu zona y novedades de productores | ${SITE_NAME}`;
  const description =
    "Descubre novedades de productores locales, destacados editoriales de tu zona, lecturas de temporada y actividad comunitaria.";
  const url = new URL("/actividad", SITE_ORIGIN).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "es_ES",
    },
  };
}

export default async function ActivityPage() {
  const account = await getCurrentAccount();
  const availableAreas = getAvailableAreas("es");

  const [initialFeaturedProducers, followedProducers, timelineItems] =
    await Promise.all([
      getEditorialFeaturedProducers("es", undefined, 4),
      account ? getFollowedProducers(account.id) : Promise.resolve([]),
      getActivityFeed(account?.id, 20),
    ]);

  const featuredGuides = listFeaturedGuides().slice(0, 3);

  return (
    <main className={`page-shell ${styles.shell}`}>
      <header className={styles.header}>
        <p className={styles.kicker}>Comunidad y territorio</p>
        <h1>Actividad y Novedades</h1>
        <p className={styles.tagline}>
          Descubre qué está pasando cerca de ti, conoce a productores destacados de tu
          zona, sigue a tus favoritos y lee las guías de temporada.
        </p>
      </header>

      {/* 1. En tu zona (Descubrir) */}
      <ActivityZoneDiscovery
        availableAreas={availableAreas}
        initialFeaturedProducers={initialFeaturedProducers}
      />

      {/* 2. Burbujas de «Siguiendo» */}
      <ActivityFollowingBubbles
        followedProducers={followedProducers}
        isSignedIn={Boolean(account)}
      />

      {/* 3. Guías destacadas */}
      <ActivityGuides guides={featuredGuides} />

      {/* 4. Feed cronológico mixto */}
      <ActivityFeed items={timelineItems} />

      {/* 5. Cierre: sugerir productor local o aportar datos */}
      <ActivityCallToAction />
    </main>
  );
}
