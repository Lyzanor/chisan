import { acceptsProducerViewRequest } from "./request";

export async function handleProducerProfileView(
  request: Request,
  dependencies: {
    enabled: boolean;
    viewerId: () => Promise<string | null>;
    record: (input: {
      country: string;
      producerId: number;
      eventId: string;
      viewerId: string | null;
    }) => Promise<boolean>;
  },
) {
  const response = () =>
    new Response(null, {
      status: 204,
      headers: { "Cache-Control": "private, no-store" },
    });
  if (!dependencies.enabled) return response();
  if (!acceptsProducerViewRequest(request)) return response();
  // The endpoint accepts only a bounded canonical identity, never a visitor ID,
  // count, date, URL, referrer or browser-provided timestamp.
  if (
    request.headers.get("content-type") !== "application/json" ||
    Number(request.headers.get("content-length")) > 192
  )
    return response();
  try {
    const reader = request.body?.getReader();
    if (!reader) return response();
    let body = "";
    let bytes = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 192) {
        await reader.cancel();
        return response();
      }
      body += decoder.decode(value, { stream: true });
    }
    let input;
    try {
      input = JSON.parse(body);
    } catch {
      return response();
    }
    if (
      !input ||
      typeof input.country !== "string" ||
      !/^[a-z]{2}$/.test(input.country) ||
      !Number.isSafeInteger(input.producerId) ||
      input.producerId <= 0 ||
      typeof input.eventId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        input.eventId,
      ) ||
      Object.keys(input).some(
        (key) => !["country", "producerId", "eventId"].includes(key),
      )
    )
      return response();
    const viewerId = await dependencies.viewerId();
    await dependencies.record({
      eventId: input.eventId,
      country: input.country,
      producerId: input.producerId,
      viewerId,
    });
  } catch {
    // A measurement outage must not interrupt the catalog or expose request PII.
    console.error("Producer statistics collection is temporarily unavailable.");
  }
  return response();
}
