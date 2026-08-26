export function formatMinorCurrencyAmount(
  amountMinor: number,
  currency: string,
  locale = "en-IE",
): string {
  const normalizedCurrency = currency.trim().toUpperCase();
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
    });
    const fractionDigits =
      formatter.resolvedOptions().maximumFractionDigits ?? 2;
    return formatter.format(amountMinor / 10 ** fractionDigits);
  } catch {
    return `${amountMinor} minor units ${normalizedCurrency || "UNKNOWN"}`;
  }
}
