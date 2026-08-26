import assert from "node:assert/strict";
import test from "node:test";

import {
  canAdminRevokeProfileUpgradeGift,
  profileUpgradeOfferMatchesRequest,
  profileUpgradeRequestUsesStoredOffer,
  resolveProfileUpgradeAdminGiftGrant,
} from "../lib/accounts/producer-profile-upgrade-domain";
import {
  PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
  PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
  PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
  PRODUCER_PROFILE_UPGRADE_CURRENCY,
  PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
} from "../lib/accounts/producer-profile-upgrade-policy";
import {
  profileUpgradeStripePriceProblem,
  stripeObjectModeMatchesSecret,
  type ProfileUpgradeStripePrice,
} from "../lib/payments/stripe-price-policy";
import {
  STRIPE_PAYMENT_PROVIDER,
  isPaymentProviderKey,
  paymentRequestUsesProvider,
} from "../lib/payments/payment-provider";
import {
  STRIPE_PROFILE_UPGRADE_METADATA_KIND,
  STRIPE_PROFILE_UPGRADE_WEBHOOK_EVENTS,
  isStripeProfileUpgradeWebhookEvent,
} from "../lib/payments/stripe-profile-upgrade-policy";
import { formatMinorCurrencyAmount } from "../lib/payments/currency";
import {
  getStripeProfileUpgradeConfiguration,
  isStripeSecretCompatibleWithDeployment,
} from "../lib/payments/stripe-profile-upgrade-config";
import {
  PRODUCER_PROFILE_UPGRADE_UNMATCHED_COMMERCIAL_ACTION,
  canRetryPaidUnfulfilledProfileUpgrade,
  disputeRestoresProfileUpgrade,
  profileUpgradeDisputeState,
  profileUpgradeRefundStatus,
  requiresProfileUpgradeCommercialTransition,
  resolveProfileUpgradeCommercialBinding,
  resolveProfileUpgradeCommercialState,
  safeProfileUpgradeCommercialAuditIdentifier,
  summarizeProfileUpgradeRefunds,
  validatePaidProfileUpgradeCharge,
  validatePaidProfileUpgradeCheckout as validatePaidProfileUpgradeCheckoutCore,
  type ProfileUpgradeCheckoutFacts,
} from "../lib/payments/stripe-profile-upgrade-domain";

const REQUEST_ID = "00000000-0000-4000-8000-000000000049";
const PRICE_ID = "price_profile49";
const CLERK_TEST_SECRET = [
  "sk",
  "test",
  "abcdefghijklmnopqrstuvwxyz012345",
].join("_");
const STRIPE_TEST_SECRET = ["sk", "test", "fixture", "stripe"].join("_");
const STRIPE_LIVE_SECRET = ["sk", "live", "fixture", "stripe"].join("_");
const STRIPE_WEBHOOK_SECRET = ["whsec", "fixture", "stripe"].join("_");

function validatePaidProfileUpgradeCheckout(
  facts: ProfileUpgradeCheckoutFacts,
  request: { id: string; providerOfferId: string },
) {
  return validatePaidProfileUpgradeCheckoutCore(
    facts,
    request,
    STRIPE_PROFILE_UPGRADE_METADATA_KIND,
  );
}

function checkoutFacts(
  overrides: Partial<ProfileUpgradeCheckoutFacts> = {},
): ProfileUpgradeCheckoutFacts {
  return {
    id: "cs_test_profile49",
    mode: "payment",
    paymentStatus: "paid",
    currency: PRODUCER_PROFILE_UPGRADE_CURRENCY,
    amountTotal: PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
    clientReferenceId: REQUEST_ID,
    metadataKind: STRIPE_PROFILE_UPGRADE_METADATA_KIND,
    metadataRequestId: REQUEST_ID,
    paymentId: "pi_profile49",
    offerId: PRICE_ID,
    quantity: 1,
    lineItemCount: 1,
    ...overrides,
  };
}

function stripePrice(
  overrides: Partial<ProfileUpgradeStripePrice> = {},
): ProfileUpgradeStripePrice {
  return {
    active: true,
    currency: PRODUCER_PROFILE_UPGRADE_CURRENCY,
    id: PRICE_ID,
    livemode: false,
    recurring: null,
    type: "one_time",
    unit_amount: PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
    ...overrides,
  };
}

test("payment-provider keys and request ownership stay provider-neutral", () => {
  for (const provider of ["stripe", "adyen", "provider_2", "provider-x"]) {
    assert.equal(isPaymentProviderKey(provider), true, provider);
  }
  for (const provider of ["", "Stripe", "2checkout", "provider.dot", "a".repeat(33)]) {
    assert.equal(isPaymentProviderKey(provider), false, provider);
  }

  const stripeRequest = { paymentProvider: STRIPE_PAYMENT_PROVIDER };
  assert.equal(
    paymentRequestUsesProvider(stripeRequest, STRIPE_PAYMENT_PROVIDER),
    true,
  );
  assert.equal(paymentRequestUsesProvider(stripeRequest, "adyen"), false);
});

test("administrative gifts remain separate from Stripe payment authority", () => {
  assert.notEqual(
    PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
    PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
  );
  assert.equal(
    resolveProfileUpgradeAdminGiftGrant({
      activeEntitlement: false,
      activeOwner: true,
      catalogProducer: true,
      openCommercialRequest: false,
    }),
    "grant",
  );
  assert.equal(
    resolveProfileUpgradeAdminGiftGrant({
      activeEntitlement: false,
      activeOwner: false,
      catalogProducer: true,
      openCommercialRequest: false,
    }),
    "active_owner_required",
  );
  assert.equal(
    resolveProfileUpgradeAdminGiftGrant({
      activeEntitlement: true,
      activeOwner: true,
      catalogProducer: true,
      openCommercialRequest: false,
    }),
    "active_entitlement",
  );
  assert.equal(
    resolveProfileUpgradeAdminGiftGrant({
      activeEntitlement: false,
      activeOwner: true,
      catalogProducer: true,
      openCommercialRequest: true,
    }),
    "commercial_request_open",
  );
  assert.equal(
    resolveProfileUpgradeAdminGiftGrant({
      activeEntitlement: false,
      activeOwner: true,
      catalogProducer: false,
      openCommercialRequest: false,
    }),
    "catalog_missing",
  );

  const gift = {
    key: PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
    source: PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
    status: "active",
    subjectKind: "producer",
  };
  assert.equal(canAdminRevokeProfileUpgradeGift(gift), true);
  assert.equal(
    canAdminRevokeProfileUpgradeGift({
      ...gift,
      source: PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
    }),
    false,
    "an admin gift action must never revoke a paid entitlement",
  );
  assert.equal(
    canAdminRevokeProfileUpgradeGift({ ...gift, status: "revoked" }),
    false,
  );
  assert.equal(
    canAdminRevokeProfileUpgradeGift({ ...gift, subjectKind: "user" }),
    false,
  );
});

test("profile-upgrade configuration fails closed and separates Stripe modes", () => {
  const base = {
    CHISAN_ACCOUNTS_ENABLED: "true",
    CHISAN_PROFILE_UPGRADE_CHECKOUT_ENABLED: "true",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_Y2xlcmsuZXhhbXBsZS50ZXN0JA==",
    CLERK_SECRET_KEY: CLERK_TEST_SECRET,
    DATABASE_URL: "postgresql://isolated.example.test/chisan",
    STRIPE_WEBHOOK_SECRET,
    STRIPE_PROFILE_UPGRADE_PRICE_ID: PRICE_ID,
    CHISAN_PROFILE_UPGRADE_TERMS_URL: "/condiciones/perfil-ampliado-v1",
    CHISAN_BILLING_SUPPORT_EMAIL: "billing@example.test",
  };

  const preview = getStripeProfileUpgradeConfiguration({
    ...base,
    VERCEL_ENV: "preview",
    STRIPE_SECRET_KEY: STRIPE_TEST_SECRET,
  });
  assert.equal(preview.checkoutReady, true);
  assert.equal(preview.webhookReady, true);

  const testKeyInProduction = getStripeProfileUpgradeConfiguration({
    ...base,
    VERCEL_ENV: "production",
    STRIPE_SECRET_KEY: STRIPE_TEST_SECRET,
  });
  assert.equal(testKeyInProduction.checkoutReady, false);
  assert.equal(testKeyInProduction.webhookReady, false);
  assert.ok(testKeyInProduction.invalidKeys.includes("STRIPE_SECRET_KEY"));

  const liveKeyInPreview = getStripeProfileUpgradeConfiguration({
    ...base,
    VERCEL_ENV: "preview",
    STRIPE_SECRET_KEY: STRIPE_LIVE_SECRET,
  });
  assert.equal(liveKeyInPreview.checkoutReady, false);
  assert.equal(liveKeyInPreview.webhookReady, false);

  const liveProduction = getStripeProfileUpgradeConfiguration({
    ...base,
    VERCEL_ENV: "production",
    STRIPE_SECRET_KEY: STRIPE_LIVE_SECRET,
  });
  assert.equal(liveProduction.checkoutReady, true);
  assert.equal(liveProduction.webhookReady, true);

  const missingOffer = getStripeProfileUpgradeConfiguration({
    ...base,
    VERCEL_ENV: "preview",
    STRIPE_SECRET_KEY: STRIPE_TEST_SECRET,
    CHISAN_PROFILE_UPGRADE_TERMS_URL: "",
  });
  assert.equal(missingOffer.checkoutReady, false);
  assert.equal(missingOffer.webhookReady, true);
  assert.deepEqual(missingOffer.missingOfferKeys, [
    "CHISAN_PROFILE_UPGRADE_TERMS_URL",
  ]);

  const oversizedTermsUrl = getStripeProfileUpgradeConfiguration({
    ...base,
    VERCEL_ENV: "preview",
    STRIPE_SECRET_KEY: STRIPE_TEST_SECRET,
    CHISAN_PROFILE_UPGRADE_TERMS_URL: `/${"a".repeat(2_048)}`,
  });
  assert.equal(oversizedTermsUrl.offerConfigured, false);
  assert.deepEqual(oversizedTermsUrl.invalidOfferKeys, [
    "CHISAN_PROFILE_UPGRADE_TERMS_URL",
  ]);

  const credentialedTermsUrl = getStripeProfileUpgradeConfiguration({
    ...base,
    VERCEL_ENV: "preview",
    STRIPE_SECRET_KEY: STRIPE_TEST_SECRET,
    CHISAN_PROFILE_UPGRADE_TERMS_URL:
      "https://billing-user:billing-password@example.test/terms",
  });
  assert.equal(credentialedTermsUrl.offerConfigured, false);
  assert.deepEqual(credentialedTermsUrl.invalidOfferKeys, [
    "CHISAN_PROFILE_UPGRADE_TERMS_URL",
  ]);

  assert.equal(isStripeSecretCompatibleWithDeployment("sk_live_x", "production"), true);
  assert.equal(isStripeSecretCompatibleWithDeployment("sk_test_x", "production"), false);
  assert.equal(isStripeSecretCompatibleWithDeployment("sk_test_x", "preview"), true);
  assert.equal(isStripeSecretCompatibleWithDeployment("sk_live_x", "preview"), false);
  assert.equal(isStripeSecretCompatibleWithDeployment("sk_test_x", undefined), true);
  assert.equal(isStripeSecretCompatibleWithDeployment("sk_live_x", undefined), false);
});

test("the configured Stripe Price is one-time EUR 49 in the same mode", () => {
  assert.equal(formatMinorCurrencyAmount(4_900, "eur", "en-US"), "€49.00");
  assert.equal(formatMinorCurrencyAmount(4_900, "jpy", "en-US"), "¥4,900");
  assert.match(formatMinorCurrencyAmount(4_900, "bhd", "en-US"), /4\.900/);
  assert.equal(
    profileUpgradeStripePriceProblem(stripePrice(), STRIPE_TEST_SECRET),
    null,
  );
  assert.equal(
    profileUpgradeStripePriceProblem(
      stripePrice({ unit_amount: 4_899 }),
      STRIPE_TEST_SECRET,
    ),
    "amount",
  );
  assert.equal(
    profileUpgradeStripePriceProblem(
      stripePrice({ currency: "usd" }),
      STRIPE_TEST_SECRET,
    ),
    "currency",
  );
  assert.equal(
    profileUpgradeStripePriceProblem(
      stripePrice({ recurring: {}, type: "recurring" }),
      STRIPE_TEST_SECRET,
    ),
    "recurring",
  );
  assert.equal(
    profileUpgradeStripePriceProblem(stripePrice(), STRIPE_LIVE_SECRET),
    "environment",
  );
  assert.equal(stripeObjectModeMatchesSecret(false, "sk_test_x"), true);
  assert.equal(stripeObjectModeMatchesSecret(true, "sk_live_x"), true);
  assert.equal(stripeObjectModeMatchesSecret(true, "sk_test_x"), false);
});

test("paid Checkout validation binds request, mode, total and exact Price", () => {
  const request = { id: REQUEST_ID, providerOfferId: PRICE_ID };
  assert.deepEqual(validatePaidProfileUpgradeCheckout(checkoutFacts(), request), {
    ok: true,
    paymentId: "pi_profile49",
  });
  assert.equal(
    validatePaidProfileUpgradeCheckout(
      checkoutFacts({ metadataRequestId: "another-request" }),
      request,
    ).ok,
    false,
  );
  assert.deepEqual(
    validatePaidProfileUpgradeCheckout(checkoutFacts({ amountTotal: 4_899 }), request),
    { ok: false, code: "amount_mismatch" },
  );
  assert.deepEqual(
    validatePaidProfileUpgradeCheckout(checkoutFacts({ lineItemCount: 2 }), request),
    { ok: false, code: "line_item_mismatch" },
  );
  assert.deepEqual(
    validatePaidProfileUpgradeCheckout(checkoutFacts({ offerId: "price_other" }), request),
    { ok: false, code: "offer_mismatch" },
  );
  assert.deepEqual(
    validatePaidProfileUpgradeCheckout(checkoutFacts({ paymentStatus: "unpaid" }), request),
    { ok: false, code: "unpaid" },
  );
});

test("an unattached request is reusable only for the exact immutable offer", () => {
  const requestOffer = {
    providerOfferId: PRICE_ID,
    termsUrl: "/condiciones/perfil-ampliado-v1",
    termsVersion: "producer-profile-upgrade-v1",
  };
  assert.equal(profileUpgradeOfferMatchesRequest(requestOffer, requestOffer), true);
  assert.equal(
    profileUpgradeOfferMatchesRequest(requestOffer, {
      ...requestOffer,
      providerOfferId: "price_profile49_v2",
    }),
    false,
  );
  assert.equal(
    profileUpgradeOfferMatchesRequest(requestOffer, {
      ...requestOffer,
      termsUrl: "/condiciones/perfil-ampliado-v2",
    }),
    false,
  );
  assert.equal(
    profileUpgradeOfferMatchesRequest(requestOffer, {
      ...requestOffer,
      termsVersion: "producer-profile-upgrade-v2",
    }),
    false,
  );
  assert.equal(
    profileUpgradeRequestUsesStoredOffer({
      status: "pending",
      providerCheckoutId: null,
    }),
    false,
    "a new Checkout must present the current offer",
  );
  assert.equal(
    profileUpgradeRequestUsesStoredOffer({
      status: "pending",
      providerCheckoutId: "cs_test_bound",
    }),
    true,
    "a bound Checkout must retain the exact accepted offer",
  );
  assert.equal(
    profileUpgradeRequestUsesStoredOffer({
      status: "paid_unfulfilled",
      providerCheckoutId: "cs_test_bound",
    }),
    true,
  );
  assert.equal(
    profileUpgradeRequestUsesStoredOffer({
      status: "refunded",
      providerCheckoutId: "cs_test_bound",
    }),
    false,
    "a repurchase after a terminal refund must present the current offer",
  );
});

test("the Checkout charge is independently bound and paid", () => {
  const valid = {
    amount: PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
    amountCaptured: PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
    currency: PRODUCER_PROFILE_UPGRADE_CURRENCY,
    id: "ch_profile49",
    paid: true,
    paymentId: "pi_profile49",
    status: "succeeded",
  };
  assert.deepEqual(validatePaidProfileUpgradeCharge(valid, "pi_profile49"), {
    ok: true,
    chargeId: "ch_profile49",
  });
  assert.deepEqual(validatePaidProfileUpgradeCharge(null, "pi_profile49"), {
    ok: false,
    code: "missing_charge",
  });
  assert.deepEqual(
    validatePaidProfileUpgradeCharge(
      { ...valid, paymentId: "pi_other" },
      "pi_profile49",
    ),
    { ok: false, code: "charge_binding_mismatch" },
  );
  assert.deepEqual(
    validatePaidProfileUpgradeCharge({ ...valid, paid: false }, "pi_profile49"),
    { ok: false, code: "charge_unpaid" },
  );
  assert.deepEqual(
    validatePaidProfileUpgradeCharge(
      { ...valid, amountCaptured: 4_899 },
      "pi_profile49",
    ),
    { ok: false, code: "charge_captured_amount_mismatch" },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      capturedAmountMinor: 4_899,
      chargeAmountRefundedMinor: 4_899,
      disputeState: "clear",
      refundSummary: summarizeProfileUpgradeRefunds([
        { amount: 4_899, id: "re_capture_mismatch", status: "succeeded" },
      ]),
    }),
    { kind: "refunded", amountRefundedMinor: 4_899 },
    "a short capture cannot grant but its exact full refund is terminal",
  );
});

test("commercial events distinguish foreign objects from broken Chisan bindings", () => {
  assert.equal(
    PRODUCER_PROFILE_UPGRADE_UNMATCHED_COMMERCIAL_ACTION,
    "producer_profile_upgrade.unmatched_commercial_event",
  );
  assert.equal(
    safeProfileUpgradeCommercialAuditIdentifier(" evt_safe-1 ", 160),
    "evt_safe-1",
  );
  assert.equal(
    safeProfileUpgradeCommercialAuditIdentifier("evt_unsafe/line\nbreak", 160),
    null,
  );
  assert.equal(
    safeProfileUpgradeCommercialAuditIdentifier(`evt_${"x".repeat(160)}`, 160),
    null,
  );
  const base = {
    paymentId: "pi_profile49",
    expectedMetadataKind: STRIPE_PROFILE_UPGRADE_METADATA_KIND,
    metadataKind: STRIPE_PROFILE_UPGRADE_METADATA_KIND,
    metadataRequestId: REQUEST_ID,
    databaseBoundRequestId: null,
  };
  assert.deepEqual(
    resolveProfileUpgradeCommercialBinding({
      ...base,
      metadataKind: "another_product",
    }),
    { kind: "foreign" },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialBinding({
      ...base,
      metadataRequestId: null,
    }),
    {
      kind: "unmatched",
      reason: "metadata_request_id_missing",
      metadataRequestId: null,
      databasePaymentId: null,
    },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialBinding({
      ...base,
      metadataRequestId: "not-a-request-uuid",
    }),
    {
      kind: "unmatched",
      reason: "metadata_request_id_invalid",
      metadataRequestId: null,
      databasePaymentId: null,
    },
    "unsafe metadata is classified without being copied into audit identifiers",
  );
  assert.deepEqual(resolveProfileUpgradeCommercialBinding(base), {
    kind: "lookup_request",
    requestId: REQUEST_ID,
  });
  assert.deepEqual(
    resolveProfileUpgradeCommercialBinding({ ...base, metadataRequest: null }),
    {
      kind: "unmatched",
      reason: "request_not_found",
      metadataRequestId: REQUEST_ID,
      databasePaymentId: null,
    },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialBinding({
      ...base,
      metadataRequest: {
        id: REQUEST_ID,
        providerPaymentId: "pi_another_purchase",
      },
    }),
    {
      kind: "unmatched",
      reason: "request_payment_binding_mismatch",
      metadataRequestId: REQUEST_ID,
      databasePaymentId: "pi_another_purchase",
    },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialBinding({
      ...base,
      metadataRequest: { id: REQUEST_ID, providerPaymentId: null },
    }),
    { kind: "matched", requestId: REQUEST_ID },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialBinding({
      ...base,
      metadataRequestId: "00000000-0000-4000-8000-000000000050",
      databaseBoundRequestId: REQUEST_ID,
    }),
    { kind: "matched", requestId: REQUEST_ID },
    "the durable database binding remains authoritative once established",
  );
});

test("refund and dispute aggregates are fail-closed and order-independent", () => {
  assert.equal(profileUpgradeRefundStatus(0), null);
  assert.equal(profileUpgradeRefundStatus(1), "partially_refunded");
  assert.equal(profileUpgradeRefundStatus(4_900), "refunded");
  assert.equal(disputeRestoresProfileUpgrade("won"), true);
  assert.equal(disputeRestoresProfileUpgrade("prevented"), true);
  assert.equal(disputeRestoresProfileUpgrade("lost"), false);

  assert.deepEqual(
    summarizeProfileUpgradeRefunds([
      { amount: 2_000, id: "re_succeeded", status: "succeeded" },
      { amount: 2_900, id: "re_pending", status: "pending" },
      { amount: 100, id: "re_failed", status: "failed" },
    ]),
    {
      hasFailed: true,
      hasPending: true,
      succeededAmountMinor: 2_000,
      valid: true,
    },
  );
  assert.equal(
    summarizeProfileUpgradeRefunds([
      { amount: 4_900, id: "re_unknown", status: "mystery" },
    ]).valid,
    false,
  );
  assert.equal(profileUpgradeDisputeState([]), "clear");
  assert.equal(profileUpgradeDisputeState(["won", "prevented"]), "clear");
  assert.equal(
    profileUpgradeDisputeState(["won", "needs_response"]),
    "open",
  );
  assert.equal(
    profileUpgradeDisputeState(["needs_response", "lost", "won"]),
    "lost",
    "a lost dispute wins regardless of list or webhook order",
  );

  const noRefunds = summarizeProfileUpgradeRefunds([]);
  const fullRefund = summarizeProfileUpgradeRefunds([
    { amount: 4_900, id: "re_full", status: "succeeded" },
  ]);
  const partialRefund = summarizeProfileUpgradeRefunds([
    { amount: 2_000, id: "re_partial", status: "succeeded" },
  ]);
  const pendingRefund = summarizeProfileUpgradeRefunds([
    { amount: 4_900, id: "re_pending", status: "pending" },
  ]);
  const failedRefund = summarizeProfileUpgradeRefunds([
    { amount: 4_900, id: "re_failed", status: "failed" },
  ]);
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      chargeAmountRefundedMinor: 4_900,
      disputeState: "lost",
      refundSummary: fullRefund,
    }),
    { kind: "refunded", amountRefundedMinor: 4_900 },
    "a succeeded full refund stays terminal across a later dispute",
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      capturedAmountMinor: 4_899,
      chargeAmountRefundedMinor: 4_899,
      disputeState: "clear",
      refundSummary: summarizeProfileUpgradeRefunds([
        { amount: 4_899, id: "re_full_mismatch", status: "succeeded" },
      ]),
    }),
    { kind: "refunded", amountRefundedMinor: 4_899 },
    "a full refund closes an anomalous capture without claiming EUR 49 was returned",
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      chargeAmountRefundedMinor: 2_000,
      disputeState: "lost",
      refundSummary: partialRefund,
    }),
    { kind: "dispute_lost", amountRefundedMinor: 2_000 },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      chargeAmountRefundedMinor: 0,
      disputeState: "open",
      refundSummary: noRefunds,
    }),
    { kind: "disputed", amountRefundedMinor: 0 },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      chargeAmountRefundedMinor: 2_000,
      disputeState: "clear",
      refundSummary: partialRefund,
    }),
    { kind: "partially_refunded", amountRefundedMinor: 2_000 },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      chargeAmountRefundedMinor: 0,
      disputeState: "clear",
      refundSummary: pendingRefund,
    }),
    { kind: "refund_pending", amountRefundedMinor: 0 },
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      chargeAmountRefundedMinor: 0,
      disputeState: "clear",
      refundSummary: failedRefund,
    }),
    { kind: "clear", amountRefundedMinor: 0 },
    "pending to failed restores eligibility without treating money as returned",
  );
  assert.deepEqual(
    resolveProfileUpgradeCommercialState({
      chargeAmountRefundedMinor: 1_000,
      disputeState: "clear",
      refundSummary: noRefunds,
    }),
    { kind: "refund_aggregate_mismatch", amountRefundedMinor: 0 },
  );

  assert.equal(canRetryPaidUnfulfilledProfileUpgrade("missing_charge"), true);
  assert.equal(canRetryPaidUnfulfilledProfileUpgrade("charge_disputed"), true);
  assert.equal(canRetryPaidUnfulfilledProfileUpgrade("refund_pending"), true);
  assert.equal(
    canRetryPaidUnfulfilledProfileUpgrade("refund_aggregate_mismatch"),
    true,
  );
  assert.equal(canRetryPaidUnfulfilledProfileUpgrade("offer_mismatch"), false);
});

test("commercial adversity preempts immutable grant failures without clearing them", () => {
  const fullRefundState = resolveProfileUpgradeCommercialState({
    capturedAmountMinor: 4_899,
    chargeAmountRefundedMinor: 4_899,
    disputeState: "clear",
    refundSummary: summarizeProfileUpgradeRefunds([
      { amount: 4_899, id: "re_mismatched_full", status: "succeeded" },
    ]),
  });
  assert.equal(canRetryPaidUnfulfilledProfileUpgrade("offer_mismatch"), false);
  assert.equal(requiresProfileUpgradeCommercialTransition(fullRefundState), true);
  assert.equal(fullRefundState.kind, "refunded");

  const lostDisputeState = resolveProfileUpgradeCommercialState({
    capturedAmountMinor: 4_899,
    chargeAmountRefundedMinor: 0,
    disputeState: "lost",
    refundSummary: summarizeProfileUpgradeRefunds([]),
  });
  assert.equal(requiresProfileUpgradeCommercialTransition(lostDisputeState), true);
  assert.equal(lostDisputeState.kind, "dispute_lost");

  const pendingRefundState = resolveProfileUpgradeCommercialState({
    capturedAmountMinor: 4_899,
    chargeAmountRefundedMinor: 0,
    disputeState: "clear",
    refundSummary: summarizeProfileUpgradeRefunds([
      { amount: 4_899, id: "re_mismatched_pending", status: "pending" },
    ]),
  });
  assert.equal(pendingRefundState.kind, "refund_pending");
  assert.equal(canRetryPaidUnfulfilledProfileUpgrade("refund_pending"), true);

  const failedRefundState = resolveProfileUpgradeCommercialState({
    capturedAmountMinor: 4_899,
    chargeAmountRefundedMinor: 0,
    disputeState: "clear",
    refundSummary: summarizeProfileUpgradeRefunds([
      { amount: 4_899, id: "re_mismatched_failed", status: "failed" },
    ]),
  });
  assert.equal(requiresProfileUpgradeCommercialTransition(failedRefundState), false);
  assert.equal(failedRefundState.kind, "clear");
  assert.equal(
    canRetryPaidUnfulfilledProfileUpgrade("offer_mismatch"),
    false,
    "after pending becomes failed, immutable validation remains the blocker",
  );
});

test("the Stripe webhook allowlist is exact", () => {
  assert.deepEqual(STRIPE_PROFILE_UPGRADE_WEBHOOK_EVENTS, [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
    "charge.refunded",
    "charge.dispute.created",
    "charge.dispute.updated",
    "charge.dispute.closed",
    "refund.created",
    "refund.updated",
    "refund.failed",
  ]);
  for (const event of STRIPE_PROFILE_UPGRADE_WEBHOOK_EVENTS) {
    assert.equal(isStripeProfileUpgradeWebhookEvent(event), true);
  }
  assert.equal(isStripeProfileUpgradeWebhookEvent("payment_intent.created"), false);
});
