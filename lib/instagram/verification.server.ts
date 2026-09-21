import "server-only";
import { cookies } from "next/headers";
import { INSTAGRAM_PROOF_COOKIE, INSTAGRAM_VERIFICATION_TTL, instagramConfiguration, readInstagramProof } from "./verification";

export const instagramCookieOptions = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: INSTAGRAM_VERIFICATION_TTL };

export async function currentInstagramProof(accountId: string, country: string, producerId: number) {
  const config = instagramConfiguration();
  if (!config) return null;
  return readInstagramProof((await cookies()).get(INSTAGRAM_PROOF_COOKIE)?.value, { accountId, country, producerId }, config.signingSecret);
}
