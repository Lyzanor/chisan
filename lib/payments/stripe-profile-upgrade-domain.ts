import {
  PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
  PRODUCER_PROFILE_UPGRADE_CURRENCY,
} from "@/lib/accounts/producer-profile-upgrade-policy";

export const PRODUCER_PROFILE_UPGRADE_UNMATCHED_COMMERCIAL_ACTION =
  "producer_profile_upgrade.unmatched_commercial_event";

export type ProfileUpgradeCheckoutFacts = {
  id: string;
  mode: string | null;
  paymentStatus: string;
  currency: string | null;
  amountTotal: number | null;
  clientReferenceId: string | null;
  metadataKind: string | null;
  metadataRequestId: string | null;
  paymentId: string | null;
  offerId: string | null;
  quantity: number | null;
  lineItemCount: number;
};

export type ProfileUpgradeCheckoutValidation =
  | { ok: true; paymentId: string }
  | {
      ok: false;
      code:
        | "amount_mismatch"
        | "binding_mismatch"
        | "currency_mismatch"
        | "line_item_mismatch"
        | "missing_payment_id"
        | "mode_mismatch"
        | "offer_mismatch"
        | "unpaid";
    };

export type ProfileUpgradeChargeFacts = {
  amount: number;
  amountCaptured: number;
  currency: string;
  id: string;
  paid: boolean;
  paymentId: string | null;
  status: string;
};

export type ProfileUpgradeChargeValidation =
  | { ok: true; chargeId: string }
  | {
      ok: false;
      code:
        | "charge_amount_mismatch"
        | "charge_captured_amount_mismatch"
        | "charge_binding_mismatch"
        | "charge_currency_mismatch"
        | "charge_unpaid"
        | "missing_charge";
    };

export type ProfileUpgradeCommercialBindingDecision =
  | { kind: "foreign" }
  | { kind: "lookup_request"; requestId: string }
  | { kind: "matched"; requestId: string }
  | {
      kind: "unmatched";
      reason:
        | "metadata_request_id_missing"
        | "metadata_request_id_invalid"
        | "request_not_found"
        | "request_payment_binding_mismatch";
      metadataRequestId: string | null;
      databasePaymentId: string | null;
    };

export type ProfileUpgradeRefundFacts = {
  amount: number;
  id: string;
  status: string | null;
};

export type ProfileUpgradeRefundSummary = {
  hasFailed: boolean;
  hasPending: boolean;
  succeededAmountMinor: number;
  valid: boolean;
};

export type ProfileUpgradeDisputeState = "clear" | "lost" | "open";

export type ProfileUpgradeCommercialState =
  | { kind: "clear"; amountRefundedMinor: 0 }
  | { kind: "refund_aggregate_mismatch"; amountRefundedMinor: number }
  | { kind: "refund_pending"; amountRefundedMinor: number }
  | { kind: "partially_refunded"; amountRefundedMinor: number }
  | { kind: "refunded"; amountRefundedMinor: number }
  | { kind: "disputed"; amountRefundedMinor: number }
  | { kind: "dispute_lost"; amountRefundedMinor: number };

export function paymentObjectId(
  value: string | { id?: string | null } | null | undefined,
): string | null {
  if (typeof value === "string") return value.trim() || null;
  return value?.id?.trim() || null;
}

export function safeProfileUpgradeCommercialAuditIdentifier(
  value: string | null | undefined,
  maxLength = 255,
): string | null {
  const normalized = value?.trim() || null;
  return normalized &&
    normalized.length <= maxLength &&
    /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(normalized)
    ? normalized
    : null;
}

const PROFILE_UPGRADE_REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Classifies a Stripe payment after the durable payment binding lookup.
 * A database-bound request remains authoritative. Unbound objects are Chisan
 * only when their Stripe object explicitly carries the expected metadata kind.
 */
export function resolveProfileUpgradeCommercialBinding(input: {
  paymentId: string | null;
  expectedMetadataKind: string;
  metadataKind: string | null;
  metadataRequestId: string | null;
  databaseBoundRequestId: string | null;
  metadataRequest?: {
    id: string;
    providerPaymentId: string | null;
  } | null;
}): ProfileUpgradeCommercialBindingDecision {
  const paymentId = input.paymentId?.trim() || null;
  if (!paymentId) return { kind: "foreign" };
  if (input.databaseBoundRequestId) {
    return { kind: "matched", requestId: input.databaseBoundRequestId };
  }
  if (input.metadataKind !== input.expectedMetadataKind) {
    return { kind: "foreign" };
  }

  const rawRequestId = input.metadataRequestId?.trim() || null;
  if (!rawRequestId) {
    return {
      kind: "unmatched",
      reason: "metadata_request_id_missing",
      metadataRequestId: null,
      databasePaymentId: null,
    };
  }
  if (!PROFILE_UPGRADE_REQUEST_ID_PATTERN.test(rawRequestId)) {
    return {
      kind: "unmatched",
      reason: "metadata_request_id_invalid",
      metadataRequestId: null,
      databasePaymentId: null,
    };
  }

  const requestId = rawRequestId.toLowerCase();
  if (input.metadataRequest === undefined) {
    return { kind: "lookup_request", requestId };
  }
  if (!input.metadataRequest || input.metadataRequest.id.toLowerCase() !== requestId) {
    return {
      kind: "unmatched",
      reason: "request_not_found",
      metadataRequestId: requestId,
      databasePaymentId: null,
    };
  }

  const databasePaymentId = input.metadataRequest.providerPaymentId?.trim() || null;
  if (databasePaymentId && databasePaymentId !== paymentId) {
    return {
      kind: "unmatched",
      reason: "request_payment_binding_mismatch",
      metadataRequestId: requestId,
      databasePaymentId,
    };
  }
  return { kind: "matched", requestId };
}

export function validatePaidProfileUpgradeCheckout(
  facts: ProfileUpgradeCheckoutFacts,
  request: { id: string; providerOfferId: string },
  expectedMetadataKind: string,
): ProfileUpgradeCheckoutValidation {
  if (facts.paymentStatus !== "paid") return { ok: false, code: "unpaid" };
  if (
    facts.metadataKind !== expectedMetadataKind ||
    facts.metadataRequestId !== request.id ||
    facts.clientReferenceId !== request.id
  ) {
    return { ok: false, code: "binding_mismatch" };
  }
  if (facts.mode !== "payment") return { ok: false, code: "mode_mismatch" };
  if (facts.currency !== PRODUCER_PROFILE_UPGRADE_CURRENCY) {
    return { ok: false, code: "currency_mismatch" };
  }
  if (facts.amountTotal !== PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR) {
    return { ok: false, code: "amount_mismatch" };
  }
  if (facts.lineItemCount !== 1 || facts.quantity !== 1) {
    return { ok: false, code: "line_item_mismatch" };
  }
  if (facts.offerId !== request.providerOfferId) {
    return { ok: false, code: "offer_mismatch" };
  }
  if (!facts.paymentId) {
    return { ok: false, code: "missing_payment_id" };
  }
  return { ok: true, paymentId: facts.paymentId };
}

export function validatePaidProfileUpgradeCharge(
  facts: ProfileUpgradeChargeFacts | null,
  paymentId: string,
): ProfileUpgradeChargeValidation {
  if (!facts?.id) return { ok: false, code: "missing_charge" };
  if (facts.paymentId !== paymentId) {
    return { ok: false, code: "charge_binding_mismatch" };
  }
  if (!facts.paid || facts.status !== "succeeded") {
    return { ok: false, code: "charge_unpaid" };
  }
  if (facts.currency !== PRODUCER_PROFILE_UPGRADE_CURRENCY) {
    return { ok: false, code: "charge_currency_mismatch" };
  }
  if (facts.amount !== PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR) {
    return { ok: false, code: "charge_amount_mismatch" };
  }
  if (facts.amountCaptured !== PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR) {
    return { ok: false, code: "charge_captured_amount_mismatch" };
  }
  return { ok: true, chargeId: facts.id };
}

export function canRetryPaidUnfulfilledProfileUpgrade(
  failureCode: string | null,
): boolean {
  return (
    failureCode === "charge_disputed" ||
    failureCode === "dispute_won_reconciliation" ||
    failureCode === "missing_charge" ||
    failureCode === "refund_aggregate_mismatch" ||
    failureCode === "refund_failed_reconciliation" ||
    failureCode === "refund_pending"
  );
}

export function profileUpgradeRefundStatus(
  amountRefundedMinor: number,
  amountMinor = PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR,
): "partially_refunded" | "refunded" | null {
  if (!Number.isSafeInteger(amountRefundedMinor) || amountRefundedMinor <= 0) {
    return null;
  }
  return amountRefundedMinor >= amountMinor ? "refunded" : "partially_refunded";
}

export function summarizeProfileUpgradeRefunds(
  refunds: readonly ProfileUpgradeRefundFacts[],
): ProfileUpgradeRefundSummary {
  let succeededAmountMinor = 0;
  let hasPending = false;
  let hasFailed = false;
  let valid = true;

  for (const refund of refunds) {
    if (!refund.id || !Number.isSafeInteger(refund.amount) || refund.amount <= 0) {
      valid = false;
      continue;
    }
    if (refund.status === "succeeded") {
      succeededAmountMinor += refund.amount;
      valid = valid && Number.isSafeInteger(succeededAmountMinor);
    } else if (refund.status === "pending" || refund.status === "requires_action") {
      hasPending = true;
    } else if (refund.status === "failed" || refund.status === "canceled") {
      hasFailed = true;
    } else {
      valid = false;
    }
  }

  return { hasFailed, hasPending, succeededAmountMinor, valid };
}

export function profileUpgradeDisputeState(
  statuses: readonly string[],
): ProfileUpgradeDisputeState {
  if (statuses.includes("lost")) return "lost";
  return statuses.some((status) => !disputeRestoresProfileUpgrade(status))
    ? "open"
    : "clear";
}

export function resolveProfileUpgradeCommercialState(input: {
  capturedAmountMinor?: number;
  chargeAmountRefundedMinor: number;
  disputeState: ProfileUpgradeDisputeState;
  refundSummary: ProfileUpgradeRefundSummary;
}): ProfileUpgradeCommercialState {
  const capturedAmountMinor =
    input.capturedAmountMinor ?? PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR;
  const amountRefundedMinor = Math.min(
    input.refundSummary.succeededAmountMinor,
    capturedAmountMinor,
  );
  if (
    !Number.isSafeInteger(capturedAmountMinor) ||
    capturedAmountMinor <= 0 ||
    !input.refundSummary.valid ||
    input.refundSummary.succeededAmountMinor > capturedAmountMinor ||
    input.refundSummary.succeededAmountMinor !== input.chargeAmountRefundedMinor
  ) {
    return { kind: "refund_aggregate_mismatch", amountRefundedMinor };
  }
  if (amountRefundedMinor === capturedAmountMinor) {
    return { kind: "refunded", amountRefundedMinor };
  }
  if (input.disputeState === "lost") {
    return { kind: "dispute_lost", amountRefundedMinor };
  }
  if (input.disputeState === "open") {
    return { kind: "disputed", amountRefundedMinor };
  }
  if (amountRefundedMinor > 0) {
    return { kind: "partially_refunded", amountRefundedMinor };
  }
  if (input.refundSummary.hasPending) {
    return { kind: "refund_pending", amountRefundedMinor };
  }
  return { kind: "clear", amountRefundedMinor: 0 };
}

export function requiresProfileUpgradeCommercialTransition(
  state: ProfileUpgradeCommercialState,
): boolean {
  return state.kind !== "clear";
}

export function disputeRestoresProfileUpgrade(status: string): boolean {
  return status === "won" || status === "warning_closed" || status === "prevented";
}
