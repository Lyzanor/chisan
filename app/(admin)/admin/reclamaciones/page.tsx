import { and, asc, eq, inArray, isNull, or } from "drizzle-orm";

import { reviewProducerClaimAction } from "@/app/(admin)/admin/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  PRODUCER_CLAIM_CHANNEL_FIELDS,
  PRODUCER_CLAIM_METHOD_LABELS,
  PRODUCER_CLAIM_ROLE_LABELS,
  producerClaimChannels,
  type ProducerClaimChannels,
  type ProducerClaimRole,
} from "@/lib/accounts/producer-claim-policy";
import {
  authIdentities,
  producerClaims,
  producerSuggestions,
  users,
} from "@/lib/db/schema";
import { instagramProofSchema } from "@/lib/instagram/verification";

const METHOD_CHECKS: Record<string, string> = {
  catalog_email:
    "If the sign-in email matched the catalog email, that is the proof. Otherwise write to the catalog email shown here (never the claimant's contact email) and approve only when a reply from that mailbox quotes the verification code.",
  catalog_phone:
    "Call the catalog phone shown here (never a number from the claim) and approve only when the person answering reads back the verification code.",
  instagram:
    "OAuth must show control of the catalog Instagram. A mismatch is not proof; request another route.",
  other:
    "Website: the verification code must appear on a page of the catalog website or in a DNS TXT record of its domain. Attestation: confirm with the collective through its own official channel. Anything weaker needs another route.",
};

const CHANNEL_LABELS: Record<keyof ProducerClaimChannels, string> = {
  email: "Catalog email",
  phone: "Catalog phone",
  instagram: "Catalog Instagram",
  web: "Catalog website",
};

type AdminClaimsPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function AdminClaimsPage({ searchParams }: AdminClaimsPageProps) {
  await requireStaffAccount();

  const [queue, params] = await Promise.all([
    getDatabase()
      .select({
        claim: producerClaims,
        displayName: users.displayName,
        signInEmail: authIdentities.email,
      })
      .from(producerClaims)
      .innerJoin(users, eq(producerClaims.claimantUserId, users.id))
      .leftJoin(
        authIdentities,
        and(
          eq(authIdentities.userId, users.id),
          eq(authIdentities.provider, "clerk"),
          isNull(authIdentities.disabledAt),
        ),
      )
      .where(inArray(producerClaims.status, ["pending", "needs_info"]))
      .orderBy(asc(producerClaims.submittedAt)),
    searchParams,
  ]);
  const [producers, channelSuggestions] = await Promise.all([
    findProducersByIds(
      queue.map(({ claim }) => ({ country: claim.country, producerId: claim.producerId })),
    ),
    queue.length === 0
      ? Promise.resolve([])
      : getDatabase()
          .select({
            country: producerSuggestions.country,
            producerId: producerSuggestions.producerId,
            patch: producerSuggestions.patch,
            reviewedAt: producerSuggestions.reviewedAt,
          })
          .from(producerSuggestions)
          .where(
            and(
              inArray(producerSuggestions.status, ["approved", "applied"]),
              or(
                ...queue.map(({ claim }) =>
                  and(
                    eq(producerSuggestions.country, claim.country),
                    eq(producerSuggestions.producerId, claim.producerId),
                  ),
                ),
              ),
            ),
          ),
  ]);
  // A community suggestion could have replaced a published channel with the
  // claimant's own; the reviewer must confirm the channel predates it in Git.
  const channelSuggestionDates = (country: string, producerId: number) =>
    channelSuggestions
      .filter(
        (suggestion) =>
          suggestion.country === country &&
          suggestion.producerId === producerId &&
          PRODUCER_CLAIM_CHANNEL_FIELDS.some((field) => field in suggestion.patch),
      )
      .map((suggestion) => suggestion.reviewedAt?.toISOString().slice(0, 10) ?? "undated");

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Ownership claims</h2>
          <p>Verify through a channel the catalog published before the claim, never one the claimant supplies. Record the channel, the check and the date in the note.</p>
        </div>
      </header>

      {queue.length === 0 ? (
        <p className="account-empty">The ownership queue is empty.</p>
      ) : (
        <ul className="account-review-list">
          {queue.map(({ claim, displayName, signInEmail }, index) => {
            const producer = producers[index];
            const proof = claim.proof as Record<string, unknown>;
            const submittedChannels = (proof.catalogChannels ?? null) as ProducerClaimChannels | null;
            const currentChannels = producer ? producerClaimChannels(producer.fields) : null;
            const channels = submittedChannels ?? currentChannels;
            const changedChannels = submittedChannels && currentChannels
              ? (Object.keys(CHANNEL_LABELS) as (keyof ProducerClaimChannels)[])
                  .filter((key) => submittedChannels[key] !== currentChannels[key])
              : [];
            const suggestionDates = channelSuggestionDates(claim.country, claim.producerId);
            const methodCheck = claim.proofMethod ? METHOD_CHECKS[claim.proofMethod] : undefined;
            const instagram = instagramProofSchema.safeParse(proof.instagramVerification && typeof proof.instagramVerification === "object"
              ? Object.fromEntries(Object.entries(proof.instagramVerification).filter(([key]) => ["provider", "subject", "username", "checkedAt"].includes(key))) : null);
            return (
              <li key={claim.id}>
                <div className="account-record-heading">
                  <div>
                    <strong>{producer?.name ?? String(proof.producerName ?? "Missing producer")}</strong>
                    <p>
                      {claim.country.toUpperCase()} · #{claim.producerId} ·{" "}
                      {claim.proofMethod
                        ? PRODUCER_CLAIM_METHOD_LABELS[claim.proofMethod] ?? claim.proofMethod
                        : "No method"}
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
                    <dt>Relationship</dt>
                    <dd>
                      {typeof proof.claimantRole === "string"
                        ? PRODUCER_CLAIM_ROLE_LABELS[proof.claimantRole as ProducerClaimRole] ?? proof.claimantRole
                        : "Not stated"}
                    </dd>
                  </div>
                  <div>
                    <dt>Sign-in email</dt>
                    <dd>{signInEmail ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt>Contact email (not proof)</dt>
                    <dd>{String(proof.contactEmail ?? "Not supplied")}</dd>
                  </div>
                  {typeof proof.verificationCode === "string" ? (
                    <div>
                      <dt>Verification code</dt>
                      <dd>{proof.verificationCode}</dd>
                    </div>
                  ) : null}
                  {channels
                    ? (Object.keys(CHANNEL_LABELS) as (keyof ProducerClaimChannels)[]).map((key) => (
                        <div key={key}>
                          <dt>{CHANNEL_LABELS[key]}</dt>
                          <dd>{channels[key] ?? "Not published"}</dd>
                        </div>
                      ))
                    : null}
                </dl>
                {methodCheck ? <p className="account-callout">{methodCheck}</p> : null}
                {proof.signInEmailMatchesCatalog === true ? (
                  <div className="account-callout account-callout--success">
                    <strong>Sign-in email matched the catalog email</strong>
                    <p>Clerk had verified the catalog address for this account at submission.</p>
                  </div>
                ) : null}
                {changedChannels.length > 0 || suggestionDates.length > 0 ? (
                  <div className="account-callout">
                    <strong>Check the channel history before approving</strong>
                    {changedChannels.length > 0 ? (
                      <p>
                        Changed since submission:{" "}
                        {changedChannels.map((key) => CHANNEL_LABELS[key]).join(", ")}.
                      </p>
                    ) : null}
                    {suggestionDates.length > 0 ? (
                      <p>
                        Community suggestions touching contact channels were accepted on{" "}
                        {suggestionDates.join(", ")}. Confirm in Git that the channel you use predates them.
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {claim.claimantMessage ? (
                  <p className="account-review-statement">{claim.claimantMessage}</p>
                ) : null}
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
