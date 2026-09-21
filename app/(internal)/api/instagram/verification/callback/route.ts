import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentAccount } from "@/lib/accounts/auth";
import { createInstagramProofCookie, exchangeInstagramCode, instagramConfiguration, INSTAGRAM_PROOF_COOKIE, INSTAGRAM_STATE_COOKIE, readInstagramState } from "@/lib/instagram/verification";
import { instagramCookieOptions } from "@/lib/instagram/verification.server";
import { SITE_ORIGIN } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const config = instagramConfiguration();
  const origin = config ? new URL(config.redirectUri).origin : SITE_ORIGIN;
  const destination = new URL("/cuenta/reclamaciones", origin);
  let proofCookie: string | null = null;
  try {
    if (!config) throw new Error("Unavailable.");
    const account = await getCurrentAccount();
    if (!account?.emailVerified || !account.termsAcceptedAt) throw new Error("Account unavailable.");
    const state = readInstagramState((await cookies()).get(INSTAGRAM_STATE_COOKIE)?.value, request.nextUrl.searchParams.get("state"), account.id, config.signingSecret);
    if (!state) throw new Error("Expired state.");
    destination.pathname = "/cuenta/reclamaciones/nueva";
    destination.searchParams.set("country", state.country);
    destination.searchParams.set("producerId", String(state.producerId));
    const code = request.nextUrl.searchParams.get("code");
    if (request.nextUrl.searchParams.has("error") || !code || code.length > 4096) throw new Error("Authorization cancelled.");
    const proof = await exchangeInstagramCode(config, code);
    proofCookie = createInstagramProofCookie(state, proof, config.signingSecret);
    destination.searchParams.set("notice", "Instagram conectado. Envía la solicitud en los próximos diez minutos para adjuntar la comprobación.");
  } catch {
    destination.searchParams.set("error", "No se ha podido comprobar Instagram. Puedes reconectarlo o usar otro método de verificación.");
  }
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.delete(INSTAGRAM_STATE_COOKIE);
  response.cookies.delete(INSTAGRAM_PROOF_COOKIE);
  if (proofCookie) response.cookies.set(INSTAGRAM_PROOF_COOKIE, proofCookie, instagramCookieOptions);
  return response;
}
