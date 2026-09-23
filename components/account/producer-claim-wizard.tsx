"use client";

import { CaretLeftIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { submitProducerClaimAction } from "@/app/(application)/cuenta/actions/claims";
import { beginInstagramVerification } from "@/app/(application)/cuenta/actions/instagram";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import {
  OnboardingBackLink,
  OnboardingHeader,
  onboardingStyles as styles,
  ProducerImage,
} from "@/components/account/producer-onboarding";
import type { ClaimableProducer } from "@/lib/accounts/producer-claim-search";
import {
  parseClaimWizardStep,
  PRODUCER_CLAIM_ROLE_LABELS,
  PRODUCER_CLAIM_ROLES,
  type ClaimWizardStep,
  type ProducerClaimChannels,
  type ProducerClaimMethod,
  type ProducerClaimRole,
} from "@/lib/accounts/producer-claim-options";

type ProducerClaimWizardProps = {
  producer: ClaimableProducer & { publicHref: string };
  channels: ProducerClaimChannels;
  methods: readonly ProducerClaimMethod[];
  defaultMethod: ProducerClaimMethod;
  emailMatches: boolean;
  instagramMatches: boolean;
  searchHref: string;
  initialStep: ClaimWizardStep;
  message: AccountMessageParams;
};

function MethodChoice({
  method,
  channels,
  emailMatches,
  instagramMatches,
}: {
  method: ProducerClaimMethod;
  channels: ProducerClaimChannels;
  emailMatches: boolean;
  instagramMatches: boolean;
}) {
  if (method === "catalog_email") {
    return (
      <>
        <strong>Con el correo de la ficha</strong>
        <span>{channels.email}</span>
        {emailMatches ? (
          <span className={styles.badge}>Es el correo de tu cuenta: queda comprobado al enviar</span>
        ) : (
          <span>Te escribiremos y nos responderás con un código.</span>
        )}
      </>
    );
  }
  if (method === "catalog_phone") {
    return (
      <>
        <strong>Con una llamada</strong>
        <span>{channels.phone}</span>
        <span>Te llamaremos a este teléfono y nos dirás un código.</span>
      </>
    );
  }
  if (method === "instagram") {
    return (
      <>
        <strong>Con Instagram</strong>
        <span>@{channels.instagram}</span>
        {instagramMatches ? (
          <span className={styles.badge}>Cuenta conectada y comprobada</span>
        ) : (
          <span>Entra en esta cuenta profesional para comprobarlo al momento.</span>
        )}
      </>
    );
  }
  return (
    <>
      <strong>De otra forma</strong>
      <span>
        Con un código en tu web o con el aval de una denominación de origen, cooperativa, asociación o mercado.
      </span>
    </>
  );
}

function SubmitClaimButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="account-button" disabled={pending}>
      {pending ? "Enviando…" : "Enviar solicitud"}
    </button>
  );
}

export function ProducerClaimWizard({
  producer,
  channels,
  methods,
  defaultMethod,
  emailMatches,
  instagramMatches,
  searchHref,
  initialStep,
  message,
}: ProducerClaimWizardProps) {
  const searchParams = useSearchParams();
  const step = parseClaimWizardStep(searchParams.get("paso")) ?? initialStep;
  const [method, setMethod] = useState<ProducerClaimMethod>(defaultMethod);
  const [role, setRole] = useState<ProducerClaimRole | "">("");
  const [note, setNote] = useState("");

  // Steps live in the URL so the phone's back gesture moves between screens.
  function go(next: ClaimWizardStep) {
    const url = new URL(window.location.href);
    url.searchParams.set("paso", next);
    url.searchParams.delete("error");
    url.searchParams.delete("notice");
    window.history.pushState(null, "", url);
    window.scrollTo({ top: 0 });
  }

  const backButton = (target: ClaimWizardStep) => (
    <button type="button" className={styles.back} onClick={() => go(target)}>
      <CaretLeftIcon size={18} aria-hidden="true" /> Atrás
    </button>
  );
  const visibleMessage = step === initialStep ? message : {};

  if (step === "ficha") {
    return (
      <div className={styles.flow}>
        <AccountMessage params={visibleMessage} />
        <OnboardingHeader
          step={2}
          back={<OnboardingBackLink href={searchHref} />}
          title="¿Es esta tu ficha?"
        />
        <article className={styles.producerCard}>
          <ProducerImage
            src={producer.imageSrc}
            className={styles.producerImage}
            width={640}
            height={400}
            sizes="(min-width: 761px) 544px, 100vw"
            eager
          />
          <h3 className={styles.producerName}>{producer.name}</h3>
          <p className={styles.producerMeta}>
            {producer.municipality} · {producer.area}
          </p>
          <Link href={producer.publicHref} className={styles.textLink}>
            Ver la ficha completa
          </Link>
        </article>
        <div className={styles.actions}>
          <button type="button" className="account-button" onClick={() => go("verificacion")}>
            Sí, es mi ficha
          </button>
          <Link href={searchHref} className="account-button account-button--secondary">
            No, buscar otra
          </Link>
        </div>
      </div>
    );
  }

  if (step === "verificacion") {
    const needsInstagramConnection = method === "instagram" && !instagramMatches;
    return (
      <div className={styles.flow}>
        <AccountMessage params={visibleMessage} />
        <OnboardingHeader
          step={3}
          back={backButton("ficha")}
          title="¿Cómo comprobamos que es tuya?"
          lead="Usamos un contacto que ya aparece en tu ficha. Elige el que tengas más a mano."
        />
        <fieldset className={styles.choices}>
          <legend className="visually-hidden">Vía de verificación</legend>
          {methods.map((option) => (
            <label key={option} className={styles.choice}>
              <input
                type="radio"
                name="method-choice"
                value={option}
                checked={method === option}
                onChange={() => setMethod(option)}
              />
              <span className={styles.choiceText}>
                <MethodChoice
                  method={option}
                  channels={channels}
                  emailMatches={emailMatches}
                  instagramMatches={instagramMatches}
                />
              </span>
            </label>
          ))}
        </fieldset>
        <div className={styles.actions}>
          {needsInstagramConnection ? (
            <form action={beginInstagramVerification}>
              <input type="hidden" name="country" value={producer.country} />
              <input type="hidden" name="producerId" value={producer.producerId} />
              <button type="submit" className="account-button">
                Conectar Instagram
              </button>
            </form>
          ) : (
            <button type="button" className="account-button" onClick={() => go("relacion")}>
              Continuar
            </button>
          )}
        </div>
      </div>
    );
  }

  const noteRequired = method === "other";
  return (
    <form action={submitProducerClaimAction} className={styles.flow}>
      <AccountMessage params={visibleMessage} />
      <input type="hidden" name="country" value={producer.country} />
      <input type="hidden" name="producerId" value={producer.producerId} />
      <input type="hidden" name="method" value={method} />
      <OnboardingHeader
        step={4}
        back={backButton("verificacion")}
        title={`¿Cuál es tu relación con ${producer.name}?`}
      />
      <fieldset className={styles.choices}>
        <legend className="visually-hidden">Tu relación con el productor</legend>
        {PRODUCER_CLAIM_ROLES.map((option) => (
          <label key={option} className={styles.choice}>
            <input
              type="radio"
              name="role"
              value={option}
              required
              checked={role === option}
              onChange={() => setRole(option)}
            />
            <span className={styles.choiceText}>
              <strong>{PRODUCER_CLAIM_ROLE_LABELS[option]}</strong>
            </span>
          </label>
        ))}
      </fieldset>
      <label className={styles.field}>
        <span>
          {noteRequired
            ? "¿Dónde publicarás tu código o qué entidad te avala?"
            : "¿Quieres añadir algo? (opcional)"}
        </span>
        <textarea
          name="proof"
          rows={4}
          maxLength={4_000}
          minLength={noteRequired ? 20 : undefined}
          required={noteRequired}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={
            noteRequired
              ? "Por ejemplo: en la página de contacto de mi web, o la cooperativa a la que pertenezco."
              : "Cualquier dato que ayude al equipo a revisar la solicitud."
          }
        />
      </label>
      <p className={styles.hint}>
        Al enviar la solicitud verás qué ocurre después y, si hace falta, tu código de verificación.
      </p>
      <div className={styles.actions}>
        <SubmitClaimButton />
      </div>
    </form>
  );
}
