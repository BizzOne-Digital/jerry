import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import Page from "@/models/Page";

export default async function AdminPagesListPage() {
  await requireAdmin();
  await connectDB();
  const pages = await Page.find().sort({ key: 1 }).lean();

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Edit homepage, about, services, shop, contact, and FAQ page content section by section."
      />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.key}>
                <td className="font-mono text-sm">{page.key}</td>
                <td>{page.title}</td>
                <td>
                  <StatusBadge status={page.status} />
                </td>
                <td className="text-[var(--admin-muted)]">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </td>
                <td>
                  <Link
                    href={`/admin/pages/${page.key}`}
                    className="text-sm text-[var(--admin-accent)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 && (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No pages found. Run seed script.</p>
        )}
      </div>
    </div>
  );
}
