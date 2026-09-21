import assert from "node:assert/strict";
import { test } from "node:test";
import { createInstagramProofCookie, createInstagramState, exchangeInstagramCode, instagramAuthorizationUrl, instagramConfiguration, instagramHandle, INSTAGRAM_SCOPE, readInstagramProof, readInstagramState } from "../lib/instagram/verification";

const binding = { accountId: "60d20e06-7c11-4e14-9a74-17cf1d263ba9", country: "es", producerId: 123 };
const secret = "a-test-signing-secret-with-at-least-32-characters";
const config = { appId: "123", appSecret: "test-app-secret", signingSecret: secret, redirectUri: "https://chisan.app/api/instagram/verification/callback" };
const proof = { provider: "instagram" as const, subject: "12345678901234567", username: "producer.test", checkedAt: "2026-09-21T10:00:00.000Z" };
const now = Date.parse(proof.checkedAt);

test("Instagram stays disabled without explicit configuration, including secure callback and signing secret", () => {
  assert.equal(instagramConfiguration({}), null);
  const env = { CHISAN_INSTAGRAM_VERIFICATION_ENABLED: "true", INSTAGRAM_APP_ID: "123", INSTAGRAM_APP_SECRET: config.appSecret, CHISAN_INSTAGRAM_STATE_SECRET: secret };
  assert.deepEqual(instagramConfiguration(env), config);
  for (const overrides of [{ CHISAN_INSTAGRAM_STATE_SECRET: "short" }, { INSTAGRAM_REDIRECT_URI: "http://chisan.app/api/instagram/verification/callback" }, { INSTAGRAM_REDIRECT_URI: "https://chisan.app/elsewhere" }, { INSTAGRAM_APP_ID: "bad" }]) assert.equal(instagramConfiguration({ ...env, ...overrides }), null);
});

test("OAuth state rejects tampering, wrong account, wrong nonce, expiry and future timestamps", () => {
  const { state, cookie } = createInstagramState(binding, secret, now);
  assert.deepEqual(readInstagramState(cookie, state.nonce, binding.accountId, secret, now), state);
  assert.equal(readInstagramState(cookie, "wrong", binding.accountId, secret, now), null);
  assert.equal(readInstagramState(cookie, state.nonce, "other", secret, now), null);
  assert.equal(readInstagramState(`${cookie}x`, state.nonce, binding.accountId, secret, now), null);
  assert.equal(readInstagramState(cookie, state.nonce, binding.accountId, "another-secret", now), null);
  assert.equal(readInstagramState(cookie, state.nonce, binding.accountId, secret, now + 600_000), null);
  assert.equal(readInstagramState(cookie, state.nonce, binding.accountId, secret, now - 1), null);
  const url = new URL(instagramAuthorizationUrl(config, state.nonce));
  assert.equal(url.searchParams.get("scope"), INSTAGRAM_SCOPE);
  assert.equal(url.searchParams.get("state"), state.nonce);
  assert.equal(url.searchParams.has("client_secret"), false);
});

test("verified proof is bound to one Chisan account and producer and cannot be forged in a form", () => {
  const { state } = createInstagramState(binding, secret, now);
  const cookie = createInstagramProofCookie(state, proof, secret, now);
  assert.deepEqual(readInstagramProof(cookie, binding, secret, now), proof);
  for (const changed of [{ ...binding, accountId: "60d20e06-7c11-4e14-9a74-17cf1d263baa" }, { ...binding, producerId: 124 }, { ...binding, country: "fr" }]) assert.equal(readInstagramProof(cookie, changed, secret, now), null);
  assert.equal(readInstagramProof(cookie, binding, secret, now + 600_000), null);
  assert.equal(readInstagramProof(JSON.stringify(proof), binding, secret, now), null);
  const stateCookie = createInstagramState(binding, secret, now).cookie;
  assert.equal(readInstagramProof(stateCookie, binding, secret, now), null);
});

test("Instagram profile matching accepts only exact Instagram profile URLs", () => {
  assert.equal(instagramHandle("https://www.instagram.com/Producer.Test/?hl=es"), "producer.test");
  for (const value of ["https://instagram.com.evil.test/name", "https://instagram.com/reel/123", "https://instagram.com/accounts", "https://x.test/producer.test", "https://user:secret@instagram.com/name", "@producer.test"]) assert.equal(instagramHandle(value), null);
});

test("provider adapter returns only identity evidence, with tokens confined to the exchange and Bearer header", async () => {
  for (const envelope of [false, true]) {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fetcher = (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      if (calls.length === 1) {
        const token = { access_token: "private-instagram-token", user_id: proof.subject, permissions: [INSTAGRAM_SCOPE] };
        return Response.json(envelope ? { data: [token] } : token);
      }
      return Response.json({ user_id: proof.subject, username: proof.username });
    }) as typeof fetch;
    const result = await exchangeInstagramCode(config, "private-code", fetcher);
    assert.deepEqual(Object.keys(result).sort(), ["checkedAt", "provider", "subject", "username"]);
    assert.equal(result.subject, proof.subject);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].init.method, "POST");
    assert.equal((calls[0].init.body as URLSearchParams).get("client_secret"), config.appSecret);
    assert.deepEqual(calls[1].init.headers, { Authorization: "Bearer private-instagram-token" });
    for (const call of calls) { assert.equal(call.init.redirect, "error"); assert.equal(call.init.cache, "no-store"); assert.equal(call.url.includes("private"), false); }
    assert.equal(JSON.stringify(result).includes("private"), false);
  }
});

test("provider failures, missing permission and identity mismatch produce no proof", async () => {
  await assert.rejects(exchangeInstagramCode(config, "code", (async () => new Response("{}", { status: 400 })) as typeof fetch));
  await assert.rejects(exchangeInstagramCode(config, "code", (async () => Response.json({ access_token: "token", user_id: "1", permissions: [] })) as typeof fetch));
  let calls = 0;
  await assert.rejects(exchangeInstagramCode(config, "code", (async () => Response.json(++calls === 1 ? { access_token: "token", user_id: "1" } : { user_id: "2", username: "someone" })) as typeof fetch));
});
