"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hasProducerAccess, requireCurrentAccount } from "@/lib/accounts/auth";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { formString } from "@/lib/accounts/input";
import { getDatabase } from "@/lib/db";
import { auditEvents, producerChangeRequests } from "@/lib/db/schema";
import { createProducerChangeSubmissionService, type ProducerChangeFormState } from "@/lib/accounts/producer-change-submission";
import { redirectWithMessage } from "./navigation";
export type { ProducerChangeFormState } from "@/lib/accounts/producer-change-submission";

export async function submitProducerChangeAction(state: ProducerChangeFormState, formData: FormData): Promise<ProducerChangeFormState> {
  return createProducerChangeSubmissionService({ getDatabase, requireCurrentAccount, hasProducerAccess, hasActiveProducerPremiumEntitlement, redirectWithMessage, revalidatePath })(state, formData);
}

export async function withdrawProducerChangeAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/cambios");
  const changeId = formString(formData, "changeId");
  if (!/^[0-9a-f-]{36}$/i.test(changeId)) {
    redirectWithMessage("/cuenta/cambios", "error", "Invalid change request.");
  }

  const withdrawn = await getDatabase().transaction(async (transaction) => {
    const [updated] = await transaction
      .update(producerChangeRequests)
      .set({
        status: "withdrawn",
        lockVersion: sql`${producerChangeRequests.lockVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(producerChangeRequests.id, changeId),
          eq(producerChangeRequests.authorUserId, account.id),
          inArray(producerChangeRequests.status, [
            "draft",
            "submitted",
            "needs_changes",
          ]),
        ),
      )
      .returning({ id: producerChangeRequests.id });
    if (!updated) return false;
    await transaction.insert(auditEvents).values({
      actorKind: "user",
      actorUserId: account.id,
      action: "producer_change.withdrawn",
      targetType: "producer_change_request",
      targetId: updated.id,
      metadata: {},
    });
    return true;
  });

  redirectWithMessage(
    "/cuenta/cambios",
    withdrawn ? "notice" : "error",
    withdrawn
      ? "Change request withdrawn."
      : "This request can no longer be withdrawn.",
  );
}
