import { isProducerIntentAction, type ProducerIntentAction } from "./policy";
import { acceptsProducerViewRequest } from "./request";

const DISPLAY_EVENT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ProducerEvent = {
  country: string;
  producerId: number;
  eventId: string;
  action?: unknown;
};

function accepted() {
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "private, no-store" },
  });
}

// The endpoints accept only a bounded canonical identity, never a visitor ID,
// count, date, URL, referrer or browser-provided timestamp.
async function readProducerEvent(
  request: Request,
  limit: number,
  keys: readonly string[],
): Promise<ProducerEvent | null> {
  if (
    request.headers.get("content-type") !== "application/json" ||
    Number(request.headers.get("content-length")) > limit
  )
    return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  let body = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > limit) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }
  let input;
  try {
    input = JSON.parse(body);
  } catch {
    return null;
  }
  if (
    !input ||
    typeof input.country !== "string" ||
    !/^[a-z]{2}$/.test(input.country) ||
    !Number.isSafeInteger(input.producerId) ||
    input.producerId <= 0 ||
    typeof input.eventId !== "string" ||
    !DISPLAY_EVENT_ID.test(input.eventId) ||
    Object.keys(input).some((key) => !keys.includes(key))
  )
    return null;
  return input as ProducerEvent;
}

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
  if (!dependencies.enabled) return accepted();
  if (!acceptsProducerViewRequest(request)) return accepted();
  try {
    const input = await readProducerEvent(request, 192, [
      "country",
      "producerId",
      "eventId",
    ]);
    if (!input) return accepted();
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
  return accepted();
}

/**
 * Counts one public intent click. The action must be on the shared allowlist;
 * the target link, its address and the reader remain unknown to the server.
 */
export async function handleProducerIntentClick(
  request: Request,
  dependencies: {
    enabled: boolean;
    viewerId: () => Promise<string | null>;
    record: (input: {
      country: string;
      producerId: number;
      eventId: string;
      action: ProducerIntentAction;
      viewerId: string | null;
    }) => Promise<boolean>;
  },
) {
  if (!dependencies.enabled) return accepted();
  if (!acceptsProducerViewRequest(request)) return accepted();
  try {
    const input = await readProducerEvent(request, 224, [
      "country",
      "producerId",
      "eventId",
      "action",
    ]);
    if (!input || !isProducerIntentAction(input.action)) return accepted();
    const viewerId = await dependencies.viewerId();
    await dependencies.record({
      eventId: input.eventId,
      country: input.country,
      producerId: input.producerId,
      action: input.action,
      viewerId,
    });
  } catch {
    // A measurement outage must not interrupt the catalog or expose request PII.
    console.error("Producer statistics collection is temporarily unavailable.");
  }
  return accepted();
}
