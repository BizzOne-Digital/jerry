import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import Order from "@/models/Order";

export default async function AdminOrdersPage() {
  await requireAdmin();
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div>
      <PageHeader title="Orders" description="View and manage customer orders" />

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={String(order._id)}>
                <td className="font-mono text-sm">{order.orderNumber}</td>
                <td>{order.customer?.email ?? "—"}</td>
                <td>${order.total?.toFixed(2)}</td>
                <td>
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td>
                  <StatusBadge status={order.orderStatus} />
                </td>
                <td className="text-[var(--admin-muted)]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="text-sm text-[var(--admin-accent)] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
