import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import { ProducerFavoritesList } from "./producer-favorites-list";

export function ProducerFavorites({ country, producerId }: { country: string; producerId: number }) {
  const config = getAccountSystemConfiguration();
  if (!config.featureEnabled || !config.databaseConfigured) return null;
  // Names, avatars and visibility are read only when the visitor opens the list.
  return <ProducerFavoritesList key={`${country}:${producerId}`} country={country} producerId={producerId} />;
}
