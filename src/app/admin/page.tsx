import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth/auth";
import { PageHeader } from "@/components/admin/page-header";
import Product from "@/models/Product";
import Service from "@/models/Service";
import Order from "@/models/Order";
import ContactMessage from "@/models/ContactMessage";
import CustomerQuestionnaire from "@/models/CustomerQuestionnaire";
import BlogPost from "@/models/BlogPost";
import Offer from "@/models/Offer";

export default async function AdminDashboardPage() {
  await requireAdmin();
  await connectDB();

  const [
    productCount,
    serviceCount,
    orderCount,
    unreadMessages,
    newQuestionnaires,
    draftBlogs,
    activeOffers,
    recentOrders,
    pendingOrders,
  ] = await Promise.all([
    Product.countDocuments(),
    Service.countDocuments(),
    Order.countDocuments(),
    ContactMessage.countDocuments({ status: "unread" }),
    CustomerQuestionnaire.countDocuments({ status: "submitted" }),
    BlogPost.countDocuments({ status: "draft" }),
    Offer.countDocuments({ status: "published" }),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    Order.countDocuments({ orderStatus: { $in: ["pending", "awaiting_payment"] } }),
  ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Services", value: serviceCount, href: "/admin/services" },
    { label: "Orders", value: orderCount, href: "/admin/orders" },
    { label: "Unread Messages", value: unreadMessages, href: "/admin/messages" },
    { label: "New Questionnaires", value: newQuestionnaires, href: "/admin/questionnaires" },
    { label: "Draft Blogs", value: draftBlogs, href: "/admin/blogs" },
    { label: "Active Offers", value: activeOffers, href: "/admin/offers" },
    { label: "Pending Orders", value: pendingOrders, href: "/admin/orders" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your store" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="admin-card block p-5 transition hover:border-[var(--admin-accent)]"
          >
            <p className="text-sm text-[var(--admin-muted)]">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-[var(--admin-accent)]">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="border-b border-[var(--admin-border)] px-4 py-3">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-4 text-sm text-[var(--admin-muted)]">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={String(order._id)}>
                  <td>
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-[var(--admin-accent)] hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td>{order.customer?.email ?? "—"}</td>
                  <td>${order.total?.toFixed(2)}</td>
                  <td>{order.orderStatus}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
