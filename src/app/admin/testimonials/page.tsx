import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import Testimonial from "@/models/Testimonial";

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  await connectDB();
  const items = await Testimonial.find().sort({ sortOrder: 1, createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Manage customer testimonials"
        actions={
          <Link href="/admin/testimonials/new" className="admin-btn admin-btn-primary text-sm">
            Add Testimonial
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Rating</th>
              <th>Featured</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item._id)}>
                <td>{item.customerName}</td>
                <td>{item.rating ? `${item.rating}/5` : "—"}</td>
                <td>{item.featured ? "Yes" : "No"}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  <Link
                    href={`/admin/testimonials/${item._id}`}
                    className="text-sm text-[var(--admin-accent)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
