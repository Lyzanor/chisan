import { secretMatches } from "@/lib/whatsapp/domain";
import { runWhatsAppInbox } from "@/lib/whatsapp/runtime";

export const runtime = "nodejs";
export const maxDuration = 300;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (
    !secret ||
    !secretMatches(
      request.headers.get("authorization") ?? "",
      `Bearer ${secret}`,
    )
  )
    return new Response("Unauthorized", { status: 401 });
  try {
    await runWhatsAppInbox();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
