import { CONTENT_STATUS } from "@/types";

const STATUS_CLASS: Record<string, string> = {
  published: "admin-badge-published",
  active: "admin-badge-published",
  draft: "admin-badge-draft",
  archived: "admin-badge-archived",
  unread: "admin-badge-unread",
  read: "admin-badge-draft",
  replied: "admin-badge-published",
  pending: "admin-badge-unread",
  awaiting_payment: "admin-badge-unread",
  paid: "admin-badge-published",
  processing: "admin-badge-unread",
  shipped: "admin-badge-published",
  completed: "admin-badge-published",
  cancelled: "admin-badge-archived",
  refunded: "admin-badge-archived",
  available: "admin-badge-published",
  limited: "admin-badge-unread",
  sold_out: "admin-badge-archived",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_CLASS[status] ?? "admin-badge-draft";
  const label = status.replace(/_/g, " ");
  return <span className={`admin-badge ${cls}`}>{label}</span>;
}

export function isContentStatus(value: string): value is (typeof CONTENT_STATUS)[number] {
  return (CONTENT_STATUS as readonly string[]).includes(value);
}
