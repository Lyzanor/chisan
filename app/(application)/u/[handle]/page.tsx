import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProducerSelectionPage } from "@/components/producer-selection-page";
import { isPublicProfileIndexable } from "@/lib/accounts/public-profile-policy";
import {
  findPublicUserProfile,
  listPublicProfileFavoriteIdentities,
} from "@/lib/accounts/public-profiles";
import {
  findPublicAccountSelection,
  listPublicSelectionsByUserId,
} from "@/lib/accounts/selections";
import { selectionPageMessages } from "@/lib/accounts/selection-presentation";
import { getUserPresentation } from "@/lib/accounts/user-presentation";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import {
  buildAccountSelectionPage,
  buildProducerSelectionItems,
} from "@/lib/producer-selections.server";
import { selectionShelfService } from "@/lib/selection-shelf/server";
import { isPublicDiscoveryEnabled, SITE_NAME, SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-dynamic";

type PublicUserProfilePageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: PublicUserProfilePageProps): Promise<Metadata> {
  const { handle } = await params;

  // 1. Check if handle matches a dedicated account selection
  const selectionRecord = await findPublicAccountSelection(handle);
  if (selectionRecord) {
    const title = selectionRecord.title;
    const description =
      selectionRecord.description ||
      `Una selección de productores y productos compartida en ${SITE_NAME}.`;
    const canonicalPath = `/u/${selectionRecord.publicHandle}`;
    const discoveryEnabled = isPublicDiscoveryEnabled();
    const indexable =
      discoveryEnabled && isPublicProfileIndexable(selectionRecord.visibility);

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

  // 2. Otherwise check if handle matches a user profile
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

  // 1. Check if handle matches a dedicated account selection (e.g. published shelf or list)
  const selectionRecord = await findPublicAccountSelection(handle);
  if (selectionRecord) {
    const [presentation, shelf] = await Promise.all([
      loadApplicationPresentation(),
      selectionShelfService().publicShelf(selectionRecord.id),
    ]);

    const identities =
      shelf && shelf.points.length > 0
        ? [
            ...new Map(
              shelf.points.map((p) => {
                const [country, id] = p.producerKey.split(":");
                return [`${country}:${id}`, { country, producerId: Number(id) }];
              }),
            ).values(),
          ]
        : [];

    const producers = await findProducersByIds(identities, presentation.locale);
    const items = buildProducerSelectionItems(producers, presentation);

    const selectionModel = {
      kind: "selection",
      canonicalPath: `/u/${selectionRecord.publicHandle}`,
      title: selectionRecord.title,
      eyebrow: selectionRecord.owner.displayName
        ? `Selección de ${selectionRecord.owner.displayName}`
        : "Selección de proximidad",
      description:
        selectionRecord.description ||
        (selectionRecord.baseLocation
          ? `Una selección de productores y productos en ${selectionRecord.baseLocation.municipality}.`
          : "Una selección de productores y productos locales."),
      emptyMessage: "Esta selección aún no tiene productores disponibles.",
      items,
      initialFocusKeys: items.map((item) => item.key),
    };

    return (
      <ProducerSelectionPage
        shelf={shelf}
        selection={selectionModel}
        profileAvatar={
          selectionRecord.owner.displayName
            ? {
                name: selectionRecord.owner.displayName,
                src: selectionRecord.owner.avatarUrl,
              }
            : undefined
        }
        messages={selectionPageMessages}
        profileQr={
          selectionRecord.profileQrEnabled
            ? {
                kind: "selection",
                locale: presentation.locale,
                name: selectionModel.title,
                path: selectionModel.canonicalPath,
              }
            : undefined
        }
      />
    );
  }

  // 2. Otherwise check if handle matches a user profile
  const profile = await findPublicUserProfile(handle);
  if (!profile) notFound();

  const [identities, presentation, accountPresentation, shelf, userSelections] =
    await Promise.all([
      listPublicProfileFavoriteIdentities(profile.id),
      loadApplicationPresentation(),
      getUserPresentation(getDatabase(), profile.id),
      selectionShelfService().publicShelf(profile.id),
      listPublicSelectionsByUserId(profile.id),
    ]);

  const producers = await findProducersByIds(identities, presentation.locale);
  const items = buildProducerSelectionItems(producers, presentation);
  const selection = buildAccountSelectionPage(profile, items);

  return (
    <ProducerSelectionPage
      shelf={shelf}
      selection={selection}
      profileAvatar={{
        name: profile.displayName || profile.publicHandle,
        src: accountPresentation.avatarUrl,
      }}
      messages={selectionPageMessages}
      userSelections={userSelections}
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
