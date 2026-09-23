// Editorial events are published in the Spanish catalog scope.
export const EVENTS_COUNTRY = "es";
export const EVENTS_LOCALE = "es";
export const EVENTS_SEGMENT = "eventos";
export const EVENTS_PATH = `/${EVENTS_COUNTRY}/${EVENTS_SEGMENT}`;

export function eventPath(slug: string): string {
  return `${EVENTS_PATH}/${slug}`;
}
