import type { ProducerSuggestionSection } from "@/lib/accounts/producer-suggestion-sections";
import type { ProducerSuggestion } from "@/lib/db/schema";

export const SUGGESTION_ROUTE = "/cuenta/sugerencias";

export function newProducerSuggestionPath(
  country: string,
  producerId: number,
  section?: ProducerSuggestionSection,
): string {
  const query = new URLSearchParams({
    country,
    producerId: String(producerId),
  });
  if (section) query.set("seccion", section);
  return `${SUGGESTION_ROUTE}/nueva?${query.toString()}`;
}

export type ProducerSuggestionStatus = ProducerSuggestion["status"];

export type ProducerSuggestionTone =
  | "neutral"
  | "warning"
  | "positive"
  | "danger";

export type ProducerSuggestionStatusDefinition = {
  /** English, for the operations workspace. */
  label: string;
  /** Spanish, for the account area. */
  accountLabel: string;
  tone: ProducerSuggestionTone;
  description: string;
  nextAction: string;
  requiresOperatorAction: boolean;
};

export const PRODUCER_SUGGESTION_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
  "applied",
] as const satisfies readonly ProducerSuggestionStatus[];

export const PRODUCER_SUGGESTION_STATUS_DEFINITIONS = {
  pending: {
    label: "Awaiting editorial review",
    accountLabel: "Pendiente de revisión",
    tone: "warning",
    description: "A reader reported a correction that nobody has assessed yet.",
    nextAction:
      "Check the claim against public evidence, then accept or reject it.",
    requiresOperatorAction: true,
  },
  approved: {
    label: "Accepted; awaiting publication",
    accountLabel: "Aceptada",
    tone: "positive",
    description:
      "Editorial review accepted the correction. The catalog still has to be edited through the normal Git workflow.",
    nextAction:
      "Publish the correction with the editorial workflow, then record the commit here.",
    requiresOperatorAction: true,
  },
  rejected: {
    label: "Rejected",
    accountLabel: "Rechazada",
    tone: "neutral",
    description: "Review closed the suggestion without changing the catalog.",
    nextAction: "No action. The reader may send a new suggestion with evidence.",
    requiresOperatorAction: false,
  },
  withdrawn: {
    label: "Withdrawn by its author",
    accountLabel: "Retirada",
    tone: "neutral",
    description: "The reader closed the suggestion before it was reviewed.",
    nextAction: "No action.",
    requiresOperatorAction: false,
  },
  applied: {
    label: "Incorporated into the catalog",
    accountLabel: "Publicada",
    tone: "positive",
    description:
      "The accepted correction is present in the published catalog rows.",
    nextAction: "No action.",
    requiresOperatorAction: false,
  },
} as const satisfies Record<
  ProducerSuggestionStatus,
  ProducerSuggestionStatusDefinition
>;

/**
 * A suggestion stays open until the catalog actually carries it: an accepted
 * one is still waiting for its editorial Git edit. The per-account quota, the
 * public producer button, the account dashboard and the partial unique index
 * in `producer_suggestions` all read these two states.
 */
export const OPEN_PRODUCER_SUGGESTION_STATUSES = [
  "pending",
  "approved",
] as const satisfies readonly ProducerSuggestionStatus[];

export type ProducerSuggestionView =
  | "all"
  | "review"
  | "publication"
  | "applied"
  | "closed";

export type ProducerSuggestionViewDefinition = {
  label: string;
  statuses: readonly ProducerSuggestionStatus[];
};

export const PRODUCER_SUGGESTION_VIEWS = {
  all: { label: "All suggestions", statuses: PRODUCER_SUGGESTION_STATUSES },
  review: { label: "Needs review", statuses: ["pending"] },
  publication: { label: "Accepted", statuses: ["approved"] },
  applied: { label: "Published", statuses: ["applied"] },
  closed: { label: "Closed", statuses: ["rejected", "withdrawn"] },
} as const satisfies Record<
  ProducerSuggestionView,
  ProducerSuggestionViewDefinition
>;

export type ProducerSuggestionStatusSelection = {
  key: ProducerSuggestionView | ProducerSuggestionStatus;
  label: string;
  statuses: readonly ProducerSuggestionStatus[];
  kind: "view" | "status";
};

export function isProducerSuggestionStatus(
  value: string,
): value is ProducerSuggestionStatus {
  return (PRODUCER_SUGGESTION_STATUSES as readonly string[]).includes(value);
}

export function isProducerSuggestionView(
  value: string,
): value is ProducerSuggestionView {
  return Object.hasOwn(PRODUCER_SUGGESTION_VIEWS, value);
}

export function resolveProducerSuggestionStatusSelection(
  value: string | null | undefined,
): ProducerSuggestionStatusSelection {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (isProducerSuggestionStatus(normalized)) {
    return {
      key: normalized,
      label: PRODUCER_SUGGESTION_STATUS_DEFINITIONS[normalized].label,
      statuses: [normalized],
      kind: "status",
    };
  }
  const view = isProducerSuggestionView(normalized) ? normalized : "all";
  return {
    key: view,
    label: PRODUCER_SUGGESTION_VIEWS[view].label,
    statuses: PRODUCER_SUGGESTION_VIEWS[view].statuses,
    kind: "view",
  };
}

export function getProducerSuggestionStatusDefinition(
  status: ProducerSuggestionStatus,
): ProducerSuggestionStatusDefinition {
  return PRODUCER_SUGGESTION_STATUS_DEFINITIONS[status];
}

export function isReviewableProducerSuggestion(
  status: ProducerSuggestionStatus,
): boolean {
  return status === "pending";
}

/** Only an accepted suggestion can be recorded as published. */
export function canPublishProducerSuggestion(
  status: ProducerSuggestionStatus,
): boolean {
  return status === "approved";
}
