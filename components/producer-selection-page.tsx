import { ProducerSelectionExplorer } from "@/components/producer-selection-explorer";
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
}: {
  selection: ProducerSelectionPageModel;
  messages: ProducerSelectionPageMessages;
  profileQr?: ProfileQrLabelProps;
  embedded?: boolean;
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
    <Container className="catalog-page catalog-page--simple producer-selection-page">
      <header className="catalog-simple-header">
        <div>
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

      {selection.items.length ? (
        <ProducerSelectionExplorer
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
