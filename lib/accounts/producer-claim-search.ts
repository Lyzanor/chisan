import "server-only";

import {
  CatalogRequestError,
  findPublicProducersByContact,
  searchPublicProducers,
} from "@/lib/agents/public-catalog";
import type { PublicProducerBase } from "@/lib/agents/catalog-schema";
import { SITE_ORIGIN } from "@/lib/site";

/** What the onboarding needs to recognise a producer profile at a glance. */
export type ClaimableProducer = {
  country: string;
  producerId: number;
  name: string;
  municipality: string;
  area: string;
  imageSrc: string | null;
};

function toClaimableProducer(producer: PublicProducerBase): ClaimableProducer {
  return {
    country: producer.country,
    producerId: producer.producer_id,
    name: producer.name,
    municipality: producer.municipality,
    area: producer.area.name,
    imageSrc: producer.image_url?.startsWith(SITE_ORIGIN)
      ? producer.image_url.slice(SITE_ORIGIN.length)
      : null,
  };
}

export const CLAIM_SEARCH_LIMIT = 20;

export async function searchClaimableProducers(
  query: string,
): Promise<ClaimableProducer[]> {
  const q = query.trim().slice(0, 160);
  if (q.length < 2) return [];
  try {
    const { producers } = await searchPublicProducers({
      q,
      limit: CLAIM_SEARCH_LIMIT,
      offset: 0,
    });
    return producers.map(toClaimableProducer);
  } catch (error) {
    if (error instanceof CatalogRequestError) return [];
    throw error;
  }
}

export async function suggestClaimableProducers(
  verifiedEmails: readonly string[],
): Promise<ClaimableProducer[]> {
  return (await findPublicProducersByContact(verifiedEmails)).map(
    toClaimableProducer,
  );
}
