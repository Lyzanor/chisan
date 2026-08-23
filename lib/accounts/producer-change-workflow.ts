import type { ProducerChangeRequest } from "@/lib/db/schema";

export type ProducerChangeStatus = ProducerChangeRequest["status"];

export type ProducerChangePhase =
  | "draft"
  | "review"
  | "csv_ready"
  | "csv_in_progress"
  | "canonical"
  | "attention"
  | "closed";

export type ProducerChangeTone = "neutral" | "warning" | "positive" | "active" | "danger";

export type ProducerChangeStatusDefinition = {
  label: string;
  shortLabel: string;
  phase: ProducerChangePhase;
  tone: ProducerChangeTone;
  description: string;
  nextAction: string;
  requiresOperatorAction: boolean;
};

export const PRODUCER_CHANGE_STATUSES = [
  "draft",
  "submitted",
  "needs_changes",
  "approved",
  "applying",
  "applied",
  "rejected",
  "withdrawn",
  "conflict",
  "failed",
] as const satisfies readonly ProducerChangeStatus[];

export const PRODUCER_CHANGE_STATUS_DEFINITIONS = {
  draft: {
    label: "Draft",
    shortLabel: "Draft",
    phase: "draft",
    tone: "neutral",
    description: "The owner has not submitted this proposal for editorial review.",
    nextAction: "Wait for the owner to submit the proposal.",
    requiresOperatorAction: false,
  },
  submitted: {
    label: "Awaiting editorial review",
    shortLabel: "Needs review",
    phase: "review",
    tone: "warning",
    description: "The proposal is ready for an editorial decision.",
    nextAction: "Review the evidence and approve or reject the requested fields.",
    requiresOperatorAction: true,
  },
  needs_changes: {
    label: "Needs a corrected proposal",
    shortLabel: "Needs changes",
    phase: "review",
    tone: "warning",
    description: "This reserved state requires a replacement proposal in the current workflow.",
    nextAction: "Ask the owner to withdraw this request and submit a corrected proposal.",
    requiresOperatorAction: true,
  },
  approved: {
    label: "Approved for CSV materialization",
    shortLabel: "Ready for CSV",
    phase: "csv_ready",
    tone: "positive",
    description: "Editorial review is complete, but the canonical CSV has not been changed.",
    nextAction: "Materialize the approved patch in a local Git worktree.",
    requiresOperatorAction: true,
  },
  applying: {
    label: "CSV materialized; commit pending",
    shortLabel: "In CSV workflow",
    phase: "csv_in_progress",
    tone: "active",
    description: "The local CSV workflow started and still needs a validated commit and finalization.",
    nextAction: "Review and commit the CSV diff, then finalize with the commit SHA.",
    requiresOperatorAction: true,
  },
  applied: {
    label: "Committed to the canonical CSV",
    shortLabel: "Applied",
    phase: "canonical",
    tone: "positive",
    description: "The request is bound to a Git commit containing the canonical CSV state.",
    nextAction: "Confirm that the commit has been pushed and deployed when operationally required.",
    requiresOperatorAction: false,
  },
  rejected: {
    label: "Rejected",
    shortLabel: "Rejected",
    phase: "closed",
    tone: "neutral",
    description: "Editorial review closed the request without changing the catalog.",
    nextAction: "No action. The owner may submit a new proposal.",
    requiresOperatorAction: false,
  },
  withdrawn: {
    label: "Withdrawn by owner",
    shortLabel: "Withdrawn",
    phase: "closed",
    tone: "neutral",
    description: "The owner closed the request before publication.",
    nextAction: "No action. The owner may submit a new proposal.",
    requiresOperatorAction: false,
  },
  conflict: {
    label: "Catalog conflict",
    shortLabel: "Conflict",
    phase: "attention",
    tone: "danger",
    description: "The approved base no longer matches the catalog or producer access changed.",
    nextAction: "Inspect the failure reason and request a fresh proposal when appropriate.",
    requiresOperatorAction: true,
  },
  failed: {
    label: "Materialization failed",
    shortLabel: "Failed",
    phase: "attention",
    tone: "danger",
    description: "The CSV workflow stopped before a canonical commit was recorded.",
    nextAction: "Inspect the failure reason and recover or replace the proposal.",
    requiresOperatorAction: true,
  },
} as const satisfies Record<ProducerChangeStatus, ProducerChangeStatusDefinition>;

export type ProducerChangeView =
  | "all"
  | "review"
  | "csv"
  | "attention"
  | "applied"
  | "closed"
  | "drafts";

export type ProducerChangeViewDefinition = {
  label: string;
  statuses: readonly ProducerChangeStatus[];
};

export const PRODUCER_CHANGE_VIEWS = {
  all: { label: "All requests", statuses: PRODUCER_CHANGE_STATUSES },
  review: { label: "Needs review", statuses: ["submitted", "needs_changes"] },
  csv: { label: "CSV workflow", statuses: ["approved", "applying"] },
  attention: { label: "Needs attention", statuses: ["conflict", "failed"] },
  applied: { label: "Applied", statuses: ["applied"] },
  closed: { label: "Closed", statuses: ["rejected", "withdrawn"] },
  drafts: { label: "Drafts", statuses: ["draft"] },
} as const satisfies Record<ProducerChangeView, ProducerChangeViewDefinition>;

export type ProducerChangeStatusSelection = {
  key: ProducerChangeView | ProducerChangeStatus;
  label: string;
  statuses: readonly ProducerChangeStatus[];
  kind: "view" | "status";
};

export function isProducerChangeStatus(value: string): value is ProducerChangeStatus {
  return (PRODUCER_CHANGE_STATUSES as readonly string[]).includes(value);
}

export function isProducerChangeView(value: string): value is ProducerChangeView {
  return Object.hasOwn(PRODUCER_CHANGE_VIEWS, value);
}

export function resolveProducerChangeStatusSelection(
  value: string | null | undefined,
): ProducerChangeStatusSelection {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (isProducerChangeStatus(normalized)) {
    return {
      key: normalized,
      label: PRODUCER_CHANGE_STATUS_DEFINITIONS[normalized].label,
      statuses: [normalized],
      kind: "status",
    };
  }
  const view = isProducerChangeView(normalized) ? normalized : "all";
  return {
    key: view,
    label: PRODUCER_CHANGE_VIEWS[view].label,
    statuses: PRODUCER_CHANGE_VIEWS[view].statuses,
    kind: "view",
  };
}

export function getProducerChangeStatusDefinition(
  status: ProducerChangeStatus,
): ProducerChangeStatusDefinition {
  return PRODUCER_CHANGE_STATUS_DEFINITIONS[status];
}

export function isReviewableProducerChange(status: ProducerChangeStatus): boolean {
  return status === "submitted" || status === "needs_changes";
}

export function canMaterializeProducerChange(status: ProducerChangeStatus): boolean {
  return status === "approved" || status === "applying";
}

export function requestedProducerFields(
  change: Pick<ProducerChangeRequest, "baseSnapshot" | "patch">,
): Record<string, string> {
  return { ...change.baseSnapshot, ...change.patch };
}
