import Link from "next/link";

import { IconChevronRight } from "@/components/home-map/icons";
import type { ProducerListItem } from "@/lib/types";

type ActiveProducerOverlayProps = {
  producer: ProducerListItem | null;
  actionLabel: string;
};

export default function ActiveProducerOverlay({ producer, actionLabel }: ActiveProducerOverlayProps) {
  if (!producer) {
    return null;
  }

  return (
    <div className="km0-active-overlay">
      <p className="km0-active-title">{producer.name}</p>
      <p className="km0-active-meta">
        {producer.city ?? "Sin municipio"}
        {producer.category ? ` · ${producer.category}` : ""}
      </p>
      <Link href={`/p/${producer.slug}`} className="km0-result-link">
        {actionLabel} <IconChevronRight />
      </Link>
    </div>
  );
}
