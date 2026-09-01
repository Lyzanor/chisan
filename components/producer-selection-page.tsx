import { ProducerSelectionExplorer } from "@/components/producer-selection-explorer";
import type {
  ProducerSelectionExplorerModel,
  ProducerSelectionPageModel,
} from "@/lib/producer-selections";

export type ProducerSelectionPageMessages = {
  producerCount: (count: number) => string;
  mappedCount: (count: number) => string;
  producers: string;
  emptyGroup: string;
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
}: {
  selection: ProducerSelectionPageModel;
  messages: ProducerSelectionPageMessages;
}) {
  const mappedCount = selection.items.filter(
    (item) =>
      item.latitude !== null &&
      item.longitude !== null &&
      !(item.latitude === 0 && item.longitude === 0),
  ).length;
  const countLabels = Object.fromEntries(
    [...new Set([
      selection.items.length,
      ...selection.sections.map((section) => section.items.length),
    ])].map((count) => [String(count), messages.producerCount(count)]),
  );
  const explorerSelection = {
    canonicalPath: selection.canonicalPath,
    items: selection.items,
    sections: selection.sections.map(({ key, title, summary, items }) => ({
      key,
      title,
      summary,
      itemKeys: items.map((item) => item.key),
    })),
    initialFocusKeys: selection.initialFocusKeys,
  } satisfies ProducerSelectionExplorerModel;

  return (
    <main className="catalog-page catalog-page--simple producer-selection-page">
      <header className="catalog-simple-header">
        <div>
          <p className="catalog-kicker">{selection.eyebrow}</p>
          <h1>{selection.title}</h1>
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
            emptyGroup: messages.emptyGroup,
            countLabels,
            map: messages.map,
          }}
        />
      ) : (
        <p className="catalog-empty">{selection.emptyMessage}</p>
      )}
    </main>
  );
}
