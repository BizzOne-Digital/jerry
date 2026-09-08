import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import CustomerQuestionnaire from "@/models/CustomerQuestionnaire";

export default async function AdminQuestionnairesPage() {
  await requireAdmin();
  await connectDB();
  const questionnaires = await CustomerQuestionnaire.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div>
      <PageHeader title="Questionnaires" description="Customer collector profiles and preferences" />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Interests</th>
              <th>Order</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {questionnaires.map((entry) => (
              <tr key={String(entry._id)}>
                <td>
                  <div>{entry.name}</div>
                  <div className="text-xs text-[var(--admin-muted)]">{entry.email}</div>
                </td>
                <td className="text-sm">
                  {(entry.favoriteSports ?? []).slice(0, 2).join(", ")}
                  {(entry.favoriteSports?.length ?? 0) > 2 ? "…" : ""}
                </td>
                <td className="font-mono text-sm">{entry.orderNumber ?? "—"}</td>
                <td>
                  <StatusBadge status={entry.status} />
                </td>
                <td className="text-[var(--admin-muted)]">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Link
                    href={`/admin/questionnaires/${entry._id}`}
                    className="text-sm text-[var(--admin-accent)] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {questionnaires.length === 0 && (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No questionnaires yet.</p>
        )}
      </div>
    </div>
  );
}
