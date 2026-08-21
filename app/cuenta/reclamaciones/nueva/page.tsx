import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { submitProducerClaimAction } from "@/app/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { buildProducerHref } from "@/lib/catalog-navigation";
import { findProducerById } from "@/lib/csv-catalog";

export const metadata: Metadata = {
  title: "Claim a producer",
  robots: { index: false, follow: false },
};

type NewClaimPageProps = {
  searchParams: Promise<
    AccountMessageParams & {
      country?: string | string[];
      producerId?: string | string[];
    }
  >;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function NewClaimPage({ searchParams }: NewClaimPageProps) {
  const [account, params] = await Promise.all([
    requireCurrentAccount("/cuenta/reclamaciones/nueva"),
    searchParams,
  ]);
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const country = first(params.country).trim().toLowerCase();
  const producerId = Number(first(params.producerId));
  const producer =
    /^[a-z]{2}$/.test(country) && Number.isSafeInteger(producerId) && producerId > 0
      ? await findProducerById(country, producerId)
      : null;

  if (!producer) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={params} />
        <h2>Choose a producer first</h2>
        <p>Claims start from an existing public producer profile.</p>
        <Link href="/" className="account-button">
          Explore producers
        </Link>
      </div>
    );
  }

  return (
    <div className="account-content account-content--narrow">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <p className="catalog-kicker">Ownership claim</p>
          <h2>{producer.name}</h2>
          <p>
            {producer.city} · {producer.area}
          </p>
        </div>
        <Link
          href={buildProducerHref(producer, {
            country: producer.country,
            area: producer.area,
          })}
          className="account-button account-button--secondary"
        >
          Public profile
        </Link>
      </header>

      <div className="account-callout">
        <strong>Ownership is never automatic.</strong>
        <p>
          A reviewer will compare the claim with public identity and contact information. Do not
          submit identity documents in this first form; staff will request them through a private
          channel only if needed.
        </p>
      </div>

      <form action={submitProducerClaimAction} className="account-form">
        <input type="hidden" name="country" value={producer.country} />
        <input type="hidden" name="producerId" value={producer.producerId} />
        <label className="account-field">
          <span>Best verification method</span>
          <select name="method" required defaultValue="business_email">
            <option value="business_email">Official business email</option>
            <option value="website">Producer website</option>
            <option value="phone">Published business phone</option>
            <option value="document">Private business document (requested later)</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="account-field">
          <span>Business contact email</span>
          <input
            type="email"
            name="contactEmail"
            maxLength={254}
            defaultValue={account.email ?? ""}
            autoComplete="email"
          />
          <small>Use an address connected to the producer when possible.</small>
        </label>
        <label className="account-field">
          <span>How can we verify your relationship?</span>
          <textarea
            name="proof"
            required
            minLength={20}
            maxLength={4_000}
            rows={7}
            placeholder="Explain your role and point to public contact details or a safe way for staff to verify it."
          />
        </label>
        <button type="submit" className="account-button">
          Submit claim for review
        </button>
      </form>
    </div>
  );
}
