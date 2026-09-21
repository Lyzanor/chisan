import type { PublicSelectionShelf } from "@/lib/selection-shelf/policy";
import { ProducerSelectionExplorer } from "@/components/producer-selection-explorer";
import { UserAvatar } from "@/components/account/user-avatar";
import {
  ProfileQrLabel,
  type ProfileQrLabelProps,
} from "@/components/profile-qr-label";
import {
  hasProducerSelectionCoordinates,
  type ProducerSelectionExplorerModel,
  type ProducerSelectionPageModel,
} from "@/lib/producer-selections";

export type ProducerSelectionPageMessages = {
  producerCount: (count: number) => string;
  mappedCount: (count: number) => string;
  producers: string;
  map: {
    loading: string;
    emptyCoordinates: string;
    producerMap: string;
    openProfile: string;
  };
};

export function ProducerSelectionPage({
  selection,
  messages,
  profileQr,
  embedded = false,
  profileAvatar,
  shelf,
  userSelections,
}: {
  selection: ProducerSelectionPageModel;
  messages: ProducerSelectionPageMessages;
  profileQr?: ProfileQrLabelProps;
  embedded?: boolean;
  profileAvatar?: { name: string; src: string | null };
  shelf?: PublicSelectionShelf | null;
  userSelections?: Array<{ publicHandle: string; title: string; description: string | null }>;
}) {
  const mappedCount = selection.items.filter(
    hasProducerSelectionCoordinates,
  ).length;
  const countLabels = {
    [String(selection.items.length)]: messages.producerCount(
      selection.items.length,
    ),
  };
  const explorerSelection = {
    canonicalPath: selection.canonicalPath,
    items: selection.items,
    initialFocusKeys: selection.initialFocusKeys,
  } satisfies ProducerSelectionExplorerModel;

  const Container = embedded ? "section" : "main";
  const Heading = embedded ? "h2" : "h1";
  return (
    <Container
      className={`catalog-page ${
        shelf
          ? "producer-selection-page producer-selection-page--with-shelf"
          : "catalog-page--simple producer-selection-page"
      }`}
    >
      <header className="catalog-simple-header">
        <div>
          {profileAvatar ? <UserAvatar name={profileAvatar.name} src={profileAvatar.src} size={64} /> : null}
          <p className="catalog-kicker">{selection.eyebrow}</p>
          <Heading>{selection.title}</Heading>
          <p>{selection.description}</p>
        </div>
        {selection.items.length ? (
          <p className="producer-selection-page__summary">
            {messages.producerCount(selection.items.length)} ·{" "}
            {messages.mappedCount(mappedCount)}
          </p>
        ) : null}
      </header>

      {userSelections && userSelections.length > 0 ? (
        <aside
          className="producer-selection-page__subselections"
          aria-label="Selecciones y estanterías"
          style={{
            marginInline: shelf ? "var(--chisan-space-4)" : 0,
            marginBlockEnd: "var(--chisan-space-4)",
          }}
        >
          <p className="catalog-kicker" style={{ margin: 0, marginBottom: "var(--chisan-space-2)" }}>
            Selecciones y estanterías
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {userSelections.map((sel) => (
              <a
                key={sel.publicHandle}
                href={`/u/${sel.publicHandle}`}
                className="account-button account-button--secondary"
              >
                {sel.title}
              </a>
            ))}
          </div>
        </aside>
      ) : null}

      {selection.items.length ? (
        <ProducerSelectionExplorer
          shelf={shelf}
          selection={explorerSelection}
          messages={{
            producers: messages.producers,
            countLabels,
            map: messages.map,
          }}
        />
      ) : (
        <p className="catalog-empty">{selection.emptyMessage}</p>
      )}
      {profileQr ? <ProfileQrLabel {...profileQr} /> : null}
    </Container>
  );
}
