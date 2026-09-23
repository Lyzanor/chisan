/** Shared public entry; account setup returns here before activation. */
export const USER_PRO_PATH = "/pro";

export function producerProPath(country: string, producerId: number): string {
  return `/pro?${new URLSearchParams({ perfil: "productor", country, producerId: String(producerId) })}`;
}
