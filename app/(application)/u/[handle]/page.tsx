import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ProducerSelectionPage,
  type ProducerSelectionPageMessages,
} from "@/components/producer-selection-page";
import { isPublicProfileIndexable } from "@/lib/accounts/public-profile-policy";
import {
  findPublicUserProfile,
  listPublicProfileFavoriteIdentities,
} from "@/lib/accounts/public-profiles";
import {
  findProducersByIds,
  findPublishedCountry,
  getLocalizedCatalogLabel,
} from "@/lib/csv-catalog";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { buildProducerSelectionItems } from "@/lib/producer-selections.server";
import {
  getProducerSelectionInitialFocusKeys,
  groupProducerSelectionItems,
} from "@/lib/producer-selections";
import { isPublicDiscoveryEnabled, SITE_NAME, SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-dynamic";

type PublicUserProfilePageProps = {
  params: Promise<{ handle: string }>;
};

const pageMessages: ProducerSelectionPageMessages = {
  producerCount: (count) => `${count} ${count === 1 ? "producer" : "producers"}`,
  mappedCount: (count) => `${count} mapped`,
  producers: "Shared producers",
  emptyGroup: "No shared producers in this group.",
  map: {
    loading: "Loading map…",
    emptyCoordinates: "No shared producers have valid coordinates yet.",
    producerMap: "Shared producer map",
    openProfile: "Open producer profile",
  },
};

export async function generateMetadata({
  params,
}: PublicUserProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const profile = await findPublicUserProfile(handle);
  if (!profile) {
    return {
      title: "Profile not found",
      robots: { index: false, follow: false },
    };
  }

  const title = profile.displayName || `@${profile.publicHandle}`;
  const description = `A personal selection of local producers shared by ${title} on ${SITE_NAME}.`;
  const canonicalPath = `/u/${profile.publicHandle}`;
  const discoveryEnabled = isPublicDiscoveryEnabled();
  const indexable =
    discoveryEnabled && isPublicProfileIndexable(profile.visibility);

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    robots: { index: indexable, follow: discoveryEnabled },
    openGraph: {
      title,
      description,
      url: new URL(canonicalPath, SITE_ORIGIN),
      siteName: SITE_NAME,
      type: "profile",
    },
  };
}

export default async function PublicUserProfilePage({
  params,
}: PublicUserProfilePageProps) {
  const { handle } = await params;
  const profile = await findPublicUserProfile(handle);
  if (!profile) notFound();

  const [identities, presentation] = await Promise.all([
    listPublicProfileFavoriteIdentities(profile.id),
    loadApplicationPresentation(),
  ]);
  const producers = await findProducersByIds(identities, presentation.locale);
  const items = buildProducerSelectionItems(producers, presentation);
  const groups = groupProducerSelectionItems(items, profile.baseLocation);
  const baseCountry = findPublishedCountry(profile.baseLocation.country);
  const baseArea = baseCountry?.regions
    .flatMap((region) => region.areas)
    .find((area) => area.slug === profile.baseLocation.area);
  const baseAreaLabel = baseArea
    ? getLocalizedCatalogLabel(baseArea, presentation.locale)
    : profile.baseLocation.area;
  const profileName = profile.displayName || `@${profile.publicHandle}`;
  const canonicalPath = `/u/${profile.publicHandle}`;

  return (
    <ProducerSelectionPage
      selection={{
        kind: "user-profile",
        canonicalPath,
        eyebrow: `Producer map by @${profile.publicHandle}`,
        title: profileName,
        description: `A personal selection of local producers shared by ${profileName}. Producers around ${profile.baseLocation.municipality} appear first.`,
        emptyMessage: "This profile has not shared any producers yet.",
        items,
        sections: [
          {
            key: "near-me",
            title: "Near me",
            summary: profile.baseLocation.municipality,
            items: groups["near-me"],
          },
          {
            key: "in-my-area",
            title: "In my area",
            summary: baseAreaLabel,
            items: groups["in-my-area"],
          },
          {
            key: "further-away",
            title: "Further away",
            summary: `Outside ${baseAreaLabel}`,
            items: groups["further-away"],
          },
        ],
        initialFocusKeys: getProducerSelectionInitialFocusKeys(groups),
      }}
      messages={pageMessages}
      profileQr={
        profile.profileQrEnabled
          ? {
              kind: "selection",
              locale: presentation.locale,
              name: profileName,
              path: canonicalPath,
            }
          : undefined
      }
    />
  );
}
