import {
  getProducerChangeStatusDefinition,
  type ProducerChangeStatus,
} from "@/lib/accounts/producer-change-workflow";

export function ProducerChangeStatusBadge({
  status,
  verbose = false,
}: {
  status: ProducerChangeStatus;
  verbose?: boolean;
}) {
  const definition = getProducerChangeStatusDefinition(status);
  return (
    <span
      className={`admin-status admin-status--${definition.tone}`}
      data-change-status={status}
      title={verbose ? undefined : definition.label}
    >
      <span className="admin-status__dot" aria-hidden="true" />
      {verbose ? definition.label : definition.shortLabel}
    </span>
  );
}
