import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import Offer from "@/models/Offer";

export default async function AdminOffersPage() {
  await requireAdmin();
  await connectDB();
  const offers = await Offer.find().sort({ sortOrder: 1, name: 1 }).lean();

  return (
    <div>
      <PageHeader
        title="Pricing / Offers"
        description="Manage pricing packages and offers"
        actions={
          <Link href="/admin/offers/new" className="admin-btn admin-btn-primary text-sm">
            Add Offer
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={String(offer._id)}>
                <td>{offer.name}</td>
                <td>${offer.price?.toFixed(2)}</td>
                <td>
                  <StatusBadge status={offer.availability} />
                </td>
                <td>
                  <StatusBadge status={offer.status} />
                </td>
                <td>
                  <Link
                    href={`/admin/offers/${offer._id}`}
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
