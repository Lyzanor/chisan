/** Full document navigation between Next.js root layouts also counts as internal. */
export function isInternalHomeDocumentEntry({
  referrer,
  origin,
  navigationType,
}: {
  referrer: string;
  origin: string;
  navigationType?: string;
}): boolean {
  if (navigationType === "reload") return false;
  if (navigationType === "back_forward") return true;
  try {
    return new URL(referrer).origin === origin;
  } catch {
    return false;
  }
}
