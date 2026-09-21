import { asc, eq, inArray } from "drizzle-orm";

import { reviewProducerClaimAction } from "@/app/(admin)/admin/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerClaims, users } from "@/lib/db/schema";
import { instagramProofSchema } from "@/lib/instagram/verification";

type AdminClaimsPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function AdminClaimsPage({ searchParams }: AdminClaimsPageProps) {
  await requireStaffAccount();

  const [queue, params] = await Promise.all([
    getDatabase()
      .select({ claim: producerClaims, displayName: users.displayName })
      .from(producerClaims)
      .innerJoin(users, eq(producerClaims.claimantUserId, users.id))
      .where(inArray(producerClaims.status, ["pending", "needs_info"]))
      .orderBy(asc(producerClaims.submittedAt)),
    searchParams,
  ]);
  const producers = await findProducersByIds(
    queue.map(({ claim }) => ({ country: claim.country, producerId: claim.producerId })),
  );

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Ownership claims</h2>
          <p>Never approve from a matching public email alone; verify control and identity.</p>
        </div>
      </header>

      {queue.length === 0 ? (
        <p className="account-empty">The ownership queue is empty.</p>
      ) : (
        <ul className="account-review-list">
          {queue.map(({ claim, displayName }, index) => {
            const producer = producers[index];
            const proof = claim.proof as Record<string, unknown>;
            const instagram = instagramProofSchema.safeParse(proof.instagramVerification && typeof proof.instagramVerification === "object"
              ? Object.fromEntries(Object.entries(proof.instagramVerification).filter(([key]) => ["provider", "subject", "username", "checkedAt"].includes(key))) : null);
            return (
              <li key={claim.id}>
                <div className="account-record-heading">
                  <div>
                    <strong>{producer?.name ?? String(proof.producerName ?? "Missing producer")}</strong>
                    <p>
                      {claim.country.toUpperCase()} · #{claim.producerId} · {claim.proofMethod}
                    </p>
                  </div>
                  <span className={`account-status account-status--${claim.status}`}>
                    {claim.status === "needs_info" ? "Needs information" : "Pending"}
                  </span>
                </div>
                <dl className="account-review-meta">
                  <div>
                    <dt>Claimant</dt>
                    <dd>{displayName || claim.claimantUserId}</dd>
                  </div>
                  <div>
                    <dt>Business contact</dt>
                    <dd>{String(proof.contactEmail ?? "Not supplied")}</dd>
                  </div>
                </dl>
                <p className="account-review-statement">{claim.claimantMessage}</p>
                {instagram.success ? <div className="account-callout">
                  <strong>Instagram control confirmed by OAuth</strong>
                  <p><a href={`https://www.instagram.com/${instagram.data.username}/`} target="_blank" rel="noreferrer">@{instagram.data.username}</a> · {instagram.data.checkedAt}</p>
                  <p>{(proof.instagramVerification as Record<string, unknown>).matchesCatalog === true ? "Matched the catalog Instagram at submission." : "Did not match a catalog Instagram at submission; review the discrepancy."} This proves control of the social profile only. It does not establish producer ownership, production or entitlement.</p>
                </div> : null}
                {claim.proofMethod === "instagram" && !instagram.success ? <p className="account-callout">
                  No Instagram control proof remains on this request. Ask for another verification method before approving ownership.
                </p> : null}
                <form action={reviewProducerClaimAction} className="account-form">
                  <input type="hidden" name="claimId" value={claim.id} />
                  <label className="account-field">
                    <span>Review note</span>
                    <textarea
                      name="note"
                      maxLength={4_000}
                      rows={4}
                      defaultValue={claim.decisionReason ?? ""}
                    />
                  </label>
                  <div className="account-inline-actions">
                    <button className="account-button" name="decision" value="approved">
                      Approve
                    </button>
                    <button
                      className="account-button account-button--secondary"
                      name="decision"
                      value="needs_info"
                    >
                      Request information
                    </button>
                    <button
                      className="account-button account-button--danger"
                      name="decision"
                      value="rejected"
                    >
                      Reject
                    </button>
                  </div>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
