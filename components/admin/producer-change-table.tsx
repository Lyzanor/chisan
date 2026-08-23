import Link from "next/link";

import { ProducerChangeStatusBadge } from "@/components/admin/producer-change-status";
import { getProducerChangeStatusDefinition } from "@/lib/accounts/producer-change-workflow";
import { PRODUCER_EDITABLE_FIELDS } from "@/lib/accounts/producer-fields";
import type { AdminProducerChangeListItem } from "@/lib/admin/producer-change-requests";

const FIELD_LABELS = new Map<string, string>(
  PRODUCER_EDITABLE_FIELDS.map(({ key, label }) => [key, label]),
);

const ADMIN_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function formatAdminDate(value: Date | null): string {
  return value ? `${ADMIN_DATE_FORMAT.format(value)} UTC` : "Not recorded";
}

function actorLabel(actor: { id: string; displayName: string | null }): string {
  return actor.displayName || actor.id;
}

export function ProducerChangeTable({ items }: { items: AdminProducerChangeListItem[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Status</th>
            <th scope="col">Requested fields</th>
            <th scope="col">Requested by</th>
            <th scope="col">Updated</th>
            <th scope="col">Next step</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const status = getProducerChangeStatusDefinition(item.change.status);
            return (
              <tr
                key={item.change.id}
                data-change-id={item.change.id}
                data-change-status={item.change.status}
              >
                <td>
                  <Link
                    href={`/admin/cambios/${item.change.id}`}
                    className="admin-table__primary-link"
                  >
                    {item.producerName}
                  </Link>
                  <span className="admin-table__secondary">
                    {item.change.country.toUpperCase()} · #{item.change.producerId}
                  </span>
                  <code className="admin-request-id">{item.change.id}</code>
                </td>
                <td>
                  <ProducerChangeStatusBadge status={item.change.status} />
                </td>
                <td>
                  <ul className="admin-field-tags" aria-label="Requested fields">
                    {item.changedFields.map((field) => (
                      <li key={field}>{FIELD_LABELS.get(field) ?? field}</li>
                    ))}
                  </ul>
                </td>
                <td>{actorLabel(item.author)}</td>
                <td>
                  <time dateTime={item.change.updatedAt.toISOString()}>
                    {formatAdminDate(item.change.updatedAt)}
                  </time>
                </td>
                <td className="admin-table__next-action">{status.nextAction}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
