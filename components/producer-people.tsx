import Image from "next/image";
import type { ProducerContent } from "@/lib/catalog/content-schema";
import { ProducerPhotoDetails } from "@/components/producer-photo-details";
import styles from "./producer-people.module.css";

export function ProducerPeople({
  people = [],
  introduction,
  introductionLocale,
  title,
  captionLabel = "Photo caption and credit",
}: {
  people?: ProducerContent["people"];
  introduction?: string;
  introductionLocale?: string;
  title: string;
  captionLabel?: string;
}) {
  if (!people.length && !introduction) return null;
  return (
    <section className={styles.section} aria-labelledby="producer-people-title">
      <h2 id="producer-people-title">{title}</h2>
      {introduction ? <p lang={introductionLocale || undefined}>{introduction}</p> : null}
      {people.length ? (
        <ul className={styles.people}>
          {people.map((person) => (
            <li key={person.id} id={`person-${person.id}`}>
              {person.photo ? (
                <figure>
                  <Image
                    src={person.photo.src}
                    alt={person.photo.alt}
                    lang={person.photo.locale}
                    width={person.photo.width}
                    height={person.photo.height}
                    sizes="(max-width: 600px) 85vw, 320px"
                    loading="lazy"
                  />
                  <ProducerPhotoDetails photo={person.photo} label={captionLabel} />
                </figure>
              ) : null}
              <h4>{person.name}</h4>
              <p className={styles.role} lang={person.locale}>{person.role}</p>
              {person.description ? <p lang={person.locale}>{person.description}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
