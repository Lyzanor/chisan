import {
  PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
  PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
} from "./producer-profile-upgrade-policy";

export type ProfileUpgradeAdminGiftGrantDecision =
  | "grant"
  | "active_entitlement"
  | "active_owner_required"
  | "catalog_missing"
  | "commercial_request_open";

export function resolveProfileUpgradeAdminGiftGrant(input: {
  activeEntitlement: boolean;
  activeOwner: boolean;
  catalogProducer: boolean;
  openCommercialRequest: boolean;
}): ProfileUpgradeAdminGiftGrantDecision {
  if (!input.catalogProducer) return "catalog_missing";
  if (!input.activeOwner) return "active_owner_required";
  if (input.activeEntitlement) return "active_entitlement";
  if (input.openCommercialRequest) return "commercial_request_open";
  return "grant";
}

export function canAdminRevokeProfileUpgradeGift(input: {
  key: string;
  source: string;
  status: string;
  subjectKind: string;
}): boolean {
  return (
    input.subjectKind === "producer" &&
    input.key === PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY &&
    input.source === PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE &&
    input.status === "active"
  );
}

export function profileUpgradeOfferMatchesRequest(
  request: { providerOfferId: string; termsUrl: string; termsVersion: string },
  offer: { providerOfferId: string; termsUrl: string; termsVersion: string },
): boolean {
  return (
    request.providerOfferId === offer.providerOfferId &&
    request.termsUrl === offer.termsUrl &&
    request.termsVersion === offer.termsVersion
  );
}

export function profileUpgradeRequestUsesStoredOffer(request: {
  status: string;
  providerCheckoutId: string | null;
}): boolean {
  return (
    (request.status === "pending" && request.providerCheckoutId !== null) ||
    ["paid", "paid_unfulfilled", "partially_refunded", "disputed"].includes(
      request.status,
    )
  );
}
