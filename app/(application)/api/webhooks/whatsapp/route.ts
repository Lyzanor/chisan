import { after } from "next/server";
import { getDatabase } from "@/lib/db";
import { whatsappInbox } from "@/lib/db/schema";
import { whatsappConfig, whatsappEnabled } from "@/lib/whatsapp/config";
import {
  parseWebhook,
  secretMatches,
  verifyMetaSignature,
} from "@/lib/whatsapp/domain";
import { boundedBytes } from "@/lib/whatsapp/meta";
import { runWhatsAppInbox } from "@/lib/whatsapp/runtime";

export const runtime = "nodejs";
export const maxDuration = 300;
export async function GET(request: Request) {
  // Meta can verify the callback before message processing is activated.
  // This handshake never accesses the database or an inference provider.
  const expected = process.env.WHATSAPP_VERIFY_TOKEN?.trim();
  if (!expected) return new Response("Unavailable", { status: 503 });
  const params = new URL(request.url).searchParams;
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  if (
    !token ||
    !secretMatches(token, expected) ||
    params.get("hub.mode") !== "subscribe" ||
    !challenge ||
    !/^\d{1,100}$/.test(challenge)
  )
    return new Response("Forbidden", { status: 403 });
  return new Response(challenge, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  if (!whatsappEnabled()) return new Response("Unavailable", { status: 503 });
  try {
    const config = whatsappConfig();
    const bytes = await boundedBytes(new Response(request.body), 1024 * 1024);
    if (
      !verifyMetaSignature(
        bytes,
        request.headers.get("x-hub-signature-256"),
        config.appSecret,
      )
    )
      return new Response("Forbidden", { status: 403 });
    let messages;
    try {
      messages = parseWebhook(
        JSON.parse(bytes.toString("utf8")),
        config.phoneId,
      );
    } catch {
      return new Response("Invalid payload", { status: 400 });
    }
    if (messages.length) {
      await getDatabase()
        .insert(whatsappInbox)
        .values(
          messages.map((message) => ({
            id: message.id,
            sender: message.from,
            message,
          })),
        )
        .onConflictDoNothing();
      after(async () => {
        try {
          await runWhatsAppInbox();
        } catch {
          console.error("whatsapp.inbox_processing_failed");
        }
      });
    }
    // Acknowledge only after persistence; Meta retries cannot create another proposal.
    return Response.json({ received: true });
  } catch {
    return new Response("Temporarily unavailable", { status: 503 });
  }
}
