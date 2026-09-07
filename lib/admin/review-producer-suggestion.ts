import { and, eq, sql } from "drizzle-orm";

import {
  firstValidationMessage,
  formString,
  suggestionReviewSchema,
} from "@/lib/accounts/input";
import {
  canPublishProducerSuggestion,
  isReviewableProducerSuggestion,
} from "@/lib/accounts/producer-suggestion-workflow";
import type { Database } from "@/lib/db";
import { auditEvents, producerSuggestions } from "@/lib/db/schema";

export const SUGGESTION_REVIEW_ROUTE = "/admin/sugerencias";
const REVIEW_NOTE_MIN_CHARACTERS = 10;

type SuggestionReviewDependencies = {
  getDatabase: () => Database;
  requireStaffAccount: () => Promise<{ id: string }>;
  adminRedirect: (
    path: string,
    kind: "error" | "notice",
    message: string,
  ) => never;
};

/**
 * Staff decide whether a community correction is worth editorial work.
 * Accepting one never writes the catalog and never grants its author any
 * producer access: publication stays in the reviewed Git workflow, and the
 * operator records the commit here once it lands.
 */
export function createProducerSuggestionReviewService(
  dependencies: SuggestionReviewDependencies,
) {
  const { getDatabase, requireStaffAccount, adminRedirect } = dependencies;

  return async function reviewProducerSuggestion(
    formData: FormData,
  ): Promise<void> {
    const reviewer = await requireStaffAccount();
    const parsed = suggestionReviewSchema.safeParse({
      suggestionId: formString(formData, "suggestionId"),
      decision: formString(formData, "decision"),
      note: formString(formData, "note"),
      commitSha: formString(formData, "commitSha"),
    });
    if (!parsed.success) {
      return adminRedirect(
        SUGGESTION_REVIEW_ROUTE,
        "error",
        firstValidationMessage(parsed.error),
      );
    }
    if (parsed.data.note.length < REVIEW_NOTE_MIN_CHARACTERS) {
      return adminRedirect(
        SUGGESTION_REVIEW_ROUTE,
        "error",
        "Record why this community suggestion was accepted, rejected or published.",
      );
    }

    const database = getDatabase();
    const [suggestion] = await database
      .select()
      .from(producerSuggestions)
      .where(eq(producerSuggestions.id, parsed.data.suggestionId))
      .limit(1);
    if (!suggestion) {
      return adminRedirect(
        SUGGESTION_REVIEW_ROUTE,
        "error",
        "Suggestion not found.",
      );
    }

    const publishing = parsed.data.decision === "applied";
    const allowed = publishing
      ? canPublishProducerSuggestion(suggestion.status)
      : isReviewableProducerSuggestion(suggestion.status);
    if (!allowed) {
      return adminRedirect(
        SUGGESTION_REVIEW_ROUTE,
        "error",
        publishing
          ? "Only an accepted suggestion can be recorded as published."
          : "This suggestion has already moved to another state.",
      );
    }

    const now = new Date();
    const applied = await database.transaction(async (transaction) => {
      const [updated] = await transaction
        .update(producerSuggestions)
        .set({
          status: parsed.data.decision,
          reviewerUserId: reviewer.id,
          decisionNote: parsed.data.note,
          reviewedAt: publishing ? (suggestion.reviewedAt ?? now) : now,
          appliedAt: publishing ? now : null,
          appliedCommitSha: publishing ? parsed.data.commitSha || null : null,
          lockVersion: sql`${producerSuggestions.lockVersion} + 1`,
          updatedAt: now,
        })
        .where(
          and(
            eq(producerSuggestions.id, suggestion.id),
            eq(producerSuggestions.lockVersion, suggestion.lockVersion),
            eq(producerSuggestions.status, suggestion.status),
          ),
        )
        .returning({ id: producerSuggestions.id });
      if (!updated) return false;

      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: reviewer.id,
        action: `producer_suggestion.${parsed.data.decision}`,
        targetType: "producer_suggestion",
        targetId: updated.id,
        metadata: {
          country: suggestion.country,
          producerId: suggestion.producerId,
          section: suggestion.section,
          fields: Object.keys(suggestion.patch),
          ...(publishing && parsed.data.commitSha
            ? { commitSha: parsed.data.commitSha }
            : {}),
        },
      });
      return true;
    });

    if (!applied) {
      return adminRedirect(
        SUGGESTION_REVIEW_ROUTE,
        "error",
        "Another reviewer changed this suggestion. Reload the queue.",
      );
    }

    return adminRedirect(
      SUGGESTION_REVIEW_ROUTE,
      "notice",
      publishing
        ? "Suggestion recorded as published."
        : parsed.data.decision === "approved"
          ? "Suggestion accepted. Publish it through the editorial workflow."
          : "Suggestion rejected.",
    );
  };
}
