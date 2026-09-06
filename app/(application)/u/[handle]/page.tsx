import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProducerSelectionPage } from "@/components/producer-selection-page";
import { getUserPresentation } from "@/lib/accounts/user-presentation";
import { getDatabase } from "@/lib/db";
import { isPublicProfileIndexable } from "@/lib/accounts/public-profile-policy";
import {
  findPublicUserProfile,
  listPublicProfileFavoriteIdentities,
} from "@/lib/accounts/public-profiles";
import { findProducersByIds } from "@/lib/csv-catalog";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import {
  buildAccountSelectionPage,
  buildProducerSelectionItems,
} from "@/lib/producer-selections.server";
import { selectionPageMessages } from "@/lib/accounts/selection-presentation";
import { isPublicDiscoveryEnabled, SITE_NAME, SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-dynamic";

type PublicUserProfilePageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: PublicUserProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const profile = await findPublicUserProfile(handle);
  if (!profile) {
    return {
      title: "Perfil no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const title =
    profile.selectionTitle || profile.displayName || `@${profile.publicHandle}`;
  const description =
    profile.selectionDescription ||
    `Una selección de productores compartida por ${title} en ${SITE_NAME}.`;
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

  const [identities, presentation, accountPresentation] = await Promise.all([
    listPublicProfileFavoriteIdentities(profile.id),
    loadApplicationPresentation(),
    getUserPresentation(getDatabase(), profile.id),
  ]);
  const producers = await findProducersByIds(identities, presentation.locale);
  const items = buildProducerSelectionItems(producers, presentation);
  const selection = buildAccountSelectionPage(profile, items);

  return (
    <ProducerSelectionPage
      selection={selection}
      profileAvatar={{ name: profile.displayName || profile.publicHandle, src: accountPresentation.avatarUrl }}
      messages={selectionPageMessages}
      profileQr={
        profile.profileQrEnabled
          ? {
              kind: "selection",
              locale: presentation.locale,
              name: selection.title,
              path: selection.canonicalPath,
            }
          : undefined
      }
    />
  );
}
