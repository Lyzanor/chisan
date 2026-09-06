import type { Locale } from "./locales";

export type SimilarProducersMessages = Readonly<{
  title: string;
  distance: string;
  openProfile: string;
}>;

const ENGLISH_MESSAGES = {
  title: "Similar producers nearby",
  distance: "{distance} km away in a straight line",
  openProfile: "Open the profile of {producer}",
} as const satisfies SimilarProducersMessages;

const SIMILAR_PRODUCERS_MESSAGES: Partial<
  Record<Locale, SimilarProducersMessages>
> = {
  en: ENGLISH_MESSAGES,
  es: {
    title: "Productores similares cerca",
    distance: "A {distance} km en línea recta",
    openProfile: "Abrir el perfil de {producer}",
  },
  ca: {
    title: "Productors similars a prop",
    distance: "A {distance} km en línia recta",
    openProfile: "Obre el perfil de {producer}",
  },
};

export function getSimilarProducersMessages(
  locale: Locale,
): SimilarProducersMessages {
  return SIMILAR_PRODUCERS_MESSAGES[locale] ?? ENGLISH_MESSAGES;
}
