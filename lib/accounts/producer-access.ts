export type ProducerAccessIdentity = {
  country: string;
  producerId: number;
};

export type ActiveProducerAccessLookup = ProducerAccessIdentity & {
  userId: string;
  status: "active";
};

export function buildActiveProducerAccessLookup(
  userId: string,
  producer: ProducerAccessIdentity,
): ActiveProducerAccessLookup {
  return {
    userId,
    country: producer.country,
    producerId: producer.producerId,
    status: "active",
  };
}
