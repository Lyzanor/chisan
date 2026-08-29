const EXCLUDED_ANALYTICS_PREFIXES = [
  "/acceso",
  "/admin",
  "/api",
  "/cuenta",
  "/registro",
] as const;

export function isPublicAnalyticsPath(pathname: string): boolean {
  return !EXCLUDED_ANALYTICS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function sanitizePublicAnalyticsUrl(value: string): string | null {
  try {
    const url = new URL(value);

    if (!isPublicAnalyticsPath(url.pathname)) {
      return null;
    }

    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}
