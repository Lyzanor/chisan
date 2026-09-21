"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { producerKeySchema, formString } from "@/lib/accounts/input";
import { findProducerById } from "@/lib/csv-catalog";
import { createInstagramState, instagramAuthorizationUrl, instagramConfiguration, INSTAGRAM_PROOF_COOKIE, INSTAGRAM_STATE_COOKIE } from "@/lib/instagram/verification";
import { instagramCookieOptions } from "@/lib/instagram/verification.server";
import { and, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { auditEvents, producerClaims } from "@/lib/db/schema";

export async function beginInstagramVerification(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/reclamaciones");
  if (!account.emailVerified || !account.termsAcceptedAt) redirect("/cuenta/bienvenida");
  const key = producerKeySchema.safeParse({ country: formString(formData, "country"), producerId: formString(formData, "producerId") });
  const config = instagramConfiguration();
  if (!config || !key.success || !(await findProducerById(key.data.country, key.data.producerId))) {
    redirect("/cuenta/reclamaciones?error=No%20se%20ha%20podido%20iniciar%20la%20conexión%20con%20Instagram.");
  }
  const { state, cookie } = createInstagramState({ accountId: account.id, ...key.data }, config.signingSecret);
  const jar = await cookies();
  jar.delete(INSTAGRAM_PROOF_COOKIE);
  jar.set(INSTAGRAM_STATE_COOKIE, cookie, instagramCookieOptions);
  redirect(instagramAuthorizationUrl(config, state.nonce));
}

export async function removeInstagramEvidence(): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/reclamaciones");
  await getDatabase().transaction(async transaction => {
    const removed = await transaction.update(producerClaims).set({
      proof: sql`${producerClaims.proof} - 'instagramVerification'`,
      lockVersion: sql`${producerClaims.lockVersion} + 1`,
      updatedAt: new Date(),
    }).where(and(eq(producerClaims.claimantUserId, account.id), sql`${producerClaims.proof} ? 'instagramVerification'`)).returning({ id: producerClaims.id });
    if (removed.length) await transaction.insert(auditEvents).values({
      actorKind: "user", actorUserId: account.id, action: "instagram.evidence_removed", targetType: "user", targetId: account.id,
      metadata: { claimsAffected: removed.length },
    });
  });
  const jar = await cookies();
  jar.delete(INSTAGRAM_STATE_COOKIE);
  jar.delete(INSTAGRAM_PROOF_COOKIE);
  redirect("/cuenta/reclamaciones?notice=Se%20ha%20eliminado%20tu%20comprobación%20de%20Instagram.");
}
