import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import { listProducerFavoriteSupporters } from "@/lib/accounts/producer-favorites";
import { getDatabase } from "@/lib/db";
import { ProducerFavoritesList } from "./producer-favorites-list";

export async function ProducerFavorites({
  country,
  producerId,
}: {
  country: string;
  producerId: number;
}) {
  const config = getAccountSystemConfiguration();
  if (!config.featureEnabled || !config.databaseConfigured) return null;
  let initial;
  try {
    initial = await listProducerFavoriteSupporters(getDatabase(), {
      country,
      producerId,
    });
  } catch {
    // Optional account features must not take down the CSV producer page.
    return null;
  }
  return (
    <ProducerFavoritesList
      key={`${country}:${producerId}:${JSON.stringify(initial)}`}
      initial={initial}
      country={country}
      producerId={producerId}
    />
  );
}
