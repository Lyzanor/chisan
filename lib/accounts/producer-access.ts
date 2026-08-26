export type ProducerAccessIdentity = {
  country: string;
  producerId: number;
};

export type ActiveProducerAccessLookup = ProducerAccessIdentity & {
  userId: string;
  status: "active";
};

export type ActiveProducerOwnerAccessLookup = ActiveProducerAccessLookup & {
  role: "owner";
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

export function buildActiveProducerOwnerAccessLookup(
  userId: string,
  producer: ProducerAccessIdentity,
): ActiveProducerOwnerAccessLookup {
  return {
    ...buildActiveProducerAccessLookup(userId, producer),
    role: "owner",
  };
}
