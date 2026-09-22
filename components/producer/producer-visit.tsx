import {
  ArrowUpRightIcon,
  ClockIcon,
  MapPinIcon,
  NavigationArrowIcon,
} from "@phosphor-icons/react/ssr";

import { ProducersMap } from "@/components/map/producers-map";
import { ProducerContact } from "@/components/producer-contact";
import { ProducerDistance } from "@/components/producer-distance";
import type { CatalogNavigationScope } from "@/lib/catalog-navigation";
import type { ProducerMapPoint } from "@/lib/csv-catalog";
import type { Locale } from "@/lib/i18n/locales";
import { formatMessage, type Messages } from "@/lib/i18n/messages";
import type { ProducerContactMessages } from "@/lib/i18n/producer-contact";
import type { ProducerDistanceMessages } from "@/lib/i18n/producer-distance";

export type ProducerVisitProps = {
  actionLabels: {
    call: string;
    directions: string;
    whatsapp: string;
  };
  address?: string;
  area: string;
  contactMessages: ProducerContactMessages;
  directionsHref?: string;
  distanceMessages: ProducerDistanceMessages;
  email?: string;
  hasLocation: boolean;
  locale: Locale;
  mapMessages: {
    emptyCoordinates: string;
    loading: string;
    openProfile: string;
  };
  mapPoints: ProducerMapPoint[];
  messages: Messages;
  name: string;
  openingHours?: string;
  phone?: string;
  producerLatitude: number | null;
  producerLongitude: number | null;
  producerSlug: string;
  profileWords: {
    fromLocation: string;
  };
  scope: CatalogNavigationScope;
  whatsAppLink?: string | null;
};

export function ProducerVisit({
  actionLabels,
  address,
  area,
  contactMessages,
  directionsHref,
  distanceMessages,
  email,
  hasLocation,
  locale,
  mapMessages,
  mapPoints,
  messages,
  name,
  openingHours,
  phone,
  producerLatitude,
  producerLongitude,
  producerSlug,
  profileWords,
  scope,
  whatsAppLink,
}: ProducerVisitProps) {
  if (!hasLocation && !openingHours && !email && !phone) {
    return null;
  }

  const openingHoursSection = openingHours ? (
    <section
      className="detail-opening-hours"
      aria-labelledby="detail-hours-title"
    >
      <h2 id="detail-hours-title">
        <ClockIcon size={20} aria-hidden="true" />
        {messages.fieldLabels.openingHours}
      </h2>
      {openingHours
        .split(/\n|;|\||\s+·\s+|,(?=\s*\d{1,2}:\d{2})/)
        .map((line, index) =>
          line.trim() ? <p key={index}>{line.trim()}</p> : null,
        )}
    </section>
  ) : null;

  // A location without a map is short: its hours stack beneath it and the
  // contact widget keeps the side column, so neither column is left empty.
  const hoursBesideContact = mapPoints.length > 0 || !hasLocation;

  return (
    <div className="detail-visit">
      {hasLocation ? (
        <div className="detail-visit__main">
          <section
            id="detail-location"
            className="detail-map-card"
            aria-labelledby="detail-location-title"
          >
            <div className="detail-location-heading">
              <div>
                <h2 id="detail-location-title">
                  <MapPinIcon size={20} aria-hidden="true" />
                  {messages.producer.location}
                </h2>
                {address ? (
                  <p className="detail-address">{address}</p>
                ) : null}
              </div>
              {directionsHref ? (
                <a
                  className="detail-directions"
                  href={directionsHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={actionLabels.directions + " · Google Maps"}
                >
                  <NavigationArrowIcon size={20} aria-hidden="true" />
                  <span>
                    {actionLabels.directions}
                    <small>{profileWords.fromLocation}</small>
                  </span>
                  <ArrowUpRightIcon size={18} aria-hidden="true" />
                </a>
              ) : null}
            </div>
            {mapPoints.length ? (
              <div
                className="detail-producer-map"
                aria-label={formatMessage(messages.producer.mapAria, {
                  producer: name,
                })}
              >
                <ProducersMap
                  points={mapPoints}
                  scope={scope}
                  area={area}
                  selectedSlug={producerSlug}
                  markerInteraction="static"
                  singlePointZoom={16}
                  messages={mapMessages}
                />
              </div>
            ) : null}
            {producerLatitude !== null && producerLongitude !== null ? (
              <ProducerDistance
                latitude={producerLatitude}
                longitude={producerLongitude}
                locale={locale}
                messages={distanceMessages}
              />
            ) : null}
          </section>
          {hoursBesideContact ? null : openingHoursSection}
        </div>
      ) : null}
      {(hoursBesideContact && openingHours) || email || phone ? (
        <div className="detail-visit__aside">
          {hoursBesideContact ? openingHoursSection : null}
          {email || phone ? (
            <ProducerContact
              email={email ?? ""}
              phone={phone}
              callLabel={actionLabels.call}
              whatsAppLink={whatsAppLink}
              whatsAppLabel={actionLabels.whatsapp}
              name={name}
              messages={contactMessages}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
