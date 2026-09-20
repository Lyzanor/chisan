export const OPEN_PRODUCER_CLAIM_STATUSES = [
  "draft",
  "pending",
  "needs_info",
  "approved",
] as const;

export type ProducerIdentity = {
  country: string;
  producerId: number;
};

export function sameProducerIdentity(
  left: ProducerIdentity,
  right: ProducerIdentity,
): boolean {
  return left.country === right.country && left.producerId === right.producerId;
}
