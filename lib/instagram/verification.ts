import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { SITE_ORIGIN } from "../site";

export const INSTAGRAM_CALLBACK_PATH = "/api/instagram/verification/callback";
export const INSTAGRAM_STATE_COOKIE = "chisan_instagram_state";
export const INSTAGRAM_PROOF_COOKIE = "chisan_instagram_proof";
export const INSTAGRAM_VERIFICATION_TTL = 10 * 60;
export const INSTAGRAM_SCOPE = "instagram_business_basic";

export function instagramConfiguration(env: Record<string, string | undefined> = process.env) {
  if (env.CHISAN_INSTAGRAM_VERIFICATION_ENABLED !== "true") return null;
  const appId = env.INSTAGRAM_APP_ID?.trim();
  const appSecret = env.INSTAGRAM_APP_SECRET?.trim();
  const signingSecret = env.CHISAN_INSTAGRAM_STATE_SECRET?.trim();
  const redirectUri = env.INSTAGRAM_REDIRECT_URI?.trim() || `${SITE_ORIGIN}${INSTAGRAM_CALLBACK_PATH}`;
  if (!appId || !/^\d+$/.test(appId) || !appSecret || !signingSecret || signingSecret.length < 32) return null;
  try {
    const url = new URL(redirectUri);
    if (url.protocol !== "https:" || url.pathname !== INSTAGRAM_CALLBACK_PATH || url.search || url.hash || url.username || url.password) return null;
  } catch { return null; }
  return { appId, appSecret, signingSecret, redirectUri };
}
export type InstagramConfiguration = NonNullable<ReturnType<typeof instagramConfiguration>>;

const bindingSchema = z.object({ accountId: z.uuid(), country: z.string().regex(/^[a-z]{2}$/), producerId: z.number().int().positive().safe() });
const stateSchema = bindingSchema.extend({ kind: z.literal("state"), nonce: z.string().regex(/^[a-f0-9]{64}$/), expiresAt: z.number().int() }).strict();
export const instagramProofSchema = z.object({
  provider: z.literal("instagram"), subject: z.string().regex(/^\d+$/).max(100),
  username: z.string().regex(/^[a-zA-Z0-9._]{1,30}$/), checkedAt: z.iso.datetime(),
}).strict();
const proofCookieSchema = bindingSchema.extend({ kind: z.literal("proof"), proof: instagramProofSchema, expiresAt: z.number().int() }).strict();
type Binding = z.infer<typeof bindingSchema>;
export type InstagramProof = z.infer<typeof instagramProofSchema>;

function sign(payload: unknown, secret: string) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function decode(value: string | undefined, secret: string): unknown {
  if (!value || value.length > 3000) return null;
  const parts = value.split(".");
  if (parts.length !== 2 || !/^[\w-]+$/.test(parts[1])) return null;
  const expected = createHmac("sha256", secret).update(parts[0]).digest();
  const actual = Buffer.from(parts[1], "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try { return JSON.parse(Buffer.from(parts[0], "base64url").toString()); } catch { return null; }
}

export function createInstagramState(binding: Binding, secret: string, now = Date.now()) {
  const state = stateSchema.parse({ ...binding, kind: "state", nonce: randomBytes(32).toString("hex"), expiresAt: now + INSTAGRAM_VERIFICATION_TTL * 1000 });
  return { state, cookie: sign(state, secret) };
}

export function readInstagramState(cookie: string | undefined, nonce: string | null, accountId: string, secret: string, now = Date.now()) {
  const parsed = stateSchema.safeParse(decode(cookie, secret));
  if (!parsed.success || parsed.data.accountId !== accountId || parsed.data.nonce !== nonce || parsed.data.expiresAt <= now || parsed.data.expiresAt > now + INSTAGRAM_VERIFICATION_TTL * 1000) return null;
  return parsed.data;
}

export function createInstagramProofCookie(binding: Binding, proof: InstagramProof, secret: string, now = Date.now()) {
  return sign(proofCookieSchema.parse({ accountId: binding.accountId, country: binding.country, producerId: binding.producerId, kind: "proof", proof, expiresAt: now + INSTAGRAM_VERIFICATION_TTL * 1000 }), secret);
}

export function readInstagramProof(cookie: string | undefined, binding: Binding, secret: string, now = Date.now()): InstagramProof | null {
  const parsed = proofCookieSchema.safeParse(decode(cookie, secret));
  if (!parsed.success) return null;
  const value = parsed.data;
  if (value.accountId !== binding.accountId || value.country !== binding.country || value.producerId !== binding.producerId || value.expiresAt <= now || value.expiresAt > now + INSTAGRAM_VERIFICATION_TTL * 1000) return null;
  return value.proof;
}

export function instagramAuthorizationUrl(config: InstagramConfiguration, nonce: string) {
  const url = new URL("https://www.instagram.com/oauth/authorize");
  url.search = new URLSearchParams({ client_id: config.appId, redirect_uri: config.redirectUri, response_type: "code", scope: INSTAGRAM_SCOPE, state: nonce, enable_fb_login: "0", force_authentication: "1" }).toString();
  return url.href;
}

export function instagramHandle(value: string | undefined | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!["instagram.com", "www.instagram.com"].includes(url.hostname) || url.protocol !== "https:" || url.username || url.password) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 1 || !/^[a-zA-Z0-9._]{1,30}$/.test(parts[0]) || ["p", "reel", "reels", "stories", "explore", "accounts"].includes(parts[0].toLowerCase())) return null;
    return parts[0].toLowerCase();
  } catch { return null; }
}

/** Short-lived access tokens exist only inside this adapter and are discarded. */
export async function exchangeInstagramCode(config: InstagramConfiguration, code: string, fetcher: typeof fetch = fetch): Promise<InstagramProof> {
  const tokenResponse = await fetcher("https://api.instagram.com/oauth/access_token", {
    method: "POST", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000),
    body: new URLSearchParams({ client_id: config.appId, client_secret: config.appSecret, grant_type: "authorization_code", redirect_uri: config.redirectUri, code }),
  });
  if (!tokenResponse.ok) throw new Error("Instagram authorization failed.");
  const tokenSchema = z.object({ access_token: z.string().min(1).max(10000), user_id: z.union([z.string().regex(/^\d+$/), z.number().int().positive().safe()]), permissions: z.array(z.string()).optional() });
  const token = z.union([tokenSchema, z.object({ data: z.tuple([tokenSchema]) }).transform(value => value.data[0])]).parse(await tokenResponse.json());
  if (token.permissions && !token.permissions.includes(INSTAGRAM_SCOPE)) throw new Error("Instagram permission missing.");
  const response = await fetcher("https://graph.instagram.com/me?fields=id,user_id,username", {
    cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000),
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!response.ok) throw new Error("Instagram profile lookup failed.");
  const profile = z.object({ id: z.string().regex(/^\d+$/).optional(), user_id: z.string().regex(/^\d+$/), username: instagramProofSchema.shape.username }).parse(await response.json());
  if (![profile.id, profile.user_id].includes(String(token.user_id))) throw new Error("Instagram identity mismatch.");
  return instagramProofSchema.parse({ provider: "instagram", subject: profile.user_id, username: profile.username, checkedAt: new Date().toISOString() });
}
