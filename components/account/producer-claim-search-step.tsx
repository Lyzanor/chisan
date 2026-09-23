import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import {
  OnboardingBackLink,
  OnboardingHeader,
  onboardingStyles as styles,
  ProducerImage,
} from "@/components/account/producer-onboarding";
import { PRODUCER_ONBOARDING_PATH } from "@/lib/accounts/producer-claim-options";
import {
  CLAIM_SEARCH_LIMIT,
  searchClaimableProducers,
  suggestClaimableProducers,
  type ClaimableProducer,
} from "@/lib/accounts/producer-claim-search";
import { SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

const MISSING_PRODUCER_MAILTO = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Alta de mi negocio en Chisan",
)}&body=${encodeURIComponent(
  "Nombre del negocio:\nMunicipio:\nQué producís:\nWeb o redes sociales:\n",
)}`;

function claimHref(producer: Pick<ClaimableProducer, "country" | "producerId">): string {
  return `${PRODUCER_ONBOARDING_PATH}?country=${producer.country}&producerId=${producer.producerId}`;
}

function ClaimableProducerList({ producers }: { producers: ClaimableProducer[] }) {
  return (
    <ul className={styles.results}>
      {producers.map((producer) => (
        <li key={`${producer.country}:${producer.producerId}`}>
          <Link href={claimHref(producer)} className={styles.resultLink}>
            <ProducerImage
              src={producer.imageSrc}
              className={styles.thumb}
              width={112}
              height={112}
              sizes="56px"
            />
            <span className={styles.resultText}>
              <strong>{producer.name}</strong>
              <span>
                {producer.municipality} · {producer.area}
              </span>
            </span>
            <CaretRightIcon size={20} className={styles.chevron} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function ProducerSearchStep({
  query,
  verifiedEmails,
  params,
}: {
  query: string;
  verifiedEmails: string[];
  params: AccountMessageParams;
}) {
  const [suggestions, results] = await Promise.all([
    query ? Promise.resolve([]) : suggestClaimableProducers(verifiedEmails),
    searchClaimableProducers(query),
  ]);
  return (
    <div className={styles.flow}>
      <AccountMessage params={params} />
      <OnboardingHeader
        step={1}
        back={<OnboardingBackLink href="/cuenta" />}
        title="Busca tu ficha"
        lead={`${SITE_NAME} ya reúne miles de productores a partir de fuentes públicas. Busca el tuyo por el nombre del negocio, la marca o el municipio.`}
      />
      {suggestions.length > 0 ? (
        <section className={styles.section} aria-labelledby="claim-suggestions-title">
          <h3 id="claim-suggestions-title" className={styles.sectionTitle}>
            Coincide con tu correo
          </h3>
          <ClaimableProducerList producers={suggestions} />
        </section>
      ) : null}
      <form method="get" action={PRODUCER_ONBOARDING_PATH} role="search" className={styles.searchForm}>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Nombre, marca o municipio"
          aria-label="Buscar tu ficha"
          autoComplete="off"
          enterKeyHint="search"
          minLength={2}
          maxLength={160}
          required
        />
        <button type="submit" className="chisan-button chisan-button--primary">
          Buscar
        </button>
      </form>
      {query ? (
        results.length > 0 ? (
          <section className={styles.section} aria-labelledby="claim-results-title">
            <h3 id="claim-results-title" className={styles.sectionTitle}>
              {results.length === CLAIM_SEARCH_LIMIT
                ? "Primeros resultados"
                : `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`}
            </h3>
            <ClaimableProducerList producers={results} />
            {results.length === CLAIM_SEARCH_LIMIT ? (
              <p className={styles.hint}>Si no aparece, añade el municipio a la búsqueda.</p>
            ) : null}
          </section>
        ) : (
          <p className={styles.hint} role="status">
            No encontramos «{query}». Prueba con otra parte del nombre o con tu municipio.
          </p>
        )
      ) : null}
      <p className={styles.hint}>
        ¿Tu negocio aún no está en {SITE_NAME}?{" "}
        <a href={MISSING_PRODUCER_MAILTO}>Escríbenos</a> y revisaremos su alta. Después podrás verificarlo aquí.
      </p>
    </div>
  );
}

