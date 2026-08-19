import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import Service from "@/models/Service";

export default async function AdminServicesPage() {
  await requireAdmin();
  await connectDB();
  const services = await Service.find().sort({ sortOrder: 1, title: 1 }).lean();

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage service offerings"
        actions={
          <Link href="/admin/services/new" className="admin-btn admin-btn-primary text-sm">
            Add Service
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={String(service._id)}>
                <td>{service.title}</td>
                <td className="font-mono text-sm text-[var(--admin-muted)]">{service.slug}</td>
                <td>
                  <StatusBadge status={service.status} />
                </td>
                <td>{service.sortOrder}</td>
                <td>
                  <Link
                    href={`/admin/services/${service._id}`}
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
