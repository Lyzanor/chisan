export const STRIPE_PAYMENT_PROVIDER = "stripe";

export const PAYMENT_PROVIDER_KEY_PATTERN = /^[a-z][a-z0-9_-]{0,31}$/;

export function isPaymentProviderKey(value: string): boolean {
  return PAYMENT_PROVIDER_KEY_PATTERN.test(value);
}

export function paymentRequestUsesProvider(
  request: Readonly<{ paymentProvider: string }>,
  provider: string,
): boolean {
  return request.paymentProvider === provider;
}
