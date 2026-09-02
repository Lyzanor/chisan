import type { Locale } from "./locales";

export type ProducerDistanceMessages = Readonly<{
  title: string;
  description: string;
  action: string;
  calculating: string;
  result: string;
  permissionDenied: string;
  timeout: string;
  unavailable: string;
}>;

const ENGLISH_MESSAGES = {
  title: "Distance from me",
  description:
    "Calculate the approximate distance from your current location. Your position stays in this browser and is not saved.",
  action: "Calculate distance",
  calculating: "Calculating…",
  result: "Approximately {distance} km away in a straight line.",
  permissionDenied: "Location permission was denied.",
  timeout: "Your location took too long to respond. Try again.",
  unavailable: "Your location is not available in this browser.",
} as const satisfies ProducerDistanceMessages;

const PRODUCER_DISTANCE_MESSAGES: Partial<
  Record<Locale, ProducerDistanceMessages>
> = {
  en: ENGLISH_MESSAGES,
  es: {
    title: "Distancia desde mi ubicación",
    description:
      "Calcula la distancia aproximada desde donde estás. Tu posición permanece en este navegador y no se guarda.",
    action: "Calcular distancia",
    calculating: "Calculando…",
    result: "Aproximadamente a {distance} km en línea recta.",
    permissionDenied: "Has denegado el permiso de ubicación.",
    timeout: "Tu ubicación ha tardado demasiado. Inténtalo de nuevo.",
    unavailable: "Tu ubicación no está disponible en este navegador.",
  },
  ca: {
    title: "Distància des de la meva ubicació",
    description:
      "Calcula la distància aproximada des d'on ets. La teva posició es queda en aquest navegador i no es desa.",
    action: "Calcula la distància",
    calculating: "Calculant…",
    result: "Aproximadament a {distance} km en línia recta.",
    permissionDenied: "Has denegat el permís d'ubicació.",
    timeout: "La teva ubicació ha trigat massa. Torna-ho a provar.",
    unavailable: "La teva ubicació no està disponible en aquest navegador.",
  },
  de: {
    title: "Entfernung von meinem Standort",
    description:
      "Berechne die ungefähre Entfernung von deinem aktuellen Standort. Deine Position bleibt in diesem Browser und wird nicht gespeichert.",
    action: "Entfernung berechnen",
    calculating: "Wird berechnet…",
    result: "Ungefähr {distance} km Luftlinie entfernt.",
    permissionDenied: "Die Standortfreigabe wurde abgelehnt.",
    timeout: "Die Standortabfrage hat zu lange gedauert. Versuche es erneut.",
    unavailable: "Dein Standort ist in diesem Browser nicht verfügbar.",
  },
  ja: {
    title: "現在地からの距離",
    description:
      "現在地からのおおよその距離を計算します。位置情報はこのブラウザ内だけで使用され、保存されません。",
    action: "距離を計算",
    calculating: "計算中…",
    result: "直線距離で約 {distance} km です。",
    permissionDenied: "位置情報の使用が許可されませんでした。",
    timeout: "位置情報の取得に時間がかかりすぎました。もう一度お試しください。",
    unavailable: "このブラウザでは現在地を取得できません。",
  },
  fr: {
    title: "Distance depuis ma position",
    description:
      "Calculez la distance approximative depuis votre position actuelle. Votre position reste dans ce navigateur et n'est pas enregistrée.",
    action: "Calculer la distance",
    calculating: "Calcul en cours…",
    result: "À environ {distance} km à vol d'oiseau.",
    permissionDenied: "L'autorisation de localisation a été refusée.",
    timeout: "La localisation a pris trop de temps. Réessayez.",
    unavailable: "Votre position n'est pas disponible dans ce navigateur.",
  },
  it: {
    title: "Distanza dalla mia posizione",
    description:
      "Calcola la distanza approssimativa dalla tua posizione attuale. La posizione resta in questo browser e non viene salvata.",
    action: "Calcola distanza",
    calculating: "Calcolo in corso…",
    result: "Circa {distance} km in linea d'aria.",
    permissionDenied: "Il permesso di localizzazione è stato negato.",
    timeout: "La localizzazione ha impiegato troppo tempo. Riprova.",
    unavailable: "La tua posizione non è disponibile in questo browser.",
  },
  nl: {
    title: "Afstand vanaf mijn locatie",
    description:
      "Bereken de geschatte afstand vanaf je huidige locatie. Je positie blijft in deze browser en wordt niet opgeslagen.",
    action: "Afstand berekenen",
    calculating: "Berekenen…",
    result: "Ongeveer {distance} km in een rechte lijn.",
    permissionDenied: "Locatietoegang is geweigerd.",
    timeout: "Het bepalen van je locatie duurde te lang. Probeer het opnieuw.",
    unavailable: "Je locatie is niet beschikbaar in deze browser.",
  },
  pt: {
    title: "Distância desde a minha localização",
    description:
      "Calcula a distância aproximada desde a tua localização atual. A tua posição fica neste navegador e não é guardada.",
    action: "Calcular distância",
    calculating: "A calcular…",
    result: "A aproximadamente {distance} km em linha reta.",
    permissionDenied: "A permissão de localização foi recusada.",
    timeout: "A localização demorou demasiado. Tenta novamente.",
    unavailable: "A tua localização não está disponível neste navegador.",
  },
};

export function getProducerDistanceMessages(
  locale: Locale,
): ProducerDistanceMessages {
  return PRODUCER_DISTANCE_MESSAGES[locale] ?? ENGLISH_MESSAGES;
}
