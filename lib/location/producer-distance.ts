import { getLocaleDisplayTag, type Locale } from "../i18n/locales";
import { LOCATION_REQUEST_OPTIONS } from "./location-onboarding";
import { producerDistanceKm } from "./nearby-producer-focus";

type Position = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type ProducerDistanceFailureReason =
  | "permission-denied"
  | "timeout"
  | "unavailable";

export type ProducerDistanceResult =
  | { status: "resolved"; distanceKm: number }
  | { status: "failed"; reason: ProducerDistanceFailureReason };

function isValidPosition(position: Position): boolean {
  return (
    Number.isFinite(position.latitude) &&
    position.latitude >= -90 &&
    position.latitude <= 90 &&
    Number.isFinite(position.longitude) &&
    position.longitude >= -180 &&
    position.longitude <= 180
  );
}

export function requestProducerDistance(
  geolocation: Pick<Geolocation, "getCurrentPosition"> | null,
  producerPosition: Position,
): Promise<ProducerDistanceResult> {
  if (!geolocation || !isValidPosition(producerPosition)) {
    return Promise.resolve({ status: "failed", reason: "unavailable" });
  }

  return new Promise((resolve) => {
    try {
      geolocation.getCurrentPosition(
        ({ coords }) => {
          const visitorPosition = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };

          if (!isValidPosition(visitorPosition)) {
            resolve({ status: "failed", reason: "unavailable" });
            return;
          }

          resolve({
            status: "resolved",
            distanceKm: producerDistanceKm(visitorPosition, producerPosition),
          });
        },
        ({ code }) => {
          resolve({
            status: "failed",
            reason:
              code === 1
                ? "permission-denied"
                : code === 3
                  ? "timeout"
                  : "unavailable",
          });
        },
        LOCATION_REQUEST_OPTIONS,
      );
    } catch {
      resolve({ status: "failed", reason: "unavailable" });
    }
  });
}

export function formatProducerDistanceKm(distanceKm: number, locale: Locale): string {
  const maximumFractionDigits = distanceKm < 1 ? 2 : distanceKm < 10 ? 1 : 0;

  return new Intl.NumberFormat(getLocaleDisplayTag(locale), {
    maximumFractionDigits,
  }).format(distanceKm);
}
