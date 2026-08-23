import Link from "next/link";
import { Suspense } from "react";

import { AreaSelector } from "@/components/area-selector";
import { ProducersMap } from "@/components/map/producers-map";
import { buildCatalogHref, buildProducerHref, readQueryParam } from "@/lib/catalog-navigation";
import {
  type Country,
  getAreaLabel,
  listCategories,
  searchProducers,
  toProducerMapPoints,
} from "@/lib/csv-catalog";
import { getCategoryIcon } from "@/lib/get-category-icon";
import { SITE_NAME } from "@/lib/site";

type AreaCatalogProps = {
  country: Country;
  area: string;
  searchParams: Record<string, string | string[] | undefined>;
};

const DESCRIPTION_PREVIEW_MAX_LENGTH = 120;

function getFieldValue(fields: Record<string, string>, key: string): string {
  const match = Object.entries(fields).find(
    ([field]) => field.toLocaleLowerCase() === key.toLocaleLowerCase(),
  );

  return (match?.[1] ?? "").trim();
}

function getDescriptionPreview(fields: Record<string, string>): string {
  const description = getFieldValue(fields, "descripcion");
  const characters = Array.from(description);

  if (characters.length <= DESCRIPTION_PREVIEW_MAX_LENGTH) {
    return description;
  }

  return `${characters
    .slice(0, DESCRIPTION_PREVIEW_MAX_LENGTH - 1)
    .join("")
    .trimEnd()}…`;
}

export async function AreaCatalog({ country, area, searchParams }: AreaCatalogProps) {
  const category = readQueryParam(searchParams, "category");
  const highlightedSlug = readQueryParam(searchParams, "highlight");
  const countrySlug = country.slug;

  const [items, categories, allRows] = await Promise.all([
    searchProducers({ municipality: "", category }, countrySlug, area),
    listCategories(countrySlug, area),
    searchProducers({ municipality: "", category: "" }, countrySlug, area),
  ]);

  const highlightedItem = highlightedSlug
    ? items.find((item) => item.slug === highlightedSlug) ??
      items.find((item) => String(item.producerId) === highlightedSlug)
    : undefined;
  const highlightedDescription = highlightedItem
    ? getDescriptionPreview(highlightedItem.fields)
    : "";
  const mapPoints = toProducerMapPoints(items);
  const visibleItems = items.slice(0, 500);
  const areaLabel = getAreaLabel(countrySlug, area);

  return (
    <main className="catalog-page catalog-page--simple">
      <header className="catalog-simple-header">
        <div>
          <p className="catalog-kicker">
            <Link href="/" className="country-back-link">
              {SITE_NAME}
            </Link>{" "}
            ·{" "}
            <Link href={`/${countrySlug}`} className="country-back-link">
              {country.label}
            </Link>
          </p>
          <h1>Producer map</h1>
          <p>
            {areaLabel} · {items.length} producers found · {mapPoints.length} on the map
          </p>
        </div>

        <Suspense fallback={<div className="area-selector--loading">{country.label}…</div>}>
          <AreaSelector country={country} currentArea={area} />
        </Suspense>
      </header>

      <nav className="catalog-simple-categories" aria-label="Categories">
        <Link
          href={buildCatalogHref({ country: countrySlug, area })}
          className={`catalog-chip ${!category ? "is-active" : ""}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={buildCatalogHref({ country: countrySlug, area, category: cat })}
            className={`catalog-chip ${category === cat ? "is-active" : ""}`}
          >
            <span aria-hidden="true">{getCategoryIcon(cat)}</span>
            {cat}
          </Link>
        ))}
      </nav>

      <section className="catalog-simple-layout">
        <div className="catalog-simple-map" aria-label="Producer map">
          <ProducersMap
            points={mapPoints}
            country={countrySlug}
            area={area}
            highlightedSlug={highlightedItem?.slug}
          />
        </div>

        <aside className="catalog-viewer" aria-label="Producers">
          {highlightedItem ? (
            <article className="catalog-featured-producer">
              <p className="catalog-kicker">Selected</p>
              <h2>{highlightedItem.name}</h2>
              {highlightedDescription ? <p>{highlightedDescription}</p> : null}
              <div className="catalog-featured-actions">
                <Link href={buildCatalogHref({ country: countrySlug, area, category })}>
                  See all
                </Link>
                <Link
                  href={buildProducerHref(highlightedItem, { country: countrySlug, area })}
                >
                  Open profile
                </Link>
              </div>
            </article>
          ) : null}

          <div className="catalog-viewer-head">
            <h2>Producers</h2>
            <p>
              Showing {visibleItems.length} of {items.length}
              {allRows.length !== items.length ? ` · ${allRows.length} total in ${areaLabel}` : ""}
            </p>
          </div>

          {visibleItems.length > 0 ? (
            <ul className="producer-compact-list">
              {visibleItems.map((item) => {
                const description = getDescriptionPreview(item.fields);

                return (
                  <li
                    key={item.producerId}
                    className={highlightedItem?.slug === item.slug ? "is-selected" : ""}
                  >
                    <Link
                      href={buildCatalogHref({
                        country: countrySlug,
                        area,
                        category,
                        highlight: item.slug,
                      })}
                      scroll={false}
                      className="producer-compact-link"
                    >
                      <span className="producer-compact-icon" aria-hidden="true">
                        {getCategoryIcon(item.category)}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        {description ? <small>{description}</small> : null}
                      </span>
                    </Link>
                    <Link
                      href={buildProducerHref(item, { country: countrySlug, area })}
                      className="producer-compact-detail"
                    >
                      Details
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="catalog-empty">No producers in this category for {areaLabel}.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
