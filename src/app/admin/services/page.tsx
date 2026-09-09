import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ListRowActions } from "@/components/admin/list-row-actions";
import Service from "@/models/Service";

export default async function AdminServicesPage() {
  await requireAdmin();
  await connectDB();
  const services = await Service.find().sort({ sortOrder: 1, title: 1 }).lean();

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage service offerings, descriptions, and card images."
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
              <th>Image</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const imageUrl = service.cardImage?.url;
              return (
                <tr key={String(service._id)}>
                  <td>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--admin-border)] text-[10px] text-[var(--admin-muted)]">
                        —
                      </div>
                    )}
                  </td>
                  <td>{service.title}</td>
                  <td className="font-mono text-sm text-[var(--admin-muted)]">{service.slug}</td>
                  <td>
                    <StatusBadge status={service.status} />
                  </td>
                  <td>{service.sortOrder}</td>
                  <td>
                    <ListRowActions
                      editHref={`/admin/services/${service._id}`}
                      deleteEndpoint={`/api/admin/services/${service._id}`}
                      itemLabel="service"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {services.length === 0 && (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No services yet. Add your first service.</p>
        )}
      </div>
    </div>
  );
}
