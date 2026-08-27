import Link from "next/link";

import { ProducerSelectionMap } from "@/components/map/producers-map";
import { getCategoryIcon } from "@/lib/i18n/categories";
import type {
  ProducerMapMarker,
  ProducerSelectionPageModel,
} from "@/lib/producer-selections";

export type ProducerSelectionPageMessages = {
  producerCount: (count: number) => string;
  mappedCount: (count: number) => string;
  producers: string;
  details: string;
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
  const markers = selection.items.flatMap((item): ProducerMapMarker[] => {
    if (item.latitude === null || item.longitude === null) return [];
    if (item.latitude === 0 && item.longitude === 0) return [];

    return [
      {
        key: item.key,
        href: item.href,
        name: item.name,
        city: item.city,
        categories: item.categories,
        latitude: item.latitude,
        longitude: item.longitude,
      },
    ];
  });

  return (
    <main className="catalog-page--simple producer-selection-page">
      <header className="catalog-simple-header">
        <div>
          <p className="catalog-kicker">{selection.eyebrow}</p>
          <h1>{selection.title}</h1>
          <p>{selection.description}</p>
        </div>
        <p className="producer-selection-page__summary">
          {messages.producerCount(selection.items.length)} · {messages.mappedCount(markers.length)}
        </p>
      </header>

      <section className="catalog-simple-layout producer-selection-page__layout">
        <div className="catalog-simple-map" aria-label={messages.map.producerMap}>
          <ProducerSelectionMap
            points={markers}
            messages={{
              loading: messages.map.loading,
              emptyCoordinates: messages.map.emptyCoordinates,
              openProfile: messages.map.openProfile,
            }}
          />
        </div>

        <aside className="catalog-viewer" aria-label={messages.producers}>
          <div className="catalog-viewer-head">
            <h2>{messages.producers}</h2>
            <p>{messages.producerCount(selection.items.length)}</p>
          </div>

          {selection.items.length > 0 ? (
            <ul className="producer-compact-list">
              {selection.items.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="producer-compact-link">
                    <span className="producer-compact-icon" aria-hidden="true">
                      {getCategoryIcon(item.category)}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      {item.city ? (
                        <small className="producer-compact-location">{item.city}</small>
                      ) : null}
                      {item.categories.length ? (
                        <small>{item.categories.join(" · ")}</small>
                      ) : null}
                    </span>
                  </Link>
                  <Link href={item.href} className="producer-compact-detail">
                    {messages.details}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="catalog-empty">{selection.emptyMessage}</p>
          )}
        </aside>
      </section>
    </main>
  );
}
