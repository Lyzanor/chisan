import "server-only";

import { and, eq } from "drizzle-orm";
import { cache } from "react";

import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import { getDatabase } from "@/lib/db";
import { producerMemberships } from "@/lib/db/schema";

async function readActiveProducerOwner(
  country: string,
  producerId: number,
): Promise<boolean> {
  const [owner] = await getDatabase()
    .select({ id: producerMemberships.id })
    .from(producerMemberships)
    .where(
      and(
        eq(producerMemberships.country, country),
        eq(producerMemberships.producerId, producerId),
        eq(producerMemberships.role, "owner"),
        eq(producerMemberships.status, "active"),
      ),
    )
    .limit(1);
  return Boolean(owner);
}

export const isProducerOwnershipVerified = cache(
  async (country: string, producerId: number): Promise<boolean> => {
    if (!getAccountSystemConfiguration().databaseConfigured) return false;

    try {
      return await readActiveProducerOwner(country, producerId);
    } catch (error) {
      // Ownership is optional account state around the public CSV catalog. A
      // database incident must hide the badge rather than break the profile.
      console.error("Producer ownership verification is temporarily unavailable.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
        country,
        producerId,
      });
      return false;
    }
  },
);
