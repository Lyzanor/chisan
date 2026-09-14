import Image from "next/image";
import type { ProducerContent } from "@/lib/catalog/content-schema";
import styles from "./producer-people.module.css";

export function ProducerPeople({
  people = [],
  introduction,
  introductionLocale,
  title,
}: {
  people?: ProducerContent["people"];
  introduction?: string;
  introductionLocale?: string;
  title: string;
}) {
  if (!people.length && !introduction) return null;
  return (
    <section className={styles.section} aria-labelledby="producer-people-title">
      <h3 id="producer-people-title">{title}</h3>
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
                  {person.photo.caption || person.photo.credit ? (
                    <figcaption lang={person.photo.locale}>
                      {person.photo.caption}{person.photo.caption && person.photo.credit ? " · " : ""}{person.photo.credit}
                    </figcaption>
                  ) : null}
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
