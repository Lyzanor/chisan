"use client";

import Link from "next/link";

import { classNames, getCategoryGlyph } from "@/components/home-map/helpers";
import { IconChevronRight } from "@/components/home-map/icons";
import type { ProducerListItem } from "@/lib/types";

type ProducerCardProps = {
  producer: ProducerListItem;
  compact?: boolean;
  selected: boolean;
  onSelect: (id: number) => void;
  onRef?: (node: HTMLElement | null) => void;
};

export default function ProducerCard({
  producer,
  compact = false,
  selected,
  onSelect,
  onRef,
}: ProducerCardProps) {
  const categoryLabel = producer.category ?? "Sin categoría";
  const cityLabel = producer.city ?? "Sin municipio";

  return (
    <article
      ref={(node) => {
        if (onRef) {
          onRef(node);
        }
      }}
      className={classNames("km0-result-card", selected && "is-active")}
    >
      <button
        type="button"
        onClick={() => onSelect(producer.id)}
        className="km0-result-main"
        aria-label={`Seleccionar ${producer.name}`}
      >
        <div className="km0-result-head">
          <span className="km0-glyph" aria-hidden="true">
            {getCategoryGlyph(categoryLabel)}
          </span>
          <div className="min-w-0">
            <p className="km0-result-title truncate">{producer.name}</p>
            <p className="km0-result-meta truncate">
              {cityLabel} · {categoryLabel}
            </p>
          </div>
        </div>

        {!compact && producer.description && <p className="km0-result-desc">{producer.description}</p>}

        <div className="km0-tag-row">
          <span className="km0-tag">{cityLabel}</span>
          <span className="km0-tag">
            {producer.latitude !== null && producer.longitude !== null ? "Con mapa" : "Sin coordenadas"}
          </span>
        </div>
      </button>

      <Link href={`/p/${producer.slug}`} className="km0-result-link">
        Ver ficha <IconChevronRight />
      </Link>
    </article>
  );
}
