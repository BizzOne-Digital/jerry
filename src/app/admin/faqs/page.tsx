import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ListRowActions } from "@/components/admin/list-row-actions";
import FAQ from "@/models/FAQ";

export default async function AdminFaqsPage() {
  await requireAdmin();
  await connectDB();
  const items = await FAQ.find().sort({ category: 1, sortOrder: 1 }).lean();

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on the site."
        actions={
          <Link href="/admin/faqs/new" className="admin-btn admin-btn-primary text-sm">
            Add FAQ
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item._id)}>
                <td className="max-w-md truncate">{item.question}</td>
                <td>{item.category}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  <ListRowActions
                    editHref={`/admin/faqs/${item._id}`}
                    deleteEndpoint={`/api/admin/faqs/${item._id}`}
                    itemLabel="FAQ"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No FAQs yet.</p>
        )}
      </div>
    </div>
  );
}
