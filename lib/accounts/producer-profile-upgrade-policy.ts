export const PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY =
  "producer.profile.premium";

export const PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE =
  "paid_profile_upgrade";
export const PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE =
  "admin_profile_upgrade_gift";

export const PRODUCER_PROFILE_UPGRADE_AMOUNT_MINOR = 4_900;
export const PRODUCER_PROFILE_UPGRADE_CURRENCY = "eur";
export const PRODUCER_PROFILE_UPGRADE_TERMS_VERSION =
  "producer-profile-upgrade-v1";

export const PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES = [
  "pending",
  "paid",
  "paid_unfulfilled",
  "partially_refunded",
  "disputed",
] as const;
