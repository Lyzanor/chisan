import type { Metadata } from "next";
import {
  getAvailableAreas,
  getEditorialFeaturedProducers,
  getPublicActivityTimeline,
  listFeaturedGuides,
} from "@/lib/activity/data";
import { ActivityCallToAction } from "@/components/activity/activity-cta";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ActivityFollowingBubbles } from "@/components/activity/activity-following-bubbles";
import { ActivityGuides } from "@/components/activity/activity-guides";
import { ActivityEvents } from "@/components/activity/activity-events";
import { ActivityZoneDiscovery } from "@/components/activity/activity-zone-discovery";
import { isAccountAuthConfigured } from "@/lib/accounts/config";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { listDiscoverEvents } from "@/lib/events/catalog";
import styles from "@/components/activity/activity.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // The root title template appends the site name; Open Graph titles are not
  // templated, so they add it themselves.
  const title = "Descubrir productores y novedades de tu zona";
  const description =
    "Descubre novedades de productores locales, destacados editoriales de tu zona, lecturas de temporada y actividad comunitaria.";
  const url = new URL("/actividad", SITE_ORIGIN).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
      locale: "es_ES",
    },
  };
}

export default async function ActivityPage() {
  const availableAreas = getAvailableAreas("es");

  const [initialFeaturedProducers, timelineItems] = await Promise.all([
    getEditorialFeaturedProducers("es", undefined, 4),
    getPublicActivityTimeline(20).catch(() => []),
  ]);

  const featuredGuides = listFeaturedGuides().slice(0, 3);
  const featuredEvents = listDiscoverEvents();

  return (
    <main className={`page-shell ${styles.shell}`}>
      <header className={styles.header}>
        <p className="chisan-eyebrow">Comunidad y territorio</p>
        <h1>Descubrir</h1>
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

      <ActivityEvents events={featuredEvents} />

      {/* 2. Burbujas de «Siguiendo» */}
      <ActivityFollowingBubbles authConfigured={isAccountAuthConfigured()} />

      {/* 3. Guías destacadas */}
      <ActivityGuides guides={featuredGuides} />

      {/* 4. Feed cronológico mixto */}
      <ActivityFeed items={timelineItems} />

      {/* 5. Cierre: sugerir productor local o aportar datos */}
      <ActivityCallToAction />
    </main>
  );
}
