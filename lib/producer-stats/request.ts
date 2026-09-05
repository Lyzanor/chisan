const AUTOMATED_AGENT =
  /bot|crawler|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|curl|wget|python|monitor|uptime/i;

/** Ignore automated/background requests and honor browser privacy choices. */
export function acceptsProducerViewRequest(request: Request) {
  const headers = request.headers;
  if (
    headers.get("origin") !== new URL(request.url).origin ||
    headers.get("sec-fetch-site") !== "same-origin" ||
    headers.get("dnt") === "1" ||
    headers.get("sec-gpc") === "1" ||
    headers.has("next-router-prefetch") ||
    /prefetch|prerender/i.test(
      `${headers.get("purpose")} ${headers.get("sec-purpose")}`,
    )
  ) {
    return false;
  }
  const userAgent = headers.get("user-agent")?.trim();
  if (!userAgent || userAgent.length > 512 || AUTOMATED_AGENT.test(userAgent))
    return false;
  return true;
}
